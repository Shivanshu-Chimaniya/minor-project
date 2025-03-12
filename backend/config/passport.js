const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

// JWT strategy options
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

// Passport configuration
module.exports = (passport) => {
	// Serialization and deserialization for sessions
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	// JWT Strategy
	passport.use(
		new JwtStrategy(opts, async (jwt_payload, done) => {
			try {
				const user = await User.findById(jwt_payload.id);
				if (user) return done(null, user);
				return done(null, false); // User not found
			} catch (err) {
				console.error("JWT Strategy Error: ", err);
				return done(err, false); // Return false in case of an error
			}
		})
	);

	// Google OAuth strategy
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.GOOGLE_CALLBACK_URL ||
					"http://localhost:8080/auth/google/callback", // Dynamic callback URL
			},
			async (accessToken, refreshToken, profile, cb) => {
				try {
					// can modify this function to use more precise logic for finding or creating the user
					const user = await User.findOrCreate({
						googleId: profile.id,
					});
					return cb(null, user);
				} catch (err) {
					console.error("Google OAuth Error: ", err);
					return cb(err, null); // Return the error properly
				}
			}
		)
	);
};
