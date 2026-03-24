# Barbaza FACED Information System

> **Family Assistance Card in Emergencies and Disasters**
> Official Household Profiling & Assistance Management Platform
> Municipality of Barbaza, Antique — MSWDO / DROMIC Portal

---

## Overview

The Barbaza FACED Information System is a full-stack web application that digitizes and centralizes the municipality's disaster response and social welfare operations. It replaces paper-based household profiling with a structured digital workflow covering registration, vulnerability assessment, aid tracking, and official situation reporting.

---

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React 18 + TypeScript + Tailwind CSS |
| Backend    | PHP Laravel 11                       |
| Bridge     | Inertia.js                           |
| Database   | MySQL                                |
| Auth       | Laravel Breeze                       |
| IDE        | VS Code                              |
| Build Tool | Vite                                 |

---

## User Roles

### Barangay Staff

- Assigned to a specific barangay
- Can create and submit new FACED household records
- Can re-edit records that have been returned by admin
- Can add assistance entries to existing records
- Cannot validate or approve records

### MSWDO / Admin

- Full access across all barangays
- Can review submitted records and approve (Validate) or return them
- Can manage user accounts (create, delete)
- Can generate and export SitRep / DROMIC reports
- Can view all dashboard analytics and operational reports

---

## Core Features

### 1. Household Profiling (FACED Form)

Digital version of the government Form 1-A. Captures:

- Location of affected family (region, province, municipality, barangay, evacuation center)
- Head of family personal information
- Family members table with vulnerability tagging
- Banking and account information for aid disbursement
- Housing and shelter damage classification
- Data privacy consent and scanned form upload

### 2. Vulnerability Assessment Index (VAI)

Automatically computed score used to prioritize households for aid. Maximum score is 110.

| Factor                 | Condition                                        | Points  |
| ---------------------- | ------------------------------------------------ | ------- |
| Social Category        | 4Ps beneficiary                                  | +10     |
| Social Category        | Indigenous People                                | +10     |
| Social Category        | Others category filled                           | +5      |
| Monthly Income         | Below ₱5,000                                     | +25     |
| Monthly Income         | ₱5,000 – ₱9,999                                  | +15     |
| Monthly Income         | ₱10,000 – ₱14,999                                | +5      |
| Family Vulnerabilities | Per member with any vulnerability (capped at 30) | +5 each |
| Shelter Damage         | Totally Damaged                                  | +30     |
| Shelter Damage         | Partially Damaged                                | +15     |

### 3. Record Status Workflow

```
[Barangay Staff] → SUBMITTED → [MSWDO Admin] → VALIDATED
                                             ↘ RETURNED → [Barangay Staff edits] → SUBMITTED
```

### 4. Assistance Registry

Per household aid tracking with:

- Date, emergency type, assistance type (e.g. Family Food Pack)
- Recipient (household head or specific family member)
- Unit, quantity, cost (PHP)
- Provider / agency
- Status: Pending Approval → Approved → Locked

### 5. Situation Report (SitRep / DROMIC)

Generates official disaster incident reports using validated records only. Includes:

- Affected barangays, families, persons
- Shelter damage breakdown
- Vulnerable sector counts (PWD, Senior Citizen, Pregnant/Lactating)
- AI-generated professional incident summary
- Printable format

### 6. Operational Reports

Filterable reports by barangay, month, and minimum VAI score. Outputs:

- Barangay summary table (families, persons, damage, total aid)
- Detailed household report
- Print-to-PDF support

### 7. User Management (Admin only)

- Create accounts for Barangay Staff with barangay assignment
- Create MSWDO Admin accounts
- View and delete accounts

---

## Barangays Covered

Binangbang, Cadiao, Capuyas, Esparar, Guintas, Ipil, Jinalinan, Luntao, Magtulis, Mayabay, Nalupa, Poblacion

---

## Database Schema

### Table: `users` (Laravel default + extended)

| Column                  | Type            | Description                         |
| ----------------------- | --------------- | ----------------------------------- |
| id                      | BIGINT UNSIGNED | Primary key                         |
| name                    | VARCHAR(255)    | Display name                        |
| email                   | VARCHAR(255)    | Login email                         |
| password                | VARCHAR(255)    | Hashed password                     |
| role                    | ENUM            | `Barangay Staff` or `MSWDO / Admin` |
| assigned_barangay       | VARCHAR(100)    | NULL for Admin accounts             |
| created_at / updated_at | TIMESTAMP       | Auto-managed                        |

