import React from "react";

const Badge = ({text = "Coming Soon", className = ""}) => {
	return (
		<div
			className={`absolute select-none top-0 right-0 z-10 ${className}`}
			style={{
				transform: "rotate(12deg) translate(10%, -30%)",
			}}>
			<div
				className="
          px-2 py-1 
          text-xs font-bold 
          rounded-md 
          flex items-center justify-center
          bg-blue-600 dark:bg-blue-400/40 dark:backdrop-blur-2xl
          text-white dark:text-slate-200
          border border-sky-400 dark:border-slate-800 
          shadow-md
          min-w-[70px] max-w-[120px]
          truncate
        "
				style={{
					lineHeight: 1,
				}}>
				{text}
			</div>
		</div>
	);
};

export default Badge;
