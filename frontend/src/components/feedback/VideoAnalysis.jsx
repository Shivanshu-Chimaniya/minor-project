import React from "react";
import {FaBrain} from "react-icons/fa";
import {
	BsEmojiSmile,
	BsEye,
	BsBodyText,
	BsMic,
	BsLightbulb,
} from "react-icons/bs";

// Behavioral Analysis Component
const VideoAnalysis = ({dataReady = true, videoAnalysisResult}) => {
	// Helper function to convert snake_case to Title Case with spaces
	const formatText = (text) => {
		if (!text) return "";
		return text
			.replace(/_/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	// Helper function to get emotion color
	const getEmotionColor = (emotion) => {
		const emotionColors = {
			neutral: "text-gray-500 dark:text-gray-400",
			happy: "text-green-500 dark:text-green-400",
			anxious: "text-amber-500 dark:text-amber-400",
			confident: "text-blue-500 dark:text-blue-400",
			confused: "text-purple-500 dark:text-purple-400",
			stressed: "text-red-500 dark:text-red-400",
		};
		return emotionColors[emotion] || "text-gray-500 dark:text-gray-400";
	};

	// Helper function to get level color
	const getLevelColor = (level, isPositive = true) => {
		const positiveColors = {
			none: "text-red-500 dark:text-red-400",
			very_low: "text-red-500 dark:text-red-400",
			low: "text-orange-500 dark:text-orange-400",
			minimal: "text-green-500 dark:text-green-400",
			some: "text-amber-500 dark:text-amber-400",
			medium: "text-amber-500 dark:text-amber-400",
			moderate: "text-amber-500 dark:text-amber-400",
			high: "text-green-500 dark:text-green-400",
			very_high: "text-blue-500 dark:text-blue-400",
			frequent: "text-red-500 dark:text-red-400",
			excessive: "text-red-500 dark:text-red-400",
		};

		const negativeColors = {
			none: "text-green-500 dark:text-green-400",
			very_low: "text-green-500 dark:text-green-400",
			low: "text-green-500 dark:text-green-400",
			minimal: "text-green-500 dark:text-green-400",
			some: "text-amber-500 dark:text-amber-400",
			medium: "text-amber-500 dark:text-amber-400",
			moderate: "text-orange-500 dark:text-orange-400",
			high: "text-red-500 dark:text-red-400",
			very_high: "text-red-500 dark:text-red-400",
			frequent: "text-red-500 dark:text-red-400",
			excessive: "text-red-500 dark:text-red-400",
		};

		return isPositive
			? positiveColors[level] || "text-gray-500 dark:text-gray-400"
			: negativeColors[level] || "text-gray-500 dark:text-gray-400";
	};

	// Loading state
	if (!dataReady) {
		return (
			<div className="p-6">
				<div className="animate-pulse">
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
					<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
					<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
					<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
				</div>
			</div>
		);
	}

	// Error state or no data
	if (!videoAnalysisResult) {
		return (
			<div className="p-6 text-center">
				<div className="text-gray-500 dark:text-gray-400">
					<FaBrain className="mx-auto text-4xl mb-3 opacity-30" />
					<p>Behavioral analysis data is not available.</p>
				</div>
			</div>
		);
	}
	console.log(videoAnalysisResult);
	const {analysis, summary} = videoAnalysisResult;
	console.log(analysis, summary);

	return (
		<div className="p-6">
			{/* Analysis Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				{/* Facial Expressions Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<BsEmojiSmile className="mr-2 text-blue-500 dark:text-blue-400" />
							Facial Expressions
						</h3>
					</div>
					<div className="p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Dominant Emotion
								</div>
								<div
									className={`font-medium ${getEmotionColor(
										analysis.facial_expressions
											.dominant_emotion
									)}`}>
									{formatText(
										analysis.facial_expressions
											.dominant_emotion
									)}
								</div>
							</div>
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Emotion Variability
								</div>
								<div className="font-medium text-gray-800 dark:text-gray-200">
									{formatText(
										analysis.facial_expressions
											.emotion_variability
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Eye Contact Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<BsEye className="mr-2 text-green-500 dark:text-green-400" />
							Eye Contact
						</h3>
					</div>
					<div className="p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Consistency
								</div>
								<div
									className={`font-medium ${getLevelColor(
										analysis.eye_contact.consistency
									)}`}>
									{formatText(
										analysis.eye_contact.consistency
									)}
								</div>
							</div>
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Distraction Level
								</div>
								<div
									className={`font-medium ${getLevelColor(
										analysis.eye_contact.distraction_level,
										false
									)}`}>
									{formatText(
										analysis.eye_contact.distraction_level
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Body Language Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<BsBodyText className="mr-2 text-purple-500 dark:text-purple-400" />
							Body Language
						</h3>
					</div>
					<div className="p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Posture
								</div>
								<div className="font-medium text-gray-800 dark:text-gray-200">
									{formatText(analysis.body_language.posture)}
								</div>
							</div>
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Fidgeting
								</div>
								<div
									className={`font-medium ${getLevelColor(
										analysis.body_language.fidgeting,
										false
									)}`}>
									{formatText(
										analysis.body_language.fidgeting
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Speech Analysis Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<BsMic className="mr-2 text-amber-500 dark:text-amber-400" />
							Speech Analysis
						</h3>
					</div>
					<div className="p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Speaking Speed
								</div>
								<div className="font-medium text-gray-800 dark:text-gray-200">
									{formatText(
										analysis.speech_analysis.speaking_speed
									)}
								</div>
							</div>
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Hesitations
								</div>
								<div
									className={`font-medium ${getLevelColor(
										analysis.speech_analysis
											.hesitations_detected,
										false
									)}`}>
									{formatText(
										analysis.speech_analysis
											.hesitations_detected
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Confidence Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<BsLightbulb className="mr-2 text-blue-500 dark:text-blue-400" />
							Confidence
						</h3>
					</div>
					<div className="p-4">
						<div className="border border-gray-100 dark:border-gray-700 rounded p-3 mb-3 bg-gray-50 dark:bg-gray-800/70">
							<div className="text-sm text-gray-500 dark:text-gray-400">
								Overall Level
							</div>
							<div
								className={`font-medium ${getLevelColor(
									analysis.confidence.overall_level
								)}`}>
								{formatText(analysis.confidence.overall_level)}
							</div>
						</div>
						<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
							<div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
								Indicators
							</div>
							<div className="flex flex-wrap gap-2">
								{analysis.confidence.indicators.map(
									(indicator, index) => (
										<span
											key={index}
											className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
											{formatText(
												indicator.replace(/[<>]/g, "")
											)}
										</span>
									)
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Engagement Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div className="bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
							<FaBrain className="mr-2 text-red-500 dark:text-red-400" />
							Engagement
						</h3>
					</div>
					<div className="p-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Enthusiasm Level
								</div>
								<div
									className={`font-medium ${getLevelColor(
										analysis.engagement.enthusiasm_level
									)}`}>
									{formatText(
										analysis.engagement.enthusiasm_level
									)}
								</div>
							</div>
							<div className="border border-gray-100 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-800/70">
								<div className="text-sm text-gray-500 dark:text-gray-400">
									Energy Fluctuation
								</div>
								<div className="font-medium text-gray-800 dark:text-gray-200">
									{formatText(
										analysis.engagement.energy_fluctuation
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Summary Section */}
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h3 className="font-semibold text-lg text-gray-800 dark:text-white">
						Summary & Recommendations
					</h3>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Strengths */}
						<div>
							<h4 className="text-green-600 dark:text-green-400 font-medium mb-3 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"></path>
								</svg>
								Strengths
							</h4>
							<ul className="space-y-2">
								{summary.strengths.map((strength, index) => (
									<li
										key={index}
										className="flex items-start">
										<span className="inline-block w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mt-1.5 mr-2"></span>
										<span className="text-gray-700 dark:text-gray-300">
											{strength.replace(/[<>]/g, "")}
										</span>
									</li>
								))}
							</ul>
						</div>

						{/* Weaknesses */}
						<div>
							<h4 className="text-red-600 dark:text-red-400 font-medium mb-3 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"></path>
								</svg>
								Areas to Improve
							</h4>
							<ul className="space-y-2">
								{summary.weaknesses.map((weakness, index) => (
									<li
										key={index}
										className="flex items-start">
										<span className="inline-block w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 mt-1.5 mr-2"></span>
										<span className="text-gray-700 dark:text-gray-300">
											{weakness.replace(/[<>]/g, "")}
										</span>
									</li>
								))}
							</ul>
						</div>

						{/* Suggestions */}
						<div>
							<h4 className="text-blue-600 dark:text-blue-400 font-medium mb-3 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
								</svg>
								Suggestions
							</h4>
							<ul className="space-y-2">
								{summary.suggestions.map(
									(suggestion, index) => (
										<li
											key={index}
											className="flex items-start">
											<span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5 mr-2"></span>
											<span className="text-gray-700 dark:text-gray-300">
												{suggestion.replace(
													/[<>]/g,
													""
												)}
											</span>
										</li>
									)
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoAnalysis;
