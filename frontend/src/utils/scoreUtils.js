// export const getScoreColor = (score) => {
// 	if (score >= 7 || score >= 70) return "text-green-600";
// 	if (score >= 5 || score >= 50) return "text-yellow-600";
// 	return "text-red-600";
// };

// export const formatScore = (score) => {
// 	return `${score} / 10`;
// };

export const getScoreColor = (score, isDarkMode = false) => {
	if (score >= 90) {
		return isDarkMode ? "text-green-400" : "text-green-600";
	} else if (score >= 80) {
		return isDarkMode ? "text-green-400" : "text-green-500";
	} else if (score >= 70) {
		return isDarkMode ? "text-blue-400" : "text-blue-500";
	} else if (score >= 60) {
		return isDarkMode ? "text-yellow-300" : "text-yellow-500";
	} else if (score >= 50) {
		return isDarkMode ? "text-orange-300" : "text-orange-500";
	} else {
		return isDarkMode ? "text-red-400" : "text-red-500";
	}
};

export const formatScore = (score) => {
	return score.toFixed(1);
};
