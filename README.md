## Uni-Nest Project

Uni-Nest is a full-stack web application designed to connect students seeking boarding accommodations with landlords offering properties. The platform provides secure authentication, property management, request handling, reviews, and payment features. It consists of a Python backend (API, database, security) and a React frontend (student and landlord dashboards, property listings, and more).

### Project Structure

- **backend/**: Python FastAPI backend with database models, API endpoints, and security utilities.
- **frontend/**: React-based frontend with separate modules for students and landlords, including authentication, property management, and payment features.

Refer to subfolder README files for more details on backend and frontend setup and usage.

---

## System Overview

### Backend (Python/FastAPI)

- **API**: Handles all HTTP requests for authentication, property management, student/landlord actions, reviews, and payments.
- **Database**: Manages persistent data for users, properties, requests, reviews, and transactions using models defined in `models.py` and database logic in `database.py`.
- **Security**: Implements authentication (JWT tokens), password hashing, and utility functions for secure access control in `Security/`.
- **Structure**:
  - `main.py`: Entry point for the FastAPI server and route definitions.
  - `models.py`: SQLAlchemy models for users, properties, requests, reviews, and payments.
  - `database.py`: Database connection and session management.
  - `API/`: Contains route handlers for different modules (students, landlords, properties, etc.).
  - `Security/`: Security logic and helper utilities.

### Frontend (React/Vite)

- **Student Module**: Dashboard, search boardings, review/rating, payment, and personal boarding management.
- **Landlord Module**: Dashboard, add/manage properties, handle student requests, manage subscriptions, and view/manage students.
- **Shared Components**: Navigation bars, headers, footers, protected routes, and context providers for authentication.
- **Structure**:
  - `src/components/Student/`: Student-specific pages and features.
  - `src/components/LandLord/`: Landlord-specific pages and features.
  - `src/context/AuthContext.jsx`: Global authentication context.
  - `src/pages/Login/`, `src/pages/SignUp/`: Authentication pages.
  - `public/`: Static assets and images.

### Main Features

- **Authentication**: Secure login/signup for students and landlords.
- **Property Management**: Landlords can add, edit, and manage boarding properties.
- **Search & Requests**: Students can search for boardings and send requests to landlords.
- **Review & Rating**: Students can review and rate properties.
- **Payment System**: Integrated payment for boarding and subscriptions.
- **Subscription Plans**: Landlords can manage subscription plans for premium features.
- **Role-Based Dashboards**: Separate dashboards and navigation for students and landlords.

### Technologies Used

- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, Vite, CSS
- **Database**: (Specify your DB, e.g., SQLite, PostgreSQL)
- **Authentication**: JWT, bcrypt
