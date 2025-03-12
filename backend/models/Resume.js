const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
	url: {
		type: String,
		required: true,
	},
	public_id: {
		type: String,
		required: true,
	},
	extractedText: {
		type: String,
		required: true,
	},
	filename: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Resume", ResumeSchema);
