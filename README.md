Personal Notes & Bookmark Manager

A full-stack web application that allows users to create, organize, search, and manage personal notes and bookmarks. This project was developed as part of a technical assignment to demonstrate practical skills in REST API design, frontend development, authentication, validation, and clean code structure.

Project Objective

The objective of this project is to build a personal notes and bookmark manager where users can:

• Save and search notes using tags
• Save bookmarks with URLs and optional titles
• Filter and search items efficiently
• Securely access only their own data

The application follows real-world development practices and satisfies all mandatory and bonus requirements provided in the assignment.

TECH STACK

Backend

• Node.js
• Express.js
• MongoDB (Mongoose ODM)
• JWT for authentication
• bcrypt for password hashing
• express-validator for input validation
• Axios and Cheerio for metadata fetching

Frontend

• Next.js (React)
• JavaScript
• Tailwind CSS
• Axios
• React Icons

FEATURES

Core Features

• Create, read, update, and delete notes
• Create, read, update, and delete bookmarks
• Tag-based organization for notes and bookmarks
• Search functionality using text and tags
• Responsive user interface using Tailwind CSS
• Proper validation and error handling

Bonus Features

• User authentication using JWT
• User-specific data access
• Ability to mark notes and bookmarks as favorites
• Automatic fetching of bookmark titles when not provided

Project Structure

The project is divided into two main parts:

Backend: REST API, authentication, database models, validation, and business logic
Frontend: User interface, routing, state management, and API integration

This separation ensures a clean and scalable architecture.

Backend API Overview

All backend routes are prefixed with /api.

Notes API

• POST /api/notes – Create a new note
• GET /api/notes – Retrieve notes (supports search and tag filtering)
• GET /api/notes/:id – Retrieve a specific note
• PUT /api/notes/:id – Update a note
• DELETE /api/notes/:id – Delete a note

Bookmarks API

• POST `/api/bookmarks` – Create a new bookmark
• GET `/api/bookmarks` – Retrieve bookmarks (supports search and tag filtering)
• GET `/api/bookmarks/:id` – Retrieve a specific bookmark
• PUT `/api/bookmarks/:id` – Update a bookmark
• DELETE `/api/bookmarks/:id` – Delete a bookmark

If the bookmark title is not provided, the backend automatically fetches the page title from the URL.

Authentication and Security

• User registration and login implemented using JWT
• Passwords securely hashed with bcrypt
• Protected API routes
• Each user can access only their own notes and bookmarks
• Input validation and sanitization
• Proper HTTP status codes and error messages

Setup Instructions

Prerequisites

* Node.js (v14 or higher)
* MongoDB (local or MongoDB Atlas)
* npm or yarn

Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

Frontend Setup

bash
cd frontend
npm install
cp .env.example .env.local
npm run dev


Frontend runs on `http://localhost:3000`.

Sample API Request

bash
curl -X POST http://localhost:5000/api/notes \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "title": "Meeting Notes",
  "content": "Discussion points from the meeting",
  "tags": ["work", "meeting"]
}
Assignment Coverage Summary

This project fulfills all required and bonus criteria of the assignment, including:

• Complete CRUD functionality
• Search and tag-based filtering
• Validation and error handling
• Responsive frontend design
• JWT-based authentication and user-specific data
• Automatic metadata fetching for bookmarks

License

ISC License

Author

Built as part of a full-stack development assignment to demonstrate real-world backend and frontend skills.

