# Backend Architecture — ISKCON Amritsar Course Portal (PIHEDelivery1)

> **Stack:** Node.js 20 LTS + Express.js · MongoDB + Mongoose 7  
> **Base URL:** `http://localhost:5000/api/v1`  
> **Auth:** JWT (access: 15m, refresh: 7d) + Google OAuth 2.0 via Passport.js  
> **Generated:** 2026-04-18 | **RBAC Update:** 2026-04-18

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Global Conventions](#2-global-conventions)
3. [Module 1 — Authentication](#3-module-1--authentication)
4. [Module 2 — Courses](#4-module-2--courses)
5. [Module 3 — Enrollments](#5-module-3--enrollments)
6. [Module 4 — Exams](#6-module-4--exams)
7. [Module 5 — Submissions](#7-module-5--submissions)
8. [Module 6 — Results](#8-module-6--results)
9. [Module 7 — Certificates](#9-module-7--certificates)
10. [Module 8 — Admin Dashboard & Management](#10-module-8--admin-dashboard--management)
11. [Module 9 — Temple Registration](#11-module-9--temple-registration)
12. [Module 10 — OTP](#12-module-10--otp)
13. [Module 11 — File Uploads](#13-module-11--file-uploads)
14. [Module 12 — Temple User Duplicate Check](#14-module-12--temple-user-duplicate-check)
15. [Module 13 — RBAC (Role-Based Access Control)](#15-module-13--rbac)
16. [Middleware Architecture](#16-middleware-architecture)
17. [Error Handling](#17-error-handling)
18. [Environment Variables](#18-environment-variables)
19. [Gap Analysis](#19-gap-analysis)

---

## 1. Folder Structure

```
SourceCode/backend/
├── server.js                     ← Express app entry point
├── .env                          ← Environment variables (never commit)
├── package.json
│
└── src/
    ├── config/
    │   ├── db.js                 ← MongoDB connection via Mongoose
    │   ├── jwt.js                ← signAccessToken, signRefreshToken, verifyToken
    │   └── passport.js           ← Google OAuth 2.0 strategy
    │
    ├── models/
    │   ├── User.js               ← LMS users (students, examiners, admins)
    │   ├── Course.js             ← Courses with embedded lessons/materials
    │   ├── Enrollment.js         ← Student-course enrollment progress
    │   ├── Exam.js               ← Exams with embedded questions
    │   ├── Submission.js         ← Student exam answers (online + offline)
    │   ├── Result.js             ← Evaluated results with admin approval gate
    │   ├── Certificate.js        ← Issued PDF certificates
    │   ├── Role.model.js         ← ✨ RBAC: named role definitions
    │   ├── UserRole.model.js     ← ✨ RBAC: user→role junction
    │   ├── Module.model.js       ← ✨ RBAC: navigable screens/menus
    │   ├── Feature.model.js      ← ✨ RBAC: UI sections within modules
    │   ├── Action.model.js       ← ✨ RBAC: system capability definitions
    │   ├── RolePermission.model.js ← ✨ RBAC: role×module×feature permission matrix
    │   ├── Temple.model.js       ← Temple registration document
    │   ├── TempleUser.model.js   ← Temple President/VP accounts
    │   ├── OtpVerification.model.js ← Time-limited OTP records
    │   ├── AuditLog.model.js     ← Immutable event log
    │   ├── Counter.model.js      ← Atomic sequence counters
    │   └── Document.model.js     ← File upload metadata
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── courseRoutes.js
    │   ├── enrollmentRoutes.js
    │   ├── examRoutes.js
    │   ├── submissionRoutes.js
    │   ├── resultRoutes.js
    │   ├── certificateRoutes.js
    │   ├── adminRoutes.js
    │   ├── rbacRoutes.js         ← ✨ RBAC management endpoints
    │   ├── templeRoutes.js
    │   ├── otpRoutes.js
    │   ├── uploadRoutes.js
    │   └── templeUserRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── courseController.js
    │   ├── enrollmentController.js
    │   ├── examController.js
    │   ├── submissionController.js
    │   ├── resultController.js
    │   ├── certificateController.js
    │   ├── adminController.js
    │   ├── rbacController.js     ← ✨ RBAC: thin controller for RBAC endpoints
    │   ├── templeController.js
    │   ├── otpController.js
    │   ├── uploadController.js
    │   └── templeUserController.js
    │
    ├── services/
    │   ├── authService.js        ← Register, login, OAuth, token refresh
    │   ├── courseService.js      ← Course CRUD, lesson management
    │   ├── enrollmentService.js  ← Enroll, progress tracking
    │   ├── examService.js        ← Exam CRUD, question builder
    │   ├── submissionService.js  ← Submit answers, upload PDF
    │   ├── resultService.js      ← Evaluate, approve
    │   ├── certificateService.js ← PDFKit certificate generation
    │   ├── adminService.js       ← Dashboard aggregations, reports
    │   ├── rbacService.js        ← ✨ Permission resolution, role assignment, seed
    │   ├── templeService.js      ← Multi-step registration, MongoDB transactions
    │   ├── otpService.js         ← Generate, send, verify OTP
    │   └── uploadService.js      ← Multer handling, Document model creation
    │
    ├── middleware/
    │   ├── authenticate.js       ← JWT Bearer token verification
    │   ├── authorize.js          ← Legacy role string check (admin/examiner/student)
    │   ├── rbac.js               ← ✨ Enterprise RBAC: module + feature + action gates
    │   ├── validate.js           ← Zod/Joi schema validation
    │   ├── rateLimiter.js        ← authLimiter, apiLimiter, otpLimiter
    │   ├── errorHandler.js       ← Global async error handler
    │   └── upload.js             ← Multer configuration
    │
    ├── validators/
    │   ├── authValidator.js      ← Zod: registerSchema, loginSchema
    │   ├── courseValidator.js    ← Zod: courseSchema
    │   ├── examValidator.js      ← Joi: exam step schemas
    │   ├── rbacValidator.js      ← ✨ Zod: assignRoleSchema, updatePermissionSchema
    │   └── templeValidator.js    ← Joi: step 1/2/3 schemas
    │
    ├── seeders/
    │   └── seedRBAC.js           ← ✨ Seeds roles, modules, features, actions, default permissions
    │
    └── utils/
        ├── ApiError.js           ← Custom error class with statusCode
        ├── ApiResponse.js        ← Standardised response wrapper
        ├── asyncHandler.js       ← try/catch wrapper for controllers
        └── generateStudentId.js  ← Atomic counter-based ID generation
```

---

## 2. Global Conventions

### Response Envelope

**Success:**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "errors": [{ "field": "fieldName", "message": "what went wrong" }]
}
```

### Authentication

Protected routes require `Authorization: Bearer <accessToken>` header. The refresh token is stored as an **httpOnly cookie** (`refreshToken`) and never exposed in response bodies.

### Rate Limits

| Limiter | Applies To | Max Requests | Window |
|---------|-----------|--------------|--------|
| `authLimiter` | POST /auth/register, /login | 10 | 15 min |
| `apiLimiter` | All /courses routes | 100 | 15 min |
| `otpLimiter` | POST /otp/send, /verify | 5 | 10 min |
| `registrationLimiter` | POST /temples/step, /register | 20 | 15 min |
| `uploadLimiter` | POST /uploads | 30 | 15 min |

### Role Definitions

The system uses a **two-tier role model**: a legacy string enum for fast coarse-grained checks, and a full RBAC permission matrix for fine-grained control.

| Role Slug | Display Name | Domain | Coarse Access |
|-----------|-------------|--------|--------------|
| `student` | Student | LMS | Enroll, view courses, submit exams, view own results |
| `examiner` | Examiner | LMS | View assigned submissions, evaluate submissions |
| `admin` | Administrator | LMS | Full access to all LMS management endpoints |
| `PRESIDENT` | Temple President | TEMPLE | Temple Registration — full access to own temple |
| `VICE_PRESIDENT` | Temple Vice President | TEMPLE | Temple Registration — scoped by role_permissions |
| `SUPER_ADMIN` | Super Administrator | SYSTEM | Cross-domain super user; can manage all roles |

> Fine-grained per-module, per-feature, and field-level access is resolved via `role_permissions`. See [Module 13 — RBAC](#15-module-13--rbac).

---

## 3. Module 1 — Authentication

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| POST | `/api/v1/auth/register` | No | — | Register new student account |
| POST | `/api/v1/auth/login` | No | — | Login with email/password |
| POST | `/api/v1/auth/logout` | Bearer | Any | Invalidate session |
| POST | `/api/v1/auth/refresh` | Cookie | — | Exchange refresh token for new access token |
| GET | `/api/v1/auth/me` | Bearer | Any | Get current user profile |
| GET | `/api/v1/auth/google` | No | — | Redirect to Google OAuth consent |
| GET | `/api/v1/auth/google/callback` | OAuth | — | Handle Google OAuth callback |

### POST /auth/register

**Request Body:**
```json
{ "name": "Priya Sharma", "email": "priya@example.com", "password": "Secure@123", "phone": "9876543210" }
```

**Validation (Zod):** `name` min 2 chars, `email` valid, `password` min 8 chars with upper+lower+digit, `phone` optional 10-digit Indian number.

**Business Logic:**
1. Zod validates request body
2. Check email uniqueness in `users` → 409 if duplicate
3. Call `generateStudentId()` → atomic counter increment → `PIHE-YYYY-NNNN` format
4. Create user — password auto-bcrypted via pre-save hook (12 rounds)
5. **Assign default `student` role** via `rbacService.assignRole(userId, 'student', 'User')` — creates `user_roles` document
6. Sign access token (15m) + refresh token (7d)
7. Store refresh token on user document
8. Set refresh token as httpOnly cookie (7d)
9. Return `{ user, accessToken }` with 201

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "_id": "...", "studentId": "PIHE-2026-0042", "name": "Priya Sharma", "email": "...", "role": "student", "isActive": true },
    "accessToken": "eyJ..."
  }
}
```

**DB Operations:** `users.findOne` (email check) → `users.create` → `user_roles.create` (RBAC assignment) → `users.save` (refresh token)

---

### POST /auth/login

**Business Logic:**
1. Fetch user with `+password +refreshToken` (select:false fields)
2. Throw 401 if not found or no password (Google-only account)
3. `bcrypt.compare` → throw 401 on mismatch
4. Throw 403 if `isActive = false`
5. Issue new access + refresh tokens

---

### POST /auth/refresh

Reads `refreshToken` cookie → verifies against `JWT_REFRESH_SECRET` → validates stored token matches (prevents reuse after logout) → issues new access token.

---

### Google OAuth Flow

1. `GET /auth/google` → Passport redirects to Google consent screen
2. Google redirects to `GET /auth/google/callback`
3. Passport strategy resolves profile
4. `handleGoogleUser()`: find by `googleId` or `email`, create student if new
5. **On new user creation:** `rbacService.assignRole(userId, 'student', 'User')` automatically assigns `student` RBAC role
6. Issue tokens → redirect to `{CLIENT_URL}/auth/callback?token=...&role=...`

**Student ID format:** `PIHE-YYYY-NNNN` (e.g., `PIHE-2026-0042`)

---

### Updated JWT Payload with RBAC Context

The JWT access token payload includes a `roleId` snapshot for fast middleware checks:

```json
{
  "sub": "664a1f2e3b9c4d0012ab3456",
  "roleId": "student",
  "userModel": "User",
  "iat": 1712345678,
  "exp": 1712346578
}
```

The `roleId` in the token is used for fast coarse-grained `authorize()` checks. Fine-grained `rbac()` middleware resolves the full permission set from the database (with Redis caching).

---

## 4. Module 2 — Courses

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/courses` | No | — | List published courses (paginated, filtered) |
| GET | `/api/v1/courses/:id` | No | — | Get full course with lessons |
| POST | `/api/v1/courses` | Bearer | admin | Create new course |
| PUT | `/api/v1/courses/:id` | Bearer | admin | Update course |
| DELETE | `/api/v1/courses/:id` | Bearer | admin | Delete course |

### GET /courses — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | Number | Default: 1 |
| `limit` | Number | Default: 12 |
| `search` | String | Partial title match (case-insensitive regex) |
| `level` | String | `Beginner` \| `Intermediate` \| `Advanced` |
| `isPaid` | Boolean | Filter free vs paid |
| `featured` | String | `"true"` for featured courses |
| `category` | String | Exact match |
| `sort` | String | `newest` (default) \| `popular` |

**Business Logic:** Builds dynamic MongoDB query from `{ isPublished: true }` + optional filters. Returns results with `lessons.content` and `studyMaterials.fileUrl` **stripped** for bandwidth efficiency.

### POST /courses

**Request Body:**
```json
{
  "title": "Intro to Bhagavad Gita",
  "description": "...",
  "category": "Scriptures",
  "level": "Beginner",
  "isPaid": false,
  "price": 0,
  "lessons": [{ "title": "Chapter 1", "videoUrl": "...", "duration": 45, "order": 1 }],
  "studyMaterials": [{ "title": "Reference PDF", "fileUrl": "...", "fileType": "pdf" }],
  "tags": ["gita", "scripture"],
  "isPublished": false,
  "isFeatured": false
}
```

---

## 5. Module 3 — Enrollments

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/enrollments/my` | Bearer | student | Get all my enrollments |
| POST | `/api/v1/enrollments` | Bearer | student | Enroll in a course |
| PATCH | `/api/v1/enrollments/:id/progress` | Bearer | student | Mark lesson as completed |

### POST /enrollments

**Request:** `{ "courseId": "..." }`

**Business Logic:**
1. Verify course exists → 404 if not
2. Check for existing enrollment → 409 if duplicate
3. Create enrollment with `progress: 0, status: "active"`

### PATCH /enrollments/:id/progress

**Request:** `{ "lessonId": "..." }`

**Business Logic:**
1. Find enrollment by ID; verify belongs to logged-in student
2. Add `lessonId` to `completedLessons` (idempotent — `$addToSet`)
3. Fetch total lesson count from parent course
4. Recalculate `progress = round(completedLessons.length / totalLessons * 100)`
5. Auto-set `status = "completed"` and `progress = 100` if all lessons done

---

## 6. Module 4 — Exams

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/exams/course/:courseId` | Bearer | student | Get published exam for a course |
| POST | `/api/v1/exams` | Bearer | admin | Create exam (**MISSING — see Gap Analysis**) |
| GET | `/api/v1/exams` | Bearer | admin | List all exams (**MISSING — see Gap Analysis**) |
| PUT | `/api/v1/exams/:id` | Bearer | admin | Update exam (**MISSING — see Gap Analysis**) |
| DELETE | `/api/v1/exams/:id` | Bearer | admin | Delete exam (**MISSING — see Gap Analysis**) |

### GET /exams/course/:courseId

**Business Logic:**
1. `findOne({ course: courseId, isPublished: true })` → 404 if not found
2. Transform questions: rename `questionText` → `text`, convert `options` strings to `{ _id, text }` objects
3. **`correctAnswer` is NEVER returned** — prevents cheating

**Sample Response:**
```json
{
  "data": {
    "_id": "...",
    "title": "Chapter 1 Assessment",
    "type": "online",
    "duration": 60,
    "totalMarks": 50,
    "passingMarks": 25,
    "questions": [
      { "_id": "...", "text": "Who narrates the Gita?", "type": "mcq", "marks": 5,
        "options": [{ "_id": "..._0", "text": "Arjuna" }, { "_id": "..._1", "text": "Sanjaya" }] }
    ]
  }
}
```

---

## 7. Module 5 — Submissions

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| POST | `/api/v1/submissions` | Bearer | student | Submit online exam answers |
| POST | `/api/v1/submissions/upload` | Bearer | student | Upload offline answer paper (PDF) |
| GET | `/api/v1/submissions/assigned` | Bearer | examiner/admin | Get submissions assigned to examiner |
| GET | `/api/v1/submissions/:id` | Bearer | examiner/admin | Get single submission with full details |
| PATCH | `/api/v1/submissions/:id/evaluate` | Bearer | examiner | Examiner submits marks and remarks |

### POST /submissions — Online Exam

**Request:**
```json
{
  "examId": "...",
  "answers": [
    { "questionId": "...", "selectedOption": "Sanjaya", "answerText": null },
    { "questionId": "...", "selectedOption": null, "answerText": "Karma yoga is..." }
  ]
}
```

**Business Logic:**
1. Verify exam exists → 404
2. Check for duplicate online submission → 409
3. Denormalise `course` from exam
4. Create submission with `status: "pending"`

### POST /submissions/upload — Offline Paper

**Request:** `multipart/form-data` with `paper` file + `examId`/`courseId` fields

**Business Logic:**
1. Multer validates file type (PDF/JPG/PNG), max 10 MB
2. Prevent duplicate offline submissions
3. If `examId` absent, find published exam for `courseId`
4. Create submission with `uploadedFile` path and `type: "offline"`

### PATCH /submissions/:id/evaluate

**Request:** `{ "marksObtained": 42, "remarks": "Excellent work." }`

**Business Logic:**
1. Verify submission exists; verify `assignedExaminer === req.user._id` → 403 otherwise
2. Throw 400 if `status === "evaluated"` (already done)
3. Determine `isPassed = marksObtained >= exam.passingMarks`
4. Update submission `status → "evaluated"`
5. Create `Result` document (percentage auto-calculated in pre-save hook)

---

## 8. Module 6 — Results

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/results/my` | Bearer | student | Get logged-in student's results |

**Sample Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "courseTitle": "Bhagavad Gita Assessment",
      "obtainedMarks": 42,
      "totalMarks": 50,
      "percentage": 84,
      "status": "pass",
      "remarks": "Excellent performance.",
      "examinerName": "Prabhu Das",
      "evaluatedAt": "2026-04-10T11:00:00.000Z"
    }
  ]
}
```

---

## 9. Module 7 — Certificates

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/certificates/verify/:certId` | No | — | Public certificate verification |
| GET | `/api/v1/certificates/my` | Bearer | student | Get student's own certificates |
| GET | `/api/v1/certificates/:id/download` | Bearer | student | Download certificate PDF |

### Certificate Generation (Service Layer)

Certificate PDFs are generated with **PDFKit** (A4 landscape, ISKCON saffron/gold branding) and stored at `./generated-certs/`.

```
Certificate Content:
- ISKCON Amritsar letterhead
- Student name (large, orange)
- Student ID
- Course title
- Score: X/Y (Z%)
- Issue date
- Certificate ID (e.g., CERT-2026-A1B2C3D4)
- Verification URL: {CLIENT_URL}/verify/{certId}
```

**Generation Trigger:** Called automatically by `PATCH /admin/results/:id/approve` when admin approves a passing result.

### GET /certificates/:id/download

Returns binary PDF stream:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="ISKCON-Certificate-<certId>.pdf"
```

Security: Student can only download their own certificates (student ID verified in query).

---

## 10. Module 8 — Admin Dashboard & Management

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/admin/dashboard` | Bearer | admin | KPIs + enrollment trend |
| GET | `/api/v1/admin/students` | Bearer | admin | Paginated student list |
| PATCH | `/api/v1/admin/students/:id/toggle` | Bearer | admin | Toggle student active/inactive |
| GET | `/api/v1/admin/examiners` | Bearer | admin | List all examiners |
| POST | `/api/v1/admin/examiners` | Bearer | admin | Create examiner account |
| PATCH | `/api/v1/admin/examiners/:id/toggle` | Bearer | admin | Toggle examiner active/inactive |
| GET | `/api/v1/admin/submissions` | Bearer | admin | Paginated submissions list |
| PATCH | `/api/v1/admin/submissions/:id/assign` | Bearer | admin | Assign submission to examiner |
| GET | `/api/v1/admin/results` | Bearer | admin | All results (paginated) |
| GET | `/api/v1/admin/results/pending` | Bearer | admin | Passing results awaiting approval |
| PATCH | `/api/v1/admin/results/:id/approve` | Bearer | admin | Approve result + auto-generate certificate |
| GET | `/api/v1/admin/certificates` | Bearer | admin | All issued certificates |
| GET | `/api/v1/admin/reports` | Bearer | admin | Aggregated analytics |
| GET | `/api/v1/admin/export` | Bearer | admin | CSV data download |

### GET /admin/dashboard — Response Structure

```json
{
  "data": {
    "kpis": {
      "totalStudents": 248,
      "totalExaminers": 12,
      "totalCourses": 18,
      "totalEnrollments": 510,
      "pendingSubmissions": 34,
      "pendingApprovals": 7,
      "totalCertificates": 125
    },
    "recentEnrollments": [{ "student": { "name": "...", "studentId": "..." }, "course": { "title": "..." }, "enrolledAt": "..." }],
    "monthlyEnrollments": [{ "_id": { "year": 2026, "month": 1 }, "count": 45 }]
  }
}
```

**DB:** Multiple `aggregate` pipelines across `users`, `enrollments`, `submissions`, `results`, `certificates`.

### PATCH /admin/results/:id/approve

**Business Logic:**
1. Load result with student and submission
2. Throw 400 if already approved or student failed
3. Set `approvedByAdmin = true`, `approvedAt = now()`
4. Call `certService.generateCertificate()` → PDFKit PDF → save to `./generated-certs/` → insert Certificate document
5. Certificate generation failure is **non-fatal** — result saved regardless

### GET /admin/export

**Query Param:** `type=students|results|certificates`

Returns binary CSV download. Values are RFC-4180 escaped (double-quote escaping).

---

## 11. Module 9 — Temple Registration

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| POST | `/api/v1/temples/step` | No | — | Save one step of multi-step registration |
| POST | `/api/v1/temples/validate-step` | No | — | Validate step data without saving |
| POST | `/api/v1/temples/register` | No | — | Final submission (MongoDB transaction) |
| GET | `/api/v1/temples/:id` | No | — | Fetch temple by ID |

### POST /temples/step — Steps

**Step 1 (Temple Details):** `temple_name`, `gst_number`, `address` object, `logo_doc_id`
**Step 2 (President):** `temple_id`, `name`, `mobile`, `mobile_verified: true`, `pan_number`, `aadhaar_number`, `email`, `photo_doc_id`, `id_card_doc_id`
**Step 3 (Vice-President):** Same as Step 2

**Step 1 Logic:** GST uniqueness check → upsert DRAFT temple → return `{ temple_id, current_step: 2 }`

**Steps 2–3 Logic:** Find draft by `temple_id` → update `president`/`vice_president` sub-doc → advance `current_step`

### POST /temples/register — Final Submission

**Business Logic (MongoDB Transaction):**
1. Load draft temple → 404 if not found
2. Throw 409 if `status ≠ DRAFT` (prevents duplicate)
3. Validate all required fields complete (`_assertTempleComplete`)
4. Validate President ≠ Vice-President (cross-person PAN/mobile/email uniqueness)
5. Run global duplicate checks via `templeUserRepository`
6. Validate all referenced document IDs exist in `documents`
7. **Transaction block:**
   - Generate unique usernames (firstName + last4 of mobile), bcrypt-hash temp passwords, generate meet IDs
   - Create two `TempleUser` documents (President + VP)
   - **Assign RBAC roles:** `rbacService.assignRole(presidentId, 'PRESIDENT', 'TempleUser')` and `rbacService.assignRole(vpId, 'VICE_PRESIDENT', 'TempleUser')`
   - Update temple `status → SUBMITTED`, link user IDs + meet IDs
   - Link all uploaded docs to temple via `document.temple_id`
   - Write `AuditLog` for `TEMPLE_SUBMITTED`
8. Send credential emails to President + VP (non-critical — failures logged, not thrown)
9. Return safe fields only (passwords NOT in response — emailed only)

---

## 12. Module 10 — OTP

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| POST | `/api/v1/otp/send` | No | — | Send OTP to mobile number |
| POST | `/api/v1/otp/verify` | No | — | Verify mobile OTP |

### POST /otp/send

Rate limited: 5 requests / 10 min.

**Business Logic:**
1. Validate 10-digit mobile
2. Generate 6-digit OTP → bcrypt hash → store in `otpverifications` with TTL expiry (~10 min)
3. Send SMS in production; return OTP in `data.otp` in dev/test environments

### POST /otp/verify

**Business Logic:**
1. Find latest unused, unexpired OTP for mobile + purpose
2. Increment `attempts` counter → throw 429 if max attempts (3) exceeded
3. Compare bcrypt hash
4. On match: set `is_used = true`
5. On mismatch: throw 401 with remaining attempts count

---

## 13. Module 11 — File Uploads

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| POST | `/api/v1/uploads` | No | — | Upload file (logo, photo, id_card) |

**Request:** `multipart/form-data` with `file` + `file_type` (query/body/header)

**Business Logic:**
1. `uploadLimiter`: max 30 uploads / 15 min
2. Dynamic Multer middleware selects subfolder based on `file_type` (`logos/`, `photos/`, `id_cards/`)
3. Validate `file_type` enum (`logo` \| `photo` \| `id_card`)
4. Create `Document` record in DB → return `_id` (stored as `photo_doc_id`/`id_card_doc_id`/`logo_doc_id`)

**Allowed:** PDF, JPG, JPEG, PNG, GIF — max 5 MB

---

## 14. Module 12 — Temple User Duplicate Check

### GET /api/v1/temple-users/check-duplicate

**Query Params:** `pan`, `mobile`, `email` (at least one)

**Business Logic:** Individual existence queries for each provided field. Returns boolean flag per field.

```json
{ "data": { "pan_exists": true, "mobile_exists": false, "email_exists": false } }
```

---

## 15. Module 13 — RBAC

> **Purpose:** Provides enterprise-grade Role-Based Access Control with module-level, feature-level, action-based, and field-level permission management. All permission data is stored in MongoDB (`role_permissions`) and resolved at request time (with Redis caching in production).

### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|---------|------|------|-------------|
| GET | `/api/v1/rbac/permissions/me` | Bearer | Any | Get current user's full permission set (used by frontend to drive menu + UI) |
| GET | `/api/v1/rbac/modules` | Bearer | admin/super_admin | List all modules |
| GET | `/api/v1/rbac/features` | Bearer | admin/super_admin | List all features (optionally filter by moduleId) |
| GET | `/api/v1/rbac/roles` | Bearer | admin/super_admin | List all roles |
| GET | `/api/v1/rbac/role-permissions/:roleId` | Bearer | admin/super_admin | Get full permission matrix for a role |
| PUT | `/api/v1/rbac/role-permissions/:roleId` | Bearer | super_admin | Upsert permission for a role×module×feature triple |
| POST | `/api/v1/rbac/users/:userId/assign-role` | Bearer | admin/super_admin | Assign a role to a user |
| DELETE | `/api/v1/rbac/users/:userId/revoke-role/:roleId` | Bearer | admin/super_admin | Revoke a role from a user |
| GET | `/api/v1/rbac/users/:userId/roles` | Bearer | admin/super_admin | List all active roles for a user |

---

### GET /rbac/permissions/me

**Purpose:** Single endpoint the frontend calls on login and page load to get the user's complete permission set. Drives dynamic sidebar, feature visibility, button gating, and field-level controls.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "664a...",
    "roles": ["student"],
    "permissions": [
      {
        "moduleId": "courses",
        "moduleName": "Course Management",
        "route": "/admin/courses",
        "featureId": null,
        "canView": true,
        "canCreate": false,
        "canEdit": false,
        "canDelete": false,
        "canApprove": false,
        "canDownload": true,
        "fieldLevel": {}
      },
      {
        "moduleId": "temple-registration",
        "moduleName": "Temple Registration",
        "route": "/temple-registration",
        "featureId": "president-details",
        "featureName": "President Details Section",
        "canView": true,
        "canCreate": true,
        "canEdit": true,
        "canDelete": false,
        "canApprove": false,
        "canDownload": false,
        "fieldLevel": {
          "email": "READ_ONLY",
          "mobile": "EDITABLE",
          "pan_number": "READ_ONLY",
          "aadhaar_number": "HIDDEN"
        }
      }
    ]
  }
}
```

**Business Logic (`rbacService.getPermissionsForUser`):**
1. Query `user_roles` where `userId = req.user._id`, `isActive = true`, `expiresAt > now()` (or null)
2. Collect all `roleId` values
3. Query `role_permissions` where `roleId IN [...roles]`
4. Populate `moduleId` from `modules` and `featureId` from `features`
5. Merge permissions: if a user has multiple roles, apply `OR` logic across boolean flags (most-permissive-wins)
6. Return structured array
7. **Redis cache:** cache result at `rbac:permissions:{userId}` for 5 minutes; invalidate on role or permission changes

---

### PUT /rbac/role-permissions/:roleId

**Purpose:** Super admin can update or create a permission entry for a role×module×feature combination.

**Request Body:**
```json
{
  "moduleId": "temple-registration",
  "featureId": "president-details",
  "permissions": {
    "canView": true,
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canApprove": false,
    "canDownload": false
  },
  "fieldLevel": {
    "email": "READ_ONLY",
    "mobile": "EDITABLE",
    "pan_number": "READ_ONLY"
  }
}
```

**Business Logic:**
1. Validate `roleId` exists in `roles` collection → 404 if not
2. Validate `moduleId` exists in `modules` → 404 if not
3. Validate `featureId` (if provided) belongs to given `moduleId` → 400 if mismatch
4. Upsert `role_permissions` on `{ roleId, moduleId, featureId }` composite key
5. **Invalidate Redis cache** for all users with this role: `rbac:permissions:*` (pattern flush)
6. Write `AuditLog`: action `PERMISSION_UPDATED`, before/after diff

---

### rbacService.js — Core Service

```js
// getPermissionsForUser(userId, userModel)
//   1. Fetch active user_roles for user
//   2. Collect all roleIds
//   3. Fetch all role_permissions for those roleIds
//   4. Populate module + feature names
//   5. Merge multi-role permissions (OR logic for booleans)
//   6. Return permission array

// assignRole(userId, roleId, userModel, grantedBy = null)
//   1. Check role exists in roles collection
//   2. Check not already assigned (user_roles uniqueness)
//   3. Insert user_roles document
//   4. Invalidate user's permission cache
//   5. Write ROLE_ASSIGNED audit log

// revokeRole(userId, roleId, userModel)
//   1. Set user_roles.isActive = false (soft revoke)
//   2. Invalidate user's permission cache
//   3. Write ROLE_REVOKED audit log

// hasPermission(userId, moduleId, featureId, action)
//   1. getPermissionsForUser() (from cache or DB)
//   2. Find matching permission for module+feature
//   3. Return boolean for given action (canView/canCreate/canEdit...)
```

---

## 16. Middleware Architecture

### authenticate.js

```js
// Reads Authorization: Bearer <token>
// Verifies with JWT_SECRET
// Loads user from DB → attaches to req.user
// Also attaches req.userModel = 'User' | 'TempleUser'
// Throws 401 for missing/expired/invalid token
```

### authorize.js (Legacy Coarse-Grained)

```js
// Usage: authorize('admin', 'examiner')
// Checks req.user.role (string from JWT payload) against allowed roles
// Throws 403 if role not permitted
// Use this for quick role guards; use rbac() for fine-grained control
```

### rbac.js (Enterprise Fine-Grained) ✨ NEW

```js
// Three gate factories — composable and chainable:

// 1. MODULE GATE — can this role access this module at all?
// Usage: rbac.module('temple-registration', 'canView')
// Logic:
//   a. Call rbacService.getPermissionsForUser(req.user._id, req.userModel)
//   b. Find a permission entry where moduleId matches and featureId = null (module-level grant)
//   c. Check the requested action flag (canView/canCreate/canEdit/canDelete/canApprove/canDownload)
//   d. Throw 403 if not permitted with message "Access to module [name] denied"
//   e. Attach resolved permissions to req.modulePermissions for downstream use

// 2. FEATURE GATE — can this role access this specific feature section?
// Usage: rbac.feature('temple-registration', 'president-details', 'canEdit')
// Logic:
//   a. Resolve permissions for user
//   b. Find permission for moduleId + featureId pair
//   c. Fall back to module-level grant if no feature-specific entry found
//   d. Check action flag → 403 if denied
//   e. Attach req.featurePermissions = { fieldLevel, canView, canCreate, ... }

// 3. FIELD-LEVEL SERIALIZER — strip or mask fields based on fieldLevel rules
// Usage: rbac.fields() — used as response middleware
// Logic:
//   a. Reads req.featurePermissions.fieldLevel (set by rbac.feature())
//   b. For each field in response body:
//      - HIDDEN → delete from response object
//      - READ_ONLY → include in response but mark for frontend
//   c. Adds X-Field-Permissions response header with JSON map for frontend use
```

**Full Route Example:**

```js
// Temple registration step 2 — President details
// Only PRESIDENT role can edit president details;
// Some fields are READ_ONLY; aadhaar_number is HIDDEN from VP
router.patch(
  '/temples/step/2',
  authenticate,
  rbac.feature('temple-registration', 'president-details', 'canEdit'),
  validate(presidentStepSchema),
  asyncHandler(templeController.savePresidentStep)
);

// Admin approving a result
// Only admin role with canApprove on certificates module
router.patch(
  '/admin/results/:id/approve',
  authenticate,
  authorize('admin'),                           // fast coarse check
  rbac.module('certificates', 'canApprove'),    // fine-grained RBAC check
  asyncHandler(adminController.approveResult)
);

// Get all submissions — examiner can only see assigned ones (feature gate)
router.get(
  '/submissions/assigned',
  authenticate,
  rbac.feature('exams', 'per-question-marks', 'canView'),
  asyncHandler(submissionController.getAssigned)
);
```

**Combining authorize() + rbac():** Use `authorize()` for fast role-based guards (no DB hit) and `rbac.module()`/`rbac.feature()` for fine-grained checks. The two middleware are designed to be chained and complement each other.

---

### Auth Flow with RBAC (Updated Sequence)

```
POST /auth/login
  │
  ├─ 1. bcrypt.compare password
  ├─ 2. Fetch user.role (legacy string for JWT payload)
  ├─ 3. Sign accessToken: { sub, roleId, userModel }
  ├─ 4. Set httpOnly refreshToken cookie
  └─ 5. Return { user, accessToken }

GET /api/v1/rbac/permissions/me        ← Frontend calls this immediately after login
  │
  ├─ authenticate() → req.user
  ├─ rbacService.getPermissionsForUser()
  │   ├─ Redis cache hit? → return cached
  │   ├─ Cache miss:
  │   │   ├─ user_roles.find({ userId, isActive: true, expiresAt > now })
  │   │   ├─ role_permissions.find({ roleId IN [...roles] }).populate('module, feature')
  │   │   └─ Merge + build permission array
  │   └─ Cache result (5 min TTL)
  └─ Return full permission set to frontend

Subsequent authenticated API call (e.g., PATCH /temples/step/2):
  ├─ authenticate()  → req.user
  ├─ rbac.feature('temple-registration', 'president-details', 'canEdit')
  │   ├─ getPermissionsForUser() (from Redis cache — no extra DB query)
  │   ├─ Find matching permission entry
  │   ├─ Check canEdit = true → allow
  │   └─ Attach fieldLevel map to req.featurePermissions
  ├─ validate(presidentStepSchema)
  └─ templeController.savePresidentStep()
      └─ Strip HIDDEN fields using req.featurePermissions.fieldLevel before saving
```

---

### Field-Level Access Control Logic

```js
// In controller/service — apply field-level rules before saving to DB
function applyFieldLevelAccess(requestBody, fieldLevel) {
  const sanitized = { ...requestBody };
  
  for (const [field, access] of Object.entries(fieldLevel)) {
    if (access === 'HIDDEN') {
      // Field should not be received from this role — delete it
      delete sanitized[field];
    } else if (access === 'READ_ONLY') {
      // Field is read-only — ignore any value sent by client
      delete sanitized[field];
    }
    // 'EDITABLE' fields pass through unchanged
  }
  
  return sanitized;
}

// Usage in templeController.savePresidentStep:
const fieldLevel = req.featurePermissions?.fieldLevel || {};
const sanitizedBody = applyFieldLevelAccess(req.body, fieldLevel);
await templeService.updateStep(templeId, 2, sanitizedBody);
```

---

### validate.js (Zod)

```js
// Usage: validate(registerSchema)
// Parses req.body with Zod schema
// On failure: returns 422 with field-level errors array
// On success: replaces req.body with parsed (typed) data
```

### asyncHandler.js

```js
// Wraps async controller functions
// Passes any thrown errors to next(err) → global error handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
```

### errorHandler.js (Global)

```js
// Last middleware in Express chain
// Handles ApiError instances → uses statusCode + message
// Handles Mongoose ValidationError → formats as field errors
// Handles JWT errors (TokenExpiredError, JsonWebTokenError)
// Falls back to 500 for unhandled errors
```

### rateLimiter.js

Uses `express-rate-limit`. Different limiters for auth, API, OTP, registration, and upload routes.

---

## 17. Error Handling

| HTTP Status | Meaning | When Triggered |
|------------|---------|----------------|
| `400` | Bad Request | Missing fields, invalid enum values, already approved |
| `401` | Unauthorized | Missing/invalid/expired token, wrong password |
| `403` | Forbidden | Wrong role, inactive account, not assigned examiner, RBAC permission denied |
| `404` | Not Found | Resource doesn't exist or is unpublished |
| `409` | Conflict | Duplicate email, GST, enrollment, submission, role assignment |
| `422` | Unprocessable | Zod/Joi validation failure with field errors |
| `429` | Too Many Requests | Rate limiter triggered |
| `500` | Internal Server Error | Unhandled exceptions |

---

## 18. Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/iskcon_pihe_amritsar

# JWT
JWT_SECRET=your_jwt_secret_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# File Storage
UPLOAD_DIR=./uploads
CERT_DIR=./generated-certs

# Redis (RBAC permission cache)
REDIS_URL=redis://localhost:6379
RBAC_CACHE_TTL_SECONDS=300
```

---

## 19. Gap Analysis

### Missing Backend Endpoints (Frontend Calls These but They Don't Exist)

| Endpoint | Called By | Priority | Solution |
|---------|-----------|----------|----------|
| `GET /api/v1/exams` | Admin ExamManagementPage | **High** | Add route: `router.get('/', authenticate, authorize('admin'), examController.getAll)` |
| `POST /api/v1/exams` | Admin CreateExam form | **High** | Add route with courseId in body; Zod validate exam schema |
| `PUT /api/v1/exams/:id` | Admin EditExam | **High** | Add update route |
| `DELETE /api/v1/exams/:id` | Admin DeleteExam | **High** | Add delete route |
| `POST /api/v1/auth/forgot-password` | authService.forgotPassword | **High** | Implement forgot-password with email token flow |

### Backend Endpoints Not Connected to Any Frontend

| Endpoint | Status |
|---------|--------|
| `POST /api/v1/temples/step` | Backend complete; frontend sends zero API calls |
| `POST /api/v1/temples/register` | Backend complete; frontend skips to success page |
| `POST /api/v1/otp/send` | Backend complete; frontend fakes with local state |
| `POST /api/v1/otp/verify` | Backend complete; frontend fakes verification |
| `POST /api/v1/uploads` | Backend complete; temple frontend stores base64 only |
| `GET /api/v1/temple-users/check-duplicate` | Backend complete; no frontend usage |
| `GET /api/v1/temples/:id` | Backend complete; no frontend usage |

### RBAC-Specific Implementation Gaps

| Issue | Priority | Fix |
|-------|----------|-----|
| `seedRBAC.js` not yet written — all `role_permissions` must be manually seeded | **High** | Write seeder for all 6 roles × 11 modules + feature-level entries on first deploy |
| `rbac.js` middleware not yet integrated into existing routes — only `authorize()` in use | **High** | Replace `authorize('admin')` with `authorize('admin') + rbac.module(...)` on all admin routes |
| Redis dependency for permission caching not installed | Medium | `npm install ioredis`; implement cache-aside in `rbacService.getPermissionsForUser()` |
| Frontend not yet calling `GET /rbac/permissions/me` post-login | **High** | See frontend.md RBAC section for implementation details |
| No RBAC audit trail for role assignment/revocation | Medium | Emit `ROLE_ASSIGNED` / `ROLE_REVOKED` to `AuditLog` in `rbacService.assignRole/revokeRole` |
| `user_roles.expiresAt` not enforced at query time | Medium | Add `$or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]` to all user_roles queries |

### Service-Layer Issues

| Issue | Priority | Fix |
|-------|----------|-----|
| `certificateService` writes PDFs to local `./generated-certs/` — not scalable | High | Integrate S3 upload after PDF generation; store S3 URL in `certificateUrl` |
| Hard-delete on courses orphans `enrollments`, `exams`, `submissions` | High | Implement soft-delete with `isDeleted` flag and query middleware |
| No `PATCH /auth/profile` endpoint for student profile updates | Medium | Add `authController.updateProfile` with Zod validation |
| No `POST /auth/avatar` endpoint for avatar upload | Medium | Add multipart endpoint with Multer |
| `perQuestionMarks` sent from examiner frontend but not stored in `Result` schema | High | Extend `results` schema with `perQuestionMarks: [{ questionId, marks }]` |
| No email service integration documented | Medium | Add nodemailer/SendGrid config for exam result notifications |
