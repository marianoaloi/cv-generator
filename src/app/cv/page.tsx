"use client";

import { useRef, useState, useEffect } from "react";
import PersonalInfo from "../../components/PersonalInfo";
import Summary from "../../components/Summary";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Skills from "../../components/Skills";
import SocialMedia from "@/components/SocialMedia";

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
            <PersonalInfo data={cvData.personalInformation} />
            <Summary data={cvData.summary} />
            <SocialMedia />
            <Experience data={cvData.experience} />
            <Education data={cvData.education} />
            <Skills data={cvData.relevantSkills} />
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