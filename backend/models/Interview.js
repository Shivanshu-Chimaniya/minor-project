const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	jobDetails: {
		level: {
			type: String,
			default: null,
		},
		description: {
			type: String,
			default: null,
		},
	},
	questions: [
		{
			type: String,
			required: true,
		},
	],
	resume: {type: Schema.Types.ObjectId, ref: "Resume"},
	resumeResult: {
		type: Schema.Types.Mixed,
		default: {},
	},
	answers: [
		{
			type: Schema.Types.Mixed,
			default: {},
		},
	],
	feedbacks: [
		{
			type: Schema.Types.Mixed,
			default: {},
		},
	],
	overallResult: {
		type: Schema.Types.Mixed,
		default: {},
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the updatedAt field before saving
InterviewSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("Interview", InterviewSchema);
