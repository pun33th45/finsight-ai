📊 FinSight AI

FinSight AI is an intelligent personal finance dashboard that helps users track expenses, visualize spending trends, and generate AI-powered financial insights using Google Gemini.

Built with React + TypeScript + Vite, the app focuses on clean UI, fast performance, and practical AI integration.

🌐 Live Demo

🔗 Deployed on Vercel:
👉 https://finsight-ai-six.vercel.app/


## 🖼️ Screenshots

### AI Analysis and Insights
<img
  src="https://raw.githubusercontent.com/pun33th45/finsight-ai/a289ab3887a03565e8517dbf1c4f710e8fbbfa41/Screenshots/AI%20analysis%20and%20insights.png"
  alt="AI Analysis and Insights"
  width="600"
/>

### Transaction Ledger
<img
  src="https://raw.githubusercontent.com/pun33th45/finsight-ai/a289ab3887a03565e8517dbf1c4f710e8fbbfa41/Screenshots/Transaction%20ledger.png"
  alt="Transaction Ledger"
  width="600"
/>

### Data Visualization
<img
  src="https://raw.githubusercontent.com/pun33th45/finsight-ai/a289ab3887a03565e8517dbf1c4f710e8fbbfa41/Screenshots/Vizualization%20of%20data.png"
  alt="Data Visualization"
  width="600"
/>

### Landing Page & UI
<img
  src="https://raw.githubusercontent.com/pun33th45/finsight-ai/a289ab3887a03565e8517dbf1c4f710e8fbbfa41/Screenshots/landing%20page%20and%20UI.png"
  alt="Landing Page and UI"
  width="600"
/>

📌 Note:
Screenshots are stored using GitHub raw file permalinks for stability.

✨ Features

📥 Add and manage financial transactions

🧠 AI-powered expense categorization

📊 Interactive spending charts (Recharts)

📈 Spending timeline visualization

📝 AI-generated financial summaries & tips

⚡ Fast development and build using Vite

🎨 Clean, modern UI with Tailwind CSS (CDN)

🛠️ Tech Stack

Frontend

React 18

TypeScript

Vite

AI

Google Gemini (@google/genai)

UI & Charts

Tailwind CSS (CDN)

Recharts

Lucide Icons

Deployment

Vercel

🧠 How AI Is Used

FinSight AI uses Google Gemini to:

Categorize transactions
Example:

"Swiggy order" → Food

Generate intelligent spending insights

Summarizes spending behavior

Provides actionable financial tips

⚠️ The project uses Gemini’s free tier, which has rate limits.

🚀 Getting Started (Local Development)
1️⃣ Clone the repository
git clone https://github.com/pun33th45/finsight-ai.git
cd finsight-ai

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create a .env file in the root:

VITE_API_KEY=your_gemini_api_key_here

4️⃣ Run the app
npm run dev


Open:
👉 http://localhost:5173

🏗️ Build for Production
npm run build


The output will be generated in the dist/ folder.

🔐 Environment Variables
Variable	Description
VITE_API_KEY	Google Gemini API key

⚠️ Since this is a frontend-only app, the API key is exposed in the browser.
This is acceptable for demos and portfolios, but not recommended for production apps.

📁 Project Structure
finsight-ai/
├── index.html
├── vite.config.ts
├── package.json
├── src/
│   ├── components/
│   ├── services/
│   │   └── geminiService.ts
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
└── .env

⚠️ Known Limitations

Gemini free-tier rate limits may cause temporary AI unavailability

API key is client-side (for demo purposes)

No persistent backend or database (in-memory data)

🛣️ Future Improvements

🔐 Move Gemini calls to a secure backend

💾 Persist transactions using a database

📱 Improve mobile responsiveness

📊 Add category-wise analytics

👤 User authentication

👤 Author

Puneeth raj yadav

GitHub: https://github.com/pun33th45
