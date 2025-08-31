  import { useState, useRef } from "react";
  import { motion } from "framer-motion";
  import { Mic, ShoppingCart, Send } from "lucide-react";

  import useSpeech from "./hooks/useSpeech";
  import useShoppingList from "./hooks/useShoppingList";
  import parseCommand from "./lib/parseCommand";
  import categorize from "./lib/categorize";

  import ShoppingList from "./components/ShoppingList";
  import Toast from "./components/Toast";
  import SuggestionsPanel from "./components/SuggestionsPanel";
  import useSmartAI from "./hooks/useSmartAI";

  export default function App() {
    const { isListening, transcript, start, stop, reset, setLang, lang } =
      useSpeech("en-IN", { interim: true, continuous: true });

    const { items, addItem, removeItem, inc, dec, frequentItems } =
      useShoppingList();

    const { suggestions, seasonal } = useSmartAI(items);

    const [toast, setToast] = useState("");
    const [commandText, setCommandText] = useState("");
    const inputRef = useRef(null);

    const applyCommand = (text) => {
      const cmd = parseCommand(text || "");
      if (!cmd) return;

      if (cmd.intent === "add") {
        addItem(cmd.item, cmd.qty || 1, categorize(cmd.item));
        setToast(`✅ Added ${cmd.item}`);
      }
      if (cmd.intent === "remove") {
        removeItem(cmd.item);
        setToast(`❌ Removed ${cmd.item}`);
      }
      reset();
      setCommandText("");
      setTimeout(() => setToast(""), 2000);
    };

    const handleManualSubmit = () => {
      if (commandText.trim()) {
        applyCommand(commandText);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleManualSubmit();
      }
    };

    const focusInput = () => {
      inputRef.current.focus();
    };

    if (transcript && !isListening) {
      applyCommand(transcript);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800">
        <Toast message={toast} />

        {/* Mic at top center */}
        <div className="flex flex-col items-center mb-10">
          <motion.button
            onClick={isListening ? stop : start}
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
              boxShadow: isListening
                ? [
                    "0 0 0 0 rgba(236,72,153,0.7)",
                    "0 0 0 20px rgba(236,72,153,0)",
                  ]
                : "0 0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg"
          >
            <Mic className="h-6 w-6 sm:h-8 sm:w-8" />
          </motion.button>

          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="mt-2 text-xs border rounded px-2 py-1 bg-white shadow-sm"
          >
            <option value="en-IN">🇬🇧 EN</option>
            <option value="hi-IN">🇮🇳 HI</option>
            <option value="fr-FR">🇫🇷 FR</option>
          </select>
        </div>

        {/* Fixed Cart Container */}
        <div className="relative w-full max-w-6xl h-[72vh] bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden flex flex-col">
          {/* Header */}
          <header className="text-center py-4 border-b border-pink-200">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Cartana – Shopping Assistant
            </h1>
            <div className="mt-1 sm:mt-2 text-slate-500 text-xs sm:text-sm">
              {transcript || (
                <span className="cursor-text" onClick={focusInput}>
                  {commandText || "Say something or type here..."}
                </span>
              )}
              <input
                ref={inputRef}
                type="text"
                value={commandText}
                onChange={(e) => setCommandText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="absolute w-0 h-0 p-0 m-0 border-0 overflow-hidden"
              />
            </div>
          </header>

          {/* Content Grid with Scrollable Areas */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 overflow-hidden p-4">
            {/* Vertical Divider */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-pink-200 opacity-50 hidden sm:block"></div>

            {/* Cart */}
            <div className="flex flex-col h-full">
              <h2 className="flex items-center justify-center gap-2 font-semibold text-base sm:text-lg mb-3">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                Your Cart
              </h2>
              <div className="flex-1 overflow-y-auto pr-2">
                <ShoppingList
                  items={items}
                  inc={inc}
                  dec={dec}
                  removeItem={removeItem}
                />
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-col h-full">
              <SuggestionsPanel
                frequent={frequentItems}
                seasonal={seasonal}
                smart={suggestions}
                onAdd={(n) => addItem(n, 1, categorize(n))}
              />
            </div>
          </div>

          {/* Wheels for cart effect */}
          <div className="absolute -bottom-5 left-1/4">
            <div className="h-10 w-10 bg-slate-400 rounded-full border-4 border-slate-600 shadow-inner" />
          </div>
          <div className="absolute -bottom-5 right-1/4">
            <div className="h-10 w-10 bg-slate-400 rounded-full border-4 border-slate-600 shadow-inner" />
          </div>
        </div>
      </div>
    );
  }