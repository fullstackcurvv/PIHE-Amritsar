# MongoDB Collections — Complete Overview

> **Generated:** 2026-04-18  
> **Codebase:** SaaS Common Modules (MERN) — `SourceCode/backend/` + `SourceCode/Temple/Registration/backend/`  
> **ODM:** Mongoose 7+  
> **Database:** `saas_modules` (configurable via `MONGO_URI`)

---

## Collection Inventory

| # | Collection Name     | Mongoose Model  | Source File               | Domain              |
|---|---------------------|-----------------|---------------------------|---------------------|
| 1 | `users`             | `User`          | `models/User.js`          | Auth / LMS          |
| 2 | `courses`           | `Course`        | `models/Course.js`        | LMS                 |
| 3 | `enrollments`       | `Enrollment`    | `models/Enrollment.js`    | LMS                 |
| 4 | `exams`             | `Exam`          | `models/Exam.js`          | LMS / Examination   |
| 5 | `submissions`       | `Submission`    | `models/Submission.js`    | LMS / Examination   |
| 6 | `results`           | `Result`        | `models/Result.js`        | LMS / Examination   |
| 7 | `certificates`      | `Certificate`   | `models/Certificate.js`   | LMS / Certification |
| 8 | `temples`           | `Temple`        | `models/Temple.model.js`  | Temple Registration |
| 9 | `temple_users`      | `TempleUser`    | `models/TempleUser.model.js` | Temple Auth      |
| 10| `otpverifications`  | `OtpVerification` | `models/OtpVerification.model.js` | Auth / OTP |
| 11| `auditlogs`         | `AuditLog`      | `models/AuditLog.model.js`| Audit / Compliance  |
| 12| `counters`          | `Counter`       | `models/Counter.model.js` | Utility / Sequences |
| 13| `documents`         | `Document`      | `models/Document.model.js`| File Management     |

---

## 1. `users`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `users` | Core identity store for students, examiners, and admins on the LMS platform. Handles bcrypt password hashing, Google OAuth, JWT refresh tokens, and soft-delete via `isActive`. | `email`, `role`, `studentId`, `password` | Referenced by `courses` (createdBy), `enrollments` (student), `exams` (via results), `submissions`, `results`, `certificates` |

### Field Table

| Field Name    | Data Type  | Required | Default   | Description / Usage |
|---------------|-----------|----------|-----------|---------------------|
| `_id`         | ObjectId  | Auto     | —         | MongoDB primary key |
| `studentId`   | String    | No       | —         | Auto-assigned unique student ID; sparse unique index |
| `name`        | String    | **Yes**  | —         | Full name; 2–100 chars, trimmed |
| `email`       | String    | **Yes**  | —         | Unique, lowercase; used as login identifier |
| `password`    | String    | No       | —         | Bcrypt hash (12 rounds); `select: false`; omitted for Google OAuth users |
| `googleId`    | String    | No       | —         | Google OAuth sub-ID; sparse unique, `select: false` |
| `role`        | String    | No       | `student` | Enum: `admin` \| `examiner` \| `student` |
| `avatar`      | String    | No       | `null`    | URL to profile picture |
| `phone`       | String    | No       | —         | Indian mobile: /^[6-9]\d{9}$/ |
| `isActive`    | Boolean   | No       | `true`    | Soft-delete flag |
| `refreshToken`| String    | No       | —         | JWT refresh token; `select: false` |
| `createdAt`   | Date      | Auto     | —         | Mongoose timestamps |
| `updatedAt`   | Date      | Auto     | —         | Mongoose timestamps |

### Indexes
- `email` — unique
- `studentId` — unique, sparse
- `role` — regular index

### Sample Document
```json
{
  "_id": "664a1f2e3b9c4d0012ab3456",
  "studentId": "STU-0042",
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "role": "student",
  "avatar": "https://cdn.example.com/avatars/priya.jpg",
  "phone": "9876543210",
  "isActive": true,
  "createdAt": "2024-05-18T09:30:00.000Z",
  "updatedAt": "2024-06-01T14:22:00.000Z"
}
```

---

## 2. `courses`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `courses` | Stores course catalog including embedded lessons and study materials. Supports free and paid courses with publish/feature flags. | `title`, `category`, `level`, `isPaid`, `isPublished` | `createdBy` → `users._id`; Referenced by `enrollments`, `exams`, `submissions`, `certificates` |

### Field Table

| Field Name       | Data Type          | Required | Default | Description / Usage |
|------------------|--------------------|----------|---------|---------------------|
| `_id`            | ObjectId           | Auto     | —       | Primary key |
| `title`          | String             | **Yes**  | —       | Course title; max 200 chars |
| `description`    | String             | **Yes**  | —       | Course description; max 2000 chars |
| `thumbnail`      | String             | No       | `null`  | URL to thumbnail image |
| `category`       | String             | **Yes**  | —       | Course category (e.g. "Programming") |
| `level`          | String             | **Yes**  | —       | Enum: `Beginner` \| `Intermediate` \| `Advanced` |
| `isPaid`         | Boolean            | No       | `false` | Free vs paid course toggle |
| `price`          | Number             | No       | `0`     | Price in currency; min 0 |
| `lessons`        | [lessonSchema]     | No       | `[]`    | **Embedded** array of lesson sub-documents |
| `studyMaterials` | [studyMaterialSchema] | No    | `[]`    | **Embedded** array of downloadable materials |
| `tags`           | [String]           | No       | `[]`    | Searchable tags array |
| `isPublished`    | Boolean            | No       | `false` | Visibility toggle |
| `isFeatured`     | Boolean            | No       | `false` | Featured placement flag |
| `isBestSeller`   | Boolean            | No       | `false` | Best-seller badge |
| `isPopular`      | Boolean            | No       | `false` | Popular badge |
| `createdBy`      | ObjectId (ref User)| **Yes**  | —       | Examiner/admin who created the course |
| `createdAt`      | Date               | Auto     | —       | — |
| `updatedAt`      | Date               | Auto     | —       | — |

