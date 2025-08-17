import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import * as fs from "fs";
import { marked } from "marked";

import { google } from "googleapis";
import prompt from "./prompt";

configDotenv();


if (admin.apps.length === 0) {
  admin.initializeApp({projectId: "curriculum-29102"});
}
// const cred = require('./cert/curriculum-29102-9e559bc27c95.json')
const cred = JSON.parse(fs.readFileSync('./cert/curriculum-29102-9e559bc27c95.json', 'utf8'));


const authDrive = new google.auth.GoogleAuth({
  credentials: cred,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth: authDrive });

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

  const result = await model.generateContent(prompt(rdata,jobDescription));
  const response = result.response;
  const text = response.text().replace("```json", "").replace("```", "");
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
