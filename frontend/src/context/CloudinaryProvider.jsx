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
	 * @returns {Object | null} - Uploaded file details or null on failure
	 */
	const uploadToCloudinary = async (file) => {
		// Validate file input
		if (!file) {
			toast.error("No file selected for upload.");
			return null;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			import.meta.env.VITE_CLOUD_UPLOAD_PRESET || "Resume"
		); // Ensure an upload preset is provided

		try {
			const cloudName = import.meta.env.VITE_CLOUD_NAME;
			if (!cloudName) {
				throw new Error(
					"Cloudinary cloud name is not defined in environment variables."
				);
			}

			// Cloudinary API endpoint for raw file uploads
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			// Handle errors from Cloudinary API response
			if (!response.ok) {
				throw new Error(
					`Cloudinary upload failed with status: ${response.status}`
				);
			}

			const data = await response.json();

			if (!data.secure_url) {
				throw new Error(
					"Invalid response from Cloudinary. Missing secure URL."
				);
			}

			toast.success("File uploaded successfully!");

			// Return relevant file details
			return {
				url: data.secure_url,
				id: data.public_id,
				filename: data.original_filename,
			};
		} catch (error) {
			console.error("Error uploading to Cloudinary:", error);
			toast.error(error.message || "Failed to upload file.");
			return null;
		}
	};

	return (
		<CloudinaryContext.Provider value={{uploadToCloudinary}}>
			{children}
		</CloudinaryContext.Provider>
	);
};

/**
 * Custom hook to use Cloudinary upload functionality
 * @returns {Object} Cloudinary upload function
 */
export const useCloudinary = () => {
	return useContext(CloudinaryContext);
};
