import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

admin.initializeApp();

const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

export const generateCv = functions.https.onCall(async (data, context) => {
  const { jobDescription } = data;

  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `Based on the following job description, generate a professional Curriculum Vitae in JSON format. The CV should be tailored to the job description and include sections for personal information, summary, work experience, education, and skills. The JSON structure should be as follows: 
  {
    "personalInfo": {
      "name": "...", 
      "email": "...", 
      "phone": "...",
      "linkedin": "..."
    }, 
    "summary": "...", 
    "experience": [
      {
        "title": "...", 
        "company": "...", 
        "date": "...",
        "description": "..."
      }
    ], 
    "education": [
      {
        "degree": "...", 
        "university": "...", 
        "date": "..."
      }
    ], 
    "skills": []
  }
  
  Job Description:
  ${jobDescription}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Error parsing JSON from Gemini API:", text);
    throw new functions.https.HttpsError("internal", "Failed to parse CV data from AI service.");
  }
});
