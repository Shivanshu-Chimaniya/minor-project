const Resume = require("../models/Resume");
const User = require("../models/User");
const {extractText} = require("../utils/extractText");
const cloudinary = require("cloudinary").v2; // Assuming you're using cloudinary

// Configure cloudinary if you haven't already
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

/**
 * @route Delete /resume/upload
 * @desc Deletes selected resume, and remover it from the user
 * @access Private (Requires authentication)
 */

module.exports.deleteResume = async (req, res) => {
	try {
		const {resumeId, publicId} = req.body;

		if (!resumeId || !publicId) {
			return res
				.status(400)
				.json({message: "Resume ID and public ID are required"});
		}
		let user = await User.findById(req.user.id);
		if (!user.resumes.includes(resumeId)) {
			return res
				.status(401)
				.json({message: "Resume ID doesn't belong to user."});
		}

		// Delete file from storage (e.g., Cloudinary)
		await cloudinary.uploader.destroy(publicId);

		// Delete record from database
		user.resumes.splice(user.resumes.indexOf(resumeId), 1);
		await user.save();
		const result = await Resume.findByIdAndDelete(resumeId);

		if (!result) {
			return res.status(404).json({message: "Resume not found"});
		}

		res.status(200).json({message: "Resume deleted successfully"});
	} catch (error) {
		console.error("Error deleting resume:", error);
		res.status(500).json({
			message: "Failed to delete resume",
			error: error.message,
		});
	}
};
