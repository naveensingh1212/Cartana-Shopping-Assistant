import { useState } from "react";
import useSpeech from "./hooks/useSpeech";
import useShoppingList from "./hooks/useShoppingList";
import parseCommand from "./lib/parseCommand";
import categorize from "./lib/categorize";
import ShoppingList from "./components/ShoppingList";
import Suggestions from "./components/Suggestions";
import SearchResults from "./components/SearchResults";

export default function App() {
  const { items, addItem, removeItem, inc, dec } = useShoppingList();
  const { isSupported, isListening, transcript, error, start, stop, reset } =
    useSpeech("en-IN", { interim: true, continuous: true });

  const [tab, setTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPrice, setSearchPrice] = useState(null);

  const applyCommand = (text) => {
    const cmd = parseCommand(text || "");
    if (!cmd) return;
    if (cmd.intent === "add") {
      addItem(cmd.item, cmd.qty || 1, categorize(cmd.item));
      setTab("list");
    }
    if (cmd.intent === "remove") {
      removeItem(cmd.item);
      setTab("list");
    }
    if (cmd.intent === "search") {
      setTab("search");
      setSearchQuery(cmd.item);
      setSearchPrice(cmd.priceMax);
    }
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-slate-100 text-slate-800">
      <div className="max-w-lg mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-[#2D5FFF] text-white grid place-content-center shadow-sm">🛒</div>
            <h1 className="text-2xl font-semibold tracking-tight">Cartana</h1>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/80 border shadow-sm">
            {isSupported ? (isListening ? "Listening…" : "Idle") : "Speech not supported"}
          </span>
        </header>

        {/* Voice card */}
        <section className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Transcript</div>
          <div className="mt-1 min-h-6 font-medium">{transcript || "—"}</div>
          {error && <div className="text-sm text-red-600 mt-1">Error: {error}</div>}

          <div className="mt-3 flex gap-2">
            {!isListening ? (
              <button
                className="px-4 py-2 rounded-xl bg-[#2D5FFF] text-white shadow hover:opacity-95 active:scale-[.98]"
                onClick={start}
              >
                Start 🎤
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-xl bg-slate-900 text-white shadow hover:opacity-95 active:scale-[.98]"
                onClick={() => { stop(); applyCommand(transcript); }}
              >
                Stop & Apply
              </button>
            )}
            <button
              className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 active:scale-[.98]"
              onClick={() => applyCommand(transcript)}
            >
              Apply Command
            </button>
          </div>

          {/* Hints */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["add 2 almond milk", "remove bread", "find apples under 200"].map(h => (
              <span key={h} className="text-xs px-2 py-1 rounded-full border bg-white">{h}</span>
            ))}
          </div>
        </section>

        {/* Segmented tabs */}
        <nav className="mt-4 grid grid-cols-3 p-1 rounded-xl bg-white/70 border shadow-sm">
          {["list","suggestions","search"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "text-sm py-2 rounded-lg transition",
                tab===t ? "bg-[#2D5FFF] text-white shadow" : "hover:bg-slate-100"
              ].join(" ")}
            >
              {t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </nav>

        {/* Panels */}
        {tab === "list"        && <ShoppingList items={items} inc={inc} dec={dec} removeItem={removeItem} />}
        {tab === "suggestions" && <Suggestions items={items} onAdd={(n)=>addItem(n,1,categorize(n))} />}
        {tab === "search"      && <SearchResults query={searchQuery} priceMax={searchPrice} />}
      </div>
    </div>
  );
}
