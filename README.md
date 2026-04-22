# Food Donation Platform

A complete full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS. The platform connects food donors (like restaurants or individuals) with receivers (NGOs or people in need), aiming to reduce food waste.

## 📁 System Folder Structure

```text
Food Management New/
├── backend/                  # Node.js/Express Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   └── requestController.js
│   ├── middlewares/          # Custom middlewares
│   │   ├── authMiddleware.js # JWT Auth & Role checks
│   │   └── errorMiddleware.js
│   ├── models/               # Mongoose schemas
│   │   ├── Food.js
│   │   ├── Request.js
│   │   └── User.js
│   ├── routes/               # Express routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── food.js
│   │   └── request.js
│   ├── .env                  # Backend Environment variables
│   ├── package.json
│   └── server.js             # Backend entry point
│
└── frontend/                 # React Frontend (Vite)
    ├── public/
    ├── src/
    │   ├── components/       # Reusable components
    │   │   ├── FoodCard.jsx
    │   │   ├── Footer.jsx
    │   │   └── Navbar.jsx
    │   ├── context/          # React Context API
    │   │   └── AuthContext.jsx
    │   ├── pages/            # Application Pages
    │   │   ├── AddFood.jsx
    │   │   ├── AdminPanel.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── FoodListings.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyRequests.jsx
    │   │   └── Register.jsx
    │   ├── services/         # Axios API service
    │   │   └── api.js
    │   ├── App.jsx           # Main React component
    │   ├── index.css         # Tailwind configurations
    │   └── main.jsx
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Setup Instructions for Beginners

### Prerequisites
1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Install MongoDB locally or use a free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
3. **VS Code**: Recommended code editor.

### Step 1: Open Project in VS Code
Open the `Food Management New` folder in VS Code.

### Step 2: Setup & Run the Backend
1. Open a new terminal in VS Code (`Terminal` -> `New Terminal`).
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. (Optional but recommended) Ensure your `backend/.env` file is correct:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/food-donation
   JWT_SECRET=supersecretjwtsecret12345
   ```
4. Start the backend server:
   ```bash
   npm start
   # (or "node server.js" / "npx nodemon server.js")
   ```
   *You should see "MongoDB Connected..." and "Server running in development mode on port 5000".*

### Step 3: Setup & Run the Frontend
1. Open *another* new terminal in VS Code (Keep the backend running!).
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
4. Open the displayed Local link (usually `http://localhost:5173`) in your web browser.

## 🔗 API Integration Examples

The frontend uses an Axios instance (`frontend/src/services/api.js`) to talk to the backend. It automatically attaches the JWT token to every request if the user is logged in.

**Example 1: Calling the register API (in `Register.jsx`)**
```javascript
const { data } = await api.post('/auth/register', { 
  name: 'John Doe', 
  email: 'john@example.com', 
  password: 'password123', 
  role: 'donor' 
});
// Response contains user data and JWT token
```

**Example 2: Adding Food (Requires JWT Token) (in `AddFood.jsx`)**
```javascript
// api.js automatically adds: headers: { Authorization: "Bearer <token>" }
await api.post('/food/add', {
  foodName: 'Leftover Pizzas',
  quantity: 'Serves 5',
  location: '123 Main St, NY',
  expiryTime: '2026-12-31T23:59',
  description: 'Fresh from the party.'
});
```

**Example 3: Admin Deleting a User (Requires Admin JWT Token) (in `AdminPanel.jsx`)**
```javascript
await api.delete(`/admin/user/${userId}`);
```

## 🛠 Features Implemented
- **Roles**: Donor, Receiver, and Admin.
- **Secure Authentication**: Password hashing (bcrypt) and JWT based auth.
- **Context API State Management**: Seamlessly manages logged-in state across the UI.
- **Modern UI**: Fully responsive green-themed UI utilizing Tailwind CSS and React Toastify for notifications.
- **Error Handling**: Implemented custom Express middlewares to safely catch and display errors.
