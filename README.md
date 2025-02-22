# Taskify- A Task Management Application

## Short Description
A Task Management Application where users can add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into three sections: **To-Do**, **In Progress**, and **Done**. The application ensures real-time synchronization with a MongoDB database and provides a fully responsive user experience.

## Live Links
- **Frontend:**  https://taskify-68caf.web.app
- **Backend:** https://taskify-socket.onrender.com

## Dependencies
### Frontend
- React.js (Vite.js)
- Firebase Authentication
- React Router
- Tailwind CSS
- Drag-and-Drop Library (@hello-pangea/dnd)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- WebSockets 

## Installation Steps
### Frontend Setup
1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up a `.env` file with the necessary environment variables (MongoDB URI, Firebase credentials, etc.).
4. Start the backend server:
   ```sh
   npm start
   ```

## Technologies Used
- **Frontend:** React.js (Vite), Tailwind CSS, Firebase Authentication
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Others:** WebSockets, Drag-and-Drop Library


