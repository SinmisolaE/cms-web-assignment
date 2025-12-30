# CMS Web Application

A full-stack Content Management System with role-based access control (RBAC) built with Node.js, Express, MongoDB, and Angular.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Test Users](#test-users)
- [Project Structure](#project-structure)

## Features

- **Role-Based Access Control (RBAC)** with 4 predefined roles
- **Article Management** (Create, Read, Update, Delete, Publish)
- **User Management** (View, Delete users by role)
- **Role Management** (Create, Update, Delete roles)
- **Authentication & Authorization** (JWT-based)
- **Responsive UI** with Angular and Bootstrap

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- Angular 20.3
- Bootstrap 5.3
- TypeScript

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Angular CLI (v20.3.8)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cms_db
   JWT_ACCESS_SECRET="your-access-token-secret"
   JWT_REFRESH_TOKEN="your-refresh-token-secret"
   ```

   **Generate secure JWT secrets (recommended):**
   ```bash
   cd utils
   chmod +x generate_secrects.sh
   ./generate_secrects.sh
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` and automatically:
   - Connect to MongoDB
   - Initialize default roles (SuperAdmin, Manager, Contributor, Viewer)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend/cms-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000'
   };
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The application will run on `http://localhost:4200`

### Quick Start (Both Servers)

Run these commands in separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
nodemon server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend/cms-frontend
ng serve
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth` | User login | No |
| POST | `/auth/register` | User registration | No |

**Request Body (Login):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Body (Register):**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Contributor"
}
```

### Article Endpoints

All article endpoints require authentication (JWT token in Authorization header).

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| POST | `/articles/create` | Create a new article | `create_article` |
| GET | `/articles/all` | Get all articles | `view_all_articles` |
| GET | `/articles/my-articles` | Get current user's articles | `edit_article` |
| GET | `/articles/articles` | Get published articles only | `view_published_only` |
| GET | `/articles/:id` | Get article by ID | Authenticated |
| PUT | `/articles/:id` | Update article | `edit_article` |
| POST | `/articles/status` | Publish/unpublish article | `publish_article` |
| DELETE | `/articles/:id` | Delete article | `delete_article` |

**Create Article Request:**
```json
{
  "title": "My Article",
  "body": "Article content here",
}
```

**Update Article Status Request:**
```json
{
  "id": "article_id",
  "publish": true
}
```

### User Endpoints

All user endpoints require authentication.

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/users` | Get all users | `view_users` |
| GET | `/users/:role` | Get users by role | `view_users` |
| DELETE | `/users/:id` | Delete user | `delete_user` |

### Role Endpoints

All role endpoints require authentication.

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/roles` | Get all roles | `view_roles` |
| POST | `/roles/add` | Create new role | `create_role` |
| PUT | `/roles/:id` | Update role | `edit_role` |
| DELETE | `/roles/:id` | Delete role | `delete_role` |

**Create Role Request:**
```json
{
  "name": "Editor",
  "description": "Can edit articles",
  "permissions": ["edit_article", "view_all_articles"]
}
```

### Authorization Header Format

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

## Test Users

The system includes **4 predefined roles** with different permission levels. You can create test users for each role using the registration endpoint.

### Role Hierarchy & Permissions

#### 1. SuperAdmin
**Full system access**

**Permissions:**
- Article Management: `create_article`, `edit_article`, `delete_article`, `publish_article`, `view_all_articles`, `view_published_only`
- User Management: `create_user`, `edit_user`, `delete_user`, `view_users`
- Role Management: `create_role`, `edit_role`, `delete_role`, `view_roles`

**Test User Credentials:**
```
Email: superadmin@cms.com
Password: Super@123
```

**To create:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Super",
    "lastName": "Admin",
    "email": "superadmin@cms.com",
    "password": "Super@123",
    "roleName": "SuperAdmin"
  }'
```

#### 2. Manager
**Can manage articles and moderate content**

**Permissions:**
- Article Management: `create_article`, `edit_article`, `delete_article`, `publish_article`, `view_all_articles`, `view_published_only`
- User Management: `view_users`
- Role Management: `view_roles`
- Dashboard: `view_dashboard`

**Test User Credentials:**
```
Email: manager@cms.com
Password: Manager@123
```

**To create:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Manager",
    "lastName": "User",
    "email": "manager@cms.com",
    "password": "Manager@123",
    "roleName": "Manager"
  }'
```

#### 3. Contributor
**Can create and edit own articles**

**Permissions:**
- Article Management: `create_article`, `edit_article`, `view_all_articles`, `view_published_only`

**Test User Credentials:**
```
Email: contributor@cms.com
Password: Contrib@123
```

**To create:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Contributor",
    "lastName": "User",
    "email": "contributor@cms.com",
    "password": "Contrib@123",
    "roleName": "Contributor"
  }'
