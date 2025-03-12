import React, {useState, useEffect} from "react";
import {IoIosEye as Eye, IoIosEyeOff as EyeOff} from "react-icons/io";
import {IoAlertCircleOutline as AlertCircle} from "react-icons/io5";
import {LuLoader as Loader} from "react-icons/lu";
import {MdOutlineCheckCircle as CheckCircle} from "react-icons/md";
import {IoCheckmarkCircle, IoCloseCircle} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const SignupPage = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [redirectTimer, setRedirectTimer] = useState(null);
	const [countdown, setCountdown] = useState(3);

	const {register} = useAuth();
	const navigate = useNavigate();

	// Password strength indicators
	const [passwordStrength, setPasswordStrength] = useState({
		score: 0,
		hasLowerCase: false,
		hasUpperCase: false,
		hasNumber: false,
		hasSpecialChar: false,
		isLongEnough: false,
	});

	useEffect(() => {
		console.log(success, countdown);
		if (success) {
			const timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						navigate("/");
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			setRedirectTimer(timer);
			return () => clearInterval(timer);
		}
	}, [success, navigate]);

	const cancelRedirect = () => {
		if (redirectTimer) {
			clearInterval(redirectTimer);
			setRedirectTimer(null);
		}
	};

	const validatePassword = (password) => {
		const strength = {
			score: 0,
			hasLowerCase: /[a-z]/.test(password),
			hasUpperCase: /[A-Z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecialChar: /[^A-Za-z0-9]/.test(password),
			isLongEnough: password.length >= 8,
		};

		// Calculate score based on criteria met
		if (strength.hasLowerCase) strength.score += 1;
		if (strength.hasUpperCase) strength.score += 1;
		if (strength.hasNumber) strength.score += 1;
		if (strength.hasSpecialChar) strength.score += 1;
		if (strength.isLongEnough) strength.score += 1;

		setPasswordStrength(strength);
	};

	const handleChange = (e) => {
		const {name, value} = e.target;

		setFormData((prev) => ({...prev, [name]: value}));

		// Validate password strength on change
		if (name === "password") {
			validatePassword(value);
		}

		// Clear specific error when field is being edited
		if (errors[name]) {
			setErrors((prev) => ({...prev, [name]: null}));
		}
	};

	const validate = () => {
		const newErrors = {};

		// Name validation
		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		} else if (formData.fullName.trim().length < 3) {
			newErrors.fullName = "Name must be at least 3 characters";
		}

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email address is invalid";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (passwordStrength.score < 3) {
			newErrors.password = "Password is too weak";
		}

		// Confirm password
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) return;

		setLoading(true);

		try {
			let res = await register(formData);

			if (!res.success) {
				throw new Error(res.message);
			}

			setSuccess(true);

			// Reset form after successful submission
			setFormData({
				fullName: "",
				email: "",
				password: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.error("Registration error:", error);
			setErrors({submit: "Registration failed. Please try again."});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-center py-6 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
			<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white dark:bg-gray-800 py-6 px-4 shadow sm:rounded-lg sm:px-8">
					<div className="text-center mb-4">
						<h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#E2E8F0]">
							Welcome!
						</h1>
						<p className="mt-1 text-[#64748B] dark:text-[#94A3B8] text-sm">
							create account
						</p>
					</div>
					{success ? (
						<div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 mb-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-green-800 dark:text-green-300">
										Registration successful!
									</h3>
									<div className="mt-2 text-sm text-green-700 dark:text-green-400">
										<p>
											Your account has been created.
											Redirecting in {countdown}{" "}
											seconds...
										</p>
									</div>
									<div className="mt-4 flex space-x-3">
										<button
											type="button"
											className="rounded-md bg-green-50 dark:bg-green-800/50 px-3 py-1.5 text-sm font-medium text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800"
											onClick={() => {
												cancelRedirect();
												navigate("/");
											}}>
											Home
										</button>
										<button
											type="button"
											className="rounded-md bg-blue-50 dark:bg-blue-800/50 px-3 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
											onClick={() => {
												cancelRedirect();
												navigate("/profile");
											}}>
											Profile
										</button>
									</div>
								</div>
							</div>
						</div>
					) : (
						<form className="space-y-4" onSubmit={handleSubmit}>
							{errors.submit && (
								<div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3">
									<div className="flex">
										<div className="flex-shrink-0">
											<AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-red-800 dark:text-red-300">
												{errors.submit}
											</h3>
										</div>
									</div>
								</div>
							)}

							<div>
								<label
									htmlFor="fullName"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Full Name
								</label>
								<div className="mt-1 relative">
									<input
										id="fullName"
										name="fullName"
										type="text"
										autoComplete="name"
										value={formData.fullName}
										onChange={handleChange}
										className={`appearance-none block w-full px-3 py-2 border ${
											errors.fullName
												? "border-red-300 dark:border-red-600"
												: "border-gray-300 dark:border-gray-600"
										} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm`}
									/>
									{errors.fullName && (
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<AlertCircle className="h-5 w-5 text-red-500" />
										</div>
									)}
								</div>
								{errors.fullName && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">
										{errors.fullName}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Email address
								</label>
								<div className="mt-1 relative">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										value={formData.email}
										onChange={handleChange}
										className={`appearance-none block w-full px-3 py-2 border ${
											errors.email
												? "border-red-300 dark:border-red-600"
												: "border-gray-300 dark:border-gray-600"
										} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm`}
									/>
									{errors.email && (
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<AlertCircle className="h-5 w-5 text-red-500" />
										</div>
									)}
								</div>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">
										{errors.email}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Password
								</label>
								<div className="mt-1 relative">
									<input
										id="password"
										name="password"
										type={
											showPassword ? "text" : "password"
										}
										autoComplete="new-password"
										value={formData.password}
										onChange={handleChange}
										className={`appearance-none block w-full px-3 py-2 border ${
											errors.password
												? "border-red-300 dark:border-red-600"
												: "border-gray-300 dark:border-gray-600"
										} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm`}
									/>
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
										<button
											type="button"
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none">
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								{/* Enhanced Password Feedback */}
								{formData.password && (
									<div className="mt-2">
										<div className="flex gap-1 mb-2">
											{[1, 2, 3, 4, 5].map((index) => (
												<div
													key={index}
													className={`h-1 w-full rounded-full ${
														passwordStrength.score >=
														index
															? passwordStrength.score >=
															  4
																? "bg-green-500 dark:bg-green-400"
																: passwordStrength.score >=
																  3
																? "bg-blue-500 dark:bg-blue-400"
																: passwordStrength.score >=
																  2
																? "bg-yellow-500 dark:bg-yellow-400"
																: "bg-red-500 dark:bg-red-400"
															: "bg-gray-200 dark:bg-gray-700"
													}`}
												/>
											))}
										</div>

										<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
											<div className="flex items-center gap-1">
												{passwordStrength.isLongEnough ? (
													<IoCheckmarkCircle className="text-green-500 dark:text-green-400" />
												) : (
													<IoCloseCircle className="text-gray-400 dark:text-gray-500" />
												)}
												<span
													className={
														passwordStrength.isLongEnough
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}>
													8+ characters
												</span>
											</div>

											<div className="flex items-center gap-1">
												{passwordStrength.hasLowerCase ? (
													<IoCheckmarkCircle className="text-green-500 dark:text-green-400" />
												) : (
													<IoCloseCircle className="text-gray-400 dark:text-gray-500" />
												)}
												<span
													className={
														passwordStrength.hasLowerCase
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}>
													Lowercase (a-z)
												</span>
											</div>

											<div className="flex items-center gap-1">
												{passwordStrength.hasUpperCase ? (
													<IoCheckmarkCircle className="text-green-500 dark:text-green-400" />
												) : (
													<IoCloseCircle className="text-gray-400 dark:text-gray-500" />
												)}
												<span
													className={
														passwordStrength.hasUpperCase
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}>
													Uppercase (A-Z)
												</span>
											</div>

											<div className="flex items-center gap-1">
												{passwordStrength.hasNumber ? (
													<IoCheckmarkCircle className="text-green-500 dark:text-green-400" />
												) : (
													<IoCloseCircle className="text-gray-400 dark:text-gray-500" />
												)}
												<span
													className={
														passwordStrength.hasNumber
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}>
													Number (0-9)
												</span>
											</div>

											<div className="flex items-center gap-1 col-span-2">
												{passwordStrength.hasSpecialChar ? (
													<IoCheckmarkCircle className="text-green-500 dark:text-green-400" />
												) : (
													<IoCloseCircle className="text-gray-400 dark:text-gray-500" />
												)}
												<span
													className={
														passwordStrength.hasSpecialChar
															? "text-green-600 dark:text-green-400"
															: "text-gray-500 dark:text-gray-400"
													}>
													Special character (!@#$%^&*)
												</span>
											</div>
										</div>
									</div>
								)}

								{errors.password && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">
										{errors.password}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Confirm Password
								</label>
								<div className="mt-1 relative">
									<input
										id="confirmPassword"
										name="confirmPassword"
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										autoComplete="new-password"
										value={formData.confirmPassword}
										onChange={handleChange}
										className={`appearance-none block w-full px-3 py-2 border ${
											errors.confirmPassword
												? "border-red-300 dark:border-red-600"
												: "border-gray-300 dark:border-gray-600"
										} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm`}
									/>
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(
													!showConfirmPassword
												)
											}
											className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none">
											{showConfirmPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-600 dark:text-red-400">
										{errors.confirmPassword}
									</p>
								)}
							</div>
							<div className="w-full flex align-middle justify-center">
								<button
									type="submit"
									disabled={loading}
									className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                  text-white bg-blue-600 hover:bg-blue-700 
                  dark:bg-blue-500 dark:hover:bg-blue-600 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                  disabled:opacity-50 dark:focus:ring-offset-gray-800 transition-colors">
									{loading ? (
										<>
											<Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
											Creating Account...
										</>
									) : (
										"Sign up"
									)}
								</button>
							</div>
						</form>
					)}
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
						<GoogleLoginButton text={"Sign up with Google"} />
					</div>

					<div className="text-center mt-4">
						<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
							Already have an account?{" "}
							<span
								onClick={() => navigate("/login")}
								className="font-medium text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#60A5FA]">
								Login
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
