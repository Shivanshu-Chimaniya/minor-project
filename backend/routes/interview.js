const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const {readFile} = require("fs/promises");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const textToSpeech = require("@google-cloud/text-to-speech");
const path = require("path");

const {GoogleGenerativeAI} = require("@google/generative-ai");
const fs = require("fs");
const util = require("util");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const {removeBeforeAndAfter} = require("../utils");
const {
	makeOverallFeedbackPrompt,
	makeAnwserFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
} = require("../prompts");

const router = express.Router();

router.post(
	"/getquestions",
	passport.authenticate("jwt", {session: false}),
	async (req, res) => {
		const {level, jobDescription} = req.body;
		if (
			typeof level == "undefined" ||
			typeof jobDescription == "undefined"
		) {
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
	}
);

router.post(
	"/uploadresume",
	passport.authenticate("jwt", {session: false}),
	upload.single("resume"),
	async (req, res) => {
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
	}
);
router.post(
	"/getanswerfeedback",
	passport.authenticate("jwt", {session: false}),
	async (req, res) => {
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
	}
);
router.post(
	"/getoverallresult",
	passport.authenticate("jwt", {session: false}),
	async (req, res) => {
		const {questions, answers} = req.body;
		if (typeof questions == "undefined" || typeof answers == "undefined") {
			res.status(400).send(JSON.stringify("Wrong Input"));
			return null;
		}

		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		const prompt = makeOverallFeedbackPrompt({questions, answers});

		const result = await model.generateContent(prompt);
		const resultText = result.response.text();

		const overallResult = removeBeforeAndAfter(resultText);

		res.send(JSON.stringify(overallResult));
	}
);

router.post(
	"/getaudio",
	passport.authenticate("jwt", {session: false}),
	async (req, res) => {
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

			// Set response headers for audio file
			res.set({
				"Content-Type": "audio/mpeg",
				"Content-Disposition": 'attachment; filename="output.mp3"',
			});

			// Send the audio data as a buffer
			res.send(Buffer.from(response.audioContent, "binary"));
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({error: "Something went wrong!"});
		}
	}
);

module.exports = router;
