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
import UserIcon from "../components/UserIcon";

const UserProfileDashboard = () => {
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("questions");
	const {uploadToCloudinary} = useCloudinary();
	const {uploadResume} = useBackend();
	const auth = useAuth();

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
	if (interviews && interviews.length > 0) {
		for (let i = interviews.length - 1; i >= 0; i--) {
			if (interviews[i].isCompleted) {
				lastInterview = interviews[i];
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

	// Tab system content renderer
	const renderTabContent = () => {
		if (!lastInterview) return null;

		switch (activeTab) {
			case "questions":
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<BsQuestionCircle className="text-purple-500 dark:text-purple-400 mr-2" />
							Questions and Answers
						</h3>
						<div className="space-y-4">
							{lastInterview.questions.map((question, idx) => (
								<AnswerAccodian
									key={idx}
									question={question}
									idx={idx}
									lastInterview={lastInterview}
								/>
							))}
						</div>
					</div>
				);
			case "resume":
				return (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<FaFileAlt className="text-blue-500 dark:text-blue-400 mr-2" />
							Resume Evaluation
						</h3>

						<div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-5 mb-5">
							<div className="flex justify-between items-center mb-3">
								<span className="text-blue-600 dark:text-blue-300 font-medium">
									Resume Score
								</span>
								<span className="font-semibold text-lg">
									{lastInterview.resumeResult
										? lastInterview.resumeResult.score
										: 0}
									/10
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
								<div
									className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full"
									style={{
										width: `${
											(lastInterview.resumeResult
												? lastInterview.resumeResult
														.score
												: 0) * 10
										}%`,
									}}></div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
							<div className="bg-white dark:bg-gray-800/40 p-5 rounded-lg shadow-sm">
								<h4 className="flex items-center text-sm font-medium mb-4">
									<BsStars className="text-green-500 dark:text-green-400 mr-2" />
									Strengths
								</h4>
								<ul className="space-y-3">
									{lastInterview.resumeResult &&
										lastInterview.resumeResult.strengths.map(
											(strength, idx) => (
												<li
													key={idx}
													className="flex items-start">
													<span className="text-green-500 dark:text-green-400 mr-2">
														✓
													</span>
													<span className="text-gray-700 dark:text-gray-300">
														{strength}
													</span>
												</li>
											)
										)}
								</ul>
							</div>
							<div className="bg-white dark:bg-gray-800/40 p-5 rounded-lg shadow-sm">
								<h4 className="flex items-center text-sm font-medium mb-4">
									<RiFileList3Line className="text-orange-500 dark:text-orange-400 mr-2" />
									Areas for Improvement
								</h4>
								<ul className="space-y-3">
									{lastInterview.resumeResult &&
										lastInterview.resumeResult.weaknesses.map(
											(weakness, idx) => (
												<li
													key={idx}
													className="flex items-start">
													<span className="text-orange-500 dark:text-orange-400 mr-2">
														•
													</span>
													<span className="text-gray-700 dark:text-gray-300">
														{weakness}
													</span>
												</li>
											)
										)}
								</ul>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800/40 p-5 rounded-lg shadow-sm">
							<h4 className="flex items-center text-sm font-medium mb-4">
								<BsLightbulb className="text-yellow-500 dark:text-yellow-400 mr-2" />
								Suggestions
							</h4>
							<ul className="space-y-3">
								{lastInterview.resumeResult &&
									lastInterview.resumeResult.suggestions.map(
										(suggestion, idx) => (
											<li
												key={idx}
												className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
												<span className="text-yellow-600 dark:text-yellow-400 mr-2">
													💡
												</span>
												<span className="text-gray-700 dark:text-gray-300">
													{suggestion}
												</span>
											</li>
										)
									)}
							</ul>
						</div>
					</div>
				);
			case "overall":
				return (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<FaChartBar className="text-indigo-500 dark:text-indigo-400 mr-2" />
							Overall Evaluation
						</h3>

						<div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-5 mb-6">
							<div className="flex justify-between items-center mb-4">
								<span className="text-indigo-600 dark:text-indigo-300 font-medium">
									Overall Score
								</span>
								<span className="font-semibold text-xl">
									{
										lastInterview.overallResult.evaluation
											.overall_score
									}
									/10
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-5">
								<div
									className={`h-3 rounded-full ${
										lastInterview.overallResult.evaluation
											.overall_score > 7
											? "bg-green-500 dark:bg-green-400"
											: lastInterview.overallResult
													.evaluation.overall_score >
											  4
											? "bg-yellow-500 dark:bg-yellow-400"
											: "bg-red-500 dark:bg-red-400"
									}`}
									style={{
										width: `${
											lastInterview.overallResult
												.evaluation.overall_score * 10
										}%`,
									}}></div>
							</div>

							<div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
								<p className="text-gray-700 dark:text-gray-300 font-medium">
									{
										lastInterview.overallResult.evaluation
											.final_verdict
									}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="bg-white dark:bg-gray-800/40 p-5 rounded-lg shadow-sm">
								<h4 className="flex items-center text-sm font-medium mb-4">
									<BsStars className="text-green-500 dark:text-green-400 mr-2" />
									Strengths
								</h4>
								<ul className="space-y-3">
									{lastInterview.overallResult.evaluation.strengths.map(
										(strength, idx) => (
											<li
												key={idx}
												className="flex items-start">
												<span className="text-green-500 dark:text-green-400 mr-2">
													✓
												</span>
												<span className="text-gray-700 dark:text-gray-300">
													{strength}
												</span>
											</li>
										)
									)}
								</ul>
							</div>
							<div className="bg-white dark:bg-gray-800/40 p-5 rounded-lg shadow-sm">
								<h4 className="flex items-center text-sm font-medium mb-4">
									<RiFileList3Line className="text-orange-500 dark:text-orange-400 mr-2" />
									Areas for Improvement
								</h4>
								<ul className="space-y-3">
									{lastInterview.overallResult.evaluation.weaknesses.map(
										(weakness, idx) => (
											<li
												key={idx}
												className="flex items-start">
												<span className="text-orange-500 dark:text-orange-400 mr-2">
													•
												</span>
												<span className="text-gray-700 dark:text-gray-300">
													{weakness}
												</span>
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					</div>
				);
			case "jobDetails":
				return (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<FaBriefcase className="text-blue-500 dark:text-blue-400 mr-2" />
							Job Details
						</h3>

						<div className="bg-white dark:bg-gray-800/40 rounded-lg p-6 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
									<FaBriefcase className="text-blue-500 dark:text-blue-400" />
								</div>
								<div className="ml-4">
									<h4 className="font-medium text-lg text-gray-800 dark:text-white">
										{lastInterview.jobDetails.level
											.charAt(0)
											.toUpperCase() +
											lastInterview.jobDetails.level.slice(
												1
											)}{" "}
										Position
									</h4>
									<p className="text-gray-500 dark:text-gray-400">
										Interview conducted on{" "}
										{new Date(
											lastInterview.createdAt
										).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div className="mt-5">
								<h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
									Job Description
								</h5>
								<div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
									<p className="text-gray-700 dark:text-gray-300">
										{lastInterview.jobDetails.description}
									</p>
								</div>
							</div>
						</div>
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
						<div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
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
										onClick={() =>
											window.open(
												`${resume.url}`,
												"_blank"
											)
										}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer shadow-sm">
										<div className="flex items-center mb-3">
											<div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
												<FaProjectDiagram className="text-blue-500 dark:text-blue-400" />
											</div>
											<span className="font-medium ml-3 line-clamp-1 overflow-ellipsis text-gray-800 dark:text-white">
												{resume.filename ||
													"untitled_fe"}
											</span>
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Last updated: Recently
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
