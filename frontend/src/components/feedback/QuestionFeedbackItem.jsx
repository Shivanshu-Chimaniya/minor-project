import React from "react";
import {getScoreColor} from "../../utils/scoreUtils";

const QuestionFeedbackItem = ({item, isSelected, onToggle}) => (
	<div
		className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-700"
		onClick={onToggle}>
		<div className="p-4 flex justify-between items-center">
			<div>
				<h3 className="font-semibold text-gray-700 dark:text-gray-200">
					Question {item.questionNumber}
				</h3>
				<p
					className={`text-gray-500 dark:text-gray-400 text-sm mt-1 ${
						isSelected ? " " : "line-clamp-1"
					}`}>
					{item.question}
				</p>
			</div>
			<div className="flex items-center">
				<span
					className={`text-lg font-bold ${getScoreColor(
						item.score,
						true
					)}`}>
					{item.score}
				</span>
				<svg
					className={`ml-2 w-5 h-5 transition-transform text-gray-600 dark:text-gray-300 ${
						isSelected ? "transform rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"></path>
				</svg>
			</div>
		</div>

		{isSelected && (
			<div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
				<div className="mb-3">
					<h4 className="font-medium text-gray-700 dark:text-gray-200">
						Your Answer:
					</h4>
					<p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
						{item.answer}
					</p>
				</div>

				<div className="mb-3">
					<h4 className="font-medium text-gray-700 dark:text-gray-200">
						Feedback:
					</h4>
					<p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
						{item.feedback}
					</p>
				</div>

				<div>
					<h4 className="font-medium text-gray-700 dark:text-gray-200">
						Ideal Answer:
					</h4>
					<p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
						{item.perfectAnswer}
					</p>
				</div>
			</div>
		)}
	</div>
);

export default QuestionFeedbackItem;
