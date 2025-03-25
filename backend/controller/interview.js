const User = require("../models/User");
const Resume = require("../models/Resume");
const Interview = require("../models/Interview");
const textToSpeech = require("@google-cloud/text-to-speech");
const {getJsonFromGemini, getArrayFromGemini} = require("../utils/functions");
const {
	makeOverallFeedbackPrompt,
	makeAnwserFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
	makeVideoPrompt,
} = require("../utils/prompts");
const {extractText} = require("../utils/extractText");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {GoogleAIFileManager} = require("@google/generative-ai/server");
const {extractJsonString} = require("../utils/functions");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const fs = require("fs").promises;
const path = require("path");
const fetch = require("node-fetch");
/**
 * @route POST /interview/questions
 * @desc Generates interview questions based on job description and level
 * @access Private (User authentication required)
 */
module.exports.getQuestions = async (req, res) => {
	const {level, jobDescription, tags, features} = req.body;

	if (!level || !jobDescription) {
		return res.status(400).json({
			success: false,
			message: "Invalid input: Level and Job Description are required.",
		});
	}

	try {
		const user = await User.findById(req.user.id);
		if (!user)
			return res
				.status(404)
				.json({success: false, message: "User not found."});

		const prompt = makeQuestionPrompt({
			level,
			jobDescription,
			tags,
			features,
		});
		const questions = await getArrayFromGemini(prompt);

		const interview = new Interview({
			user: req.user.id,
			questions,
			jobDetails: {level, description: jobDescription},
			resume: null,
			resumeResult: {},
			answers: {},
			overallResult: {},
			feedbacks: {},
			isCompleted: false,
		});

		await interview.save();
		user.interviews.push(interview);
		await user.save();

		return res.status(201).json({
			success: true,
			message: "Interview created successfully",
			interview: {
				id: interview._id,
				questions: interview.questions,
			},
		});
	} catch (error) {
		console.error("Error fetching questions:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route POST /resume/result
 * @desc Processes resume, extracts text, and generates an AI evaluation
 * @access Private
 */
module.exports.getResumeResult = async (req, res) => {
	const {id, uploadResult, jobDescription, interviewId} = req.body;

	if (!jobDescription) {
		return res
			.status(400)
			.json({success: false, message: "Job Description is required."});
	}

	try {
		const interview = await Interview.findById(interviewId);
		if (!interview)
			return res
				.status(404)
				.json({success: false, message: "Interview not found."});
		if (interview.isCompleted)
			return res.status(400).json({
				success: false,
				message: "Interview already completed.",
			});

		let resume;
		if (id) {
			resume = await Resume.findById(id);
			if (!resume)
				return res
					.status(404)
					.json({success: false, message: "Resume not found."});
		} else {
			const extractedText = await extractText(
				uploadResult.url,
				uploadResult.id.split(".")[1]
			);
			resume = new Resume({
				filename: uploadResult.filename || "Untitled",
				url: uploadResult.url,
				public_id: uploadResult.id,
				extractedText,
			});
			await resume.save();

			const user = await User.findById(req.user.id);
			user.resumes.push(resume);
			await user.save();
		}

		interview.resume = resume;
		await interview.save();

		const prompt = makeResumePrompt({
			jobDescription,
			resumeText: resume.extractedText,
		});
		const resumeResult = await getJsonFromGemini(prompt);

		interview.resumeResult = resumeResult;
		await interview.save();

		return res.status(201).json({success: true, resumeResult});
	} catch (error) {
		console.error("Resume processing error:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route POST /interview/answer-feedback
 * @desc Provides AI feedback on an interview answer
 * @access Private
 */
module.exports.getAnswerFeedback = async (req, res) => {
	let {questionNumber, question, answer, interviewId} = req.body;

	if (
		(!questionNumber && questionNumber !== 0) ||
		!question ||
		answer == null ||
		typeof answer == "undefined" ||
		!interviewId
	) {
		return res.status(400).json({
			success: false,
			message:
				"All fields (questionNumber, question, answer, interviewId) are required.",
		});
	}

	try {
		const interview = await Interview.findById(interviewId);
		if (!interview)
			return res
				.status(404)
				.json({success: false, message: "Interview not found."});
		if (interview.isCompleted)
			return res.status(400).json({
				success: false,
				message: "Interview already completed.",
			});

		interview.answers[questionNumber] = answer;
		await interview.save();

		if (!answer.trim()) answer = "NO ANSWER WAS PROVIDED";

		const prompt = makeAnwserFeedbackPrompt({question, answer});
		const feedback = await getJsonFromGemini(prompt);

		interview.feedbacks[questionNumber] = feedback;
		await interview.save();

		return res.status(200).json({success: true, feedback});
	} catch (error) {
		console.error("Answer feedback error:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route POST /interview/overall-result
 * @desc Generates overall interview feedback
 * @access Private
 */
module.exports.getOverallResult = async (req, res) => {
	const {questions, answers, interviewId} = req.body;

	if (!questions || !answers || !interviewId) {
		return res.status(400).json({
			success: false,
			message:
				"All fields (questions, answers, interviewId) are required.",
		});
	}

	try {
		const interview = await Interview.findById(interviewId);
		if (!interview)
			return res
				.status(404)
				.json({success: false, message: "Interview not found."});
		if (interview.isCompleted)
			return res.status(400).json({
				success: false,
				message: "Interview already completed.",
			});

		const prompt = makeOverallFeedbackPrompt({questions, answers});
		const overallResult = await getJsonFromGemini(prompt);

		interview.overallResult = overallResult;
		interview.isCompleted = true;
		await interview.save();

		// const user = await User.findById(req.user.id);

		// let totalInterviews = user.interviewStats.totalInterviews+1;
		// let performanceScore = user.interviewStats.performanceScore * user.interviewStats.totalInterviews + interview.overallResult.;
		// let totalInterviews = user.interviewStats.totalInterviews+1;
		// let totalInterviews = user.interviewStats.totalInterviews+1;

		// interviewStats = {totalInterviews: user.interviewStats.totalInterviews+1 ,performanceScore: user.interviewStats.performanceScore * user.interviewStats.totalInterviews

		// 		// // Interview Statistics
		// 		// interviewStats: {
		// 		// 	totalInterviews: {
		// 		// 		type: Number,
		// 		// 		default: 0,
		// 		// 	},
		// 		// 	performanceScore: {
		// 		// 		type: Number,
		// 		// 		default: 0,
		// 		// 		min: 0,
		// 		// 		max: 100,
		// 		// 	},
		// 		// 	strengths: [
		// 		// 		{
		// 		// 			type: String,
		// 		// 		},
		// 		// 	],
		// 		// 	weaknesses: [
		// 		// 		{
		// 		// 			type: String,
		// 		// 		},
		// 		// 	],
		// 		// },

		return res.status(200).json({success: true, overallResult});
	} catch (error) {
		console.error("Overall result error:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route POST /resume/result
 * @desc Processes resume, extracts text, and generates an AI evaluation
 * @access Private
 */

module.exports.getVideoResult = async (req, res) => {
	const {uploadResult, interviewId} = req.body;

	if (!uploadResult || !uploadResult.mp4_url) {
		return res.status(400).json({
			success: false,
			message: "Invalid input: mp4_url is required in uploadResult.",
		});
	}

	let tempVideoPath = null;
	try {
		// Fetch video from URL
		const videoResponse = await fetch(uploadResult.mp4_url);
		if (!videoResponse.ok) {
			throw new Error(
				`Failed to fetch video: ${videoResponse.statusText}`
			);
		}

		// Read video data as a Buffer
		const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

		// Find interview
		const interview = await Interview.findById(interviewId);
		if (!interview) {
			return res.status(404).json({
				success: false,
				message: "Interview not found.",
			});
		}

		// Prepare Gemini analysis
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-pro",
		});

		const prompt = makeVideoPrompt();

		// Perform video analysis with correct Gemini API format
		const videoResult = await model.generateContent([
			{
				inlineData: {
					mimeType: "video/mp4",
					data: videoBuffer.toString("base64"),
				},
			},
			{text: prompt},
		]);

		// Save analysis result
		let responseText = videoResult.response.text();
		let jsonString = extractJsonString(responseText);
		interview.videoResult = jsonString
			? JSON.parse(jsonString)
			: responseText;
		interview.video = uploadResult;
		await interview.save();

		return res.status(201).json({
			success: true,
			videoResult: interview.videoResult,
		});
	} catch (error) {
		console.error("Video processing error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

/**
 * @route POST /audio
 * @desc Converts text to speech and returns MP3 file
 * @access Public
 */
module.exports.getAudio = async (req, res) => {
	try {
		const {text} = req.body;
		if (!text)
			return res
				.status(400)
				.json({success: false, message: "Text is required."});

		const client = new textToSpeech.TextToSpeechClient({
			keyFilename: "./myGoogleKey.json",
		});

		const request = {
			input: {text},
			voice: {languageCode: "en-US", name: "en-US-Wavenet-D"},
			audioConfig: {audioEncoding: "MP3"},
		};

		const [response] = await client.synthesizeSpeech(request);

		res.set({
			"Content-Type": "audio/mpeg",
			"Content-Disposition": 'attachment; filename="output.mp3"',
		});

		return res.send(Buffer.from(response.audioContent, "binary"));
	} catch (error) {
		console.error("Text-to-Speech error:", error);
		return res
			.status(500)
			.json({success: false, message: "Something went wrong!"});
	}
};
