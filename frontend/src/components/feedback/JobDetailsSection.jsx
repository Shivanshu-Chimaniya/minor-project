import React from "react";
import {FaBriefcase} from "react-icons/fa";
import SkeletonLoader from "../SkeletonLoader";

const JobDetailsSection = ({jobDetails, isLoading = false}) => (
	<div className="p-6">
		<h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
			<FaBriefcase className="text-blue-500 dark:text-blue-400 mr-2" />
			Job Details
		</h3>

		{!isLoading && jobDetails ? (
			<div className="bg-white dark:bg-gray-800/40 rounded-lg p-6 shadow-sm">
				<div className="flex items-center mb-4">
					<div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
						<FaBriefcase className="text-blue-500 dark:text-blue-400" />
					</div>
					<div className="ml-4">
						<h4 className="font-medium text-lg text-gray-800 dark:text-white">
							{jobDetails.level.charAt(0).toUpperCase() +
								jobDetails.level.slice(1)}{" "}
							Position
						</h4>
						<p className="text-gray-500 dark:text-gray-400">
							Interview conducted on{" "}
							{new Date().toLocaleDateString()}
						</p>
					</div>
				</div>

				<div className="mt-5">
					<h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
						Job Description
					</h5>
					<div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
						<p className="text-gray-700 dark:text-gray-300">
							{jobDetails.description}
						</p>
					</div>
				</div>
			</div>
		) : (
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
							Loading job details...
						</span>
					</div>
				</div>
			</div>
		)}
	</div>
);

export default JobDetailsSection;
