import React, {createContext, useContext} from "react";

const backendContext = createContext(null);
const backendURL = "http://localhost:8080";

export const BackendProvider = (props) => {
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
