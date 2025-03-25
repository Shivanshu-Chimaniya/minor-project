const uploadImageToCloudinary = async (googleImageUrl) => {
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME; // Replace with your Cloudinary cloud name
	const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

	try {
		const formData = new FormData();
		formData.append("file", googleImageUrl); // Directly use the Google image URL
		formData.append("upload_preset", "profilePictures"); // Your unsigned upload preset

		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (response.ok) {
			console.log("Uploaded Successfully:", data);
			console.log(data.secure_url);
			return data.secure_url; // Cloudinary URL of the uploaded image
		} else {
			throw new Error(data.error.message);
		}
	} catch (error) {
		console.error("Upload Failed:", error);
		return null;
	}
};

module.exports = {uploadImageToCloudinary};
