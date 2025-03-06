import {StrictMode, useContext} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {BackendProvider} from "./context/BackendContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<BackendProvider>
			<App />
		</BackendProvider>
	</AuthProvider>
);
