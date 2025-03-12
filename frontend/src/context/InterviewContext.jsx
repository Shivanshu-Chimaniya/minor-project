import React, {createContext, useContext, useState} from "react";
import {useBackend} from "./BackendContext";
import {showToast} from "../utils/toast";

const InterviewContext = createContext(null);

export const InterviewProvider = (props) => {
	const backend = useBackend();
	const [interviewState, setInterviewState] = useState({
		questions: null,
		questionAudio: null,
		jobDetails: {level: null, description: null},
		resumeResult: null,
		answers: null,
		overallResult: null,
		feedbacks: null,
		id: null,
	});

	const handleResponse = (response, errorMessage) => {
		if (response.error) {
			showToast.error(response.message || errorMessage);
			return false;
		}
		return true;
	};

	const interviewActions = {
		startInterview: async (level, jobDescription) => {
			const updatedJobDetails = {level, description: jobDescription};
			setInterviewState((prevState) => ({
				...prevState,
				jobDetails: updatedJobDetails,
			}));
			return await getQuestions(level, jobDescription);
		},
		saveAnswer: async (answer, questionNumber) => {
			const {questions} = interviewState;
			const newAnswers = {
				...interviewState.answers,
				[questionNumber]: answer,
			};

			setInterviewState((prevState) => ({
				...prevState,
				answers: newAnswers,
			}));

			try {
				const response = await backend.getAnswerFeedback(
					questionNumber,
					questions[questionNumber],
					answer,
					interviewState.id
				);
				if (
					!handleResponse(response, "Failed to get answer feedback.")
				) {
					return;
				}

				setInterviewState((prevState) => ({
					...prevState,
					feedbacks: {
						...prevState.feedbacks,
						[questionNumber]: response.feedback,
					},
				}));

				if (questionNumber + 1 === questions.length) {
					await completeInterview(newAnswers);
				}
			} catch (error) {
				console.error("Error saving answer:", error);
				showToast.error("An error occurred while saving the answer.");
			}
		},
		uploadResume: async (uploadResult) => {
			try {
				const response = await backend.getResumeResult(
					uploadResult,
					interviewState.jobDetails.description,
					interviewState.id
				);
				if (!handleResponse(response, "Failed to analyze resume."))
					return;

				setInterviewState((prevState) => ({
					...prevState,
					resumeResult: response.resumeResult,
				}));
			} catch (error) {
				console.error("Error uploading resume:", error);
				showToast.error(
					"An error occurred while uploading the resume."
				);
			}
		},
		useOldResume: async (id) => {
			try {
				const response = await backend.getOldResumeResult(
					id,
					interviewState.jobDetails.description,
					interviewState.id
				);
				if (!handleResponse(response, "Failed to retrieve old resume."))
					return;

				setInterviewState((prevState) => ({
					...prevState,
					resumeResult: response.resumeResult,
				}));
			} catch (error) {
				console.error("Error retrieving old resume:", error);
				showToast.error(
					"An error occurred while retrieving the old resume."
				);
			}
		},
	};

	const getQuestions = async (level, jobDescription) => {
		try {
			const response = await backend.getQuestions(level, jobDescription);
			if (!handleResponse(response, "Failed to fetch questions."))
				return [];

			setInterviewState((prevState) => ({
				...prevState,
				questions: response.interview.questions,
				id: response.interview.id,
			}));
			getQuestionAudios(response.interview.questions);
			return response.interview.questions;
		} catch (error) {
			console.error("Error fetching questions:", error);
			showToast("An error occurred while fetching questions.", "error");
			return [];
		}
	};

	const getQuestionAudios = async (questions) => {
		try {
			const audioFiles = await Promise.all(
				questions.map((question) => backend.getAudio(question))
			);
			setInterviewState((prevState) => ({
				...prevState,
				questionAudio: audioFiles,
			}));
		} catch (error) {
			console.error("Error fetching audio files:", error);
			showToast.error("An error occurred while fetching question audio.");
		}
	};

	const completeInterview = async (answers) => {
		try {
			const response = await backend.getOverallResult(
				interviewState.questions,
				answers,
				interviewState.id
			);
			if (!handleResponse(response, "Failed to complete interview."))
				return {};

			setInterviewState((prevState) => ({
				...prevState,
				overallResult: response.overallResult,
			}));
			return response;
		} catch (error) {
			console.error("Error completing interview:", error);
			showToast.error(
				"An error occurred while completing the interview."
			);
			return {};
		}
	};

	const questionsLoaded = () => {
		return (
			interviewState.questions !== null &&
			interviewState.questions.length !== 0
		);
	};

	return (
		<InterviewContext.Provider
			value={{...interviewState, ...interviewActions, questionsLoaded}}>
			{props.children}
		</InterviewContext.Provider>
	);
};

export const useInterview = () => useContext(InterviewContext);
