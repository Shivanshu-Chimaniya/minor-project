const express = require("express");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const mongoose = require("mongoose");
const multer = require("multer");
const {readFile} = require("fs/promises");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");
const cors = require("cors");
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const {removeBeforeAndAfter} = require("./utils");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// MongoDB Connection
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/interviewprep";
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
	res.json({message: "Welcome to InterviewPrep AI API"});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({message: "Something went wrong!"});
});

app.post("/getquestions", async (req, res) => {
	const {level, jobDescription} = req.body;
	if (typeof level == "undefined" || typeof jobDescription == "undefined") {
		res.status(400).send(JSON.stringify("Wrong Input"));
	}
	try {
		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		const prompt = `Generate 3-5 structured verbal interview questions for a ${level} role based on the following job description:
		${jobDescription}
		Ensure the questions focus primarily on coding topics that can be answered verbally, covering problem-solving, algorithms, data structures, system design, and coding best practices. Include a mix of theoretical and practical coding scenarios.
		Output the questions in JSON format as follows:
		{
			"questions": [
				"Question 1",
				"Question 2",
				"Question 3",
				"Question 4",
				"Question 5"
				]
				}`;

		const result = await model.generateContent(prompt);
		const resultText = result.response.text();

		const questions = removeBeforeAndAfter(resultText);
		res.send(JSON.stringify(questions));
	} catch (e) {
		res.status(500).send("Error in fetching");
	}
});

app.post("/uploadresume", upload.single("resume"), async (req, res) => {
	const {jobDescription} = req.body;
	try {
		if (!req.file) {
			return res.status(400).json({error: "No file uploaded"});
		}

		const fileBuffer = req.file.buffer;
		const fileExt = path.extname(req.file.originalname).toLowerCase();
		let extractedText = "";

		if (fileExt === ".pdf") {
			const data = await pdfParse(fileBuffer);
			extractedText = data.text;
		} else if (fileExt === ".docx") {
			const data = await mammoth.extractRawText({buffer: fileBuffer});
			extractedText = data.value;
		} else if (fileExt === ".doc") {
			return res.status(400).json({
				error: ".doc files are not supported, please convert to .docx or .pdf",
			});
		} else {
			return res.status(400).json({error: "Unsupported file format"});
		}
		const reducedText = extractedText.replace(/\s+/g, " ").trim();

		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		const prompt = `You are an AI hiring assistant. Evaluate a candidate's resume against a job description and return a structured JSON response.
						Scoring Criteria (Total: 100 points)
							Skills Match (30 pts): Relevant skills from the job description.
							Experience Relevance (25 pts): Relevant work history.
							Education & Certifications (15 pts): Meets qualification criteria.
							Achievements & Impact (15 pts): Measurable results.
							Resume Quality (15 pts): Clarity and professionalism.
						Output Format (JSON):
							{
							"score": XX,
							"strengths": ["...", "...", "..."],
							"weaknesses": ["...", "...", "..."],
							"suggestions": ["...", "...", "..."]
							}
						Input Variables:
							job_description: "${jobDescription}"
							resume_text: "${reducedText}"
						Now, analyze the provided resume and return a JSON response.`;

		const result = await model.generateContent(prompt);
		const resultText = result.response.text();
		const resumeResult = removeBeforeAndAfter(resultText);

		res.send(JSON.stringify(resumeResult));
	} catch (error) {
		console.error("Error processing file:", error);
		res.status(500).json({error: "Internal server error"});
	}
});
app.post("/getoverallresult", async (req, res) => {
	const {questions, answers} = req.body;
	if (typeof questions == "undefined" || typeof answers == "undefined") {
		res.status(400).send(JSON.stringify("Wrong Input"));
	}

	const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
	const prompt = `I am evaluating my interview performance based questions and answers. Please keep a positive tone in your response, show some grace when providing scores, and assign a score out of ten for each answer. Include a potential perfect answer for comparison, but remember that the answers are given by humans.
					Empty string means no answer is provided and it is intorelable.
					Questions:
					${questions}

					Candidate's Answers:
					${answers}

					Evaluation Criteria:

					Point out mistakes directly without explaining or justifying them.
					If there are no mistakes, highlight something good about the answer.
					Show grace when giving scores, but make sure they reflect the quality of the answer.
					Provide a potential perfect answer for each question.
					Keep the feedback brief and to the point.
					Do not generate unnecessary information or make up details.
					Identify key strengths based on the candidate's performance.
					List specific weaknesses that need improvement.
					Provide a final verdict concisely.

					Response Format (JSON Output):
					{
					"evaluation": {
						"feedback": {
						"question_1": {
							"score": X.X,
							"feedback": "Brief feedback pointing out mistakes or appreciation.",
							"perfect_answer": "The potential perfect answer."
						},
						"question_2": {
							"score": X.X,
							"feedback": "Brief feedback pointing out mistakes or appreciation.",
							"perfect_answer": "The potential perfect answer."
						},
						"...": "Feedback for all provided questions."
						},
						"strengths": ["List key strengths observed in responses."],
						"weaknesses": ["List specific areas where improvement is needed."],
						"overall_score": X.X,
						"final_verdict": "Concise summary of the candidate’s performance."
					}
					}`;

	const result = await model.generateContent(prompt);
	const resultText = result.response.text();

	const overallResult = removeBeforeAndAfter(resultText);
	res.send(JSON.stringify(overallResult));
});

app.post("/getaudio", async (req, res) => {
	try {
		const text = req.body.text;
		if (!text) {
			return res.status(400).json({error: "Text is required"});
		}
		const client = new textToSpeech.TextToSpeechClient({
			keyFilename: "./superb-garden-449619-k6-4e7b2da6acf6.json",
		});

		const request = {
			input: {text},
			voice: {languageCode: "en-US", name: "en-US-Wavenet-D"},
			audioConfig: {audioEncoding: "MP3"},
		};

		const [response] = await client.synthesizeSpeech(request);
		const fileName = `output.mp3`;
		await util.promisify(fs.writeFile)(
			fileName,
			response.audioContent,
			"binary"
		);

		res.sendFile(fileName, {root: __dirname}, (err) => {
			if (err) console.error("Error sending file:", err);
			fs.unlink(fileName, (err) => {
				if (err) console.error("Error deleting file:", err);
			}); // Delete after sending
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({error: "Something went wrong!"});
	}
});

// Port configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