#### Embedded: `lessons[]`
| Field        | Type    | Required | Description |
|-------------|---------|----------|-------------|
| `title`     | String  | **Yes**  | Lesson title |
| `content`   | String  | No       | Text/HTML content |
| `videoUrl`  | String  | No       | Video stream URL |
| `duration`  | Number  | No       | Duration in minutes; default 0 |
| `order`     | Number  | **Yes**  | Sort order within course |
| `isPublished` | Boolean | No    | Per-lesson visibility; default true |

#### Embedded: `studyMaterials[]`
| Field      | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `title`   | String | **Yes**  | Material title |
| `fileUrl` | String | **Yes**  | Download URL |
| `fileType`| String | No       | Default `pdf` |
| `fileSize`| Number | No       | File size in bytes |

### Virtual Fields
- `lessonCount` — computed count of `lessons` array

### Indexes
- `isPublished` + `category` (compound)
- `tags`
- `isFeatured`
- `createdAt` (descending)

### Sample Document
```json
{
  "_id": "664b2a3f1c0e5d0023bc4567",
  "title": "Introduction to Vedic Mathematics",
  "description": "A beginner-friendly course covering ancient mathematical techniques.",
  "thumbnail": "https://cdn.example.com/courses/vedic-math.jpg",
  "category": "Mathematics",
  "level": "Beginner",
  "isPaid": true,
  "price": 499,
  "lessons": [
    {
      "title": "Lesson 1: Sutra Basics",
      "content": "Overview of the 16 Sutras...",
      "videoUrl": "https://videos.example.com/lesson1.mp4",
      "duration": 35,
      "order": 1,
      "isPublished": true
    }
  ],
  "studyMaterials": [
    {
      "title": "Sutra Reference Sheet",
      "fileUrl": "https://cdn.example.com/materials/sutras.pdf",
      "fileType": "pdf",
      "fileSize": 204800
    }
  ],
  "tags": ["mathematics", "vedic", "beginner"],
  "isPublished": true,
  "isFeatured": true,
  "isBestSeller": false,
  "isPopular": true,
  "createdBy": "664a1f2e3b9c4d0012ab9999",
  "createdAt": "2024-05-20T10:00:00.000Z",
  "updatedAt": "2024-06-01T08:00:00.000Z"
}
```

---

## 3. `enrollments`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `enrollments` | Tracks which students are enrolled in which courses, their progress, completed lessons, and payment status. Unique constraint on student+course pair prevents double-enrollment. | `student`, `course`, `status`, `progress` | `student` → `users._id`; `course` → `courses._id` |

### Field Table

| Field Name         | Data Type         | Required | Default   | Description / Usage |
|--------------------|-------------------|----------|-----------|---------------------|
| `_id`              | ObjectId          | Auto     | —         | Primary key |
| `student`          | ObjectId (ref User)| **Yes** | —         | Enrolled student |
| `course`           | ObjectId (ref Course)| **Yes**| —        | Target course |
| `enrolledAt`       | Date              | No       | `Date.now`| Enrollment timestamp |
| `progress`         | Number            | No       | `0`       | Completion % (0–100) |
| `completedLessons` | [ObjectId]        | No       | `[]`      | Array of completed lesson `_id`s |
| `status`           | String            | No       | `active`  | Enum: `active` \| `completed` \| `dropped` |
| `paymentStatus`    | String            | No       | `free`    | Enum: `free` \| `paid` \| `pending` |
| `createdAt`        | Date              | Auto     | —         | — |
| `updatedAt`        | Date              | Auto     | —         | — |

### Indexes
- `student` + `course` — **unique compound** (prevents duplicate enrollment)
- `student`
- `status`

### Sample Document
```json
{
  "_id": "664c3b4g2d1f6e0034cd5678",
  "student": "664a1f2e3b9c4d0012ab3456",
  "course": "664b2a3f1c0e5d0023bc4567",
  "enrolledAt": "2024-05-21T07:30:00.000Z",
  "progress": 45,
  "completedLessons": ["664b2a3f1c0e5d0023bc4568"],
  "status": "active",
  "paymentStatus": "paid",
  "createdAt": "2024-05-21T07:30:00.000Z",
  "updatedAt": "2024-06-02T12:00:00.000Z"
}
```

---

## 4. `exams`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `exams` | Defines exams attached to a course. Supports both online (MCQ/short/long) and offline modes. Questions are embedded sub-documents. | `course`, `type`, `totalMarks`, `passingMarks`, `isPublished` | `course` → `courses._id`; Referenced by `submissions`, `results` |

