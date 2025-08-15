"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCv = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("dotenv");
const fs = __importStar(require("fs"));
const googleapis_1 = require("googleapis");
(0, dotenv_1.configDotenv)();
admin.initializeApp();
// const cred = require('./cert/curriculum-29102-9e559bc27c95.json')
const cred = JSON.parse(fs.readFileSync('./cert/curriculum-29102-9e559bc27c95.json', 'utf8'));
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: cred,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const drive = googleapis_1.google.drive({ version: 'v3', auth });
// import { defineSecret } from "firebase-functions/params";
// logger.log(defineSecret("GEMINI_API").value())
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API || "ERROR+API");
exports.generateCv = functions.https.onCall(async (data) => {
    const { jobDescription } = data.data;
    const resp = await drive.files.get({
        fileId: "1_ITG99dojjmn4uA3QazqAoVNryc3UZyP",
        alt: 'media'
    });
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
        "start": "...",
        "end": "...",
        "description": "..."
      }
    ], 
    interistingProjects": [
      {
        "title": "...", 
        "description": "..."
      }
    ],
        "education": [
            {
                "school": "...",
                "degree": "...",
                "start": "...",
                "end": "..."
            },   
    "relevantSkills": [{
      "skillName": "...",
      "skillLevel": "0...100"
    }] ,
    "languageCodeOfJobDescription": "..."
  }

  `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text().replace("```json", "").replace("```", "");
    try {
        return JSON.parse(text);
    }
    catch (e) {
        functions.logger.error("Error parsing JSON from Gemini API:", text);
        throw new functions.https.HttpsError("internal", "Failed to parse CV data from AI service.");
    }
});
//# sourceMappingURL=index.js.map