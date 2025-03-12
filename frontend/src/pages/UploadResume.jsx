import {useEffect, useState} from "react";
import {FaCloudUploadAlt, FaInfoCircle, FaFilePdf} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useCloudinary} from "../context/CloudinaryProvider";
import {useInterview} from "../context/InterviewContext";
import PdfThumbnailDisplay from "../components/PdfThumbnailDisplay";
import Guidelines from "../components/Guidelines";
import {showToast} from "../utils/toast";

const UploadResume = () => {
	const [file, setFile] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const [selectedResumeId, setSelectedResumeId] = useState(null);
	const [agreedToTerms, setAgreedToTerms] = useState(true);

	const navigate = useNavigate();
	const {uploadToCloudinary} = useCloudinary();
	const {questionsLoaded} = useInterview();

	const {uploadResume, useOldResume, jobDetails} = useInterview();
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	// Get stored resumes from localStorage
	const [resumes] = useState(() => {
		const userInfo = localStorage.getItem("user-info");
		return userInfo ? JSON.parse(userInfo).resumes || [] : [];
	});

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(e.type === "dragenter" || e.type === "dragover");
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setFile(e.dataTransfer.files[0]);
			setSelectedResumeId(null);
		}
	};

	const handleChange = (e) => {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setSelectedResumeId(null);
		}
	};

	useEffect(() => {
		if (!jobDetails.description) {
			setUploadError("Please select a job first");
			navigate("/selectinterview");
		}
	}, [jobDetails, navigate]);

	const handleFileUpload = async () => {
		if (!file && !selectedResumeId) {
			setUploadError(
				"Please select an existing resume or upload a new one"
			);
			return;
		}

		if (!agreedToTerms) {
			setUploadError("Please agree to the guidelines before continuing");
			return;
		}

		if (isUploading) {
			return;
		}
		if (!questionsLoaded()) {
			showToast.warning("waiting on questions");
			return;
		}
		setIsUploading(true);
		setUploadError(null);
		navigate("/interview/videoscreening");
		try {
			if (file) {
				const uploadResult = await uploadToCloudinary(file);
				uploadResume(uploadResult);
			} else if (selectedResumeId) {
				useOldResume(selectedResumeId);
			} else {
				console.error("User didn't upload or choose a resume");
			}
		} catch (error) {
			setUploadError("Failed to process resume. Please try again.");
			console.error("Resume upload error:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const selectExistingResume = (resumeId) => {
		setSelectedResumeId(resumeId);
		setFile(null);
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
			{/* Top section with job details */}
			<div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/20 px-6 py-5 mb-6 transition-colors duration-200">
				<div className="max-w-6xl mx-auto">
					{jobDetails.description ? (
						<div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded transition-colors duration-200">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
										<span className="font-medium text-gray-800 dark:text-gray-100">
											Title:
										</span>{" "}
										{jobDetails.title ||
											"Software Developer"}
									</p>
									<p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
										<span className="font-medium text-gray-800 dark:text-gray-100">
											Level:
										</span>{" "}
										{jobDetails.level}
									</p>
								</div>
								<div>
									<p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
										<span className="font-medium text-gray-800 dark:text-gray-100">
											Description:
										</span>{" "}
										{jobDetails.description}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded transition-colors duration-200">
							<p className="text-yellow-700 dark:text-yellow-300 mb-3 transition-colors duration-200">
								Please select a job position first.
							</p>
							<button
								onClick={() => navigate("/selectinterview")}
								className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white rounded-md transition-colors duration-200 shadow-sm hover:shadow">
								Select Position
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Bottom section with two columns */}
			<div className="max-w-6xl mx-auto px-6 pb-10">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
					{/* Left column: Resume upload and selection */}
					<div className="md:col-span-5">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-700/10 transition-colors duration-200">
							<h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
								Upload or Select Resume
							</h2>

							{/* Upload area */}
							<div
								className={`p-6 rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out mb-5 
                                ${
									dragActive
										? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
										: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
								}`}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}>
								<div className="flex flex-col items-center space-y-4">
									<FaCloudUploadAlt className="w-14 h-14 text-blue-400 dark:text-blue-300" />
									<p className="text-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
										Drag and drop your resume here, or
										<label className="mx-1 text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 underline">
											browse
											<input
												type="file"
												className="hidden"
												accept=".pdf,.doc,.docx"
												onChange={handleChange}
											/>
										</label>
									</p>
									{file && (
										<div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-200">
											{file.name}
										</div>
									)}
								</div>
							</div>

							{/* Previous resumes */}
							{resumes && resumes.length > 0 && (
								<div className="mt-6">
									<h3 className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-200">
										Use previously uploaded resumes
									</h3>
									<div className="flex flex-col space-y-3 mt-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
										{resumes.map((resume, index) => (
											<PdfThumbnailDisplay
												selectedResumeId={
													selectedResumeId
												}
												selectExistingResume={
													selectExistingResume
												}
												key={index}
												resume={resume}
											/>
										))}
									</div>
								</div>
							)}

							{/* Error message */}
							{uploadError && (
								<div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded transition-colors duration-200">
									{uploadError}
								</div>
							)}
						</div>
					</div>

					{/* Right column: Guidelines */}
					<Guidelines
						agreedToTerms={agreedToTerms}
						setAgreedToTerms={setAgreedToTerms}
					/>
				</div>

				{/* Continue button */}
				<div className="max-w-6xl mx-auto flex justify-center mt-8">
					<button
						onClick={handleFileUpload}
						className={`px-8 py-3 rounded-full text-base font-medium shadow-md transition-all duration-200 ${
							(file || selectedResumeId) &&
							agreedToTerms &&
							!isUploading
								? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-blue-500/20 dark:shadow-blue-500/10"
								: "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
						}`}
						disabled={
							isUploading ||
							(!file && !selectedResumeId) ||
							!agreedToTerms ||
							!jobDetails.description
						}>
						{isUploading ? (
							<span className="flex items-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Processing...
							</span>
						) : (
							"Continue to Interview"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UploadResume;
