import React from "react";
import {FaCheck} from "react-icons/fa";
import PdfThumbnail from "./PdfThumbnail";

const PdfThumbnailDisplay = ({
	resume,
	selectExistingResume,
	selectedResumeId,
}) => {
	const isSelected = selectedResumeId === resume.id;

	// Format the date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	return (
		<div
			onClick={() => selectExistingResume(resume.id)}
			className={`
        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
        ${
			isSelected
				? "bg-blue-100 dark:bg-blue-800/40 border border-blue-300 dark:border-blue-700"
				: "bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/60"
		}
      `}>
			<PdfThumbnail url={resume?.url ? resume.url : null} />

			<div className="flex-grow ms-2">
				<h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs transition-colors duration-200">
					{resume.filename || "Resume"}
				</h4>
				<p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
					{resume.uploadDate
						? formatDate(resume.uploadDate)
						: "Unknown date"}
				</p>
			</div>

			{isSelected && (
				<div className="flex-shrink-0 ml-2">
					<div className="p-1 bg-green-500 dark:bg-green-600 rounded-full">
						<FaCheck className="h-4 w-4 text-white" />
					</div>
				</div>
			)}
		</div>
	);
};

export default PdfThumbnailDisplay;
