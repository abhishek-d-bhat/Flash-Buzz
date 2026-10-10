# FlashBuzz

**AI + Business Decision Solver** --- upload business datasets, inspect
data quality, calculate useful metrics, and generate insights to support
business decisions.

## Contents

1.  [Database setup](#1-database-setup)
2.  [Prerequisites](#2-prerequisites)
3.  [Clone the repository](#3-clone-the-repository)
4.  [Install dependencies](#4-install-dependencies)
5.  [Configure environment
    variables](#5-configure-environment-variables)
6.  [Run the backend](#6-run-the-backend)
7.  [Run the frontend](#7-run-the-frontend)
8.  [Test registration and upload](#8-test-registration-and-upload)
9.  [Project structure](#9-project-structure)
10. [Troubleshooting](#10-troubleshooting)
11. [Security notes](#11-security-notes)

------------------------------------------------------------------------

## 1. Database setup

FlashBuzz uses **MySQL** for account data. Each team member should
create their own local database; do not share database passwords.

### Step 1.1 --- Open MySQL

Open MySQL Workbench, or log in through your MySQL command-line client.

### Step 1.2 --- Create the database

Run:

``` sql
CREATE DATABASE IF NOT EXISTS flashbuzz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flashbuzz;
```

### Step 1.3 --- Create the users table

The frontend registration form sends `name`, `business_name`, `email`,
and `password`. This starter schema stores the account fields and a
**password hash** (never store plain-text passwords).

``` sql
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  business_name VARCHAR(150) NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);
```

Check that the table exists:

``` sql
SHOW TABLES;
DESCRIBE users;
```

> **Important compatibility note:** Your backend's SQL queries must use
> the same table and column names as this schema. If your current
> `src/backend/routes/auth.js` uses different names (for example,
> `owner_name`, `shop_name`, `username`, `otp`, or `is_verified`), use
> the matching schema required by that code rather than running a
> conflicting table definition. Do not drop a table that already
> contains data. Update the schema and backend together if necessary.

------------------------------------------------------------------------

## 2. Prerequisites

Install these tools on your computer:

-   **Git** --- to clone and update the repository.
-   **Node.js (LTS)** --- includes npm.
-   **MySQL Server** --- make sure the MySQL service is running.
-   **A code editor**, such as Visual Studio Code.

Check the installations in a terminal:

``` bash
node --version
npm --version
git --version
```

Check that MySQL is running and that you can log in with your local
MySQL account.

------------------------------------------------------------------------

## 3. Clone the repository

Replace `<YOUR-GITHUB-URL>` with the repository URL from GitHub.

``` bash
git clone <YOUR-GITHUB-URL>
cd FlashBuzz
```

If you have already cloned the repository, open a terminal in the
existing `FlashBuzz` folder and pull the latest changes:

``` bash
git pull
```

------------------------------------------------------------------------

## 4. Install dependencies

First, inspect the repository to see where the `package.json` files are:

``` text
FlashBuzz/
├── package.json
└── src/
    └── backend/
        └── package.json   (if the backend has its own package file)
```

Install the frontend/root dependencies:

``` bash
npm install
```

If `src/backend/package.json` exists and defines the backend
dependencies, open a **second terminal** and run:

``` bash
cd src/backend
npm install
```

If there is only one root `package.json` and it already contains the
backend dependencies and scripts, install dependencies at the root only.
Follow the actual `package.json` files committed to the repository; do
not create a second package setup unnecessarily.

------------------------------------------------------------------------

## 5. Configure environment variables

Create a local environment file at:

``` text
src/backend/.env
```

Use this template and fill in your own local values:

``` env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_LOCAL_MYSQL_PASSWORD
DB_NAME=flashbuzz
DB_PORT=3306
PORT=5000
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
```

-   Replace `YOUR_LOCAL_MYSQL_PASSWORD` with the password for your local
    MySQL account. If your account has no password, follow your local
    MySQL configuration.
-   Replace `JWT_SECRET` with a long, random secret.
-   Do not add quotes unless your configuration specifically requires
    them.
-   Do not commit `.env` to GitHub.

Confirm that `.gitignore` excludes at least:

``` gitignore
node_modules/
.env
src/backend/.env
dist/
```

If `.env` was already committed, adding it to `.gitignore` does not
remove it from Git history. Remove it from tracking and rotate any
exposed credentials.

------------------------------------------------------------------------

## 6. Run the backend

Use the terminal and working directory that match the backend's
`package.json`.

### If the backend has its own `package.json`

``` bash
cd src/backend
npm install
npm run
```

The `npm run` command lists the available scripts. Start the server
using the script actually defined in that file, commonly:

``` bash
npm run dev
```

or:

``` bash
npm start
```

### If the backend uses the root `package.json`

Run the backend script listed by the root package, for example:

``` bash
npm run server
```

Do not assume a script exists unless it appears under `"scripts"` in
`package.json`.

The backend is expected to use port **5000** by default. Keep this
terminal open while using the application.

------------------------------------------------------------------------

## 7. Run the frontend

Open a **separate terminal** in the project root (`FlashBuzz/`) and run:

``` bash
npm run dev
```

Use the local URL printed by Vite in the terminal (commonly
`http://localhost:5173`).

Keep both terminals running:

-   Terminal 1: backend server
-   Terminal 2: frontend/Vite server

The frontend upload code currently calls:

``` text
http://localhost:5000/api/analysis/upload
```

Registration is expected at:

``` text
http://localhost:5000/api/auth/register
```

Make sure the backend mounts those routes and that CORS allows the
frontend's local origin.

------------------------------------------------------------------------

## 8. Test registration and upload

1.  Open the frontend URL shown by Vite.
2.  Register using a test email address and a password.
3.  Check the backend terminal if registration fails.
4.  Upload a small CSV file.
5.  Confirm the backend returns a successful response and the frontend
    moves to the preparation/dashboard screen.
6.  Try a second dataset with different column names to check generic
    dataset analysis.

If registration fails with a database error, compare the SQL in
`src/backend/routes/auth.js` with the `users` table you created in
Section 1. The `INSERT` column list must match the database schema
exactly.

------------------------------------------------------------------------

## 9. Project structure

The repository may look similar to this:

``` text
FlashBuzz/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── backend/
│       ├── server.js
│       ├── db.js
│       ├── .env                 # local only; never commit
│       └── routes/
│           ├── auth.js
│           └── analysis.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Use the actual files in the repository as the source of truth; your
project may contain additional components, route files, or configuration
files.

------------------------------------------------------------------------

## 10. Troubleshooting

### `ECONNREFUSED` or frontend cannot connect to backend

-   Confirm the backend is running.
-   Check that the backend uses port `5000`.
-   Check the API URL in the frontend.
-   Check the backend terminal for startup errors.

### `Access denied for user` / MySQL connection error

-   Confirm the MySQL service is running.
-   Check `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` in
    `src/backend/.env`.
-   Verify that the `flashbuzz` database exists.

### `Table 'flashbuzz.users' doesn't exist`

Run the database SQL in Section 1, then confirm the table name expected
by the backend.

### `Unknown column` or registration fails with SQL error

The table does not match the backend's query. Compare the
`INSERT INTO users (...)` statement in the auth route with
`DESCRIBE users;`. Align the schema and code; do not blindly delete
existing data.

### `require is not defined in ES module scope`

If `package.json` contains `"type": "module"`, use ES module imports
(`import ... from ...`) instead of CommonJS `require(...)`, unless the
relevant file is configured as CommonJS.

### Upload works but the dashboard is empty or shows zero values

-   Open browser developer tools (**F12 → Console**).
-   Inspect the response from `/api/analysis/upload`.
-   Check that the dashboard reads the same response structure that the
    backend returns.
-   Generic datasets should not be forced into sales-only metrics when
    they do not contain sales fields.

### Dependencies fail to install

-   Check `node --version`.
-   Run `npm install` in the directory containing the relevant
    `package.json`.
-   Read the first error in the terminal; later errors may be
    consequences of the first one.

------------------------------------------------------------------------

## 11. Security notes

-   Never commit `.env`, passwords, JWT secrets, OTPs, or real user
    data.
-   Store hashed passwords only. The registration route should hash
    passwords before inserting them.
-   Keep `.env.example` as a template with placeholder values only, if
    you want to document configuration.
-   Use test accounts and sample datasets for development.
-   Do not share one developer's database credentials with the team.
    Each teammate should configure their own local `.env`.

------------------------------------------------------------------------

## Team setup checklist

-   [ ] Clone the repository.
-   [ ] Install Node.js and MySQL.
-   [ ] Create the `flashbuzz` database and required tables.
-   [ ] Create `src/backend/.env` with local credentials.
-   [ ] Install dependencies in the correct package directories.
-   [ ] Start the backend.
-   [ ] Start the frontend.
-   [ ] Test registration and CSV upload.
