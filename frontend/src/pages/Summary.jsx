import React, {useState, useEffect} from "react";

const FeedbackSummaryPage = ({
	questions,
	answers,
	overallResult,
	resumeResult,
	feedbacks,
}) => {
	const [selectedFeedback, setSelectedFeedback] = useState(null);
	const [activeTab, setActiveTab] = useState("technical");
	const [dataReady, setDataReady] = useState({
		technicalOverview: false,
		technicalFeedback: false,
		resume: false,
	});
	const [feedbackItems, setFeedbackItems] = useState([]);

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

	// Calculate color for score display
	const getScoreColor = (score) => {
		if (score >= 7 || score >= 70) return "text-green-600";
		if (score >= 5 || score >= 50) return "text-yellow-600";
		return "text-red-600";
	};

	// Get the appropriate score format (out of 10 or percentage)
	const formatScore = (score) => {
		return `${score} / 10`;
	};

	// Skeleton loader component
	const SkeletonLoader = ({type, count = 1}) => {
		const renderSkeletons = () => {
			const skeletons = [];
			for (let i = 0; i < count; i++) {
				if (type === "text") {
					skeletons.push(
						<div
							key={i}
							className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
					);
				} else if (type === "card") {
					skeletons.push(
						<div
							key={i}
							className="border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
							<div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-1/3"></div>
							<div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
							<div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
							<div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
						</div>
					);
				} else if (type === "list-item") {
					skeletons.push(
						<div key={i} className="flex items-start mb-3">
							<div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-2 mt-0.5"></div>
							<div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
						</div>
					);
				} else if (type === "score") {
					skeletons.push(
						<div key={i} className="bg-white rounded-lg p-4 shadow">
							<div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
							<div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
						</div>
					);
				}
			}
			return skeletons;
		};

		return <>{renderSkeletons()}</>;
	};

	// Score card component to maintain consistency
	const ScoreCard = ({title, score, isLoading}) => (
		<div className="bg-white rounded-lg p-4 shadow">
			<span className="text-gray-600 text-sm font-medium">{title}</span>
			{isLoading ? (
				<div className="h-8 bg-gray-200 rounded animate-pulse w-16 mt-1"></div>
			) : (
				<div className={`text-4xl font-bold ${getScoreColor(score)}`}>
					{formatScore(score)}
				</div>
			)}
		</div>
	);

	return (
		<div className="bg-gray-50 min-h-screen p-6">
			<div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="p-6 border-b border-gray-200 bg-gray-100">
					<h1 className="text-3xl font-bold text-gray-800">
						Candidate Evaluation Summary
					</h1>

					{/* Tabs for switching between Technical and Resume */}
					<div className="mt-6 border-b border-gray-200">
						<div className="flex space-x-8">
							<button
								className={`py-2 px-1 font-medium transition-all duration-200 ${
									activeTab === "technical"
										? "border-b-2 border-blue-500 text-blue-600 scale-105 transform"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("technical")}>
								<div className="relative">
									<ScoreCard
										title="Technical Score"
										score={
											dataReady.technicalOverview
												? overallResult.evaluation
														.overall_score / 10
												: 0
										}
										isLoading={!dataReady.technicalOverview}
									/>
									{!dataReady.technicalOverview && (
										<span className="absolute top-0 right-0 flex h-3 w-3">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
											<span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
										</span>
									)}
									{activeTab === "technical" && (
										<span className="absolute -bottom-2 left-0 right-0 mx-auto w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-blue-500"></span>
									)}
								</div>
							</button>
							<button
								className={`py-2 px-1 font-medium transition-all duration-200 ${
									activeTab === "resume"
										? "border-b-2 border-blue-500 text-blue-600 scale-105 transform"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("resume")}>
								<div className="relative">
									<ScoreCard
										title="Resume Score"
										score={
											dataReady.resume
												? resumeResult.score
												: 0
										}
										isLoading={!dataReady.resume}
									/>
									{!dataReady.resume && (
										<span className="absolute top-0 right-0 flex h-3 w-3">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
											<span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
										</span>
									)}
									{activeTab === "resume" && (
										<span className="absolute -bottom-2 left-0 right-0 mx-auto w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-blue-500"></span>
									)}
								</div>
							</button>
						</div>
					</div>
				</div>

				{/* Display a message when active tab has no data loaded at all */}
				{!isActiveTabPartiallyReady && isAnyDataLoaded && (
					<div className="p-6 text-center">
						<div className="inline-block p-4 bg-blue-50 rounded-lg border border-blue-200">
							<div className="flex items-center">
								<svg
									className="w-6 h-6 text-blue-500 mr-2 animate-spin"
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
								<span className="text-blue-700 font-medium">
									Loading{" "}
									{activeTab === "technical"
										? "technical"
										: "resume"}{" "}
									data...
								</span>
							</div>
							<p className="text-blue-600 text-sm mt-2">
								You can switch to the{" "}
								{activeTab === "technical"
									? "resume"
									: "technical"}{" "}
								tab which is ready to view.
							</p>
						</div>
					</div>
				)}

				{activeTab === "technical" && (
					<>
						{/* Final Verdict stays at the top */}
						{dataReady.technicalOverview ? (
							<div className="p-6 border-b border-gray-200">
								<div className="bg-white rounded-lg p-4 shadow">
									<h3 className="font-semibold text-gray-700 mb-2">
										Final Verdict
									</h3>
									<p className="text-gray-600">
										{overallResult.evaluation.final_verdict}
									</p>
								</div>
							</div>
						) : (
							<div className="p-6 border-b border-gray-200">
								<SkeletonLoader type="card" count={1} />
							</div>
						)}

						{/* Moved Question Feedback above Strengths/Weaknesses */}
						<div className="p-6 grid grid-cols-1 gap-6">
							{/* Question Feedback Section */}
							<div>
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									Question Feedback
								</h2>
								<div className="space-y-4">
									{dataReady.technicalFeedback ? (
										feedbackItems.map((item) => (
											<div
												key={item.questionNumber}
												className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
												onClick={() =>
													setSelectedFeedback(
														selectedFeedback ===
															item.questionNumber
															? null
															: item.questionNumber
													)
												}>
												<div className="p-4 flex justify-between items-center">
													<div>
														<h3 className="font-semibold text-gray-700">
															Question{" "}
															{
																item.questionNumber
															}
														</h3>
														<p
															className={`text-gray-500 text-sm mt-1 ${
																selectedFeedback ===
																item.questionNumber
																	? " "
																	: "line-clamp-1"
															}`}>
															{item.question}
														</p>
													</div>
													<div className="flex items-center">
														<span
															className={`text-lg font-bold ${getScoreColor(
																item.score
															)}`}>
															{item.score}
														</span>
														<svg
															className={`ml-2 w-5 h-5 transition-transform ${
																selectedFeedback ===
																item.questionNumber
																	? "transform rotate-180"
																	: ""
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

												{selectedFeedback ===
													item.questionNumber && (
													<div className="p-4 border-t border-gray-200 bg-gray-50">
														<div className="mb-3">
															<h4 className="font-medium text-gray-700">
																Your Answer:
															</h4>
															<p className="text-gray-600 text-sm mt-1">
																{item.answer}
															</p>
														</div>

														<div className="mb-3">
															<h4 className="font-medium text-gray-700">
																Feedback:
															</h4>
															<p className="text-gray-600 text-sm mt-1">
																{item.feedback}
															</p>
														</div>

														<div>
															<h4 className="font-medium text-gray-700">
																Ideal Answer:
															</h4>
															<p className="text-gray-600 text-sm mt-1">
																{
																	item.perfectAnswer
																}
															</p>
														</div>
													</div>
												)}
											</div>
										))
									) : (
										<SkeletonLoader type="card" count={3} />
									)}
								</div>
							</div>

							{/* Strengths and Weaknesses Section */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
								{dataReady.technicalOverview ? (
									<>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Strengths
											</h2>
											<ul className="space-y-2">
												{overallResult.evaluation.strengths.map(
													(strength, index) => (
														<li
															key={index}
															className="flex items-start">
															<svg
																className="w-5 h-5 text-green-500 mr-2 mt-0.5"
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
															<span className="text-gray-600">
																{strength}
															</span>
														</li>
													)
												)}
											</ul>
										</div>

										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Areas for Improvement
											</h2>
											<ul className="space-y-2">
												{overallResult.evaluation.weaknesses.map(
													(weakness, index) => (
														<li
															key={index}
															className="flex items-start">
															<svg
																className="w-5 h-5 text-red-500 mr-2 mt-0.5"
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
															<span className="text-gray-600">
																{weakness}
															</span>
														</li>
													)
												)}
											</ul>
										</div>
									</>
								) : (
									<>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Strengths
											</h2>
											<SkeletonLoader
												type="list-item"
												count={3}
											/>
										</div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Areas for Improvement
											</h2>
											<SkeletonLoader
												type="list-item"
												count={3}
											/>
										</div>
									</>
								)}
							</div>
						</div>
					</>
				)}

				{activeTab === "resume" && (
					<>
						{dataReady.resume ? (
							<div className="p-6 border-b border-gray-200">
								<div className="bg-white rounded-lg p-4 shadow">
									<h3 className="font-semibold text-gray-700 mb-2">
										Resume Overview
									</h3>
									<p className="text-gray-600">
										The candidate's resume shows strong
										technical skills but needs improvement
										in quantifying achievements and
										professional formatting.
									</p>
								</div>
							</div>
						) : (
							<div className="p-6 border-b border-gray-200">
								<SkeletonLoader type="card" count={1} />
							</div>
						)}

						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							{dataReady.resume ? (
								<>
									<div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Resume Strengths
											</h2>
											<ul className="space-y-2">
												{resumeResult.strengths.map(
													(strength, index) => (
														<li
															key={index}
															className="flex items-start">
															<svg
																className="w-5 h-5 text-green-500 mr-2 mt-0.5"
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
															<span className="text-gray-600">
																{strength}
															</span>
														</li>
													)
												)}
											</ul>
										</div>

										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Resume Weaknesses
											</h2>
											<ul className="space-y-2">
												{resumeResult.weaknesses.map(
													(weakness, index) => (
														<li
															key={index}
															className="flex items-start">
															<svg
																className="w-5 h-5 text-red-500 mr-2 mt-0.5"
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
															<span className="text-gray-600">
																{weakness}
															</span>
														</li>
													)
												)}
											</ul>
										</div>
									</div>

									<div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Improvement Suggestions
											</h2>
											<ul className="space-y-3">
												{resumeResult.suggestions.map(
													(suggestion, index) => (
														<li
															key={index}
															className="flex items-start">
															<div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-2 mt-0.5">
																<span className="text-sm font-semibold">
																	{index + 1}
																</span>
															</div>
															<span className="text-gray-600">
																{suggestion}
															</span>
														</li>
													)
												)}
											</ul>
										</div>
									</div>
								</>
							) : (
								<>
									<div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Resume Strengths
											</h2>
											<SkeletonLoader
												type="list-item"
												count={3}
											/>
										</div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Resume Weaknesses
											</h2>
											<SkeletonLoader
												type="list-item"
												count={3}
											/>
										</div>
									</div>
									<div>
										<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
											<h2 className="text-xl font-bold text-gray-800 mb-3">
												Improvement Suggestions
											</h2>
											<SkeletonLoader
												type="list-item"
												count={4}
											/>
										</div>
									</div>
								</>
							)}
						</div>
					</>
				)}

				{/* Global loading indicator - only shown when no tab data is loaded */}
				{!isAnyDataLoaded && (
					<div className="flex justify-center items-center py-12">
						<div className="text-center">
							<div className="flex justify-center space-x-2 mb-4">
								<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
								<div
									className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
									style={{animationDelay: "0.2s"}}></div>
								<div
									className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
									style={{animationDelay: "0.4s"}}></div>
							</div>
							<p className="text-gray-600 font-medium">
								Loading evaluation data...
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FeedbackSummaryPage;
