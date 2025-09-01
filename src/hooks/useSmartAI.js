// src/hooks/useSmartAI.js
import { useEffect, useState } from "react";
import axios from "axios";

const cache = new Map(); // cache to avoid repeated API calls
let lastCall = 0;        // cooldown tracker

export default function useSmartAI(items) {
  const [suggestions, setSuggestions] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Seasonal logic
  useEffect(() => {
    const month = new Date().getMonth(); // 0 = Jan
    let seasonalItems = [];

    if ([5, 6, 7].includes(month)) {
      seasonalItems = ["Mangoes", "Watermelon", "Cucumber"];
    } else if ([9, 10, 11].includes(month)) {
      seasonalItems = ["Oranges", "Pumpkin", "Sweet Potatoes"];
    } else if ([0, 1].includes(month)) {
      seasonalItems = ["Strawberries", "Spinach", "Carrots"];
    } else if ([2, 3, 4].includes(month)) {
      seasonalItems = ["Apples", "Peas", "Lettuce"];
    } else if ([8].includes(month)) {
      seasonalItems = ["Bananas", "Corn", "Tomatoes"];
    }

    setSeasonal(seasonalItems);
  }, []);

  // Smart AI Suggestions
  useEffect(() => {
    if (!items.length || !apiKey) return;

    // Track cart composition only (names, not qty)
    const cartKey = items.map((i) => i.name).join(", ");

    const fetchAI = async () => {
      // ⏳ Cooldown: 1 call every 10s max
      const now = Date.now();
      if (now - lastCall < 10000) {
        console.warn("⏳ Skipping Gemini AI fetch to avoid 429");
        return;
      }
      lastCall = now;

      if (cache.has(cartKey)) {
        setSuggestions(cache.get(cartKey));
        return;
      }

      setLoading(true);
      try {
        const prompt = `The cart contains: ${cartKey}.
Suggest exactly 3 shopping recommendations as short item names only, no explanations, no numbering.`;

        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const lines = text
          .split(/[\n•-]/) // split into bullet points
          .map((l) => l.trim())
          .filter(Boolean)
          .slice(0, 3); // ✅ only 3 items

        setSuggestions(lines);
        cache.set(cartKey, lines);
      } catch (err) {
        if (err.response?.status === 429) {
          setSuggestions(["⚠️ Rate limit reached. Try again later"]);
        } else {
          console.error("❌ Gemini AI fetch failed", err.response || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // debounce AI calls
    const timeout = setTimeout(() => {
      fetchAI();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [items.map((i) => i.name).join(","), apiKey]); // ✅ only run when names change

  return { suggestions, seasonal, loading };
}
