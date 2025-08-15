"use client";

import { useRef, useState, useEffect } from "react";
import PersonalInfo from "../../components/PersonalInfo";
import Summary from "../../components/Summary";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Skills from "../../components/Skills";

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
      const html = cvRef.current.innerHTML;
      const blob = new Blob([html], { type: "text/html" });
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
            <PersonalInfo data={cvData.personalInfo} />
            <Summary data={cvData.summary} />
            <Experience data={cvData.experience} />
            <Education data={cvData.education} />
            <Skills data={cvData.skills} />
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