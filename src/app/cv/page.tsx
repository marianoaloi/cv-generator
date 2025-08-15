"use client";

import { useRef, useState, useEffect } from "react";
import PersonalInfo from "../../components/PersonalInfo";
import Summary from "../../components/Summary";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Skills from "../../components/Skills";
import SocialMedia from "@/components/SocialMedia";
import Languages from "@/components/Language";

export default function CVPage() {
  const cvRef = useRef<HTMLDivElement>(null);
  const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("cvData");
    if (data) {
      setCvData(JSON.parse(data));
    }
  }, []);

  const handleExport = () => {
    if (cvRef.current) {
      const htmlCenter = cvRef.current.innerHTML;
      const fixHTML = `<html><head>  <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
 </head><body>${htmlCenter}</body></html>`;
      const blob = new Blob([fixHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div ref={cvRef} className="max-w-4xl w-full bg-white p-8 shadow-lg">
        {cvData ? (
          <>
            <PersonalInfo data={cvData.personalInformation} lang={cvData.languageCodeOfJobDescription} />
            <div className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Summary</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <p className='text-justify'>{cvData.summary}</p>
                </div>
                <div className="col-span-1">
                  <Skills data={cvData.relevantSkills} lang={cvData.languageCodeOfJobDescription} />
                </div>
              </div>
            </div>
            <SocialMedia  />
            <Experience data={cvData.experience} lang={cvData.languageCodeOfJobDescription} />
            <div className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Education</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
            <Education data={cvData.education} lang={cvData.languageCodeOfJobDescription} />
                </div>
                <div className="col-span-1">
                  <Languages lang={cvData.languageCodeOfJobDescription} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading CV data...</p>
        )}
      </div>
      <button
        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleExport}
      >
        Export as HTML
      </button>
    </main>
  );
}