### Field Table

| Field Name     | Data Type         | Required | Default | Description / Usage |
|----------------|-------------------|----------|---------|---------------------|
| `_id`          | ObjectId          | Auto     | —       | Primary key |
| `course`       | ObjectId (ref Course)| **Yes** | —     | Parent course |
| `title`        | String            | **Yes**  | —       | Exam title |
| `description`  | String            | No       | `''`    | Optional exam description |
| `type`         | String            | **Yes**  | —       | Enum: `online` \| `offline` |
| `questions`    | [questionSchema]  | No       | `[]`    | **Embedded** question array |
| `totalMarks`   | Number            | **Yes**  | —       | Maximum possible marks |
| `passingMarks` | Number            | **Yes**  | —       | Minimum marks to pass |
| `duration`     | Number            | **Yes**  | —       | Exam duration in minutes |
| `isPublished`  | Boolean           | No       | `false` | Visibility to students |
| `createdAt`    | Date              | Auto     | —       | — |
| `updatedAt`    | Date              | Auto     | —       | — |

#### Embedded: `questions[]`
| Field           | Type     | Required | Description |
|----------------|----------|----------|-------------|
| `questionText` | String   | **Yes**  | The question |
| `type`         | String   | No       | Enum: `mcq` \| `short` \| `long`; default `mcq` |
| `options`      | [String] | No       | MCQ choices array |
| `correctAnswer`| String   | No       | Correct MCQ answer |
| `marks`        | Number   | **Yes**  | Marks for this question; min 0 |
| `order`        | Number   | No       | Display order; default 0 |

### Indexes
- `course`
- `isPublished`

### Sample Document
```json
{
  "_id": "664d4c5h3e2g7f0045de6789",
  "course": "664b2a3f1c0e5d0023bc4567",
  "title": "Chapter 1 Assessment",
  "description": "Test your knowledge of Vedic Mathematics basics.",
  "type": "online",
  "questions": [
    {
      "_id": "664d4c5h3e2g7f0045de6790",
      "questionText": "Which Sutra is used for multiplication?",
      "type": "mcq",
      "options": ["Nikhilam", "Anurupyena", "Vertically and Crosswise", "Paraavartya"],
      "correctAnswer": "Nikhilam",
      "marks": 5,
      "order": 1
    }
  ],
  "totalMarks": 50,
  "passingMarks": 25,
  "duration": 60,
  "isPublished": true,
  "createdAt": "2024-05-22T09:00:00.000Z",
  "updatedAt": "2024-05-22T09:00:00.000Z"
}
```

---

## 5. `submissions`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `submissions` | Records student exam attempt answers — both online (MCQ/text answers) and offline (file upload). Tracks evaluation workflow status and assigned examiner. | `student`, `exam`, `status`, `assignedExaminer` | `student` → `users._id`; `exam` → `exams._id`; `course` → `courses._id`; `assignedExaminer` → `users._id`; Referenced by `results` |

### Field Table

| Field Name          | Data Type             | Required | Default    | Description / Usage |
|---------------------|-----------------------|----------|------------|---------------------|
| `_id`               | ObjectId              | Auto     | —          | Primary key |
| `student`           | ObjectId (ref User)   | **Yes**  | —          | Submitting student |
| `exam`              | ObjectId (ref Exam)   | **Yes**  | —          | Target exam |
| `course`            | ObjectId (ref Course) | **Yes**  | —          | Parent course (denormalised for quick lookup) |
| `type`              | String                | **Yes**  | —          | Enum: `online` \| `offline` |
| `answers`           | [answerSchema]        | No       | `[]`       | **Embedded** array of answers for online exams |
| `uploadedFile`      | String                | No       | `null`     | File path/URL for offline submission |
| `submittedAt`       | Date                  | No       | `Date.now` | Submission timestamp |
| `status`            | String                | No       | `pending`  | Enum: `pending` \| `evaluated` \| `approved` |
| `assignedExaminer`  | ObjectId (ref User)   | No       | `null`     | Examiner assigned for manual evaluation |
| `createdAt`         | Date                  | Auto     | —          | — |
| `updatedAt`         | Date                  | Auto     | —          | — |

#### Embedded: `answers[]`
| Field            | Type     | Required | Description |
|-----------------|----------|----------|-------------|
| `questionId`    | ObjectId | **Yes**  | Reference to embedded question `_id` in exam |
| `selectedOption`| String   | No       | Chosen MCQ option; `null` for text answers |
| `answerText`    | String   | No       | Free-text answer for short/long questions |

### Indexes
- `student` + `exam` (compound)
- `status`
- `assignedExaminer` + `status` (compound, for examiner workload queries)

### Sample Document
```json
{
  "_id": "664e5d6i4f3h8g0056ef7890",
  "student": "664a1f2e3b9c4d0012ab3456",
  "exam": "664d4c5h3e2g7f0045de6789",
  "course": "664b2a3f1c0e5d0023bc4567",
  "type": "online",
  "answers": [
    {
      "questionId": "664d4c5h3e2g7f0045de6790",
      "selectedOption": "Nikhilam",
      "answerText": null
    }
  ],
  "uploadedFile": null,
  "submittedAt": "2024-06-03T10:45:00.000Z",
  "status": "pending",
  "assignedExaminer": null,
  "createdAt": "2024-06-03T10:45:00.000Z",
  "updatedAt": "2024-06-03T10:45:00.000Z"
}
```

