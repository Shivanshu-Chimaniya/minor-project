import React, {useState} from "react";
import ThemeToggle from "./ToggleTheme";
import Logo from "./Logo";
import NavigationLinks from "./NavigationLinks";
import UserProfile from "./UserProfile";

const Navbar = ({
	handleNavigation,
	handleLogout,
	isAuthenticated,
	user,
	toggleMobileMenu,
}) => {
	return (
		<nav className="sticky w-full top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
			<div className="container mx-auto px-4 py-3">
				<div className="flex justify-between items-center">
					{/* Logo/Brand */}
					<Logo handleNavigation={handleNavigation} />

					{/* Right side - Navigation, Theme Toggle, User Profile */}
					<div className="flex items-center space-x-6">
						{/* Navigation Links - Hidden on mobile */}
						<div className="hidden md:flex items-center space-x-6">
							<NavigationLinks
								handleNavigation={handleNavigation}
								// activeLink="/"
							/>
						</div>

						{/* Theme Toggle */}
						<ThemeToggle />

						{/* User Profile or Login/Register */}
						<UserProfile
							isAuthenticated={isAuthenticated}
							user={user}
							handleNavigation={handleNavigation}
							handleLogout={handleLogout}
						/>

						{/* Mobile Menu Button */}
						<div className="md:hidden">
							<button
								className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
								onClick={toggleMobileMenu}
								aria-label="Toggle mobile menu">
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
