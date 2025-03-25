import React, {useEffect, useState} from "react";
import {
	BsLightbulb,
	BsQuestionCircle,
	BsShieldCheck,
	BsStars,
} from "react-icons/bs";
import {
	FaBriefcase,
	FaChartBar,
	FaChartLine,
	FaCode,
	FaEnvelope,
	FaFileAlt,
	FaGraduationCap,
	FaProjectDiagram,
	FaUser,
} from "react-icons/fa";
import {MdOutlineVerifiedUser, MdPendingActions} from "react-icons/md";
import {RiFileList3Line} from "react-icons/ri";
import AnswerAccodian from "../components/AnswerAccodian";
import UploadButton from "../components/UploadButton";
import {useAuth} from "../context/AuthContext";
import {useBackend} from "../context/BackendContext";
import {useCloudinary} from "../context/CloudinaryProvider";
import {useInterview} from "../context/InterviewContext";
import UserIcon from "../components/UserIcon";
import PdfThumbnail from "../components/PdfThumbnail";
import {showToast} from "../utils/toast";
import {useNavigate} from "react-router-dom";
import VideoAnalysis from "../components/feedback/VideoAnalysis";
import QuestionFeedbackItem from "../components/feedback/QuestionFeedbackItem";
import JobDetailsSection from "../components/feedback/JobDetailsSection";
import ResumeFeedback from "../components/feedback/ResumeFeedback";
import OverallFeedback from "../components/feedback/OverallFeedback";
import TechnicalFeedback from "../components/feedback/TechnicalFeedback";
const UserProfileDashboard = () => {
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedFeedback, setSelectedFeedback] = useState(null);
	const [activeTab, setActiveTab] = useState("questions");
	// In your component file
	const [isDeleting, setIsDeleting] = useState({});
	const {uploadToCloudinary} = useCloudinary();
	const {uploadResume, deleteResume} = useBackend();
	const {startInterview} = useInterview();
	const auth = useAuth();
	const {isAuthenticated} = useAuth();
	const navigate = useNavigate();
	console.log(userData);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const response = await auth.getUser();
				setUserData(response);
				setLoading(false);
			} catch (err) {
				setError("Failed to load user data");
				setLoading(false);
				console.error("Error fetching user data:", err);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
				<p>{error}</p>
			</div>
		);
	}

	if (!userData) {
		return null;
	}

	const {
		name,
		email,
		role,
		isEmailVerified,
		preferences,
		interviews,
		interviewStats,
		resumes,
	} = userData;

	let lastInterview = null;
	let formatFeedbackItems = () => [];
	if (interviews && interviews.length > 0) {
		for (let i = interviews.length - 1; i >= 0; i--) {
			if (interviews[i].isCompleted) {
				lastInterview = interviews[i];
				formatFeedbackItems = () => {
					return lastInterview.questions.map((question, idx) => ({
						questionNumber: idx + 1,
						question,
						answer:
							lastInterview.answers[idx] ||
							"Answer not available",
						feedback:
							(lastInterview.feedbacks &&
								lastInterview.feedbacks[idx]?.feedback) ||
							"Feedback not available",
						perfectAnswer:
							(lastInterview.feedbacks &&
								lastInterview.feedbacks[idx]?.perfect_answer) ||
							"Not available",
						score:
							(lastInterview.feedbacks &&
								lastInterview.feedbacks[idx]?.score) ||
							0,
					}));
				};
				break;
			}
		}
	}

	const handleResumeSubmit = async (file) => {
		const uploadResult = await uploadToCloudinary(file);
		console.log(uploadResult);
		let res = await uploadResume(uploadResult);
		setUserData((prev) => {
			return {
				...prev,
				resumes: [...userData.resumes, res],
			};
		});
	};
	const handleDeleteResume = async (resume) => {
		try {
			setIsDeleting((prev) => ({...prev, [resume._id]: true}));

			await deleteResume(resume._id, resume.public_id);

			// Update the UI by removing the deleted resume from state
			setUserData((prev) => {
				return {
					...prev,
					resumes: prev.resumes.filter((r) => r._id !== resume._id),
				};
			});
		} catch (error) {
			showToast.error(error.message || "Failed to delete resume");
			// No need to add resume back as we're using the original state
		} finally {
			setIsDeleting((prev) => ({...prev, [resume._id]: false}));
		}
	};

	const reattemptInterview = async () => {
		if (lastInterview == null) return;
		if (!isAuthenticated) {
			alert("Please log in to start an interview.");
			return;
		}
		// setIsLoading(true);
		navigate("/interview");
		try {
			let result = await startInterview(
				lastInterview.jobDetails.level,
				lastInterview.jobDetails.description,
				lastInterview.jobDetails.tags,
				lastInterview.jobDetails.features
			);

			if (result.length == 0) navigate("/selectinterview");
		} catch (error) {
			setError("Failed to start interview. Please try again.");
			console.error("Interview selection error:", error);
		} finally {
			// setIsLoading(false);
		}
	};

	// Tab system content renderer
	const renderTabContent = () => {
		if (!lastInterview) return null;

		switch (activeTab) {
			case "questions":
				return (
					<div className="space-y-4">
						<TechnicalFeedback
							dataReady={true}
							feedbackItems={formatFeedbackItems()}
							selectedFeedback={selectedFeedback}
							setSelectedFeedback={setSelectedFeedback}
						/>
					</div>
				);
			case "resume":
				return (
					<ResumeFeedback
						resumeResult={lastInterview.resumeResult}
						dataReady={true}
					/>
				);
			case "overall":
				return (
					<OverallFeedback
						overallResult={lastInterview.overallResult}
						dataReady={true}
					/>
				);
			case "jobDetails":
				return (
					<div className="space-y-6">
						<JobDetailsSection
							jobDetails={lastInterview.jobDetails}
						/>
					</div>
				);
			case "video":
				return (
					// Video Evaluation
					<div className="space-y-6">
						<VideoAnalysis
							videoAnalysisResult={lastInterview.videoResult}
						/>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
			<div className="max-w-5xl mx-auto">
				{/* Profile Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
					{/* Header & Profile */}
					<div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 px-8 py-10 text-white">
						<div className="flex items-center">
							<UserIcon
								name={userData?.name || null}
								profileImage={userData?.profileImage || null}
								size={4}
								border={false}
							/>
							<div className="ml-6">
								<h1 className="text-3xl font-bold">{name}</h1>
								<div className="flex items-center text-blue-100 mt-2">
									<FaEnvelope className="mr-2" />
									<span>{email}</span>
									{isEmailVerified ? (
										<MdOutlineVerifiedUser className="ml-2 text-green-400" />
									) : (
										<MdPendingActions className="ml-2 text-yellow-300" />
									)}
								</div>
							</div>
						</div>
						<div className="mt-6 flex flex-wrap">
							<div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-sm mr-3 mb-2 flex items-center">
								<FaBriefcase className="mr-2" />
								{role}
							</div>
							<div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-sm mr-3 mb-2 flex items-center">
								<FaCode className="mr-2" />
								{preferences?.interviewDifficulty ||
									"intermediate"}
							</div>
						</div>
					</div>

					{/* Stats */}
					<div className="p-8">
						<h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
							<FaChartLine className="mr-3 text-blue-500 dark:text-blue-400" />
							Performance Overview
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 shadow-sm">
								<div className="text-blue-600 dark:text-blue-300 mb-2 font-medium">
									Total Interviews
								</div>
								<div className="text-3xl font-bold text-gray-800 dark:text-white">
									{interviews ? interviews.length : 0}
								</div>
							</div>
							<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 shadow-sm">
								<div className="text-green-600 dark:text-green-300 mb-2 font-medium">
									Performance Score
								</div>
								<div className="text-3xl font-bold text-gray-800 dark:text-white">
									{interviews
										? +(
												interviews.reduce(
													(prev, curr) => {
														let result = prev;
														if (
															curr &&
															curr.overallResult &&
															curr.overallResult
																.evaluation &&
															curr.overallResult
																.evaluation
																.overall_score
														) {
															result +=
																curr
																	.overallResult
																	.evaluation
																	.overall_score;
														}
														return result;
													},
													0
												) / interviews.length
										  ).toFixed(2)
										: 0}
									/10
								</div>
							</div>
							<div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-5 shadow-sm">
								<div className="text-indigo-600 dark:text-indigo-300 mb-2 font-medium">
									Latest Interview
								</div>
								<div className="text-xl font-medium text-gray-800 dark:text-white">
									{lastInterview
										? new Date(
												lastInterview.createdAt
										  ).toLocaleDateString()
										: "None yet"}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Latest Interview Results with Tabs */}
				{lastInterview && (
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
						{/* Header */}
						<div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
							<div>
								<h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-white">
									<BsShieldCheck className="mr-3 text-blue-500 dark:text-blue-400" />
									Latest Interview Results
								</h2>
								<div className="text-gray-500 dark:text-gray-400 mt-1">
									{new Date(
										lastInterview.createdAt
									).toLocaleDateString()}
								</div>
							</div>

							<button
								onClick={() =>
									reattemptInterview(
										lastInterview.interviewTypeIndex || 0
									)
								}
								className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center">
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Reattempt
								</>
							</button>
						</div>

						{/* Tab Navigation */}
						<div className="border-b border-gray-200 dark:border-gray-700">
							<nav className="flex overflow-x-auto px-6">
								<button
									onClick={() => setActiveTab("jobDetails")}
									className={`px-5 py-4 font-medium text-sm border-b-2 ${
										activeTab === "jobDetails"
											? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
									}`}>
									Job Details
								</button>
								<button
									onClick={() => setActiveTab("questions")}
									className={`px-5 py-4 font-medium text-sm border-b-2 ${
										activeTab === "questions"
											? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
									}`}>
									Questions & Answers
								</button>
								<button
									onClick={() => setActiveTab("resume")}
									className={`px-5 py-4 font-medium text-sm border-b-2 ${
										activeTab === "resume"
											? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
									}`}>
									Resume Feedback
								</button>
								<button
									onClick={() => setActiveTab("overall")}
									className={`px-5 py-4 font-medium text-sm border-b-2 ${
										activeTab === "overall"
											? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
									}`}>
									Overall Evaluation
								</button>
								<button
									onClick={() => setActiveTab("video")}
									className={`px-5 py-4 font-medium text-sm border-b-2 ${
										activeTab === "video"
											? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
											: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
									}`}>
									Video
								</button>
							</nav>
						</div>

						{/* Tab Content */}
						<div className="p-8">{renderTabContent()}</div>
					</div>
				)}

				{/* Resumes */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
					<div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-white">
							<FaGraduationCap className="mr-3 text-blue-500 dark:text-blue-400" />
							Your Resumes
						</h2>
						<UploadButton onFileSelect={handleResumeSubmit} />
					</div>
					<div className="p-8">
						{resumes && resumes.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{resumes.map((resume) => (
									<div
										key={resume._id}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
										<div
											className="flex items-center mb-3"
											onClick={() =>
												window.open(
													`${resume.url}`,
													"_blank"
												)
											}>
											<div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg cursor-pointer">
												<PdfThumbnail
													url={resume.url}
												/>
											</div>
											<span className="font-medium ml-3 line-clamp-1 overflow-ellipsis text-gray-800 dark:text-white">
												{resume.filename ||
													"untitled_fe"}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Last updated: Recently
											</div>
											{isDeleting[resume._id] ? (
												<button
													className="flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-not-allowed"
													disabled>
													<svg
														className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
														xmlns="http://www.w3.org/2000/svg"
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
													Deleting...
												</button>
											) : (
												<button
													onClick={(e) => {
														e.stopPropagation();
														if (
															window.confirm(
																"Are you sure you want to delete this resume? This action is irreversible."
															)
														) {
															handleDeleteResume(
																resume
															);
														}
													}}
													className="flex items-center px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-colors">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 mr-1"
														viewBox="0 0 20 20"
														fill="currentColor">
														<path
															fillRule="evenodd"
															d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
															clipRule="evenodd"
														/>
													</svg>
													Delete
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
								<FaFileAlt className="mx-auto h-10 w-10 mb-4 opacity-50" />
								<p className="font-medium">No resumes found</p>
								<p className="mt-2 text-sm">
									Upload your resume to get feedback
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfileDashboard;
