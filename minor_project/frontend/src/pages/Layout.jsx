import {Outlet} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const sidebarRef = useRef(null);

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

	return (
		<div className="min-h-screen flex flex-col">
			<nav className="bg-gray-800 text-white p-4">
				<div className="flex justify-between items-center">
					{/* Logo */}
					<div className="text-2xl font-bold">
						<button
							onClick={toggleSidebar}
							aria-label="toggle-sidebar"
							className="bg-transparent border-none text-white cursor-pointer p-2">
							☰
						</button>
						InterviewPrep AI
					</div>

					{/* Menu Button */}

					{/* Action Button */}
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-300"
						onClick={() => handleNavigation("/interviews")}>
						Get Started
					</button>
				</div>
			</nav>

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
