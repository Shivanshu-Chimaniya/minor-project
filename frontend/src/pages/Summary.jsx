import React, {useState, useEffect} from "react";

const FeedbackSummaryPage = ({
	questions,
	answers,
	overallResult,
	resumeResult,
}) => {
	// const {questions, answers, overallResult, resumeResult} = {
	// 	"questions": [
	// 		"Let's say you need to design an API endpoint for a user registration system using Node.js and Express.  Describe the steps involved, including data validation, error handling, and database interaction (using either MongoDB or PostgreSQL).  Consider aspects like security best practices during your explanation.",
	// 		"Imagine you're optimizing a database query that's become slow due to a large dataset.  Describe different strategies you might employ to improve its performance, considering indexing, query optimization techniques, and potential database design changes.  Which strategy would you prioritize and why?",
	// 		"Explain the difference between REST and GraphQL APIs.  In what situations would you choose one over the other, and what are the tradeoffs involved?",
	// 		"You're working on a system where user authentication is crucial.  Describe a robust authentication mechanism using JWT (JSON Web Tokens) that balances security and user experience.  How would you handle token refresh and revocation?",
	// 		"Describe a scenario where you would choose to use a NoSQL database like MongoDB over a relational database like PostgreSQL.  What are the key advantages and disadvantages of each in that specific context?",
	// 	],
	// 	"answers": [
	// 		"To create a secure user registration API in Node.js with Express, follow these steps:  Set up Express and Middleware  Install necessary packages like express, bcrypt (for password hashing), jsonwebtoken (for authentication), and a database ORM like Mongoose for MongoDB or Sequelize for PostgreSQL. Use express.json() middleware to parse incoming JSON requests. Validate User Input  Ensure the email is correctly formatted and the password meets security requirements (e.g., minimum length). Use libr...",
	// 		"When a database query slows down due to a large dataset, consider these optimization strategies:  Indexing (First Priority)  Index frequently queried columns to speed up lookups. Use composite indexes if queries involve multiple columns. Query Optimization  Avoid SELECT *—fetch only necessary fields. Use query execution plans (EXPLAIN ANALYZE) to identify bottlenecks. Denormalization & Caching  Store frequently accessed data in Redis or use materialized views. Consider denormalizing data for rea...",
	// 		"The key difference is how data is fetched:  REST API:  Uses fixed endpoints (/users, /posts). Over-fetches or under-fetches data. Works well for simple, resource-based APIs. GraphQL API:  Clients request only the data they need, reducing over-fetching. Uses a single /graphql endpoint with flexible queries. Ideal for complex applications with multiple frontend clients. When to Choose REST:  When caching (CDN support) is critical. When the API structure is simple and predictable. When to Choose Gr...",
	// 		"A robust JWT-based authentication system should:  User Logs In  Validate credentials and generate a JWT token with user details. Token Storage & Security  Store the token in HTTP-only cookies or local storage (with caution). Token Refresh Mechanism  Use short-lived access tokens (e.g., 15 minutes). Issue a refresh token (longer expiry) to get a new access token. Handling Token Revocation  Maintain a deny list for invalidated tokens (e.g., after logout). Rotate refresh tokens to prevent misuse. S...",
	// 		"Scenario for NoSQL (MongoDB):  When dealing with unstructured or semi-structured data (e.g., social media posts, IoT data). When scalability is crucial (horizontal scaling with sharding). When working with flexible schemas (dynamic fields in documents). Scenario for SQL (PostgreSQL):  When data requires strict relationships (e.g., financial transactions). When enforcing ACID compliance is necessary. When complex joins and transactions are required. Key Advantages & Disadvantages:  MongoDB is hig...",
	// 	],
	// 	"overallResult": {
	// 		"evaluation": {
	// 			"feedback": {
	// 				"question_1":
	// 					'{feedback: "Excellent overview.  Missing mention of…}',
	// 				"question_2":
	// 					'{feedback: "Good coverage of strategies.  Prioritiz…}',
	// 				"question_3":
	// 					'{feedback: "Excellent comparison and trade-off anal…}',
	// 				"question_4":
	// 					'{feedback: "Good explanation, but lacks depth in to…}',
	// 				"question_5":
	// 					'{feedback: "Good scenario, but could elaborate on t…}',
	// 			},
	// 			"strengths": [
	// 				"Strong understanding of API design principles",
	// 				"Good grasp of database optimization techniques",
	// 				"Solid knowledge of authentication mechanisms",
	// 			],
	// 			"weaknesses": [
	// 				"Minor oversights in security best practices and edge cases",
	// 				"Could benefit from deeper exploration of some advanced topics",
	// 			],
	// 			"overall_score": 8.7,
	// 			"final_verdict":
	// 				"The candidate demonstrates a strong foundation in backend development.  Minor refinements are needed to address gaps in detail and edge-case handling, but overall the performance is very promising.",
	// 		},
	// 	},
	// 	"resumeResult": {
	// 		"score": 70,
	// 		"strengths":
	// 			'["Demonstrates proficiency in various programming l…]',
	// 		"weaknesses":
	// 			'["Resume lacks specific details on achievements and…]',
	// 		"suggestions":
	// 			'["Quantify achievements in projects with measurable…]',
	// 	},
	// };
	const [selectedFeedback, setSelectedFeedback] = useState(null);
	const [activeTab, setActiveTab] = useState("technical");
	// Add loading state
	const [isLoading, setIsLoading] = useState(true);
	const [dataReady, setDataReady] = useState({
		technical: false,
		resume: false,
	});
	const [feedbackItems, setFeedbackItems] = useState([]);

	// Simulate loading data
	useEffect(() => {
		if (typeof overallResult.evaluation !== "undefined") {
			setDataReady((prev) => ({...prev, technical: true}));
			const newFeedbackItems = Object.keys(
				overallResult.evaluation.feedback
			).map((key) => {
				const item = overallResult.evaluation.feedback[key];
				const index = parseInt(key.split("_")[1]) - 1;

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
		if (typeof resumeResult.score !== "undefined") {
			setDataReady((prev) => ({...prev, resume: true}));
		}

		if (
			typeof overallResult.evaluation !== "undefined" &&
			typeof resumeResult.score !== "undefined"
		) {
			setIsLoading(false);
		}
	}, [overallResult, resumeResult]);

	// Calculate color for score display
	const getScoreColor = (score) => {
		if (score >= 7 || score >= 70) return "text-green-600";
		if (score >= 5 || score >= 50) return "text-yellow-600";
		return "text-red-600";
	};

	// Get the appropriate score format (out of 10 or percentage)
	const formatScore = (score, isPercentage) => {
		return isPercentage ? `${score}%` : `${score} / 10`;
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
								className={`py-2 px-1 font-medium text-sm ${
									activeTab === "technical"
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("technical")}>
								Technical Assessment
								{!dataReady.technical && (
									<span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
								)}
							</button>
							<button
								className={`py-2 px-1 font-medium text-sm ${
									activeTab === "resume"
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("resume")}>
								Resume Evaluation
								{!dataReady.resume && (
									<span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
								)}
							</button>
						</div>
					</div>
				</div>

				{activeTab === "technical" && (
					<>
						<div className="p-6 border-b border-gray-200">
							{isLoading ? (
								<div className="flex flex-wrap items-center gap-4">
									<SkeletonLoader type="score" />
									<div className="flex-grow">
										<div className="bg-white rounded-lg p-4 shadow">
											<div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-1/4"></div>
											<div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-wrap items-center gap-4">
									<div className="bg-white rounded-lg p-4 shadow">
										<span className="text-gray-600 text-sm font-medium">
											Technical Score
										</span>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												overallResult.evaluation
													.overall_score
											)}`}>
											{formatScore(
												overallResult.evaluation
													.overall_score,
												false
											)}
										</div>
									</div>
									<div className="flex-grow">
										<div className="bg-white rounded-lg p-4 shadow">
											<h3 className="font-semibold text-gray-700 mb-2">
												Final Verdict
											</h3>
											<p className="text-gray-600">
												{
													overallResult.evaluation
														.final_verdict
												}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="md:col-span-2">
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									Question Feedback
								</h2>
								{isLoading ? (
									<div className="space-y-4">
										<SkeletonLoader type="card" count={5} />
									</div>
								) : (
									<div className="space-y-4">
										{feedbackItems.map((item) => (
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
														<p className="text-gray-500 text-sm mt-1">
															{item.question
																.length > 100
																? `${item.question.substring(
																		0,
																		100
																  )}...`
																: item.question}
														</p>
													</div>
													<div className="flex items-center">
														<span
															className={`text-lg font-bold ${getScoreColor(
																item.score
															)}`}>
															{item.score}/10
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
										))}
									</div>
								)}
							</div>

							<div>
								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
									<h2 className="text-xl font-bold text-gray-800 mb-3">
										Strengths
									</h2>
									{isLoading ? (
										<SkeletonLoader
											type="list-item"
											count={2}
										/>
									) : (
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
									)}
								</div>

								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
									<h2 className="text-xl font-bold text-gray-800 mb-3">
										Areas for Improvement
									</h2>
									{isLoading ? (
										<SkeletonLoader
											type="list-item"
											count={3}
										/>
									) : (
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
									)}
								</div>
							</div>
						</div>
					</>
				)}

				{activeTab === "resume" && (
					<>
						<div className="p-6 border-b border-gray-200">
							{isLoading ? (
								<div className="flex flex-wrap items-center gap-4">
									<SkeletonLoader type="score" />
									<div className="flex-grow">
										<div className="bg-white rounded-lg p-4 shadow">
											<div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-1/4"></div>
											<div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-wrap items-center gap-4">
									<div className="bg-white rounded-lg p-4 shadow">
										<span className="text-gray-600 text-sm font-medium">
											Resume Score
										</span>
										<div
											className={`text-4xl font-bold ${getScoreColor(
												resumeResult.score
											)}`}>
											{formatScore(
												resumeResult.score,
												true
											)}
										</div>
									</div>
									<div className="flex-grow">
										<div className="bg-white rounded-lg p-4 shadow">
											<h3 className="font-semibold text-gray-700 mb-2">
												Resume Overview
											</h3>
											<p className="text-gray-600">
												The candidate's resume shows
												strong technical skills but
												needs improvement in quantifying
												achievements and professional
												formatting.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
									<h2 className="text-xl font-bold text-gray-800 mb-3">
										Resume Strengths
									</h2>
									{isLoading ? (
										<SkeletonLoader
											type="list-item"
											count={5}
										/>
									) : (
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
									)}
								</div>

								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
									<h2 className="text-xl font-bold text-gray-800 mb-3">
										Resume Weaknesses
									</h2>
									{isLoading ? (
										<SkeletonLoader
											type="list-item"
											count={5}
										/>
									) : (
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
									)}
								</div>
							</div>

							<div>
								<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
									<h2 className="text-xl font-bold text-gray-800 mb-3">
										Improvement Suggestions
									</h2>
									{isLoading ? (
										<SkeletonLoader
											type="list-item"
											count={5}
										/>
									) : (
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
									)}
								</div>
							</div>
						</div>
					</>
				)}

				{/* Global loading indicator */}
				{isLoading && (
					<div className="flex justify-center items-center py-6">
						<div className="flex space-x-2">
							<div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
							<div
								className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
								style={{animationDelay: "0.2s"}}></div>
							<div
								className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
								style={{animationDelay: "0.4s"}}></div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FeedbackSummaryPage;
