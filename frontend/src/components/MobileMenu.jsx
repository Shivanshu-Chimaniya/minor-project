import React from "react";

const MobileMenu = ({ isOpen, handleNavigation, isAuthenticated }) => {
	return (
		<div
			className={`${
				isOpen ? "block" : "hidden"
			} md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md`}
		>
			<div className="px-2 pt-2 pb-3 space-y-1">
				<MobileMenuItem
					label="Home"
					path="/"
					handleNavigation={handleNavigation}
				/>
				<MobileMenuItem
					label="Pricing"
					path="/pricing"
					handleNavigation={handleNavigation}
				/>
				<MobileMenuItem
					label="About"
					path="/about"
					handleNavigation={handleNavigation}
				/>
				{!isAuthenticated && (
					<>
						<MobileMenuItem
							label="Login"
							path="/login"
							handleNavigation={handleNavigation}
						/>
						<MobileMenuItem
							label="Register"
							path="/register"
							handleNavigation={handleNavigation}
							isHighlighted
						/>
					</>
				)}
			</div>
		</div>
	);
};

const MobileMenuItem = ({ label, path, handleNavigation, isHighlighted }) => {
	const baseClass = "block px-3 py-2 rounded-md text-base font-medium";
	const regularClass = "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";
	const highlightedClass = "text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700";

	return (
		<a
			href="#"
			onClick={(e) => {
				e.preventDefault();
				handleNavigation(path);
			}}
			className={`${baseClass} ${isHighlighted ? highlightedClass : regularClass}`}
		>
			{label}
		</a>
	);
};

export default MobileMenu;
