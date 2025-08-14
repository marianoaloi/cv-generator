"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    const functions = getFunctions(app);
    const generateCv = httpsCallable(functions, "generateCv");
    try {
      const result = await generateCv({ jobDescription });
      const cvData = result.data;
      // Store CV data in local storage to pass to the CV page
      localStorage.setItem("cvData", JSON.stringify(cvData));
      router.push("/cv");
    } catch (error) {
      console.error("Error generating CV:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">CV Generator</h1>
      <p className="text-lg mb-8">Paste the job description below</p>
      <textarea
        className="w-full max-w-2xl p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        rows={10}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      ></textarea>
      <button
        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={!jobDescription || loading}
      >
        {loading ? "Generating..." : "Generate CV"}
      </button>
    </main>
  );
}