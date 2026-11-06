# 💰 Full-Stack Expense Tracker

A modern, full-stack web application to track your daily income and expenses. Built with the MERN stack, this app allows users to securely register, log in, and manage their finances with interactive visualizations.

## 🚀 Live Demo
👉 **[Click here to view the live website!](https://expense-tracker-dimpal.vercel.app)** *(Replace this link with your new clean Vercel link!)*

## ✨ Features
- **User Authentication:** Secure Register and Login using JWT (JSON Web Tokens) and bcrypt.
- **Expense Management:** Add, view, and delete income and expense transactions.
- **Real-time Calculations:** Automatically calculates your total balance, total income, and total expenses.
- **Visualizations:** Dynamic Pie Chart (using Recharts) to show expenses broken down by category.
- **Responsive Design:** Clean, modern UI that works on desktop and mobile.
- **Cloud Database:** Data is securely stored in MongoDB Atlas.
- **Live Deployment:** Frontend hosted on Vercel, Backend hosted on Render.

## 🛠️ Tech Stack
**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Recharts
- Custom CSS

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs

## 📸 Screenshots
<img width="987" height="972" alt="Screenshot 2026-11-07 001244" src="https://github.com/user-attachments/assets/1928df95-fe06-4cf3-9a38-8d77cc667c46" />


## ⚙️ How to Run Locally
1. Clone the repository: `git clone https://github.com/Dimpal-Sharma231/expense-tracker.git`
2. **Backend Setup:**
   - `cd backend`
   - `npm install`
   - Create a `.env` file and add `MONGO_URI` and `JWT_SECRET`
   - `node server.js`
3. **Frontend Setup:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
