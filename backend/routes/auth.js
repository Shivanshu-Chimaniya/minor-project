const express = require("express");
const passport = require("passport");
const User = require("../models/User");
require("../config/passport")(passport);

const {
	registerUserWithEmail,
	verifyEmail,
	loginUserWithEmail,
	checkUserStatus,
	getProfileData,
} = require("../controller/userController");

const {LoginOrSignupWithGoogle} = require("../controller/googleAuth");

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user with email & password
 * @access  Public
 */
router.post("/register", registerUserWithEmail);

/**
 * @route   POST /auth/login
 * @desc    Login user with email & password
 * @access  Public
 */
router.post("/login", loginUserWithEmail);

/**
 * @route   GET /auth/login
 * @desc    Check if user is logged in & get status
 * @access  Private (Requires JWT authentication)
 */
router.get(
	"/login",
	passport.authenticate("jwt", {session: false}),
	checkUserStatus
);

/**
 * @route   GET /auth/google
 * @desc    Login or Signup with Google OAuth
 * @access  Public
 */
router.get("/google", LoginOrSignupWithGoogle);

/**
 * @route   GET /auth/verify-email
 * @desc    Verify user email via token
 * @access  Public
 */
router.get("/verify-email", verifyEmail);

/**
 * @route   GET /auth/profile
 * @desc    Get user profile (Protected route)
 * @access  Private (Requires JWT authentication)
 */
router.get(
	"/profile",
	passport.authenticate("jwt", {session: false}),
	getProfileData
);

module.exports = router;
