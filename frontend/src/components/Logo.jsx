import React from "react";

const Logo = ({handleNavigation}) => {
	return (
		<a
			href="/"
			onClick={(e) => {
				e.preventDefault();
				handleNavigation("/");
			}}
			className="font-sans font-bold text-2xl tracking-tight flex items-center gap-2 transition-colors duration-200 hover:opacity-90 -rotate-">
			<span className="relative">
				<span className=" dark:text-[#E2E8F0] bg-gradient-to-r from-[#2563EB] to-[#38BDF8] dark:from-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent">
					Elara
				</span>
				<span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#2563EB] to-[#38BDF8] dark:from-[#3B82F6] dark:to-[#60A5FA] rounded-full opacity-70"></span>
			</span>
		</a>
	);
};

export default Logo;
