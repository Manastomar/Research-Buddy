# Research Buddy - AI Academic Assistant

Research Buddy is a full-stack academic assistant platform that integrates classical Natural Language Processing (NLP) with modern Large Language Models and Microsoft SQL Server persistence.

---

## Features

- **Academic Research Generator**: Generates structured research papers (Title, Abstract, Keywords, Introduction, Core Analysis, Discussion, and Conclusion) powered by Google Gemini.
- **Plagiarism & Originality Detector**: Evaluates text originality, calculates originality percentage scores, assesses risk levels, and flags cliché phrases.
- **AI Text Humanizer**: Algorithmic 5-stage NLP pipeline using NLTK (Tokenization, POS Tagging, Lemmatization, and WordNet Synsets) without external API dependencies.
- **PDF Export**: Generates and downloads formatted PDF documents directly from the browser using jsPDF.
- **User Authentication & History**: User registration, login, and activity history powered by Microsoft SQL Server.

---

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS / Modular CSS, jsPDF
- **Backend**: Python 3.12+, Flask, Flask-CORS
- **NLP & AI**: NLTK (Punkt, WordNet, POS Tagger), Google GenAI SDK (Gemini)
- **Database**: Microsoft SQL Server (pyodbc, ODBC Driver 18 for SQL Server)

---

## Project Structure

```text
ai-content-generator/
├── backend/
│   ├── app.py              # Flask server and API routes
│   ├── generator.py        # Gemini academic research generator
│   ├── detector.py         # Plagiarism and originality checker
│   ├── humanizer.py        # 100% algorithmic NLTK text humanizer
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend configuration and credentials
├── database/
│   ├── schema_mssql.sql    # T-SQL schema definition script
│   ├── init_mssql.py       # Standalone database initialization script
│   └── database.py         # Database queries and connection module
├── frontend/
│   ├── Components/         # React UI components (Generator, Detector, Humanizer, etc.)
│   ├── utils/              # Utility functions (downloadUtils.js)
│   ├── Images/             # Static logos and assets
│   ├── src/                # App entrypoint and styles
│   └── index.html          # HTML template
├── package.json            # Node.js dependencies and scripts
└── vite.config.js          # Vite configuration
```

---

## Getting Started

### 1. Database Setup (Microsoft SQL Server)
Ensure **Microsoft SQL Server** (or SQL Server Express) is running locally.

Initialize the database:
```bash
python database/init_mssql.py
```

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configure your `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DB_TYPE=mssql
   MSSQL_SERVER=localhost\SQLEXPRESS
   MSSQL_DATABASE=research_buddy_db
   MSSQL_DRIVER=ODBC Driver 18 for SQL Server
   MSSQL_TRUSTED_CONNECTION=yes
   ```
4. Start the backend:
   ```bash
   python app.py
   ```
   The Flask server runs at `http://127.0.0.1:5000`.

### 3. Frontend Setup
1. In the project root, install packages:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
