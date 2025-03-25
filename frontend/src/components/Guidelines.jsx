import React from "react";

const Guidelines = ({agreedToTerms, setAgreedToTerms}) => {
	return (
		<div className="md:col-span-7">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700/10 border border-blue-100 dark:border-blue-800/50 transition-colors duration-200">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center transition-colors duration-200">
					Get Ready For Your Interview!
				</h2>

				<div className="space-y-5 text-base">
					<p className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200">
						Quick heads-up before we begin:
					</p>

					<ol className="space-y-2 pl-2">
						<li className="flex items-start p-2 bg-blue-50/70 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Go fullscreen for better experience.
							</span>
						</li>
						<li className="flex items-start p-2 bg-blue-50/70 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Interview starts right after you click continue!
							</span>
						</li>

						<li className="flex items-start p-2 bg-blue-50/60 dark:bg-blue-900/25 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Listen carefully and answer with your voice
							</span>
						</li>

						<li className="flex items-start p-2 bg-blue-50/70 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Speak clearly and slowly for better results
							</span>
						</li>

						<li className="flex items-start p-2 bg-blue-50/60 dark:bg-blue-900/25 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Any key press will submit your answer
							</span>
						</li>

						<li className="relative flex items-start p-2 bg-blue-50/60 dark:bg-blue-900/25 rounded-lg border-l-4 border-blue-300 dark:border-blue-700 hover:shadow-sm dark:hover:shadow-blue-700/10 transition-all duration-200">
							<span
								className="absolute -top-2 -right-3 bg-yellow-400 text-xs font-bold text-gray-800 px-2 py-1 rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm -rotate-5"
								title="Experimental feature">
								Exp.
							</span>
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								First minute of video will be recorded for
								behavioral analysis
							</span>
						</li>
					</ol>

					<div className="mt-8 pt-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="h-5 w-5 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
								checked={agreedToTerms}
								onChange={() =>
									setAgreedToTerms(!agreedToTerms)
								}
							/>
							<span className="ml-3 text-base text-gray-800 dark:text-gray-200 font-medium flex items-center transition-colors duration-200">
								Ready to start?
							</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Guidelines;