---

### Table: `faced_records`

Main household record. One row = one household head.

| Column              | Type             | Description                                          |
| ------------------- | ---------------- | ---------------------------------------------------- |
| id                  | CHAR(36)         | UUID primary key                                     |
| serial_number       | VARCHAR(50)      | e.g. `FACED-2024-0001`                               |
| status              | ENUM             | Submitted / Returned / Validated                     |
| region              | VARCHAR(100)     | Default: Region VI                                   |
| province            | VARCHAR(100)     | Default: Antique                                     |
| municipality        | VARCHAR(100)     | Default: Barbaza                                     |
| district            | VARCHAR(100)     | Optional                                             |
| barangay            | VARCHAR(100)     | Required                                             |
| evacuation_center   | VARCHAR(150)     | Optional                                             |
| last_name           | VARCHAR(100)     |                                                      |
| first_name          | VARCHAR(100)     |                                                      |
| middle_name         | VARCHAR(100)     |                                                      |
| name_extension      | VARCHAR(20)      | Jr, III, etc.                                        |
| civil_status        | ENUM             | Single / Married / Widowed / Separated / Co-habiting |
| mothers_maiden_name | VARCHAR(150)     |                                                      |
| religion            | VARCHAR(100)     |                                                      |
| occupation          | VARCHAR(100)     |                                                      |
| birthdate           | DATE             |                                                      |
| age                 | TINYINT UNSIGNED | Auto-calculated from birthdate                       |
| sex                 | ENUM             | Male / Female                                        |
| birthplace          | VARCHAR(150)     |                                                      |
| monthly_income      | DECIMAL(12,2)    | Used in VAI calculation                              |
| id_presented        | VARCHAR(100)     | e.g. National ID                                     |
| id_number           | VARCHAR(100)     |                                                      |
| contact_primary     | VARCHAR(20)      |                                                      |
| contact_alternate   | VARCHAR(20)      | Optional                                             |
| permanent_address   | TEXT             |                                                      |
| is_4ps              | TINYINT(1)       | 4Ps beneficiary flag                                 |
| is_ip               | TINYINT(1)       | Indigenous People flag                               |
| ip_group            | VARCHAR(100)     | Ethnicity e.g. Ati                                   |
| others_category     | VARCHAR(150)     | Optional                                             |
| bank_provider       | VARCHAR(100)     | e.g. Landbank, GCash                                 |
| account_name        | VARCHAR(150)     |                                                      |
| account_type        | ENUM             | Savings / Checking / E-Wallet                        |
| account_number      | VARCHAR(100)     |                                                      |
| house_ownership     | ENUM             | Owner / Renter / Sharer                              |
| shelter_damage      | ENUM             | None / Partially Damaged / Totally Damaged           |
| consent_checked     | TINYINT(1)       | Data Privacy Act consent                             |
| signed_form_url     | VARCHAR(500)     | Uploaded scanned form path                           |
| remarks             | TEXT             | Admin notes                                          |
| vai_score           | TINYINT UNSIGNED | Computed vulnerability score                         |
| date_registered     | DATE             |                                                      |
| created_by          | BIGINT UNSIGNED  | FK → users.id                                        |

---

### Table: `family_members`

Each household can have multiple members.

| Column                 | Type             | Description                                                       |
| ---------------------- | ---------------- | ----------------------------------------------------------------- |
| id                     | CHAR(36)         | UUID primary key                                                  |
| faced_record_id        | CHAR(36)         | FK → faced_records.id                                             |
| name                   | VARCHAR(200)     | Full name                                                         |
| relationship           | ENUM             | Child / Spouse / Parent / Sibling / Grandparent / In-law / Others |
| birthdate              | DATE             |                                                                   |
| age                    | TINYINT UNSIGNED | Auto-calculated                                                   |
| sex                    | ENUM             | Male / Female                                                     |
| birthplace             | VARCHAR(150)     |                                                                   |
| occupation             | VARCHAR(100)     |                                                                   |
| educational_attainment | VARCHAR(100)     |                                                                   |