---

## 6. `results`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `results` | Stores evaluated exam results with marks, pass/fail determination, and admin approval gate before certificate issuance. `percentage` is computed via a pre-save hook. | `student`, `exam`, `isPassed`, `approvedByAdmin` | `student` → `users._id`; `exam` → `exams._id`; `submission` → `submissions._id`; `examiner` → `users._id`; Referenced by `certificates` |

### Field Table

| Field Name       | Data Type               | Required | Default    | Description / Usage |
|------------------|-------------------------|----------|------------|---------------------|
| `_id`            | ObjectId                | Auto     | —          | Primary key |
| `student`        | ObjectId (ref User)     | **Yes**  | —          | Evaluated student |
| `exam`           | ObjectId (ref Exam)     | **Yes**  | —          | Evaluated exam |
| `submission`     | ObjectId (ref Submission)| **Yes** | —          | Source submission |
| `examiner`       | ObjectId (ref User)     | No       | `null`     | Examiner who evaluated; `null` for auto-graded |
| `marksObtained`  | Number                  | **Yes**  | —          | Raw score; min 0 |
| `totalMarks`     | Number                  | **Yes**  | —          | Max marks (denormalised from exam) |
| `percentage`     | Number                  | No       | —          | Auto-calculated: `(marksObtained/totalMarks)*100` via pre-save hook |
| `remarks`        | String                  | No       | `''`       | Examiner comments |
| `isPassed`       | Boolean                 | **Yes**  | —          | Pass/fail determination |
| `evaluatedAt`    | Date                    | No       | `Date.now` | Evaluation timestamp |
| `approvedByAdmin`| Boolean                 | No       | `false`    | Admin approval gate before certificate generation |
| `approvedAt`     | Date                    | No       | `null`     | Admin approval timestamp |
| `createdAt`      | Date                    | Auto     | —          | — |
| `updatedAt`      | Date                    | Auto     | —          | — |

### Indexes
- `student`
- `approvedByAdmin`

### Sample Document
```json
{
  "_id": "664f6e7j5g4i9h0067fg8901",
  "student": "664a1f2e3b9c4d0012ab3456",
  "exam": "664d4c5h3e2g7f0045de6789",
  "submission": "664e5d6i4f3h8g0056ef7890",
  "examiner": null,
  "marksObtained": 42,
  "totalMarks": 50,
  "percentage": 84,
  "remarks": "Excellent performance on Sutras.",
  "isPassed": true,
  "evaluatedAt": "2024-06-03T11:00:00.000Z",
  "approvedByAdmin": true,
  "approvedAt": "2024-06-04T09:00:00.000Z",
  "createdAt": "2024-06-03T11:00:00.000Z",
  "updatedAt": "2024-06-04T09:00:00.000Z"
}
```

---

## 7. `certificates`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `certificates` | Issued course completion certificates with a unique verifiable ID and public verification URL. Only generated after admin approves the result. | `certificateId`, `student`, `course`, `verificationUrl` | `student` → `users._id`; `course` → `courses._id`; `result` → `results._id` |

### Field Table

| Field Name        | Data Type              | Required | Default    | Description / Usage |
|-------------------|------------------------|----------|------------|---------------------|
| `_id`             | ObjectId               | Auto     | —          | Primary key |
| `student`         | ObjectId (ref User)    | **Yes**  | —          | Certificate recipient |
| `course`          | ObjectId (ref Course)  | **Yes**  | —          | Completed course |
| `result`          | ObjectId (ref Result)  | **Yes**  | —          | Backing approved result |
| `certificateId`   | String                 | **Yes**  | —          | Globally unique certificate number (unique index) |
| `issuedAt`        | Date                   | No       | `Date.now` | Certificate issue date |
| `certificateUrl`  | String                 | **Yes**  | —          | URL to PDF certificate file |
| `verificationUrl` | String                 | **Yes**  | —          | Public URL for third-party verification |
| `createdAt`       | Date                   | Auto     | —          | — |
| `updatedAt`       | Date                   | Auto     | —          | — |

### Indexes
- `certificateId` — unique
- `student`

### Sample Document
```json
{
  "_id": "665g7f8k6h5j0i0078gh9012",
  "student": "664a1f2e3b9c4d0012ab3456",
  "course": "664b2a3f1c0e5d0023bc4567",
  "result": "664f6e7j5g4i9h0067fg8901",
  "certificateId": "CERT-2024-00042",
  "issuedAt": "2024-06-04T10:00:00.000Z",
  "certificateUrl": "https://cdn.example.com/certs/CERT-2024-00042.pdf",
  "verificationUrl": "https://verify.example.com/CERT-2024-00042",
  "createdAt": "2024-06-04T10:00:00.000Z",
  "updatedAt": "2024-06-04T10:00:00.000Z"
}
```

---

