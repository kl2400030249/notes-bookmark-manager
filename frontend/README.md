# Notes & Bookmark Manager - Frontend

A modern, responsive web application built with Next.js and Tailwind CSS for managing personal notes and bookmarks.

## Features

- ✅ User authentication (login/register)
- ✅ Create, read, update, delete notes
- ✅ Create, read, update, delete bookmarks
- ✅ Search functionality for both notes and bookmarks
- ✅ Filter by tags
- ✅ Mark items as favorites
- ✅ Responsive design for all devices
- ✅ Clean and modern UI with Tailwind CSS
- ✅ Auto-fetch bookmark titles from URLs

## Tech Stack

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** React Icons
- **State Management:** React Context API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure `.env.local` file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

The application will be running at `http://localhost:3000`

## Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
frontend/
├── pages/
│   ├── _app.js          # App wrapper with global providers
│   ├── index.js         # Home/landing page
│   ├── login.js         # Login page
│   ├── register.js      # Registration page
│   ├── notes.js         # Notes management page
│   └── bookmarks.js     # Bookmarks management page
├── components/
│   ├── Layout.js        # Main layout wrapper
│   └── Navbar.js        # Navigation bar
├── context/
│   └── AuthContext.js   # Authentication context provider
├── utils/
│   └── api.js           # API utility with axios
├── styles/
│   └── globals.css      # Global styles with Tailwind
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Pages Overview

### Home (`/`)
- Landing page with feature highlights
- Links to login/register
- Redirects authenticated users to notes page

### Login (`/login`)
- User login form
- Email and password validation
- Redirects to notes page on success

### Register (`/register`)
- New user registration form
- Username, email, and password fields
- Password confirmation
- Redirects to notes page on success

### Notes (`/notes`)
- View all notes in a card grid
- Create new notes with modal form
- Edit existing notes
- Delete notes with confirmation
- Search notes by content
- Filter by tags
- Mark/unmark favorites
- Requires authentication

### Bookmarks (`/bookmarks`)
- View all bookmarks in a card grid
- Create new bookmarks with modal form
- Edit existing bookmarks
- Delete bookmarks with confirmation
- Search bookmarks by title, URL, or description
- Filter by tags
- Mark/unmark favorites
- Click to open URLs in new tab
- Auto-fetch title feature
- Requires authentication

## Features in Detail

### Authentication

The app uses JWT-based authentication with tokens stored in localStorage. The `AuthContext` provides:
- `user` - Current user object
- `login(email, password)` - Login function
- `register(username, email, password)` - Registration function
- `logout()` - Logout function
- `isAuthenticated` - Boolean authentication status

### API Integration

All API calls are handled through the `utils/api.js` module which:
- Automatically attaches JWT tokens to requests
- Handles 401 responses by redirecting to login
- Provides organized API methods for auth, notes, and bookmarks

### Search and Filtering

Both notes and bookmarks support:
- **Text search:** Searches through titles, content/descriptions, and URLs
- **Tag filtering:** Filter items by comma-separated tags
- **Real-time updates:** Search results update as you type

### Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Responsive navigation bar
- Grid layouts that adapt to screen size
- Touch-friendly buttons and interactions

## Styling

### Tailwind CSS Classes

Custom utility classes defined in `globals.css`:

- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-danger` - Destructive action button
- `.input-field` - Form input styling
- `.card` - Card container styling
- `.tag` - Tag badge styling

### Color Scheme

Primary color: Blue (customizable in `tailwind.config.js`)
- `primary-50` to `primary-900` variants
- Consistent color usage across components

## Usage Guide

### Creating a Note

1. Click "New Note" button
2. Fill in title (required)
3. Fill in content (required)
4. Add tags (optional, comma-separated)
5. Check "Mark as favorite" if desired
6. Click "Create"

### Creating a Bookmark

1. Click "New Bookmark" button
2. Fill in URL (required, must be valid HTTP/HTTPS URL)
3. Fill in title (optional - will auto-fetch if empty)
4. Fill in description (optional)
5. Add tags (optional, comma-separated)
6. Check "Mark as favorite" if desired
7. Click "Create"

### Searching and Filtering

- Use the search bar to search by text
- Use the tag filter to filter by specific tags
- Both can be used together
- Clear inputs to show all items

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

The production build will be optimized and served on port 3000 by default.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML elements
- Proper form labels
- Keyboard navigation support
- ARIA attributes where needed
- Focus states on interactive elements

## Performance Optimizations

- Next.js automatic code splitting
- Lazy loading of pages
- Optimized production builds
- Minimal bundle size with tree shaking

## Known Limitations

- File uploads not supported
- Rich text editing not available
- No offline support
- Browser localStorage used for auth (consider httpOnly cookies for production)

## Future Enhancements

Potential improvements:
- Rich text editor for notes
- Bookmark categories/folders
- Export notes/bookmarks
- Import from browser bookmarks
- Sharing and collaboration features
- Dark mode support
- Mobile app (React Native)

## Troubleshooting

### "Network Error" when making API calls
- Ensure backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings on backend

### Styles not loading
- Clear `.next` cache: `rm -rf .next`
- Restart dev server

### Authentication not persisting
- Check browser localStorage
- Ensure cookies are enabled
- Verify JWT token is being sent in requests

## License

ISC
