const makeQuestionPrompt = ({level, jobDescription, tags, features}) =>
	`Generate 3 to 7 verbal interview questions for a Skilled role applying for Full Stack Developer based on the job description below.
Job Description:${jobDescription}
${tags ? "tags: " + tags : ""}
${features ? "features: " + features : ""}

Guidelines:
Align questions with ${level} difficulty as a real interviewer would when assessing a candidate.
Ensure each question is unique and not repetitive.
Mix new questions in every response to maintain variety.
Keep questions concise (answerable in minutes).
Vary structures (scenarios, "What if..." cases, debugging, trade-offs, etc.).

Output Format:
[
  "Q1",
  "Q2",
...
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
Be Graceful for the good answers.
All responses must be written using only words and punctuation. Do not use special characters or symbols.

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
const makeVideoPrompt = () =>
	`Analyze the webcam footage of a candidate giving an interview. Focus only on their non-verbal behavior, expressions, and overall confidence. Do not evaluate the correctness of their answers.
Provide the analysis strictly in JSON format with no extra text. Use the following structure:
Facial Expressions: Detect the dominant emotion and variability.
Eye Contact: Evaluate consistency and distraction levels.
Body Language: Analyze posture and fidgeting.
Speech Analysis: Assess speaking speed and hesitations.
Confidence: Determine overall level and behavioral indicators.
Engagement: Identify enthusiasm and energy fluctuations.
Summary: Provide strengths, weaknesses, and suggestions for improvement.
Ensure the output adheres to this JSON format exactly. Do not include any additional commentary, explanations, or non-JSON content.
{
  "candidate_id": "<unique_id>",
  "analysis": {
    "facial_expressions": {
      "dominant_emotion": "<neutral/happy/anxious/confident/confused/stressed>",
      "emotion_variability": "<none/low/medium/high>"
    },
    "eye_contact": {
      "consistency": "<consistent/slightly_inconsistent/inconsistent/highly_inconsistent>",
      "distraction_level": "<none/low/medium/high>"
    },
    "body_language": {
      "posture": "<upright/slightly_slouched/slouched/leaning_forward/leaning_backward>",
      "fidgeting": "<none/minimal/moderate/high/excessive>"
    },
    "speech_analysis": {
      "speaking_speed": "<very_slow/slow/normal/fast/very_fast>",
      "hesitations_detected": "<none/minimal/some/frequent/excessive>"
    },
    "confidence": {
      "overall_level": "<very_low/low/medium/high/very_high>",
      "indicators": [
        "<steady_voice>", 
        "<relaxed_posture>", 
        "<nervous_smile>", 
        "<frequent_pauses>", 
        "<firm_tone>", 
        "<voice_shakiness>", 
        "<consistent_gestures>", 
        "<overuse_of_filler_words>"
      ]
    },
    "engagement": {
      "enthusiasm_level": "<very_low/low/medium/high/very_high>",
      "energy_fluctuation": "<stable/slightly_variable/moderate/highly_variable>"
    }
  },
  "summary": {
    "strengths": [
      "<e.g., maintains good posture>",
      "<e.g., steady eye contact>"
    ],
    "weaknesses": [
      "<e.g., frequent nervous fidgeting>",
      "<e.g., inconsistent eye contact>"
    ],
    "suggestions": [
      "<e.g., practice maintaining steady eye contact>",
      "<e.g., use controlled hand gestures instead of fidgeting>",
      "<e.g., take deep breaths to regulate speech pace>"
    ]
  }
}
`;
module.exports = {
	makeAnwserFeedbackPrompt,
	makeOverallFeedbackPrompt,
	makeQuestionPrompt,
	makeResumePrompt,
	makeVideoPrompt,
};
