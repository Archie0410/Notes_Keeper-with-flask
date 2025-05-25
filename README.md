# 📝 Notes Keeper App

A full-stack web application built with **React** and **Flask** to manage your personal notes — securely, efficiently, and beautifully.

<div align="center">
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Flask-Backend-black?style=flat-square&logo=flask" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Secure%20Auth-orange?style=flat-square" />
</div>

## 🔍 Features
- 🔐 JWT-based authentication (Login/Register)
- 🧠 Create, delete, and view personal notes
- ☁️ Data stored securely in MongoDB
- ⚛️ Polished React frontend with dynamic updates
- 🌐 Flask API with RESTful routes
- 💬 Error feedback and loading spinners included

## ⚙️ Tech Stack
| Layer      | Technologies                         |
|------------|--------------------------------------|
| Frontend   | React, CSS                           |
| Backend    | Flask, Flask-PyMongo, JWT            |
| Database   | MongoDB Atlas                        |
| Deployment | Netlify (Frontend), Render (Backend) |

## 📁 Folder Structure
Notes_Keeper-main/
├── backend/
│   ├── app.py            # Flask entry point
│   ├── auth.py           # Authentication logic
│   ├── requirements.txt  # Backend dependencies
│   └── .env              # Environment variables
└── src/
    ├── App.js            # Main React component
    ├── Login.js          # Login form
    ├── Register.js       # Registration form
    ├── CreateArea.js     # Note creation
    ├── Note.js           # Note display card
    ├── styles1.css       # Custom styles
    └── index.js          # React entry point

## 🛠️ Local Setup

### Backend (Flask)
cd backend  
python -m venv venv  
# Activate the virtual environment  
# On Windows:  
venv\Scripts\activate  
# On macOS/Linux:  
source venv/bin/activate  

pip install -r requirements.txt  

Create a `.env` file inside `backend/`:
MONGO_URI=your_mongo_uri  
JWT_SECRET_KEY=your_secret_key  
FRONTEND_URL=https://your-netlify-site.netlify.app  

Then start the server:
python app.py

### Frontend (React)
cd src  
npm install  
npm start  

To build for production:  
npm run build

## 📐 Design Choices
- Modularized backend using Flask Blueprints  
- Stateless authentication using JWT tokens  
- Clear and reusable React component structure  
- CORS configured for seamless frontend-backend communication

## 🧩 Challenges & Solutions
- **CORS issues**: Solved with Flask-CORS  
- **Token handling on frontend**: Added proper storage and feedback  
- **Sensitive data**: Managed with `.env` and environment variables

## 🔧 Possible Improvements
- ✏️ Add note editing (PUT route + UI)  
- 🏷️ Add categories/tags  
- 🌙 Add dark mode toggle  
- 🔍 Add search/filter for notes

---

> Made with ❤️ using React, Flask, and MongoDB.
