# Talent Horizon API Documentation

## Overview

The Talent Horizon API is a RESTful API built with Django REST Framework. It provides endpoints for job listings, company management, user authentication, applications, and financial services.

**Base URL:** `http://localhost:8000/api`

**Authentication:** JWT (JSON Web Token) Bearer authentication

---

## Authentication

### Register User

**POST** `/auth/register/`

Creates a new user account and returns authentication tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "applicant"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "role": "applicant"
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

### Login

**POST** `/auth/login/`

Authenticates a user and returns tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Same as register

### Get Current User

**GET** `/auth/me/`

Returns the authenticated user's profile.

**Headers:** `Authorization: Bearer <access_token>`

### Update Profile

**PATCH** `/auth/me/`

Updates the authenticated user's profile.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "first_name": "John",
  "headline": "Senior Software Engineer",
  "bio": "Experienced developer...",
  "location": "San Francisco, CA"
}
```

### Refresh Token

**POST** `/auth/token/refresh/`

Refreshes an expired access token.

**Request Body:**
```json
{
  "refresh": "eyJ..."
}
```

### Logout

**POST** `/auth/logout/`

Blacklists the refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refresh": "eyJ..."
}
```

---

## Jobs

### List Jobs

**GET** `/jobs/`

Returns a paginated list of published jobs.

**Query Parameters:**
- `search` - Search in title, description, company name
- `location` - Filter by location
- `job_type` - Filter by job type (full_time, part_time, contract, etc.)
- `experience_level` - Filter by experience level (entry, mid, senior, executive)
- `is_remote` - Filter remote jobs (true/false)
- `company` - Filter by company ID
- `ordering` - Sort by field (-created_at, salary_min, etc.)
- `page` - Page number
- `page_size` - Items per page (default: 20)

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "slug": "senior-software-engineer-techventures",
      "company": {
        "id": 1,
        "name": "TechVentures Inc.",
        "slug": "techventures-inc",
        "logo": null,
        "industry": "Technology",
        "company_size": "1001-5000",
        "headquarters": "San Francisco, CA",
        "is_verified": true,
        "is_featured": true,
        "jobs_count": 2
      },
      "job_type": "full_time",
      "experience_level": "senior",
      "location": "San Francisco, CA",
      "is_remote": true,
      "salary_range": "$150,000 - $200,000",
      "skills": ["Python", "JavaScript", "AWS"],
      "is_featured": true,
      "is_urgent": false,
      "views_count": 0,
      "applications_count": 0,
      "application_deadline": null,
      "created_at": "2026-01-07T21:23:33.233321Z"
    }
  ]
}
```

### Get Job Details

**GET** `/jobs/{slug}/`

Returns detailed information about a specific job.

**Response includes additional fields:**
- `description` - Full job description
- `requirements` - Job requirements
- `responsibilities` - Job responsibilities
- `benefits` - Job benefits
- `posted_by` - User who posted the job

### Create Job (Employer only)

**POST** `/jobs/`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Software Engineer",
  "company": 1,
  "description": "Job description...",
  "requirements": "Requirements...",
  "job_type": "full_time",
  "experience_level": "mid",
  "location": "New York, NY",
  "is_remote": true,
  "salary_min": 100000,
  "salary_max": 150000,
  "skills": ["Python", "Django"]
}
```

---

## Companies

### List Companies

**GET** `/companies/`

Returns a paginated list of companies.

**Query Parameters:**
- `search` - Search by name, description
- `industry` - Filter by industry
- `is_verified` - Filter verified companies
- `is_featured` - Filter featured companies

### Get Company Details

**GET** `/companies/{slug}/`

Returns detailed company information.

### Get Company Jobs

**GET** `/companies/{slug}/jobs/`

Returns all published jobs for a specific company.

---

## Applications

### List My Applications

**GET** `/applications/`

Returns the authenticated user's job applications.

**Headers:** `Authorization: Bearer <access_token>`

### Apply for Job

