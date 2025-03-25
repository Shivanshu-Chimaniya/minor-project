// src/components/interview/ProgressIndicator.jsx
import React from "react";

const ProgressIndicator = ({ questionNumber, totalQuestions, progressPercentage }) => {
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span>
          Question {questionNumber} of {totalQuestions || "?"}
        </span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