## 8. `temples`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `temples` | Central registration document for a temple entity. Manages the multi-step registration lifecycle (DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED). Embeds address, president, and vice-president sub-documents. | `temple_name`, `gst_number`, `status`, `current_step` | `logo_doc_id` → `documents._id`; `president.photo_doc_id`, `president.id_card_doc_id` → `documents._id`; `president.user_id`, `vice_president.user_id` → `temple_users._id`; `reviewed_by`, `created_by`, `updated_by` → `temple_users._id` |

### Field Table

| Field Name         | Data Type                   | Required | Default  | Description / Usage |
|--------------------|-----------------------------|----------|----------|---------------------|
| `_id`              | ObjectId                    | Auto     | —        | Primary key |
| `temple_name`      | String                      | **Yes**  | —        | Temple name; indexed |
| `gst_number`       | String                      | **Yes**  | —        | GST registration; unique, uppercase, 15-char format |
| `address`          | addressSchema (embedded)    | **Yes**  | —        | Postal address — see sub-schema below |
| `logo_doc_id`      | ObjectId (ref Document)     | No       | `null`   | Temple logo file reference |
| `president`        | personSchema (embedded)     | No       | `null`   | President details — see sub-schema below |
| `vice_president`   | personSchema (embedded)     | No       | `null`   | VP details — same schema as president |
| `status`           | String                      | No       | `DRAFT`  | Enum: `DRAFT` \| `SUBMITTED` \| `UNDER_REVIEW` \| `APPROVED` \| `REJECTED` |
| `current_step`     | Number                      | No       | `1`      | Enum: 1–5 (multi-step form progress tracker) |
| `rejection_reason` | String                      | No       | `null`   | Admin rejection note |
| `reviewed_by`      | ObjectId (ref TempleUser)   | No       | `null`   | Admin who reviewed |
| `reviewed_at`      | Date                        | No       | `null`   | Review timestamp |
| `created_by`       | ObjectId (ref TempleUser)   | No       | `null`   | Creator (TempleUser) |
| `updated_by`       | ObjectId (ref TempleUser)   | No       | `null`   | Last updater |
| `submitted_at`     | Date                        | No       | `null`   | Final submission timestamp |
| `ip_address`       | String                      | No       | `null`   | Submitter IP for audit |
| `createdAt`        | Date                        | Auto     | —        | — |
| `updatedAt`        | Date                        | Auto     | —        | — |

#### Embedded: `address`
| Field      | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `line1`   | String | **Yes**  | Address line 1 |
| `line2`   | String | No       | Address line 2; default `''` |
| `city`    | String | **Yes**  | City name |
| `state`   | String | **Yes**  | State name |
| `country` | String | **Yes**  | Country name |
| `pin_code`| String | **Yes**  | 6-digit postal code |

#### Embedded: `president` / `vice_president` (personSchema)
| Field            | Type     | Required | Description |
|-----------------|----------|----------|-------------|
| `name`          | String   | No       | Full name |
| `mobile`        | String   | No       | 10-digit mobile; unique sparse index |
| `mobile_verified`| Boolean | No       | OTP verification status; default false |
| `pan_number`    | String   | No       | PAN card; uppercase; unique sparse index |
| `aadhaar_number`| String   | No       | 12-digit Aadhaar |
| `email`         | String   | No       | Gmail address; unique sparse index |
| `photo_doc_id`  | ObjectId (ref Document) | No | Passport-size photo reference |
| `id_card_doc_id`| ObjectId (ref Document) | No | Identity card reference |
| `user_id`       | ObjectId (ref TempleUser)| No | Linked TempleUser account |
| `meet_id`       | String   | No       | Google Meet-style unique ID |

### Indexes
- `gst_number` — unique
- `president.pan_number` — unique, sparse
- `vice_president.pan_number` — unique, sparse
- `president.mobile` — unique, sparse
- `vice_president.mobile` — unique, sparse
- `president.email` — unique, sparse
- `vice_president.email` — unique, sparse
- `status` + `createdAt` DESC (compound)
- `status` (single)
- `temple_name`

### Sample Document
```json
{
  "_id": "665h8g9l7i6k1j0089hi0123",
  "temple_name": "Shri Ganesh Mandir",
  "gst_number": "27AABCU9603R1ZX",
  "address": {
    "line1": "123 Temple Road",
    "line2": "Near Market Square",
    "city": "Pune",
    "state": "Maharashtra",
    "country": "India",
    "pin_code": "411001"
  },
  "logo_doc_id": "665h8g9l7i6k1j0089hi0200",
  "president": {
    "name": "Ramesh Patel",
    "mobile": "9812345678",
    "mobile_verified": true,
    "pan_number": "ABCDE1234F",
    "aadhaar_number": "123456789012",
    "email": "ramesh.patel@gmail.com",
    "photo_doc_id": "665h8g9l7i6k1j0089hi0201",
    "id_card_doc_id": "665h8g9l7i6k1j0089hi0202",
    "user_id": "665i9h0m8j7l2k0090ij1234",
    "meet_id": "MEET-00001"
  },
  "vice_president": {
    "name": "Sunita Rao",
    "mobile": "9876543210",
    "mobile_verified": false,
    "pan_number": "FGHIJ5678K",
    "aadhaar_number": "987654321098",
    "email": "sunita.rao@gmail.com",
    "photo_doc_id": null,
    "id_card_doc_id": null,
    "user_id": null,
    "meet_id": null
  },
  "status": "SUBMITTED",
  "current_step": 4,
  "rejection_reason": null,
  "reviewed_by": null,
  "reviewed_at": null,
  "created_by": "665i9h0m8j7l2k0090ij1234",
  "updated_by": "665i9h0m8j7l2k0090ij1234",
  "submitted_at": "2024-06-10T08:00:00.000Z",
  "ip_address": "192.168.1.10",
  "createdAt": "2024-06-08T11:00:00.000Z",
  "updatedAt": "2024-06-10T08:00:00.000Z"
}
```

