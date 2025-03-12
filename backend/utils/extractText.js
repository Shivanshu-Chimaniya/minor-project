const PdfParse = require("pdf-parse");
const mammoth = require("mammoth"); // Missing import
const {getFileBuffer} = require("./functions");

module.exports.extractText = async (url, extension) => {
	try {
		const fileBuffer = await getFileBuffer(url);
		if (!fileBuffer) {
			throw new Error("No file uploaded");
		}

		let extractedText = "";

		if (extension === "pdf") {
			const data = await PdfParse(fileBuffer);
			extractedText = data.text || "No readable text found in PDF.";
		} else if (extension === "docx") {
			const data = await mammoth.extractRawText({buffer: fileBuffer});
			extractedText = data.value || "No readable text found in DOCX.";
		} else if (extension === "doc") {
			throw new Error(
				".doc files are not supported, please convert to .docx or .pdf"
			);
		} else {
			throw new Error("Unsupported file format");
		}

		// Normalize text
		const reducedText = extractedText.replace(/\s+/g, " ").trim();

		return reducedText;
	} catch (err) {
		console.error("Error extracting text:", err);
		throw new Error("Error extracting text from file. Please try again.");
	}
};
