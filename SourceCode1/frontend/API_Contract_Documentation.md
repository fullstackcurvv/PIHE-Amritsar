# API Contract & Behavior Documentation

> **Project:** ISKCON Portal — Course LMS + Temple Registration  
> **Base URL:** `http://localhost:5000/api/v1`  
> **Generated:** 2026-04-18  
> **Stack:** Node.js + Express, MongoDB/Mongoose, JWT Auth  
> **CORS Origin:** `http://localhost:5173` (configurable via `CLIENT_URL`)

---

## Global Conventions

### Authentication
Protected routes require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <accessToken>
```
The `refreshToken` is stored as an **httpOnly cookie** (`refreshToken`) and is never exposed in response bodies.

### Standard Response Envelope

**Success (LMS module):**
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

**Success (Temple module):**
```json
{ "success": true, "message": "...", "data": {} }
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

### Rate Limits
| Limiter             | Applies To               | Max Requests | Window   |
|---------------------|--------------------------|--------------|----------|
| `authLimiter`       | POST /auth/register, /login | 10        | 15 min   |
| `apiLimiter`        | All /courses routes      | 100          | 15 min   |
| `otpLimiter`        | POST /otp/send, /verify  | 5            | 10 min   |
| `registrationLimiter` | POST /temples/step, /register | 20    | 15 min   |
| `uploadLimiter`     | POST /uploads            | 30           | 15 min   |

### Role Definitions
| Role       | Access Level                                      |
|------------|---------------------------------------------------|
| `student`  | Enroll, view courses, submit exams, view results  |
| `examiner` | View assigned submissions, evaluate submissions   |
| `admin`    | Full access to all LMS management endpoints       |

---

---

# MODULE 1 — AUTHENTICATION

---

## POST /api/v1/auth/register

### 1. API Summary

| Method | Endpoint              | Purpose                          | Auth Required |
|--------|-----------------------|----------------------------------|---------------|
| POST   | `/api/v1/auth/register` | Register a new student account | No            |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description                                                              |
|------------|--------|----------|----------|--------------------------------------------------------------------------|
| `name`     | String | Yes      | Body     | Full name. Min 2, max 100 characters                                     |
| `email`    | String | Yes      | Body     | Valid email address. Must be unique                                      |
| `password` | String | Yes      | Body     | Min 8 chars, must include uppercase, lowercase, and a digit              |
| `phone`    | String | No       | Body     | 10-digit Indian mobile number starting with 6–9                          |

### 3. Response Fields

| Field                  | Type    | Description                                      |
|------------------------|---------|--------------------------------------------------|
| `success`              | Boolean | `true` on success                                |
| `message`              | String  | `"Registration successful"`                      |
| `data.user`            | Object  | User profile (no password/token fields)          |
| `data.user._id`        | String  | MongoDB ObjectId                                 |
| `data.user.studentId`  | String  | Auto-generated unique student ID (e.g. STU-0042) |
| `data.user.name`       | String  | User's name                                      |
| `data.user.email`      | String  | User's email                                     |
| `data.user.role`       | String  | Always `"student"` on self-registration          |
| `data.user.isActive`   | Boolean | Always `true`                                    |
| `data.accessToken`     | String  | Short-lived JWT access token (use in Auth header)|
| *(cookie)*             | —       | `refreshToken` httpOnly cookie (7-day lifetime)  |

### 4. Sample Request
```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "password": "Secure@123",
  "phone": "9876543210"
}
```

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "664a1f2e3b9c4d0012ab3456",
      "studentId": "STU-0042",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "role": "student",
      "avatar": null,
      "phone": "9876543210",
      "isActive": true,
      "createdAt": "2024-05-18T09:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 6. Business Logic
1. Zod validates all request fields against `registerSchema`.
2. Checks if the email already exists in `users` — throws `409` if duplicate.
3. Calls `generateStudentId()` to assign a unique `STU-XXXX` identifier.
4. Creates the user document. The `pre('save')` Mongoose hook automatically bcrypt-hashes the password (12 rounds).
5. Signs a short-lived access token and a long-lived refresh token.
6. Stores the refresh token hash on the user document.
7. Sets the refresh token as an httpOnly cookie (7-day expiry) and returns the access token in the body.

### 7. Database Usage

| Collection | Operation | Description                               |
|------------|-----------|-------------------------------------------|
| `users`    | Find      | Email uniqueness check                    |
| `users`    | Insert    | Create new student document               |
| `users`    | Update    | Save refresh token after creation         |

---

## POST /api/v1/auth/login

### 1. API Summary

| Method | Endpoint           | Purpose              | Auth Required |
|--------|--------------------|----------------------|---------------|
| POST   | `/api/v1/auth/login` | Log in as any user | No            |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description       |
|------------|--------|----------|----------|-------------------|
| `email`    | String | Yes      | Body     | Registered email  |
| `password` | String | Yes      | Body     | Account password  |

### 3. Response Fields

| Field              | Type    | Description                              |
|--------------------|---------|------------------------------------------|
| `success`          | Boolean | `true` on success                        |
| `message`          | String  | `"Login successful"`                     |
| `data.user`        | Object  | User profile object (same as register)   |
| `data.accessToken` | String  | JWT access token                         |
| *(cookie)*         | —       | `refreshToken` httpOnly cookie refreshed |

### 4. Sample Request
```json
{
  "email": "priya.sharma@example.com",
  "password": "Secure@123"
}
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "664a1f2e3b9c4d0012ab3456",
      "studentId": "STU-0042",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "role": "student",
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 6. Business Logic
1. Zod validates `email` + `password`.
2. Fetches user including `password` (select: false field) for comparison.
3. Throws `401` if user not found or no password field (Google-only account).
4. Compares bcrypt hash — throws `401` on mismatch.
5. Throws `403` if `isActive = false`.
6. Issues new access + refresh tokens, stores refresh token on user.

### 7. Database Usage

| Collection | Operation | Description                          |
|------------|-----------|--------------------------------------|
| `users`    | Find      | Lookup by email (includes +password) |
| `users`    | Update    | Store new refresh token              |

---

## POST /api/v1/auth/logout

### 1. API Summary

| Method | Endpoint            | Purpose                       | Auth Required |
|--------|---------------------|-------------------------------|---------------|
| POST   | `/api/v1/auth/logout` | Invalidate session and cookie | Yes (Bearer)  |

### 2. Request Parameters
No body required. JWT Bearer token in `Authorization` header.

### 3. Response Fields

| Field     | Type    | Description              |
|-----------|---------|--------------------------|
| `success` | Boolean | `true`                   |
| `message` | String  | `"Logged out successfully"` |

### 4. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Business Logic
1. `authenticate` middleware verifies Bearer token.
2. Clears the `refreshToken` field on the user document (`$unset`).
3. Clears the `refreshToken` httpOnly cookie on the response.

### 7. Database Usage

| Collection | Operation | Description             |
|------------|-----------|-------------------------|
| `users`    | Update    | Unset `refreshToken` field |

---

## POST /api/v1/auth/refresh

### 1. API Summary

| Method | Endpoint             | Purpose                          | Auth Required |
|--------|----------------------|----------------------------------|---------------|
| POST   | `/api/v1/auth/refresh` | Exchange refresh token for a new access token | No (uses cookie) |

### 2. Request Parameters
No body. The `refreshToken` cookie is read automatically.

### 3. Response Fields

| Field               | Type   | Description          |
|---------------------|--------|----------------------|
| `data.accessToken`  | String | Fresh JWT access token |

### 4. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
}
```

### 5. Business Logic
1. Reads `refreshToken` from cookie.
2. Verifies against `JWT_REFRESH_SECRET`.
3. Fetches user and validates the stored refresh token matches (prevents token reuse after logout).
4. Issues a new access token.

### 7. Database Usage

| Collection | Operation | Description                         |
|------------|-----------|-------------------------------------|
| `users`    | Find      | Load user + verify stored refresh token |

---

## GET /api/v1/auth/me

### 1. API Summary

| Method | Endpoint          | Purpose                     | Auth Required |
|--------|-------------------|-----------------------------|---------------|
| GET    | `/api/v1/auth/me` | Get current logged-in user  | Yes (Bearer)  |

### 3. Response Fields

