import React from "react";

const LoadingIndicator = ({message = "Loading..."}) => (
	<div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
		<div className="text-center">
			<div className="flex justify-center space-x-2 mb-4">
				<div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
				<div
					className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
					style={{animationDelay: "0.2s"}}></div>
				<div
					className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
					style={{animationDelay: "0.4s"}}></div>
			</div>
			<p className="text-gray-600 dark:text-gray-300 font-medium">
				{message}
			</p>
		</div>
	</div>
);

export default LoadingIndicator;
