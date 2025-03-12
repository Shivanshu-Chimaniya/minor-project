import React from "react";
import ScoreCard from "../ScoreCard";

const FeedbackHeader = ({
	activeTab,
	setActiveTab,
	dataReady,
	overallResult,
	resumeResult,
}) => (
	<div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
		<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
			Candidate Evaluation Summary
		</h1>

		<div className="mt-6 border-b border-gray-200 dark:border-gray-700">
			<div className="flex space-x-8">
				<TabButton
					isActive={activeTab === "technical"}
					onClick={() => setActiveTab("technical")}
					title="Technical Score"
					score={
						dataReady.technicalOverview
							? overallResult.evaluation.overall_score
							: 0
					}
					isLoading={!dataReady.technicalOverview}
				/>
				<TabButton
					isActive={activeTab === "resume"}
					onClick={() => setActiveTab("resume")}
					title="Resume Score"
					score={dataReady.resume ? resumeResult.score : 0}
					isLoading={!dataReady.resume}
				/>
			</div>
		</div>
	</div>
);

const TabButton = ({isActive, onClick, title, score, isLoading}) => (
	<button
		className={`py-2 px-1 font-medium transition-all duration-200 ${
			isActive
				? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 scale-105 transform"
				: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
		}`}
		onClick={onClick}>
		<div className="relative">
			<ScoreCard title={title} score={score} isLoading={isLoading} />
			{isLoading && (
				<span className="absolute top-0 right-0 flex h-3 w-3">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-blue-500 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 dark:bg-blue-400"></span>
				</span>
			)}
			{isActive && (
				<span className="absolute -bottom-2 left-0 right-0 mx-auto w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-blue-500 dark:border-blue-400"></span>
			)}
		</div>
	</button>
);

export default FeedbackHeader;