---

### Table: `family_member_vulnerabilities`

Many-to-one per family member. Used in VAI scoring and DROMIC sector counts.

| Column             | Type         | Description                                                      |
| ------------------ | ------------ | ---------------------------------------------------------------- |
| id                 | INT UNSIGNED | Auto-increment PK                                                |
| family_member_id   | CHAR(36)     | FK → family_members.id                                           |
| vulnerability_type | ENUM         | PWD / Senior Citizen / Pregnant-Lactating / Solo Parent / Others |

---

### Table: `assistance_records`

Aid provided to a household, linked to a specific recipient member.

| Column              | Type          | Description                                    |
| ------------------- | ------------- | ---------------------------------------------- |
| id                  | CHAR(36)      | UUID primary key                               |
| faced_record_id     | CHAR(36)      | FK → faced_records.id                          |
| recipient_member_id | CHAR(36)      | FK → family_members.id (NULL = household head) |
| recipient_name      | VARCHAR(200)  | Denormalized for quick display                 |
| date                | DATE          | Date aid was provided                          |
| emergency_type      | VARCHAR(150)  | e.g. Typhoon, Flood                            |
| assistance_provided | VARCHAR(200)  | e.g. Family Food Pack, Shelter Kit             |
| unit                | VARCHAR(50)   | e.g. Pack, Kit, Sack                           |
| quantity            | DECIMAL(10,2) |                                                |
| cost                | DECIMAL(12,2) | PHP value                                      |
| provider            | VARCHAR(150)  | e.g. LGU Barbaza, DSWD                         |
| status              | ENUM          | Pending Approval / Approved / Locked           |

---

### Table: `sitrep_configs`

Saved SitRep/DROMIC disaster event configurations.

| Column                  | Type            | Description                      |
| ----------------------- | --------------- | -------------------------------- |
| id                      | INT UNSIGNED    | Auto-increment PK                |
| sitrep_number           | VARCHAR(20)     | e.g. 001                         |
| date                    | DATE            | Report date                      |
| period_from / period_to | DATE            | Reporting period                 |
| disaster_type           | VARCHAR(100)    | e.g. Typhoon, Flood              |
| disaster_name           | VARCHAR(150)    | e.g. Typhoon Agaton              |
| disaster_date           | DATE            |                                  |
| prepared_by             | VARCHAR(150)    |                                  |
| position                | VARCHAR(150)    |                                  |
| office                  | VARCHAR(150)    |                                  |
| summary                 | TEXT            | AI-generated or manually written |
| created_by              | BIGINT UNSIGNED | FK → users.id                    |

---

## Entity Relationships

```
users
 └── faced_records (created_by)
      ├── family_members (faced_record_id)
      │    └── family_member_vulnerabilities (family_member_id)
      └── assistance_records (faced_record_id)
           └── family_members (recipient_member_id) [nullable]

users
 └── sitrep_configs (created_by)
```

---

## Development Plan

### Phase 1 — Project Setup ✅

- ✅ Create Laravel project via Composer
- ✅ Install Laravel Breeze with Inertia + React
- ✅ Configure MySQL in `.env`
- ✅ Run base migrations (`php artisan migrate`)
- ✅ Import custom schema via phpMyAdmin SQL tab

### Phase 2 — Scaffold Files ✅

- ✅ Generate all Models via `php artisan make:model`
- ✅ Generate all Controllers via `php artisan make:controller`
- ✅ Generate Middleware via `php artisan make:middleware`
- ✅ Generate Form Requests via `php artisan make:request`
- ✅ Create Services folder and `VaiScoreService.php`
- ✅ Create all Inertia Pages and Components (jsx files)

### Phase 3 — Models & Relationships ✅

- ✅ `User` model — role-based attributes, barangay scope
- ✅ `FacedRecord` model — hasMany FamilyMembers, hasMany AssistanceRecords
- ✅ `FamilyMember` model — hasMany Vulnerabilities, belongsTo FacedRecord
- ✅ `FamilyMemberVulnerability` model — belongsTo FamilyMember
- ✅ `AssistanceRecord` model — belongsTo FacedRecord, belongsTo FamilyMember
- ✅ `SitrepConfig` model — belongsTo User
- ✅ `VaiScoreService` — server-side VAI calculation logic

