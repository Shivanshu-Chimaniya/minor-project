import React from "react";

const NavigationLinks = ({handleNavigation, activeLink}) => {
	const links = [
		{path: "/selectinterview", label: "Interviews"},
		{path: "/about", label: "About"},
	];

	return (
		<>
			{links.map((link) => (
				<span
					key={link.path}
					href="#"
					onClick={(e) => {
						e.preventDefault();
						handleNavigation(link.path);
					}}
					className={` cursor-pointer
            px-4 py-2 rounded-md font-medium
            transition-colors duration-300
            
            /* Light Mode */
            hover:text-[#2563EB]
            hover:bg-[#E2E8F0]
            ${
				activeLink === link.path
					? "bg-[#E2E8F0] text-[#2563EB]"
					: " text-[#1E293B] "
			}
            
            /* Dark Mode */
            dark:hover:text-[#60A5FA]
            dark:hover:bg-[#1E293B]
            ${
				activeLink === link.path
					? "dark:bg-[#1E293B] dark:text-[#3B82F6]"
					: "dark:text-[#E2E8F0]"
			}
          `}>
					{link.label}
				</span>
			))}
		</>
	);
};

export default NavigationLinks;
