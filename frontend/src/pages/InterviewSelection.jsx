import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useInterview} from "../context/InterviewContext";
import JobList from "../components/JobList.jsx";
import JobDetails from "../components/JobDetails.jsx";
import JobForm from "../components/JobForm.jsx";

const InterviewSelection = () => {
	const navigate = useNavigate();
	const {isAuthenticated} = useAuth();
	const {startInterview} = useInterview();

	const [selectedJobIndex, setSelectedJobIndex] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

	// Handle window resize
	useState(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 640);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const interviewTypes = [
		{
			title: "AI/ML Engineer",
			level: "Senior",
			tags: ["Python", "TensorFlow", "PyTorch"],
			features: ["AI/ML", "Remote"],
			description:
				"Measure expertise in developing and deploying ML models with TensorFlow/PyTorch and Python for real-world applications.",
		},
		{
			title: "Full Stack Developer",
			level: "Skilled",
			tags: ["JavaScript", "Node.js", "React", "MongoDB"],
			features: ["Web Development", "Hybrid"],
			description:
				"Evaluate expertise in building scalable web applications with React, Node.js, and MongoDB using modern full-stack development practices.",
		},
		{
			title: "Cybersecurity Analyst",
			level: "TryHard",
			tags: ["Networking", "Ethical Hacking", "SIEM"],
			features: ["Security", "Remote"],
			description:
				"Assess knowledge in securing systems, ethical hacking methodologies, and SIEM tools to prevent cyber threats.",
		},
		{
			title: "Data Scientist",
			level: "Junior",
			tags: ["Python", "Pandas", "Machine Learning"],
			features: ["Data Science", "On-site"],
			description:
				"Test the ability to analyze large datasets, apply machine learning techniques, and use Python libraries like Pandas for insights.",
		},
		{
			title: "DevOps Engineer",
			level: "Skilled",
			tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
			features: ["Cloud Computing", "Hybrid"],
			description:
				"Measure proficiency in automating deployments, managing cloud infrastructure, and implementing CI/CD pipelines using Docker and Kubernetes.",
		},
		{
			title: "Frontend Developer",
			level: "Intern",
			tags: ["HTML", "CSS", "JavaScript", "React"],
			features: ["Web Development", "Remote"],
			description:
				"Assess skills in building interactive UI components and responsive web applications using React and modern front-end technologies.",
		},
		{
			title: "Blockchain Developer",
			level: "TryHard",
			tags: ["Solidity", "Ethereum", "Smart Contracts"],
			features: ["Blockchain", "Remote"],
			description:
				"Evaluate knowledge in developing smart contracts and decentralized applications (DApps) on Ethereum using Solidity.",
		},
		{
			title: "Embedded Systems Engineer",
			level: "Skilled",
			tags: ["C", "Microcontrollers", "RTOS"],
			features: ["IoT", "On-site"],
			description:
				"Test expertise in programming microcontrollers, working with real-time operating systems, and developing IoT solutions.",
		},
		{
			title: "Cloud Architect",
			level: "Senior",
			tags: ["Azure", "AWS", "Google Cloud", "Terraform"],
			features: ["Cloud Computing", "Hybrid"],
			description:
				"Assess experience in designing scalable cloud infrastructure, managing multi-cloud environments, and implementing IaC using Terraform.",
		},
		{
			title: "Mobile App Developer",
			level: "Junior",
			tags: ["Flutter", "React Native", "Android", "iOS"],
			features: ["App Development", "Remote"],
			description:
				"Evaluate expertise in building cross-platform mobile applications with Flutter or React Native for Android and iOS.",
		},
		{
			title: "Game Developer",
			level: "Intern",
			tags: ["Unity", "C#", "Unreal Engine"],
			features: ["Game Development", "On-site"],
			description:
				"Test game development skills in building interactive experiences with Unity, Unreal Engine, and programming in C#.",
		},
	];

	const tryInterview = async (index) => {
		if (!isAuthenticated) {
			alert("Please log in to start an interview.");
			return;
		}
		setError(null);
		setIsLoading(true);
		navigate("/interview");
		try {
			let result = await startInterview(
				interviewTypes[index].level,
				interviewTypes[index].description
			);

			if (result.length == 0) navigate("/selectinterview");
		} catch (error) {
			setError("Failed to start interview. Please try again.");
			console.error("Interview selection error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const HandleFormSubmit = async (jobLevel, jobDescription) => {
		if (!isAuthenticated) {
			navigate("/login", {state: {from: "/selectinterview"}});
			return;
		}

		setIsLoading(true);
		setError(null);

		navigate("/interview");
		try {
			let result = await startInterview(jobLevel, jobDescription);
			if (result.length == 0) navigate("/selectinterview");
		} catch (error) {
			setError("Failed to start interview. Please try again.");
			console.error("Interview selection error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectJob = (index) => {
		setSelectedJobIndex(selectedJobIndex == index ? null : index);
	};

	return (
		<div className="container mx-auto p-6  max-w-7xl">
			<div
				className={`relative h-full bg-violet-800/20 dark:bg-neutral-900/10 
      ${isLoading ? "" : "backdrop-blur-sm dark:backdrop-blur-sm"} 
				backdrop-blur-3xl
      transition-all duration-800 ease-out flex flex-col justify-center items-center 
      text-zinc-800 dark:text-white text-center p-8`}>
				<h1 className="text-3xl mb-2 font-bold text-zinc-800 dark:text-white text-center">
					Choose Your Interview Type
				</h1>
				<p className="text-lg mb-4 max-w-3xl">Onlt Technical For Now</p>
			</div>

			<div className="flex flex-col sm:flex-row gap-8 relative">
				{/* Left side - Job List (remains the same) */}
				<div className="sm:w-3/5">
					<JobList
						interviewTypes={interviewTypes}
						selectedJobIndex={selectedJobIndex}
						tryInterview={tryInterview}
						handleSelectJob={handleSelectJob}
					/>
				</div>

				{/* Right side - Sticky content that appears with transition */}
				<div
					className={`
					sm:w-2/5 space-y-6 
					hidden sm:block 
					sm:sticky sm:top-24 sm:self-start
				`}>
					{selectedJobIndex !== null && (
						<JobDetails
							selectedJobIndex={selectedJobIndex}
							interviewTypes={interviewTypes}
							tryInterview={tryInterview}
							isAuthenticated={isAuthenticated}
						/>
					)}

					<JobForm
						isAuthenticated={isAuthenticated}
						HandleFormSubmit={HandleFormSubmit}
					/>
				</div>

				{/* Mobile view for form (only shown when no job is selected) */}
				{isMobile && (
					<div className="w-full mt-6 sm:hidden">
						<JobForm
							isAuthenticated={isAuthenticated}
							HandleFormSubmit={HandleFormSubmit}
						/>
					</div>
				)}

				{/* Error message display */}
				{error && (
					<div
						className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 
						text-red-700 dark:text-red-200 px-4 py-3 rounded relative mt-4"
						role="alert">
						<span className="block sm:inline">{error}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default InterviewSelection;
