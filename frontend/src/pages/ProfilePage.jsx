import {useContext} from "react";
import AuthContext from "../context/AuthContext";

const Profile = () => {
	const {isAuthenticated, logout} = useContext(AuthContext);

	return isAuthenticated ? (
		<div>
			<h2>Welcome</h2>
			<button onClick={logout}>Logout</button>
		</div>
	) : (
		<p>Please log in.</p>
	);
};

export default Profile;
