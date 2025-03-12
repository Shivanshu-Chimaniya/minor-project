import React from "react";
import {getScoreColor, formatScore} from "../utils/scoreUtils";

const ScoreCard = ({title, score, isLoading}) => (
	<div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow dark:shadow-gray-900/30">
		<span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
			{title}
		</span>
		{isLoading ? (
			<div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16 mt-1"></div>
		) : (
			<div className={`text-4xl font-bold ${getScoreColor(score, true)}`}>
				{formatScore(score)}
			</div>
		)}
	</div>
);

export default ScoreCard;
