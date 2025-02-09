import {useNavigate} from "react-router-dom";

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div>
			{/* Hero Section */}
			<div
				style={{
					height: "80vh",
					background:
						"linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/interview-bg.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
					textAlign: "center",
					padding: "2rem",
				}}>
				<h1 style={{fontSize: "3.5rem", marginBottom: "1.5rem"}}>
					Master Your Interview Skills with AI
				</h1>
				<p
					style={{
						fontSize: "1.5rem",
						marginBottom: "2rem",
						maxWidth: "800px",
					}}>
					Practice interviews, get real-time feedback, and boost your
					confidence
				</p>
				<button
					className="cta-button"
					onClick={() => navigate("/interviews")}
					style={{fontSize: "1.2rem", padding: "1rem 2.5rem"}}>
					Start Practicing Now
				</button>
			</div>

			{/* Benefits Section */}
			<div
				style={{
					padding: "4rem 2rem",
					backgroundColor: "white",
				}}>
				<h2
					style={{
						textAlign: "center",
						marginBottom: "3rem",
						color: "#2c3e50",
					}}>
					Why Choose InterviewPrep AI?
				</h2>

				<div className="features">
					<div className="feature-card">
						<h3>🤖 AI-Powered Practice</h3>
						<p>
							Get realistic interview experience with our advanced
							AI interviewer
						</p>
					</div>

					<div className="feature-card">
						<h3>📊 Instant Feedback</h3>
						<p>
							Receive detailed analysis and suggestions to improve
							your responses
						</p>
					</div>

					<div className="feature-card">
						<h3>🎯 Personalized Experience</h3>
						<p>
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