---

## 9. `temple_users`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `temple_users` | Authentication store for temple Presidents and Vice-Presidents. Separate from the main `users` collection to avoid schema conflicts with the LMS domain. Includes account lockout via `login_attempts` + `locked_until`. | `username`, `email`, `pan_number`, `role`, `temple_id` | `temple_id` → `temples._id`; `created_by`, `updated_by` → `temple_users._id` (self-referential audit) |

### Field Table

| Field Name            | Data Type                 | Required | Default | Description / Usage |
|-----------------------|---------------------------|----------|---------|---------------------|
| `_id`                 | ObjectId                  | Auto     | —       | Primary key |
| `username`            | String                    | **Yes**  | —       | Unique login handle (firstName + last4 of mobile); lowercase |
| `password_hash`       | String                    | **Yes**  | —       | Bcrypt hash (12 rounds); `select: false` |
| `name`                | String                    | **Yes**  | —       | Full display name |
| `email`               | String                    | **Yes**  | —       | Unique Gmail address |
| `mobile`              | String                    | **Yes**  | —       | Unique 10-digit mobile |
| `pan_number`          | String                    | **Yes**  | —       | Unique PAN card; uppercase |
| `role`                | String                    | **Yes**  | —       | Enum: `PRESIDENT` \| `VICE_PRESIDENT` \| `ADMIN` \| `SUPER_ADMIN` |
| `temple_id`           | ObjectId (ref Temple)     | **Yes**  | —       | Associated temple |
| `meet_id`             | String                    | No       | —       | Unique Google Meet-style ID; sparse |
| `is_active`           | Boolean                   | No       | `true`  | Soft-delete / suspension flag |
| `last_login_at`       | Date                      | No       | `null`  | Last successful login |
| `password_changed_at` | Date                      | No       | `null`  | Last password change (for JWT invalidation) |
| `login_attempts`      | Number                    | No       | `0`     | Failed login counter (brute-force protection) |
| `locked_until`        | Date                      | No       | `null`  | Account lockout expiry |
| `created_by`          | ObjectId (ref TempleUser) | No       | `null`  | Creator audit |
| `updated_by`          | ObjectId (ref TempleUser) | No       | `null`  | Updater audit |
| `createdAt`           | Date                      | Auto     | —       | — |
| `updatedAt`           | Date                      | Auto     | —       | — |

### Indexes
- `username` — unique
- `email` — unique
- `mobile` — unique
- `pan_number` — unique
- `meet_id` — unique, sparse
- `temple_id` + `role` (compound)
- `is_active`

### Sample Document
```json
{
  "_id": "665i9h0m8j7l2k0090ij1234",
  "username": "ramesh5678",
  "name": "Ramesh Patel",
  "email": "ramesh.patel@gmail.com",
  "mobile": "9812345678",
  "pan_number": "ABCDE1234F",
  "role": "PRESIDENT",
  "temple_id": "665h8g9l7i6k1j0089hi0123",
  "meet_id": "MEET-00001",
  "is_active": true,
  "last_login_at": "2024-06-10T07:45:00.000Z",
  "password_changed_at": "2024-06-08T11:00:00.000Z",
  "login_attempts": 0,
  "locked_until": null,
  "created_by": null,
  "updated_by": null,
  "createdAt": "2024-06-08T11:00:00.000Z",
  "updatedAt": "2024-06-10T07:45:00.000Z"
}
```

---

## 10. `otpverifications`

### Summary

| Collection Name   | Purpose | Key Fields | Relationships |
|------------------|---------|-----------|--------------|
| `otpverifications` | Stores time-limited OTP records for mobile verification during temple registration (and future login/reset flows). MongoDB TTL index auto-deletes expired documents. Max 3 attempts per OTP prevents brute-force. | `mobile`, `purpose`, `expiry_at`, `is_used` | No foreign key refs — standalone mobile-scoped record |

### Field Table

| Field Name   | Data Type | Required | Default        | Description / Usage |
|--------------|-----------|----------|----------------|---------------------|
| `_id`        | ObjectId  | Auto     | —              | Primary key |
| `mobile`     | String    | **Yes**  | —              | Target mobile number; indexed |
| `otp_hash`   | String    | **Yes**  | —              | Bcrypt hash of the OTP; `select: false` |
| `purpose`    | String    | No       | `REGISTRATION` | Enum: `REGISTRATION` \| `LOGIN` \| `RESET` |
| `is_used`    | Boolean   | No       | `false`        | One-time-use flag; set to `true` after verification |
| `attempts`   | Number    | No       | `0`            | Wrong attempt counter; max 3 before invalidation |
| `expiry_at`  | Date      | **Yes**  | —              | TTL index — document auto-deleted at this time |
| `ip_address` | String    | No       | `null`         | Sender IP for abuse tracking |
| `createdAt`  | Date      | Auto     | —              | — |
| `updatedAt`  | Date      | Auto     | —              | — |

