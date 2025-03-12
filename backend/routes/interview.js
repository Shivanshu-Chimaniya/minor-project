const express = require("express");
const passport = require("passport");

const {
	getQuestions,
	getResumeResult,
	getAnswerFeedback,
	getOverallResult,
	getAudio,
} = require("../controller/interview");

const router = express.Router();

// Middleware for authentication
const authenticate = passport.authenticate("jwt", {session: false});

/**
 * @route   POST /interview/questions
 * @desc    Fetch interview questions based on user preferences
 * @access  Private (Requires JWT authentication)
 */
router.post("/questions", authenticate, getQuestions);

/**
 * @route   POST /interview/resume-result
 * @desc    Analyze and return resume-based interview results
 * @access  Private (Requires JWT authentication)
 */
router.post("/resume-result", authenticate, getResumeResult);

/**
 * @route   POST /interview/answer-feedback
 * @desc    Get AI-generated feedback on user answers
 * @access  Private (Requires JWT authentication)
 */
router.post("/answer-feedback", authenticate, getAnswerFeedback);

/**
 * @route   POST /interview/overall-result
 * @desc    Calculate the overall interview performance score
 * @access  Private (Requires JWT authentication)
 */
router.post("/overall-result", authenticate, getOverallResult);

/**
 * @route   POST /interview/audio
 * @desc    Retrieve audio feedback for the interview
 * @access  Private (Requires JWT authentication)
 */
router.post("/audio", authenticate, getAudio);

module.exports = router;
