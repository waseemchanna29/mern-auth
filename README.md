# MERN Authentication

This is a **MERN Stack Authentication** project with a **React.js frontend** and an **Express.js backend**. It provides user authentication using JWT and integrates email services for verification.

## 📁 Project Structure
```
/mern-auth
│── /client   # React.js frontend
│── /server   # Express.js backend
│── README.md # Project documentation
```

## 🚀 Setup Instructions

### 🔧 Backend Setup (Express.js)
1. Navigate to the backend folder:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGODB_URI='XXXXX'
   JWT_SECRET='XXXX'
   MODE_ENV='development'

   MAIL_HOST='XXXXX'
   MAIL_USERNAME='XXXX'
   MAIL_PASSWORD='XXXX'
   MAIL_ENCRYPTION='tls'
   MAIL_FROM_ADDRESS='example@example.com'
   MAIL_FROM_NAME="Waseem"
   ```
4. Start the backend server:
   ```sh
   npm run server
   ```

### 🎨 Frontend Setup (React.js)
1. Navigate to the frontend folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `client` directory with the following variable:
   ```env
   VITE_API_URL='http://localhost:4000'
   ```
4. Start the frontend development server:
   ```sh
   npm run dev
   ```

## 🛠 Features
- User authentication using JWT (JSON Web Token)
- Secure password hashing
- Email verification setup using SMTP
- React.js with Vite for fast performance
- MongoDB as the database

## 📜 License
This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

