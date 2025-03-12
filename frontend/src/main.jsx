import {StrictMode, useContext} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {BackendProvider} from "./context/BackendContext.jsx";
import {InterviewProvider} from "./context/InterviewContext.jsx";
import {BrowserRouter} from "react-router-dom";
import {CloudinaryProvider} from "./context/CloudinaryProvider.jsx";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<BackendProvider>
			<InterviewProvider>
				<BrowserRouter>
					<CloudinaryProvider>
						<App />
					</CloudinaryProvider>
				</BrowserRouter>
			</InterviewProvider>
		</BackendProvider>
	</AuthProvider>
);
