# Saravoan Medical Laboratory — Lab Request System

A full-stack web application for managing laboratory test requests at Saravoan Medical Laboratory. Doctors submit patient lab requests through a form-based dashboard, while admins manage the test catalogue, monitor activity, and oversee user accounts. Telegram notifications alert staff on every print action in real time.

---

## Features

### Doctor Portal
- **Secure login** with role-based access (doctor accounts only)
- **Lab request form** — fill in patient details (name, age, sex, doctor name, phone) and select any combination of tests
- **Dynamic test catalogue** — tests are grouped by category (e.g. Hematology, Chemistry, Serology) and rendered as grouped checkboxes; the list is fully managed by the admin, no static data
- **Test packages** — save and reuse commonly ordered test bundles
- **Save & Print** — saves the request to the database, fires a Telegram notification, and opens a formatted lab request slip with a "Containers Needed" section listing the sample tubes required for the selected tests
- **Print Invoice** — opens a separate invoice PDF showing each selected test with its price and a grand total (does not save to DB)
- **Request history** — view and delete past lab requests

### Admin Portal
- **Separate admin login** at `/admin/login`
- **Dashboard stats** — total doctors, total requests, today's requests, and test catalogue size
- **Test catalogue management (CRUD)** — add, edit, and delete lab tests with:
  - Name
  - Category (grouped display; defaults to "Other" when left blank)
  - Sample type (e.g. Blood, Urine)
  - Collection container (e.g. EDTA Tube Purple, Plain Tube Red)
  - Price
  - Active/inactive toggle (inactive tests are hidden from doctors)
- **Doctor management** — view all registered doctors with their request counts
- **All requests view** — see the 100 most recent lab requests across all doctors
- **Create admin accounts** — provision new admin users

### System
- **Telegram notifications** — every Save & Print action sends a formatted message listing the patient name, doctor, and selected tests grouped by category
- **Role-based routing** — doctors land on `/dashboard`, admins on `/admin/dashboard`; routes are protected and redirect unauthenticated users to the appropriate login page

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Laravel 11 | PHP framework (REST API) |
| Laravel Sanctum | Token-based authentication |
| MySQL | Relational database |
| Telegram Bot API | Real-time print notifications |

---

## Project Structure

```
lab-app/
├── frontend/                   # React + Vite application
│   └── src/
│       ├── api/                # Axios instance and base config
│       ├── context/            # Auth context (user state, login/logout)
│       ├── components/
│       │   ├── PrintReceipt.jsx       # Lab slip print layout
│       │   └── ProtectedRoute.jsx     # Auth guard for routes
│       └── pages/
│           ├── Login.jsx              # Doctor login
│           ├── Register.jsx           # Doctor registration
│           ├── Dashboard.jsx          # Doctor main view
│           ├── AdminLogin.jsx         # Admin login
│           └── AdminDashboard.jsx     # Admin main view
│
└── saravoan-backend/           # Laravel 11 API
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── AuthController.php         # Register, login, logout, me
    │   │   ├── LabRequestController.php   # Lab request CRUD
    │   │   ├── AdminController.php        # Admin stats, doctors, test catalogue CRUD
    │   │   ├── TelegramController.php     # Telegram notification dispatch
    │   │   └── TestPackageController.php  # Test package CRUD
    │   └── Models/
    │       ├── User.php
    │       ├── LabRequest.php
    │       ├── OtherTestOption.php        # Lab test catalogue entry
    │       └── TestPackage.php
    ├── database/migrations/
    └── routes/api.php
```

---

## API Endpoints

All endpoints except `/register` and `/login` require a Sanctum Bearer token.

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/api/register` | Public | Register a new doctor |
| POST | `/api/login` | Public | Login (doctor or admin) |
| POST | `/api/logout` | Auth | Logout current user |
| GET | `/api/me` | Auth | Get authenticated user info |
| GET | `/api/lab-requests` | Auth | List own lab requests |
| POST | `/api/lab-requests` | Auth | Create a lab request |
| GET | `/api/lab-requests/{id}` | Auth | Get a single request |
| DELETE | `/api/lab-requests/{id}` | Auth | Delete a request |
| POST | `/api/notify/print` | Auth | Send Telegram print notification |
| GET | `/api/other-tests` | Auth | Get active test options (doctor view) |
| GET | `/api/packages` | Auth | List test packages |
| POST | `/api/packages` | Auth | Create a test package |
| DELETE | `/api/packages/{id}` | Auth | Delete a test package |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/doctors` | Admin | List all doctors |
| GET | `/api/admin/requests` | Admin | List all lab requests |
| POST | `/api/admin/admins` | Admin | Create a new admin account |
| GET | `/api/admin/other-tests` | Admin | List all test options (incl. inactive) |
| POST | `/api/admin/other-tests` | Admin | Create a test option |
| PUT | `/api/admin/other-tests/{id}` | Admin | Update a test option |
| DELETE | `/api/admin/other-tests/{id}` | Admin | Delete a test option |

---

## Data Model: OtherTestOption

Each lab test in the catalogue has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Test name (e.g. "Hb/CBC") |
| `category` | string | Display group (e.g. "Hematology"); defaults to "Other" |
| `sample_type` | string | Sample required (e.g. "Blood", "Urine") |
| `collection_container` | string | Tube type (e.g. "EDTA Tube (Purple)"); drives the "Containers Needed" section on the printed slip |
| `price` | decimal | Test price shown on the invoice |
| `is_active` | boolean | Whether the test is visible to doctors |

---

## Setup

See [SETUP.md](./SETUP.md) for full installation and environment configuration instructions.
