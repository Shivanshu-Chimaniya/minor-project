import React from "react";
import SkeletonLoader from "../SkeletonLoader";

const ResumeFeedback = ({dataReady, resumeResult}) => (
	<div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
		<div className="p-6 border-b border-gray-200 dark:border-gray-800">
			{dataReady ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:shadow-gray-950">
					<h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
						Resume Overview
					</h3>
					<p className="text-gray-600 dark:text-gray-300">
						The candidate's resume shows strong technical skills but
						needs improvement in quantifying achievements and
						professional formatting.
					</p>
				</div>
			) : (
				<SkeletonLoader type="card" count={1} />
			)}
		</div>

		<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
			{dataReady ? (
				<>
					<div>
						<ResumeSection
							title="Resume Strengths"
							items={resumeResult.strengths}
							iconType="strength"
						/>
						<ResumeSection
							title="Resume Weaknesses"
							items={resumeResult.weaknesses}
							iconType="weakness"
							className="mt-6"
						/>
					</div>

					<div>
						<ImprovementSuggestions
							suggestions={resumeResult.suggestions}
						/>
					</div>
				</>
			) : (
				<>
					<div>
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4 mb-6">
							<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
								Resume Strengths
							</h2>
							<SkeletonLoader type="list-item" count={3} />
						</div>
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
								Resume Weaknesses
							</h2>
							<SkeletonLoader type="list-item" count={3} />
						</div>
					</div>
					<div>
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
								Improvement Suggestions
							</h2>
							<SkeletonLoader type="list-item" count={4} />
						</div>
					</div>
				</>
			)}
		</div>
	</div>
);

const ResumeSection = ({title, items, iconType, className = ""}) => (
	<div
		className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4 ${className}`}>
		<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
			{title}
		</h2>
		<ul className="space-y-2">
			{items.map((item, index) => (
				<li key={index} className="flex items-start">
					{iconType === "strength" ? (
						<svg
							className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 mt-0.5"
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
					) : (
						<svg
							className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 mt-0.5"
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
					)}
					<span className="text-gray-600 dark:text-gray-300">
						{item}
					</span>
				</li>
			))}
		</ul>
	</div>
);

const ImprovementSuggestions = ({suggestions}) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
		<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
			Improvement Suggestions
		</h2>
		<ul className="space-y-3">
			{suggestions.map((suggestion, index) => (
				<li key={index} className="flex items-start">
					<div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 flex items-center justify-center mr-2 mt-0.5">
						<span className="text-sm font-semibold">
							{index + 1}
						</span>
					</div>
					<span className="text-gray-600 dark:text-gray-300">
						{suggestion}
					</span>
				</li>
			))}
		</ul>
	</div>
);

export default ResumeFeedback;