| Field        | Type   | Description                         |
|--------------|--------|-------------------------------------|
| `data`       | Object | Full user profile (no sensitive fields) |
| `data.role`  | String | `student` \| `examiner` \| `admin` |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "User fetched",
  "data": {
    "_id": "664a1f2e3b9c4d0012ab3456",
    "studentId": "STU-0042",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "role": "student",
    "avatar": null,
    "phone": "9876543210",
    "isActive": true
  }
}
```

### 6. Business Logic
`authenticate` middleware verifies the Bearer token, loads the user from DB, and attaches it to `req.user`. The controller returns that object directly.

### 7. Database Usage

| Collection | Operation | Description                |
|------------|-----------|----------------------------|
| `users`    | Find      | Load user by decoded JWT `id` |

---

## GET /api/v1/auth/google

### 1. API Summary

| Method | Endpoint               | Purpose                                  | Auth Required |
|--------|------------------------|------------------------------------------|---------------|
| GET    | `/api/v1/auth/google`  | Redirect browser to Google OAuth consent | No            |

Initiates Google OAuth 2.0 flow via Passport.js. No request body or response body — browser is redirected to Google.

---

## GET /api/v1/auth/google/callback

### 1. API Summary

| Method | Endpoint                       | Purpose                                      | Auth Required |
|--------|--------------------------------|----------------------------------------------|---------------|
| GET    | `/api/v1/auth/google/callback` | OAuth callback — issues tokens, redirects UI | No (OAuth)    |

### 5. Redirect Behavior
On success, the browser is redirected to:
```
{CLIENT_URL}/auth/callback?token=<accessToken>&role=<role>
```
The `refreshToken` is set as an httpOnly cookie.

On failure: redirected to `{CLIENT_URL}/login?error=oauth_failed`

### 6. Business Logic
1. Passport Google strategy verifies the OAuth code and retrieves the profile.
2. Looks up user by `googleId` or email.
3. If new user: creates a student account with auto-generated `studentId`, sets `googleId` and `avatar` from Google profile.
4. If existing email-only account: attaches the `googleId` to their existing record.
5. Issues access + refresh tokens and redirects.

### 7. Database Usage

| Collection | Operation | Description                          |
|------------|-----------|--------------------------------------|
| `users`    | Find      | Lookup by googleId or email          |
| `users`    | Insert    | Create new Google OAuth student      |
| `users`    | Update    | Attach googleId / save refresh token |

---

---

# MODULE 2 — COURSES

Base path: `/api/v1/courses` — all routes use `apiLimiter` (100 req / 15 min).

---

## GET /api/v1/courses

### 1. API Summary

| Method | Endpoint          | Purpose                          | Auth Required |
|--------|-------------------|----------------------------------|---------------|
| GET    | `/api/v1/courses` | List published courses with pagination and filters | No |

### 2. Request Parameters

| Field      | Type    | Required | Location | Description                                     |
|------------|---------|----------|----------|-------------------------------------------------|
| `page`     | Number  | No       | Query    | Page number; default `1`                        |
| `limit`    | Number  | No       | Query    | Items per page; default `12`                    |
| `search`   | String  | No       | Query    | Partial title match (case-insensitive regex)    |
| `level`    | String  | No       | Query    | `Beginner` \| `Intermediate` \| `Advanced`      |
| `isPaid`   | Boolean | No       | Query    | `true` for paid, `false` for free courses       |
| `featured` | String  | No       | Query    | `"true"` to filter featured courses             |
| `category` | String  | No       | Query    | Exact category match                            |
| `sort`     | String  | No       | Query    | `newest` (default) \| `popular`                 |

### 3. Response Fields

| Field                     | Type    | Description                              |
|---------------------------|---------|------------------------------------------|
| `data`                    | Array   | Array of course objects                  |
| `data[].title`            | String  | Course title                             |
| `data[].description`      | String  | Course description                       |
| `data[].category`         | String  | Course category                          |
| `data[].level`            | String  | Difficulty level                         |
| `data[].isPaid`           | Boolean | Free vs paid                             |
| `data[].price`            | Number  | Price (0 for free)                       |
| `data[].thumbnail`        | String  | Thumbnail image URL                      |
| `data[].isFeatured`       | Boolean | Featured badge                           |
| `data[].isBestSeller`     | Boolean | Best-seller badge                        |
| `data[].isPopular`        | Boolean | Popular badge                            |
| `data[].tags`             | Array   | String tags                              |
| `data[].lessonCount`      | Number  | Virtual — number of lessons              |
| `pagination.page`         | Number  | Current page                             |
| `pagination.limit`        | Number  | Items per page                           |
| `pagination.total`        | Number  | Total matching courses                   |
| `pagination.totalPages`   | Number  | Total pages                              |

> Note: `lessons.content` and `studyMaterials.fileUrl` are excluded from list responses for bandwidth efficiency.

### 4. Sample Request
```
GET /api/v1/courses?page=1&limit=12&level=Beginner&featured=true
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Courses fetched",
  "data": [
    {
      "_id": "664b2a3f1c0e5d0023bc4567",
      "title": "Introduction to Vedic Mathematics",
      "description": "A beginner-friendly course...",
      "category": "Mathematics",
      "level": "Beginner",
      "isPaid": true,
      "price": 499,
      "thumbnail": "https://cdn.example.com/courses/vedic-math.jpg",
      "tags": ["mathematics", "vedic"],
      "isFeatured": true,
      "isBestSeller": false,
      "isPopular": true,
      "lessonCount": 12
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 3, "totalPages": 1 }
}
```

### 6. Business Logic
Builds a dynamic MongoDB query starting from `{ isPublished: true }`, applies optional filters for `title` (regex), `level`, `isPaid`, `isFeatured`, `category`. Paginates with `skip/limit`. Returns results with lesson content and study material URLs stripped.

### 7. Database Usage

| Collection | Operation | Description                    |
|------------|-----------|--------------------------------|
| `courses`  | Count     | Get total for pagination       |
| `courses`  | Find      | Filtered, sorted, paginated    |

---

## GET /api/v1/courses/:id

### 1. API Summary

| Method | Endpoint                | Purpose                    | Auth Required |
|--------|-------------------------|----------------------------|---------------|
| GET    | `/api/v1/courses/:id`   | Get full course by ID      | No            |

### 2. Request Parameters

| Field | Type   | Required | Location | Description          |
|-------|--------|----------|----------|----------------------|
| `id`  | String | Yes      | Path     | MongoDB ObjectId of course |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Course fetched",
  "data": {
    "_id": "664b2a3f1c0e5d0023bc4567",
    "title": "Introduction to Vedic Mathematics",
    "lessons": [
      { "_id": "...", "title": "Lesson 1", "content": "Full lesson content...", "videoUrl": "...", "duration": 35, "order": 1 }
    ],
    "studyMaterials": [
      { "title": "Reference Sheet", "fileUrl": "https://cdn.example.com/...", "fileType": "pdf" }
    ]
  }
}
```

### 6. Business Logic
Fetches the course by ID. Returns `404` if not found or `isPublished = false`.

### 7. Database Usage

| Collection | Operation | Description              |
|------------|-----------|--------------------------|
| `courses`  | Find      | Lookup by `_id`          |

---

## POST /api/v1/courses

### 1. API Summary

| Method | Endpoint          | Purpose           | Auth Required           |
|--------|-------------------|-------------------|-------------------------|
| POST   | `/api/v1/courses` | Create new course | Yes — `admin` role only |

### 2. Request Parameters

