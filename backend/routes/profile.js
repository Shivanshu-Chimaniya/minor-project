const express = require("express");
const passport = require("passport");
const {uploadResume} = require("../controller/profile");

const router = express.Router();

// Middleware for JWT authentication
const authenticate = passport.authenticate("jwt", {session: false});

/**
 * @route   POST /profile/upload-resume
 * @desc    Upload a resume for the user
 * @access  Private (Requires JWT authentication)
 */
router.post("/upload-resume", authenticate, uploadResume);

module.exports = router;
