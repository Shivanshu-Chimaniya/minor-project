const Resume = require("../models/Resume");
const User = require("../models/User");
const {extractText} = require("../utils/extractText");

/**
 * @route POST /resume/upload
 * @desc Uploads a resume, extracts text, and associates it with a user
 * @access Private (Requires authentication)
 */
module.exports.uploadResume = async (req, res) => {
	const {uploadResult} = req.body;

	if (!uploadResult || !uploadResult.url || !uploadResult.id) {
		return res.status(400).json({
			success: false,
			message: "Invalid upload data. URL and ID are required.",
		});
	}

	try {
		// Extract text from uploaded resume
		const fileExtension = uploadResult.id.split(".").pop();
		const extractedText = await extractText(
			uploadResult.url,
			fileExtension
		);

		// Save resume details in the database
		const newResume = new Resume({
			url: uploadResult.url,
			public_id: uploadResult.id,
			extractedText,
			filename: uploadResult.filename || "Untitled",
		});

		const savedResume = await newResume.save();

		// Associate resume with the authenticated user
		const user = await User.findById(req.user.id);
		if (!user) {
			return res
				.status(404)
				.json({success: false, message: "User not found."});
		}

		user.resumes.push(savedResume);
		await user.save();

		return res.status(201).json({
			success: true,
			message: "Resume uploaded successfully.",
			resume: {
				filename: savedResume.filename,
				id: savedResume._id,
				public_id: savedResume.public_id,
				url: savedResume.url,
			},
		});
	} catch (error) {
		console.error("Error uploading resume:", error);
		return res
			.status(500)
			.json({success: false, message: "Internal server error."});
	}
};
