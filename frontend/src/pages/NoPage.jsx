import React from "react";
import {useNavigate} from "react-router-dom";

const NoPage = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-[85vh] p-6 pt-0 text-center bg-gray-50 dark:bg-gray-900">
			<div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 animate-fade-in">
				<div className="mb-6">
					{/* SVG illustration for 404 */}
					<svg
						className="w-48 h-48 mx-auto mb-4 animate-float"
						viewBox="0 0 200 200"
						xmlns="http://www.w3.org/2000/svg">
						{/* Stylized "404" text */}
						<text
							x="35"
							y="100"
							className="text-6xl font-bold"
							fill="#2563EB"
							fillOpacity="0.8">
							404
						</text>

						{/* Lost astronaut floating in space */}
						<circle
							cx="150"
							cy="70"
							r="15"
							fill="#60A5FA"
							className="animate-pulse"
						/>
						<rect
							x="140"
							y="85"
							width="20"
							height="30"
							rx="10"
							fill="#3B82F6"
						/>
						<line
							x1="150"
							y1="115"
							x2="140"
							y2="130"
							stroke="#3B82F6"
							strokeWidth="4"
						/>
						<line
							x1="150"
							y1="115"
							x2="160"
							y2="130"
							stroke="#3B82F6"
							strokeWidth="4"
						/>
						<circle cx="150" cy="70" r="8" fill="#F8FAFC" />

						{/* Stars in background */}
						<circle
							cx="30"
							cy="40"
							r="2"
							fill="#E2E8F0"
							className="animate-twinkle"
						/>
						<circle
							cx="170"
							cy="30"
							r="1.5"
							fill="#E2E8F0"
							className="animate-twinkle-delay"
						/>
						<circle
							cx="60"
							cy="150"
							r="2"
							fill="#E2E8F0"
							className="animate-twinkle"
						/>
						<circle
							cx="180"
							cy="120"
							r="1.5"
							fill="#E2E8F0"
							className="animate-twinkle-delay"
						/>
						<circle
							cx="120"
							cy="170"
							r="2"
							fill="#E2E8F0"
							className="animate-twinkle"
						/>
					</svg>
				</div>

				<h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
					Page Not Found
				</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					The page you're looking for has drifted off into space.
				</p>

				<button
					onClick={() => navigate("/")}
					className="px-5 py-2.5 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md">
					Back to Home
				</button>
			</div>
		</div>
	);
};

export default NoPage;
