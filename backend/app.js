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

const {
	makeOverallFeedbackPrompt,
	makeAnwserFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
} = require("./prompts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// MongoDB Connection
// const MONGODB_URI =
// 	process.env.MONGODB_URI || "mongodb://localhost:27017/interviewprep";
// mongoose
// 	.connect(MONGODB_URI)
// 	.then(() => console.log("Connected to MongoDB"))
// 	.catch((err) => console.error("MongoDB connection error:", err));

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
		const prompt = makeQuestionPrompt({level, jobDescription});

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
		const prompt = makeResumePrompt({jobDescription, reducedText});

		const result = await model.generateContent(prompt);
		const resultText = result.response.text();
		const resumeResult = removeBeforeAndAfter(resultText);

		res.send(JSON.stringify(resumeResult));
	} catch (error) {
		console.error("Error processing file:", error);
		res.status(500).json({error: "Internal server error"});
	}
});
app.post("/getanswerfeedback", async (req, res) => {
	const {question, answer} = req.body;
	if (typeof question == "undefined" || typeof answer == "undefined") {
		res.status(400).send(JSON.stringify("Wrong Input"));
	}

	const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
	const prompt = makeAnwserFeedbackPrompt({question, answer});

	const result = await model.generateContent(prompt);
	const resultText = result.response.text();

	const feedback = removeBeforeAndAfter(resultText);
	res.send(JSON.stringify(feedback));
});
app.post("/getoverallresult", async (req, res) => {
	const {questions, answers} = req.body;
	if (typeof questions == "undefined" || typeof answers == "undefined") {
		res.status(400).send(JSON.stringify("Wrong Input"));
		return null;
	}

	console.log(questions);
	console.log(answers);

	const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
	const prompt = makeOverallFeedbackPrompt({questions, answers});

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
			keyFilename: "./mygooglekey.json",
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
