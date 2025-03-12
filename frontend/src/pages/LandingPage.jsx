import {useNavigate} from "react-router-dom";
import {showToast} from "../utils/toast";
import GameOfLife from "../components/GameOfLife";
import AnimatedGlassButton from "../components/GlowButton";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";

const LandingPage = () => {
	const {isAuthenticated} = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 200);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0]">
			{/* Hero Section */}
			<div className="relative h-[90vh]">
				{/* Background Image */}
				<div className="absolute inset-0 bg-cover bg-top w-full h-full">
					<GameOfLife />
				</div>

				{/* Foreground Content with Blur */}
				<div
					className={`relative h-full backdrop-brightness-90 dark:bg-neutral-900/10 
      ${isLoading ? "" : "backdrop-blur-sm dark:backdrop-blur-sm"} 
				backdrop-blur-3xl
      transition-all duration-800 ease-out flex flex-col justify-center items-center 
      text-zinc-800 dark:text-white text-center p-8`}>
					<h1 className="text-5xl mb-6 font-bold">
						Your Career Algorithm is Buggy. Let's Fix That.
					</h1>

					<p className="text-2xl mb-8 max-w-3xl">
						Get AI-powered insights and patch your weaknesses before
						your real interview.
					</p>

					<AnimatedGlassButton
						onClick={() => navigate("/selectinterview")}
					/>
				</div>
			</div>

			{/* Benefits Section */}
			<div className="py-16 px-8 bg-[#FFFFFF] dark:bg-[#1E293B]">
				<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
					Why Choose InterviewPrep AI?
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
					<div className="p-6 bg-[#FFFFFF] dark:bg-[#0F172A] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#E2E8F0] dark:border-[#1E293B]">
						<h3 className="text-xl font-semibold mb-4 text-[#2563EB] dark:text-[#3B82F6]">
							🤖 AI-Powered Practice
						</h3>
						<p className="text-[#1E293B] dark:text-[#E2E8F0]">
							Get realistic interview experience with our advanced
							AI interviewer
						</p>
					</div>

					<div className="p-6 bg-[#FFFFFF] dark:bg-[#0F172A] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#E2E8F0] dark:border-[#1E293B]">
						<h3 className="text-xl font-semibold mb-4 text-[#2563EB] dark:text-[#3B82F6]">
							📊 Instant Feedback
						</h3>
						<p className="text-[#1E293B] dark:text-[#E2E8F0]">
							Receive detailed analysis and suggestions to improve
							your responses
						</p>
					</div>

					<div className="p-6 bg-[#FFFFFF] dark:bg-[#0F172A] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#E2E8F0] dark:border-[#1E293B]">
						<h3 className="text-xl font-semibold mb-4 text-[#2563EB] dark:text-[#3B82F6]">
							🎯 Personalized Experience
						</h3>
						<p className="text-[#1E293B] dark:text-[#E2E8F0]">
							Practice interviews tailored to your industry and
							experience level
						</p>
					</div>
				</div>
			</div>

			{/* How It Works Section */}
			<div className="py-16 px-8 bg-[#F8FAFC] dark:bg-[#0F172A]">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
						How It Works
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] text-white flex items-center justify-center text-2xl font-bold mb-4">
								1
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Select Interview
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Choose an interview category or subject that
								matches your needs
							</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] text-white flex items-center justify-center text-2xl font-bold mb-4">
								2
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Upload Resume
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Submit your resume and answer AI-driven
								pre-screening questions
							</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] text-white flex items-center justify-center text-2xl font-bold mb-4">
								3
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Practice Interview
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Engage in a simulated video interview with
								realistic scenarios
							</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] text-white flex items-center justify-center text-2xl font-bold mb-4">
								4
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Get Feedback
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Receive AI-powered feedback and detailed
								performance insights
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Key Features Section */}
			<div className="py-16 px-8 bg-[#FFFFFF] dark:bg-[#1E293B]">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
						Key Features
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="p-6 flex items-start bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="text-3xl mr-4 text-[#2563EB] dark:text-[#3B82F6]">
								🎯
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 text-[#1E293B] dark:text-[#E2E8F0]">
									Realistic AI Interviews
								</h3>
								<p className="text-[#1E293B] dark:text-[#E2E8F0]">
									Experience real-world interview scenarios
									with dynamic questions and industry-specific
									challenges
								</p>
							</div>
						</div>

						<div className="p-6 flex items-start bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="text-3xl mr-4 text-[#2563EB] dark:text-[#3B82F6]">
								📄
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 text-[#1E293B] dark:text-[#E2E8F0]">
									Resume Evaluation
								</h3>
								<p className="text-[#1E293B] dark:text-[#E2E8F0]">
									Get detailed feedback on your resume with
									suggestions for improvement and highlights
									of strengths
								</p>
							</div>
						</div>

						<div className="p-6 flex items-start bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="text-3xl mr-4 text-[#2563EB] dark:text-[#3B82F6]">
								📹
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 text-[#1E293B] dark:text-[#E2E8F0]">
									Video Screening
								</h3>
								<p className="text-[#1E293B] dark:text-[#E2E8F0]">
									Improve your body language, tone, and
									communication skills with video analysis
								</p>
							</div>
						</div>

						<div className="p-6 flex items-start bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="text-3xl mr-4 text-[#2563EB] dark:text-[#3B82F6]">
								📊
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2 text-[#1E293B] dark:text-[#E2E8F0]">
									Performance Analysis
								</h3>
								<p className="text-[#1E293B] dark:text-[#E2E8F0]">
									Receive AI-driven insights on your strengths
									and areas for improvement with actionable
									growth plans
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Who Can Benefit Section */}
			<div className="py-16 px-8 bg-[#F8FAFC] dark:bg-[#0F172A]">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
						Who Can Benefit?
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="p-6 text-center">
							<div className="text-5xl mb-4 text-[#2563EB] dark:text-[#3B82F6]">
								🚀
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Job Seekers
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Preparing for interviews and wanting to stand
								out from the competition
							</p>
						</div>

						<div className="p-6 text-center">
							<div className="text-5xl mb-4 text-[#2563EB] dark:text-[#3B82F6]">
								🎓
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Students
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Getting ready for campus placements and first
								job interviews
							</p>
						</div>

						<div className="p-6 text-center">
							<div className="text-5xl mb-4 text-[#2563EB] dark:text-[#3B82F6]">
								🔄
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Career Switchers
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Professionals looking to transition to a new
								industry or role
							</p>
						</div>

						<div className="p-6 text-center">
							<div className="text-5xl mb-4 text-[#2563EB] dark:text-[#3B82F6]">
								🏆
							</div>
							<h3 className="text-xl font-semibold mb-3 text-[#1E293B] dark:text-[#E2E8F0]">
								Skill Improvers
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Anyone wanting to enhance their interview and
								communication skills
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div className="py-16 px-8 bg-[#FFFFFF] dark:bg-[#1E293B]">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
						Success Stories
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold mr-4">
									JD
								</div>
								<div>
									<h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
										James Douglas
									</h3>
									<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
										Software Engineer
									</p>
								</div>
							</div>
							<p className="text-[#1E293B] dark:text-[#E2E8F0] italic">
								"After practicing with InterviewPrep AI for two
								weeks, I aced my interview at a top tech
								company. The feedback helped me refine my
								answers and boost my confidence."
							</p>
						</div>

						<div className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 rounded-full bg-[#38BDF8] flex items-center justify-center text-white font-bold mr-4">
									SP
								</div>
								<div>
									<h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
										Sarah Parker
									</h3>
									<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
										Marketing Specialist
									</p>
								</div>
							</div>
							<p className="text-[#1E293B] dark:text-[#E2E8F0] italic">
								"The resume analysis pointed out weaknesses I
								hadn't noticed. After implementing the
								suggestions, I started getting calls for
								interviews within days!"
							</p>
						</div>

						<div className="p-6 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold mr-4">
									MR
								</div>
								<div>
									<h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
										Michael Rodriguez
									</h3>
									<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
										Recent Graduate
									</p>
								</div>
							</div>
							<p className="text-[#1E293B] dark:text-[#E2E8F0] italic">
								"As a fresh graduate with no interview
								experience, this tool was invaluable. It helped
								me understand what employers look for and how to
								present my skills effectively."
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="py-16 px-8 bg-[#F8FAFC] dark:bg-[#0F172A]">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-center text-3xl font-bold mb-12 text-[#1E293B] dark:text-[#E2E8F0]">
						Frequently Asked Questions
					</h2>

					<div className="space-y-6">
						<div className="p-6 bg-[#FFFFFF] dark:bg-[#1E293B] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<h3 className="text-xl font-semibold mb-3 text-[#2563EB] dark:text-[#3B82F6]">
								Is the AI interview experience free?
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								We offer a free basic tier that includes one
								practice interview and limited feedback. Premium
								plans unlock unlimited interviews, in-depth
								analysis, and personalized coaching.
							</p>
						</div>

						<div className="p-6 bg-[#FFFFFF] dark:bg-[#1E293B] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<h3 className="text-xl font-semibold mb-3 text-[#2563EB] dark:text-[#3B82F6]">
								How accurate is the AI feedback?
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Our AI has been trained on thousands of real
								interviews and industry best practices. While no
								AI is perfect, our users report 92% satisfaction
								with the feedback accuracy and helpfulness.
							</p>
						</div>

						<div className="p-6 bg-[#FFFFFF] dark:bg-[#1E293B] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<h3 className="text-xl font-semibold mb-3 text-[#2563EB] dark:text-[#3B82F6]">
								Can I practice multiple interviews?
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Yes! We offer interviews across different
								industries, roles, and difficulty levels. With
								our premium plans, you can practice as many
								interviews as you need to feel confident.
							</p>
						</div>

						<div className="p-6 bg-[#FFFFFF] dark:bg-[#1E293B] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
							<h3 className="text-xl font-semibold mb-3 text-[#2563EB] dark:text-[#3B82F6]">
								How long does each practice interview take?
							</h3>
							<p className="text-[#1E293B] dark:text-[#E2E8F0]">
								Most interview sessions last between 20-30
								minutes, followed by an immediate feedback
								report. You can also choose quick 10-minute
								focused sessions for specific skills.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			{!isAuthenticated && (
				<div className="py-16 px-8 bg-[#2563EB] dark:bg-[#3B82F6]">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-6 text-white">
							Ready to Debug Your Interview Skills?
						</h2>
						<p className="text-xl mb-8 text-white">
							Join thousands of successful candidates who aced
							their interviews after practicing with our platform.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								className="px-8 py-4 bg-white text-[#2563EB] hover:bg-[#F8FAFC] font-bold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
								onClick={() => navigate("/register")}>
								Create Free Account
							</button>
							{/* <button
							className="px-8 py-4 bg-transparent text-white border-2 border-white hover:bg-white/10 font-bold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
							onClick={() => navigate("/selectinterview")}>
							Try Demo Interview
						</button> */}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LandingPage;
