# Talent Horizon - Enterprise Recruitment Platform

A full-stack enterprise recruitment platform with React frontend and Django backend.

## 📁 Project Structure

```
talent-horizon-full/
├── frontend/          # React 19 + TypeScript + Tailwind CSS
├── backend/           # Django 5 + Django REST Framework
├── docs/              # Documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.10+
- SQLite (default) or PostgreSQL

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at: `http://localhost:3000`

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
- **Credentials:** admin@talenthorizon.com / Admin123

## 🎨 Frontend Features

- **Home Page** - Hero section, job search, featured companies
- **Job Listings** - Search, filter, apply to jobs
- **User Dashboard** - Application tracking, saved jobs, profile management
- **Company Profiles** - Company details, open positions
- **Financial Services** - Loan applications, credit card debt clearing, tax refunds
- **Resources** - Career tips, resume builder, interview prep

## ⚙️ Backend Features

- **Custom Admin Panel** - Professional admin dashboard matching frontend design
- **REST API** - Full CRUD operations for all resources
- **JWT Authentication** - Secure user authentication
- **User Management** - Applicants, employers, admins
- **Job Management** - Create, publish, close jobs
- **Application Tracking** - Review, approve, reject applications
- **Financial Services** - Loan processing, withdrawals

## 📚 API Documentation

See `backend/API_DOCUMENTATION.md` for complete API reference.

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | User registration |
| `/api/auth/login/` | POST | User login |
| `/api/jobs/` | GET | List all jobs |
| `/api/jobs/<id>/` | GET | Job details |
| `/api/applications/` | GET/POST | User applications |
| `/api/companies/` | GET | List companies |

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Wouter (routing)
- tRPC (API client)
- Framer Motion (animations)

### Backend
- Django 5
- Django REST Framework
- JWT Authentication
- SQLite / PostgreSQL
- Django Jazzmin (admin theme)

## 🎯 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 👥 Support

For questions or issues, please open a GitHub issue or contact support@talenthorizon.com
