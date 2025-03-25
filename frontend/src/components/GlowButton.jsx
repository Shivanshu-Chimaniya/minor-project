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
       
        hover:shadow-orange-300/40 dark:hover:shadow-pink-300/50
        hover:border-orange-300/60 dark:hover:border-pink-300/60
       
        ${
			isHovered || isAnimating
				? "scale-105 shadow-lg shadow-orange-400/40 dark:shadow-pink-300/50"
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
          bg-gradient-to-r from-rose-500/40 via-orange-400/40 to-rose-400/40 dark:from-purple-300/50 dark:via-pink-200/50 dark:to-purple-200/50
          animate-gradient-x
          ${isHovered || isAnimating ? "opacity-90" : ""}
        `}></span>
			{/* Shimmer effect */}
			<span
				className={`
          absolute inset-0 -z-5 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full
          ${isHovered || isAnimating ? "animate-shimmer" : ""}
        `}></span>
			{/* Icon and text */}
			<FaSparkles
				className={`
          text-lg transition-all duration-500
          text-rose-500 dark:text-pink-300
          ${isHovered || isAnimating ? "animate-pulse" : ""}
        `}
			/>
			<span className="relative z-10">{children || "Get Started"}</span>
		</button>
	);
};

export default AnimatedGlassButton;
