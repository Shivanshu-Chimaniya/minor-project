import React from "react";

const SkeletonLoader = ({type, count = 1}) => {
	const renderSkeletons = () => {
		const skeletons = [];
		for (let i = 0; i < count; i++) {
			if (type === "text") {
				skeletons.push(
					<div
						key={i}
						className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-full"></div>
				);
			} else if (type === "card") {
				skeletons.push(
					<div
						key={i}
						className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4 bg-white dark:bg-gray-700">
						<div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-3 w-1/3"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-full"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-5/6"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-4/6"></div>
					</div>
				);
			} else if (type === "list-item") {
				skeletons.push(
					<div key={i} className="flex items-start mb-3">
						<div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse mr-2 mt-0.5"></div>
						<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full"></div>
					</div>
				);
			} else if (type === "score") {
				skeletons.push(
					<div
						key={i}
						className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
						<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2 w-24"></div>
						<div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
					</div>
				);
			}
		}
		return skeletons;
	};

	return <>{renderSkeletons()}</>;
};

export default SkeletonLoader;
