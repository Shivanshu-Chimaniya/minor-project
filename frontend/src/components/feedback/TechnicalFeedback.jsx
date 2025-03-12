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
	overallResult,
}) => (
	<div className="p-6 grid grid-cols-1 gap-6">
		{/* Question Feedback Section */}
		<div>
			<h2 className="text-xl font-bold text-gray-800 mb-4">
				Question Feedback
			</h2>
			<div className="space-y-4">
				{dataReady.technicalFeedback ? (
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

		{/* Strengths and Weaknesses Section */}
		<StrengthsWeaknesses
			isDataReady={dataReady.technicalOverview}
			strengths={overallResult?.evaluation?.strengths || []}
			weaknesses={overallResult?.evaluation?.weaknesses || []}
		/>
	</div>
);

export default TechnicalFeedback;
