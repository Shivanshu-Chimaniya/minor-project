import React, {useState, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

// Login Page Component
const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const {login} = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		try {
			let res = await login(email, password);
			if (res) {
				navigate(from, {replace: true}); // Redirect to previous page or dashboard
			}
		} catch (err) {
			setError("Invalid email or password");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Welcome Back</h1>
					<p className="mt-2 text-gray-600">
						Sign in to your account
					</p>
				</div>

				{error && (
					<div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
						{error}
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="••••••••"
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm">
							<a
								href="/forgot-password"
								className="font-medium text-indigo-600 hover:text-indigo-500">
								Forgot your password?
							</a>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							log in
						</button>
					</div>
				</form>

				<div className="text-center mt-4">
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<a
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-500">
							Register
						</a>
					</p>
				</div>
				<GoogleLoginButton />
			</div>
		</div>
	);
};

export default LoginPage;
