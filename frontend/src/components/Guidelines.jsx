import React, {useState} from "react";
import {
	FaInfoCircle,
	FaRocket,
	FaMicrophone,
	FaKeyboard,
	FaVolumeUp,
} from "react-icons/fa";
import {BsFillLightningFill} from "react-icons/bs";
import {MdOutlineWavingHand} from "react-icons/md";

const Guidelines = ({agreedToTerms, setAgreedToTerms}) => {
	return (
		<div className="md:col-span-7">
			<div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/30 p-6 rounded-lg shadow-md dark:shadow-gray-700/10 border border-blue-100 dark:border-blue-800/50 transition-colors duration-200">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center transition-colors duration-200">
					<BsFillLightningFill className="mr-3 text-yellow-500 dark:text-yellow-400" />
					Get Ready For Your Interview!
				</h2>

				<div className="space-y-5 text-base">
					<p className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200">
						Quick heads-up before we begin:
					</p>

					<ol className="space-y-4 pl-2">
						<li className="flex items-start p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-400 dark:border-pink-500 hover:shadow-sm dark:hover:shadow-pink-500/10 transition-all duration-200">
							<FaRocket className="mr-3 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-1 text-lg" />
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Interview starts right after you click continue!
							</span>
						</li>

						<li className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400 dark:border-green-500 hover:shadow-sm dark:hover:shadow-green-500/10 transition-all duration-200">
							<FaMicrophone className="mr-3 text-green-500 dark:text-green-400 flex-shrink-0 mt-1 text-lg" />
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Listen carefully and answer with your voice
							</span>
						</li>

						<li className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400 dark:border-purple-500 hover:shadow-sm dark:hover:shadow-purple-500/10 transition-all duration-200">
							<FaVolumeUp className="mr-3 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-1 text-lg" />
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Speak clearly and slowly for better results
							</span>
						</li>

						<li className="flex items-start p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400 dark:border-orange-500 hover:shadow-sm dark:hover:shadow-orange-500/10 transition-all duration-200">
							<FaKeyboard className="mr-3 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-1 text-lg" />
							<span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
								Any key press will submit your answer
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
								<MdOutlineWavingHand className="mr-2 text-yellow-500 dark:text-yellow-400 text-lg" />
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
