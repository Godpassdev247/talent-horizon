# Talent Horizon - Django Backend

A comprehensive Django REST API backend for the Talent Horizon enterprise recruitment platform with a custom admin panel.

## Features

### Custom Admin Panel
- **User Management**: Full CRUD operations for users with role-based access (admin, employer, applicant)
- **Job Management**: Create, publish, close, and feature jobs with bulk actions
- **Application Tracking**: Review applications, schedule interviews, update statuses
- **Company Management**: Manage company profiles with verification and featuring
- **Financial Services**: Manage loan applications, withdrawals, credit card debt clearing, and tax refunds
- **Resume Management**: View and manage user resumes

### REST API Endpoints
- **Authentication**: JWT-based authentication with register, login, logout, and token refresh
- **Jobs**: Full CRUD with search, filter, and pagination
- **Applications**: Submit, track, and manage job applications
- **Companies**: Browse and search company profiles
- **Financial Services**: Loan applications, withdrawals, debt clearing, tax refunds
- **User Profile**: Experience, education, skills, certifications management
- **Messages**: In-app messaging system
- **Dashboard**: User statistics and analytics

## Tech Stack

- **Framework**: Django 5.2
- **API**: Django REST Framework 3.16
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Admin Theme**: Django Jazzmin
- **CORS**: django-cors-headers
- **Static Files**: WhiteNoise

## Installation

### Prerequisites
- Python 3.11+
- PostgreSQL (for production)

### Setup

1. Clone the repository:
```bash
cd talent-horizon-backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables (create `.env` file):
```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL for production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talent_horizon
DB_USER=postgres
DB_PASSWORD=your-password

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. (Optional) Load sample data:
```bash
python seed_data.py
```

8. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login and get tokens |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| GET | `/api/auth/me/` | Get current user profile |
| PATCH | `/api/auth/me/` | Update current user profile |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all published jobs |
| GET | `/api/jobs/{slug}/` | Get job details |
| POST | `/api/jobs/` | Create new job (employer) |
| PUT | `/api/jobs/{slug}/` | Update job (employer) |
| DELETE | `/api/jobs/{slug}/` | Delete job (employer) |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies/` | List all companies |
| GET | `/api/companies/{slug}/` | Get company details |
| GET | `/api/companies/{slug}/jobs/` | Get company's jobs |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/` | List user's applications |
| POST | `/api/applications/` | Submit application |
| GET | `/api/applications/{id}/` | Get application details |
| POST | `/api/applications/{id}/withdraw/` | Withdraw application |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes/` | List user's resumes |
| POST | `/api/resumes/` | Upload new resume |
| DELETE | `/api/resumes/{id}/` | Delete resume |
| POST | `/api/resumes/{id}/set_primary/` | Set as primary resume |

### Saved Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved-jobs/` | List saved jobs |
| POST | `/api/saved-jobs/` | Save a job |
| DELETE | `/api/saved-jobs/unsave/` | Unsave a job |

### Financial Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/loans/` | Loan applications |
| GET/POST | `/api/withdrawals/` | Loan withdrawals |
| GET/POST | `/api/credit-card-debt/` | Credit card debt clearing |
| GET/POST | `/api/tax-refunds/` | Tax refund filing |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats/` | Get user dashboard statistics |

## Admin Panel

Access the admin panel at `/admin/` with your superuser credentials.

### Admin Features:
- **Dashboard**: Overview of all platform statistics
- **Users**: Manage users with inline experience, education, skills
- **Jobs**: Publish/close jobs, feature jobs, bulk actions
- **Applications**: Review applications, schedule interviews
- **Companies**: Verify and feature companies
- **Financial**: Approve/reject loans, process withdrawals
- **Messages**: View all platform messages

### Default Admin Credentials (Development):
- Email: admin@talenthorizon.com
- Password: Admin123

## Project Structure

```
talent-horizon-backend/
├── api/                    # REST API app
│   ├── serializers.py      # API serializers
│   ├── views.py            # API views
│   └── urls.py             # API URL routing
├── core/                   # Core app (User model)
│   ├── models.py           # User, Experience, Education, Skill, Certification
│   └── admin.py            # User admin configuration
├── jobs/                   # Jobs app
│   ├── models.py           # Company, Job, Application, Resume, SavedJob, Message
│   └── admin.py            # Jobs admin configuration
├── financial/              # Financial services app
│   ├── models.py           # LoanApplication, Withdrawal, CreditCardDebt, TaxRefund
│   └── admin.py            # Financial admin configuration
├── talent_horizon/         # Project settings
│   ├── settings.py         # Django settings
│   └── urls.py             # Main URL configuration
├── requirements.txt        # Python dependencies
├── seed_data.py           # Sample data script
└── manage.py              # Django management script
```

## Deployment

### Production Checklist:
1. Set `DEBUG=False`
2. Configure PostgreSQL database
3. Set strong `DJANGO_SECRET_KEY`
4. Configure `ALLOWED_HOSTS`
5. Set up HTTPS
6. Configure CORS for your frontend domain
7. Run `python manage.py collectstatic`
8. Use gunicorn/uwsgi for production server

### Example Production Command:
```bash
gunicorn talent_horizon.wsgi:application --bind 0.0.0.0:8000
```

## Integration with React Frontend

The API is designed to work with the Talent Horizon React frontend. Configure the frontend to point to this backend:

```javascript
// In your React app's environment
VITE_API_URL=http://localhost:8000/api
```

## License

MIT License - See LICENSE file for details.
