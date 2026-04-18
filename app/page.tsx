'use client';
import { useState } from "react";
export default function Home() {
  const [research_question, setResearchQuestion] = useState("");
  const [key_papers, setKeyPapers] = useState("");
  const [exclusion_criteria, setExclusionCriteria] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const accentColor = "hsl(85, 65%, 50%)";
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ research_question, key_papers, exclusion_criteria }) });
      const data = await res.json();
      setOutput(data.result || data.error || "No response");
    } catch (e: any) { setOutput("Error: " + e.message); }
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">AI Literature Review Writer</h1>
          <p className="text-gray-400 mb-8">Systematically review and synthesize scientific literature on any topic.</p>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Research Question (PICO/PIRO format)</label>
              <textarea value={research_question} onChange={e => setResearchQuestion(e.target.value)} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 resize-none" placeholder="In PICO format: Population: adults with..., Intervention: statin therapy, Comparison: placebo, Outcome: cardiovascular events..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Key Papers / Initial Literature</label>
              <textarea value={key_papers} onChange={e => setKeyPapers(e.target.value)} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 resize-none" placeholder="List known key papers or search terms: e.g., statins CVD primary prevention, PCSK9 inhibitors, LDL lowering..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Exclusion Criteria</label>
              <textarea value={exclusion_criteria} onChange={e => setExclusionCriteria(e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 resize-none" placeholder="e.g., exclude pediatric studies, non-English, case reports, pre-2010, industry-funded without独立统计..." />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: accentColor }}>
              {loading ? "Writing Review..." : "Generate Literature Review"}
            </button>
          </form>
          {output && <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg"><pre className="whitespace-pre-wrap text-sm text-gray-200">{output}</pre></div>}
        </div>
      </div>
    </div>
  );
}