| Field            | Type    | Required | Location | Description                                  |
|------------------|---------|----------|----------|----------------------------------------------|
| `title`          | String  | Yes      | Body     | Course title (max 200 chars)                 |
| `description`    | String  | Yes      | Body     | Course description (max 2000 chars)          |
| `category`       | String  | Yes      | Body     | Category string                              |
| `level`          | String  | Yes      | Body     | `Beginner` \| `Intermediate` \| `Advanced`   |
| `isPaid`         | Boolean | No       | Body     | Default `false`                              |
| `price`          | Number  | No       | Body     | Default `0`                                  |
| `thumbnail`      | String  | No       | Body     | URL to thumbnail image                       |
| `lessons`        | Array   | No       | Body     | Array of lesson objects                      |
| `studyMaterials` | Array   | No       | Body     | Array of study material objects              |
| `tags`           | Array   | No       | Body     | String tags                                  |
| `isPublished`    | Boolean | No       | Body     | Default `false`                              |
| `isFeatured`     | Boolean | No       | Body     | Default `false`                              |

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Course created",
  "data": { "_id": "664b2a3f1c0e5d0023bc4567", "title": "...", "createdBy": "664a1f...", ... }
}
```

### 6. Business Logic
Authenticated admin only. Automatically sets `createdBy` from `req.user._id`. Mongoose schema validation applies.

### 7. Database Usage

| Collection | Operation | Description           |
|------------|-----------|------------------------|
| `courses`  | Insert    | Create course document |

---

## PUT /api/v1/courses/:id

### 1. API Summary

| Method | Endpoint              | Purpose              | Auth Required           |
|--------|-----------------------|----------------------|-------------------------|
| PUT    | `/api/v1/courses/:id` | Update a full course | Yes — `admin` role only |

Body fields are the same as POST /courses. Returns `404` if course not found.

### 7. Database Usage

| Collection | Operation | Description                              |
|------------|-----------|------------------------------------------|
| `courses`  | Update    | `findByIdAndUpdate` with `runValidators` |

---

## DELETE /api/v1/courses/:id

### 1. API Summary

| Method | Endpoint              | Purpose        | Auth Required           |
|--------|-----------------------|----------------|-------------------------|
| DELETE | `/api/v1/courses/:id` | Delete a course| Yes — `admin` role only |

### 5. Sample Response — `200 OK`
```json
{ "success": true, "message": "Course deleted" }
```

### 7. Database Usage

| Collection | Operation | Description               |
|------------|-----------|---------------------------|
| `courses`  | Delete    | `findByIdAndDelete` by id |

---

---

# MODULE 3 — ENROLLMENTS

All enrollment routes require authentication (`authenticate` middleware applied at router level).

---

## GET /api/v1/enrollments/my

### 1. API Summary

| Method | Endpoint                  | Purpose                        | Auth Required            |
|--------|---------------------------|--------------------------------|--------------------------|
| GET    | `/api/v1/enrollments/my`  | Get all enrollments for student | Yes — `student` role    |

### 3. Response Fields

| Field                        | Type    | Description                          |
|------------------------------|---------|--------------------------------------|
| `data`                       | Array   | Array of enrollment objects          |
| `data[].course`              | Object  | Populated course (title, thumbnail, level, lessons, etc.) |
| `data[].progress`            | Number  | Completion percentage (0–100)        |
| `data[].completedLessons`    | Array   | Array of completed lesson ObjectIds  |
| `data[].status`              | String  | `active` \| `completed` \| `dropped` |
| `data[].paymentStatus`       | String  | `free` \| `paid` \| `pending`        |
| `data[].enrolledAt`          | Date    | Enrollment timestamp                 |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Enrollments fetched",
  "data": [
    {
      "_id": "664c3b4g2d1f6e0034cd5678",
      "course": {
        "_id": "664b2a3f...",
        "title": "Introduction to Vedic Mathematics",
        "thumbnail": "https://...",
        "level": "Beginner",
        "lessons": [...]
      },
      "progress": 45,
      "completedLessons": ["664b2a3f1c0e5d0023bc4568"],
      "status": "active",
      "paymentStatus": "paid",
      "enrolledAt": "2024-05-21T07:30:00.000Z"
    }
  ]
}
```

### 7. Database Usage

| Collection    | Operation | Description                          |
|---------------|-----------|--------------------------------------|
| `enrollments` | Find      | Filter by `student: req.user._id`, populate `course` |

---

## POST /api/v1/enrollments

### 1. API Summary

| Method | Endpoint               | Purpose              | Auth Required           |
|--------|------------------------|----------------------|-------------------------|
| POST   | `/api/v1/enrollments`  | Enroll in a course   | Yes — `student` role    |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description            |
|------------|--------|----------|----------|------------------------|
| `courseId` | String | Yes      | Body     | MongoDB ObjectId of course to enroll in |

### 5. Sample Request
```json
{ "courseId": "664b2a3f1c0e5d0023bc4567" }
```

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "_id": "664c3b4g2d1f6e0034cd5678",
    "course": { "_id": "664b2a3f...", "title": "Introduction to Vedic Mathematics", ... },
    "progress": 0,
    "status": "active",
    "paymentStatus": "free"
  }
}
```

### 6. Business Logic
1. Verifies the course exists — `404` if not found.
2. Checks for existing enrollment — `409` if already enrolled.
3. Creates the enrollment document.
4. Returns enrollment with populated course data.

### 7. Database Usage

| Collection    | Operation | Description                   |
|---------------|-----------|-------------------------------|
| `courses`     | Find      | Verify course exists          |
| `enrollments` | Find      | Check for duplicate enrollment|
| `enrollments` | Insert    | Create new enrollment         |

---

## PATCH /api/v1/enrollments/:id/progress

### 1. API Summary

| Method | Endpoint                          | Purpose                           | Auth Required        |
|--------|-----------------------------------|-----------------------------------|----------------------|
| PATCH  | `/api/v1/enrollments/:id/progress`| Mark a lesson complete, update %  | Yes — `student` role |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description                           |
|------------|--------|----------|----------|---------------------------------------|
| `id`       | String | Yes      | Path     | Enrollment MongoDB ObjectId           |
| `lessonId` | String | Yes      | Body     | ObjectId of the lesson to mark done   |

### 5. Sample Request
```json
{ "lessonId": "664b2a3f1c0e5d0023bc4568" }
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Progress updated",
  "data": {
    "_id": "664c3b4g2d1f6e0034cd5678",
    "progress": 58,
    "completedLessons": ["664b2a3f1c0e5d0023bc4568", "664b2a3f1c0e5d0023bc4569"],
    "status": "active"
  }
}
```

### 6. Business Logic
1. Finds enrollment by ID, verifies it belongs to the logged-in student.
2. Adds `lessonId` to `completedLessons` (idempotent — no duplicates added).
3. Fetches the total lesson count from the parent course.
4. Recalculates `progress = round(completedLessons.length / totalLessons * 100)`.
5. Auto-sets `status = "completed"` and `progress = 100` if all lessons done.

### 7. Database Usage

| Collection    | Operation | Description                              |
|---------------|-----------|------------------------------------------|
| `enrollments` | Find      | Lookup by id + student                   |
| `courses`     | Find      | Get total lesson count                   |
| `enrollments` | Update    | Save updated progress and lesson array   |

---

---

# MODULE 4 — EXAMS

---

## GET /api/v1/exams/course/:courseId

### 1. API Summary

| Method | Endpoint                          | Purpose                                   | Auth Required        |
|--------|-----------------------------------|-------------------------------------------|----------------------|
| GET    | `/api/v1/exams/course/:courseId`  | Get published exam for a course           | Yes — `student` role |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description               |
|------------|--------|----------|----------|---------------------------|
| `courseId` | String | Yes      | Path     | Course MongoDB ObjectId   |

### 3. Response Fields

| Field                           | Type   | Description                            |
|---------------------------------|--------|----------------------------------------|
| `data.title`                    | String | Exam title                             |
| `data.type`                     | String | `online` \| `offline`                 |
| `data.duration`                 | Number | Duration in minutes                    |
| `data.totalMarks`               | Number | Maximum possible marks                 |
| `data.passingMarks`             | Number | Minimum marks to pass                  |
| `data.questions`                | Array  | Transformed question array (no `correctAnswer` exposed) |
| `data.questions[].text`         | String | Question text (mapped from `questionText`) |
| `data.questions[].type`         | String | `mcq` \| `short` \| `long`            |
| `data.questions[].marks`        | Number | Marks for question                     |
| `data.questions[].options`      | Array  | MCQ options as `{ _id, text }` objects |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Exam fetched",
  "data": {
    "_id": "664d4c5h3e2g7f0045de6789",
    "title": "Chapter 1 Assessment",
    "type": "online",
    "duration": 60,
    "totalMarks": 50,
    "passingMarks": 25,
    "questions": [
      {
        "_id": "664d4c5h3e2g7f0045de6790",
        "text": "Which Sutra is used for multiplication?",
        "type": "mcq",
        "marks": 5,
        "options": [
          { "_id": "664d4c5h3e2g7f0045de6790_0", "text": "Nikhilam" },
          { "_id": "664d4c5h3e2g7f0045de6790_1", "text": "Anurupyena" }
        ]
      }
    ]
  }
}
```

### 6. Business Logic
Fetches the published exam for a course. Transforms questions for frontend consumption: renames `questionText` → `text`, converts `options` from plain strings to `{ _id, text }` objects. Critically, **`correctAnswer` is never returned** — preventing cheating.

### 7. Database Usage

| Collection | Operation | Description                                          |
|------------|-----------|------------------------------------------------------|
| `exams`    | Find      | `findOne({ course: courseId, isPublished: true })`   |

---

---

# MODULE 5 — SUBMISSIONS

---

## POST /api/v1/submissions

### 1. API Summary

| Method | Endpoint                | Purpose                        | Auth Required        |
|--------|-------------------------|--------------------------------|----------------------|
| POST   | `/api/v1/submissions`   | Submit online exam answers     | Yes — `student` role |

### 2. Request Parameters

| Field               | Type   | Required | Location | Description                                |
|---------------------|--------|----------|----------|--------------------------------------------|
| `examId`            | String | Yes      | Body     | Exam MongoDB ObjectId                      |
| `answers`           | Array  | Yes      | Body     | Array of answer objects                    |
| `answers[].questionId`    | String | Yes | Body   | Question ObjectId (from embedded question) |
| `answers[].selectedOption`| String | No  | Body   | Chosen option text (MCQ)                   |
| `answers[].answerText`    | String | No  | Body   | Free-text answer (short/long)              |

