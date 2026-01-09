# Contributing to Talent Horizon

Thank you for your interest in contributing to Talent Horizon! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions with other contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/talent-horizon.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit with clear messages: `git commit -m "feat: description of your changes"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Commit Message Guidelines

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat: add real-time message notifications`

## Pull Request Process

1. Update README.md with any new features or changes
2. Add tests for new functionality
3. Ensure all tests pass: `pnpm test` (frontend) or `python manage.py test` (backend)
4. Update documentation as needed
5. Request review from maintainers

## Code Style

### Frontend
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Format code with Prettier: `pnpm format`

### Backend
- Follow PEP 8 style guide
- Use type hints in Python 3.10+
- Write docstrings for functions and classes
- Use Black for code formatting

## Testing

### Frontend
```bash
cd frontend
pnpm test
```

### Backend
```bash
cd backend
python manage.py test
```

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, Python version, etc.)

## Feature Requests

For feature requests, please:
1. Check if the feature already exists or has been requested
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Include any relevant mockups or examples

## Questions?

Feel free to open an issue or contact the maintainers at support@talenthorizon.com

Thank you for contributing! 🎉
