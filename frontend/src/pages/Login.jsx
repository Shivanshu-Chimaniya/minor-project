import React, {useState, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import {showToast} from "../utils/toast";

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
				navigate(from, {replace: true});
			}
		} catch (err) {
			setError("Invalid email or password");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
			<div className="w-full max-w-md p-6 bg-[#FFFFFF] dark:bg-[#1E293B] rounded-lg shadow-md border border-[#E2E8F0] dark:border-[#1E293B]">
				<div className="text-center mb-4">
					<h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#E2E8F0]">
						Welcome Back
					</h1>
					<p className="mt-1 text-[#64748B] dark:text-[#94A3B8] text-sm">
						Sign in to your account
					</p>
				</div>

				{error && (
					<div className="p-2 mb-4 text-sm text-[#EF4444] bg-[#EF4444]/10 rounded-md">
						{error}
					</div>
				)}

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-[#1E293B] dark:text-[#E2E8F0] mb-1">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="block w-full px-3 py-2 border border-[#E2E8F0] dark:border-[#1E293B] rounded-md bg-[#FFFFFF] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6]"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-[#1E293B] dark:text-[#E2E8F0]">
								Password
							</label>
							<span
								onClick={() => {
									showToast.bottomRight(
										"Yet to be Implemented"
									);
								}}
								href="/forgot-password"
								className="text-xs font-medium text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA]">
								Forgot password?
							</span>
						</div>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="block w-full px-3 py-2 border border-[#E2E8F0] dark:border-[#1E293B] rounded-md bg-[#FFFFFF] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6]"
							placeholder="••••••••"
						/>
					</div>
					<div className="w-full flex align-middle justify-center">
						<button
							type="submit"
							className=" px-4 align-middle py-2 mt-2 text-sm font-medium text-white bg-[#2563EB] dark:bg-[#3B82F6] rounded-md hover:bg-[#1D4ED8] dark:hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:ring-offset-2">
							Log in
						</button>
					</div>
				</form>

				<div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-[#E2E8F0] dark:border-[#1E293B]"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 text-[#64748B] dark:text-[#94A3B8] bg-[#FFFFFF] dark:bg-[#1E293B]">
							or
						</span>
					</div>
				</div>
				<div className="w-full flex align-middle justify-center">
					<GoogleLoginButton text={"Sign in with Google"} />
				</div>

				<div className="text-center mt-4">
					<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
						Don't have an account?{" "}
						<span
							onClick={() => navigate("/register")}
							className="font-medium text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA]">
							Register
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
