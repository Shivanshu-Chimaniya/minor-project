import React, {useState} from "react";
import {FiFileText as FileText} from "react-icons/fi";
import {MdOutlineFileUpload as Upload} from "react-icons/md";
import {AiOutlineLoading as LoadingIcon} from "react-icons/ai";

const UploadButton = ({onFileSelect}) => {
	const [isUploading, setIsUploading] = useState(false);

	const handleFileInput = async (e) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			// Start upload immediately
			setIsUploading(true);

			if (onFileSelect) {
				try {
					await onFileSelect(selectedFile);
				} catch (error) {
					console.error("Resume upload error:", error);
				} finally {
					setIsUploading(false);
					e.target.value = "";
				}
			}
		}
	};

	return (
		<div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
			<input
				type="file"
				id="file-upload"
				className="hidden"
				accept=".pdf,.doc,.docx"
				onChange={handleFileInput}
				disabled={isUploading}
			/>
			<label
				htmlFor="file-upload"
				className={`cursor-pointer w-full h-full flex items-center justify-center ${
					isUploading ? "cursor-wait" : ""
				}`}>
				{isUploading ? (
					<LoadingIcon className="h-8 w-8 text-primary-500 dark:text-blue-400 animate-spin" />
				) : (
					<Upload className="h-8 w-8 text-gray-400 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
				)}
			</label>
		</div>
	);
};

export default UploadButton;
