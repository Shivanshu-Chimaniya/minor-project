import {createContext, useContext} from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create Cloudinary Context
const CloudinaryContext = createContext();

/**
 * Cloudinary Provider to handle file uploads
 * @param {Object} children - React children components
 */
export const CloudinaryProvider = ({children}) => {
	/**
	 * Uploads a file to Cloudinary
	 * @param {File} file - The file to upload
	 * @param {string} uploadPreset - Cloudinary upload preset
	 * @param {string} resourceType - Resource type ('image', 'video', etc.)
	 * @returns {Object | null} - Uploaded file details or null on failure
	 */
	const uploadToCloudinary = async (file, uploadPreset, resourceType) => {
		// Validate file input
		if (!file) {
			toast.error("No file selected for upload.");
			return null;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", uploadPreset);

		try {
			const cloudName = import.meta.env.VITE_CLOUD_NAME;
			if (!cloudName) {
				throw new Error(
					"Cloudinary cloud name is not defined in environment variables."
				);
			}

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					`Cloudinary upload failed: ${
						errorData.error?.message ||
						response.statusText ||
						response.status
					}`
				);
			}

			const data = await response.json();

			if (!data.secure_url) {
				throw new Error(
					"Invalid response from Cloudinary. Missing secure URL."
				);
			}
			return {
				url: data.secure_url,
				id: data.public_id,
				filename: data.original_filename,
				format: data.format,
				resourceType: data.resource_type,
				size: data.bytes,
				createdAt: data.created_at,
				folder: data.folder || "",
			};
		} catch (error) {
			console.error("Error uploading to Cloudinary:", error);
			toast.error(error.message || "Failed to upload file.");
			return null;
		}
	};

	/**
	 * Uploads a resume to Cloudinary
	 * @param {File} file - The resume file to upload
	 * @returns {Object | null} - Uploaded file details or null on failure
	 */
	const uploadResumeToCloudinary = async (file) => {
		return await uploadToCloudinary(file, "Resume", "raw");
	};

	/**
	 * Uploads a video (MP4 only) to Cloudinary
	 * @param {File} file - The video file to upload
	 * @returns {Object | null} - Uploaded file details or null on failure
	 */
	const uploadVideoToCloudinary = async (file) => {
		if (!file.name.endsWith(".mp4")) {
			toast.error("Only MP4 videos are allowed for upload.");
			return null;
		}
		let uploadResult = await uploadToCloudinary(file, "CamVideo", "video");
		if (!uploadResult) return null;
		let mp4_url = uploadResult.url.replace("/upload/", "/upload/f_mp4/");

		return {...uploadResult, mp4_url};
	};

	return (
		<CloudinaryContext.Provider
			value={{uploadResumeToCloudinary, uploadVideoToCloudinary}}>
			{children}
		</CloudinaryContext.Provider>
	);
};

/**
 * Custom hook to use Cloudinary upload functionality
 * @returns {Object} Cloudinary upload functions
 */
export const useCloudinary = () => {
	const context = useContext(CloudinaryContext);
	if (!context) {
		throw new Error(
			"useCloudinary must be used within a CloudinaryProvider"
		);
	}
	return context;
};
