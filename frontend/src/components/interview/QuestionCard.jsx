// src/components/interview/QuestionCard.jsx
import React, {useEffect, useRef} from "react";
import AudioWaveform from "../AudioWaveform";

const QuestionCard = ({
	synth,
	question,
	questionNumber,
	isNarrating,
	onNarrationChange,
}) => {
	const utteranceRef = useRef(null);

	useEffect(() => {
		// Clean up speech synthesis when component unmounts
		return () => {
			if (synth && synth.speaking) synth.cancel();
		};
	}, []);

	useEffect(() => {
		if (!question) return;

		speakQuestion(question);
	}, [question]);

	const speakQuestion = (text) => {
		if (synth.speaking) synth.cancel(); // Stop any ongoing speech

		const utterance = new SpeechSynthesisUtterance(text);
		utteranceRef.current = utterance;

		utterance.onstart = () => {
			onNarrationChange(true);
		};
		utterance.onerror = (e) => {
			if (e.error === "interrupted") return;
			console.log(e);
		};

		utterance.onend = () => {
			onNarrationChange(false);
		};

		synth.speak(utterance);
	};

	return (
		<div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center space-x-2">
					<div
						className={`w-2 h-2 rounded-full ${
							isNarrating
								? "bg-green-500 dark:bg-green-400"
								: "bg-slate-500 dark:bg-slate-400"
						} ${isNarrating ? "animate-pulse" : ""}`}></div>
					<span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
						AI Interviewer
					</span>
				</div>

				{isNarrating && <AudioWaveform isActive={isNarrating} />}
			</div>
			<p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
				<span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full me-2">
					Q{questionNumber + 1}
				</span>
				{question}
			</p>
		</div>
	);
};

export default QuestionCard;
