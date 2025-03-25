// src/components/interview/ResponseRecorder.jsx
import React, {useEffect, useRef} from "react";

const ResponseRecorder = ({
	isListening,
	transcript,
	onTranscriptChange,
	onListeningChange,
	onSubmit,
	stopSpeaking,
}) => {
	const transcriptRef = useRef("");
	const transcriptElementRef = useRef(null);
	const recognitionRef = useRef(null);
	const isListeningRef = useRef(false);

	// Initialize speech recognition
	useEffect(() => {
		if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
			console.error(
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
			onTranscriptChange(finalTranscript);
		};

		recognitionRef.current.onerror = (event) => {
			if (event.error === "aborted") return;
			console.error("Speech recognition error:", event.error);
			onListeningChange(false);
			isListeningRef.current = false;
		};

		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (e) {
					// Ignore errors when stopping
				}
			}
		};
	}, []);

	// Handle keyboard events to stop listening
	useEffect(() => {
		if (isListening) {
			window.addEventListener("keydown", stopListening);
		} else {
			window.removeEventListener("keydown", stopListening);
		}

		return () => {
			window.removeEventListener("keydown", stopListening);
		};
	}, [isListening]);

	// Auto-scroll transcript to bottom
	useEffect(() => {
		if (transcriptElementRef.current) {
			transcriptElementRef.current.scrollTop =
				transcriptElementRef.current.scrollHeight;
		}
	}, [transcript]);

	// Sync listening state with ref for event handlers
	useEffect(() => {
		isListeningRef.current = isListening;

		if (isListening && recognitionRef.current) {
			try {
				recognitionRef.current.start();
			} catch (e) {
				// Recognition might be already started
				console.log("Recognition already started");
			}
		}
	}, [isListening]);

	const startListening = () => {
		if (isListeningRef.current || !recognitionRef.current) return;
		stopSpeaking();
		onListeningChange(true);
		isListeningRef.current = true;
		onTranscriptChange("");
		transcriptRef.current = "";

		try {
			recognitionRef.current.start();
		} catch (e) {
			console.log("Error starting recognition", e);
		}
	};

	const stopListening = () => {
		if (!isListeningRef.current) return;

		onListeningChange(false);
		isListeningRef.current = false;

		if (!recognitionRef.current) return;

		try {
			recognitionRef.current.abort();
		} catch (e) {
			console.log("Error stopping recognition", e);
		}

		const finalAnswer = transcriptRef.current;
		onTranscriptChange("");
		transcriptRef.current = "";
		onSubmit(finalAnswer);
	};

	const handleMicClick = (e) => {
		e.target.setAttribute("tabindex", "-1");
		e.target.blur();
		isListening ? stopListening() : startListening();
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
					Your Response
				</h2>

				<button
					onClick={(e) => handleMicClick(e)}
					className={`p-2 rounded-full transition-all duration-300 ${
						isListening
							? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
							: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
					}`}>
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
							<rect x="6" y="6" width="12" height="12" />
						) : (
							<>
								<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
								<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
								<line x1="12" y1="19" x2="12" y2="22" />
								<line x1="8" y1="22" x2="16" y2="22" />
							</>
						)}
					</svg>
				</button>
			</div>

			<div
				ref={transcriptElementRef}
				className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 h-36 overflow-y-auto transition-colors duration-300 border border-gray-200 dark:border-gray-600 text-sm">
				{transcript ? (
					<p className="whitespace-pre-wrap">{transcript}</p>
				) : (
					<p className="text-gray-400 dark:text-gray-500 italic text-xs">
						Click the microphone icon to start speaking...
					</p>
				)}
			</div>

			<div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
				Press any key to submit when finished
			</div>
		</div>
	);
};

export default ResponseRecorder;