### Phase 4 — Auth & Role Middleware ✅

- ✅ Laravel Breeze handles login / logout / registration
- ✅ Custom middleware: `EnsureRole` to restrict routes by role
- ✅ `HandleInertiaRequests` shares `auth.user` and `role` to all pages
- ✅ Flash messages shared via Inertia props

### Phase 5 — Controllers & Routes ✅

- ✅ `DashboardController` — aggregate stats per role scope
- ✅ `FacedRecordController` — full CRUD + status transitions
- ✅ `FamilyMemberController` — nested store / update / destroy
- ✅ `AssistanceRecordController` — create, approve, lock
- ✅ `SitRepController` — report builder + Gemini AI proxy
- ✅ `UserManagementController` — admin-only account management
- ✅ `ReportController` — filtered operational reports
- ✅ `ProfileController` — Breeze profile management
- ✅ All routes defined in `routes/web.php` with role middleware

### Phase 6 — Inertia Pages (React) ✅

- ✅ `Layout.jsx` — collapsible sidebar, top bar, flash messages
- ✅ `Dashboard.jsx` — stat cards + Recharts bar and pie charts
- ✅ `RecordsList.jsx` — paginated table with search and status filter
- ✅ `FacedForm.jsx` — full multi-section form with dynamic family members
- ✅ `SitRep.jsx` — 3-step report builder with AI summary generation
- ✅ `UserManagement.jsx` — account CRUD (admin only)
- ✅ `Reports.jsx` — filterable barangay and household report with print

### Phase 7 — Landing Page & Auth Pages ✅

- ✅ `Welcome.jsx` — dark landing page with Barangay Staff and Admin portal cards
- ✅ `Auth/Login.jsx` — role-aware login page matching system style
- ✅ `GuestLayout.jsx` — shared layout for Breeze password reset/email verify pages
- ✅ Role hint passed via URL param (`?role=staff` or `?role=admin`)
- ✅ Portal cards link to login with role pre-selected
- ✅ Back to portal link on login page

### Phase 8 — Registration & Auth Fix ✅

- ✅ `Auth/Register.jsx` — custom dark-themed registration page matching system style
- ✅ `RegisteredUserController.php` — updated to save `role` and `assigned_barangay`
- ✅ Role selector (Barangay Staff / MSWDO Admin) on registration form
- ✅ Assigned barangay dropdown conditionally shown for Barangay Staff
- ✅ Register link added to Login page, Login link added to Register page
- ✅ Fixed: SQL-inserted users failed login — use register form instead for accurate bcrypt hash

### Phase 9 — Bug Fixes & Debugging 🔄 CURRENT

- ✅ Fixed: `Layout.jsx` was empty due to `type nul` creation — repasted full export default
- ✅ Fixed: Duplicate `/` route removed from `web.php`
- ✅ Fixed: `/` now shows Welcome to guests, redirects auth users to dashboard
- Verify VAI auto-calculates correctly on every record save
- Enforce status transition rules (Submitted → Validated / Returned)
- Barangay Staff scoped to their assigned barangay only

### Phase 10 — File Upload & Print

- Store signed form uploads via Laravel Storage (local or S3)
- Print-friendly CSS already designed in prototype — port directly
- Optional: PDF export via `barryvdh/laravel-dompdf`

### Phase 11 — SitRep AI Integration

- Proxy Gemini API calls through a Laravel controller to protect API keys
- `POST /api/sitrep/generate-summary` → calls Gemini, returns summary text
- Add `GEMINI_API_KEY` to `.env` and `config/services.php`

---

## UI Style Guide

All pages follow a consistent design language ported from the original prototype. Strictly follow these conventions when building new pages or components.

### Color Palette

| Token           | Value                     | Usage                                |
| --------------- | ------------------------- | ------------------------------------ |
| Primary         | `orange-600` / `#ea580c`  | Buttons, active nav, badges, accents |
| Primary Hover   | `orange-700`              | Button hover states                  |
| Auth Background | `slate-950`               | Login, Register, Welcome pages       |
| Sidebar         | `slate-900`               | Sidebar, dark panels, table headers  |
| Page Background | `slate-50`                | Main content area                    |
| Card Background | `white`                   | All content cards                    |
| Borders         | `slate-100` / `slate-200` | Cards and inputs                     |
| Muted Text      | `slate-400` / `slate-500` | Labels, subtitles, placeholders      |

