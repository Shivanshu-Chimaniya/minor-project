import {useNavigate} from "react-router-dom";
import {useBackend} from "../context/Backend";

const LandingPage = () => {
	const navigate = useNavigate();
	const backend = useBackend();

	return (
		<div>
			{/* Hero Section */}
			<div className="relative h-[90vh]">
				{/* Background Image */}
				<div className="absolute inset-0 bg-[url('/background3.png')] bg-cover bg-top"></div>

				{/* Foreground Content with Blur */}
				<div className="relative h-full bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center text-white text-center p-8">
					<h1 className="text-5xl mb-6">
						Master Your Interview Skills with AI
					</h1>

					<p className="text-2xl mb-8 max-w-3xl">
						Practice interviews, get real-time feedback, and boost
						your confidence
					</p>
					<button
						className="text-lg px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						onClick={() => navigate("/selectinterview")}>
						Start Practicing Now
					</button>
				</div>
			</div>

			{/* Benefits Section */}
			<div className="py-16 px-8 bg-white">
				<h2 className="text-center mb-12 text-gray-800">
					Why Choose InterviewPrep AI?
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
						<h3 className="text-xl font-semibold mb-4">
							🤖 AI-Powered Practice
						</h3>
						<p className="text-gray-600">
							Get realistic interview experience with our advanced
							AI interviewer
						</p>
					</div>

					<div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
						<h3 className="text-xl font-semibold mb-4">
							📊 Instant Feedback
						</h3>
						<p className="text-gray-600">
							Receive detailed analysis and suggestions to improve
							your responses
						</p>
					</div>

					<div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
						<h3 className="text-xl font-semibold mb-4">
							🎯 Personalized Experience
						</h3>
						<p className="text-gray-600">
							Practice interviews tailored to your industry and
							experience level
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
