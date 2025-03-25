import React, {useState, useRef, useEffect, useContext} from "react";
import UserIcon from "./UserIcon";
import AuthContext from "../context/AuthContext";

const UserProfile = ({handleNavigation, handleLogout}) => {
	const {isAuthenticated, user} = useContext(AuthContext);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	if (isAuthenticated) {
		return (
			<div className="relative" ref={menuRef}>
				<button
					className="flex items-center focus:outline-none"
					onClick={toggleMenu}>
					<UserIcon
						name={user?.name || null}
						profileImage={user?.profileImage || null}
					/>
					<svg
						className="w-4 h-4 ml-1 text-gray-600 dark:text-gray-300"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>

				{/* Profile Dropdown */}
				<div
					className={`${
						isMenuOpen ? "block" : "hidden"
					} absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700`}>
					<ProfileMenuItem
						label="Your Profile"
						path="/profile"
						handleNavigation={handleNavigation}
						setIsMenuOpen={setIsMenuOpen}
					/>
					{/* <ProfileMenuItem
						label="Interviews"
						path="/interviews"
						handleNavigation={handleNavigation}
						setIsMenuOpen={setIsMenuOpen}
					/>
					<ProfileMenuItem
						label="Upload Resume"
						path="/upload-resume"
						handleNavigation={handleNavigation}
						setIsMenuOpen={setIsMenuOpen}
					/> */}
					<span
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handleLogout();
						}}
						className="block cursor-pointer px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
						Logout
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="hidden md:flex items-center space-x-2">
			<button
				onClick={() => handleNavigation("/login")}
				className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
				Login
			</button>
			<button
				onClick={() => handleNavigation("/register")}
				className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
				Register
			</button>
		</div>
	);
};

const ProfileMenuItem = ({label, path, handleNavigation, setIsMenuOpen}) => {
	return (
		<span
			href="#"
			onClick={(e) => {
				handleNavigation(path);
				setIsMenuOpen(false);
			}}
			className="block cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
			{label}
		</span>
	);
};

export default UserProfile;
