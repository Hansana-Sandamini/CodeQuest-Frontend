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

---

## 🖼️ Application Screenshots

📸 Screenshots of key pages and functionalities of CodeQuest

### 🏠 Public Pages

Home Page
<img width="1894" height="1077" alt="home" src="https://github.com/user-attachments/assets/564f00a4-4f9a-4f73-9993-09f601f1501b" />

Register Page
<img width="1894" height="1077" alt="register" src="https://github.com/user-attachments/assets/8499413c-1c59-4083-b6d7-5f1d836d7c0f" />

Login Page
<img width="1894" height="1077" alt="login" src="https://github.com/user-attachments/assets/e5e6037d-5a3a-47ab-9e64-cad0440be7f2" />

### 🛡️ Admin Panel

Admin Dashboard
<img width="1894" height="1077" alt="admin_dashboard" src="https://github.com/user-attachments/assets/69c52653-73e0-4d28-bacd-4e70fe4276f0" />

Manage Languages
<img width="1902" height="1076" alt="admin_languages" src="https://github.com/user-attachments/assets/f7092f2f-ed18-4e99-aaf1-ef62f6cf6dce" />

Manage Questions
<img width="1902" height="1076" alt="admin_questions" src="https://github.com/user-attachments/assets/3e992a33-88f3-4c61-910c-b3201e047950" />

Add MCQ Question
<img width="1898" height="1082" alt="admin_add_mcq_question" src="https://github.com/user-attachments/assets/5db8531e-b5b3-44b0-8c40-59f44a91a11b" />

Add Coding Question
<img width="1882" height="1081" alt="admin_add_coding_question" src="https://github.com/user-attachments/assets/7c79e34c-220f-4682-bebb-98dd9889a165" />

Manage Users
<img width="1894" height="1077" alt="users" src="https://github.com/user-attachments/assets/50ef2ec2-cf5e-4f94-8d14-656c3e9c901b" />

### 👤 User Panel

User Dashboard
<img width="1894" height="1077" alt="user_dashboard" src="https://github.com/user-attachments/assets/74adf69a-088f-4688-8e5a-e73c70989173" />

User Languages
<img width="1894" height="1077" alt="user_languages" src="https://github.com/user-attachments/assets/1242071f-a79b-4d6a-bf15-c4c796ce186a" />

User Questions
<img width="1894" height="1077" alt="user_questions_page" src="https://github.com/user-attachments/assets/045967a1-1f02-4c83-9f0e-9ed3c170ef7d" />

Submit Coding Question
<img width="1900" height="1073" alt="coding_submit" src="https://github.com/user-attachments/assets/d04aa597-d391-4175-8422-02906f1d168f" />

Reveal AI Hint
<img width="1890" height="1073" alt="reveal_hint" src="https://github.com/user-attachments/assets/3ea7dfc0-58b1-494e-80e2-5181527302bd" />

User Profile
<img width="1894" height="1077" alt="user_profile" src="https://github.com/user-attachments/assets/dcf311c6-02fe-4308-8002-17167cbf371a" />
