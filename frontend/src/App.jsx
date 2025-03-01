import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import LandingPage from "./pages/LandingPage";
import InterviewSelection from "./pages/InterviewSelection";
import UploadResume from "./pages/UploadResume";
import VideoScreening from "./pages/VideoScreening";
import Summary from "./pages/Summary";
import {useState} from "react";
import {useBackend} from "./context/Backend";

function App() {
	const backend = useBackend();
	const [questions, setQuestions] = useState([]);
	const [questionAudio, setQuestionAudio] = useState([]);

	const [jobDetails, setJobDetails] = useState({
		"level": null,
		"description": null,
	});
	const [resumeResult, setResumeResult] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [overallResult, setOverallResult] = useState({});

	const startInterview = async (level, jobDescription) => {
		setJobDetails({level, jobDescription});
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
	const completeInterview = async (answers) => {
		setAnswers(answers);
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
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<LandingPage />} />
					<Route
						path="selectinterview"
						element={
							<InterviewSelection
								startInterview={startInterview}
							/>
						}
					/>
					<Route path="interview">
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
								/>
							}
						/>
					</Route>
					<Route path="*" element={<NoPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
