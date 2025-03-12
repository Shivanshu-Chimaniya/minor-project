import React, {useState, useEffect} from "react";
import {IoSparklesOutline as FaSparkles} from "react-icons/io5";

const AnimatedGlassButton = ({children, onClick, className = ""}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Random animation trigger
	useEffect(() => {
		const randomAnimationInterval = setInterval(() => {
			if (!isHovered) {
				setIsAnimating(true);
				setTimeout(() => setIsAnimating(false), 2000);
			}
		}, Math.random() * 5000 + 7000); // Random interval between 7-12 seconds

		return () => clearInterval(randomAnimationInterval);
	}, [isHovered]);

	return (
		<button
			className={`
        relative overflow-hidden rounded-xl py-4 px-8 font-semibold
        backdrop-blur-md transition-all duration-500
        shadow-lg border flex items-center justify-center gap-3
        
        bg-white/40 dark:bg-slate-800/50
        bg-gradient-to-br from-white/50 to-white/20 dark:from-slate-800/50 dark:to-slate-900/30
        text-gray-800 dark:text-slate-200 
        border-white/30 dark:border-white/20
        
        hover:shadow-sky-300/20 dark:hover:shadow-blue-500/30 
        hover:border-sky-300/50 dark:hover:border-blue-500/40
        
        ${
			isHovered || isAnimating
				? "scale-105 shadow-lg shadow-sky-400/20 dark:shadow-blue-500/30"
				: ""
		}
        ${isAnimating ? "animate-pulse" : ""}
        ${className}
      `}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}>
			{/* Animated gradient border */}
			<span
				className={`
          absolute inset-0 -z-10 rounded-xl opacity-0 blur-md
          bg-gradient-to-r from-blue-500/25 via-sky-400/25 to-blue-400/25 dark:from-blue-500/30 dark:via-blue-400/30 dark:to-sky-400/30
          animate-gradient-x
          ${isHovered || isAnimating ? "opacity-80" : ""}
        `}></span>

			{/* Shimmer effect */}
			<span
				className={`
          absolute inset-0 -z-5 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full
          ${isHovered || isAnimating ? "animate-shimmer" : ""}
        `}></span>

			{/* Icon and text */}
			<FaSparkles
				className={`
          text-lg transition-all duration-500
          text-blue-500 dark:text-blue-400
          ${isHovered || isAnimating ? "animate-pulse" : ""}
        `}
			/>
			<span className="relative z-10">{children || "Get Started"}</span>
		</button>
	);
};

export default AnimatedGlassButton;
