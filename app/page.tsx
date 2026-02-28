"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  type AiResult = {
    category: string;
    subcategory: string;
    seo_tags: string[];
    sustainability: string[];
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setResult(null);

    if (!title || !description) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("AI error");

      setResult(data.data);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Navbar />

      {/* Main Content - Integrated Card */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-10">
          {/* Header inside card */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              AI Catalog & Support
            </h1>
            <p className="text-white/80 text-lg">
              Generate product categories, SEO tags & customer support responses instantly
            </p>
          </div>

          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Product Title
              </label>
              <input
                type="text"
                placeholder="e.g. Bamboo Bottle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/50 transition"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Product Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your product in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/50 transition resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate with AI"
              )}
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-100 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-10 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-pink-500 rounded-full"></span>
                    Classification Result
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-lg font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                        {result.category}
                      </p>
                    </div>

                    {/* Subcategory */}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Subcategory</p>
                      <p className="text-lg font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                        {result.subcategory}
                      </p>
                    </div>
                  </div>

                  {/* SEO Tags */}
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">SEO Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {result.seo_tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sustainability Tags */}
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Sustainability Features</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sustainability.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm"
                        >
                          ♻️ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <Link href="/chat">
        <div className="fixed bottom-6 right-6 bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:bg-gray-900 hover:scale-110 transition-all duration-200 cursor-pointer">
          💬
        </div>
      </Link>
    </div>
  );
}