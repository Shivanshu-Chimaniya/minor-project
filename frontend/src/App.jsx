import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import LandingPage from "./pages/LandingPage";
import InterviewSelection from "./pages/InterviewSelection";
import UploadResume from "./pages/UploadResume";
import VideoScreening from "./pages/VideoScreening";
import Summary from "./pages/Summary";
import {useState} from "react";
import {useBackend} from "./context/BackendContext";

import {AuthProvider, useAuth} from "./context/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/ProfilePage";
import RegisterPage from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RefrshHandler from "./pages/RefreshHandler.jsx";

function App() {
	const backend = useBackend();
	const auth = useAuth();
	const [questions, setQuestions] = useState([]);
	const [questionAudio, setQuestionAudio] = useState([]);

	const [jobDetails, setJobDetails] = useState({
		"level": null,
		"description": null,
	});
	const [resumeResult, setResumeResult] = useState([]);
	const [answers, setAnswers] = useState({});
	const [overallResult, setOverallResult] = useState({});
	const [feedbacks, setFeedbacks] = useState({});

	const startInterview = async (level, jobDescription) => {
		setJobDetails({level, "description": jobDescription});
		getQuestions(level, jobDescription);
	};

	const getQuestions = async (level, jobDescription) => {
		const response = await backend.getQuestions(level, jobDescription);
		let questions = response.questions;
		setQuestions(questions);
		getQuestionAudios(questions);
		return questions;
	};
	const getQuestionAudios = async (questions) => {
		let temp = [];
		for (let question of questions) {
			let audiofile = await backend.getAudio(question);
			temp.push(audiofile);
		}
		setQuestionAudio(temp);
	};

	const saveAnswer = async (answer, questionNumber) => {
		let newAnswers = {...answers, [questionNumber]: answer};
		setAnswers(newAnswers);
		let feedback = await backend.getAnswerFeedback(
			questions[questionNumber],
			answer
		);
		if (questionNumber + 1 == questions.length) {
			completeInterview(newAnswers);
		}
		setFeedbacks((prev) => {
			return {...prev, [questionNumber]: feedback};
		});
	};
	const completeInterview = async (answers) => {
		let result = await backend.getOverallResult(questions, answers);
		setOverallResult(result);
	};

	const uploadResume = async (file) => {
		let resumeRespose = await backend.getResumeResult(
			file,
			jobDetails.description
		);
		setResumeResult(resumeRespose);
	};

	return (
		<AuthProvider>
			<BrowserRouter>
				<RefrshHandler setIsAuthenticated={auth.setIsAuthenticated} />
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/login" element={<Login />} />

						<Route path="/register" element={<RegisterPage />} />
						<Route index element={<LandingPage />} />
						<Route
							path="selectinterview"
							element={
								<InterviewSelection
									startInterview={startInterview}
								/>
							}
						/>
						<Route path="interview" element={<ProtectedRoute />}>
							<Route
								index
								element={
									<UploadResume uploadResume={uploadResume} />
								}
							/>
							<Route
								path="videoscreening"
								element={
									<VideoScreening
										questions={questions}
										completeInterview={completeInterview}
										questionAudio={questionAudio}
										saveAnswer={saveAnswer}
									/>
								}
							/>
							<Route
								path="summary"
								element={
									<Summary
										questions={questions}
										answers={answers}
										overallResult={overallResult}
										resumeResult={resumeResult}
										feedbacks={feedbacks}
									/>
								}
							/>
						</Route>
						<Route path="*" element={<NoPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
