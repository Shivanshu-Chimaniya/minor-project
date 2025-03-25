import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useInterview} from "../context/InterviewContext";
import {useCloudinary} from "../context/CloudinaryProvider"; // Add this import
import {showToast} from "../utils/toast";
import VideoDisplay from "../components/interview/VideoDisplay";
import ProgressIndicator from "../components/interview/ProgressIndicator";
import QuestionCard from "../components/interview/QuestionCard";
import ResponseRecorder from "../components/interview/ResponseRecorder";

const VideoScreening = () => {
	const navigate = useNavigate();
	const {questions, saveAnswer, uploadVideo} = useInterview();
	const {uploadVideoToCloudinary} = useCloudinary(); // Access the uploadToCloudinary function
	const [questionNumber, setQuestionNumber] = useState(0);
	const [stream, setStream] = useState(null);
	const [isNarrating, setIsNarrating] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");

	// Refs for recording
	const mediaRecorderRef = useRef(null);
	const recordedChunksRef = useRef([]);
	const recordingTimerRef = useRef(null);

	const synth = window.speechSynthesis;

	// Check if questions exist
	useEffect(() => {
		if (!questions?.length) {
			showToast.error("No Questions Found.");
			navigate("/selectinterview");
		}
	}, [questions, navigate]);

	// Initialize webcam stream and start recording
	useEffect(() => {
		const startWebcam = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				setStream(mediaStream);

				// Start recording once stream is available
				startRecording(mediaStream);
			} catch (err) {
				console.error("Error accessing webcam:", err);
				showToast.error("Could not access camera or microphone");
			}
		};

		startWebcam();

		// Clean up function
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}

			// Stop recording on unmount
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "recording"
			) {
				mediaRecorderRef.current.stop();
			}

			// Clear recording timer
			if (recordingTimerRef.current) {
				clearTimeout(recordingTimerRef.current);
			}
		};
	}, []);

	// Function to start recording
	const startRecording = (mediaStream) => {
		if (!mediaStream) return;

		try {
			const mediaRecorder = new MediaRecorder(mediaStream);
			mediaRecorderRef.current = mediaRecorder;

			// Reset recorded chunks
			recordedChunksRef.current = [];

			// Event handler for when data is available
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data);
				}
			};

			// Event handler for when recording stops
			mediaRecorder.onstop = () => {
				// Create a blob from the recorded chunks
				const recordedBlob = new Blob(recordedChunksRef.current, {
					type: "video/webm",
				});

				// Upload the recorded video to Cloudinary
				uploadRecordedVideo(recordedBlob);
			};

			// Start recording
			mediaRecorder.start();

			// Set timer to stop recording after 60 seconds
			recordingTimerRef.current = setTimeout(() => {
				if (
					mediaRecorderRef.current &&
					mediaRecorderRef.current.state === "recording"
				) {
					mediaRecorderRef.current.stop();
					showToast.info(
						"Recording complete (60-second limit reached)"
					);
				}
			}, 60000); // 60 seconds
		} catch (error) {
			console.error("Error starting recording:", error);
			showToast.error("Failed to start recording");
		}
	};

	// Function to upload the recorded video
	const uploadRecordedVideo = async (videoBlob) => {
		try {
			// Create a File object from the Blob
			const videoFile = new File([videoBlob], "interview-recording.mp4", {
				type: "video/mp4",
			});
			console.log(videoFile);

			// Upload to Cloudinary using the provided function
			let result = await uploadVideoToCloudinary(videoFile);
			console.log(result);

			uploadVideo(result);
			showToast.success(
				"Video uploaded successfully, It might Take some time to process the video"
			);
		} catch (error) {
			console.error("Error uploading video:", error);
			showToast.error("Failed to upload video");
		}
	};

	// Start with first question
	useEffect(() => {
		if (questions?.length) {
			askQuestion(questionNumber);
		}
	}, [questions]);

	const askQuestion = (questionNumber) => {
		if (!questions?.[questionNumber]) return;
		setIsNarrating(true);
		setIsListening(false);
	};

	const handleAnswerSubmission = (answer, questionNumber) => {
		saveAnswer(answer, questionNumber);

		if (questionNumber + 1 >= questions?.length) {
			// Stop recording before navigating away
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === "recording"
			) {
				mediaRecorderRef.current.stop();
			}

			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			navigate("/interview/summary");
			return;
		}

		setQuestionNumber((prev) => prev + 1);
		askQuestion(questionNumber + 1);
	};

	const handleTranscriptChange = (newTranscript) => {
		setTranscript(newTranscript);
	};

	const handleListeningChange = (isActive) => {
		setIsListening(isActive);
	};

	const handleNarrationChange = (isActive) => {
		setIsNarrating(isActive);
		// Auto-start listening when narration ends
		if (!isActive) {
			setIsListening(true);
		}
	};

	const stopSpeaking = () => {
		if (synth.speaking) {
			synth.cancel();
			handleNarrationChange(false);
		}
	};

	const questionProgress = questions?.length
		? (questionNumber / questions.length) * 100
		: 0;
	const currentQuestion = questions?.[questionNumber] || "";

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
			<div className="w-full mx-auto max-w-6xl flex flex-col gap-4">
				<ProgressIndicator
					questionNumber={questionNumber}
					totalQuestions={questions?.length || 0}
					progressPercentage={questionProgress}
				/>

				<div className="flex flex-col lg:flex-row gap-4">
					<VideoDisplay stream={stream} isRecording={isListening} />

					<div className="w-full lg:w-2/5 flex flex-col gap-3">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all duration-300 border border-gray-100 dark:border-gray-700">
							<QuestionCard
								question={currentQuestion}
								questionNumber={questionNumber}
								isNarrating={isNarrating}
								onNarrationChange={handleNarrationChange}
								synth={synth}
							/>

							<ResponseRecorder
								isListening={isListening}
								transcript={transcript}
								onTranscriptChange={handleTranscriptChange}
								onListeningChange={handleListeningChange}
								onSubmit={(answer) =>
									handleAnswerSubmission(
										answer,
										questionNumber
									)
								}
								stopSpeaking={stopSpeaking}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoScreening;
