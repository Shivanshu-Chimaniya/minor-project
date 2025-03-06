import {useContext} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import AuthContext, {useAuth} from "../context/AuthContext";

const ProtectedRoute = () => {
	const {loading, isAuthenticated} = useAuth();
	const location = useLocation();

	if (loading) return <p>Loading...</p>;

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{from: location}} replace />
	);
};

export default ProtectedRoute;
