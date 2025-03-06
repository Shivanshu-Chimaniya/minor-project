const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

require("dotenv").config();

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((user, done) => {
		done(null, user);
	});
	passport.use(
		new JwtStrategy(opts, async (jwt_payload, done) => {
			try {
				const user = await User.findById(jwt_payload.id);

				if (user) return done(null, user);
				return done(null, false);
			} catch (err) {
				console.error(err);
			}
		})
	);
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "http://localhost:8080/auth/google/callback",
			},
			function (accessToken, refreshToken, profile, cb) {
				User.findOrCreate({googleId: profile.id}, function (err, user) {
					return cb(err, user);
				});
			}
		)
	);
};
