import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {showToast} from "../utils/toast";

const JobForm = ({isAuthenticated, HandleFormSubmit}) => {
	// Define job levels as an array for easier manipulation
	const jobLevels = ["Intern", "Junior", "Skilled", "Senior", "TryHard"];

	const [jobLevelIndex, setJobLevelIndex] = useState(0);
	const [jobDescription, setJobDescription] = useState("");
	const [error, setError] = useState(null);
	const [charCount, setCharCount] = useState(0);
	const navigate = useNavigate();

	// Update character count when description changes
	useEffect(() => {
		setCharCount(jobDescription.length);
	}, [jobDescription]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isAuthenticated) {
			navigate("/login");
			showToast.warning("Login in order to take interviews");
		}

		// Clear previous errors
		setError(null);

		// Validation
		if (!jobDescription.trim()) {
			setError("Please enter a job description");
			return;
		}

		if (jobDescription.length > 2000) {
			setError("Job description must be under 2000 characters");
			return;
		}

		// Submit the form with the selected level as a string
		HandleFormSubmit(jobLevels[jobLevelIndex], jobDescription);
	};

	// Helper function to determine color class based on character count
	const getCountColorClass = () => {
		if (charCount > 1800) return "text-red-500 dark:text-red-400";
		if (charCount > 1500) return "text-yellow-500 dark:text-yellow-400";
		return "text-gray-500 dark:text-gray-400";
	};

	return (
		<div
			className="p-6 sm:p-8 rounded-lg 
			bg-white dark:bg-gray-800 
			border border-gray-200 dark:border-gray-700
			shadow-md transition-all duration-300">
			<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
				Create Custom Interview
			</h2>

			{error && (
				<div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
					<p className="text-red-600 dark:text-red-400 text-sm">
						{error}
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Job Level Selector */}
				<div className="space-y-2">
					<label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
						Job Level:{" "}
						<span className="font-bold text-blue-600 dark:text-blue-400">
							{jobLevels[jobLevelIndex]}
						</span>
					</label>

					<div className="relative pt-1">
						<input
							type="range"
							min="0"
							max={jobLevels.length - 1}
							value={jobLevelIndex}
							onChange={(e) =>
								setJobLevelIndex(Number(e.target.value))
							}
							disabled={!isAuthenticated}
							className="w-full h-2 appearance-none rounded-full 
								bg-gray-200 dark:bg-gray-700
								disabled:opacity-50 disabled:cursor-not-allowed"
						/>

						<div className="flex justify-between text-xs mt-2 px-1">
							{jobLevels.map((level, index) => (
								<div
									key={index}
									className={`text-center ${
										jobLevelIndex === index
											? "font-semibold text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-400"
									}`}
									style={{
										width: `${100 / jobLevels.length}%`,
									}}>
									{level}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Job Description Textarea */}
				<div className="space-y-2">
					<div className="flex justify-between items-center mb-2">
						<label className="block font-medium text-gray-700 dark:text-gray-300">
							Job Description
						</label>
						<span className={`text-xs ${getCountColorClass()}`}>
							{charCount}/2000 characters
						</span>
					</div>

					<textarea
						value={jobDescription}
						onChange={(e) => setJobDescription(e.target.value)}
						maxLength={2000}
						rows="5"
						className="w-full p-3 border rounded-md 
							bg-white dark:bg-gray-700
							border-gray-300 dark:border-gray-600
							text-gray-800 dark:text-gray-200
							focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
							disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
							transition-all duration-200"
						placeholder={
							isAuthenticated
								? "Describe the job requirements and skills needed for this interview..."
								: "Please log in to add a job description"
						}
						disabled={!isAuthenticated}></textarea>

					{/* Progress bar for character count */}
					<div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className={`h-full ${
								charCount > 1800
									? "bg-red-500"
									: charCount > 1500
									? "bg-yellow-500"
									: "bg-green-500"
							}`}
							style={{
								width: `${Math.min(
									(charCount / 2000) * 100,
									100
								)}%`,
							}}></div>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className={`w-full py-3 px-6 rounded-md
						text-white font-medium
						transition-all duration-300 transform hover:translate-y-[-2px]
						${
							isAuthenticated
								? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-sm hover:shadow"
								: "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
						}`}>
					<div className="flex items-center justify-center">
						{isAuthenticated ? (
							<>
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Create Custom Interview</span>
							</>
						) : (
							<>
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
								<span>Log In to Create Interview</span>
							</>
						)}
					</div>
				</button>
			</form>
		</div>
	);
};

export default JobForm;