### 4. Sample Request
```json
{
  "examId": "664d4c5h3e2g7f0045de6789",
  "answers": [
    {
      "questionId": "664d4c5h3e2g7f0045de6790",
      "selectedOption": "Nikhilam",
      "answerText": null
    }
  ]
}
```

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "_id": "664e5d6i4f3h8g0056ef7890",
    "student": "664a1f2e3b9c4d0012ab3456",
    "exam": "664d4c5h3e2g7f0045de6789",
    "course": "664b2a3f1c0e5d0023bc4567",
    "type": "online",
    "status": "pending",
    "submittedAt": "2024-06-03T10:45:00.000Z"
  }
}
```

### 6. Business Logic
1. Verifies the exam exists — `404` if not.
2. Prevents duplicate submissions — `409` if student already submitted this exam online.
3. Denormalises `course` from the exam for fast lookups.
4. Creates the submission with `status: "pending"`.

### 7. Database Usage

| Collection    | Operation | Description                           |
|---------------|-----------|---------------------------------------|
| `exams`       | Find      | Verify exam exists                    |
| `submissions` | Find      | Check for duplicate online submission |
| `submissions` | Insert    | Create submission document            |

---

## POST /api/v1/submissions/upload

### 1. API Summary

| Method | Endpoint                     | Purpose                            | Auth Required        |
|--------|------------------------------|------------------------------------|----------------------|
| POST   | `/api/v1/submissions/upload` | Upload offline answer paper (file) | Yes — `student` role |

### 2. Request Parameters

| Field      | Type   | Required | Location    | Description                             |
|------------|--------|----------|-------------|-----------------------------------------|
| `paper`    | File   | Yes      | Multipart   | PDF, JPG, or PNG file (max 10 MB)       |
| `examId`   | String | No       | Body (form) | Exam ObjectId (optional — inferred from courseId if absent) |
| `courseId` | String | No       | Body (form) | Course ObjectId (used to find exam)     |

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Paper uploaded successfully",
  "data": {
    "_id": "664e5d6i...",
    "type": "offline",
    "uploadedFile": "./uploads/paper-xyz.pdf",
    "status": "pending"
  }
}
```

### 6. Business Logic
1. Multer middleware validates file type (PDF/JPG/PNG) and size (max 10 MB).
2. Prevents duplicate offline submissions.
3. If `examId` absent, finds the published exam for the given `courseId`.
4. Creates submission with `uploadedFile` path.

### 7. Database Usage

| Collection    | Operation | Description                                      |
|---------------|-----------|--------------------------------------------------|
| `exams`       | Find      | Find exam by courseId if examId not provided     |
| `submissions` | Find      | Check for duplicate offline submission           |
| `submissions` | Insert    | Create offline submission with file path         |

---

## GET /api/v1/submissions/assigned

### 1. API Summary

| Method | Endpoint                        | Purpose                            | Auth Required                  |
|--------|---------------------------------|------------------------------------|--------------------------------|
| GET    | `/api/v1/submissions/assigned`  | Get submissions assigned to examiner | Yes — `examiner` or `admin` role |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                              |
|----------|--------|----------|----------|------------------------------------------|
| `status` | String | No       | Query    | Filter: `pending` \| `evaluated`         |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Assigned submissions fetched",
  "data": [
    {
      "_id": "664e5d6i4f3h8g0056ef7890",
      "student": { "name": "Priya Sharma", "studentId": "STU-0042", "email": "..." },
      "exam": { "title": "Chapter 1 Assessment", "totalMarks": 50, "passingMarks": 25 },
      "course": { "title": "Introduction to Vedic Mathematics" },
      "type": "online",
      "status": "pending",
      "submittedAt": "2024-06-03T10:45:00.000Z"
    }
  ]
}
```

### 7. Database Usage

| Collection    | Operation | Description                                   |
|---------------|-----------|-----------------------------------------------|
| `submissions` | Find      | Filter by `assignedExaminer: req.user._id` + optional status |

---

## GET /api/v1/submissions/:id

### 1. API Summary

| Method | Endpoint                  | Purpose                              | Auth Required                   |
|--------|---------------------------|--------------------------------------|---------------------------------|
| GET    | `/api/v1/submissions/:id` | Get a single submission with full data | Yes — `examiner` or `admin` role |

### 2. Request Parameters

| Field | Type   | Required | Location | Description              |
|-------|--------|----------|----------|--------------------------|
| `id`  | String | Yes      | Path     | Submission MongoDB ObjectId |

### 6. Business Logic
Returns full submission with populated student, exam (including all questions), and course. Examiners can only view submissions assigned to them; admins can see all.

### 7. Database Usage

| Collection    | Operation | Description                                        |
|---------------|-----------|----------------------------------------------------|
| `submissions` | Find      | By `_id`, populates student, exam (with questions), course |

---

## PATCH /api/v1/submissions/:id/evaluate

### 1. API Summary

| Method | Endpoint                            | Purpose                           | Auth Required           |
|--------|-------------------------------------|-----------------------------------|-------------------------|
| PATCH  | `/api/v1/submissions/:id/evaluate`  | Examiner submits marks + remarks  | Yes — `examiner` role   |

### 2. Request Parameters

| Field           | Type   | Required | Location | Description                      |
|-----------------|--------|----------|----------|----------------------------------|
| `id`            | String | Yes      | Path     | Submission MongoDB ObjectId      |
| `marksObtained` | Number | Yes      | Body     | Marks awarded (0 to totalMarks)  |
| `remarks`       | String | No       | Body     | Examiner feedback                |

### 4. Sample Request
```json
{
  "marksObtained": 42,
  "remarks": "Excellent understanding of core concepts."
}
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Evaluation submitted successfully",
  "data": {
    "_id": "664f6e7j5g4i9h0067fg8901",
    "student": "664a1f2e...",
    "exam": "664d4c5h...",
    "marksObtained": 42,
    "totalMarks": 50,
    "percentage": 84,
    "isPassed": true,
    "remarks": "Excellent understanding...",
    "evaluatedAt": "2024-06-03T11:00:00.000Z",
    "approvedByAdmin": false
  }
}
```

### 6. Business Logic
1. Verifies the submission exists and is assigned to the requesting examiner.
2. Throws `403` if the examiner is not the assigned one.
3. Throws `400` if already evaluated.
4. Determines `isPassed` by comparing `marksObtained >= exam.passingMarks`.
5. Updates submission `status → "evaluated"`.
6. Creates a new `Result` document. The `percentage` field is auto-calculated by the pre-save hook.

### 7. Database Usage

| Collection    | Operation | Description                                |
|---------------|-----------|--------------------------------------------|
| `submissions` | Find      | Lookup by id, verify examiner              |
| `submissions` | Update    | Set status to `"evaluated"`                |
| `exams`       | Find      | Get `passingMarks` and `totalMarks`        |
| `results`     | Insert    | Create result document                     |

---

---

# MODULE 6 — RESULTS

---

## GET /api/v1/results/my

### 1. API Summary

| Method | Endpoint              | Purpose                    | Auth Required        |
|--------|-----------------------|----------------------------|----------------------|
| GET    | `/api/v1/results/my`  | Get logged-in student's results | Yes — `student` role |

### 3. Response Fields

| Field                  | Type    | Description                                        |
|------------------------|---------|----------------------------------------------------|
| `data[].obtainedMarks` | Number  | Raw marks obtained                                 |
| `data[].totalMarks`    | Number  | Maximum marks                                      |
| `data[].percentage`    | Number  | Auto-calculated percentage                         |
| `data[].status`        | String  | `"pass"` \| `"fail"` \| `"pending"`                |
| `data[].remarks`       | String  | Examiner's remarks                                 |
| `data[].courseTitle`   | String  | Exam title (from populated exam)                   |
| `data[].examinerName`  | String  | Evaluating examiner's name                         |
| `data[].evaluatedAt`   | Date    | Evaluation timestamp                               |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Results fetched",
  "data": [
    {
      "_id": "664f6e7j5g4i9h0067fg8901",
      "courseTitle": "Chapter 1 Assessment",
      "obtainedMarks": 42,
      "totalMarks": 50,
      "percentage": 84,
      "status": "pass",
      "remarks": "Excellent.",
      "examinerName": "Ramesh Kumar",
      "evaluatedAt": "2024-06-03T11:00:00.000Z"
    }
  ]
}
```

### 7. Database Usage

| Collection | Operation | Description                              |
|------------|-----------|------------------------------------------|
| `results`  | Find      | Filter by student, populate exam + examiner |

---

---

# MODULE 7 — CERTIFICATES

---

## GET /api/v1/certificates/verify/:certId

### 1. API Summary

