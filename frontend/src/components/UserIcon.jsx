import React from "react";

const UserIcon = ({name, profileImage, size = 2, border = true}) => {
	return (
		<>
			{profileImage ? (
				<img
					src={profileImage}
					alt="User Profile"
					className={`"block size-[${size}rem] rounded-full object-cover ${
						border &&
						"border-2 border-neutral-300 dark:border-neutral-600"
					}"`}
				/>
			) : (
				<div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
					<span>{name?.charAt(0) || "U"}</span>
				</div>
			)}
		</>
	);
};

export default UserIcon;
