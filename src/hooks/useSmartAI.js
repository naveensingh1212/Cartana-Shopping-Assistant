// src/hooks/useSmartAI.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useSmartAI(items) {
  const [suggestions, setSuggestions] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (!items.length || !apiKey) return;

    const fetchAI = async () => {
      setLoading(true);
      try {
        const itemNames = items.map((i) => i.name).join(", ");
        const prompt = `The cart contains: ${itemNames}. Suggest 3 useful shopping recommendations.`;

        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const text =
          res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const lines = text
          .split(/[\n•-]/)
          .map((l) => l.trim())
          .filter(Boolean);

        setSuggestions(lines.slice(0, 5));
      } catch (err) {
        console.error("❌ Gemini AI fetch failed", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [items, apiKey]);

  return { suggestions, seasonal, loading };
}
