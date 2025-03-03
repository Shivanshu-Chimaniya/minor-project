import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

const useNavigationBlocker = (isBlocking) => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (isBlocking) {
				event.preventDefault();
				event.returnValue =
					"Are you sure you want to leave? Your progress will be lost.";
			}
		};

		const handleNavigation = (event) => {
			if (
				isBlocking &&
				!window.confirm(
					"Are you sure you want to leave? Your progress will be lost."
				)
			) {
				event.preventDefault();
				navigate(location.pathname, {replace: true}); // Stay on the same page
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("popstate", handleNavigation);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("popstate", handleNavigation);
		};
	}, [isBlocking, navigate, location]);
};

export default useNavigationBlocker;
