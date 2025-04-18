# MERN Task Manager App(DUTU)

A full-stack task management web application built with the **MERN** stack (MongoDB, Express.js, React.js, and Node.js). It allows users to securely register, log in, manage tasks, update profiles, and delete their accounts along with associated data.

## ✨ Features

- JWT-based authentication and protected routes
- Create, update, and delete user tasks
- Profile management with update and delete functionality
- Responsive UI built with React Bootstrap
- Secure API built using Express and MongoDB (Mongoose)

## 🛠 Tech Stack

- **Frontend**: React.js, React Bootstrap, Axios, React Icons
- **Backend**: Node.js, Express.js, Mongoose, bcrypt, JSON Web Tokens
- **Database**: MongoDB (with Mongoose ODM)
- **Tools**: dotenv, nodemon

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/SenthJeya/DUTU
   cd DUTU

2. Install server dependencies
	cd backend
	npm install
	
3. Set up .env file in backend folder
	PORT=5000
	MONGODB_URI=your_mongodb_connection_string
	JWT_SECRET=your_jwt_secret
	
4. Run the server
	npm start
	
5. Install client dependencies
	cd ../frontend
	npm install
	
6. Run the client
	npm run dev
	
🔐 Authentication

On login/register, a JWT token is generated and stored in localStorage.
All protected routes require the token in the Authorization header.

📁 Folder Structure
DUTU/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── auth/
│       ├── components/
│       ├── pages/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js





