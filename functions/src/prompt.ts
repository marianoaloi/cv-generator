import { drive_v3 } from "googleapis";

export default (rdata:drive_v3.Schema$File,jobDescription:string) =>{
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

  return prompt;
}