### Typography Rules

- Labels: `text-[10px] font-black uppercase tracking-widest`
- Section titles: `text-lg font-black uppercase tracking-tight`
- Page titles: `text-2xl font-black uppercase tracking-tighter`
- Table cells: `text-sm font-bold`
- Serial numbers: `font-mono text-[9px] tracking-widest`

### Border Radius Scale

- Auth cards: `rounded-[2.5rem]`
- Content cards / form sections: `rounded-[2rem]` or `rounded-3xl`
- Buttons: `rounded-xl` or `rounded-2xl`
- Badges / pills: `rounded-full` or `rounded-lg`
- Input fields: `rounded-lg` (forms) / `rounded-2xl` (auth)

### Standard Form Input

```jsx
className =
    "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-bold text-black focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed";
```

### Auth Page Input (dark theme)

```jsx
className =
    "w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all";
```

### Button Variants

```jsx
// Primary orange
"bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95";

// Dark / secondary
"bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest";

// Danger icon button
"text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all";
```

### Status Badges

```jsx
Validated  -> bg-emerald-600 text-white
Submitted  -> bg-orange-600 text-white
Returned   -> bg-amber-500 text-white
```

### Content Card

```jsx
className =
    "bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all";
```

### Form Section Header

```jsx
<div className="flex items-center space-x-3 border-b-2 border-orange-500 pb-3 mb-6">
    <Icon size={22} className="text-orange-600" />
    <span className="text-lg font-black uppercase tracking-tight text-black">
        Section Title
    </span>
</div>
```

### Auth Page Background (Welcome, Login, Register)

```jsx
<div className="min-h-screen bg-slate-950 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />
</div>
```

### Table Structure

```jsx
<thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
<tbody className="divide-y divide-slate-100">
<tr className="hover:bg-slate-50 transition-colors font-bold">
```

### Flash Messages

Shared globally via Inertia props. Use `flash.success` and `flash.error` from `usePage().props`.
Styled green for success, red for error, dismissible with X button.

## Local Setup

```bash
# 1. Clone and install
composer install
npm install

# 2. Configure environment
cp .env.example .env
php artisan key:generate

# 3. Set database credentials in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbaza_faced
DB_USERNAME=root
DB_PASSWORD=

# 4. Run Laravel base migrations
php artisan migrate

# 5. Import custom schema
# Paste barbaza_faced_schema.sql in phpMyAdmin SQL tab

# 6. Start development servers
php artisan serve
npm run dev
```

---

## Project Structure

```
barbaza-faced/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php
│   │   │   ├── FacedRecordController.php
│   │   │   ├── FamilyMemberController.php
│   │   │   ├── AssistanceRecordController.php
│   │   │   ├── SitRepController.php
│   │   │   ├── UserManagementController.php
│   │   │   ├── ReportController.php
│   │   │   └── ProfileController.php
│   │   └── Middleware/
│   │       ├── EnsureRole.php
│   │       └── HandleInertiaRequests.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── FacedRecord.php
│   │   ├── FamilyMember.php
│   │   ├── FamilyMemberVulnerability.php
│   │   ├── AssistanceRecord.php
│   │   └── SitrepConfig.php
│   └── Services/
│       └── VaiScoreService.php
├── database/
│   └── migrations/
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Welcome.jsx
│       │   ├── Dashboard.jsx
│       │   ├── RecordsList.jsx
│       │   ├── FacedForm.jsx
│       │   ├── SitRep.jsx
│       │   ├── UserManagement.jsx
│       │   ├── Reports.jsx
│       │   └── Auth/
│       │       └── Login.jsx
│       ├── Components/
│       │   ├── Layout.jsx
│       │   └── AssistanceModal.jsx
│       └── types.ts
└── routes/
    ├── web.php
    └── auth.php
```

---

_Municipality of Barbaza, Antique — MSWDO Digital Systems_
# FACED
