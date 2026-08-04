# NexBiz - Environment Setup & Installation Guide

Follow this step-by-step setup guide to configure the NexBiz platform local development environment.

---

## 1. Prerequisites Installation

Ensure you have the following software installed on your development machine:

### 1.1 Node.js & npm
- Download and install **Node.js (LTS version, v18+ or v20+)** from the official [Node.js website](https://nodejs.org/).
- Verify installation in your terminal:
  ```bash
  node -v
  npm -v
  ```

### 1.2 Python & Virtualenv (For AI Microservice)
- Download and install **Python (3.9 to 3.11)** from the [Python website](https://www.python.org/).
- Ensure "Add Python to PATH" option is checked during installation.
- Verify installation:
  ```bash
  python --version
  pip --version
  ```

### 1.3 MySQL Server
- Download and install **MySQL Community Server (v8.0+)** using the [MySQL Installer](https://dev.mysql.com/downloads/installer/).
- Set a strong root password during setup (e.g. `your_mysql_secure_password`).
- Verify installation:
  ```bash
  mysql --version
  ```

---

## 2. Database Initialization

1. Open your terminal or MySQL command line client and log in:
   ```bash
   mysql -u root -p
   ```
2. Enter the root password specified during installation.
3. Import the `schema.sql` file to create the tables, indexes, and constraints:
   ```sql
   SOURCE c:/path/to/NexBiz-Next-Generation-Business-Management-Platform/database/schema.sql;
   ```
   *(Note: Replace the absolute path with the actual location of the `schema.sql` file on your machine)*.
4. Verify table creation:
   ```sql
   USE nexbiz_db;
   SHOW TABLES;
   ```

---

## 3. Directory and Service Configurations

### 3.1 Backend Setup (Node.js & Express)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize and install node dependencies (run this once dependencies are defined in `package.json` in subsequent weeks):
   ```bash
   npm install
   ```
3. Copy the `.env.example` from the root directory into the `backend/` directory as `.env`:
   ```bash
   cp ../.env.example .env
   ```
4. Edit `backend/.env` with your actual MySQL credentials and JWT keys.

### 3.2 Frontend Setup (React & Vite)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` template to `frontend/.env` and update `VITE_API_URL` to match the backend port.

### 3.3 AI Service Setup (Flask)
1. Navigate to the ai-service directory:
   ```bash
   cd ../ai-service
   ```
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
4. Install python dependencies (e.g., Flask, scikit-learn, mysql-connector-python):
   ```bash
   pip install flask scikit-learn mysql-connector-python python-dotenv
   ```
5. Create a `requirements.txt` file representing these dependencies:
   ```bash
   pip freeze > requirements.txt
   ```

---

## 4. Recommended VS Code Extensions

For optimal development workflow, install the following extensions in VS Code:

1. **Prettier - Code Formatter** (Esben Petersen)
   - Enforces unified formatting across JS, TS, HTML, and CSS.
2. **ESLint** (Microsoft)
   - Analyzes JS/TS code for syntax warnings and logic issues.
3. **Tailwind CSS IntelliSense** (Tailwind Labs)
   - Provides autocomplete, syntax highlighting, and class sorting assistance.
4. **Python** (Microsoft)
   - Core support for Flask development, autocomplete, refactoring, and debugging.
5. **Database Client** (Weijan Chen) or **MySQL** (cweijan)
   - Directly inspect database tables, run queries, and verify relations from inside VS Code.
6. **Mermaid Previewer** (Volodymyr Klymenko)
   - Instantly renders and previews system architectural diagrams inside documentation.
7. **Thunder Client** (Thunder Client) or **Postman**
   - Quick testing of API requests (POST/GET/PATCH) with auth cookies directly in the editor.
