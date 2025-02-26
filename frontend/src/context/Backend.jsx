import React, {createContext, useContext} from "react";

const backendContext = createContext(null);
const backendURL = "http://localhost:8080";

export const BackendProvider = (props) => {
	const sampleQuestions = [
		"Describe a situation where you had to optimize the performance of a machine learning model",
		"Let's say you're building a real-time recommendation system using TensorFlow. You need to handle a high volume of requests ",
		"Imagine you are tasked with debugging a complex PyTorch model",
		"You are building a model using TensorFlow/Keras and notice your training loss is fluctuating wildly and not converging. ",
		"Explain your understanding of different approaches to handling class imbalance in a classification problem.",
		"Describe a situation where you had to optimize the performance of a machine learning model",
		"Let's say you're building a real-time recommendation system using TensorFlow. You need to handle a high volume of requests ",
		"Imagine you are tasked with debugging a complex PyTorch model",
		"You are building a model using TensorFlow/Keras and notice your training loss is fluctuating wildly and not converging. ",
		"Explain your understanding of different approaches to handling class imbalance in a classification problem.",
	];

	const sampleRR = {
		"score": 45,
		"strengths": [
			"Demonstrates experience in web development with various technologies (React, Node.js, Express, MongoDB, HTML, CSS, JavaScript).",
			"Multiple projects showcase practical application of skills.",
			"Experience as an SDE Intern, although brief.",
		],
		"weaknesses": [
			"Lack of experience with Python, TensorFlow/PyTorch, or other relevant ML frameworks mentioned in the job description.",
			"Limited experience in designing and deploying machine learning models.",
			"Low CGPA (6.1) might raise concerns.",
			"Projects focus on web development, not machine learning.",
			"Resume lacks quantifiable achievements (e.g., user growth, performance improvements) in projects.",
		],
		"suggestions": [
			"Highlight any machine learning projects or coursework, even if small-scale, to demonstrate relevance.",
			"Quantify achievements in projects with metrics (e.g., improved efficiency by X%, increased user engagement by Y%).",
			"Improve CGPA if possible.",
			"Consider adding a portfolio website to showcase projects more effectively.",
			"Tailor the resume to highlight relevant skills mentioned in the job description for future applications.",
		],
	};
	const getQuestions = async (level, jobDescription) => {
		if (
			typeof level == "undefined" ||
			typeof jobDescription == "undefined"
		) {
			console.error("undefined params");
			return null;
		}
		// return {"questions": sampleQuestions};
		const response = await fetch(`${backendURL}/getquestions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				level,
				jobDescription,
			}),
		});
		const json_response = await response.json();
		let json_object = JSON.parse(json_response);
		return json_object;
	};
	const getResumeResult = async (resume, jobDescription) => {
		// return sampleRR;
		const formData = new FormData();
		formData.append("resume", resume);
		formData.append("jobDescription", jobDescription);
		try {
			const response = await fetch(`${backendURL}/uploadresume`, {
				method: "POST",
				body: formData,
			});
			if (!response.ok) {
				throw new Error("Failed to upload file");
			}
			const result = await response.json();
			let json_object = JSON.parse(result);
			return json_object;
		} catch (error) {
			console.error("Error:", error);
			return {error: error.message};
		}
	};

	const getOverallResult = async (questions, answers) => {
		// console.log(answers);
		// return null;
		try {
			const response = await fetch(`${backendURL}/getoverallresult`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					questions,
					answers,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to get results");
			}
			const result = await response.json();
			let json_object = JSON.parse(result);
			return json_object;
		} catch (error) {
			console.error("Error:", error);
			return {error: error.message};
		}
	};
	const getAudio = async (question) => {
		try {
			const response = await fetch(`${backendURL}/getaudio`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({text: question}),
			});

			if (!response.ok) throw new Error("Failed to fetch audio");

			const blob = await response.blob();
			const audioURL = URL.createObjectURL(blob);

			// Play the audio
			const audio = new Audio(audioURL);
			return audio;
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<backendContext.Provider
			value={{getQuestions, getResumeResult, getOverallResult, getAudio}}>
			{props.children}
		</backendContext.Provider>
	);
};

export const useBackend = () => useContext(backendContext);