| Method | Endpoint                              | Purpose                            | Auth Required |
|--------|---------------------------------------|------------------------------------|---------------|
| GET    | `/api/v1/certificates/verify/:certId` | Public certificate verification    | No            |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description              |
|----------|--------|----------|----------|--------------------------|
| `certId` | String | Yes      | Path     | UUID certificate ID      |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Certificate verified",
  "data": {
    "valid": true,
    "certId": "CERT-2024-00042",
    "studentName": "Priya Sharma",
    "studentId": "STU-0042",
    "course": "Introduction to Vedic Mathematics",
    "issuedAt": "2024-06-04T10:00:00.000Z"
  }
}
```

### 7. Database Usage

| Collection     | Operation | Description                              |
|----------------|-----------|------------------------------------------|
| `certificates` | Find      | Lookup by `certificateId`, populate student + course |

---

## GET /api/v1/certificates/my

### 1. API Summary

| Method | Endpoint                   | Purpose                         | Auth Required        |
|--------|----------------------------|---------------------------------|----------------------|
| GET    | `/api/v1/certificates/my`  | Get student's own certificates  | Yes — `student` role |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Certificates fetched",
  "data": [
    {
      "_id": "665g7f8k6h5j0i0078gh9012",
      "courseTitle": "Introduction to Vedic Mathematics",
      "certId": "CERT-2024-00042",
      "issuedAt": "2024-06-04T10:00:00.000Z",
      "pdfUrl": "./generated-certs/cert-abc123.pdf"
    }
  ]
}
```

### 7. Database Usage

| Collection     | Operation | Description                              |
|----------------|-----------|------------------------------------------|
| `certificates` | Find      | Filter by student, populate course title |

---

## GET /api/v1/certificates/:id/download

### 1. API Summary

| Method | Endpoint                           | Purpose                        | Auth Required        |
|--------|------------------------------------|--------------------------------|----------------------|
| GET    | `/api/v1/certificates/:id/download`| Download certificate as PDF    | Yes — `student` role |

### 2. Request Parameters

| Field | Type   | Required | Location | Description              |
|-------|--------|----------|----------|--------------------------|
| `id`  | String | Yes      | Path     | Certificate UUID certId  |

### 5. Response
Binary PDF stream with headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="ISKCON-Certificate-<certId>.pdf"
```

### 6. Business Logic
Fetches certificate by `certificateId` + student match. Verifies the PDF file exists on the server filesystem. Streams the file as a download. Returns `404` if certificate not found or file missing.

### 7. Database Usage

| Collection     | Operation | Description                                 |
|----------------|-----------|---------------------------------------------|
| `certificates` | Find      | Lookup by `certificateId` + student match   |

---

---

# MODULE 8 — ADMIN DASHBOARD

All admin routes require `Authorization: Bearer <adminToken>` and `role = "admin"`.

---

## GET /api/v1/admin/dashboard

### 1. API Summary

| Method | Endpoint                  | Purpose                    | Auth Required       |
|--------|---------------------------|----------------------------|---------------------|
| GET    | `/api/v1/admin/dashboard` | Get platform KPIs + trends | Yes — `admin` role  |

### 3. Response Fields

| Field                         | Type   | Description                              |
|-------------------------------|--------|------------------------------------------|
| `data.kpis.totalStudents`     | Number | Total registered students                |
| `data.kpis.totalExaminers`    | Number | Total examiners                          |
| `data.kpis.totalCourses`      | Number | Total courses (all statuses)             |
| `data.kpis.totalEnrollments`  | Number | Total enrollments across platform        |
| `data.kpis.pendingSubmissions`| Number | Submissions awaiting evaluation          |
| `data.kpis.pendingApprovals`  | Number | Passed results awaiting admin approval   |
| `data.kpis.totalCertificates` | Number | Total issued certificates                |
| `data.recentEnrollments`      | Array  | Last 5 enrollments (student + course)    |
| `data.monthlyEnrollments`     | Array  | Last 6 months enrollment trend `{ year, month, count }` |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Dashboard data fetched",
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
    "recentEnrollments": [
      { "student": { "name": "Priya Sharma", "studentId": "STU-0042" }, "course": { "title": "Vedic Math" }, "enrolledAt": "..." }
    ],
    "monthlyEnrollments": [
      { "_id": { "year": 2024, "month": 1 }, "count": 12 }
    ]
  }
}
```

### 7. Database Usage

| Collection    | Operation  | Description                                   |
|---------------|------------|-----------------------------------------------|
| `users`       | Count (x2) | Count students + count examiners              |
| `courses`     | Count      | Total courses                                 |
| `enrollments` | Count      | Total enrollments                             |
| `submissions` | Count      | Pending submissions                           |
| `results`     | Count      | Pending approvals                             |
| `certificates`| Count      | Total certificates                            |
| `enrollments` | Find       | Recent 5 enrollments (populated)              |
| `enrollments` | Aggregate  | Monthly enrollment trend (last 6 months)      |

---

## GET /api/v1/admin/students

### 1. API Summary

| Method | Endpoint                 | Purpose                          | Auth Required      |
|--------|--------------------------|----------------------------------|--------------------|
| GET    | `/api/v1/admin/students` | Paginated list of all students   | Yes — `admin` role |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                                       |
|----------|--------|----------|----------|---------------------------------------------------|
| `search` | String | No       | Query    | Search by name, email, or studentId (regex, case-insensitive) |
| `page`   | Number | No       | Query    | Default `1`                                       |
| `limit`  | Number | No       | Query    | Default `20`                                      |

### 7. Database Usage

| Collection | Operation | Description                    |
|------------|-----------|--------------------------------|
| `users`    | Find      | Filtered + paginated students  |
| `users`    | Count     | Total for pagination           |

---

## PATCH /api/v1/admin/students/:id/toggle

### 1. API Summary

| Method | Endpoint                             | Purpose                         | Auth Required      |
|--------|--------------------------------------|---------------------------------|--------------------|
| PATCH  | `/api/v1/admin/students/:id/toggle`  | Toggle student active/inactive  | Yes — `admin` role |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Student deactivated",
  "data": { "_id": "664a1f2e...", "isActive": false }
}
```

### 7. Database Usage

| Collection | Operation | Description                                |
|------------|-----------|---------------------------------------------|
| `users`    | Find      | Verify user is a student                    |
| `users`    | Update    | Toggle `isActive` and save                  |

---

## GET /api/v1/admin/examiners

### 1. API Summary

| Method | Endpoint                  | Purpose                     | Auth Required      |
|--------|---------------------------|-----------------------------|--------------------|
| GET    | `/api/v1/admin/examiners` | List all examiners          | Yes — `admin` role |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                        |
|----------|--------|----------|----------|------------------------------------|
| `search` | String | No       | Query    | Search by name or email (regex)    |

### 7. Database Usage

| Collection | Operation | Description                    |
|------------|-----------|--------------------------------|
| `users`    | Find      | Filter `role: "examiner"`      |

---

## POST /api/v1/admin/examiners

### 1. API Summary

| Method | Endpoint                  | Purpose              | Auth Required      |
|--------|---------------------------|----------------------|--------------------|
| POST   | `/api/v1/admin/examiners` | Create examiner user | Yes — `admin` role |

### 2. Request Parameters

| Field      | Type   | Required | Location | Description          |
|------------|--------|----------|----------|----------------------|
| `name`     | String | Yes      | Body     | Examiner's full name |
| `email`    | String | Yes      | Body     | Unique email         |
| `password` | String | Yes      | Body     | Initial password     |
| `phone`    | String | No       | Body     | Mobile number        |

### 6. Business Logic
Checks for email uniqueness. Creates user with `role: "examiner"`. Password is hashed by the pre-save hook.

### 7. Database Usage

| Collection | Operation | Description                          |
|------------|-----------|--------------------------------------|
| `users`    | Find      | Email duplicate check                |
| `users`    | Insert    | Create examiner document             |

---

## PATCH /api/v1/admin/examiners/:id/toggle

Same pattern as student toggle — activates/deactivates examiner. See `PATCH /admin/students/:id/toggle`.

---

## GET /api/v1/admin/submissions

### 1. API Summary

| Method | Endpoint                    | Purpose                          | Auth Required      |
|--------|-----------------------------|----------------------------------|--------------------|
| GET    | `/api/v1/admin/submissions` | Paginated list of all submissions| Yes — `admin` role |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                                       |
|----------|--------|----------|----------|---------------------------------------------------|
| `status` | String | No       | Query    | `pending` \| `evaluated` \| `approved`            |
| `page`   | Number | No       | Query    | Default `1`                                       |
| `limit`  | Number | No       | Query    | Default `20`                                      |

### 7. Database Usage

| Collection    | Operation | Description                                           |
|---------------|-----------|-------------------------------------------------------|
| `submissions` | Find      | Filtered + paginated, populated with student/exam/course/examiner |
| `submissions` | Count     | Total count for pagination                            |

---

## PATCH /api/v1/admin/submissions/:id/assign

### 1. API Summary

| Method | Endpoint                               | Purpose                          | Auth Required      |
|--------|----------------------------------------|----------------------------------|--------------------|
| PATCH  | `/api/v1/admin/submissions/:id/assign` | Assign submission to an examiner | Yes — `admin` role |

### 2. Request Parameters

| Field        | Type   | Required | Location | Description               |
|--------------|--------|----------|----------|---------------------------|
| `id`         | String | Yes      | Path     | Submission ObjectId       |
| `examinerId` | String | Yes      | Body     | Examiner user ObjectId    |

### 4. Sample Request
```json
{ "examinerId": "664a1f2e3b9c4d0012ab9999" }
```

### 7. Database Usage

| Collection    | Operation | Description                              |
|---------------|-----------|------------------------------------------|
| `users`       | Find      | Verify examinerId is an active examiner  |
| `submissions` | Find      | Locate submission                        |
| `submissions` | Update    | Set `assignedExaminer`                   |

---

## GET /api/v1/admin/results/pending

### 1. API Summary

| Method | Endpoint                         | Purpose                              | Auth Required      |
|--------|----------------------------------|--------------------------------------|--------------------|
| GET    | `/api/v1/admin/results/pending`  | Get passed results awaiting approval | Yes — `admin` role |

### 2. Request Parameters

| Field   | Type   | Required | Location | Description   |
|---------|--------|----------|----------|---------------|
| `page`  | Number | No       | Query    | Default `1`   |
| `limit` | Number | No       | Query    | Default `20`  |

### 7. Database Usage

| Collection | Operation | Description                                               |
|------------|-----------|-----------------------------------------------------------|
| `results`  | Find      | Filter `{ approvedByAdmin: false, isPassed: true }` + paginate |
| `results`  | Count     | Total pending for pagination                              |

---

## GET /api/v1/admin/results

### 1. API Summary

| Method | Endpoint               | Purpose                      | Auth Required      |
|--------|------------------------|------------------------------|--------------------|
| GET    | `/api/v1/admin/results`| Paginated list of all results| Yes — `admin` role |

| Field   | Type   | Required | Location | Description   |
|---------|--------|----------|----------|---------------|
| `page`  | Number | No       | Query    | Default `1`   |
| `limit` | Number | No       | Query    | Default `20`  |

### 7. Database Usage

| Collection | Operation | Description                                |
|------------|-----------|--------------------------------------------|
| `results`  | Find      | All results, paginated, populated          |
| `results`  | Count     | Total for pagination                       |

---

## PATCH /api/v1/admin/results/:id/approve

### 1. API Summary

| Method | Endpoint                            | Purpose                                       | Auth Required      |
|--------|-------------------------------------|-----------------------------------------------|--------------------|
| PATCH  | `/api/v1/admin/results/:id/approve` | Approve a result and auto-generate certificate| Yes — `admin` role |

### 6. Business Logic
1. Loads result by ID with student and submission populated.
2. Throws `400` if already approved or if student failed.
3. Sets `approvedByAdmin = true`, `approvedAt = now()`.
4. Automatically calls `certService.generateCertificate()` which:
   - Generates a UUID certificate ID.
   - Renders a styled A4 landscape PDF using PDFKit (ISKCON branding — saffron/gold theme).
   - Saves the PDF file to the `generated-certs/` directory.
   - Inserts a certificate document in the database.
   - Returns the certificate (or existing certificate if already issued).
5. Certificate generation failure is non-fatal — result is saved regardless.

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Result approved",
  "data": {
    "result": { "_id": "...", "approvedByAdmin": true, "approvedAt": "2024-06-04T09:00:00.000Z", ... },
    "certificate": { "_id": "...", "certificateId": "3f4a-...", "issuedAt": "...", "verificationUrl": "..." }
  }
}
```

