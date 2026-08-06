# System Architecture & Database Design (MongoDB Edition) - NexBiz

This document covers the high-level architecture, directory layout, MongoDB collection schemas, and testing payloads for the NexBiz platform.

---

## 1. Directory Structure Layout
The monorepo contains decoupled frontend and backend applications:

```text
NexBiz-Next-Generation-Business-Management-Platform/
├── client/                      # React SPA
│   ├── .env.example             # Client environment template
│   └── (Vite boilerplate)
├── server/                      # Node.js/Express REST API
│   ├── config/
│   │   ├── db.js                # Mongoose connection client
│   │   └── seed.js              # Idempotent DB seed script
│   ├── controllers/
│   │   └── authController.js    # Mongoose-based controllers
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middlewares
│   │   └── validator.js         # Input validation schemas
│   ├── models/                  # Mongoose Schemas & Models
│   │   ├── Permission.js        # Permission Schema
│   │   ├── Role.js              # Role Schema
│   │   └── User.js              # User Schema
│   ├── routes/
│   │   └── auth.js              # Mounts /api/auth routes
│   ├── utils/
│   │   └── response.js          # Standardized response helper
│   ├── .env.example             # Server environment template
│   ├── package.json             # NPM dependencies
│   └── server.js                # Entry point
└── docs/                        # Specifications & documentation
    ├── srs.md                   # System Requirements Specification
    └── architecture.md          # Architecture & API details
```

---

## 2. MongoDB Database Design & Collections
The data model uses Mongoose schemas to map documents to MongoDB collections.

### 2.1 Users Collection (`users`)
Stores registered accounts with references to roles.
```json
{
  "_id": "ObjectId",
  "full_name": "String",
  "email": "String (Unique, Indexed, Lowercase)",
  "password_hash": "String",
  "role": "String ('ADMIN' | 'EMPLOYEE' | 'CUSTOMER')",
  "role_ref": "ObjectId (Ref: Role)",
  "is_verified": "Boolean",
  "verification_token": "String",
  "reset_token": "String",
  "reset_token_expires": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 2.2 Roles Collection (`roles`)
Stores system roles and mapping of granted permission ObjectIds.
```json
{
  "_id": "ObjectId",
  "name": "String (Unique, Uppercase)",
  "description": "String",
  "permissions": ["ObjectId (Ref: Permission)"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 2.3 Permissions Collection (`permissions`)
Stores standard action scopes (e.g. read own profile, manage users).
```json
{
  "_id": "ObjectId",
  "name": "String (Unique)",
  "description": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 3. Core API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user profile |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return signed JWT |
| `POST` | `/api/auth/forgot-password` | Public | Send recovery email with reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using token |
| `GET` | `/api/auth/profile` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile details |

---

## 4. Postman / API Payloads & Responses

### 4.1 Register User
- **URL**: `POST /api/auth/register`
- **Body (JSON)**:
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123",
  "role": "CUSTOMER"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "verificationToken": "35a8f5e71887e594..."
  }
}
```

### 4.2 Login User
- **URL**: `POST /api/auth/login`
- **Body (JSON)**:
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "User authenticated successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64d0bc88f34279ab8de01001",
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "is_verified": false
    }
  }
}
```

### 4.3 Forgot Password
- **URL**: `POST /api/auth/forgot-password`
- **Body (JSON)**:
```json
{
  "email": "jane@example.com"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "If that email address exists in our system, a password reset link has been sent.",
  "data": null
}
```

### 4.4 Reset Password
- **URL**: `POST /api/auth/reset-password`
- **Body (JSON)**:
```json
{
  "token": "35a8f5e71887e594...",
  "password": "NewSecurePassword456"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Your password has been successfully reset. You can now login.",
  "data": null
}
```

### 4.5 Get User Profile
- **URL**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "64d0bc88f34279ab8de01001",
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "is_verified": false,
    "createdAt": "2026-08-06T09:00:00.000Z",
    "updatedAt": "2026-08-06T09:00:00.000Z"
  }
}
```

### 4.6 Update User Profile
- **URL**: `PUT /api/auth/profile`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON)**:
```json
{
  "full_name": "Jane Doe Modified"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "_id": "64d0bc88f34279ab8de01001",
    "full_name": "Jane Doe Modified",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "is_verified": false,
    "createdAt": "2026-08-06T09:00:00.000Z",
    "updatedAt": "2026-08-06T09:10:00.000Z"
  }
}
```
