import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext"; // Assuming you have an AuthContext

const JwtVerifier = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const {verifyToken} = useAuth(); // Function from backend context

	useEffect(() => {
		const verifyJwtFromUrl = async () => {
			try {
				setIsLoading(true);

				const queryParams = new URLSearchParams(location.search);
				const token = queryParams.get("token");

				if (!token) {
					throw new Error("No token found in URL");
				}

				const isValid = await verifyToken(token);
				console.log(isValid);
				navigate("/", {replace: true});
				console.log("Navigate me According to above result");
			} catch (err) {
				setError(err.message);
				navigate("/login", {replace: true});
			} finally {
				setIsLoading(false);
			}
		};

		verifyJwtFromUrl();
	}, [location, navigate, verifyToken]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="mb-4">Verifying your credentials...</div>
					<div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center text-red-500">
					Authentication failed. Redirecting to login...
				</div>
			</div>
		);
	}

	return null;
};

export default JwtVerifier;
