# CodeQuest Frontend 🎨

## 📌 Project Overview

**CodeQuest** is an interactive coding practice and learning platform where users can solve coding and MCQ questions across multiple programming languages, earn badges and certificates, compete on leaderboards, and receive AI-powered hints.

This repository contains the **frontend application** of CodeQuest, developed using **React, TypeScript, Redux Toolkit, and Tailwind CSS**, following modern UI/UX and component-based architecture principles.

---

## 🌟 Features

* 🧑‍💻 Language-based coding & MCQ question interfaces
* 🏅 Badge and certificate display UI
* 📊 Leaderboard with ranking system
* 📅 Daily Question view
* 🤖 AI-generated hints integration
* 🔐 JWT-based authentication handling
* 🔑 Google OAuth login UI
* 📱 Fully responsive design (mobile, laptop, tablet & desktop)

---

## 🛠 Tech Stack

| Layer                  | Technology / Tools |
| ---------------------- | ------------------ |
| Frontend Framework     | React + TypeScript |
| State Management       | Redux Toolkit      |
| Styling                | Tailwind CSS       |
| Routing                | React Router       |
| API Communication      | Axios              |
| Alerts & Notifications | SweetAlert         |
| Build Tool             | Vite               |
| Deployment             | Vercel             |
| Version Control        | Git, GitHub        |

---

## 🌐 Deployed URLs

* **Frontend:** [https://code-quest-pied.vercel.app](https://code-quest-pied.vercel.app)
* **Backend:** [https://code-quest-be-three.vercel.app](https://code-quest-be-three.vercel.app)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Frontend Repository

```bash
git clone https://github.com/Hansana-Sandamini/CodeQuest-Frontend.git
cd codequest-fe
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

Create a `.env` file in the root directory:

```env
# RapidAPI key used for Judge0 code execution service
VITE_RAPID_KEY=your_judge0_api_key

# Base URL of the deployed backend API
VITE_API_URL=https://code-quest-be-three.vercel.app

# Google OAuth authentication endpoint
VITE_GOOGLE_AUTH_URL=https://code-quest-be-three.vercel.app/api/v1/auth/google
```

### 4️⃣ Run Frontend Application

```bash
npm run dev
```

### 5️⃣ Build for Production

```bash
npm run build
```

---

## 📂 Project Structure

<pre>
CODEQUEST-FE/
├── node_modules/                   # Contains all installed npm packages required to run the frontend application
├── public/                         # Static assets accessible publicly
├── src/
│   ├── api/                        # API call functions and Axios configurations
│   ├── assets/                     # Images, icons, and static resources
│   ├── components/                 # Reusable UI components
│   ├── features/                   # Redux slices and feature-based state logic
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Application pages (routes)
│   ├── store/                      # Redux store configuration
│   ├── types/                      # TypeScript type definitions and interfaces
│   ├── utils/                      # Utility helper functions
│   ├── App.css                     # Global application styles
│   ├── App.tsx                     # Root application component
│   ├── index.css                   # Tailwind CSS and global styles
│   └── main.tsx                    # Application entry point
├── .env                            # Environment variables
├── .gitignore                      # Git ignored files
├── package.json                    # Project metadata and dependencies
├── README.md                       # Project documentation
├── tsconfig.app.json               # TypeScript configuration for app
├── tsconfig.json                   # Base TypeScript configuration
├── tsconfig.node.json              # TypeScript configuration for Node
├── vercel.json                     # Vercel deployment configuration
└── vite.config.ts                  # Vite build configuration
</pre>

---

## ☁️ Deployment on Vercel

1. Push frontend repository to GitHub.
2. Create a new project on **Vercel** and connect your GitHub repository.
3. Select **Vite** as the framework preset (auto-detected).
4. Add the required environment variables in **Vercel → Environment Variables**.
5. Set build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy and access the live frontend URL.
