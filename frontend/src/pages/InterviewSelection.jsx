import {useNavigate} from "react-router-dom";
import {useState, useContext} from "react";
import AuthContext from "../context/AuthContext"; // Assuming this is the path to your AuthContext
import JobCard from "../components/JobCard";
import {FaExclamationTriangle} from "react-icons/fa";

const InterviewSelection = ({startInterview}) => {
	const navigate = useNavigate();
	const {isAuthenticated} = useContext(AuthContext); // Get isAuthenticated from AuthContext

	const [jobLevel, setJobLevel] = useState(1);
	const [jobDescription, setJobDescription] = useState("");
	const [selectedJobIndex, setSelectedJobIndex] = useState(null);

	const interviewTypes = [
		{
			"title": "Backend Developer Intern",
			"level": "fresher",
			"description":
				"This test is about evaluating your understanding of backend development, including working with server-side logic, APIs, and databases. You will be expected to use technologies like Node.js, Express, and MongoDB or PostgreSQL to build and optimize backend systems. The role will involve handling authentication, database operations, and server performance improvements while collaborating with frontend developers to integrate APIs effectively.",
		},
		{
			"title": "DevOps Engineer",
			"level": "mid-level",
			"description":
				"This test is about assessing your ability to automate infrastructure, manage cloud services, and optimize CI/CD pipelines. You should have experience with Docker, Kubernetes, AWS/GCP, and scripting languages like Bash or Python. The role includes monitoring system performance, ensuring deployment efficiency, and enhancing security practices within the development workflow.",
		},
		{
			"title": "AI/ML Engineer",
			"level": "senior",
			"description":
				"This test is about measuring your expertise in developing and deploying machine learning models for real-world applications. You will work with Python, TensorFlow/PyTorch, and data processing frameworks to build AI-driven solutions. Responsibilities include designing scalable ML pipelines, improving model accuracy, and optimizing inference performance while collaborating with data engineers and software developers.",
		},
		{
			"title": "Frontend Developer",
			"level": "mid-level",
			"description":
				"This test evaluates your skills in building responsive and interactive user interfaces. You should be proficient with React, CSS frameworks, and modern JavaScript. The role involves implementing UI designs, optimizing performance, and ensuring cross-browser compatibility while working closely with UX designers and backend developers.",
		},
		{
			"title": "Data Scientist",
			"level": "senior",
			"description":
				"This test assesses your ability to extract insights from complex datasets. You should be experienced with statistical analysis, data visualization, and predictive modeling using Python, R, and SQL. The role includes developing data-driven solutions, communicating findings to stakeholders, and collaborating with engineering teams to implement models in production.",
		},
	];

	const handleJobSubmit = (e) => {
		e.preventDefault();
		if (!isAuthenticated) {
			alert("Please log in to submit a job description.");
			return;
		}
		if (jobDescription.length > 2000) {
			alert("Job description must be under 2000 characters.");
			return;
		}
		handleStartInterview(jobLevel, jobDescription);
	};

	const handleStartInterview = (level, jobDescription) => {
		if (!isAuthenticated) {
			alert("Please log in to start an interview.");
			return;
		}
		startInterview(level, jobDescription);
		navigate("/interview");
	};

	const tryInterview = (index) => {
		if (!isAuthenticated) {
			alert("Please log in to start an interview.");
			return;
		}
		handleStartInterview(
			interviewTypes[index].level,
			interviewTypes[index].description
		);
	};

	const handleStartPredefinedInterview = () => {
		if (!isAuthenticated) {
			alert("Please log in to start an interview.");
			return;
		}
		if (selectedJobIndex !== null) {
			const jobDetails = interviewTypes[selectedJobIndex];
			const level = jobDetails.level;
			handleStartInterview(level, interviewTypes.description);
		}
	};

	const handleSelectJob = (index) => {
		setSelectedJobIndex(selectedJobIndex == index ? null : index);
	};

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
			<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 text-center mb-8">
				Choose Your Interview Type
			</h1>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Left side - Interview cards */}
				<div className="lg:w-3/5 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
						{interviewTypes.map((interview, index) => (
							<div
								key={index}
								onClick={() => {
									handleSelectJob(index);
								}}
								className="cursor-pointer transform transition-transform duration-300 hover:scale-102">
								<JobCard
									index={index}
									jobDetails={interview}
									tryInterview={tryInterview}
									isSelected={selectedJobIndex === index}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Right side - Form and Selected Job Details */}
				<div className="lg:w-2/5 space-y-6">
					{/* Detailed view when a card is selected */}
					<div
						className={`bg-blue-50 p-6 rounded-lg shadow-md border-2 border-blue-200 transition-all duration-300 ${
							selectedJobIndex !== null
								? "opacity-100 max-h-96 mb-6"
								: "opacity-0 max-h-0 overflow-hidden mb-0"
						}`}>
						{selectedJobIndex !== null && (
							<>
								<h2 className="text-2xl font-bold text-blue-800 mb-3">
									{interviewTypes[selectedJobIndex].title}
								</h2>
								<p className="text-gray-700 mb-4">
									{
										interviewTypes[selectedJobIndex]
											.description
									}
								</p>
								{isAuthenticated && (
									<button
										onClick={handleStartPredefinedInterview}
										className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105">
										Start This Interview
									</button>
								)}
							</>
						)}
					</div>

					<div className="bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md sticky top-8 transition-all duration-300">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							Add New Job
						</h2>
						<form onSubmit={handleJobSubmit} className="space-y-6">
							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Job Level:{" "}
									<span className="font-bold">
										{jobLevel === 1
											? "Beginner"
											: jobLevel === 2
											? "Mid-Senior"
											: "Senior"}
									</span>
								</label>
								<input
									type="range"
									min="1"
									max="3"
									value={jobLevel}
									onChange={(e) =>
										setJobLevel(Number(e.target.value))
									}
									className="w-full cursor-pointer h-2 bg-blue-200 rounded-lg appearance-none"
								/>
								<div className="flex justify-between text-sm mt-1 text-gray-600">
									<span>Beginner</span>
									<span>Mid-Senior</span>
									<span>Senior</span>
								</div>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-2">
									Job Description
									<span className="text-sm text-gray-500 ml-2">
										({jobDescription.length}/2000
										characters)
									</span>
								</label>
								<textarea
									value={jobDescription}
									onChange={(e) =>
										setJobDescription(e.target.value)
									}
									maxLength={2000}
									rows="5"
									className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
									placeholder={
										isAuthenticated
											? "Describe the job requirements and responsibilities..."
											: "Please log in to add a job description"
									}
									disabled={!isAuthenticated}></textarea>
							</div>

							<button
								type="submit"
								className={`${
									isAuthenticated
										? "bg-green-600 hover:bg-green-700"
										: "bg-gray-400 cursor-not-allowed"
								} text-white font-medium py-3 px-6 rounded-md transition-all duration-300 w-full transform hover:scale-105 hover:shadow-lg`}
								disabled={!isAuthenticated}>
								{isAuthenticated
									? "Submit Job"
									: "Log In to Submit"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InterviewSelection;
