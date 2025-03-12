import React from "react";
import SkeletonLoader from "../SkeletonLoader";

const FinalVerdict = ({dataReady, verdict}) => (
	<div className="p-6 border-b border-gray-200 dark:border-gray-700">
		{dataReady ? (
			<div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow dark:shadow-gray-900/30">
				<h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
					Final Verdict
				</h3>
				<p className="text-gray-600 dark:text-gray-300">{verdict}</p>
			</div>
		) : (
			<SkeletonLoader type="card" count={1} />
		)}
	</div>
);

export default FinalVerdict;
