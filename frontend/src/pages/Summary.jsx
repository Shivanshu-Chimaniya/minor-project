import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInterview} from "../context/InterviewContext";
import LoadingIndicator from "../components/LoadingIndicator";
import FeedbackHeader from "../components/feedback/FeedbackHeader";
import FinalVerdict from "../components/feedback/FinalVerdict";
import TechnicalFeedback from "../components/feedback/TechnicalFeedback";
import ResumeFeedback from "../components/feedback/ResumeFeedback";
import JobDetailsSection from "../components/feedback/JobDetailsSection";
import VideoAnalysis from "../components/feedback/VideoAnalysis"; // Added import for VideoAnalysis
import {BsShieldCheck} from "react-icons/bs";
import {FaExclamationTriangle} from "react-icons/fa";
import OverallFeedback from "../components/feedback/OverallFeedback";

const FeedbackSummaryPage = () => {
	const navigate = useNavigate();
	const {
		questions,
		answers,
		overallResult,
		resumeResult,
		feedbacks,
		questionsLoaded,
		jobDetails,
		videoAnalysisResult,
	} = useInterview();

	// Combined main and sub-tabs into a single state
	const [activeTab, setActiveTab] = useState("jobDetails");
	const [selectedFeedback, setSelectedFeedback] = useState(null);

	// Track data loading and error states
	const [dataState, setDataState] = useState({
		technicalOverview: {loading: true, error: false},
		technicalFeedback: {loading: true, error: false},
		resume: {loading: true, error: false},
		jobDetails: {loading: false, error: false},
		videoAnalysis: {loading: true, error: false}, // Added videoAnalysis state
	});

	// Redirect if no data is available
	useEffect(() => {
		if (!questionsLoaded()) {
			navigate("/selectinterview");
			return;
		}
	}, [questionsLoaded, navigate]);

	// Process feedback items when they're available
	useEffect(() => {
		if (feedbacks === null) {
			setDataState((prev) => ({
				...prev,
				technicalFeedback: {loading: false, error: true},
			}));
		} else if (feedbacks && Object.keys(feedbacks).length > 0) {
			setDataState((prev) => ({
				...prev,
				technicalFeedback: {loading: false, error: false},
			}));
		}
	}, [feedbacks]);

	// Process overall evaluation when it's available
	useEffect(() => {
		if (overallResult === null) {
			setDataState((prev) => ({
				...prev,
				technicalOverview: {loading: false, error: true},
			}));
		} else if (
			overallResult &&
			overallResult.evaluation &&
			typeof overallResult.evaluation.overall_score !== "undefined"
		) {
			setDataState((prev) => ({
				...prev,
				technicalOverview: {loading: false, error: false},
			}));
		}
	}, [overallResult]);

	// Process resume data when it's available
	useEffect(() => {
		if (resumeResult === null) {
			setDataState((prev) => ({
				...prev,
				resume: {loading: false, error: true},
			}));
		} else if (resumeResult && typeof resumeResult.score !== "undefined") {
			setDataState((prev) => ({
				...prev,
				resume: {loading: false, error: false},
			}));
		}
	}, [resumeResult]);

	// Process job details when they're available
	useEffect(() => {
		if (jobDetails === null) {
			setDataState((prev) => ({
				...prev,
				jobDetails: {loading: false, error: true},
			}));
		} else if (jobDetails) {
			setDataState((prev) => ({
				...prev,
				jobDetails: {loading: false, error: false},
			}));
		}
	}, [jobDetails]);

	// Process video analysis when it's available
	useEffect(() => {
		if (videoAnalysisResult === null) {
			setDataState((prev) => ({
				...prev,
				videoAnalysis: {loading: false, error: true},
			}));
		} else if (videoAnalysisResult) {
			setDataState((prev) => ({
				...prev,
				videoAnalysis: {loading: false, error: false},
			}));
		}
	}, [videoAnalysisResult]);

	// Format feedback items for the TechnicalFeedback component
	const formatFeedbackItems = () => {
		return questions.map((question, idx) => ({
			questionNumber: idx + 1,
			question,
			answer: answers[idx] || "Answer not available",
			feedback:
				(feedbacks && feedbacks[idx]?.feedback) ||
				"Feedback not available",
			perfectAnswer:
				(feedbacks && feedbacks[idx]?.perfect_answer) ||
				"Not available",
			score: (feedbacks && feedbacks[idx]?.score) || 0,
		}));
	};

	// Early return for loading state
	if (!questionsLoaded() || Object.keys(answers).length === 0) {
		return <LoadingIndicator />;
	}

	// Render error message
	const renderErrorMessage = (section) => (
		<div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
			<div className="flex items-center text-red-700 dark:text-red-400">
				<FaExclamationTriangle className="mr-2" />
				<span>
					Error loading {section} data. Please try again later.
				</span>
			</div>
		</div>
	);

	// Get score display for tabs
	const getTechnicalScore = () => {
		if (
			dataState.technicalOverview.loading ||
			!overallResult?.evaluation?.overall_score
		) {
			return "";
		}
		const score = overallResult.evaluation.overall_score;
		return ` (${score}/10)`;
	};

	const getResumeScore = () => {
		if (dataState.resume.loading || !resumeResult?.score) {
			return "";
		}
		return ` (${resumeResult.score}/10)`;
	};

	const getFeedbackScore = () => {
		if (dataState.technicalFeedback.loading || !feedbacks) {
			return "";
		}
		const totalScore = Object.values(feedbacks).reduce(
			(sum, item) => sum + (item.score || 0),
			0
		);
		const averageScore = (
			totalScore / Object.values(feedbacks).length
		).toFixed(1);
		return ` (${averageScore}/10)`;
	};

	// Get video analysis score for tab
	const getVideoAnalysisScore = () => {
		if (
			dataState.videoAnalysis.loading ||
			!videoAnalysisResult?.overall_score
		) {
			return "";
		}
		return ` (${videoAnalysisResult.overall_score}/10)`;
	};

	// Render content based on active tab
	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return dataState.technicalOverview.error ? (
					renderErrorMessage("technical overview")
				) : (
					<OverallFeedback
						overallResult={overallResult}
						dataReady={!dataState.technicalOverview.loading}
						verdict={overallResult?.evaluation?.final_verdict}
					/>
				);
			case "feedbacks":
				return dataState.technicalFeedback.error ? (
					renderErrorMessage("question feedback")
				) : (
					<TechnicalFeedback
						dataReady={!dataState.technicalFeedback.loading}
						feedbackItems={formatFeedbackItems()}
						selectedFeedback={selectedFeedback}
						setSelectedFeedback={setSelectedFeedback}
					/>
				);
			case "jobDetails":
				return dataState.jobDetails.error ? (
					renderErrorMessage("job details")
				) : (
					<JobDetailsSection
						jobDetails={jobDetails}
						isLoading={dataState.jobDetails.loading}
					/>
				);
			case "resume":
				return dataState.resume.error ? (
					renderErrorMessage("resume")
				) : (
					<ResumeFeedback
						dataReady={!dataState.resume.loading}
						resumeResult={resumeResult}
					/>
				);
			case "videoAnalysis":
				return dataState.videoAnalysis.error ? (
					renderErrorMessage("video analysis")
				) : (
					<VideoAnalysis
						dataReady={!dataState.videoAnalysis.loading}
						videoAnalysisResult={videoAnalysisResult}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="bg-gray-50 pt-6 dark:bg-gray-900 min-h-[90vh] text-gray-800 dark:text-gray-100">
			<div className="lg:w-5xl md:w-3xl sm:w-xl w-[100%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
				{/* Header */}
				<div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-white">
						<BsShieldCheck className="mr-3 text-blue-500 dark:text-blue-400" />
						Interview Results
					</h2>
					<div className="text-gray-500 dark:text-gray-400 mt-1">
						{new Date().toLocaleDateString()}
					</div>
				</div>

				{/* Combined Tab Navigation */}
				<div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
					<div className="flex flex-wrap space-x-4">
						<TabButton
							isActive={activeTab === "jobDetails"}
							onClick={() => setActiveTab("jobDetails")}
							label="Job Details"
							className="text-orange-600"
						/>
						<TabButton
							isActive={activeTab === "feedbacks"}
							onClick={() => setActiveTab("feedbacks")}
							label={`Feedback${getFeedbackScore()}`}
							className="text-green-600"
						/>
						<TabButton
							isActive={activeTab === "overview"}
							onClick={() => setActiveTab("overview")}
							label={`Overall${getTechnicalScore()}`}
							className="text-blue-600"
						/>
						<TabButton
							isActive={activeTab === "resume"}
							onClick={() => setActiveTab("resume")}
							label={`Resume${getResumeScore()}`}
							className="text-purple-600"
						/>
						<TabButton
							isActive={activeTab === "videoAnalysis"}
							onClick={() => setActiveTab("videoAnalysis")}
							label={`Video${getVideoAnalysisScore()}`}
							className="text-red-600"
						/>
					</div>
				</div>

				{/* Tab Content */}
				{renderTabContent()}
			</div>
		</div>
	);
};

// Unified Tab Button Component
const TabButton = ({isActive, onClick, label, className}) => (
	<button
		className={`py-3 px-3 font-medium transition-all duration-200 ${
			isActive
				? `border-b-2 ${className} dark:${className}`
				: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
		}`}
		onClick={onClick}>
		{label}
	</button>
);

export default FeedbackSummaryPage;