### 7. Database Usage

| Collection     | Operation | Description                                |
|----------------|-----------|--------------------------------------------|
| `results`      | Find      | Load result with student + submission      |
| `results`      | Update    | Set `approvedByAdmin` + `approvedAt`       |
| `courses`      | Find      | Get course title for PDF                   |
| `certificates` | Find      | Check if cert already exists               |
| `certificates` | Insert    | Create certificate document                |

---

## GET /api/v1/admin/certificates

### 1. API Summary

| Method | Endpoint                    | Purpose                        | Auth Required      |
|--------|-----------------------------|--------------------------------|--------------------|
| GET    | `/api/v1/admin/certificates`| Paginated list of all certs    | Yes — `admin` role |

### 7. Database Usage

| Collection     | Operation | Description                                   |
|----------------|-----------|-----------------------------------------------|
| `certificates` | Find      | Paginated, populated with student + course     |
| `certificates` | Count     | Total for pagination                           |

---

## GET /api/v1/admin/reports

### 1. API Summary

| Method | Endpoint               | Purpose                              | Auth Required      |
|--------|------------------------|--------------------------------------|--------------------|
| GET    | `/api/v1/admin/reports`| Aggregated analytics for reports UI  | Yes — `admin` role |

### 3. Response Fields

| Field                          | Type  | Description                           |
|--------------------------------|-------|---------------------------------------|
| `data.enrollmentsByMonth`      | Array | Monthly enrollment count (last 12)    |
| `data.resultsByStatus`         | Array | `[{ _id: true/false, count }]` pass/fail split |
| `data.topCourses`              | Array | Top 5 courses by enrollment count     |
| `data.examinerStats`           | Array | Examiner workload: total + evaluated  |

### 7. Database Usage

| Collection    | Operation | Description                              |
|---------------|-----------|------------------------------------------|
| `enrollments` | Aggregate | Monthly grouping (last 12 months)        |
| `results`     | Aggregate | Pass/fail grouping                       |
| `enrollments` | Aggregate | Top 5 courses by enrollment + $lookup    |
| `submissions` | Aggregate | Examiner workload + $lookup to users     |

---

## GET /api/v1/admin/export

### 1. API Summary

| Method | Endpoint               | Purpose                      | Auth Required      |
|--------|------------------------|------------------------------|--------------------|
| GET    | `/api/v1/admin/export` | Download data as CSV file    | Yes — `admin` role |

### 2. Request Parameters

| Field  | Type   | Required | Location | Description                                      |
|--------|--------|----------|----------|--------------------------------------------------|
| `type` | String | No       | Query    | `students` (default) \| `results` \| `certificates` |

