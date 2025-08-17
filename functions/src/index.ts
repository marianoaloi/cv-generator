import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import * as fs from "fs";
import { marked } from "marked";

import { google } from "googleapis";

configDotenv();


if (admin.apps.length === 0) {
  admin.initializeApp({projectId: "curriculum-29102"});
}
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

export const generateCv = functions
  .https.onCall({timeoutSeconds: 540},async (data, context:any) => {
  // Verify authentication
  if (!data || !data.auth) {
    functions.logger.warn("Unauthenticated request to generateCv");
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to generate CV.'
    );
  }

  const { jobDescription, authToken } = data.data;
  const uid = data.auth.uid;
  
  functions.logger.info(`CV generation request from user: ${uid}`);

  // Additional token verification if needed
  try {
    if (authToken) {
      await admin.auth().verifyIdToken(authToken);
      functions.logger.info("Auth token verified successfully");
    }
  } catch (error) {
    functions.logger.error("Invalid auth token:", error);
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Invalid authentication token.'
    );
  }

  const resp = await drive.files.get({
    fileId: process.env.FILE_ID || "ERROR+API" ,
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

    , generate a professional Curriculum Vitae in JSON format. The CV should be tailored to the job description and include sections for personal information, summary, work experience, education, and skills. To be prolix in write the summawy with 2 or 3 paragraphs, pleases highlight the technologies with bold , add HTML tag in 'summary' and 'experience description' sections , not include empty tag or tag with only break line. Return all the companies experiences, if the experience with the company not match so much return a simple resume of the experience.  The JSON structure should be as follows: 
  {
    "summary": "...", 
    "experience": [
      {
        "title": "...", 
        "company": "...", 
        "start": "...",
        "end": "...",
        "description": "...",
        "technologies":[...]
      }
    ], 
    interistingProjects": [
      {
        "title": "...", 
        "description": "..."
        "hightlightsOfTheProject":[...]
      }
    ],
          
    "relevantSkills": [{
      "skillName": "...",
      "skillLevel": "0...100"
    }] ,
     
    "languageCodeOfJobDescription": "..."
  }

  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text().replace("```json","").replace("```","");
  const jsonDoc = JSON.parse(text);
  
  // Convert markdown to HTML in text fields
  if (jsonDoc.summary) {
    jsonDoc.summary = await marked(jsonDoc.summary);
  }
  
  // Convert markdown to HTML in experience descriptions
  if (jsonDoc.experience && Array.isArray(jsonDoc.experience)) {
    for (const exp of jsonDoc.experience) {
      if (exp.description) {
        exp.description = await marked(exp.description);
      }
    }
  }
  
  // Convert markdown to HTML in project descriptions
  if (jsonDoc.interistingProjects && Array.isArray(jsonDoc.interistingProjects)) {
    for (const project of jsonDoc.interistingProjects) {
      if (project.description) {
        project.description = await marked(project.description);
      }
    }
  }
  
  jsonDoc["certificates"] = rdata["certificates"]
  jsonDoc["educations"] = rdata["educations"]

  try {
    return jsonDoc;
  } catch (e) {
    functions.logger.error("Error parsing JSON from Gemini API:", text);
    throw new functions.https.HttpsError("internal", "Failed to parse CV data from AI service.");
  }
});