### Indexes
- `mobile` (single)
- `mobile` + `purpose` + `is_used` (compound, for active OTP lookup)
- `expiry_at` — **TTL index** (`expireAfterSeconds: 0`)

### Sample Document
```json
{
  "_id": "665j0i1n9k8m3l0001jk2345",
  "mobile": "9812345678",
  "purpose": "REGISTRATION",
  "is_used": false,
  "attempts": 1,
  "expiry_at": "2024-06-08T11:10:00.000Z",
  "ip_address": "192.168.1.10",
  "createdAt": "2024-06-08T11:00:00.000Z",
  "updatedAt": "2024-06-08T11:05:00.000Z"
}
```

---

## 11. `auditlogs`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `auditlogs` | Immutable write-once event log for all significant system actions. Stores before/after diffs for change replay. TTL auto-purges after 365 days. Supports cross-collection audit trails via `entity_type` + `entity_id`. | `action`, `entity_type`, `entity_id`, `actor_id` | `actor_id` → `temple_users._id`; `entity_id` → polymorphic (any collection) |

### Field Table

| Field Name    | Data Type                  | Required | Default   | Description / Usage |
|---------------|----------------------------|----------|-----------|---------------------|
| `_id`         | ObjectId                   | Auto     | —         | Primary key |
| `actor_id`    | ObjectId (ref TempleUser)  | No       | `null`    | User who performed the action; null for SYSTEM events |
| `actor_type`  | String                     | No       | `SYSTEM`  | Enum: `USER` \| `SYSTEM` \| `ADMIN` |
| `action`      | String                     | **Yes**  | —         | Event name e.g. `TEMPLE_STEP_SAVED`, `OTP_SENT`, `USER_CREATED` |
| `entity_type` | String                     | **Yes**  | —         | Target collection name e.g. `Temple`, `Document` |
| `entity_id`   | ObjectId                   | **Yes**  | —         | Target document `_id` (polymorphic) |
| `diff.before` | Mixed                      | No       | `null`    | Document state before change |
| `diff.after`  | Mixed                      | No       | `null`    | Document state after change |
| `ip_address`  | String                     | No       | `null`    | Request IP |
| `user_agent`  | String                     | No       | `null`    | Browser/client info |
| `meta`        | Mixed                      | No       | `null`    | Extra contextual data (free-form) |
| `expires_at`  | Date                       | No       | +365 days | TTL index — auto-delete after 1 year |
| `createdAt`   | Date                       | Auto     | —         | — |
| `updatedAt`   | Date                       | Auto     | —         | — |

### Indexes
- `actor_id`
- `entity_id`
- `entity_type` + `entity_id` + `createdAt` DESC (compound)
- `action` + `createdAt` DESC (compound)
- `expires_at` — **TTL index** (`expireAfterSeconds: 0`)

### Sample Document
```json
{
  "_id": "665k1j2o0l9n4m0002kl3456",
  "actor_id": "665i9h0m8j7l2k0090ij1234",
  "actor_type": "USER",
  "action": "TEMPLE_STEP_SAVED",
  "entity_type": "Temple",
  "entity_id": "665h8g9l7i6k1j0089hi0123",
  "diff": {
    "before": { "current_step": 1, "status": "DRAFT" },
    "after":  { "current_step": 2, "status": "DRAFT" }
  },
  "ip_address": "192.168.1.10",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "meta": { "step": "PRESIDENT_DETAILS" },
  "expires_at": "2025-06-08T11:00:00.000Z",
  "createdAt": "2024-06-08T11:00:00.000Z",
  "updatedAt": "2024-06-08T11:00:00.000Z"
}
```

---

## 12. `counters`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `counters` | Atomic auto-increment counter store for generating sequential unique IDs (e.g. `meet_id`). Uses `findOneAndUpdate` with `$inc` for thread-safe, race-condition-free increments. | `_id` (key), `seq` | No refs — utility collection |

### Field Table

| Field Name | Data Type | Required | Default | Description / Usage |
|------------|-----------|----------|---------|---------------------|
| `_id`      | String    | **Yes**  | —       | Sequence key e.g. `"meet_id"` |
| `seq`      | Number    | No       | `0`     | Current sequence value; incremented atomically |

### Note
This collection has no timestamps. Documents are created via upsert and never manually deleted. The `nextSequence(key)` static method is the canonical API for incrementing.

### Sample Document
```json
{
  "_id": "meet_id",
  "seq": 47
}
```

---

## 13. `documents`

### Summary

| Collection Name | Purpose | Key Fields | Relationships |
|----------------|---------|-----------|--------------|
| `documents` | File upload metadata store for the Temple Registration module (logos, president/VP photos, ID cards). Decoupled from Temple/TempleUser — swap `file_path` for an S3 URL without schema changes. Admin verification workflow built in. | `file_type`, `temple_id`, `original_name`, `is_verified` | `temple_id` → `temples._id`; `uploaded_by`, `verified_by` → `temple_users._id`; Referenced by `temples.logo_doc_id`, `temples.president.photo_doc_id`, etc. |

