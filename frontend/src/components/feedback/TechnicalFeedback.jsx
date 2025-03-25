// file: components/feedback/TechnicalFeedback.jsx
import React from "react";
import SkeletonLoader from "../SkeletonLoader";
import QuestionFeedbackItem from "./QuestionFeedbackItem";
import StrengthsWeaknesses from "./StrengthsWeaknesses";

const TechnicalFeedback = ({
	dataReady,
	feedbackItems,
	selectedFeedback,
	setSelectedFeedback,
}) => {
	console.log(feedbackItems);
	return (
		<div className="p-6 grid grid-cols-1 gap-6">
			{/* Question Feedback Section */}
			<div>
				<h2 className="text-xl dark:text-white font-bold text-gray-800 mb-4">
					Question Feedback
				</h2>
				<div className="space-y-4">
					{dataReady ? (
						feedbackItems.map((item) => (
							<QuestionFeedbackItem
								key={item.questionNumber}
								item={item}
								isSelected={
									selectedFeedback === item.questionNumber
								}
								onToggle={() =>
									setSelectedFeedback(
										selectedFeedback === item.questionNumber
											? null
											: item.questionNumber
									)
								}
							/>
						))
					) : (
						<SkeletonLoader type="card" count={3} />
					)}
				</div>
			</div>
		</div>
	);
};

export default TechnicalFeedback;
