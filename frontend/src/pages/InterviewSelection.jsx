import {useNavigate} from "react-router-dom";

const InterviewSelection = () => {
	const navigate = useNavigate();

	const interviewTypes = [
		{
			title: "Software Engineering Interview",
			description:
				"Practice technical questions and system design discussions commonly asked in software engineering interviews.",
			type: "swe",
		},
		{
			title: "Product Management Interview",
			description:
				"Prepare for product sense, analytical, and leadership questions typical in PM interviews.",
			type: "pm",
		},
		{
			title: "Data Science Interview",
			description:
				"Practice statistical concepts, machine learning fundamentals, and technical problem solving.",
			type: "ds",
		},
		{
			title: "Behavioral Interview",
			description:
				"Master common behavioral and situational questions asked across all roles.",
			type: "behavioral",
		},
	];

	const startInterview = (type) => {
		navigate("/interview", {state: {interviewType: type}});
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
							<p className="text-gray-600 leading-relaxed text-base sm:text-lg">
								{interview.description}
							</p>
						</div>
						<button
							onClick={() => startInterview(interview.type)}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base sm:text-lg">
							Start Interview
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default InterviewSelection;
