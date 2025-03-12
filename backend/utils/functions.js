const fetch = require("node-fetch");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const getFileBuffer = async (fileUrl) => {
	try {
		const response = await fetch(fileUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.error("Error in getFileBuffer:", error);
		throw error;
	}
};

const extractJsonString = (text, type = "object") => {
	const regex = type === "array" ? /\[.*\]/s : /\{.*\}/s;
	const match = text.match(regex);
	return match ? match[0] : "";
};

const getJsonFromGemini = async (prompt) => {
	try {
		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		const result = await model.generateContent(prompt);
		const resultText = result.response.text(); // Ensure correct response parsing
		const jsonString = extractJsonString(resultText);
		return jsonString ? JSON.parse(jsonString) : null;
	} catch (error) {
		console.error("Error in getJsonFromGemini:", error);
		throw new Error("Failed to parse JSON from Gemini response.");
	}
};

const getArrayFromGemini = async (prompt) => {
	try {
		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		const result = await model.generateContent(prompt);
		const resultText = result.response.text(); // Ensure correct response parsing
		const jsonString = extractJsonString(resultText, "array");
		return jsonString ? JSON.parse(jsonString) : [];
	} catch (error) {
		console.error("Error in getArrayFromGemini:", error);
		throw new Error("Failed to parse array from Gemini response.");
	}
};

module.exports = {
	getFileBuffer,
	getJsonFromGemini,
	getArrayFromGemini,
};
