# System Requirements Specification (SRS) - NexBiz

## 1. Introduction
NexBiz is a Next-Generation Business Management SaaS platform designed to offer businesses a comprehensive suite of tools to manage operations, employee accounts, roles, and client relationships. This document outlines the initial functional and non-functional requirements for the core modules.

## 2. Product Scope
The initial iterations focus on establishing a secure, scalable, and robust core framework.
- **Backend**: Express.js REST API with MySQL, implementing JSON Web Token (JWT) authentication, and Role-Based Access Control (RBAC).
- **Frontend**: A decoupled React SPA interacting with the REST API.
- **Database**: Extensible relational schema mapping users, roles, and granular permissions.

---

## 3. System Features & Functional Requirements

### 3.1 Account Registration & Email Verification
- **UC-01**: A user can register by providing their `full_name`, `email`, and `password`.
- **UC-02**: Passwords must meet complexity requirements (minimum 8 characters, at least 1 letter and 1 number) and are cryptographically hashed using `bcrypt` (10 rounds) before storage.
- **UC-03**: Upon registration, an email verification token is generated, and a default role of `CUSTOMER` is assigned unless specified.

### 3.2 Authentication & Session Management
- **UC-04**: Registered users can authenticate by supplying their email and password.
- **UC-05**: Successful authentication yields a stateless signed JSON Web Token (JWT) expiring in 24 hours. The JWT payload encapsulates the user's ID, email, and role.
- **UC-06**: Unauthorized requests to protected routes return `401 Unauthorized`.

### 3.3 Password Recovery Flow
- **UC-07**: A user can request a password recovery email by providing their email address.
- **UC-08**: The system generates a cryptographically secure random token with a 1-hour expiration.
- **UC-09**: An email containing a reset link is dispatched using Nodemailer.
- **UC-10**: The user can reset their password by supplying the token and a new password.

### 3.4 Profile Management
- **UC-11**: Authenticated users can view their profile data.
- **UC-12**: Authenticated users can update their profile information (name and email address). Changing the email address must not conflict with existing database records.

### 3.5 Role-Based Access Control (RBAC)
- **UC-13**: System routes can be locked down to specific roles: `ADMIN`, `EMPLOYEE`, or `CUSTOMER`.
- **UC-14**: Unauthorized access to a route due to insufficient permissions yields a `403 Forbidden` response.

---

## 4. Non-Functional Requirements

### 4.1 Security
- Clear-text passwords must never be stored.
- Secure, cryptographically strong tokens are used for session authentication and resets.
- Inputs are strictly validated against SQL Injection, XSS, and parameter pollution.

### 4.2 Portability & Extensibility
- Configuration is strictly separated from code using environment variables (`.env`).
- Monorepo folder separation isolates frontend and backend logic.
