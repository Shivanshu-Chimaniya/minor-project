import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
// Register Page Component
const RegisterPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const {register} = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!name || !email || !password || !confirmPassword) {
			setError("Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);
		try {
			await register(name, email, password);
			navigate("/"); // Redirect to dashboard after successful login
		} catch (err) {
			setError(err.message || "Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit2 = async (e) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Create an Account</h1>
					<p className="mt-2 text-gray-600">Sign up to get started</p>
				</div>

				{error && (
					<div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
						{error}
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700">
							Full Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="John Doe"
						/>
					</div>

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

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="••••••••"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
							{isLoading ? "Creating account..." : "Sign up"}
						</button>
					</div>
				</form>

				<div className="text-center mt-4">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<a
							href="/login"
							className="font-medium text-indigo-600 hover:text-indigo-500">
							Sign in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
