import {createContext, useState, useEffect, useContext, useRef} from "react";
import axios from "axios";
import {showToast} from "../utils/toast";

const AuthContext = createContext();
const backendURL = `${
	import.meta.env.VITE_BACKENDURL || "http://localhost:8080"
}/auth`;

export const AuthProvider = ({children}) => {
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const hasCheckedToken = useRef(false);

	// Axios instance with default headers
	const axiosInstance = axios.create({
		baseURL: backendURL,
		headers: {"Content-Type": "application/json"},
		timeout: 10000, // 10 seconds timeout
	});

	// Set token in headers dynamically
	axiosInstance.interceptors.request.use((config) => {
		const authToken = localStorage.getItem("token");
		if (authToken) {
			config.headers.Authorization = `Bearer ${authToken}`;
		}
		return config;
	});

	// Global error handling for authentication
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				showToast.error("Session expired. Logging out...");
				logout();
			}
			return Promise.reject(error);
		}
	);

	// Function to set token
	const handleSetToken = (newToken) => {
		if (!newToken) {
			setToken(null);
			setIsAuthenticated(false);
			setUser(null);
			localStorage.removeItem("token");
			localStorage.removeItem("user-info");
			return;
		}
		setToken(newToken);
		localStorage.setItem("token", newToken);
	};

	// Check if token is valid
	useEffect(() => {
		const checkToken = async () => {
			if (!token || hasCheckedToken.current) {
				setLoading(false);
				return;
			}
			hasCheckedToken.current = true;

			try {
				const response = await axiosInstance.get("/login");
				if (response.data.user) {
					setIsAuthenticated(true);
					setUser(response.data.user);
					localStorage.setItem(
						"user-info",
						JSON.stringify(response.data.user)
					);
					// showToast.success("Welcome back!");
				}
			} catch (error) {
				showToast.error(
					"Session validation failed. Please log in again."
				);
				handleSetToken(null);
			} finally {
				setLoading(false);
			}
		};

		checkToken();
	}, [token]);

	// Register function
	const register = async (formData) => {
		try {
			const {data} = await axiosInstance.post("/register", formData);
			if (data.token) {
				handleSetToken(data.token);
				setIsAuthenticated(true);
				showToast.success("Registration successful!");
			}
			return {success: true, message: "Registration successful"};
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Registration failed";
			showToast.error(errorMessage);
			return {success: false, message: errorMessage};
		}
	};

	// Login function
	const login = async (email, password) => {
		try {
			const {data} = await axiosInstance.post("/login", {
				email,
				password,
			});
			handleSetToken(data.token);
			setIsAuthenticated(true);
			showToast.success("Login successful!");
			return true;
		} catch (error) {
			showToast.error("Invalid credentials. Please try again.");
			return false;
		}
	};

	// Logout function
	const logout = () => {
		handleSetToken(null);
		setIsAuthenticated(false);
		showToast.info("Logged out successfully.");
	};

	// Google OAuth login
	const responseGoogle = async (authResult) => {
		try {
			if (authResult.code) {
				const {data} = await axiosInstance.get(
					`/google?code=${authResult.code}`
				);
				handleSetToken(data.token);
				localStorage.setItem(
					"user-info",
					JSON.stringify({
						email: data.user.email,
						username: data.user.username,
					})
				);
				setIsAuthenticated(true);
				showToast.success("Google login successful!");
				return {success: true, message: "Google login successful"};
			} else {
				throw new Error("Invalid Google authentication response");
			}
		} catch (e) {
			showToast.error("Google login failed. Please try again.");
			return {success: false, message: "Google login failed"};
		}
	};

	// Verify email token
	const verifyToken = async (verificationToken) => {
		try {
			if (!verificationToken)
				throw new Error("Invalid verification token");

			const {data} = await axiosInstance.get(
				`/verify-email?token=${verificationToken}`
			);
			showToast.success(data.message || "Email verified successfully!");
			return {
				success: true,
				message: data.message || "Email verified successfully",
			};
		} catch (e) {
			showToast.error("Verification failed. Please try again.");
			return {success: false, message: "Verification failed"};
		}
	};

	// Get user details
	const getUser = async () => {
		try {
			const {data} = await axiosInstance.get("/profile");
			if (data.success) {
				return data.user;
			}
			return data;
		} catch (error) {
			showToast.error("Failed to fetch user details.");
			return null;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				loading,
				login,
				logout,
				register,
				responseGoogle,
				setIsAuthenticated,
				isAuthenticated,
				verifyToken,
				getUser,
				user,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
