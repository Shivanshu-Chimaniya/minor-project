const makeQuestionPrompt = ({
	level,
	jobDescription,
}) => `Generate 3 to 5 structured verbal interview questions for a ${level} role based on the following job description:  
        ${jobDescription}  
        **Requirements:**  
        - Ensure the questions align with the **${level}** role, adjusting complexity accordingly:  
        - **Junior:** Focus on fundamental coding concepts, basic problem-solving, and understanding of core data structures and algorithms.  
        - **Mid-Level:** Include more in-depth problem-solving, real-world coding scenarios, and optimization techniques.  
        - **Senior:** Emphasize advanced system design, scalability, architecture, and best coding practices.  
        - Keep each question **short enough to be answered in under 1 minute**.  
        - Focus primarily on **coding topics** that can be explained verbally, covering:  
        - **Problem-solving & Algorithms**  
        - **Data Structures**  
        - **System Design (if applicable)**  
        - **Coding Best Practices**  
        - **Real-world Application Scenarios**  
        Output Format (JSON): 
        {
            "questions": [
                "Question 1",
                "Question 2",
                "Question 3",
                "Question 4",
                "Question 5"
            ]
        }`;

const makeResumePrompt = ({
	jobDescription,
	reducedText,
}) => `You are an AI hiring assistant. Evaluate a candidate's resume against a job description and return a structured JSON response with precise scoring, clear strengths, and areas for improvement.
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
        
        Output Format (JSON)
        {
            "score": X.X,
            "strengths": ["Concise bullet points", "Relevant work experience", "Good use of metrics"],
            "weaknesses": ["Missing key job-required skills", "No quantifiable achievements", "Poor formatting"],
            "suggestions": ["Include more industry keywords", "Add measurable results", "Improve resume formatting"]
        }
        Input Variables:
        job_description: ${jobDescription}
        resume_text: ${reducedText}
        Now, analyze the resume based on the criteria above and return a clear and concise JSON response.`;
const makeAnwserFeedbackPrompt = ({
	question,
	answer,
}) => `I would like to evaluate my interview answers in a fair and constructive manner. Please provide feedback with a positive and supportive approach, acknowledging that minor transcription errors may occur but do not significantly affect the meaning. The focus should be on the overall quality of the response rather than minor typos.

        Question:
        ${question}

        Answer:
        ${answer}

        Evaluation Criteria:

        Accuracy: Is the response factually correct, even if minor errors are present?

        Completeness: Does it fully address all aspects of the question?

        Clarity: Is the answer well-structured and easy to follow?

        Relevance: Does it directly respond to the question in a meaningful way?

        Output Format (JSON)

        Please respond strictly in the following JSON format:

        {
        "score": X.X,
        "feedback": "Encouraging and constructive feedback highlighting strengths and areas for improvement.",
        "perfect_answer": "An ideal version of the answer for reference."
        }`;
const makeOverallFeedbackPrompt = ({
	questions,
	answers,
}) => `I am evaluating my interview performance based on my responses to the given questions. 
        Please keep a positive tone in your response, show some grace when providing scores, and assign an overall score out of 10.0 based on the quality of the answers.  
        Empty string means no answer is provided and it is intolerable.  

        Questions:  
        ${questions}  

        Candidate's Answers:  
        ${answers}  

        Evaluation Criteria:  

        - Assess the candidate's performance holistically rather than on a per-question basis.  
        - Identify overall strengths observed across multiple answers.  
        - Point out weaknesses concisely without over-explaining.  
        - Show grace when giving scores, but ensure they reflect the overall quality of the responses.  
        - Keep the feedback brief and to the point.  
        - Do not generate unnecessary information or make up details.  
        - Provide a final verdict concisely summarizing the candidate's performance.  

        Response Format (JSON Output):  
        {
            "evaluation": {
                "strengths": ["List key strengths observed in responses."],
                "weaknesses": ["List specific areas where improvement is needed."],
                "overall_score": X.X,
                "final_verdict": "Concise summary of the candidate's performance."
            }
        }`;

module.exports = {
	makeAnwserFeedbackPrompt,
	makeOverallFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
};
