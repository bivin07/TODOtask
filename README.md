# TODOO - Full Stack Todo Application

A modern Todo application built with React (frontend) and Express.js (backend) with MongoDB.

## Project Structure

```
TODOO/
├── client/          # React frontend application
├── server/          # Express.js backend API
└── README.md        # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5002
   MONGO_URI=mongodb://localhost:27017/todoapp
   ```
   
   **For MongoDB Atlas (cloud):**
   ```env
   PORT=5002
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
   ```

4. Start the server:
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:5002`

### 2. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   The client will run on `http://localhost:3000`

## Features

- ✅ Create, Read, Update, Delete todos
- ✅ Filter todos by status (All, Pending, In-Progress, Completed)
- ✅ Modern UI with Tailwind CSS
- ✅ Toast notifications
- ✅ Responsive design

## API Endpoints

- `POST /api/create-todo` - Create a new todo
- `GET /api/get-todo` - Get all todos
- `GET /api/get-by-id/:id` - Get a todo by ID
- `PUT /api/update-todo/:id` - Update a todo
- `DELETE /api/delete-todo/:id` - Delete a todo

## Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running locally, or
- Update the `MONGO_URI` in `.env` with your MongoDB Atlas connection string

### Port Already in Use
- Change the `PORT` in `server/.env` to a different port
- Update the API URLs in client files if you change the port

### CORS Errors
- Ensure the server is running before starting the client
- Check that the server port matches the client API calls (default: 5002)

