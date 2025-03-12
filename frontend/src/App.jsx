import {Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import {useAuth} from "./context/AuthContext";
import InterviewSelection from "./pages/InterviewSelection";
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import ProfilePage from "./pages/ProfilePage";
import RefreshHandler from "./pages/RefreshHandler";
import RegisterPage from "./pages/Register";
import Summary from "./pages/Summary";
import UploadResume from "./pages/UploadResume";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import VideoScreening from "./pages/VideoScreening";

const App = () => {
	const {isAuthenticated} = useAuth();

	return (
		<>
			<RefreshHandler isAuthenticated={isAuthenticated} />
			<ToastContainer />
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<LandingPage />} />
					<Route
						path="/selectinterview"
						element={<InterviewSelection />}
					/>

					<Route path="/verify-email" element={<VerifyEmailPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Route>
				<Route path="interview" element={<ProtectedRoute />}>
					<Route index element={<UploadResume />} />
					<Route path="videoscreening" element={<VideoScreening />} />
					<Route path="summary" element={<Layout />}>
						<Route index element={<Summary />} />
					</Route>
				</Route>
				<Route path="*" element={<Layout />}>
					<Route path="*" element={<NoPage />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;
