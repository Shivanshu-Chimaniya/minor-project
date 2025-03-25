import React from "react";
import {useNavigate} from "react-router-dom";
import {showToast} from "../utils/toast";

const JobDetails = ({
	selectedJobIndex,
	interviewTypes,
	tryInterview,
	isAuthenticated,
}) => {
	if (selectedJobIndex === null) return null;
	const navigate = useNavigate();

	const selectedJob = interviewTypes[selectedJobIndex];

	return (
		<div
			className="p-6 rounded-lg transition-all duration-300
			bg-white dark:bg-gray-800
			border border-blue-200 dark:border-blue-700
			shadow-md hover:shadow-lg">
			{/* Header with title and level */}
			<div className="flex justify-between items-start mb-4">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
					{selectedJob.title}
				</h2>
				<span
					className="px-3 py-1 text-sm font-semibold rounded-full 
					bg-blue-100 dark:bg-blue-900 
					text-blue-800 dark:text-blue-200">
					{selectedJob.level}
				</span>
			</div>

			{/* Tags */}
			{selectedJob.tags && (
				<div className="flex flex-wrap gap-2 mb-4">
					{selectedJob.tags.map((tag, index) => (
						<span
							key={index}
							className="px-2 py-1 text-xs 
							bg-gray-100 dark:bg-gray-700 
							text-gray-800 dark:text-gray-200 rounded">
							{tag}
						</span>
					))}
				</div>
			)}

			{/* Features */}
			{selectedJob.features && (
				<div className="mb-4">
					<div className="flex flex-wrap gap-4">
						{selectedJob.features.map((feature, index) => (
							<div
								key={index}
								className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
								<svg
									className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								{feature}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Description */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
					About This Position
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					{selectedJob.description &&
					selectedJob.description.length > 700
						? `${selectedJob.description.substring(0, 700)}...`
						: selectedJob.description}
				</p>
			</div>

			{/* Action Button */}
			{isAuthenticated ? (
				<button
					onClick={() => tryInterview(selectedJobIndex)}
					className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
						text-white font-medium py-3 px-4 rounded-md
						transition duration-300 transform hover:translate-y-[-2px]
						flex items-center justify-center">
					<span>Start This Interview</span>
					<svg
						className="ml-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</button>
			) : (
				<button
					onClick={() => {
						showToast.warning("Login in order to take interviews");
						navigate("/login");
					}}
					className={`w-full py-3 px-6 rounded-md text-white font-medium transition-all duration-300 transform hover:translate-y-[-2px] bg-gray-400 dark:bg-gray-600 cursor-not-allowed`}>
					<div className="flex items-center justify-center">
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span>Log In to Start Interview</span>
					</div>
				</button>
			)}
		</div>
	);
};

export default JobDetails;
