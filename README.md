# 🛒 Cartana – Smart Shopping Assistant

**Cartana** is an intelligent shopping assistant that helps you manage your shopping list using **voice commands** or **typing**.  
It leverages **natural language processing (NLP)** and **AI-powered smart suggestions** to make grocery management simple, fast, and intuitive.  

Deployed Live 👉 [https://cartana-shopping-assistant.vercel.app/](https://cartana-shopping-assistant.vercel.app/)

---

## ✨ Features
- 🎙️ **Voice & manual input** – Add/remove items via speech recognition or typing.
- 🧠 **Natural language parsing** – Commands like *“Add 2 bottles of milk”* detect item & quantity.
- 🤖 **AI-powered suggestions** – Seasonal recommendations, smart substitutes, and frequent items.
- 📦 **Frequent items tracking** – Items you add often appear as quick suggestions.
- 💾 **Persistent storage** – Your cart is saved locally (localStorage).
- 📱 **Responsive UI** – Optimized for both desktop and mobile devices.
- 🎨 **Modern design** – Built with Tailwind CSS, Lucide icons, and Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)** – Core framework for fast and modular UI development.
- **Tailwind CSS** – Utility-first styling for a clean, responsive, and modern design.
- **Lucide React** – Lightweight icons for cart, mic, actions, and visual cues.
- **Framer Motion** – Smooth animations (e.g., cart slide-in, button hover/tap scaling).

### AI & NLP
- **Speech Recognition API** – Converts voice commands to text.
- **Custom NLP Parser** – Extracts intent, item names, and quantities from user commands.
- **Gemini / AI APIs** – Provides smart suggestions, seasonal recommendations, and substitutes.

### State & Data
- **React Hooks** – Custom hooks for speech, shopping list management, and AI integration.
- **LocalStorage** – Ensures the shopping list persists across browser sessions.

### Deployment
- **Vercel** – Fast, serverless deployment with environment variable support for API keys.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/cartana-shopping-assistant.git
cd cartana-shopping-assistant
