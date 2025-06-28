# 📺 VibeTube

![GitHub repo size](https://img.shields.io/github/repo-size/Kevals15/VibeTube?color=blue&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Kevals15/VibeTube?color=green&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Kevals15/VibeTube?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Kevals15/VibeTube?style=flat-square)

🎬 **VibeTube** is a **YouTube-like fullstack video sharing platform** where users can upload, view, like, comment, and subscribe to channels. Built with modern technologies for scalable performance and clean architecture.

<div align="center">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" />

</div>

---

## 🚀 **Features**

✅ User authentication (**JWT, bcrypt**)  
✅ Upload and stream videos  
✅ Like, comment, and subscribe to channels  
✅ View channel profiles with subscribers count  
✅ Responsive frontend similar to YouTube layout  
✅ MongoDB database integration  
✅ RESTful API design

---

## 📁 **Project Structure**

VibeTube/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
└── README.md


---

## ⚙️ **Installation**

### **1. Clone the repository**

```bash
git clone https://github.com/Kevals15/VibeTube.git
cd VibeTube


2. Setup Backend

cd backend
npm install

create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Run backend:

npm run dev

🌐 Usage
Open http://localhost:5173 for frontend.

Backend runs on http://localhost:5000.

Register, login, and start uploading or viewing videos like YouTube.

🛠️ Technologies Used
Backend: Node.js, Express.js, MongoDB, Mongoose

Frontend: React.js, Tailwind CSS, Redux

Others: JWT, bcrypt, Multer, dotenv

⭐ Give a Star
If you like this project, please give it a ⭐ to support future improvements!