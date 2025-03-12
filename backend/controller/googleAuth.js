const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {google} = require("googleapis");
const {uploadImageToCloudinary} = require("../utils/cloudinary");

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"postmessage"
);

/**
 * @route POST /auth/google
 * @desc Logs in or signs up a user using Google OAuth
 * @access Public
 */
module.exports.LoginOrSignupWithGoogle = async (req, res, next) => {
	try {
		const code = req.query.code;
		if (!code) {
			return res.status(400).json({
				success: false,
				message: "Authorization code is required.",
			});
		}

		// Exchange authorization code for access token
		const googleRes = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(googleRes.tokens);

		// Fetch user info from Google API
		const response = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			return res.status(502).json({
				success: false,
				message: "Failed to fetch user data from Google.",
			});
		}

		const userRes = await response.json();
		const {email, name, verified_email, picture} = userRes;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Google account does not provide an email.",
			});
		}

		let user = await User.findOne({email});

		// If user does not exist, create a new account
		if (!user) {
			let profileImage = await uploadImageToCloudinary(picture);
			user = new User({
				username: email,
				name,
				email,
				isEmailVerified: verified_email,
				profileImage: profileImage || null,
			});

			try {
				await user.save();
			} catch (err) {
				console.log(err);
				return res.status(500).json({
					success: false,
					message: "Error saving user to the database.",
				});
			}
		}
		let res2132 = await user.save();
		console.log(res2132);
		// Generate JWT token
		const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_TIMEOUT,
		});

		// Respond with success
		return res.status(200).json({
			success: true,
			message: "User successfully authenticated.",
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
		console.error("Google OAuth error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error during authentication.",
		});
	}
};
