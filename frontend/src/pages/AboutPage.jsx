import React, {useState, useEffect} from "react";
import {
	FiSun,
	FiMoon,
	FiPlay,
	FiDatabase,
	FiCloud,
	FiCode,
	FiGitMerge,
} from "react-icons/fi";
import {RiSparklingFill} from "react-icons/ri";
import {LuBrain as FiBrain} from "react-icons/lu";

const ElaraShowcase = () => {
	return (
		<div className="bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] transition-all duration-300 min-h-screen p-8">
			<div className="max-w-5xl mx-auto">
				{/* Header with theme toggle */}
				<header className="flex justify-between items-center mb-12">
					<div className="flex items-center gap-2">
						<RiSparklingFill
							size={32}
							className="text-[#2563EB] dark:text-[#3B82F6] animate-pulse"
						/>
						<h1 className="text-4xl font-bold text-[#2563EB] dark:text-[#3B82F6]">
							Elara
						</h1>
					</div>
				</header>

				{/* Introduction Card */}
				<div className="mb-8 p-6 rounded-lg shadow-lg bg-white dark:bg-[#1E293B] border-l-4 border-[#2563EB] dark:border-[#3B82F6]">
					<h2 className="text-2xl font-bold mb-4">Introduction</h2>
					<p className="mb-4">
						Elara is an AI-driven interview platform designed to
						assist users in
						<span className="text-[#2563EB] dark:text-[#3B82F6] font-bold">
							{" "}
							practicing, analyzing, and improving{" "}
						</span>
						their interview skills. This project leverages
						<span className="text-[#2563EB] dark:text-[#3B82F6] font-bold">
							{" "}
							AI, speech recognition, and cloud-based processing{" "}
						</span>
						to create an interactive interview experience.
					</p>
					<div className="flex justify-center mt-4">
						<div className="p-4 rounded-lg flex items-center gap-3 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10">
							<FiPlay
								size={24}
								className="text-[#2563EB] dark:text-[#3B82F6]"
							/>
							<p className="text-lg font-medium text-[#2563EB] dark:text-[#3B82F6]">
								Elevate your interview performance with AI
								guidance
							</p>
						</div>
					</div>
				</div>

				{/* Tech Stack Section */}
				<div className="mb-8 p-6 rounded-lg shadow-lg bg-white dark:bg-[#1E293B] border-l-4 border-[#38BDF8] dark:border-[#60A5FA]">
					<h2 className="text-2xl font-bold mb-4">Tech Stack</h2>

					{/* Frontend */}
					<div className="mb-6">
						<h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#2563EB] dark:text-[#3B82F6]">
							<FiCode
								size={20}
								className="text-[#2563EB] dark:text-[#3B82F6]"
							/>
							Frontend
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#2563EB]/5 dark:bg-[#3B82F6]/10">
								<div className="w-3 h-3 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]"></div>
								<p>
									<strong>React (Vite)</strong> – For fast and
									optimized UI development
								</p>
							</div>
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#2563EB]/5 dark:bg-[#3B82F6]/10">
								<div className="w-3 h-3 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]"></div>
								<p>
									<strong>Tailwind CSS</strong> – For
									responsive and modern styling
								</p>
							</div>
						</div>
					</div>

					{/* Backend & Processing */}
					<div>
						<h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#38BDF8] dark:text-[#60A5FA]">
							<FiDatabase
								size={20}
								className="text-[#38BDF8] dark:text-[#60A5FA]"
							/>
							Backend & Processing
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#38BDF8]/5 dark:bg-[#60A5FA]/10">
								<div className="w-3 h-3 rounded-full bg-[#38BDF8] dark:bg-[#60A5FA]"></div>
								<p>
									<strong>
										Web Speech API & Web Speech Recognition
										API
									</strong>{" "}
									- For real-time speech-to-text conversion in
									video interviews
								</p>
							</div>
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#38BDF8]/5 dark:bg-[#60A5FA]/10">
								<div className="w-3 h-3 rounded-full bg-[#38BDF8] dark:bg-[#60A5FA]"></div>
								<p>
									<strong>Gemini AI</strong> - For generating
									human-like interview responses and feedback
								</p>
							</div>
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#38BDF8]/5 dark:bg-[#60A5FA]/10">
								<div className="w-3 h-3 rounded-full bg-[#38BDF8] dark:bg-[#60A5FA]"></div>
								<p>
									<strong>MongoDB</strong> - Storing user
									interview data and AI-generated insights
								</p>
							</div>
							<div className="p-3 rounded-md flex items-center gap-2 bg-[#38BDF8]/5 dark:bg-[#60A5FA]/10">
								<div className="w-3 h-3 rounded-full bg-[#38BDF8] dark:bg-[#60A5FA]"></div>
								<p>
									<strong>Cloudinary</strong> - Secure storage
									for user-uploaded resumes and video
									responses
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Future Scope */}
				<div className="mb-8 p-6 rounded-lg shadow-lg bg-white dark:bg-[#1E293B] border-l-4 border-[#22C55E] dark:border-[#10B981]">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<FiGitMerge
							size={24}
							className="text-[#22C55E] dark:text-[#10B981]"
						/>
						Future Scope
					</h2>
					<div className="space-y-4">
						<div className="p-4 rounded-md bg-[#22C55E]/5 dark:bg-[#10B981]/10">
							<h3 className="font-semibold mb-1 text-[#22C55E] dark:text-[#10B981]">
								Enhanced AI Feedback
							</h3>
							<p>
								Refining Gemini's responses for better
								evaluation and personalized feedback.
							</p>
						</div>
						<div className="p-4 rounded-md bg-[#22C55E]/5 dark:bg-[#10B981]/10">
							<h3 className="font-semibold mb-1 text-[#22C55E] dark:text-[#10B981]">
								Real-Time AI Suggestions
							</h3>
							<p>
								Providing AI-powered hints and suggestions
								during live interviews.
							</p>
						</div>
						<div className="p-4 rounded-md bg-[#22C55E]/5 dark:bg-[#10B981]/10">
							<h3 className="font-semibold mb-1 text-[#22C55E] dark:text-[#10B981]">
								Facial Expression Analysis
							</h3>
							<p>
								Implementing emotion recognition to assess
								confidence and engagement.
							</p>
						</div>
						<div className="p-4 rounded-md bg-[#22C55E]/5 dark:bg-[#10B981]/10">
							<h3 className="font-semibold mb-1 text-[#22C55E] dark:text-[#10B981]">
								More Question Banks
							</h3>
							<p>
								Expanding interview questions across different
								domains with adaptive difficulty.
							</p>
						</div>
					</div>
				</div>

				{/* Project Status */}
				<div className="p-6 rounded-lg shadow-lg relative overflow-hidden bg-white dark:bg-[#1E293B] border-l-4 border-[#FACC15] dark:border-[#FBBF24]">
					<div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full bg-[#FACC15]/10 dark:bg-[#FBBF24]/10 z-0"></div>
					<div className="relative z-10">
						<h2 className="text-2xl font-bold mb-4">
							Project Status
						</h2>
						<p className="mb-4">
							Elara is a{" "}
							<strong className="text-[#FACC15] dark:text-[#FBBF24]">
								college project
							</strong>{" "}
							currently in development, focusing on improving{" "}
							<strong className="text-[#FACC15] dark:text-[#FBBF24]">
								AI-based interview analysis and user experience
							</strong>
							. Future enhancements may include{" "}
							<strong className="text-[#FACC15] dark:text-[#FBBF24]">
								deep learning models
							</strong>{" "}
							for advanced evaluation and potential{" "}
							<strong className="text-[#FACC15] dark:text-[#FBBF24]">
								integration with job platforms
							</strong>
							.
						</p>
					</div>
					<div className="flex justify-center mt-6 relative z-10">
						<div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-[#FACC15]/20 dark:bg-[#FBBF24]/20 text-[#FACC15] dark:text-[#FBBF24] font-bold">
							<FiBrain size={20} />
							<span>Powered by Artificial Intelligence</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ElaraShowcase;
