import React, {useState} from "react";
import {FaChevronDown} from "react-icons/fa";

const AnswerAccordion = ({question, idx, lastInterview}) => {
	const [isOpen, setIsOpen] = useState(false);
	const score = lastInterview.feedbacks[idx].score;

	// Score color variants
	const getScoreColorClasses = (score) => {
		if (score > 7) {
			return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
		} else if (score > 4) {
			return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
		} else {
			return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
		}
	};

	return (
		<div
			key={idx}
			className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800/50">
			{/* Accordion Header - Always visible */}
			<div
				className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
				onClick={() => setIsOpen(!isOpen)}>
				<div className="flex items-center flex-1 mr-3">
					<span className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 text-xs px-2 py-1 rounded-full mr-3 font-medium">
						Q{idx + 1}
					</span>
					<p
						className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${
							!isOpen && "line-clamp-1 text-ellipsis"
						}`}>
						{question}
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<span
						className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${getScoreColorClasses(
							score
						)}`}>
						Score: {score}/10
					</span>
					<div
						className={`transition-transform duration-200 ${
							isOpen ? "rotate-180" : ""
						}`}>
						<FaChevronDown className="text-gray-500 dark:text-gray-400" />
					</div>
				</div>
			</div>

			{/* Accordion Content - Shown when expanded */}
			{isOpen && (
				<div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
					{/* Your Answer */}
					<div className="p-4">
						<h4 className="font-medium text-sm mb-2 text-gray-600 dark:text-gray-400">
							Your Answer
						</h4>
						<p className="text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
							{lastInterview.answers[idx]}
						</p>
					</div>

					{/* Feedback */}
					<div className="p-4">
						<h4 className="font-medium text-sm mb-2 text-gray-600 dark:text-gray-400">
							Feedback
						</h4>
						<p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded mb-3 text-gray-800 dark:text-gray-300 border border-red-100 dark:border-red-900/30">
							{lastInterview.feedbacks[idx].feedback}
						</p>

						{/* Model Answer */}
						<div>
							<h4 className="font-medium text-sm mb-2 text-gray-600 dark:text-gray-400">
								Model Answer
							</h4>
							<p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded text-gray-800 dark:text-gray-300 border border-green-100 dark:border-green-900/30">
								{lastInterview.feedbacks[idx].perfect_answer}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AnswerAccordion;
