import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {showToast} from "../utils/toast";
import {useNavigate} from "react-router-dom";

const JobCard = ({jobDetails, tryInterview, index, isSelected}) => {
	const {isAuthenticated} = useAuth();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState(false);

	// Determine if card should be expanded (on small screens when selected)
	const shouldExpand = isSelected && window.innerWidth < 640;

	// Toggle expanded state for smaller screens
	const toggleExpand = () => {
		if (window.innerWidth < 640) {
			setExpanded(!expanded);
		}
		if (!isAuthenticated) {
			showToast.error("Please log in to start an interview.");
		}
	};

	return (
		<div
			className={`max-w-sm rounded-lg overflow-hidden shadow-lg 
        bg-white dark:bg-gray-800 
        border transition-shadow duration-300 flex flex-col h-full
        ${
			isSelected
				? "border-blue-500 dark:border-blue-400 shadow-xl"
				: "border-gray-200 dark:border-gray-700 hover:shadow-xl"
		} ${shouldExpand || expanded ? "sm:h-auto" : "h-full"}`}
			onClick={toggleExpand}>
			<div className="px-4 pt-3 pb-1">
				<div className="flex flex-col items-center justify-between ">
					<h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-[#e2e8f0] line-clamp-1 text-ellipsis">
						{jobDetails.title}
					</h3>
					<span
						className="px-1 py-1/2 text-[10px] font-semibold rounded-full 
            bg-blue-100 dark:bg-blue-900 
            text-blue-800 dark:text-blue-200 uppercase text-nowrap">
						{jobDetails.level}
					</span>
				</div>
			</div>

			{/* Description - always visible */}
			<div className="px-4  pb-2">
				<p
					className={`text-gray-600 dark:text-gray-300 text-sm mb-4 
          ${shouldExpand || expanded ? "" : "line-clamp-3"}`}>
					{jobDetails.description}
				</p>

				{/* Additional content - visible only when expanded on small screens */}
				{(shouldExpand || expanded) && (
					<>
						{jobDetails.features &&
							jobDetails.features.map((el) => (
								<div className="flex items-center mb-4 text-gray-500 dark:text-gray-400 text-sm">
									<span>{el}</span>
								</div>
							))}

						<div className="flex flex-wrap gap-2 mb-4">
							{jobDetails.tags &&
								jobDetails.tags.map((el) => (
									<span
										className="px-2 py-1 text-xs 
									bg-gray-100 dark:bg-gray-700 
									text-gray-800 dark:text-gray-200 rounded">
										{el}
									</span>
								))}
						</div>
					</>
				)}
			</div>

			{isAuthenticated && (
				<div className="mt-auto px-4 pb-4">
					<button
						onClick={(e) => {
							e.stopPropagation();
							if (isAuthenticated) {
								tryInterview(index);
							} else {
								showToast.error(
									"Please log in to start an interview."
								);
							}
						}}
						className={`py-1 px-4 ${
							isAuthenticated
								? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
								: "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
						} text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center space-x-1`}>
						<span>Start</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default JobCard;
