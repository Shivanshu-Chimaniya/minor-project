const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("../config/passport")(passport);
const User = require("../models/User");
const {googleAuth} = require("../controller/googleAuth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
	try {
		const {username, email, password} = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({email});
		if (existingUser) {
			return res.status(400).json({message: "User already exists"});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create and save the new user
		const newUser = new User({username, email, password: hashedPassword});
		await newUser.save();

		// Generate JWT token
		const token = jwt.sign(
			{id: newUser._id, email: newUser.email},
			process.env.JWT_SECRET,
			{
				expiresIn: "24h", // Token expires in 7 days
			}
		);

		// Return token and user info
		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				id: newUser._id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({
			message: "Server error. Please try again later.",
		});
	}
});

// Login
router.post("/login", async (req, res) => {
	const {email, password} = req.body;
	console.log("logged in with ", email);
	if (typeof email == "undefined" || typeof password == "undefined") {
		console.log("Empty email or pass");
		return res.status(400).json({message: "Email or Password is EMpty"});
	}

	const user = await User.findOne({email});
	if (!user) {
		console.log("User not found");
		return res.status(400).json({message: "User not found"});
	}
	if (!user.password) {
		console.log("Google account user loggin with email.");
		return res
			.status(400)
			.json({message: "Password not set, Login with Google Account"});
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		console.log("Invalid credentials");
		return res.status(400).json({message: "Invalid credentials"});
	}
	const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});

	res.json({
		token,
		user: {id: user._id, username: user.username, email: user.email},
	});
});

// Login check
router.get(
	"/login",
	passport.authenticate("jwt", {session: false}),
	async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select("-password"); // Exclude password from response

			if (!user) {
				return res
					.status(404)
					.json({success: false, message: "User not found"});
			}

			res.json({success: true, user});
		} catch (error) {
			console.error("Error fetching user:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
);

router.get("/google", googleAuth);

// Protected route
router.get(
	"/profile",
	passport.authenticate("jwt", {session: false}),
	(req, res) => {
		res.json({user: req.user});
	}
);

module.exports = router;
