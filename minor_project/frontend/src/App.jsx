import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import LandingPage from "./pages/LandingPage";
import InterviewSelection from "./pages/InterviewSelection";
import UploadResume from "./pages/UploadResume";
import VideoScreening from "./pages/VideoScreening";
import Summary from "./pages/Summary";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<LandingPage />} />
					<Route path="interviews" element={<InterviewSelection />} />
					<Route path="interview">
						<Route index element={<UploadResume />} />
						<Route
							path="videoscreening"
							element={<VideoScreening />}
						/>
						<Route path="summary" element={<Summary />} />
					</Route>
					<Route path="*" element={<NoPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
