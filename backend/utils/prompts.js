const makeQuestionPrompt = ({level, jobDescription}) =>
	`Generate 3 to 5 unique and structured verbal interview questions for a ${level} role based on the following job description:
Job Description: ${jobDescription}
Requirements:
The questions should align with the ${level} role, adjusting complexity accordingly:
Junior: Focus on fundamental coding concepts, basic problem-solving, and core data structures & algorithms.
Mid-Level: Include in-depth problem-solving, real-world coding scenarios, and optimization techniques.
Senior: Emphasize advanced system design, scalability, architecture, and best coding practices.
Ensure each question is unique and not repeated across multiple requests. Avoid common, overused interview questions.
Phrase each question differently in every response while maintaining clarity.
Keep each question short enough to be answered in under 1 minute.
Focus primarily on coding topics that can be explained verbally, covering:
Problem-solving & Algorithms
Data Structures
System Design (if applicable)
Coding Best Practices
Real-world Application Scenarios
Introduce variation in question structure, such as:
Scenario-based questions
"What if..." questions
Comparative questions
Code analysis or debugging questions
Edge-case considerations
Trade-off discussions

All questions must be written using only words and punctuation. Do not use special characters or symbols.
Output Format (Array):
[
"Unique Question 1",
"Unique Question 2",
"Unique Question 3",
"Unique Question 4",
"Unique Question 5"
]`;

const makeResumePrompt = ({jobDescription, resumeText}) =>
	`You are an AI hiring assistant. Evaluate a candidate's resume against a job description and return a structured JSON response with precise scoring, clear strengths, and areas for improvement.
Scoring Criteria (Total: 10.0 points)
Skills Match (2.0 pts): Do the listed skills align with the job requirements?
Experience Relevance (2.0 pts): Does the candidate's experience match the role's expectations?
Education & Certifications (1.0 pt): Does the candidate meet the required qualifications?
Structure & Readability (1.0 pt): Is the resume well-organized and easy to scan?
Grammar & Language (1.0 pt): Free from spelling/grammatical issues.
Conciseness (1.0 pt): No excessive fluff, clear descriptions.
ATS Optimization (1.0 pt): Proper keywords, simple formatting for Applicant Tracking Systems.
Impact & Metrics (0.5 pts): Use of numbers (e.g., "Increased efficiency by 20%").
Consistency (0.5 pts): Uniform formatting, strong action verbs.
All strenghts, weaknesses and suggestions must be written using only words and punctuation. Do not use special characters or symbols.
Output Format (JSON)
{
"score": X.X,
"strengths": ["Concise bullet points", "Relevant work experience", "Good use of metrics"],
"weaknesses": ["Missing key job-required skills", "No quantifiable achievements", "Poor formatting"],
"suggestions": ["Include more industry keywords", "Add measurable results", "Improve resume formatting"]
}
Input Variables:
job_description: ${jobDescription}
resume_text: ${resumeText}
Now, analyze the resume based on the criteria above and return a clear and concise JSON response.`;

const makeAnwserFeedbackPrompt = ({question, answer}) =>
	`I am evaluating an interview response based on the given question and answer. Please ensure fairness in scoring while maintaining a positive and professional tone. Follow these strict grading rules:
        Zero Score Criteria:
        If the answer is empty, completely nonsensical, or entirely unrelated to the question, assign a score of 0.0 and provide feedback stating that the response does not meet the minimum relevance criteria.

        Scoring Guidelines for Relevant Answers:
        If the answer is somewhat relevant but lacks depth or clarity, provide a low to mid score (1.0 - 6.0) with brief constructive feedback.
        If the answer mostly covers the topic but has minor flaws, provide a higher score (7.0 - 9.0) while highlighting strengths and areas of improvement.
        If the answer is comprehensive and well-structured, give it full or near-full marks (9.0 - 10.0) and acknowledge its quality.

        Response Requirements:
        Point out mistakes directly without over-explaining.
        If no major mistakes exist, highlight positive aspects.
        Provide a potential perfect answer for comparison.
        Keep feedback concise, structured, and free from unnecessary details.
        All strenghts, weaknesses and final_verdict must be written using only words and punctuation. Do not use special characters or symbols.

        Evaluation:

        Question: ${question}, 
        Candidate's Answer: ${answer}

        Response Format (JSON Output):
        {
        "score": X.X,
        "feedback": "Brief feedback pointing out mistakes or appreciation.",
        "perfect_answer": "The potential perfect answer."
        }`;

const makeOverallFeedbackPrompt = ({questions, answers}) =>
	`I want a concise yet comprehensive evaluation of my interview performance based on my answers. Maintain a positive tone while being fair in scoring. Keep feedback direct and constructive.
Instructions: 
Assign a score out of 10 for each answer, ensuring it reflects quality while showing grace. 
If an answer is missing (empty string), note it as intolerable and assign a score of 0.
Identify key strengths concisely. 
List specific weaknesses without over-explaining. 
Provide a brief and to-the-point final verdict. 
Avoid unnecessary details or assumptions. 
All strenghts, weaknesses and final_verdict must be written using only words and punctuation. Do not use special characters or symbols.
Input Data: 
Questions: ${questions} 
My Answers: ${answers} 
Output Format (JSON): 
{ "evaluation": 
{ "strengths": ["Key strengths observed."], 
"weaknesses": ["Specific areas needing improvement."], 
"overall_score": X.X, 
"final_verdict": "Concise summary of overall performance." 
} 
}`;

module.exports = {
	makeAnwserFeedbackPrompt,
	makeOverallFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
};
