import JobCard from "./JobCard";

const JobList = ({
	interviewTypes,
	selectedJobIndex,
	tryInterview,
	handleSelectJob,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
			{interviewTypes.map((interview, index) => (
				<div
					key={index}
					onClick={() => handleSelectJob(index)}
					className="cursor-pointer transform transition-transform duration-300 hover:scale-102">
					<JobCard
						key={index}
						index={index}
						jobDetails={interview}
						tryInterview={tryInterview}
						isSelected={selectedJobIndex === index}
					/>
				</div>
			))}
		</div>
	);
};

export default JobList;
