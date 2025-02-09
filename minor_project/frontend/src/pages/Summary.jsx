import {useNavigate} from "react-router-dom";
import {FaCheckCircle, FaExclamationCircle, FaStar} from "react-icons/fa";

const Summary = () => {
	const navigate = useNavigate();

	// Example data - in real app this would come from props or state
	const interviewScore = 85;
	const strengths = [
		"Excellent communication skills",
		"Strong technical knowledge",
		"Clear problem-solving approach",
	];
	const improvements = [
		"Could provide more specific examples",
		"Consider adding more detail to responses",
		"Work on concise answer delivery",
	];

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col space-y-8">
					{/* Score Section */}
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
							Interview Performance
						</h1>
						<div className="flex items-center justify-center space-x-2">
							<FaStar className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
							<span className="text-4xl md:text-6xl font-bold text-gray-800">
								{interviewScore}%
							</span>
						</div>
					</div>

					{/* Strengths Section */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
							Strengths
						</h2>
						<ul className="space-y-3">
							{strengths.map((strength, index) => (
								<li
									key={index}
									className="flex items-start space-x-3">
									<FaCheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
									<span className="text-gray-700">
										{strength}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Areas for Improvement Section */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
							Areas for Improvement
						</h2>
						<ul className="space-y-3">
							{improvements.map((improvement, index) => (
								<li
									key={index}
									className="flex items-start space-x-3">
									<FaExclamationCircle className="flex-shrink-0 w-5 h-5 text-orange-400 mt-1" />
									<span className="text-gray-700">
										{improvement}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Return Button */}
					<button
						onClick={() => navigate("/")}
						className="w-full md:w-auto md:mx-auto px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-lg font-medium shadow-md">
						Return to Home
					</button>
				</div>
			</div>
		</div>
	);
};

export default Summary;
