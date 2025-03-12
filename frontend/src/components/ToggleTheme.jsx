import {useTheme} from "../hooks/useTheme";
// import {Sun, Moon} from "lucide-react";
import {FaRegMoon as Moon} from "react-icons/fa";
import {FaRegSun as Sun} from "react-icons/fa";

export default function ThemeToggle() {
	const {theme, toggleTheme} = useTheme();

	return (
		<button
			onClick={toggleTheme}
			aria-label={`Switch to ${
				theme === "light" ? "dark" : "light"
			} mode`}
			className="p-2 rounded-lg transition-all duration-300 
        hover:bg-[#E2E8F0] hover:text-[#2563EB]
        dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]
        text-[#1E293B] dark:text-[#E2E8F0]
        focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA]">
			{theme === "light" ? (
				<Moon size={20} className="text-current" />
			) : (
				<Sun size={20} className="text-current" />
			)}
		</button>
	);
}
