import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";


import { google } from "googleapis";

configDotenv();


admin.initializeApp();
const cred = require('./cert/curriculum-29102-9e559bc27c95.json')

const auth = new google.auth.GoogleAuth({
  credentials: cred,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

// import { defineSecret } from "firebase-functions/params";
// console.log(defineSecret("GEMINI_API").value())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "ERROR+API");

export const generateCv = functions.https.onCall(async (data) => {
  const { jobDescription } = data as any;

  const resp = await drive.files.get({
    fileId: "1_ITG99dojjmn4uA3QazqAoVNryc3UZyP",
    alt: 'media'
  })

  const chunks: Uint8Array[] = [];
  const reader = resp.body?.getReader();
  if (reader) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }};


  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
