import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useBackend} from "../context/BackendContext";

const VideoScreening = ({
	questions,
	completeInterview,
	questionAudio,
	saveAnswer,
}) => {
	const backend = useBackend();
	const transcriptRef = useRef("");
	const transcriptElementRef = useRef(null);
	// answers
	const [questionNumber, setQuestionNumber] = useState(0);

	//video
	const videoRef = useRef(null);
	const [stream, setStream] = useState(null);

	// audio
	// trascript
	const [transcript, setTranscript] = useState("");
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef(null);
	const navigate = useNavigate();

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
		if (questionAudio.length == 0) return;
		for (let audio of questionAudio) {
			audio.addEventListener("ended", startListening);
		}
		askNextQuestion(0);
	}, [questionAudio]);

	useEffect(() => {
		if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
			alert("Speech Recognition is not supported in this browser.");
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
			finalTranscript.trim();
			transcriptRef.current = finalTranscript;

			setTranscript(finalTranscript);
		};

		recognitionRef.current.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
			setIsListening(false);
		};
	}, []);
	// Stop listening when user presses any key
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

	const handleAnswerSubmission = (answer) => {
		saveAnswer(answer, questionNumber);
		if (questionNumber + 1 == questions.length) {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			navigate("/interview/summary");
			return;
		}
		askNextQuestion(questionNumber + 1);
		setQuestionNumber((prev) => prev + 1);
	};

	const startListening = () => {
		if (!recognitionRef.current) return;
		setIsListening(true);
		recognitionRef.current.start();
	};

	const stopListening = () => {
		if (!recognitionRef.current) return;
		recognitionRef.current.stop();
		handleAnswerSubmission(transcriptRef.current);
		setIsListening(false);
		setTranscript("");
	};

	const askNextQuestion = (index) => {
		questionAudio[index].play();
	};

	useEffect(() => {
		if (transcriptElementRef.current) {
			transcriptElementRef.current.scrollTop =
				transcriptElementRef.current.scrollHeight;
		}
	}, [transcript]);
	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="w-full mx-auto max-w-6xl">
				{/* Main Content Layout */}
				<div className="flex flex-col md:flex-row gap-6 justify-center items-center">
					{/* Webcam Feed Section */}
					<div className="relative aspect-video w-full md:w-2/3 h-full">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover rounded-lg shadow-lg bg-gray-800"
						/>
					</div>

					{/* Subtitles Section */}
					<div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6 transition-all duration-300 flex flex-col justify-between">
						<div>
							<div className="flex items-center space-x-3 mb-2">
								<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-sm text-gray-500">
									AI Interviewer
								</span>
							</div>
							<p className="text-sm text-black-700 leading-relaxed">
								{questions[questionNumber]}
							</p>
						</div>

						<div className="p-1 w-full max-w-lg mx-auto text-center grow flex flex-col">
							<h2 className="text-xl font-semibold">
								Speech Transcriber
							</h2>
							<button
								onClick={startListening}
								className={`mt-4 px-6 py-2 text-white font-semibold rounded-md ${
									isListening ? "bg-red-500" : "bg-blue-500"
								}`}>
								{isListening
									? "Listening..."
									: "Start Speaking"}
							</button>

							<p
								ref={transcriptElementRef}
								className="mt-4 grow w-full p-2 bg-gray-100 rounded-md min-h-[80px] max-h-[200px] overflow-y-auto">
								{transcript ||
									"Your speech will appear here..."}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoScreening;
