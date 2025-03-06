import React, {useContext} from "react";
import {BsPersonCircle} from "react-icons/bs";
import AuthContext from "../context/AuthContext";

const Navbar = ({toggleSidebar, handleNavigation}) => {
	const {isAuthenticated} = useContext(AuthContext);

	return (
		<nav className="bg-gray-800 text-white p-4">
			<div className="flex justify-between items-center">
				<div className="text-2xl font-bold flex items-center">
					<button
						onClick={toggleSidebar}
						aria-label="toggle-sidebar"
						className="bg-transparent border-none text-white cursor-pointer p-2 mr-2">
						☰
					</button>
					InterviewPrep AI
				</div>
				{isAuthenticated ? (
					<button
						onClick={() => handleNavigation("/profile")}
						className="bg-transparent hover:bg-gray-700 rounded-full p-2 transition-colors duration-300"
						aria-label="Open Profile">
						<BsPersonCircle size={24} />
					</button>
				) : (
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-300"
						onClick={() => handleNavigation("/login")}>
						Login
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
