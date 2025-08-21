const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const interviewRoutes = require("./routes/interview");
const profileRoutes = require("./routes/profile");

const app = express();

// Middleware
// console.log(process.env.FRONTEND_URL);
app.use(
	cors({
		origin: "*", // Allow requests from your frontend
		methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods if needed
		credentials: true, // Include cookies if required (optional)
	})
);

app.use(express.json());
app.use(
	session({secret: "your_secret", resave: false, saveUninitialized: true})
);
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(passport.session());

const MONGO_URL = "mongodb://127.0.0.1:27017/interview";
mongoose
	.connect(MONGO_URL)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log("MongoDB connection error:"));

app.get("/", (req, res) => {
	res.json("connected");
});

app.use("/auth", authRoutes);
app.use("/interview", interviewRoutes);
app.use("/profile", profileRoutes);

app.use((err, req, res, next) => {
	res.status(500).json({message: err.message || "Internal Server Error"});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${"http://localhost:" + PORT}`);
});
