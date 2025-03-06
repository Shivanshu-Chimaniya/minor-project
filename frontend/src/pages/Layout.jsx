import {Outlet} from "react-router-dom";
import {useState, useEffect, useRef, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const sidebarRef = useRef(null);
	const {isAuthenticated, logout} = useContext(AuthContext);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target) &&
				!event.target.closest('button[aria-label="toggle-sidebar"]')
			) {
				setIsSidebarOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleNavigation = (path) => {
		navigate(path);
		setIsSidebarOpen(false);
	};

	const handleLogout = () => {
		navigate("/");
		setIsSidebarOpen(false);
		logout();
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar
				toggleSidebar={toggleSidebar}
				handleNavigation={handleNavigation}
			/>

			{/* Sidebar */}
			{isSidebarOpen && (
				<div
					ref={sidebarRef}
					className="fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 text-white z-50">
					<button
						onClick={toggleSidebar}
						className="bg-transparent border-none text-white cursor-pointer mb-4">
						✕ Close
					</button>
					<ul className="list-none">
						<li
							className="py-2 cursor-pointer"
							onClick={() => handleNavigation("/")}>
							Home
						</li>
						<li
							className="py-2 cursor-pointer"
							onClick={() => handleNavigation("/interviews")}>
							Interviews
						</li>
						<li
							className="py-2 cursor-pointer"
							onClick={() => handleNavigation("/upload-resume")}>
							Upload Resume
						</li>
						<li
							className="py-2 cursor-pointer"
							onClick={() => handleNavigation("/about")}>
							About
						</li>
						{isAuthenticated ? (
							<>
								<li
									className="py-2 cursor-pointer"
									onClick={() => handleLogout()}>
									Logout
								</li>
							</>
						) : (
							<>
								<li
									className="py-2 cursor-pointer"
									onClick={() => handleNavigation("/login")}>
									Login
								</li>
								<li
									className="py-2 cursor-pointer"
									onClick={() =>
										handleNavigation("/register")
									}>
									Register
								</li>
							</>
						)}
					</ul>
				</div>
			)}

			{/* Main content */}
			<main className="flex-grow">
				<Outlet />
			</main>

			<footer className="bg-gray-800 text-white p-4 text-center">
				<p>© 2024 InterviewPrep AI. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default Layout;
