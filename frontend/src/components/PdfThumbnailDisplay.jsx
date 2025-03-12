import React, {useState, useEffect} from "react";
import {FaFilePdf, FaCheck} from "react-icons/fa";
import {pdfjs} from "react-pdf";

// Set the worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const PdfThumbnailDisplay = ({
	resume,
	selectExistingResume,
	selectedResumeId,
}) => {
	const [thumbnail, setThumbnail] = useState(null);
	const isSelected = selectedResumeId === resume.id;

	useEffect(() => {
		if (resume?.url) {
			fetchPdfThumbnail(resume.url);
		}
	}, [resume]);

	// Function to fetch and generate the thumbnail from the PDF URL
	const fetchPdfThumbnail = async (url) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const pdf = await pdfjs.getDocument(URL.createObjectURL(blob))
				.promise;
			const page = await pdf.getPage(1); // Get the first page

			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			const scale = 0.3; // Adjust for thumbnail size
			const viewport = page.getViewport({scale});

			canvas.width = viewport.width;
			canvas.height = viewport.height;

			// Render the page to the canvas
			await page.render({canvasContext: context, viewport}).promise;

			// Convert canvas to image URL
			const thumbnailUrl = canvas.toDataURL();
			setThumbnail(thumbnailUrl); // Set the generated thumbnail
		} catch (error) {
			console.error("Error fetching or generating thumbnail:", error);
		}
	};

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
			{thumbnail ? (
				<div className="mr-3 flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
					<img
						src={thumbnail}
						alt="PDF Preview"
						className="h-full w-full object-cover"
					/>
				</div>
			) : (
				<div className="mr-3 flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/30 rounded-md">
					<FaFilePdf className="h-6 w-6 text-red-500 dark:text-red-400" />
				</div>
			)}

			<div className="flex-grow">
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
