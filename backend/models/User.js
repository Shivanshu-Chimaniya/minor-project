const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Resume = require("./Resume");

// Badge sub-schema
const BadgeSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		enum: ["blue", "green", "purple", "amber", "red"],
		default: "blue",
	},
	dateEarned: {
		type: Date,
		default: Date.now,
	},
});

// Recommendation sub-schema
const RecommendationSchema = new Schema({
	topic: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	resources: [
		{
			name: {
				type: String,
				required: true,
			},
			type: {
				type: String,
				enum: ["course", "article", "book", "video"],
				default: "article",
			},
			url: {
				type: String,
			},
		},
	],
});

// Main User Schema
const UserSchema = new Schema(
	{
		// Basic Profile Information
		name: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			default: "User",
		},
		bio: {
			type: String,
			maxlength: 300,
		},
		profileImage: {
			type: String,
			default: "",
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},

		// Contact Information
		phone: {
			type: String,
		},
		location: {
			type: String,
		},

		// Professional Information
		resumes: [{type: mongoose.Schema.Types.ObjectId, ref: "Resume"}],
		// Interview history
		interviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Interview"}],
		links: {
			linkedin: {
				type: String,
				trim: true,
			},
			github: {
				type: String,
				trim: true,
			},
			portfolio: {
				type: String,
				trim: true,
			},
		},

		// Interview Statistics
		interviewStats: {
			totalInterviews: {
				type: Number,
				default: 0,
			},
			performanceScore: {
				type: Number,
				default: 0,
				min: 0,
				max: 100,
			},
			strengths: [
				{
					type: String,
				},
			],
			weaknesses: [
				{
					type: String,
				},
			],
		},

		// Collection of badges earned
		badges: [BadgeSchema],

		// AI recommendations
		recommendations: [RecommendationSchema],

		// User Preferences
		preferences: {
			interviewDifficulty: {
				type: String,
				enum: ["Intern", "Junior", "Skilled", "Senior", "TryHard"],
			},
			skills: [
				{
					type: String,
				},
			],
			jobRoles: [
				{
					type: String,
				},
			],
			notifications: {
				email: {
					type: Boolean,
					default: false,
				},
				browser: {
					type: Boolean,
					default: false,
				},
			},
		},

		// System fields
		isActive: {
			type: Boolean,
			default: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Method to update performance score based on interview results
UserSchema.methods.updatePerformanceScore = async function () {
	if (!this.interviews || this.interviews.length === 0) return 0;

	const totalScore = this.interviews.reduce(
		(sum, interview) => sum + interview.score,
		0
	);
	this.interviewStats.performanceScore = Math.round(
		totalScore / this.interviews.length
	);
	return this.interviewStats.performanceScore;
};

// Pre-save middleware to update the timestamps
UserSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("User", UserSchema);