```

#### 4. Viewer
**Can only view published articles**

**Permissions:**
- Article Management: `view_published_only`

**Test User Credentials:**
```
Email: viewer@cms.com
Password: Viewer@123
```

**To create:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Viewer",
    "lastName": "User",
    "email": "viewer@cms.com",
    "password": "Viewer@123",
    "roleName": "Viewer"
  }'
```

### Creating Test Users via Postman or Frontend

You can also create these test users using:

1. **Postman/cURL**: Use the registration endpoint as shown above
2. **Frontend UI**: Navigate to the registration page and fill in the form
3. **MongoDB Compass**: Directly insert users into the database

### Testing Role Permissions

After creating test users, log in with each role to verify:

- **SuperAdmin**: Can access all features, manage users, roles, and articles
- **Manager**: Can manage all articles, view users and roles, but cannot modify them
- **Contributor**: Can create and edit own articles, cannot publish or delete
- **Viewer**: Can only view published articles, no edit capabilities

## Project Structure

```
cms-web-assignment/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── articleController.js
│   │   ├── authController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── middleware/           # Authentication & authorization
│   │   ├── authMiddleware.js
│   │   └── permissionMiddleware.js
│   ├── models/              # Mongoose schemas
│   │   ├── Article.js
│   │   ├── Role.js
│   │   └── User.js
│   ├── routes/              # API routes
│   │   ├── articleRoute.js
│   │   ├── authRoute.js
│   │   ├── roleRoute.js
│   │   └── userRoute.js
│   ├── utils/               # Utility functions
│   │   ├── generate_secrects.sh
│   │   └── roleInitializer.js
│   ├── package.json
│   └── server.js            # Entry point
│
├── frontend/cms-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI components
│   │   │   │   ├── articles/
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── layout/
│   │   │   │   ├── profile/
│   │   │   │   ├── roles/
│   │   │   │   └── users/
│   │   │   ├── guards/      # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── services/    # API services
│   │   │   └── environments/
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
│
└── README.md                # This file
```

## Development Notes

### Database Initialization

On first run, the backend automatically creates 4 default roles:
- SuperAdmin (full access)
- Manager (article & user management)
- Contributor (create/edit own articles)
- Viewer (read-only access)

### Security Features

- JWT-based authentication with access tokens
- Password hashing with bcryptjs
- Permission-based middleware for route protection
- HTTP-only authentication flow

### Available Permissions

```javascript
// Article permissions
'create_article', 'edit_article', 'delete_article', 'publish_article',
'view_all_articles', 'view_published_only'

// User permissions
'create_user', 'edit_user', 'delete_user', 'view_users'

// Role permissions
'create_role', 'edit_role', 'delete_role', 'view_roles'

// Dashboard
'view_dashboard'
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env`
- Check MongoDB service: `sudo systemctl status mongodb`

**Port Already in Use:**
- Change `PORT` in `.env` file
- Kill existing process: `lsof -ti:5000 | xargs kill -9`

### Frontend Issues

**API Connection Refused:**
- Verify backend is running on correct port
- Check `apiUrl` in `environment.ts`

**Angular CLI Not Found:**
```bash
npm install -g @angular/cli@20.3.8
```

## License

This project is for educational purposes.
