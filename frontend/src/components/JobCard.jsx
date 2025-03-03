import React from "react";

const JobCard = ({jobDetails, tryInterview, index, isSelected}) => {
	return (
		<div
			className={`max-w-sm rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full
        ${isSelected ? "border-blue-500" : "border-gray-200}"} `}>
			<div className="px-6 pt-4 pb-2">
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-bold text-xl text-gray-800">
						{jobDetails.title}
					</h3>
					<span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
						{jobDetails.level}
					</span>
				</div>
			</div>

			<div className="px-6 py-2">
				<div className="flex items-center mb-3 text-gray-500 text-sm">
					<svg
						className="h-4 w-4 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
						/>
					</svg>
					<span>AI/ML Department</span>
				</div>

				<div className="flex items-center mb-4 text-gray-500 text-sm">
					<svg
						className="h-4 w-4 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					<span>Remote Available</span>
				</div>

				<p className="text-gray-600 text-sm mb-4 line-clamp-3">
					{jobDetails.description}
				</p>

				<div className="flex flex-wrap gap-2 mb-4">
					<span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
						Python
					</span>
					<span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
						TensorFlow
					</span>
					<span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
						PyTorch
					</span>
					<span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
						ML Pipelines
					</span>
				</div>
			</div>

			<div className="mt-auto px-6 pb-4">
				<button
					onClick={() => tryInterview(index)}
					className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center space-x-1">
					<span>Try Interview</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
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
			</div>
		</div>
	);
};

export default JobCard;
