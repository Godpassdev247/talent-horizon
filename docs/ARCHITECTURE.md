# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 3000)              │    │
│  │  • Pages: Home, Jobs, Dashboard, Companies, etc.     │    │
│  │  • Components: shadcn/ui, custom components          │    │
│  │  • State: React hooks, tRPC queries                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Django REST Framework (Port 8000)          │    │
│  │  • Authentication: JWT tokens                        │    │
│  │  • Endpoints: /api/auth/, /api/jobs/, etc.          │    │
│  │  • Serializers: JSON request/response handling       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Layer                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Django Models                        │    │
│  │  • User (custom with roles)                          │    │
│  │  • Job, Company, Application                         │    │
│  │  • LoanApplication, Withdrawal, etc.                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           SQLite (Dev) / PostgreSQL (Prod)           │    │
│  │  • Users, Jobs, Companies                            │    │
│  │  • Applications, Resumes                             │    │
│  │  • Financial records                                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
frontend/
├── client/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Jobs.tsx
│   │   │   └── ...
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── ...
│   │   ├── lib/             # Utilities
│   │   │   ├── api.ts       # API client
│   │   │   ├── trpc.ts      # tRPC setup
│   │   │   └── utils.ts
│   │   ├── hooks/           # Custom hooks
│   │   ├── contexts/        # React contexts
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── index.html
├── server/                  # tRPC server (optional)
└── shared/                  # Shared types
```

## Backend Architecture

```
backend/
├── talent_horizon/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                    # Core app (User model)
│   ├── models.py
│   ├── admin.py
│   └── ...
├── jobs/                    # Jobs app
│   ├── models.py            # Job, Company, Application
│   ├── admin.py
│   └── ...
├── financial/               # Financial services
│   ├── models.py            # Loan, Withdrawal, etc.
│   └── ...
├── api/                     # REST API
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── admin_panel/             # Custom admin panel
│   ├── views.py
│   ├── urls.py
│   └── templates/
└── manage.py
```

## Data Models

### User Model
- email (unique)
- name
- role (applicant, employer, admin)
- phone, location, bio
- is_active, is_staff

### Job Model
- title, description
- company (FK)
- location, job_type
- salary_min, salary_max
- requirements, benefits
- status (draft, published, closed)

### Application Model
- user (FK)
- job (FK)
- status (pending, review, interview, rejected, accepted)
- cover_letter
- resume (FK)

### Financial Models
- LoanApplication
- CreditCardDebt
- TaxRefund
- Withdrawal
