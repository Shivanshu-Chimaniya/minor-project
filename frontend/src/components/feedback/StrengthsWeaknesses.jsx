// file: components/feedback/StrengthsWeaknesses.jsx
import React from "react";
import SkeletonLoader from "../SkeletonLoader";

const StrengthsWeaknesses = ({isDataReady, strengths, weaknesses}) => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
		{isDataReady ? (
			<>
				<StrengthsList strengths={strengths} />
				<WeaknessesList weaknesses={weaknesses} />
			</>
		) : (
			<>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
					<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
						Strengths
					</h2>
					<SkeletonLoader type="list-item" count={3} />
				</div>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
					<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
						Areas for Improvement
					</h2>
					<SkeletonLoader type="list-item" count={3} />
				</div>
			</>
		)}
	</div>
);

const StrengthsList = ({strengths}) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
		<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
			Strengths
		</h2>
		<ul className="space-y-2">
			{strengths.map((strength, index) => (
				<li key={index} className="flex items-start">
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
					<span className="text-gray-600 dark:text-gray-300">
						{strength}
					</span>
				</li>
			))}
		</ul>
	</div>
);

const WeaknessesList = ({weaknesses}) => (
	<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 p-4">
		<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
			Areas for Improvement
		</h2>
		<ul className="space-y-2">
			{weaknesses.map((weakness, index) => (
				<li key={index} className="flex items-start">
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
					<span className="text-gray-600 dark:text-gray-300">
						{weakness}
					</span>
				</li>
			))}
		</ul>
	</div>
);

export default StrengthsWeaknesses;
