import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const backendContext = createContext(null);
const backendURL = `${
	import.meta.env.VITE_BACKENDURL || "http://localhost:8080"
}/interview`;
const profileURL = `${
	import.meta.env.VITE_BACKENDURL || "http://localhost:8080"
}/profile`;

export const BackendProvider = (props) => {
	const auth = props.useAuth();
	const [token, setToken] = useState(auth.getToken());

	useEffect(() => {
		setToken(auth.getToken());
	}, [props.useAuth]);
	// Axios instance with default headers
	const axiosInstance = axios.create({
		baseURL: backendURL,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		timeout: 10000, // 10 seconds timeout
	});

	// Generic API request function
	const apiRequest = async (
		endpoint,
		method,
		body = null,
		baseURL = backendURL
	) => {
		if (!token) return {error: "Unauthorized: No token provided"};

		try {
			const response = await axiosInstance({
				url: `${baseURL}${endpoint}`,
				method,
				data: body,
			});
			return response.data;
		} catch (error) {
			console.error("API Error:", error.response?.data || error.message);

			// Handle authentication errors
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				setToken(null);
				window.location.href = "/login"; // Redirect to login
			}

			return {
				error: error.response?.data?.message || "Something went wrong",
			};
		}
	};

	// Fetch AI-generated questions
	const getQuestions = async (
		level,
		jobDescription,
		tags = null,
		features = null
	) => {
		if (!level || !jobDescription) return {error: "Invalid parameters"};

		return await apiRequest("/questions", "POST", {
			level,
			jobDescription,
			tags,
			features,
		});
	};

	// Convert text to AI-generated audio
	const getAudio = async (question) => {
		if (!question) return {error: "Invalid parameters"};

		try {
			const response = await axiosInstance.post(
				"/audio",
				{text: question},
				{responseType: "blob"}
			);

			const audioURL = URL.createObjectURL(response.data);
			return new Audio(audioURL);
		} catch (error) {
			console.error("Error:", error);
			return {error: "Failed to fetch audio"};
		}
	};

	// Analyze resume based on job description
	const getResumeResult = async (
		uploadResult,
		jobDescription,
		interviewId
	) => {
		if (!uploadResult || !jobDescription)
			return {error: "Invalid parameters"};
		return await apiRequest("/resume-result", "POST", {
			uploadResult,
			jobDescription,
			interviewId,
		});
	};

	// Get previous resume analysis
	const getOldResumeResult = async (id, jobDescription, interviewId) => {
		if (!id) return {error: "Invalid parameters"};
		return await apiRequest("/resume-result", "POST", {
			id,
			jobDescription,
			interviewId,
		});
	};

	// Get feedback for a specific answer
	const getAnswerFeedback = async (
		questionNumber,
		question,
		answer,
		interviewId
	) => {
		if (!question || answer == null || typeof answer == "undefined")
			return {error: "Invalid parameters"};
		return await apiRequest("/answer-feedback", "POST", {
			questionNumber,
			question,
			answer,
			interviewId,
		});
	};

	// Get overall interview results
	const getOverallResult = async (questions, answers, interviewId) => {
		if (!questions || !answers || !interviewId)
			return {error: "Invalid parameters"};

		return await apiRequest("/overall-result", "POST", {
			questions,
			answers: Object.values(answers),
			interviewId,
		});
	};
	// Get overall interview results
	const getVideoResult = async (uploadResult, interviewId) => {
		if (!uploadResult || !interviewId) return {error: "Invalid parameters"};

		try {
			const response = await axios.post(
				`${backendURL}/video-result`,
				{
					uploadResult,
					interviewId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error:", error.response?.data || error.message);
			return {
				error: error.response?.data?.message || "Something went wrong",
			};
		}
	};

	// Upload resume and store in localStorage
	const uploadResume = async (uploadResult) => {
		if (!uploadResult) return {error: "Invalid parameters"};

		const data = await apiRequest(
			"/upload-resume",
			"POST",
			{uploadResult},
			profileURL
		);
		if (data.error) return data;

		const userInfo = localStorage.getItem("user-info");
		if (userInfo) {
			let jsonUser = JSON.parse(userInfo);
			jsonUser.resumes = [...(jsonUser.resumes || []), data.resume];
			localStorage.setItem("user-info", JSON.stringify(jsonUser));
		}

		return data.resume;
	};

	const deleteResume = async (resumeId, publicId) => {
		try {
			const response = await fetch(`${profileURL}/delete-resume`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`, // If you're using token auth
				},
				body: JSON.stringify({
					resumeId,
					publicId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to delete resume");
			}

			return await response.json();
		} catch (error) {
			console.error("Error deleting resume:", error);
			throw error;
		}
	};

	return (
		<backendContext.Provider
			value={{
				getQuestions,
				getResumeResult,
				getOldResumeResult,
				getOverallResult,
				getAudio,
				getAnswerFeedback,
				uploadResume,
				deleteResume,
				getVideoResult,
			}}>
			{props.children}
		</backendContext.Provider>
	);
};

export const useBackend = () => useContext(backendContext);
