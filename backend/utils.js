module.exports.removeBeforeAndAfter = (str) => {
	// Find the first '{' and the last '}'
	const firstBraceIndex = str.indexOf("{");
	const lastBraceIndex = str.lastIndexOf("}");

	// If both braces exist, slice the string between them
	if (
		firstBraceIndex !== -1 &&
		lastBraceIndex !== -1 &&
		firstBraceIndex < lastBraceIndex
	) {
		return str.slice(firstBraceIndex, lastBraceIndex + 1);
	}

	// If braces are not found or are in the wrong order, return an empty string
	return "";
};
