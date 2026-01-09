# Setup Guide

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd talent-horizon-full
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional - already seeded)
python manage.py createsuperuser

# Seed sample data (optional)
python seed_data.py

# Start development server
python manage.py runserver 8000
```

The backend will be available at `http://localhost:8000`

## Production Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
pnpm build
```

2. Deploy the `dist` folder to your hosting provider

### Backend (Railway/Render/Heroku)

1. Set environment variables:
   - `DEBUG=False`
   - `SECRET_KEY=<secure-random-key>`
   - `DATABASE_URL=<postgresql-url>`
   - `ALLOWED_HOSTS=your-domain.com`

2. Run migrations:
```bash
python manage.py migrate
```

3. Collect static files:
```bash
python manage.py collectstatic
```

## Connecting Frontend to Backend

Update the API base URL in the frontend:

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'http://localhost:8000/api';
```

For production, use environment variables:
```env
VITE_API_URL=https://your-backend-domain.com/api
```
