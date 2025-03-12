import {Outlet} from "react-router-dom";
import {useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import MobileMenu from "../components/MobileMenu";
import Footer from "../components/Footer";

const Layout = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const {isAuthenticated, logout, user} = useContext(AuthContext);

	// Initialize dark mode based on user preference

	// Toggle dark mode

	const handleNavigation = (path) => {
		navigate(path);
		setIsMobileMenuOpen(false);
	};

	const handleLogout = () => {
		navigate("/");
		logout();
		setIsMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
			<Navbar
				handleNavigation={handleNavigation}
				handleLogout={handleLogout}
				isAuthenticated={isAuthenticated}
				user={user}
				toggleMobileMenu={toggleMobileMenu}
			/>

			{/* Mobile Menu */}
			<MobileMenu
				isOpen={isMobileMenuOpen}
				handleNavigation={handleNavigation}
				isAuthenticated={isAuthenticated}
			/>

			<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex-grow ">
				<Outlet />
			</div>

			<Footer />
		</div>
	);
};

export default Layout;
