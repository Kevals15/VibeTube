# 📺 VibeTube

![GitHub repo size](https://img.shields.io/github/repo-size/Kevals15/VibeTube?color=blue&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Kevals15/VibeTube?color=green&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Kevals15/VibeTube?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Kevals15/VibeTube?style=flat-square)

🎬 **VibeTube** is a **YouTube-like fullstack video sharing platform** where users can upload, view, like, comment, and subscribe to channels. Built with modern technologies for scalable performance and clean architecture.

<div align="center">

<img src="https://www.google.com/search?client=ms-android-oppo-terr1-rso2&sca_esv=f5575a8f6c80a422&sxsrf=AE3TifPSSuWmK_fZdB0bqANnaokXf4YS6w:1751354740586&q=animated+node+js+gif&uds=AOm0WdE2fekQnsyfYEw8JPYozOKzfM-MTDjb3m6SxNG8a6J89w1ggM5WhLTYWacEuv-afiF4uN3wCM74hkOEVEtzHMU6o_Rm2EASSHn2GUDAEqU1Qp2TdIqtIGDKtM99cdBWzdsxfiKGKvUrwsAYOyLYJ7gUYTu-Fg&udm=2&sa=X&ved=2ahUKEwi21cDpkJuOAxXkcWwGHV3UEgYQxKsJKAB6BAgHEAE&ictx=0&biw=360&bih=708&dpr=3#sv=CAMSggUa4gQKkgIKuQEStgEKd0FMa3RfdkdOTG9SVGV2SnBaNDBkWXVScE8yVXRRbDJ6UDZGVURTNFZRTzlKVnNTTUFuc296VmVtRUNoTFRfM2l1VmFrLW1WdzFKQl9mT2RTZHpLaE1HZzhkbEVZdUhwSHdwOVRVZmgyX3V2VGhndUN4R2VMbUhBEhdmWTFqYUxlMUZjVzhzZU1QbTQyYzBRURoiQUZNQUdHckdmMFJITk5yRjVNMXJpa3BRNW9EeGV3NDY0URIDODQ5GgEzIhkKAXESFGFuaW1hdGVkIG5vZGUganMgZ2lmIgcKA3RicxIAIigKBGVxbGQSIENnSUlBQkFBT2dRSUFSQUFWZE8zR2o1Z0FXM1BNUzRfErgCCs8BEswBCowBQUxrdF92RUJ6bXM0eXF5YmF4dGVVcTd5QmI4eWlYZjBBalhHSW1DeUxVME9xOERwMm1wa3QtdWJXYThqUHdUbUZyd1F4Rkdnd194a2h1LTBsR3hvTlpTeklaWDNZd3JfZE5KS0p6LTY3UDNBRTJTY1hmNGk1OFBQX0RKYnAwTm1zUlVhZTEyakFoNEoSF2ZZMWphTGUxRmNXOHNlTVBtNDJjMFFRGiJBRk1BR0dvRVcyWkJCRGRQNVZBRURmRm9ERWpFaHJFemN3EgQ0Njk4GgEzIhgKBmltZ2RpaRIORDdlZlp1UUFqb2Y3Vk0iFwoFZG9jaWQSDnBjTnhNMkZwLURkTXJNIigKBGVxbGQSIENnSUlBQkFBT2dRSUFSQUFWZE8zR2o1Z0FXM1BNUzRfKhBlLUQ3ZWZadVFBam9mN1ZNIAQqFwoBcxIQZS1EN2VmWnVRQWpvZjdWTRgBMAEYByDe4PDjBzABQAI" />
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