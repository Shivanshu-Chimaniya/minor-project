import {useContext, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import MobileMenu from "../components/MobileMenu";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

const Layout = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const {isAuthenticated, logout} = useContext(AuthContext);

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
