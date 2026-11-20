
# Edu-Path-AI
### AI-Powered Personalized Learning Platform

Edu-Path-AI is an AI-powered personalized learning platform designed to improve the learning experience of students through adaptive learning, smart assessments, performance analysis, and personalized recommendations.

The platform provides separate modules for students and teachers.

---

## 🚀 Features

### 👨‍🎓 Student Module

- Student Registration and Login
- Prerequisite Evaluation
- Personalized Student Dashboard
- Java Learning Topics and Resources
- AI Smart Engagement Quiz
- Performance Analysis
- AI Recommendation Engine
- Study Planner
- AI Career Mentor
- Final Java Evaluation
- Certificate Generation

### 👩‍🏫 Teacher Module

- Teacher Login
- Teacher Dashboard
- Student Management
- Student Progress Monitoring
- Assessment Performance Tracking

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Machine Learning | Python, FastAPI, Scikit-learn |
| Code Execution | Judge0 CE API |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
edu-path-ai/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── ml-service/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
│
└── README.md
```

---

## 💻 Installation and Setup

### 1. Prerequisites

Install the following software:

- Node.js
- npm
- Python 3.12
- MongoDB
- Visual Studio Code
- Git

Verify the installations:

```bash
node --version
npm --version
python --version
git --version
```

### 2. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd edu-path-ai
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

---

## ⚙️ Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Example configuration:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_LANGUAGE_ID=91
```

Use the exact environment variable names required by your source code.

Start the backend:

```bash
npm run dev
```

If the backend does not have a `dev` script, use the start command configured in `package.json`, such as:

```bash
npx nodemon server.js
```

Backend runs on:

```text
http://localhost:5000
```

---

## ⚛️ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the React application:

```bash
npm run dev
```

Open the local URL displayed in your terminal. Usually:

```text
http://localhost:5173
```

---

## 🤖 Machine Learning Service Setup

Open another terminal:

```bash
cd ml-service
```

Create a Python virtual environment:

```bash
py -3.12 -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
python -m uvicorn app.main:app --reload --port 8001
```

ML service runs on:

```text
http://127.0.0.1:8001
```

---

## ▶️ Running the Complete Project

Run all required services in separate terminals.

| Terminal | Service | Command |
|---|---|---|
| 1 | Backend | `npm run dev` |
| 2 | Frontend | `npm run dev` |
| 3 | ML Service | `python -m uvicorn app.main:app --reload --port 8001` |

Open the frontend URL in your browser.

The Java compiler communicates with the configured Judge0 CE API.

---

## 🎓 Student Learning Workflow

1. Open the landing page.
2. Register as a new student.
3. Log in to the platform.
4. Complete the prerequisite evaluation.
5. Access the student dashboard.
6. Explore Java learning topics.
7. Study topic-wise videos and notes.
8. Attempt the AI Smart Engagement Quiz.
9. View performance analysis.
10. Explore AI recommendations.
11. Manage learning activities through the Study Planner.
12. Get career guidance through AI Career Mentor.
13. Complete all required Java topics.
14. Attempt the Final Evaluation.
15. View the final result and certificate eligibility.

### Final Evaluation

- Total Questions: 30
- MCQ Questions: 20
- Coding Questions: 10
- Total Marks: 100
- Certificate Eligibility: 96/100 or above

Students must complete all required Java topics before accessing the Final Evaluation.

---

## 👩‍🏫 Teacher Workflow

1. Log in using teacher credentials.
2. Access the Teacher Dashboard.
3. View available student information.
4. Monitor student learning progress.
5. Review available assessment results.

---

## 🔐 Security Notes

- Never upload `.env` files to GitHub.
- Do not expose database credentials.
- Keep API keys and secret tokens private.
- Use test accounts for demonstrations.

---

## 🎯 Project Objective

The main objective of Edu-Path-AI is to provide a personalized and interactive learning environment where students can improve their programming knowledge through structured learning materials, intelligent assessments, performance tracking, and AI-based guidance.

---

## 👩‍💻 Project Information

**Project Name:** Edu-Path-AI

**Project Type:** AI-Powered Personalized Learning Platform

**Architecture:** MERN Stack + Python FastAPI

**Learning Domain:** Java Programming

**Developed As:** Final Year Project
