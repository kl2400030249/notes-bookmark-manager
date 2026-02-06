# Notes & Bookmark Manager - Backend API

A robust REST API built with Node.js, Express, and MongoDB for managing personal notes and bookmarks.

## Features

- ✅ User authentication with JWT
- ✅ CRUD operations for notes and bookmarks
- ✅ Tag-based organization
- ✅ Full-text search functionality
- ✅ URL validation for bookmarks
- ✅ Auto-fetch bookmark metadata (title) from URLs
- ✅ Mark items as favorites
- ✅ Proper error handling and validation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Web Scraping:** Axios + Cheerio (for URL metadata)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/notes-bookmark-db
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas cloud database
   # Update MONGODB_URI with your Atlas connection string
   ```

6. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be running at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Notes Endpoints

**Note:** All note endpoints require authentication. Include the JWT token in the Authorization header.

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note",
  "tags": ["work", "important"],
  "isFavorite": false
}
```

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>

# With search query
GET /api/notes?q=search_term

# With tag filter
GET /api/notes?tags=work,personal

# Combined
GET /api/notes?q=meeting&tags=work
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["updated", "tag"],
  "isFavorite": true
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### Bookmarks Endpoints

**Note:** All bookmark endpoints require authentication.

#### Create Bookmark
```http
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "Example Site",
  "description": "An example website",
  "tags": ["reference", "web"],
  "isFavorite": false
}

# Auto-fetch title by leaving it empty
{
  "url": "https://example.com",
  "tags": ["reference"]
}
```

#### Get All Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer <token>

# With search query
GET /api/bookmarks?q=search_term

# With tag filter
GET /api/bookmarks?tags=tutorial,tech

# Combined
GET /api/bookmarks?q=react&tags=tutorial
```

#### Get Single Bookmark
```http
GET /api/bookmarks/:id
Authorization: Bearer <token>
```

#### Update Bookmark
```http
PUT /api/bookmarks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["updated"],
  "isFavorite": true
}
```

#### Delete Bookmark
```http
DELETE /api/bookmarks/:id
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model with password hashing
│   ├── Note.js          # Note model with text indexing
│   └── Bookmark.js      # Bookmark model with URL validation
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── notes.js         # Notes CRUD routes
│   └── bookmarks.js     # Bookmarks CRUD routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── utils/
│   └── urlMetadata.js   # URL metadata fetching utility
├── server.js            # Main application file
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Validation errors if applicable
}
```

## Sample cURL Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My Note","content":"Note content","tags":["work"]}'
```

### Create Bookmark
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"url":"https://example.com","tags":["reference"]}'
```

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for auto-reloading on file changes.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/notes-bookmark-db` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- CORS is configured to accept requests only from specified origins
- Input validation on all routes
- MongoDB injection protection through Mongoose

## Bonus Features Implemented

✅ **User Authentication:** Complete JWT-based authentication system  
✅ **Auto-fetch Bookmark Metadata:** Automatically fetches page title if not provided  
✅ **Favorites:** Mark notes and bookmarks as favorites  
✅ **Search & Filter:** Full-text search and tag-based filtering

## License

ISC
