"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle, logout, getAuthToken } = useAuth();

  const handleGenerate = async () => {
    if (!user) return;
    
    setLoading(true);
    const functions = getFunctions(app);
    const generateCv = httpsCallable(functions, "generateCv");
    try {
      const token = await getAuthToken();
      const result = await generateCv({ 
        jobDescription,
        authToken: token 
      });
      const cvData = result.data;
      // Store CV data and opportunity ID in local storage to pass to the CV page
      localStorage.setItem("cvData", JSON.stringify(cvData));
      localStorage.setItem("opportunityId", opportunityId);
      router.push("/cv");
    } catch (error) {
      console.error("Error generating CV:", error);
      // alert("Error generating CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error signing in. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">CV Generator</h1>
      
      {!user ? (
        <div className="text-center">
          <p className="text-lg mb-8">Please sign in to generate your CV</p>
          <button
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleLogin}
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-8">
            <p className="text-lg">Welcome, {user.displayName}!</p>
            <button
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
          
          <div className="w-full max-w-2xl mb-4">
            <label htmlFor="opportunityId" className="block text-sm font-medium text-gray-700 mb-2">
              Opportunity Identifier (for filename)
            </label>
            <input
              id="opportunityId"
              type="text"
              placeholder="e.g., CompanyName-Position-2024"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={opportunityId}
              onChange={(e) => setOpportunityId(e.target.value)}
            />
          </div>
          
          <p className="text-lg mb-4">Paste the job description below</p>
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
        </>
      )}
    </main>
  );
}