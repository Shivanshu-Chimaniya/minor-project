const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {google} = require("googleapis");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"postmessage"
);

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
	const code = req.query.code;
	try {
		const googleRes = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(googleRes.tokens);
		const response = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const userRes = await response.json();
		const {email, name: username} = userRes;
		let user = await User.findOne({email});

		if (!user) {
			user = await User.create({
				username,
				email,
			});
		}
		const {_id} = user;
		const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});
		res.status(200).json({
			message: "success",
			token,
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
