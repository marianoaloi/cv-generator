import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import * as fs from "fs";

import { google } from "googleapis";

configDotenv();


admin.initializeApp();
// const cred = require('./cert/curriculum-29102-9e559bc27c95.json')
const cred = JSON.parse(fs.readFileSync('./cert/curriculum-29102-9e559bc27c95.json', 'utf8'));


const auth = new google.auth.GoogleAuth({
  credentials: cred,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

// import { defineSecret } from "firebase-functions/params";
// logger.log(defineSecret("GEMINI_API").value())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "ERROR+API");

export const generateCv = functions.https.onCall(async (data) => {
  const { jobDescription } = data.data;

  const resp = await drive.files.get({
    fileId: "1_ITG99dojjmn4uA3QazqAoVNryc3UZyP",
    alt: 'media'
  })

  const rdata = resp.data;



  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Based on my json job experience data 
    =====================================  
    experience data :
    ${JSON.stringify(rdata)}
    and based on the following job description
    =====================================  
    Job Description:
    ${jobDescription}
    =====================================

    , generate a professional Curriculum Vitae in JSON format. The CV should be tailored to the job description and include sections for personal information, summary, work experience, education, and skills. The JSON structure should be as follows: 
  {
    "summary": "...", 
    "experience": [
      {
        "title": "...", 
        "company": "...", 
        "date": "...",
        "description": "..."
      }
    ], 
    interistingProjects": [
      {
        "title": "...", 
        "description": "..."
      }
    ], 
    "skills": []
  }

  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text().replace("```json","").replace("```","");

  try {
    return JSON.parse(text);
  } catch (e) {
    functions.logger.error("Error parsing JSON from Gemini API:", text);
    throw new functions.https.HttpsError("internal", "Failed to parse CV data from AI service.");
  }
});
