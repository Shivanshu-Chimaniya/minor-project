import {useNavigate} from "react-router-dom";
import {useState} from "react";

const InterviewSelection = ({startInterview}) => {
	const navigate = useNavigate();

	const [jobLevel, setJobLevel] = useState(1);
	const [jobDescription, setJobDescription] = useState("");

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
	];

	const handleJobSubmit = (e) => {
		e.preventDefault();
		if (jobDescription.length > 2000) {
			alert("Job description must be under 2000 characters.");
			return;
		}
		handleStartInterview(jobLevel, jobDescription);
	};

	const handleStartInterview = (level, jobDescription) => {
		startInterview(level, jobDescription);
		navigate("/interview");
	};

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12 lg:space-y-16 max-w-7xl">
			<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 text-center">
				Choose Your Interview Type
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
				{interviewTypes.map((interview, index) => (
					<div
						key={index}
						className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 space-y-6 sm:space-y-8">
						<div className="space-y-4 sm:space-y-6">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
								{interview.title}
							</h2>
							<p className="text-gray-600 leading-relaxed line-clamp-3 text-base sm:text-lg  ">
								{interview.description}
							</p>
						</div>
						<button
							onClick={() =>
								handleStartInterview(
									interview.level,
									interview.description
								)
							}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg">
							Start Interview
						</button>
					</div>
				))}
			</div>

			<div className="bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">
					Add New Job
				</h2>
				<form onSubmit={handleJobSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700 font-medium mb-2">
							Job Level:{" "}
							{jobLevel === 1
								? "Beginner"
								: jobLevel === 2
								? "Mid-Senior"
								: "Senior"}
						</label>
						<input
							type="range"
							min="1"
							max="3"
							value={jobLevel}
							onChange={(e) =>
								setJobLevel(Number(e.target.value))
							}
							className="w-full cursor-pointer"
						/>
					</div>

					<div>
						<label className="block text-gray-700 font-medium mb-2">
							Job Description (Max: 2000 characters)
						</label>
						<textarea
							value={jobDescription}
							onChange={(e) => setJobDescription(e.target.value)}
							maxLength={2000}
							rows="4"
							className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
					</div>

					<button
						type="submit"
						className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 w-full">
						Submit Job
					</button>
				</form>
			</div>
		</div>
	);
};

export default InterviewSelection;