### 5. Response
Binary CSV download with appropriate headers:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="students.csv"
```

### 6. Business Logic
Based on `type`, fetches the relevant documents, builds CSV rows, RFC-4180 escapes all values (double-quote escaping), and streams the response.

### 7. Database Usage

| Collection     | Operation | Description                                           |
|----------------|-----------|-------------------------------------------------------|
| `users`        | Find      | For `type=students`                                   |
| `results`      | Find      | For `type=results`, populated with student + exam     |
| `certificates` | Find      | For `type=certificates`, populated with student + course |

---

---

# MODULE 9 — TEMPLE REGISTRATION

---

## POST /api/v1/temples/step

### 1. API Summary

| Method | Endpoint               | Purpose                              | Auth Required |
|--------|------------------------|--------------------------------------|---------------|
| POST   | `/api/v1/temples/step` | Save one step of multi-step temple registration draft | No |

### 2. Request Parameters — Step 1 (Temple Details)

| Field              | Type   | Required | Location | Description                    |
|--------------------|--------|----------|----------|--------------------------------|
| `step`             | Number | Yes      | Body     | Must be `1`                    |
| `temple_name`      | String | Yes      | Body     | Temple name                    |
| `gst_number`       | String | Yes      | Body     | Valid 15-char GST number       |
| `address`          | Object | Yes      | Body     | Address object (see below)     |
| `address.line1`    | String | Yes      | Body     | Address line 1                 |
| `address.city`     | String | Yes      | Body     | City                           |
| `address.state`    | String | Yes      | Body     | State                          |
| `address.country`  | String | Yes      | Body     | Country                        |
| `address.pin_code` | String | Yes      | Body     | 6-digit postal code            |
| `logo_doc_id`      | String | No       | Body     | Document ObjectId for logo     |

### 2. Request Parameters — Steps 2 & 3 (President / Vice-President)

| Field             | Type    | Required | Location | Description                                          |
|-------------------|---------|----------|----------|------------------------------------------------------|
| `step`            | Number  | Yes      | Body     | `2` (President) or `3` (Vice-President)              |
| `temple_id`       | String  | Yes      | Body     | Temple ObjectId from Step 1 response                 |
| `name`            | String  | Yes      | Body     | Full name                                            |
| `mobile`          | String  | Yes      | Body     | 10-digit mobile number                               |
| `mobile_verified` | Boolean | Yes      | Body     | Must be `true` (OTP verified)                        |
| `pan_number`      | String  | Yes      | Body     | PAN card number                                      |
| `aadhaar_number`  | String  | Yes      | Body     | 12-digit Aadhaar number                              |
| `email`           | String  | Yes      | Body     | Gmail address                                        |
| `photo_doc_id`    | String  | No       | Body     | Document ObjectId for passport photo                 |
| `id_card_doc_id`  | String  | No       | Body     | Document ObjectId for ID card                        |

### 4. Sample Request — Step 1
```json
{
  "step": 1,
  "temple_name": "Shri Ganesh Mandir",
  "gst_number": "27AABCU9603R1ZX",
  "address": {
    "line1": "123 Temple Road",
    "city": "Pune",
    "state": "Maharashtra",
    "country": "India",
    "pin_code": "411001"
  },
  "logo_doc_id": "665h8g9l7i6k1j0089hi0200"
}
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Step saved successfully",
  "data": {
    "temple_id": "665h8g9l7i6k1j0089hi0123",
    "current_step": 2
  }
}
```

### 6. Business Logic
1. Extracts only step-relevant fields from `req.body` (`_rawStepPayload`).
2. Validates using the Joi schema for the given step number.
3. **Step 1 only**: Checks GST uniqueness. Creates the temple as a `DRAFT` via upsert.
4. **Steps 2–3**: Requires `temple_id`. Finds the draft, updates `president` or `vice_president` sub-document, advances `current_step`.
5. Returns the `temple_id` and the next step number.

### 7. Database Usage

| Collection | Operation | Description                                                 |
|------------|-----------|-------------------------------------------------------------|
| `temples`  | Find      | GST uniqueness check (Step 1)                               |
| `temples`  | Upsert    | Create/update draft on Step 1                               |
| `temples`  | Find      | Load draft by ID (Steps 2–3)                                |
| `temples`  | Update    | Set president/vice_president sub-doc, advance current_step  |

---

## POST /api/v1/temples/validate-step

### 1. API Summary

| Method | Endpoint                        | Purpose                              | Auth Required |
|--------|---------------------------------|--------------------------------------|---------------|
| POST   | `/api/v1/temples/validate-step` | Validate step data without saving    | No            |

### 2. Request Parameters
Same as `/temples/step` — same `step` + step-specific fields. No `temple_id` needed.

### 5. Sample Response — `200 OK`
```json
{ "success": true, "message": "Step data is valid", "data": { "valid": true } }
```

### 5. Error Response — `422 Unprocessable Entity`
```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    { "field": "gst_number", "message": "Invalid GST format" }
  ]
}
```

### 6. Business Logic
Runs only Joi validation against the step schema — no database writes. Used for real-time form field validation on the frontend.

### 7. Database Usage
None.

---

## POST /api/v1/temples/register

### 1. API Summary

| Method | Endpoint                  | Purpose                                       | Auth Required |
|--------|---------------------------|-----------------------------------------------|---------------|
| POST   | `/api/v1/temples/register`| Final submission — completes temple registration | No          |

### 2. Request Parameters

| Field       | Type   | Required | Location | Description                               |
|-------------|--------|----------|----------|-------------------------------------------|
| `temple_id` | String | Yes      | Body     | Temple ObjectId from the draft created in Step 1 |

### 4. Sample Request
```json
{ "temple_id": "665h8g9l7i6k1j0089hi0123" }
```

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "Temple registered successfully",
  "data": {
    "temple_id": "665h8g9l7i6k1j0089hi0123",
    "president": {
      "user_id": "665i9h0m8j7l2k0090ij1234",
      "username": "ramesh5678",
      "meet_id": "MEET-00001"
    },
    "vice_president": {
      "user_id": "665j0i1n9k8m3l0001jk2345",
      "username": "sunita3210",
      "meet_id": "MEET-00002"
    },
    "message": "Login credentials have been sent to both President and Vice-President email addresses."
  }
}
```

### 6. Business Logic
1. Loads the draft temple — throws `404` if not found.
2. Throws `409` if `status ≠ DRAFT` (prevents duplicate submission).
3. Validates all required fields are present (`_assertTempleComplete`).
4. Validates President ≠ Vice-President (cross-person uniqueness check on PAN, mobile, email).
5. Runs global duplicate checks across all submitted temples via `templeUserRepository`.
6. Validates all referenced document IDs exist in the `documents` collection.
7. Executes a **MongoDB transaction** (falls back to non-transactional on standalone dev):
   - Generates unique usernames, bcrypt-hashed passwords, and meet IDs for President + VP.
   - Creates two `TempleUser` documents.
   - Updates temple `status → SUBMITTED`, `current_step → 5`, links user IDs and meet IDs.
   - Links all uploaded documents to the temple via `document.temple_id`.
   - Creates an `AuditLog` entry for `TEMPLE_SUBMITTED`.
8. Sends credential emails to both President and VP (non-critical — email failures are logged, not thrown).
9. Returns only safe fields (passwords are **not** in the API response — emailed only).

### 7. Database Usage

| Collection    | Operation | Description                                      |
|---------------|-----------|--------------------------------------------------|
| `temples`     | Find      | Load draft by ID                                 |
| `temple_users`| Find (x6) | Duplicate PAN/mobile/email checks                |
| `documents`   | Find (x4) | Validate doc IDs exist                           |
| `temple_users`| Insert (x2)| Create President + VP login accounts            |
| `temples`     | Update    | Submit status, link user IDs + meet IDs          |
| `documents`   | Update    | Link all uploaded docs to this temple            |
| `auditlogs`   | Insert    | Write TEMPLE_SUBMITTED audit record              |
| `counters`    | Upsert    | Atomic increment of meet_id sequence             |

---

## GET /api/v1/temples/:id

### 1. API Summary

| Method | Endpoint               | Purpose             | Auth Required |
|--------|------------------------|---------------------|---------------|
| GET    | `/api/v1/temples/:id`  | Fetch temple by ID  | No            |

### 2. Request Parameters

| Field | Type   | Required | Location | Description          |
|-------|--------|----------|----------|----------------------|
| `id`  | String | Yes      | Path     | Temple MongoDB ObjectId |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Temple fetched successfully",
  "data": {
    "temple": {
      "_id": "665h8g9l7i6k1j0089hi0123",
      "temple_name": "Shri Ganesh Mandir",
      "gst_number": "27AABCU9603R1ZX",
      "status": "SUBMITTED",
      "current_step": 5,
      "address": { "line1": "123 Temple Road", "city": "Pune", ... },
      "president": { "name": "Ramesh Patel", "mobile": "9812345678", ... },
      "vice_president": { ... }
    }
  }
}
```

### 7. Database Usage

| Collection | Operation | Description                              |
|------------|-----------|------------------------------------------|
| `temples`  | Find      | Lookup by `_id` with populated doc refs  |

---

---

# MODULE 10 — OTP

---

## POST /api/v1/otp/send

### 1. API Summary

| Method | Endpoint           | Purpose                        | Auth Required |
|--------|--------------------|--------------------------------|---------------|
| POST   | `/api/v1/otp/send` | Send OTP to a mobile number    | No            |

Rate limited: **5 requests per 10 minutes per IP**.

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                        |
|----------|--------|----------|----------|------------------------------------|
| `mobile` | String | Yes      | Body     | 10-digit mobile number             |

### 4. Sample Request
```json
{ "mobile": "9812345678" }
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "OTP sent to mobile ending with 5678",
  "data": {}
}
```
> In **non-production** environments, `data.otp` is included for testing convenience.

### 6. Business Logic
1. Validates mobile is a 10-digit number.
2. Calls `otpService.sendOtp(mobile, "REGISTRATION", ipAddress)` which generates a 6-digit OTP, bcrypt-hashes it, stores the document with a TTL expiry, and (in production) dispatches an SMS.
3. Returns a masked confirmation message.

### 7. Database Usage

| Collection         | Operation | Description                              |
|--------------------|-----------|------------------------------------------|
| `otpverifications` | Insert    | Store hashed OTP with TTL expiry         |

---

## POST /api/v1/otp/verify

### 1. API Summary

| Method | Endpoint             | Purpose               | Auth Required |
|--------|----------------------|-----------------------|---------------|
| POST   | `/api/v1/otp/verify` | Verify a mobile OTP   | No            |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description               |
|----------|--------|----------|----------|---------------------------|
| `mobile` | String | Yes      | Body     | 10-digit mobile number    |
| `otp`    | String | Yes      | Body     | 6-digit OTP               |

### 4. Sample Request
```json
{ "mobile": "9812345678", "otp": "482910" }
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Mobile number verified successfully",
  "data": { "verified": true }
}
```

### 6. Business Logic
1. Validates mobile (10-digit) and OTP (6-digit) format.
2. Finds the latest unused, unexpired OTP for the mobile + purpose combination.
3. Increments `attempts` counter — throws `429` or similar if max attempts exceeded.
4. Compares bcrypt hash of submitted OTP against stored hash.
5. On match: sets `is_used = true` to prevent reuse.
6. On mismatch: throws `401` with remaining attempts info.

### 7. Database Usage

| Collection         | Operation | Description                               |
|--------------------|-----------|-------------------------------------------|
| `otpverifications` | Find      | Lookup by mobile + purpose + `is_used: false` |
| `otpverifications` | Update    | Increment attempts; set `is_used: true`   |

---

---

# MODULE 11 — FILE UPLOADS

---

## POST /api/v1/uploads

### 1. API Summary

| Method | Endpoint          | Purpose                                           | Auth Required |
|--------|-------------------|---------------------------------------------------|---------------|
| POST   | `/api/v1/uploads` | Upload a single file (logo, photo, or ID card)    | No            |

Rate limited: **30 uploads per 15 minutes per IP**.

### 2. Request Parameters

| Field       | Type   | Required | Location                | Description                                          |
|-------------|--------|----------|-------------------------|------------------------------------------------------|
| `file`      | File   | Yes      | Multipart form-data     | File to upload. Allowed: PDF, JPG, JPEG, PNG, GIF. Max 5 MB |
| `file_type` | String | Yes      | Query / Body / `x-file-type` header | `logo` \| `photo` \| `id_card`       |

The `file_type` is read from `req.query.file_type` → `req.body.file_type` → `req.headers['x-file-type']` (in priority order). It determines the storage subfolder (`logos/`, `photos/`, `id_cards/`).

### 4. Sample Request
```
POST /api/v1/uploads?file_type=photo
Content-Type: multipart/form-data

