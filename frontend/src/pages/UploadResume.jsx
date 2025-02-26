import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaCloudUploadAlt} from "react-icons/fa";

const UploadResume = ({getQuestions, uploadResume}) => {
	const [file, setFile] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const navigate = useNavigate();

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleChange = (e) => {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async () => {
		if (file) {
			uploadResume(file);
			navigate("/interview/videoscreening");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Column - Upload Section */}
					<div className="flex-1 flex flex-col items-center justify-center">
						<div
							className={`w-full max-w-xl p-8 rounded-xl border-3 border-dashed 
                            ${
								dragActive
									? "border-blue-500 bg-blue-50"
									: "border-gray-300 hover:border-gray-400"
							}
                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md`}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}>
							<div className="flex flex-col items-center space-y-6">
								<FaCloudUploadAlt className="w-20 h-20 text-blue-400 animate-bounce" />
								<p className="text-lg md:text-xl text-center text-gray-600">
									Drag and drop your resume here, or
									<label className="mx-2 text-blue-500 font-medium cursor-pointer hover:text-blue-600 underline">
										browse
										<input
											type="file"
											className="hidden"
											accept=".pdf,.doc"
											onChange={handleChange}
										/>
									</label>
								</p>
								{file && (
									<div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
										Selected file: {file.name}
									</div>
								)}
							</div>
						</div>
						<button
							onClick={handleSubmit}
							className={`mt-6 px-8 py-3 rounded-full text-lg font-medium shadow-lg ${
								file
									? "bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							} transition-all duration-300`}
							disabled={!file}>
							Continue
						</button>
					</div>

					{/* Right Column - Guidelines */}
					<div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
						<h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
							Interview Guidelines
						</h2>
						<ul className="space-y-5 text-gray-600">
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Ensure your resume is in PDF or DOC format
								</span>
							</li>
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Maximum file size: 5MB
								</span>
							</li>
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Include your relevant work experience and
									skills
								</span>
							</li>
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Make sure your contact information is
									up-to-date
								</span>
							</li>
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Highlight achievements and quantifiable
									results
								</span>
							</li>
							<li className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
								<span className="mr-3 text-blue-500 font-bold">
									•
								</span>
								<span className="text-lg">
									Proofread for any spelling or grammatical
									errors
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UploadResume;
