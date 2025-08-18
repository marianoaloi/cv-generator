"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import PersonalInfo from "../../components/PersonalInfo";
import Summary from "../../components/Summary";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Skills from "../../components/Skills";
import SocialMedia from "@/components/SocialMedia";
import Languages from "@/components/Language";
import { useAuth } from "../../contexts/AuthContext";
import Certificate from "@/components/Certificate";

interface CVData {
  personalInformation: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
  };
  summary: string;
  relevantSkills: Array<{
    skillName: string;
    skillLevel: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    end: string;
    start: string;
    description: string;
    technologies: string[];
  }>;
  educations: Array<{
    degree: string;
    school: string;
    start: string;
    end: string;
  }>;
  certificates: Array<{
    name: string;
    institute: string;
    credential: string;
    issued: string;
    url: string;
  }>;
  languageCodeOfJobDescription: string;
}

export default function CVPage() {
  const cvRef = useRef<HTMLDivElement>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [opportunityId, setOpportunityId] = useState<string>("");
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    const data = localStorage.getItem("cvData");
    if (data) {
      setCvData(JSON.parse(data));
    }
    
    const oppId = localStorage.getItem("opportunityId");
    if (oppId) {
      setOpportunityId(oppId);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (cvData) {
      const title = opportunityId 
        ? `Mariano_Aloi_${opportunityId}_${cvData.languageCodeOfJobDescription}` 
        : `Mariano_Aloi_${cvData.languageCodeOfJobDescription}`;
      document.title = title;
    }
  }, [cvData, opportunityId]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Redirecting to login...</div>
      </main>
    );
  }

  const handleExport = async () => {
    if (cvRef.current && cvData) {
      const style = await fetch((document.querySelector('link[data-precedence]') as HTMLLinkElement).href).then(t => t.text())
      const htmlCenter = cvRef.current.innerHTML;
      const fixHTML = `<html><head>  <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${style}
    </style>
 </head><body>${htmlCenter}</body></html>`;
      const blob = new Blob([fixHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = opportunityId ? `Mariano_Aloi_${opportunityId}_${cvData.languageCodeOfJobDescription}.html` : `Mariano_Aloi_${cvData.languageCodeOfJobDescription}.html`;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    const cvElement = document.getElementById("cv");
    if (cvElement && cvData) {
      const originalContents = document.body.innerHTML;
      const printContents = cvElement.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-24">
      <div id="cv" ref={cvRef} className="max-w-4xl w-full bg-white p-8 shadow-lg">
        {cvData ? (
          <>
            <PersonalInfo />
            <div >
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Summary data={cvData.summary} lang={cvData.languageCodeOfJobDescription} />
                </div>
                <div className="col-span-1">
                  <Skills data={cvData.relevantSkills} />
                </div>
              </div>
            </div>
            <SocialMedia />
            <Experience data={cvData.experience} lang={cvData.languageCodeOfJobDescription} />
            <div className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2 mb-4">{cvData.languageCodeOfJobDescription === "it" ? "Educazione" : "Education"}</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Education data={cvData.educations} />
                </div>
                <div className="col-span-1">
                  <Languages lang={cvData.languageCodeOfJobDescription} />
                </div>
              </div>
            </div>
            <Certificate data={cvData.certificates} lang={cvData.languageCodeOfJobDescription} />
          </>
        ) : (
          <p>Loading CV data...</p>
        )}
      </div>
      <div className="mt-8 flex gap-4">
        <button
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleExport}
        >
          Export as HTML
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handlePrint}
        >
          Print CV
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleGoHome}
        >
          Generate New CV
        </button>
        <button
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}