file: [binary file content]
```

### 5. Sample Response — `201 Created`
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "665h8g9l7i6k1j0089hi0201",
    "original_name": "ramesh_photo.jpg",
    "stored_name": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    "file_path": "/uploads/photos/a1b2c3d4.jpg",
    "file_url": null,
    "mime_type": "image/jpeg",
    "size_bytes": 204800,
    "file_type": "photo"
  }
}
```

### 6. Business Logic
1. `uploadLimiter` enforces rate limiting.
2. Dynamic multer middleware selects the subfolder based on `file_type`.
3. Validates `file_type` against allowed enum (`logo`, `photo`, `id_card`).
4. Calls `uploadService.saveDocument()` which creates a `Document` record in the database.
5. Returns the document `_id` — the UI stores this as `photo_doc_id` / `id_card_doc_id` / `logo_doc_id` in subsequent step submissions.

### 7. Database Usage

| Collection  | Operation | Description                                 |
|-------------|-----------|---------------------------------------------|
| `documents` | Insert    | Create document metadata record             |

---

---

# MODULE 12 — TEMPLE USER DUPLICATE CHECK

---

## GET /api/v1/temple-users/check-duplicate

### 1. API Summary

| Method | Endpoint                                | Purpose                                          | Auth Required |
|--------|-----------------------------------------|--------------------------------------------------|---------------|
| GET    | `/api/v1/temple-users/check-duplicate`  | Check if PAN / mobile / email already registered | No            |

### 2. Request Parameters

| Field    | Type   | Required | Location | Description                    |
|----------|--------|----------|----------|--------------------------------|
| `pan`    | String | No       | Query    | PAN number to check            |
| `mobile` | String | No       | Query    | 10-digit mobile to check       |
| `email`  | String | No       | Query    | Gmail address to check         |

At least one field should be provided. Any combination is valid.

### 4. Sample Request
```
GET /api/v1/temple-users/check-duplicate?pan=ABCDE1234F&mobile=9812345678
```

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "Duplicate data detected",
  "data": {
    "pan_exists": true,
    "mobile_exists": false
  }
}
```

### 6. Business Logic
Only checks the fields provided in the query. Runs individual existence queries for each provided field. Returns a boolean flag per field. Used by the frontend for real-time field-level duplicate detection during the registration form.

### 7. Database Usage

| Collection    | Operation | Description                                              |
|---------------|-----------|----------------------------------------------------------|
| `temple_users`| Find (x3) | Existence check by PAN, mobile, email (only fields sent) |

---

---

# MODULE 13 — HEALTH CHECK

---

## GET /api/v1/health

### 1. API Summary

| Method | Endpoint          | Purpose                     | Auth Required |
|--------|-------------------|-----------------------------|---------------|
| GET    | `/api/v1/health`  | API liveness check          | No            |

### 5. Sample Response — `200 OK`
```json
{
  "success": true,
  "message": "ISKCON Portal API is running ✅",
  "timestamp": "2024-06-10T08:00:00.000Z"
}
```

---

---

# Error Reference

| HTTP Status | Meaning                        | When Triggered                                          |
|-------------|--------------------------------|---------------------------------------------------------|
| `400`       | Bad Request                    | Missing required fields, invalid enum values            |
| `401`       | Unauthorized                   | Missing/invalid/expired token, wrong credentials        |
| `403`       | Forbidden                      | Authenticated but wrong role, inactive account          |
| `404`       | Not Found                      | Resource doesn't exist or is unpublished                |
| `409`       | Conflict                       | Duplicate email, GST, enrollment, or submission         |
| `422`       | Unprocessable Entity           | Joi/Zod validation failure with field-level errors      |
| `429`       | Too Many Requests              | Rate limiter triggered                                  |
| `500`       | Internal Server Error          | Unhandled exceptions caught by global error handler     |

---

# Complete Endpoint Quick-Reference

| Method | Endpoint                                  | Module        | Auth        | Role         |
|--------|-------------------------------------------|---------------|-------------|--------------|
| POST   | `/api/v1/auth/register`                   | Auth          | No          | —            |
| POST   | `/api/v1/auth/login`                      | Auth          | No          | —            |
| POST   | `/api/v1/auth/logout`                     | Auth          | Bearer      | Any          |
| POST   | `/api/v1/auth/refresh`                    | Auth          | Cookie      | —            |
| GET    | `/api/v1/auth/me`                         | Auth          | Bearer      | Any          |
| GET    | `/api/v1/auth/google`                     | Auth          | No          | —            |
| GET    | `/api/v1/auth/google/callback`            | Auth          | OAuth       | —            |
| GET    | `/api/v1/courses`                         | Courses       | No          | —            |
| GET    | `/api/v1/courses/:id`                     | Courses       | No          | —            |
| POST   | `/api/v1/courses`                         | Courses       | Bearer      | admin        |
| PUT    | `/api/v1/courses/:id`                     | Courses       | Bearer      | admin        |
| DELETE | `/api/v1/courses/:id`                     | Courses       | Bearer      | admin        |
| GET    | `/api/v1/enrollments/my`                  | Enrollments   | Bearer      | student      |
| POST   | `/api/v1/enrollments`                     | Enrollments   | Bearer      | student      |
| PATCH  | `/api/v1/enrollments/:id/progress`        | Enrollments   | Bearer      | student      |
| GET    | `/api/v1/exams/course/:courseId`          | Exams         | Bearer      | student      |
| POST   | `/api/v1/submissions`                     | Submissions   | Bearer      | student      |
| POST   | `/api/v1/submissions/upload`              | Submissions   | Bearer      | student      |
| GET    | `/api/v1/submissions/assigned`            | Submissions   | Bearer      | examiner/admin|
| GET    | `/api/v1/submissions/:id`                 | Submissions   | Bearer      | examiner/admin|
| PATCH  | `/api/v1/submissions/:id/evaluate`        | Submissions   | Bearer      | examiner     |
| GET    | `/api/v1/results/my`                      | Results       | Bearer      | student      |
| GET    | `/api/v1/certificates/verify/:certId`     | Certificates  | No          | —            |
| GET    | `/api/v1/certificates/my`                 | Certificates  | Bearer      | student      |
| GET    | `/api/v1/certificates/:id/download`       | Certificates  | Bearer      | student      |
| GET    | `/api/v1/admin/dashboard`                 | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/students`                  | Admin         | Bearer      | admin        |
| PATCH  | `/api/v1/admin/students/:id/toggle`       | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/examiners`                 | Admin         | Bearer      | admin        |
| POST   | `/api/v1/admin/examiners`                 | Admin         | Bearer      | admin        |
| PATCH  | `/api/v1/admin/examiners/:id/toggle`      | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/submissions`               | Admin         | Bearer      | admin        |
| PATCH  | `/api/v1/admin/submissions/:id/assign`    | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/results`                   | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/results/pending`           | Admin         | Bearer      | admin        |
| PATCH  | `/api/v1/admin/results/:id/approve`       | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/certificates`              | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/reports`                   | Admin         | Bearer      | admin        |
| GET    | `/api/v1/admin/export`                    | Admin         | Bearer      | admin        |
| POST   | `/api/v1/temples/step`                    | Temple Reg    | No          | —            |
| POST   | `/api/v1/temples/validate-step`           | Temple Reg    | No          | —            |
| POST   | `/api/v1/temples/register`                | Temple Reg    | No          | —            |
| GET    | `/api/v1/temples/:id`                     | Temple Reg    | No          | —            |
| POST   | `/api/v1/otp/send`                        | OTP           | No          | —            |
| POST   | `/api/v1/otp/verify`                      | OTP           | No          | —            |
| POST   | `/api/v1/uploads`                         | Uploads       | No          | —            |
| GET    | `/api/v1/temple-users/check-duplicate`    | Temple Users  | No          | —            |
| GET    | `/api/v1/health`                          | Health        | No          | —            |
