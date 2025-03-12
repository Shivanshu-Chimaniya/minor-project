import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function RefrshHandler({isAuthenticated, loading}) {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (loading) return;
		if (isAuthenticated) {
			if (
				location.pathname === "/login" ||
				location.pathname === "/register"
			) {
				navigate("/", {replace: false});
			}
		} else if (isAuthenticated === false) {
			if (
				location.pathname === "/profile" ||
				location.pathname === "/interview" ||
				location.pathname === "/interview/videoscreening" ||
				location.pathname === "/interview/summary"
			) {
				navigate("/", {replace: false});
			}
		}
	}, [location, navigate, isAuthenticated, loading]);

	return null;
}

export default RefrshHandler;
