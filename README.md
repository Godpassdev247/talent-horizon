# Talent Horizon - Enterprise Recruitment Platform

A full-stack enterprise recruitment platform with React frontend and Django backend, featuring real-time messaging, file sharing, and comprehensive job management capabilities.

## 📁 Project Structure

```
talent-horizon/
├── frontend/          # React 18 + TypeScript + Tailwind CSS + tRPC
│   ├── client/        # React client application
│   ├── server/        # Express server with tRPC API
│   └── drizzle/       # Database schema and migrations
├── backend/           # Django 5 + Django REST Framework
│   ├── admin_panel/   # Custom admin dashboard
│   └── talent_horizon/# Main Django app
├── docs/              # Documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and pnpm
- Python 3.13+
- SQLite (default) or PostgreSQL

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at: `http://localhost:4000` (or next available port)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Backend runs at: `http://localhost:8000`

### Admin Panel Access

- **Custom Admin Panel:** `http://localhost:8000/admin-panel/`
- **Django Admin:** `http://localhost:8000/admin/`
- **Test Credentials:** 
  - User: john@talenthorizon.com / password123
  - Admin: admin@talenthorizon.com / Admin123

## 🎨 Frontend Features

### User Dashboard
- **Home Page** - Hero section, job search, featured companies
- **Job Listings** - Search, filter, apply to jobs
- **Application Tracking** - Track application status, view feedback
- **Saved Jobs** - Save and manage favorite job listings
- **Profile Management** - Complete profile with resume and portfolio
- **Real-time Messaging** - WhatsApp/Telegram-style chat with file sharing
- **Financial Services** - Loan applications, credit card debt clearing, tax refunds
- **Calendar** - Interview scheduling and event management

### Messaging System
- **WhatsApp-style Chat Bubbles** - Sharp triangular tails with proper text fitting
- **File Attachments** - Upload and download with automatic image compression (20MB limit)
- **Modal Viewer** - View images, videos, and PDFs directly in the app
- **Unread Count** - Shows number of conversations with unread messages
- **Mark as Read** - Automatically marks messages as read when viewing
- **Real-time Updates** - WebSocket support for instant message delivery
- **Friendly Previews** - Shows "📷 Photo" or "📎 File" instead of raw JSON

### Responsive Design
- **Mobile-first Layout** - Optimized for all screen sizes
- **Bottom Tab Navigation** - Mobile-friendly navigation (Applications, Financial, Messages)
- **No Horizontal Scrolling** - Proper viewport constraints
- **Tablet Support** - Responsive layout for tablets and larger screens

## ⚙️ Backend Features

- **Custom Admin Panel** - Professional admin dashboard matching frontend design
- **REST API** - Full CRUD operations for all resources
- **tRPC API** - Type-safe API client for frontend
- **JWT Authentication** - Secure user authentication with token-based sessions
- **User Management** - Applicants, employers, admins
- **Job Management** - Create, publish, close jobs
- **Application Tracking** - Review, approve, reject applications
- **Messaging System** - Real-time messaging with file attachments
- **Financial Services** - Loan processing, withdrawals
- **File Management** - Secure file upload/download with compression

## 📚 API Documentation

### Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login (returns JWT token) |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/logout` | POST | User logout |

### tRPC Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trpc/messages.getAll` | GET | Get all conversations |
| `/api/trpc/messages.getThreads` | GET | Get messages for a conversation |
| `/api/trpc/messages.send` | POST | Send a message |
| `/api/trpc/messages.markAsRead` | POST | Mark message as read |

### Django REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs/` | GET | List all jobs |
| `/api/jobs/<id>/` | GET | Job details |
| `/api/applications/` | GET/POST | User applications |
| `/api/companies/` | GET | List companies |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Wouter** - Routing
- **tRPC** - Type-safe API client
- **Framer Motion** - Animations
- **Vite** - Build tool
- **Express** - Backend server

### Backend
- **Django 5** - Web framework
- **Django REST Framework** - REST API
- **JWT Authentication** - Secure authentication
- **SQLite / PostgreSQL** - Database
- **Django Jazzmin** - Admin theme
- **Drizzle ORM** - Database ORM (frontend)

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication:

1. **Login** - User provides email and password
2. **Token Generation** - Server generates JWT token valid for 7 days
3. **Token Storage** - Token stored in localStorage as `frontendToken`
4. **API Requests** - Token sent in Authorization header: `Bearer <token>`
5. **Token Refresh** - Automatic token refresh on re-authentication

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
JWT_SECRET=your-secret-key-change-in-production
```

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
JWT_SECRET=your-secret-key-change-in-production
```

## 🎯 Key Features Implementation

### Messaging System
- Messages stored with sender/recipient IDs and timestamps
- File attachments embedded in message content using `__ATTACHMENTS__[...]__ATTACHMENTS_END__` format
- File type detection using `__FILETYPE:image__` prefix
- Automatic image compression to 800px width at 70% quality
- Read status tracked per message
- Unread count calculated as number of conversations with unread messages

### File Handling
- Maximum file size: 20MB
- Image compression: 800px width at 70% quality
- Supported formats: Images (JPG, PNG, GIF), Videos (MP4, WebM), PDFs
- Modal viewer for direct preview without opening new tabs

### Responsive Design
- Breakpoints: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- Sidebar collapses on mobile with hamburger menu
- Bottom tab navigation on mobile devices
- Proper viewport constraints to prevent horizontal scrolling

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
pnpm build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
python manage.py collectstatic
# Deploy using gunicorn or similar WSGI server
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 👥 Support

For questions or issues, please open a GitHub issue or contact support@talenthorizon.com

## 🔄 Recent Updates

### Version 1.1.0 - Messaging System Complete
- ✅ WhatsApp-style messaging UI with file attachments
- ✅ Real-time message delivery with WebSocket support
- ✅ Unread message count system
- ✅ File compression and modal viewer
- ✅ Responsive mobile/tablet layout
- ✅ Mark as read functionality
- ✅ JWT authentication system

### Version 1.0.0 - Initial Release
- ✅ User authentication and profiles
- ✅ Job listings and applications
- ✅ Admin dashboard
- ✅ Financial services
- ✅ Calendar and events