### Field Table

| Field Name      | Data Type                 | Required | Default | Description / Usage |
|-----------------|---------------------------|----------|---------|---------------------|
| `_id`           | ObjectId                  | Auto     | —       | Primary key |
| `original_name` | String                    | **Yes**  | —       | Original client filename |
| `stored_name`   | String                    | **Yes**  | —       | Server-assigned filename (UUID or hash) |
| `file_path`     | String                    | **Yes**  | —       | Server filesystem path or S3 key |
| `file_url`      | String                    | No       | `null`  | Public-facing URL (CDN/S3 presigned) |
| `mime_type`     | String                    | **Yes**  | —       | MIME type e.g. `image/jpeg`, `application/pdf` |
| `size_bytes`    | Number                    | **Yes**  | —       | File size in bytes |
| `file_type`     | String                    | **Yes**  | —       | Enum: `logo` \| `photo` \| `id_card` |
| `temple_id`     | ObjectId (ref Temple)     | No       | `null`  | Owning temple (set post-registration); indexed |
| `uploaded_by`   | ObjectId (ref TempleUser) | No       | `null`  | Uploader; null during anonymous registration phase |
| `is_verified`   | Boolean                   | No       | `false` | Admin verification status |
| `verified_by`   | ObjectId (ref TempleUser) | No       | `null`  | Admin who verified |
| `verified_at`   | Date                      | No       | `null`  | Verification timestamp |
| `createdAt`     | Date                      | Auto     | —       | — |
| `updatedAt`     | Date                      | Auto     | —       | — |

### Indexes
- `temple_id` (single)
- `file_type` + `temple_id` (compound)

### Sample Document
```json
{
  "_id": "665h8g9l7i6k1j0089hi0201",
  "original_name": "ramesh_passport_photo.jpg",
  "stored_name": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "file_path": "/uploads/temple/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "file_url": "https://cdn.example.com/uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 204800,
  "file_type": "photo",
  "temple_id": "665h8g9l7i6k1j0089hi0123",
  "uploaded_by": "665i9h0m8j7l2k0090ij1234",
  "is_verified": false,
  "verified_by": null,
  "verified_at": null,
  "createdAt": "2024-06-08T11:05:00.000Z",
  "updatedAt": "2024-06-08T11:05:00.000Z"
}
```

---

## Cross-Collection Relationship Map

```
users ──────────────────────────────────────────────────────────────────────┐
  │                                                                          │
  ├─[createdBy]──► courses                                                   │
  │                   │                                                      │
  │                   ├─[course]──► enrollments ◄──[student]────────────────┤
  │                   │                                                      │
  │                   ├─[course]──► exams                                    │
  │                                   │                                      │
  │                                   ├─[exam]──► submissions ◄──[student]──┤
  │                                   │               │                      │
  │                                   └─[exam]──► results ◄──[student]──────┤
  │                                                   │  ◄──[submission]─────┘
  │                                                   │
  │                                               [result]
  │                                                   │
  └─[student]──► certificates ◄──[course]─────────────┘

temple_users ──────────────────────────────────────────────────────────────┐
  │                                                                         │
  ├─[temple_id]──► temples                                                  │
  │                   │                                                     │
  │                   ├─[logo_doc_id]──► documents ◄──[temple_id]──────────┤
  │                   ├─[president.photo_doc_id]──► documents               │
  │                   ├─[president.id_card_doc_id]──► documents             │
  │                   ├─[president.user_id]──► temple_users                 │
  │                   └─[reviewed_by / created_by]──► temple_users          │
  │                                                                         │
  ├─[actor_id]──► auditlogs ◄──[entity_id (polymorphic)]────────────────────┘

counters ──── Utility (no refs)
otpverifications ──── Standalone mobile-scoped (no refs)
```

---

## TTL Summary

| Collection        | TTL Field    | Auto-Delete After |
|------------------|-------------|------------------|
| `otpverifications`| `expiry_at` | At the exact `expiry_at` timestamp (typically 10 minutes after creation) |
| `auditlogs`       | `expires_at`| 365 days after creation |

---

## Design Patterns Observed

**Embedded vs Referenced**: The codebase deliberately embeds sub-documents (`address`, `president`, `vice_president` in temples; `lessons`, `studyMaterials` in courses; `questions` in exams; `answers` in submissions) for read performance, while referencing large, independently-queried entities (documents, users, results) via ObjectId.

**Dual User Models**: `users` (LMS — students/examiners/admins) and `temple_users` (Temple Registration — president/VP) are kept in separate collections to prevent schema conflicts across application domains.

**Audit Trail**: All significant mutations write an immutable `AuditLog` record with before/after diffs, enabling full change history and compliance replay.

**Sparse Unique Indexes**: Heavy use of sparse indexes (`googleId`, `studentId`, `meet_id`, `president.pan_number`, etc.) to enforce uniqueness only on documents where the field is present — avoiding constraint violations on optional fields.

**Security Pattern**: Sensitive fields (`password`, `password_hash`, `refreshToken`, `googleId`, `otp_hash`) are marked `select: false` so they are never accidentally returned in API responses.
