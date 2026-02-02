import { useMemo, useState } from "react";

export default function SerpAnalysisAIGenerator() {
  const [keyword, setKeyword] = useState("");
  const [serpLoading, setSerpLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [serpResults, setSerpResults] = useState([]);
  const [aiOutput, setAiOutput] = useState({});
  const [instructions, setInstructions] = useState("");

  const metrics = useMemo(
    () => [
      { label: "Content Density", value: 68 },
      { label: "Keyword Gap", value: 42 },
      { label: "Competitor Avg. Score", value: 76 },
    ],
    []
  );

  const handleSerpFetch = async () => {
    setSerpLoading(true);
    try {
      const response = await fetch("/api/ai/serp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await response.json();
      setSerpResults(data.competitors || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSerpLoading(false);
    }
  };

  const handleGenerate = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, serpData: serpResults, instructions }),
      });
      const data = await response.json();
      setAiOutput(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <aside className="w-72 border-r border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Sites</h2>
          <p className="mt-2 text-sm text-slate-400">Select a site to load SEO data.</p>
          <div className="mt-6 space-y-3">
            {["Acme Blog", "Shopify Trends", "Health Hub"].map((site) => (
              <button
                key={site}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm hover:border-slate-600"
              >
                {site}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">SERP Analysis & AI Generator</h1>
              <p className="text-sm text-slate-400">
                Analyze competitors, generate optimized content, and push drafts to WordPress.
              </p>
            </div>
            <button className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">
              Bulk Action
            </button>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-semibold uppercase text-slate-400">Primary Keyword</label>
                    <input
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      placeholder="e.g. AI SEO tools"
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSerpFetch}
                    disabled={!keyword || serpLoading}
                    className="rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {serpLoading ? "Fetching..." : "Run SERP"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Top Competitors</h3>
                  <span className="text-xs text-slate-400">Top 10 results</span>
                </div>
                <div className="mt-4 space-y-3">
                  {serpResults.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No results yet. Run the SERP analysis to populate this list.
                    </p>
                  ) : (
                    serpResults.map((result, index) => (
                      <div
                        key={`${result.link}-${index}`}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-slate-100">{result.title}</p>
                        <p className="text-xs text-slate-400">{result.link}</p>
                        <p className="mt-2 text-xs text-slate-300">{result.snippet}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold">Competitive Metrics</h3>
                <div className="mt-4 space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-emerald-400"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold">AI Content Generator</h3>
                <div className="mt-4 space-y-4">
                  <textarea
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Add tone, target audience, or format requirements..."
                    className="h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!keyword || aiLoading}
                    className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {aiLoading ? "Generating..." : "Generate Outline + Content"}
                  </button>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase text-slate-400">Rank Math Fields</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-200">
                    <div>
                      <p className="text-xs text-slate-400">Meta Title</p>
                      <p>{aiOutput.metaTitle || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Meta Description</p>
                      <p>{aiOutput.metaDescription || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Focus Keywords</p>
                      <p>{(aiOutput.focusKeywords || []).join(", ") || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase text-slate-400">Outline</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
                    {(aiOutput.outline || ["H2: Intro", "H2: Benefits", "H2: FAQs"]).map(
                      (item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
