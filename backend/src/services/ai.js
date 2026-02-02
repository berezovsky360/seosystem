import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchSerpResults(keyword) {
  if (!process.env.SERP_API_KEY) {
    return {
      keyword,
      competitors: [],
      note: "SERP_API_KEY missing - returning empty competitors list.",
    };
  }

  const response = await axios.post(
    "https://google.serper.dev/search",
    { q: keyword, num: 10 },
    {
      headers: {
        "X-API-KEY": process.env.SERP_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const competitors = (response.data.organic || []).map((item) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));

  return { keyword, competitors };
}

export async function generateAiContent({ keyword, serpData, instructions }) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      error: "OPENAI_API_KEY missing",
    };
  }

  const systemPrompt = `You are an SEO writing assistant for WordPress + Rank Math.
Return JSON with keys: outline (array), content (string), metaTitle, metaDescription, focusKeywords (array), seoScoreTarget (number).
The content should be optimized to score > 80 in Rank Math.`;

  const userPrompt = {
    keyword,
    serpData,
    instructions,
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(userPrompt) },
    ],
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content || "";
  let payload = {};
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    payload = { raw };
  }

  return {
    keyword,
    ...payload,
  };
}
