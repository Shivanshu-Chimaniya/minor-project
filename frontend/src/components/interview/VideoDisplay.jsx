// src/components/interview/VideoDisplay.jsx
import React, {useRef, useEffect} from "react";

const VideoDisplay = ({stream, isRecording}) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div className="relative aspect-video w-full lg:w-2/3 h-full">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className="w-full h-full object-cover rounded-xl shadow-lg bg-gray-800 dark:bg-gray-800"
			/>
			{/* Recording indicator */}
			<div className="absolute top-3 left-3 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-2 py-0.5">
				<div
					className={`w-2 h-2 rounded-full ${
						isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
					}`}></div>
				<span className="text-white text-xs font-medium">
					{isRecording ? "Recording" : "Ready"}
				</span>
			</div>
		</div>
	);
};

export default VideoDisplay;
