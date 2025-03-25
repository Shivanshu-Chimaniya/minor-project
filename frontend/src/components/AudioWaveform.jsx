import React, {useState, useEffect} from "react";

const AudioWaveform = ({isActive = true}) => {
	const [bars, setBars] = useState([0.3, 0.5, 0.7, 0.5, 0.3]);

	// Animate the bars when active
	useEffect(() => {
		if (!isActive) return;

		const interval = setInterval(() => {
			setBars(bars.map(() => Math.random() * 0.7 + 0.3));
		}, 150);

		return () => clearInterval(interval);
	}, [isActive, bars]);

	return (
		<div className="flex items-center justify-center h-8 w-16 gap-1 p-1 rounded-md bg-transparent">
			{bars.map((height, index) => (
				<div
					key={index}
					className="w-1 rounded-full bg-blue-500 dark:bg-blue-400 transition-all duration-150"
					style={{height: `${height * 100}%`}}
				/>
			))}
		</div>
	);
};

export default AudioWaveform;
