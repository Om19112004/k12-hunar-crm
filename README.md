# K12 Hunar – EdTech CRM & Inquiry System

A full-stack inquiry management system that allows parents, students, and schools to submit inquiries and enables administrators to manage them through a secure dashboard.

## Features

- Public inquiry submission form.
- User types: Parent, Student, School.
- Categories: Scholarship, Concert, Admission, General Query.
- Secure admin login using JWT authentication.
- Password hashing using bcrypt.
- Admin dashboard to view and manage inquiries.
- Search by name or phone number.
- Filter by category and user type.
- Update inquiry status: New, In Progress, Resolved.

## Technology Stack

**Frontend:** React, Vite, React Router, Lucide React, CSS

**Backend:** Node.js, Express.js

**Database:** Supabase PostgreSQL

**Authentication:** JWT, bcrypt

## Project Structure

```text
k12-hunar-crm/
├── frontend/
├── backend/
├── schema.sql
├── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js and npm
- Git
- Supabase account

### 2. Database Setup

1. Create a Supabase project.
2. Open the SQL Editor.
3. Execute the contents of `schema.sql`.
4. Copy the PostgreSQL connection string.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder using `.env.example` as a reference.

Configure the database URL, JWT secret, admin email, admin password, and port.

Create the admin account:

```bash
node src/createAdmin.js
```

Start the backend:

```bash
npm run dev
```

Backend URL: `http://localhost:3000`

### 4. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### 5. Admin Login

Open `http://localhost:5173/admin/login` and use the admin credentials configured in the backend `.env` file.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/inquiries` | Submit inquiry |
| GET | `/api/inquiries` | Fetch inquiries (protected) |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/health/db` | Database health check |

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects admin routes.
- Authentication tokens use HTTP-only cookies.
- Database credentials and secrets are stored in environment variables.
- Never commit `.env` files to GitHub.

## Deployment

Configure production environment variables, frontend API URL, and backend CORS settings before deployment.

## License

Developed as part of the K12 Hunar Full-Stack Developer Intern technical assessment.