**POST** `/applications/`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "job": 1,
  "cover_letter": "I am excited to apply...",
  "resume": 1,
  "expected_salary": 150000,
  "availability_date": "2026-02-01"
}
```

### Get Application Details

**GET** `/applications/{id}/`

### Withdraw Application

**POST** `/applications/{id}/withdraw/`

---

## Saved Jobs

### List Saved Jobs

**GET** `/saved-jobs/`

**Headers:** `Authorization: Bearer <access_token>`

### Save Job

**POST** `/saved-jobs/`

**Request Body:**
```json
{
  "job_id": 1
}
```

### Unsave Job

**DELETE** `/saved-jobs/unsave/`

**Request Body:**
```json
{
  "job_id": 1
}
```

---

## Resumes

### List Resumes

**GET** `/resumes/`

**Headers:** `Authorization: Bearer <access_token>`

### Upload Resume

**POST** `/resumes/`

**Headers:** `Authorization: Bearer <access_token>`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` - Resume title
- `file` - PDF file
- `is_primary` - Set as primary resume (boolean)

### Delete Resume

**DELETE** `/resumes/{id}/`

### Set Primary Resume

**POST** `/resumes/{id}/set_primary/`

---

## Profile Management

### Experience

**GET** `/experiences/` - List experiences
**POST** `/experiences/` - Add experience
**PATCH** `/experiences/{id}/` - Update experience
**DELETE** `/experiences/{id}/` - Delete experience

### Education

**GET** `/educations/` - List education
**POST** `/educations/` - Add education
**PATCH** `/educations/{id}/` - Update education
**DELETE** `/educations/{id}/` - Delete education

### Skills

**GET** `/skills/` - List skills
**POST** `/skills/` - Add skill
**DELETE** `/skills/{id}/` - Delete skill

### Certifications

**GET** `/certifications/` - List certifications
**POST** `/certifications/` - Add certification
**PATCH** `/certifications/{id}/` - Update certification
**DELETE** `/certifications/{id}/` - Delete certification

---

## Financial Services

### Loan Applications

**GET** `/loans/` - List user's loan applications
**POST** `/loans/` - Create loan application
**GET** `/loans/{id}/` - Get loan details

**Loan Application Fields:**
```json
{
  "loan_type": "personal",
  "amount_requested": 50000,
  "purpose": "Debt consolidation",
  "employment_status": "employed",
  "annual_income": 120000,
  "credit_score_range": "excellent"
}
```

### Credit Card Debt Applications

**GET** `/credit-card-debt/` - List applications
**POST** `/credit-card-debt/` - Create application

### Tax Refund Applications

**GET** `/tax-refunds/` - List applications
**POST** `/tax-refunds/` - Create application

### Withdrawals

**GET** `/withdrawals/` - List withdrawals
**POST** `/withdrawals/` - Request withdrawal

---

## Messages

### List Messages

**GET** `/messages/`

**Headers:** `Authorization: Bearer <access_token>`

### Send Message

**POST** `/messages/`

**Request Body:**
```json
{
  "recipient": 2,
  "subject": "Regarding your application",
  "content": "Message content..."
}
```

### Mark as Read

**POST** `/messages/{id}/read/`

---

## Dashboard Statistics

**GET** `/dashboard/stats/`

Returns aggregated statistics for the authenticated user.

**Response:**
```json
{
  "applications_count": 10,
  "saved_jobs_count": 25,
  "resumes_count": 2,
  "unread_messages": 3,
  "pending_loans": 1,
  "approved_loans": 2,
  "recent_applications": [...],
  "application_status": {
    "submitted": 5,
    "under_review": 3,
    "interview": 1,
    "offered": 0,
    "hired": 0,
    "rejected": 1
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to:
- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour

---

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://*.manus.computer`

---

## Admin Panel

Access the Django admin panel at: `/admin/`

**Default Admin Credentials:**
- Email: admin@talenthorizon.com
- Password: Admin123
