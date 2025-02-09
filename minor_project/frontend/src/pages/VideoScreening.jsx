import {useState, useEffect, useRef} from "react";

const VideoScreening = () => {
	const [stream, setStream] = useState(null);
	const videoRef = useRef(null);
	const [subtitle, setSubtitle] = useState(
		"Hello! I'm your AI interviewer today. Are you ready to begin?"
	);

	useEffect(() => {
		const startWebcam = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				setStream(mediaStream);
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}
			} catch (err) {
				console.error("Error accessing webcam:", err);
			}
		};

		startWebcam();

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col space-y-6">
					{/* Webcam Feed Section */}
					<div className="relative aspect-video w-full max-w-4xl mx-auto">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover rounded-lg shadow-lg bg-gray-800"
						/>
					</div>

					{/* Subtitles Section */}
					<div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 transition-all duration-300">
						<div className="flex items-center space-x-3 mb-2">
							<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
							<span className="text-sm text-gray-500">
								AI Interviewer
							</span>
						</div>
						<p className="text-lg text-gray-700 leading-relaxed">
							{subtitle}
						</p>
					</div>

					{/* Controls Section */}
					<div className="flex justify-center space-x-4">
						<button className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300">
							End Interview
						</button>
						<button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-300">
							Toggle Microphone
						</button>
						<button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-300">
							Toggle Camera
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoScreening;
