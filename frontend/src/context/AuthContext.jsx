import {createContext, useState, useEffect, useContext, useRef} from "react";

const AuthContext = createContext();
const backendURL = "http://localhost:8080/auth";

export const AuthProvider = ({children}) => {
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const hasCheckedToken = useRef(false);

	const handleSetToken = (token) => {
		if (token === null) {
			setToken(token);
			localStorage.removeItem("token");
			return;
		}
		setToken(token);
		localStorage.setItem("token", token);
	};

	useEffect(() => {
		const checkToken = async () => {
			if (!token || hasCheckedToken.current || token === null) {
				setLoading(false);
				return;
			}

			hasCheckedToken.current = true;
			let url = `${backendURL}/login`;

			try {
				let response = await fetch(url, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				console.log(response);
				if (!response.ok) throw new Error("fetch user failed");
				let result = await response.json();
				if (result.user) setIsAuthenticated(true);
			} catch (error) {
				console.error("Error checking token:", error);
			} finally {
				setLoading(false);
			}
		};

		checkToken();
	}, [token]);

	const register = async (username, email, password) => {
		try {
			const res = await fetch(`${backendURL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({username, email, password}),
			});

			const data = await res.json();
			if (!res.ok) {
				alert(data.message);
				console.log(data.message);
				throw new Error("Registration failed");
			}

			if (data.token) {
				handleSetToken(data.token);
				setIsAuthenticated(true);
				return {
					success: true,
					message: "Registration successful. You are now logged in.",
				};
			} else {
				return {
					success: false,
					message: "Registration successful, but no token received.",
				};
			}
		} catch (error) {
			console.error("Registration error:", error);
			return {
				success: false,
				message: "Registration failed. Please try again.",
			};
		}
	};

	const login = async (email, password) => {
		try {
			const res = await fetch(`${backendURL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({email, password}),
			});

			const data = await res.json();
			if (!res.ok) {
				alert(data.message);
				console.log(data.message);
				throw new Error("Login failed");
			}

			localStorage.setItem("token", data.token);
			handleSetToken(data.token);
			setIsAuthenticated(true);
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		handleSetToken(null);
		setIsAuthenticated(false);
	};

	const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				const response = await fetch(
					`${backendURL}/google?code=${authResult["code"]}`
				);
				const result = await response.json();

				if (!response.ok)
					throw new Error(result.message || "Google login failed");

				const {email, username} = result.user;
				const token = result.token;

				// Store token & user data
				handleSetToken(token);
				localStorage.setItem(
					"user-info",
					JSON.stringify({email, username})
				);

				// Update authentication state
				setIsAuthenticated(true);

				return {success: true, message: "Google login successful"};
			} else {
				throw new Error("Invalid Google authentication response");
			}
		} catch (e) {
			console.error("Error during Google Login:", e);
			return {
				success: false,
				message: "Google login failed. Please try again.",
			};
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
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
