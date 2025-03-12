import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInterview} from "../context/InterviewContext";
import TechnicalFeedback from "../components/feedback/TechnicalFeedback";
import ResumeFeedback from "../components/feedback/ResumeFeedback";
import FeedbackHeader from "../components/feedback/FeedbackHeader";
import LoadingIndicator from "../components/LoadingIndicator";
import FinalVerdict from "../components/feedback/FinalVerdict";

const FeedbackSummaryPage = () => {
	const navigate = useNavigate();
	const {
		questions,
		answers,
		overallResult,
		resumeResult,
		feedbacks,
		questionsLoaded,
	} = useInterview();

	const [selectedFeedback, setSelectedFeedback] = useState(null);
	const [activeTab, setActiveTab] = useState("technical");
	const [dataReady, setDataReady] = useState({
		technicalOverview: false,
		technicalFeedback: false,
		resume: false,
	});
	const [feedbackItems, setFeedbackItems] = useState([]);

	// Redirect if no data is available
	useEffect(() => {
		if (!questionsLoaded()) {
			navigate("/selectinterview");
			return;
		}
	}, [questionsLoaded, navigate]);

	// Process feedback items when they're available
	useEffect(() => {
		if (feedbacks && Object.keys(feedbacks).length > 0) {
			setDataReady((prev) => ({...prev, technicalFeedback: true}));

			const newFeedbackItems = Object.keys(feedbacks).map((key) => {
				const item = feedbacks[key];
				const index = parseInt(key);

				return {
					questionNumber: index + 1,
					question: questions[index] || "Question not available",
					answer: answers[index] || "Answer not available",
					score: item.score,
					feedback: item.feedback,
					perfectAnswer: item.perfect_answer,
				};
			});

			setFeedbackItems(newFeedbackItems);
		}
	}, [feedbacks, questions, answers]);

	// Process overall evaluation when it's available
	useEffect(() => {
		if (
			overallResult &&
			overallResult.evaluation &&
			typeof overallResult.evaluation.overall_score !== "undefined"
		) {
			setDataReady((prev) => ({...prev, technicalOverview: true}));
		}
	}, [overallResult]);

	// Process resume data when it's available
	useEffect(() => {
		if (resumeResult && typeof resumeResult.score !== "undefined") {
			setDataReady((prev) => ({...prev, resume: true}));
		}
	}, [resumeResult]);

	// Check if any tab data is loaded to determine if global loading should be shown
	const isAnyDataLoaded =
		dataReady.technicalOverview ||
		dataReady.technicalFeedback ||
		dataReady.resume;

	// Check if current active tab data is ready
	const isTechnicalTabPartiallyReady =
		dataReady.technicalOverview || dataReady.technicalFeedback;

	const isActiveTabPartiallyReady =
		activeTab === "technical"
			? isTechnicalTabPartiallyReady
			: dataReady.resume;

	// Early return for loading state
	if (!questionsLoaded() || Object.keys(answers).length === 0) {
		return <LoadingIndicator />;
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 text-gray-800 dark:text-gray-100">
			<div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
				<FeedbackHeader
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					dataReady={dataReady}
					overallResult={overallResult}
					resumeResult={resumeResult}
				/>

				{/* Display a message when active tab has no data loaded at all */}
				{!isActiveTabPartiallyReady && isAnyDataLoaded && (
					<TabLoadingMessage activeTab={activeTab} />
				)}

				{activeTab === "technical" && (
					<>
						<FinalVerdict
							dataReady={dataReady.technicalOverview}
							verdict={overallResult?.evaluation?.final_verdict}
						/>

						<TechnicalFeedback
							dataReady={dataReady}
							feedbackItems={feedbackItems}
							selectedFeedback={selectedFeedback}
							setSelectedFeedback={setSelectedFeedback}
							overallResult={overallResult}
						/>
					</>
				)}

				{activeTab === "resume" && (
					<ResumeFeedback
						dataReady={dataReady.resume}
						resumeResult={resumeResult}
					/>
				)}

				{/* Global loading indicator - only shown when no tab data is loaded */}
				{!isAnyDataLoaded && <GlobalLoadingIndicator />}
			</div>
		</div>
	);
};

const TabLoadingMessage = ({activeTab}) => (
	<div className="p-6 text-center">
		<div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
			<div className="flex items-center">
				<svg
					className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2 animate-spin"
					fill="none"
					viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span className="text-blue-700 dark:text-blue-300 font-medium">
					Loading {activeTab === "technical" ? "technical" : "resume"}{" "}
					data...
				</span>
			</div>
			<p className="text-blue-600 dark:text-blue-400 text-sm mt-2">
				You can switch to the{" "}
				{activeTab === "technical" ? "resume" : "technical"} tab which
				is ready to view.
			</p>
		</div>
	</div>
);

const GlobalLoadingIndicator = () => (
	<div className="flex justify-center items-center py-12">
		<div className="text-center">
			<div className="flex justify-center space-x-2 mb-4">
				<div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
				<div
					className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
					style={{animationDelay: "0.2s"}}></div>
				<div
					className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
					style={{animationDelay: "0.4s"}}></div>
			</div>
			<p className="text-gray-600 dark:text-gray-300 font-medium">
				Loading evaluation data...
			</p>
		</div>
	</div>
);

export default FeedbackSummaryPage;
