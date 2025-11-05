# 🧠 Code Review Assistant

### Automate your code reviews using AI — analyze structure, readability, and best practices effortlessly.

---

## 🚀 Overview

**Code Review Assistant** is a full-stack web application that allows users to upload source code files and receive AI-generated code reviews.  
It provides feedback on:
- 🧩 Code readability  
- ⚙️ Modularity and structure  
- 🐞 Potential bugs  
- 💡 Improvement suggestions  

Built using:
- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** SQLite (via Prisma)  
- **LLM Integration:** Gemini / OpenAI API  

---

## 🎯 Objectives

- Automate the code review process using AI  
- Provide developers instant insights into code quality  
- Store and view past code review reports  
- Offer a clean, responsive, and intuitive interface  

---

## 🧩 Features

✅ Upload one or multiple code files  
✅ Get instant AI-based review reports  
✅ Automatic scoring system for code quality  
✅ Dashboard to view previous reports  
✅ File-based project naming  
✅ Persistent database storage  
✅ Beautiful Tailwind UI  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Tailwind CSS, React Router |
| **Backend** | Node.js, Express |
| **Database** | SQLite (Prisma ORM) |
| **AI Engine** | Gemini / OpenAI API |
| **Version Control** | Git & GitHub |

---

## ⚙️ Architecture

```text
Frontend (React + Tailwind)
        ↓
Backend API (Express)
        ↓
LLM Service (Gemini/OpenAI)
        ↓
SQLite Database (Prisma)
```

---

## 💻 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ReviewApp.git
cd ReviewApp
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=your_gemini_api_key_here
```

Initialize Prisma:

```bash
npx prisma migrate dev --name init
```

Start backend server:

```bash
npm run dev
```

✅ Runs at [http://localhost:4000](http://localhost:4000)

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

✅ Runs at [http://localhost:3000](http://localhost:3000)

---

## 🧠 Usage

### ▶ Upload Files
1. Open the Upload page  
2. Select one or more source code files  
3. Click **Upload & Review**  
4. Wait for AI analysis  

### 📊 View Reports
1. Navigate to **Reports**  
2. View your project (auto-named from filename)  
3. Check AI-generated score and insights  
4. Click a report for full analysis  

---

## 🧠 Example Output

```json
{
  "score": 86,
  "summary": {
    "readability": "Good variable naming but lacks comments.",
    "modularity": "Could split into smaller reusable functions.",
    "bugs": "Potential null reference in line 48."
  },
  "topSuggestions": [
    "Add inline comments for better readability.",
    "Extract repeated logic into helper functions.",
    "Handle possible null values in inputs."
  ]
}
```

---

## 🗄️ Database Schema (Prisma)

```prisma
model Review {
  id            String   @id @default(cuid())
  projectName   String
  score         Int
  topSuggestions String[]
  reportJson    Json
  createdAt     DateTime @default(now())
}
```

---

## 🧑‍💻 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/reviews/upload` | Upload files and analyze using AI |
| `GET` | `/api/reviews` | Retrieve all review reports |
| `GET` | `/api/reviews/:id` | Retrieve a single review report |
| `DELETE` | `/api/reviews/clear` | (Optional) Clear all review data |

---

## 🧰 Environment Variables

| Variable | Description |
|-----------|-------------|
| `PORT` | Backend server port |
| `DATABASE_URL` | SQLite database URL |
| `GEMINI_API_KEY` | Gemini or OpenAI API key |

---

## 🎨 Frontend Pages

| Page | Description |
|------|--------------|
| **Upload Page** | Upload files for analysis |
| **Reports Dashboard** | View all reports and scores |
| **Detailed Report Page** | View full AI feedback |

---

## 🧩 Future Enhancements

- 🔒 User Authentication  
- 🧾 Export reports as PDF  
- 📈 Dashboard analytics & charts  
- 🌐 Multi-language code review (Python, C++, JS, etc.)  
- 🧠 “Explain This Suggestion” AI Mode  


