# 🧪 Saravoan Medical Laboratory — Full Stack App

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Laravel 11 + Laravel Sanctum (token auth)
- **Database**: MySQL 8

---

Email:    admin@saravoan.com
Password: Admin@1234
## 📁 Project Structure

```
lab-app/
├── frontend/          ← React app
│   ├── src/
│   │   ├── api/       ← Axios instance
│   │   ├── context/   ← AuthContext
│   │   ├── data/      ← All lab tests data (from PDF)
│   │   ├── components/← PrintReceipt, ProtectedRoute
│   │   └── pages/     ← Login, Register, Dashboard
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/           ← Laravel API
    ├── app/
    │   ├── Models/    ← User, LabRequest
    │   └── Http/Controllers/ ← AuthController, LabRequestController
    ├── database/migrations/
    ├── routes/api.php
    └── .env.example
```

---

## 🚀 Backend Setup (Laravel)

### 1. Create Laravel project
```bash
composer create-project laravel/laravel saravoan-backend
cd saravoan-backend
```

### 2. Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Copy backend files
Copy all files from the `backend/` folder of this project into `saravoan-backend/`, overwriting when prompted:
- `app/Models/User.php`
- `app/Models/LabRequest.php`
- `app/Http/Controllers/AuthController.php`
- `app/Http/Controllers/LabRequestController.php`
- `database/migrations/*`
- `routes/api.php`
- `bootstrap/app.php`
- `config/cors.php`

### 4. Configure MySQL
```bash
cp .env.example .env
```
Edit `.env`:
```
DB_DATABASE=saravoan_lab
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 5. Create the database
```sql
CREATE DATABASE saravoan_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Run migrations & generate key
```bash
php artisan key:generate
php artisan migrate
```

### 7. Start the server
```bash
php artisan serve
# → Running on http://localhost:8000
```

---

## 🖥️ Frontend Setup (React)

### 1. Navigate to frontend folder
```bash
cd lab-app/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start dev server
```bash
npm run dev
# → Running on http://localhost:5173
```

---

## ✅ Features

| Feature | Details |
|---|---|
| **Authentication** | Register / Login / Logout with JWT tokens (Sanctum) |
| **Patient Form** | Name, DOB, phone, ID, weight, gender, date/time |
| **Test Selection** | All tests from PDF — 26 categories, 130+ tests |
| **Category Checkboxes** | Tick whole category OR individual tests |
| **Collapsible Categories** | Click to collapse / expand each group |
| **Print PDF** | Prints a formatted receipt with selected tests grouped by category |
| **Save to DB** | Saves request to MySQL via Laravel API |
| **History Tab** | View past requests, click to reload & reprint |

---

## 🖨️ Print Receipt Format

When printed, the receipt shows:

```
SARAVOAN MEDICAL LABORATORY
────────────────────────────────────
Patient Name:  John Doe       ID: 001
Telephone:     012 345 678    Weight: 65 kg
Date of Birth: 1990-01-01     Gender: Male
Date: 2024-01-15              Time: 09:30

TEST CATEGORY          TEST ITEM
──────────────────────────────────────
Hematology             Hg/CBC
                       Vs/ESR
Biochemistry           Calcium
                       Creatinine
Thyroid Function       FT3
                       TSH Ultra Sensitive

Total Tests: 6
────────────────────────────────────
Clinical History: Routine checkup
Doctor Name: _____________________
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Create doctor account |
| POST | `/api/login` | ❌ | Login, returns token |
| POST | `/api/logout` | ✅ | Invalidate token |
| GET | `/api/me` | ✅ | Get current user |
| GET | `/api/lab-requests` | ✅ | List doctor's requests |
| POST | `/api/lab-requests` | ✅ | Create new request |
| GET | `/api/lab-requests/{id}` | ✅ | Get single request |
| DELETE | `/api/lab-requests/{id}` | ✅ | Delete request |

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | varchar | Doctor's full name |
| email | varchar | Unique |
| password | varchar | Hashed |
| role | varchar | Default: 'doctor' |

### `lab_requests`
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| doctor_id | bigint | FK → users |
| patient_name | varchar | |
| patient_telephone | varchar | nullable |
| date_of_birth | date | nullable |
| gender | enum | male/female |
| patient_id | varchar | nullable |
| weight | decimal | nullable |
| request_date | date | |
| request_time | time | nullable |
| clinical_history | text | nullable |
| doctor_name | varchar | |
| other_tests | varchar | nullable |
| selected_tests | json | Array of test keys |
