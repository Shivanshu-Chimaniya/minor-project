const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	sendWelcomeEmail,
} = require("../utils/emailService");

/**
 * @route   POST /auth/register
 * @desc    Register a new user with email & password
 * @access  Public
 */
module.exports.registerUserWithEmail = async (req, res) => {
	try {
		const {fullName, email, password, role} = req.body;

		// Check if user already exists
		if (await User.exists({email})) {
			return res
				.status(400)
				.json({success: false, message: "Email already registered"});
		}

		// Hash password securely
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create email verification token
		const verificationToken = jwt.sign(
			{email},
			process.env.JWT_EMAIL_SECRET,
			{expiresIn: "24h"}
		);

		// Create new user
		const user = new User({
			username: email,
			name: fullName,
			email,
			password: hashedPassword,
			role,
		});

		await user.save();
		await sendVerificationEmail(email, verificationToken);

		// Generate authentication token
		const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_TIMEOUT,
		});

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isEmailVerified: user.isEmailVerified,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during registration",
		});
	}
};

/**
 * @route   POST /auth/login
 * @desc    Log in user with email & password
 * @access  Public
 */
module.exports.loginUserWithEmail = async (req, res) => {
	try {
		const {email, password} = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({success: false, message: "Email or password is empty"});
		}

		const user = await User.findOne({email});
		if (!user) {
			return res
				.status(400)
				.json({success: false, message: "User not found"});
		}

		if (!user.password) {
			return res.status(400).json({
				success: false,
				message: "Password not set. Please log in using Google",
			});
		}

		// Compare password
		if (!(await bcrypt.compare(password, user.password))) {
			return res
				.status(400)
				.json({success: false, message: "Invalid credentials"});
		}

		// Generate authentication token
		const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_TIMEOUT,
		});

		return res.status(200).json({
			success: true,
			message: "User logged in successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				isEmailVerified: user.isEmailVerified,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route   GET /auth/verify-email
 * @desc    Verify email address via token
 * @access  Public
 */
module.exports.verifyEmail = async (req, res) => {
	try {
		const {token} = req.query;
		const {email} = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

		// Find user and verify email
		const user = await User.findOneAndUpdate(
			{email},
			{isEmailVerified: true},
			{new: true}
		);
		if (!user) {
			return res
				.status(404)
				.json({success: false, message: "User not found"});
		}

		await sendWelcomeEmail(email, user.name);

		return res
			.status(200)
			.json({success: true, message: "Email verified successfully"});
	} catch (error) {
		console.error("Email verification error:", error);

		if (error.name === "TokenExpiredError") {
			return res
				.status(401)
				.json({success: false, message: "Verification link expired"});
		}

		return res
			.status(500)
			.json({success: false, message: "Error verifying email"});
	}
};

/**
 * @route   POST /auth/resend-verification
 * @desc    Resend email verification link
 * @access  Public
 */
module.exports.resendVerification = async (req, res) => {
	try {
		const {email} = req.body;

		const user = await User.findOne({email});
		if (!user) {
			return res
				.status(404)
				.json({success: false, message: "User not found"});
		}

		if (user.isEmailVerified) {
			return res
				.status(400)
				.json({success: false, message: "Email already verified"});
		}

		// Create and send new verification token
		const verificationToken = jwt.sign(
			{email},
			process.env.JWT_EMAIL_SECRET,
			{expiresIn: "24h"}
		);
		await sendVerificationEmail(email, verificationToken);

		return res
			.status(200)
			.json({success: true, message: "Verification email sent"});
	} catch (error) {
		console.error("Resend verification error:", error);
		return res.status(500).json({
			success: false,
			message: "Error sending verification email",
		});
	}
};

/**
 * @route   GET /auth/user-status
 * @desc    Get logged-in user details
 * @access  Private (Requires authentication)
 */
module.exports.checkUserStatus = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate("resumes")
			.select("-password");

		if (!user) {
			return res
				.status(404)
				.json({success: false, message: "User not found"});
		}

		return res.status(200).json({
			success: true,
			message: "User retrieved successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				isEmailVerified: user.isEmailVerified,
				profileImage: user.profileImage,
				resumes: user.resumes.map((resume) => ({
					name: resume.name,
					public_id: resume.public_id,
					id: resume._id,
					url: resume.url,
					filename: resume.filename,
				})),
			},
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};

/**
 * @route   GET /auth/profile
 * @desc    Get user profile (Protected route)
 * @access  Private (Requires JWT authentication)
 */
module.exports.getProfileData = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate("resumes")
			.populate("interviews")
			.select("-password");

		if (!user) {
			return res
				.status(404)
				.json({success: false, message: "User not found"});
		}

		return res.status(200).json({
			success: true,
			message: "User profile retrieved successfully",
			user,
		});
	} catch (error) {
		console.error("Error fetching profile:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error"});
	}
};
