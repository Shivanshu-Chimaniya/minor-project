import {React, useEffect, useState} from "react";
import {FaFilePdf} from "react-icons/fa";
import {pdfjs} from "react-pdf";

// Set the worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const PdfThumbnail = ({url}) => {
	const [thumbnail, setThumbnail] = useState(null);
	useEffect(() => {
		if (url) {
			fetchPdfThumbnail(url);
		}
	}, [url]);
	const fetchPdfThumbnail = async (url) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const pdf = await pdfjs.getDocument(URL.createObjectURL(blob))
				.promise;
			const page = await pdf.getPage(1); // Get the first page

			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			const scale = 0.35; // Adjust for thumbnail size
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

	return (
		<>
			{thumbnail ? (
				<div className=" flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
					<img
						src={thumbnail}
						alt="PDF Preview"
						className="h-full w-full object-cover"
					/>
				</div>
			) : (
				<div className=" flex-shrink-0 p-2 bg-red-100 dark:bg-red-900/30 rounded-md">
					<FaFilePdf className="h-6 w-6 text-red-500 dark:text-red-400" />
				</div>
			)}
		</>
	);
};

export default PdfThumbnail;
