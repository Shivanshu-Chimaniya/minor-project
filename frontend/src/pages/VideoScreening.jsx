import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInterview} from "../context/InterviewContext";
import {showToast} from "../utils/toast";

const VideoScreening = () => {
	const navigate = useNavigate();
	const transcriptRef = useRef("");
	const transcriptElementRef = useRef(null);

	// answers
	const [questionNumber, setQuestionNumber] = useState(0);

	// video
	const videoRef = useRef(null);
	const [stream, setStream] = useState(null);

	// audio
	const [transcript, setTranscript] = useState("");
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef(null);

	const {questions, questionAudio, saveAnswer} = useInterview();

	useEffect(() => {
		// Validate if questions are loaded
		if (questions == null || questions.length === 0) {
			showToast.error("No questions Found");
			navigate("/selectinterview");
		}
	}, [questions, navigate]);

	useEffect(() => {
		const startWebcam = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				setStream(mediaStream);
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}
			} catch (err) {
				console.error("Error accessing webcam:", err);
				showToast.error("Could not access camera or microphone");
			}
		};

		startWebcam();

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	useEffect(() => {
		if (questionAudio == null || questionAudio.length === 0) return;
		// Wait for all audio files to be loaded before starting the interview
		for (let audio of questionAudio) {
			audio.addEventListener("ended", startListening);
		}

		if (questionAudio.every((audio) => audio.readyState === 4)) {
			askNextQuestion(0);
		}
	}, [questionAudio]);

	useEffect(() => {
		if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
			showToast.error(
				"Speech Recognition is not supported in this browser."
			);
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.lang = "en-US";
		recognitionRef.current.interimResults = true;
		recognitionRef.current.continuous = true;

		recognitionRef.current.onresult = (event) => {
			let finalTranscript = "";
			for (let i = 0; i < event.results.length; i++) {
				finalTranscript += event.results[i][0].transcript + " ";
			}
			finalTranscript = finalTranscript.trim();
			transcriptRef.current = finalTranscript;

			setTranscript(finalTranscript);
		};

		recognitionRef.current.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
			setIsListening(false);
			showToast.error("Speech recognition error: " + event.error);
		};
	}, []);

	useEffect(() => {
		const handleKeyPress = () => {
			stopListening();
		};

		if (isListening) {
			window.addEventListener("keydown", handleKeyPress);
		}

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [isListening]);

	// Auto scroll transcript to bottom when content changes
	useEffect(() => {
		if (transcriptElementRef.current) {
			transcriptElementRef.current.scrollTop =
				transcriptElementRef.current.scrollHeight;
		}
	}, [transcript]);

	if (!questions || questions.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="animate-pulse flex flex-col items-center">
					<div className="w-12 h-12 border-4 border-t-blue-500 dark:border-t-blue-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4"></div>
					<p className="text-gray-700 dark:text-gray-300">
						Loading interview...
					</p>
				</div>
			</div>
		);
	}

	const handleAnswerSubmission = (answer, questionNumber) => {
		saveAnswer(answer, questionNumber);
		if (questionNumber + 1 === questions.length) {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			navigate("/interview/summary");
			return;
		}
		askNextQuestion(questionNumber + 1);
		setQuestionNumber((prev) => prev + 1);
	};

	const toggleListening = () => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	};

	const startListening = () => {
		if (isListening) return;
		if (!recognitionRef.current) return;
		recognitionRef.current.start();
		setIsListening(true);

		if (questionAudio[questionNumber]) {
			questionAudio[questionNumber].removeEventListener(
				"ended",
				startListening
			);
			questionAudio[questionNumber].pause();
		}
	};

	const stopListening = () => {
		if (!recognitionRef.current) return;
		recognitionRef.current.stop();
		handleAnswerSubmission(transcriptRef.current, questionNumber);
		setTranscript("");
		setIsListening(false);
	};

	const askNextQuestion = (index) => {
		if (questionAudio[index]) {
			questionAudio[index].play();
		}
	};

	const questionProgress = (questionNumber / questions.length) * 100;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
			<div className="w-full mx-auto max-w-6xl flex flex-col gap-4">
				{/* Progress indicator */}
				<div className="w-full mb-2">
					<div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
						<span>
							Question {questionNumber + 1} of {questions.length}
						</span>
						<span>{Math.round(questionProgress)}% Complete</span>
					</div>
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
						<div
							className="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-500 ease-in-out"
							style={{width: `${questionProgress}%`}}></div>
					</div>
				</div>

				{/* Main Content Layout */}
				<div className="flex flex-col lg:flex-row gap-4">
					{/* Webcam Feed Section */}
					<div className="relative aspect-video w-full lg:w-2/3 h-full">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover rounded-xl shadow-lg bg-gray-800 dark:bg-gray-800"
						/>
						{/* Recording indicator */}
						<div className="absolute top-3 left-3 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-2 py-0.5">
							<div
								className={`w-2 h-2 rounded-full ${
									isListening
										? "bg-red-500 animate-pulse"
										: "bg-gray-400"
								}`}></div>
							<span className="text-white text-xs font-medium">
								{isListening ? "Recording" : "Ready"}
							</span>
						</div>
					</div>

					{/* Question and Transcript Section - Made more compact */}
					<div className="w-full lg:w-1/3 flex flex-col gap-3">
						{/* Combined card for both question and transcript */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all duration-300 border border-gray-100 dark:border-gray-700">
							{/* Question part */}
							<div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
										<span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
											AI Interviewer
										</span>
									</div>

									{/* Question number badge */}
									<span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
										Q{questionNumber + 1}
									</span>
								</div>
								<p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
									{questions[questionNumber]}
								</p>
							</div>

							{/* Transcript part */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
										Your Response
									</h2>

									{/* Microphone button */}
									<button
										onClick={toggleListening}
										className={`p-2 rounded-full transition-all duration-300 ${
											isListening
												? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
												: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
										}`}
										aria-label={
											isListening
												? "Stop recording"
												: "Start recording"
										}>
										{/* Microphone icon - changes based on recording state */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="w-4 h-4 text-white">
											{isListening ? (
												// Stop icon when recording
												<rect
													x="6"
													y="6"
													width="12"
													height="12"
												/>
											) : (
												// Mic icon when not recording
												<>
													<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
													<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
													<line
														x1="12"
														y1="19"
														x2="12"
														y2="22"
													/>
													<line
														x1="8"
														y1="22"
														x2="16"
														y2="22"
													/>
												</>
											)}
										</svg>
									</button>
								</div>

								{/* Compact transcript area */}
								<div
									ref={transcriptElementRef}
									className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 h-36 overflow-y-auto transition-colors duration-300 border border-gray-200 dark:border-gray-600 text-sm">
									{transcript ? (
										<p className="whitespace-pre-wrap">
											{transcript}
										</p>
									) : (
										<p className="text-gray-400 dark:text-gray-500 italic text-xs">
											Click the microphone icon to start
											speaking...
										</p>
									)}
								</div>

								<div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
									Press any key to submit when finished
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoScreening;
