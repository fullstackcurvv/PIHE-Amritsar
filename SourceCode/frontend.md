# Frontend Architecture — ISKCON Amritsar Course Portal (PIHEDelivery1)

> **Stack:** React 18 + Vite + TypeScript (strict mode)  
> **Styling:** Tailwind CSS v3 + shadcn/ui  
> **State:** Zustand 4.x  
> **Forms:** react-hook-form + @hookform/resolvers/zod  
> **HTTP:** Axios 1.x (with Vite proxy in dev)  
> **Animation:** Framer Motion 10.x  
> **Charts:** Recharts 2.x  
> **Generated:** 2026-04-18 | **RBAC Update:** 2026-04-18

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Design System](#2-design-system)
3. [Component Architecture](#3-component-architecture)
4. [Routing](#4-routing)
5. [State Management](#5-state-management)
6. [RBAC — Permissions & Access Control](#6-rbac--permissions--access-control)
7. [Services & API Layer](#7-services--api-layer)
8. [Module 1 — Public Website](#8-module-1--public-website)
9. [Module 2 — Authentication](#9-module-2--authentication)
10. [Module 3 — Student Portal](#10-module-3--student-portal)
11. [Module 4 — Examiner Portal](#11-module-4--examiner-portal)
12. [Module 5 — Admin Panel](#12-module-5--admin-panel)
13. [Module 6 — Temple Registration](#13-module-6--temple-registration)
14. [Form Handling & Validation](#14-form-handling--validation)
15. [Gap Analysis — Frontend vs Backend](#15-gap-analysis--frontend-vs-backend)
16. [Improvement Suggestions](#16-improvement-suggestions)

---

## 1. Folder Structure

```
SourceCode/frontend/
├── index.html
├── vite.config.ts
├── package.json
├── postcss.config.mjs
└── src/
    ├── main.tsx                      ← React root mount
    ├── App.tsx                       ← Root router (public + app entry)
    │
    ├── app/                          ← Landing page components (Figma-generated)
    │   ├── App.tsx                   ← Landing app shell
    │   └── components/
    │       ├── CTABanner.tsx
    │       ├── CoursesSection.tsx
    │       ├── Features.tsx
    │       ├── Footer.tsx
    │       ├── HeroSection.tsx
    │       ├── HowItWorks.tsx
    │       ├── Navbar.tsx
    │       ├── Statistics.tsx
    │       └── figma/
    │           └── ImageWithFallback.tsx
    │       └── ui/                   ← shadcn/ui auto-generated components
    │           ├── accordion.tsx
    │           ├── alert.tsx
    │           ├── avatar.tsx
    │           ├── badge.tsx
    │           ├── button.tsx
    │           ├── card.tsx
    │           ├── calendar.tsx
    │           ├── carousel.tsx
    │           ├── chart.tsx
    │           ├── checkbox.tsx
    │           ├── dialog.tsx
    │           ├── dropdown-menu.tsx
    │           ├── form.tsx
    │           ├── input.tsx
    │           ├── label.tsx
    │           ├── pagination.tsx
    │           ├── progress.tsx
    │           ├── select.tsx
    │           ├── separator.tsx
    │           ├── sidebar.tsx
    │           ├── skeleton.tsx
    │           ├── table.tsx
    │           ├── tabs.tsx
    │           ├── textarea.tsx
    │           ├── tooltip.tsx
    │           └── ... (full shadcn/ui set)
    │
    ├── components/
    │   ├── course/
    │   │   ├── CourseCard.tsx        ← Card: thumbnail, badges, title, level, CTA
    │   │   └── CourseGrid.tsx        ← Responsive grid wrapper for CourseCard
    │   │
    │   ├── exam/
    │   │   ├── ExamTimer.tsx         ← Countdown timer; fires auto-submit at 0
    │   │   └── QuestionCard.tsx      ← Single MCQ/short question with answer input
    │   │
    │   ├── rbac/                     ← ✨ RBAC UI primitives
    │   │   ├── CanAccess.tsx         ← Gate component: renders children only if permission passes
    │   │   ├── DynamicSidebar.tsx    ← Sidebar built from modules API (replaces hardcoded nav)
    │   │   ├── FieldController.tsx   ← Renders field as input/span/hidden based on fieldLevel
    │   │   └── ProtectedFeature.tsx  ← Wraps a feature section; hides if canView=false
    │   │
    │   ├── shared/
    │   │   ├── Navbar.tsx            ← Public top navigation
    │   │   ├── Footer.tsx            ← 5-column public footer
    │   │   ├── Breadcrumb.tsx        ← Home > Courses > Title breadcrumb
    │   │   ├── Pagination.tsx        ← Page controls
    │   │   └── StudentIdModal.tsx    ← Welcome modal showing new student ID
    │   │
    │   ├── temple/
    │   │   ├── FileUpload.tsx        ← Base64 file preview (temple flow — NO API)
    │   │   ├── FormInput.tsx         ← Labeled input with error display
    │   │   ├── FormSelect.tsx        ← Labeled select dropdown
    │   │   └── Stepper.tsx           ← 4-step progress indicator
    │   │
    │   └── ui/                       ← Custom reusable atoms
    │       ├── Badge.tsx             ← Status/level badge variants
    │       ├── Button.tsx            ← Primary/outline/ghost variants + loading state
    │       ├── Card.tsx              ← Surface card container
    │       ├── DataTable.tsx         ← Generic sortable/searchable table
    │       ├── FileUploadZone.tsx    ← Drag-and-drop zone → calls real upload API
    │       ├── Input.tsx             ← Labeled input with error display
    │       ├── Modal.tsx             ← Portal-based modal with title, body, close
    │       ├── ProgressBar.tsx       ← Animated progress bar
    │       ├── Spinner.tsx           ← Loading spinner (sm/md/lg)
    │       ├── StatsCard.tsx         ← KPI card: icon, title, value
    │       └── Toast.tsx             ← Success/error toast notifications
    │
    ├── context/
    │   └── TempleFormContext.tsx     ← React Context for multi-step temple form
    │
    ├── hooks/
    │   ├── useAuth.ts                ← Zustand-based auth actions (login, register, logout)
    │   ├── usePermissions.ts         ← ✨ RBAC: reads permissionsStore; exposes can() helper
    │   └── useFieldAccess.ts         ← ✨ RBAC: returns field-level access map for a feature
    │
    ├── layouts/
    │   ├── AdminLayout.tsx           ← Collapsible sidebar — now driven by DynamicSidebar
    │   ├── ExaminerLayout.tsx        ← Examiner sidebar — now driven by DynamicSidebar
    │   ├── PublicLayout.tsx          ← Navbar + Footer wrapper
    │   └── StudentLayout.tsx         ← Student sidebar — now driven by DynamicSidebar
    │
    ├── pages/
    │   ├── admin/
    │   │   ├── AddCoursePage.tsx
    │   │   ├── CertificateManagementPage.tsx
    │   │   ├── CourseManagementPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ExamManagementPage.tsx
    │   │   ├── ExaminerManagementPage.tsx
    │   │   ├── ReportsPage.tsx
    │   │   ├── RbacManagementPage.tsx    ← ✨ RBAC: manage roles, permissions, user assignments
    │   │   └── StudentManagementPage.tsx
    │   │
    │   ├── auth/
    │   │   ├── ForgotPasswordPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── OAuthCallbackPage.tsx
    │   │   └── RegisterPage.tsx
    │   │
    │   ├── examiner/
    │   │   ├── AssignedStudentsPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── EvaluateExamPage.tsx
    │   │   └── StudentProfilePage.tsx
    │   │
    │   ├── public/
    │   │   ├── AboutPage.tsx
    │   │   ├── ContactPage.tsx
    │   │   ├── CourseDetailPage.tsx
    │   │   ├── CoursesPage.tsx
    │   │   ├── ExamGuidelinesPage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── HowItWorksPage.tsx
    │   │   └── TempleRegistrationPage.tsx
    │   │
    │   ├── student/
    │   │   ├── CertificatesPage.tsx
    │   │   ├── CoursePageStudent.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ExamSectionPage.tsx
    │   │   ├── MyCoursesPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── ResultsPage.tsx
    │   │   └── SupportPage.tsx
    │   │
    │   └── temple/
    │       ├── PresidentDetails.tsx
    │       ├── RegistrationSuccess.tsx
    │       ├── ReviewSubmit.tsx
    │       ├── TempleDetails.tsx
    │       └── VicePresidentDetails.tsx
    │
    ├── services/
    │   ├── api.ts                    ← Axios instance + interceptors
    │   ├── authService.ts
    │   ├── courseService.ts
    │   ├── enrollmentService.ts
    │   ├── examService.ts
    │   ├── submissionService.ts
    │   ├── resultService.ts
    │   ├── certificateService.ts
    │   ├── adminService.ts
    │   └── rbacService.ts            ← ✨ RBAC: getMyPermissions, assignRole, updatePermission
    │
    └── store/
        ├── authStore.ts              ← Zustand auth store (user, accessToken, actions)
        └── permissionsStore.ts       ← ✨ RBAC: Zustand store for resolved permission set
```

---

## 2. Design System

### Brand Colors

```css
--color-primary:       #E8720C;   /* Saffron orange — buttons, accents */
--color-primary-dark:  #C55E00;   /* Hover state */
--color-secondary:     #1A1A2E;   /* Deep navy — sidebar backgrounds */
--color-accent:        #F5A623;   /* Gold — decorative elements */
--color-bg:            #FFFAF5;   /* Warm cream — page background */
--color-surface:       #FFFFFF;   /* Card/modal surface */
--color-text:          #1C1C1C;   /* Primary text */
--color-text-muted:    #6B7280;   /* Secondary/placeholder text */
--color-border:        #E5E7EB;   /* Dividers */
--color-success:       #22C55E;
--color-error:         #EF4444;
--color-warning:       #F59E0B;
```

### Typography

```css
font-family: 'Cinzel', serif;       /* Headings — elegant, classical */
font-family: 'Nunito', sans-serif;  /* Body — friendly, readable */
```

### Tailwind Classes (Key Patterns)

```
Sidebar active:    bg-white/10 border-r-4 border-primary text-white
Button primary:    bg-primary hover:bg-primary-dark text-white
Card surface:      bg-surface border border-border rounded-2xl shadow
Input focused:     focus:ring-2 focus:ring-primary focus:outline-none
Field read-only:   bg-gray-50 text-gray-500 cursor-not-allowed pointer-events-none
Field hidden:      hidden (display: none — completely excluded from DOM)
```

---

## 3. Component Architecture

### Atom Components (`components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading`, `disabled` | Primary/outline/ghost; shows `Spinner` when `loading` |
| `Input` | `label`, `error`, `type`, all HTML input props | Labeled input with red error message below |
| `Badge` | `variant` (success/error/warning/info) | Status pill with color coding |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Portal-based modal; closes on backdrop click |
| `DataTable` | `columns`, `data`, `searchable`, `sortable` | Generic table with header-level sort + search |
| `FileUploadZone` | `onUpload`, `accept`, `maxSize` | Drag-and-drop zone that calls backend upload API |
| `ProgressBar` | `value`, `max`, `color` | Animated bar for lesson/exam progress |
| `StatsCard` | `icon`, `title`, `value`, `iconBg` | KPI card used on all dashboards |
| `Toast` | (hook-based) | `toast.success()`, `toast.error()` |
| `Spinner` | `size` (sm/md/lg) | Loading indicator |

### RBAC UI Primitives (`components/rbac/`) ✨ NEW

| Component | Props | Description |
|-----------|-------|-------------|
| `CanAccess` | `moduleId`, `featureId?`, `action` | Renders `children` only if the current user has the specified permission; renders `fallback` otherwise |
| `DynamicSidebar` | `domain` | Reads `permissionsStore.allowedModules` and renders nav items for modules where `canView = true`, in `order` sort |
| `FieldController` | `name`, `moduleId`, `featureId`, `label`, `value`, `onChange` | Renders a form field as a normal `<Input>`, a read-only `<span>`, or nothing (hidden), based on the `fieldLevel` access map from `permissionsStore` |
| `ProtectedFeature` | `moduleId`, `featureId`, `fallback?` | Wraps an entire form section or page block; if `canView = false` for that feature, renders `fallback` (default: `null`) |

### Molecule Components

| Component | Description |
|-----------|-------------|
| `CourseCard` | Thumbnail, level badge, free/paid tag, title, description, enroll CTA |
| `CourseGrid` | Responsive grid (1/2/3/4 cols) wrapping CourseCard with loading skeleton |
| `QuestionCard` | MCQ option selector (highlighted ring on selected) or textarea for short/long |
| `ExamTimer` | Countdown timer in `MM:SS` format; flashes red at < 5 min; fires `onExpire` callback |
| `StudentIdModal` | Welcome modal post-registration showing new `studentId` with "save this" instruction |
| `Breadcrumb` | `Home > Courses > {courseTitle}` with router links |
| `Stepper` | 4-step registration progress indicator (filled/active/upcoming states) |

---

## 4. Routing

### Route Map

```
/                             → PublicLayout > HomePage
/courses                      → PublicLayout > CoursesPage
/courses/:id                  → PublicLayout > CourseDetailPage
/about                        → PublicLayout > AboutPage
/contact                      → PublicLayout > ContactPage
/how-it-works                 → PublicLayout > HowItWorksPage
/exam-guidelines              → PublicLayout > ExamGuidelinesPage
/temple-registration          → PublicLayout > TempleRegistrationPage

/login                        → GuestRoute > LoginPage
/register                     → GuestRoute > RegisterPage
/forgot-password              → GuestRoute > ForgotPasswordPage
/auth/callback                → OAuthCallbackPage (handles Google redirect)

/temple-registration/temple   → TempleDetails (Step 1)
/temple-registration/president → PresidentDetails (Step 2)
/temple-registration/vice-president → VicePresidentDetails (Step 3)
/temple-registration/review   → ReviewSubmit (Step 4)
/temple-registration/success  → RegistrationSuccess

/student/dashboard            → ProtectedRoute(student) > StudentLayout > DashboardPage
/student/profile              → ProtectedRoute(student) > StudentLayout > ProfilePage
/student/courses              → ProtectedRoute(student) > StudentLayout > MyCoursesPage
/student/courses/:id          → ProtectedRoute(student) > StudentLayout > CoursePageStudent
/student/courses/:id/exam     → ProtectedRoute(student) > StudentLayout > ExamSectionPage
/student/results              → ProtectedRoute(student) > StudentLayout > ResultsPage
/student/certificates         → ProtectedRoute(student) > StudentLayout > CertificatesPage
/student/support              → ProtectedRoute(student) > StudentLayout > SupportPage

/examiner/dashboard           → ProtectedRoute(examiner) > ExaminerLayout > DashboardPage
/examiner/students            → ProtectedRoute(examiner) > ExaminerLayout > AssignedStudentsPage
/examiner/students/:id        → ProtectedRoute(examiner) > ExaminerLayout > StudentProfilePage
/examiner/evaluate/:id        → ProtectedRoute(examiner) > ExaminerLayout > EvaluateExamPage

/admin/dashboard              → ProtectedRoute(admin) > AdminLayout > DashboardPage
/admin/courses                → ProtectedRoute(admin) > AdminLayout > CourseManagementPage
/admin/courses/add            → ProtectedRoute(admin) > AdminLayout > AddCoursePage
/admin/students               → ProtectedRoute(admin) > AdminLayout > StudentManagementPage
/admin/exams                  → ProtectedRoute(admin) > AdminLayout > ExamManagementPage
/admin/examiners              → ProtectedRoute(admin) > AdminLayout > ExaminerManagementPage
/admin/certificates           → ProtectedRoute(admin) > AdminLayout > CertificateManagementPage
/admin/reports                → ProtectedRoute(admin) > AdminLayout > ReportsPage
/admin/rbac                   → ProtectedRoute(super_admin) > AdminLayout > RbacManagementPage ✨
```

### Route Guards

**ProtectedRoute:** Reads `authStore.user` and `authStore.accessToken`. If not authenticated, redirects to `/login`. If authenticated but wrong role, redirects to role-appropriate dashboard.

**GuestRoute:** If already authenticated, redirects to role-based dashboard (prevents logged-in users from seeing login/register).

**RBAC Route Guard:** In addition to role checks, `ProtectedRoute` now also verifies that `permissionsStore.canViewModule(moduleId)` returns `true` before rendering the page. If the user is authenticated but their role has no `canView` permission for that module, they see a **403 Forbidden** page rather than being redirected.

---

## 5. State Management

### Zustand — `authStore.ts`

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
  refreshToken: () => Promise<string>;
}
```

Store is persisted to `localStorage` under key `iskcon-auth`. Sensitive data note: `accessToken` is stored in Zustand/localStorage; `refreshToken` is stored as an httpOnly cookie.

### Zustand — `permissionsStore.ts` ✨ NEW

```typescript
// Mirrors the shape returned by GET /api/v1/rbac/permissions/me

interface PermissionEntry {
  moduleId: string;
  moduleName: string;
  route: string;
  featureId: string | null;
  featureName?: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canDownload: boolean;
  fieldLevel: Record<string, 'READ_ONLY' | 'EDITABLE' | 'HIDDEN'>;
}

interface PermissionsState {
  permissions: PermissionEntry[];
  isLoaded: boolean;
  isLoading: boolean;

  // Actions
  loadPermissions: () => Promise<void>;    // calls GET /rbac/permissions/me
  clearPermissions: () => void;            // called on logout

  // Selectors (computed getters — no re-fetch)
  canViewModule: (moduleId: string) => boolean;
  can: (moduleId: string, action: 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove' | 'canDownload') => boolean;
  canFeature: (moduleId: string, featureId: string, action: string) => boolean;
  getFieldLevel: (moduleId: string, featureId: string) => Record<string, 'READ_ONLY' | 'EDITABLE' | 'HIDDEN'>;
  allowedModules: () => PermissionEntry[];  // returns entries where canView=true and featureId=null
}
```

**permissionsStore** is **NOT persisted** to localStorage (permissions must always be fresh from the API). It is populated immediately after a successful login and cleared on logout.

### Local State Patterns

- **ExamSectionPage:** `useState<Record<questionId, Answer>>` for in-progress answers (no global store pollution)
- **EvaluateExamPage:** `useState<Record<questionId, number>>` for per-question marks input
- **AdminDashboard:** `useState` for KPI data + loading states
- **CoursePageStudent:** Progress uses optimistic UI — updates local state immediately, reverts on API error

### React Context

- **TempleFormContext:** Manages multi-step temple registration data (temple, president, vice_president sub-objects) across 4 route-separated pages

---

## 6. RBAC — Permissions & Access Control

> **Design Goal:** Every piece of UI — sidebar items, form sections, action buttons, and individual form fields — is driven by the permission set returned from `GET /api/v1/rbac/permissions/me`. No access rules are hardcoded in components.

---

### 6.1 How the Frontend Consumes Permissions

**Step 1 — Load permissions immediately after login:**

```typescript
// In authStore.login() and authStore.setUser():
await usePermissionsStore.getState().loadPermissions();
// This calls GET /api/v1/rbac/permissions/me → stores result in permissionsStore
```

**Step 2 — permissionsStore.loadPermissions():**

```typescript
// services/rbacService.ts
export const getMyPermissions = async (): Promise<PermissionEntry[]> => {
  const res = await api.get('/rbac/permissions/me');
  return res.data.data.permissions;
};

// store/permissionsStore.ts
loadPermissions: async () => {
  set({ isLoading: true });
  try {
    const permissions = await rbacService.getMyPermissions();
    set({ permissions, isLoaded: true, isLoading: false });
  } catch {
    set({ isLoading: false });
  }
}
```

**Step 3 — Selectors used throughout the UI:**

```typescript
const { can, canViewModule, canFeature, getFieldLevel } = usePermissionsStore();

// Check module-level access
canViewModule('courses')           // → true for admin, true for student (read-only)

// Check action on a module
can('courses', 'canCreate')        // → true for admin, false for student
can('certificates', 'canDownload') // → true for student

// Check feature-level action
canFeature('temple-registration', 'president-details', 'canEdit')  // → true for PRESIDENT

// Get field-level map for a feature
getFieldLevel('temple-registration', 'president-details')
// → { email: 'READ_ONLY', mobile: 'EDITABLE', pan_number: 'READ_ONLY', aadhaar_number: 'HIDDEN' }
```

**Step 4 — On logout:**

```typescript
// authStore.logout():
usePermissionsStore.getState().clearPermissions();
// Clears all cached permissions so the next user gets a clean slate
```

---

### 6.2 Dynamic Sidebar Rendering

The sidebar menus across `AdminLayout`, `ExaminerLayout`, and `StudentLayout` are no longer hardcoded. They are built at runtime from the modules the current user is permitted to view.

**`DynamicSidebar.tsx`:**

```tsx
import { usePermissionsStore } from '@/store/permissionsStore';

interface DynamicSidebarProps {
  domain: 'LMS' | 'TEMPLE' | 'SYSTEM';
}

export const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ domain }) => {
  const allowedModules = usePermissionsStore(s => s.allowedModules());

  // allowedModules() returns permission entries where:
  //   canView = true, featureId = null, module.domain = domain
  // Sorted by module.order from the API response

  return (
    <nav>
      {allowedModules
        .filter(m => m.domain === domain)
        .sort((a, b) => a.order - b.order)
        .map(module => (
          <SidebarNavItem
            key={module.moduleId}
            label={module.moduleName}
            route={module.route}
            icon={module.icon}
          />
        ))}
    </nav>
  );
};
```

**Updated `AdminLayout.tsx`:**

```tsx
// BEFORE (hardcoded):
// <nav>
//   <NavItem label="Dashboard" route="/admin/dashboard" />
//   <NavItem label="Courses" route="/admin/courses" />
//   ...
// </nav>

// AFTER (RBAC-driven):
<DynamicSidebar domain="LMS" />
```

This means if a SUPER_ADMIN removes `canView` from the `courses` module for `examiner` role, examiners immediately stop seeing "Courses" in their sidebar — no code changes required, no redeploy.

---

### 6.3 Feature-Level UI Control (Show/Hide Sections)

Entire form sections or page blocks are shown or hidden based on `canView` for that `featureId`.

**`ProtectedFeature.tsx`:**

```tsx
interface ProtectedFeatureProps {
  moduleId: string;
  featureId: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  moduleId, featureId, fallback = null, children
}) => {
  const canView = usePermissionsStore(s =>
    s.canFeature(moduleId, featureId, 'canView')
  );
  return canView ? <>{children}</> : <>{fallback}</>;
};
```

**Usage in `TempleRegistrationPage` (Step 4 — Review & Submit):**

```tsx
// Vice President sees all sections they have access to,
// but President Details Section is hidden for VP if canView=false

<ProtectedFeature moduleId="temple-registration" featureId="president-details">
  <PresidentDetailsReviewCard data={formData.president} />
</ProtectedFeature>

<ProtectedFeature moduleId="temple-registration" featureId="vice-president-details">
  <VicePresidentDetailsReviewCard data={formData.vicePresident} />
</ProtectedFeature>
```

**Usage in `EvaluateExamPage`:**

```tsx
// Per-question marks input section is only shown to examiners
// who have canView on the per-question-marks feature
<ProtectedFeature moduleId="exams" featureId="per-question-marks">
  <PerQuestionMarksTable questions={submission.questions} onChange={setMarks} />
</ProtectedFeature>
```

---

### 6.4 Button-Level Access Control (Action Gating)

Action buttons (Create, Edit, Delete, Approve, Download) are rendered conditionally using the `CanAccess` component or the `can()` selector.

**`CanAccess.tsx`:**

```tsx
interface CanAccessProps {
  moduleId: string;
  featureId?: string;
  action: 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove' | 'canDownload';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CanAccess: React.FC<CanAccessProps> = ({
  moduleId, featureId, action, fallback = null, children
}) => {
  const hasAccess = usePermissionsStore(s =>
    featureId
      ? s.canFeature(moduleId, featureId, action)
      : s.can(moduleId, action)
  );
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
```

**Usage examples across the application:**

```tsx
// CourseManagementPage — only admin with canCreate sees "Add Course" button
<CanAccess moduleId="courses" action="canCreate">
  <Button onClick={() => navigate('/admin/courses/add')}>+ Add Course</Button>
</CanAccess>

// CourseManagementPage — only admin with canDelete sees the Delete action in the table
<CanAccess moduleId="courses" action="canDelete">
  <Button variant="danger" onClick={() => handleDelete(course._id)}>Delete</Button>
</CanAccess>

// CertificateManagementPage — only admin with canApprove sees the Approve button
<CanAccess moduleId="certificates" action="canApprove">
  <Button onClick={() => handleApprove(result._id)}>Approve & Generate Certificate</Button>
</CanAccess>

// CertificatesPage (Student) — student can download only if canDownload=true
<CanAccess moduleId="certificates" action="canDownload">
  <Button onClick={() => downloadCertificate(cert._id)}>Download PDF</Button>
</CanAccess>

// ExaminerManagementPage — Add Examiner modal trigger (admin only)
<CanAccess moduleId="examiners" action="canCreate">
  <Button onClick={() => setShowAddModal(true)}>+ Add Examiner</Button>
</CanAccess>

// StudentManagementPage — Toggle active status (edit action)
<CanAccess moduleId="students" action="canEdit">
  <Switch checked={student.isActive} onChange={() => toggleStatus(student._id)} />
</CanAccess>
```

**Using the `can()` hook directly in imperative code:**

```tsx
// Disabling a form's submit button based on permission
const { can } = usePermissionsStore();

<Button
  type="submit"
  disabled={!can('temple-registration', 'canCreate')}
>
  Submit Registration
</Button>
```

---

### 6.5 Field-Level UI Control

Individual form fields render differently based on the `fieldLevel` map for their feature. Three states are possible: `EDITABLE` (normal input), `READ_ONLY` (disabled/span), `HIDDEN` (excluded from DOM entirely).

**`FieldController.tsx`:**

```tsx
interface FieldControllerProps {
  name: string;                  // field name key in fieldLevel map
  moduleId: string;
  featureId: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  error?: string;
}

export const FieldController: React.FC<FieldControllerProps> = ({
  name, moduleId, featureId, label, value, onChange, type = 'text', error
}) => {
  const fieldLevel = usePermissionsStore(s =>
    s.getFieldLevel(moduleId, featureId)
  );

  const access = fieldLevel[name] ?? 'EDITABLE';  // default: editable if not in map

  if (access === 'HIDDEN') return null;  // completely excluded from DOM

  if (access === 'READ_ONLY') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-muted">{label}</label>
        <span className="px-3 py-2 bg-gray-50 border border-border rounded-lg
                         text-gray-500 cursor-not-allowed text-sm">
          {value || '—'}
        </span>
      </div>
    );
  }

  // EDITABLE — normal controlled input
  return (
    <Input
      label={label}
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      error={error}
    />
  );
};
```

**Usage in `PresidentDetails.tsx` (Temple Registration Step 2):**

```tsx
// Before RBAC — all fields were plain inputs
// After RBAC — FieldController reads permissions; PRESIDENT sees email as READ_ONLY
//             VICE_PRESIDENT sees aadhaar_number as HIDDEN (completely excluded)

<FieldController
  name="email"
  moduleId="temple-registration"
  featureId="president-details"
  label="Email Address"
  value={formData.president.email}
  onChange={v => updatePresident({ email: v })}
  type="email"
/>

<FieldController
  name="mobile"
  moduleId="temple-registration"
  featureId="president-details"
  label="Mobile Number"
  value={formData.president.mobile}
  onChange={v => updatePresident({ mobile: v })}
/>

<FieldController
  name="aadhaar_number"
  moduleId="temple-registration"
  featureId="president-details"
  label="Aadhaar Number"
  value={formData.president.aadhaar_number}
  onChange={v => updatePresident({ aadhaar_number: v })}
/>
{/* For VICE_PRESIDENT: aadhaar_number is HIDDEN → FieldController returns null → field never renders */}
```

---

### 6.6 `usePermissions` Hook

```typescript
// hooks/usePermissions.ts
// Convenience hook that combines authStore + permissionsStore checks

export const usePermissions = () => {
  const { can, canViewModule, canFeature, getFieldLevel, isLoaded } =
    usePermissionsStore();

  return {
    isLoaded,
    can,
    canViewModule,
    canFeature,
    getFieldLevel,

    // Shorthand helpers for common patterns
    isAdmin: () => canViewModule('students') && can('students', 'canDelete'),
    isExaminer: () => canViewModule('examiner-dashboard'),
    isStudent: () => canViewModule('student-dashboard'),
    isTemplePresident: () => canFeature('temple-registration', 'president-details', 'canCreate'),
  };
};
```

### 6.7 `useFieldAccess` Hook

```typescript
// hooks/useFieldAccess.ts
// Returns a typed access map for a specific module+feature combination

export const useFieldAccess = (moduleId: string, featureId: string) => {
  const fieldLevel = usePermissionsStore(s => s.getFieldLevel(moduleId, featureId));

  return {
    fieldLevel,
    isEditable: (field: string) => (fieldLevel[field] ?? 'EDITABLE') === 'EDITABLE',
    isReadOnly: (field: string) => fieldLevel[field] === 'READ_ONLY',
    isHidden:   (field: string) => fieldLevel[field] === 'HIDDEN',
  };
};

// Usage:
const { isReadOnly, isHidden } = useFieldAccess('temple-registration', 'president-details');
// isReadOnly('email')        → true (for PRESIDENT)
// isHidden('aadhaar_number') → true (for VICE_PRESIDENT)
```

---

### 6.8 Permission Loading States

During the brief window between login and permission load, components that depend on `permissionsStore` must handle the `isLoaded = false` state gracefully:

```tsx
// In AdminLayout.tsx
const { isLoaded } = usePermissionsStore();

if (!isLoaded) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
      <p className="ml-3 text-text-muted">Loading your workspace...</p>
    </div>
  );
}

return <DynamicSidebar domain="LMS" />;
```

---

## 7. Services & API Layer

### api.ts — Axios Instance

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:5000/api/v1
  withCredentials: true,  // sends httpOnly refreshToken cookie
  timeout: 10000,
});

// Request interceptor: attach Bearer token from authStore
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: silent token refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // Queues concurrent 401s; calls POST /auth/refresh once; replays all
      const newToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Service Functions → API Mapping

| Service Function | HTTP | Endpoint | Description |
|-----------------|------|---------|-------------|
| `authService.registerUser()` | POST | `/auth/register` | Register student |
| `authService.loginUser()` | POST | `/auth/login` | Login |
| `authService.logoutUser()` | POST | `/auth/logout` | Logout |
| `authService.refreshAccessToken()` | POST | `/auth/refresh` | Silent refresh |
| `authService.getProfile()` | GET | `/auth/me` | Fetch current user |
| `rbacService.getMyPermissions()` | GET | `/rbac/permissions/me` | ✨ Load full permission set |
| `rbacService.getRoles()` | GET | `/rbac/roles` | ✨ List all roles (admin) |
| `rbacService.getModules()` | GET | `/rbac/modules` | ✨ List all modules (admin) |
| `rbacService.getFeatures()` | GET | `/rbac/features` | ✨ List all features (admin) |
| `rbacService.getRolePermissions()` | GET | `/rbac/role-permissions/:roleId` | ✨ Get permission matrix for role |
| `rbacService.updateRolePermission()` | PUT | `/rbac/role-permissions/:roleId` | ✨ Update permission entry |
| `rbacService.assignRole()` | POST | `/rbac/users/:userId/assign-role` | ✨ Assign role to user |
| `rbacService.revokeRole()` | DELETE | `/rbac/users/:userId/revoke-role/:roleId` | ✨ Revoke role from user |
| `courseService.getCourses()` | GET | `/courses` | List courses |
| `courseService.getCourseById()` | GET | `/courses/:id` | Get course |
| `adminService.adminCreateCourse()` | POST | `/courses` | Create course |
| `adminService.adminUpdateCourse()` | PUT | `/courses/:id` | Update course |
| `adminService.adminDeleteCourse()` | DELETE | `/courses/:id` | Delete course |
| `enrollmentService.getMyEnrollments()` | GET | `/enrollments/my` | My enrollments |
| `enrollmentService.enrollInCourse()` | POST | `/enrollments` | Enroll |
| `enrollmentService.updateLessonProgress()` | PATCH | `/enrollments/:id/progress` | Mark lesson done |
| `examService.getExamByCourse()` | GET | `/exams/course/:courseId` | Get exam |
| `submissionService.submitExam()` | POST | `/submissions` | Submit online exam |
| `submissionService.uploadOfflinePaper()` | POST | `/submissions/upload` | Upload PDF |
| `submissionService.getAssignedSubmissions()` | GET | `/submissions/assigned` | Examiner submissions |
| `submissionService.getSubmissionById()` | GET | `/submissions/:id` | Single submission |
| `submissionService.evaluateSubmission()` | PATCH | `/submissions/:id/evaluate` | Submit evaluation |
| `resultService.getMyResults()` | GET | `/results/my` | My results |
| `certificateService.getMyCertificates()` | GET | `/certificates/my` | My certs |
| `certificateService.downloadCertificate()` | GET | `/certificates/:id/download` | Download PDF |
| `certificateService.verifyCertificate()` | GET | `/certificates/verify/:certId` | Public verify |
| `adminService.getDashboard()` | GET | `/admin/dashboard` | Admin KPIs |
| `adminService.getStudents()` | GET | `/admin/students` | Student list |
| `adminService.toggleStudentStatus()` | PATCH | `/admin/students/:id/toggle` | Toggle active |
| `adminService.getExaminers()` | GET | `/admin/examiners` | Examiner list |
| `adminService.createExaminer()` | POST | `/admin/examiners` | Create examiner |
| `adminService.getAllSubmissions()` | GET | `/admin/submissions` | All submissions |
| `adminService.assignSubmission()` | PATCH | `/admin/submissions/:id/assign` | Assign to examiner |
| `adminService.getPendingResults()` | GET | `/admin/results/pending` | Pending approvals |
| `adminService.approveResult()` | PATCH | `/admin/results/:id/approve` | Approve result |
| `adminService.getAllCertificates()` | GET | `/admin/certificates` | All certs |
| `adminService.getReports()` | GET | `/admin/reports` | Analytics |
| `adminService.exportCSV()` | GET | `/admin/export` | CSV download |

---

## 8. Module 1 — Public Website

### Pages & Routes

| Page | Route | API Call | Status |
|------|-------|---------|--------|
| HomePage | `/` | None (static) | 🔴 Should call `GET /courses?featured=true&limit=4` |
| CoursesPage | `/courses` | `getMockCourses()` | 🔴 Uses mock data — `getCourses()` service exists but unused |
| CourseDetailPage | `/courses/:id` | `getMockCourses().find()` | 🔴 Uses mock data — `getCourseById()` service exists but unused |
| AboutPage | `/about` | None (static) | ✅ Static page |
| ContactPage | `/contact` | None (static) | ✅ Static page (no form submission API) |
| HowItWorksPage | `/how-it-works` | None (static) | ✅ Static page |
| ExamGuidelinesPage | `/exam-guidelines` | None (static) | ✅ Static page |

### HomePage Sections

1. **Hero Banner** — Amritsar temple background with dark gradient overlay; "Learn. Understand. **Transform.**" (orange); CTA buttons; trust badges
2. **Popular Courses** — 4-column CourseGrid; "View All →" link
3. **How It Works** — 4-step horizontal flow with Lucide icons + arrows
4. **Stats Banner** — Dark bg: 25K+ Students, 120+ Courses, 10K+ Exams, 8K+ Certs
5. **CTA Banner** — Orange gradient; "Begin your spiritual journey"
6. **Footer** — 5 columns: brand, quick links, courses, contact, social

### CoursesPage — Filter Implementation

Client-side filters on mock data (should move to server-side API):
- Search input (debounced, filters on `title`)
- Level dropdown: All / Beginner / Intermediate / Advanced
- Type: All / Free / Paid
- Category: Dynamic dropdown

---

## 9. Module 2 — Authentication

### Pages

| Page | Route | Key Form Fields | API Call |
|------|-------|----------------|---------|
| RegisterPage | `/register` | name, email, phone, password, confirmPassword | `POST /auth/register` |
| LoginPage | `/login` | email, password | `POST /auth/login` |
| ForgotPasswordPage | `/forgot-password` | email | 🔴 setTimeout simulation — NO real API call |
| OAuthCallbackPage | `/auth/callback` | — | `GET /auth/me` (reads `?token=...&role=...` from URL) |

### RegisterPage — Form Validation (Zod)

```typescript
const registerSchema = z.object({
  name:            z.string().min(2, 'Name required'),
  email:           z.string().email('Invalid email'),
  phone:           z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password:        z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Too weak'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword']
})
```

**Post-Registration Flow (Updated with RBAC):**
1. `POST /auth/register` → get `{ user, accessToken }`
2. Store in `authStore`
3. Call `permissionsStore.loadPermissions()` → `GET /rbac/permissions/me`
4. Show `StudentIdModal` with new `studentId`
5. Navigate to `/student/dashboard`

### LoginPage — Role-Based Redirect (Updated with RBAC)

```typescript
// After successful login:
await authStore.setUser(user, accessToken);
await permissionsStore.loadPermissions();  // ✨ load RBAC permissions immediately

// Then redirect based on role:
// 'student'   → /student/dashboard
// 'examiner'  → /examiner/dashboard
// 'admin'     → /admin/dashboard
// 'PRESIDENT' → /temple-registration/temple
```

### Google OAuth Flow (Frontend)

1. User clicks "Continue with Google" → `window.location = {VITE_API_BASE_URL}/auth/google`
2. Passport.js handles redirect
3. Backend redirects back to `/auth/callback?token=...&role=...`
4. `OAuthCallbackPage` extracts token → stores in Zustand → calls `getProfile()` → calls `permissionsStore.loadPermissions()` → redirects to dashboard

### Silent Token Refresh

Axios response interceptor handles 401s:
1. Queues all concurrent failing requests
2. Calls `POST /auth/refresh` once
3. On success: replays all queued requests with new token
4. On failure: clears store + clears `permissionsStore` → redirects to `/login`

---

## 10. Module 3 — Student Portal

### Pages & APIs

| Page | Route | APIs Called | Notes |
|------|-------|------------|-------|
| DashboardPage | `/student/dashboard` | `GET /enrollments/my`, `GET /results/my`, `GET /certificates/my` | Falls back to mock data on API error |
| MyCoursesPage | `/student/courses` | `GET /enrollments/my` | Tab switching (Enrolled/Completed) is client-side filter |
| CoursePageStudent | `/student/courses/:id` | `GET /courses/:id`, `GET /enrollments/my` | Lesson accordion; progress bar; offline upload |
| ExamSectionPage | `/student/courses/:id/exam` | `GET /exams/course/:courseId`, `POST /submissions` | Full-screen exam; countdown timer; confirm modal |
| ResultsPage | `/student/results` | `GET /results/my` | Pass/fail color coding; falls back to mock |
| CertificatesPage | `/student/certificates` | `GET /certificates/my`, `GET /certificates/:id/download` | Blob download via `<a>` element trick; Download button gated by `canDownload` |
| ProfilePage | `/student/profile` | `GET /auth/me`, `PATCH /auth/profile` | Avatar upload section; change password (⚠️ endpoints may not exist in backend) |

### ExamSectionPage — Implementation Detail

```
Full-screen layout:
┌─────────────────────────────────────────────────────────┐
│ Course Title — Final Exam               ⏱ 45:30         │
│ Question 3 of 20 [████████░░░░░ 15%]                     │
├─────────────────────────────────────────────────────────┤
│ Q3. Who narrates the Bhagavad Gita?                      │
│   ○ Arjuna   ○ Krishna   ● Sanjaya   ○ Dhritarashtra     │
├─────────────────────────────────────────────────────────┤
│ [← Previous]                          [Next Question →]  │
│                               [Submit Exam] (at last Q)  │
└─────────────────────────────────────────────────────────┘
```

**State:** `answers` stored in component state (local, not Zustand) — no data loss on prev/next navigation. Timer stored in `ExamTimer` component; fires `onExpire` callback → same `handleSubmit()` as manual submit.

---

## 11. Module 4 — Examiner Portal

### Pages & APIs

| Page | Route | APIs Called | Notes |
|------|-------|------------|-------|
| DashboardPage | `/examiner/dashboard` | `GET /submissions/assigned` | Stats computed client-side from API data |
| AssignedStudentsPage | `/examiner/students` | `GET /submissions/assigned` | All filters (search/status/course) are client-side |
| StudentProfilePage | `/examiner/students/:id` | `GET /admin/students/:id` | Read-only student details |
| EvaluateExamPage | `/examiner/evaluate/:id` | `GET /submissions/:id`, `PATCH /submissions/:id/evaluate` | Core evaluation UI |

### EvaluateExamPage — RBAC Integration

```
Side-by-side split (lg:grid-cols-2):
LEFT: Questions + PerQuestionMarks section (shown via ProtectedFeature)
RIGHT: Student answers OR offline PDF in iframe

BOTTOM: Overall Remarks textarea + total score auto-calculation + PASS/FAIL + Submit
```

The per-question marks section is wrapped in `ProtectedFeature`:

```tsx
<ProtectedFeature moduleId="exams" featureId="per-question-marks">
  <div className="space-y-3">
    {questions.map(q => (
      <div key={q._id} className="flex items-center justify-between">
        <span className="text-sm">{q.text}</span>
        <FieldController
          name="marks"
          moduleId="exams"
          featureId="per-question-marks"
          label={`/ ${q.marks}`}
          value={String(marks[q._id] ?? '')}
          onChange={v => setMarks(prev => ({ ...prev, [q._id]: Number(v) }))}
          type="number"
        />
      </div>
    ))}
  </div>
</ProtectedFeature>
```

---

## 12. Module 5 — Admin Panel

### Pages & APIs

| Page | Route | APIs Called | Notes |
|------|-------|------------|-------|
| DashboardPage | `/admin/dashboard` | `GET /admin/dashboard` | Recharts LineChart + PieChart |
| CourseManagementPage | `/admin/courses` | `GET /courses?limit=100`, `PUT /courses/:id`, `DELETE /courses/:id` | Edit/Delete buttons gated by `CanAccess` |
| AddCoursePage | `/admin/courses/add` | `POST /courses` | Lessons builder with add/remove/reorder |
| StudentManagementPage | `/admin/students` | `GET /admin/students`, `PATCH /admin/students/:id/toggle` | Toggle gated by `canEdit` |
| ExamManagementPage | `/admin/exams` | `GET /exams` ⚠️, `POST /exams` ⚠️, `DELETE /exams/:id` ⚠️ | **3 API calls to non-existent endpoints** |
| ExaminerManagementPage | `/admin/examiners` | `GET /admin/examiners`, `POST /admin/examiners`, `PATCH /admin/examiners/:id/toggle` | Add examiner gated by `canCreate` |
| CertificateManagementPage | `/admin/certificates` | `GET /admin/results/pending`, `PATCH /admin/results/:id/approve`, `GET /admin/certificates` | Approve button gated by `canApprove` |
| ReportsPage | `/admin/reports` | `GET /admin/reports`, `GET /admin/export?type=...` | CSV export gated by `canDownload` |
| RbacManagementPage | `/admin/rbac` | `GET /rbac/roles`, `GET /rbac/modules`, `GET /rbac/role-permissions/:roleId`, `PUT /rbac/role-permissions/:roleId` | ✨ New page — only visible to `super_admin` role |

### RbacManagementPage — UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  RBAC Management                                                  │
│  ┌────────────┐  ┌──────────────────────────────────────────┐   │
│  │ Roles       │  │  Permission Matrix for: [admin ▼]        │   │
│  │ ─────────── │  │  ─────────────────────────────────────── │   │
│  │ ● admin     │  │  Module          View  Create Edit Delete │   │
│  │   examiner  │  │  Courses          ✅    ✅    ✅   ✅    │   │
│  │   student   │  │  Students         ✅    ✅    ✅   ✅    │   │
│  │   PRESIDENT │  │  Certificates     ✅    —     —    —     │   │
│  │   VICE_PRES │  │  Temple Reg.      ✅    ✅    ✅   ✅    │   │
│  └────────────┘  └──────────────────────────────────────────┘   │
│                   [Field-Level Rules] tab  [User Assignments] tab │
└──────────────────────────────────────────────────────────────────┘
```

### AdminLayout — Sidebar Navigation (RBAC-Driven)

The sidebar is now fully dynamic via `DynamicSidebar domain="LMS"`. Previously hardcoded sections:

```
OVERVIEW:    Dashboard, Reports
COURSES:     All Courses, Add Course
STUDENTS:    All Students
EXAMS:       Online Exams, Offline Submissions
EXAMINERS:   All Examiners, Add Examiner, Assign Students
CERTIFICATES: Generate, Manage
SYSTEM:      RBAC Management  ← only visible to super_admin
```

All items are now driven by `modules` collection via `permissionsStore.allowedModules()`. Items with `canView=false` for the current role are simply absent from the rendered nav.

---

## 13. Module 6 — Temple Registration

### Pages & Routes

| Step | Route | Data Stored In |
|------|-------|---------------|
| Step 1: Temple Details | `/temple-registration/temple` | TempleFormContext |
| Step 2: President Details | `/temple-registration/president` | TempleFormContext |
| Step 3: VP Details | `/temple-registration/vice-president` | TempleFormContext |
| Step 4: Review & Submit | `/temple-registration/review` | TempleFormContext |
| Success | `/temple-registration/success` | — |

### ⚠️ CRITICAL GAP: Zero API Calls in Entire Temple Flow

The complete 4-step temple registration makes **zero backend API calls**:

| Feature | Frontend | Backend Status |
|---------|----------|---------------|
| Form data storage | React Context only | `POST /temples/step` complete but unused |
| Logo/photo upload | Base64 in Context | `POST /uploads` complete but unused |
| Mobile OTP | Local state toggle (fake "verified") | Full OTP flow (`POST /otp/send`, `POST /otp/verify`) complete but unused |
| PAN/email uniqueness check | None | `GET /temple-users/check-duplicate` complete but unused |
| Final registration submission | Navigates to success page directly | `POST /temples/register` with MongoDB transaction complete but unused |

### RBAC Integration Points for Temple Registration

Once the temple flow is connected to the backend, field-level RBAC controls apply to Steps 2 and 3. The `FieldController` component handles rendering based on the `PRESIDENT`/`VICE_PRESIDENT` role's `fieldLevel` permission map:

- `PRESIDENT` sees their own details section fully editable, VP section read-only where relevant
- `VICE_PRESIDENT` sees `aadhaar_number` fields as `HIDDEN` (per example `role_permissions` document)
- `ProtectedFeature` wraps each step section to enforce `canView` at the section level

```tsx
// PresidentDetails.tsx — Step 2
<ProtectedFeature
  moduleId="temple-registration"
  featureId="president-details"
  fallback={<p className="text-error">You don't have access to this section.</p>}
>
  <FieldController name="name"          moduleId="temple-registration" featureId="president-details" ... />
  <FieldController name="email"         moduleId="temple-registration" featureId="president-details" ... />
  <FieldController name="mobile"        moduleId="temple-registration" featureId="president-details" ... />
  <FieldController name="pan_number"    moduleId="temple-registration" featureId="president-details" ... />
  <FieldController name="aadhaar_number" moduleId="temple-registration" featureId="president-details" ... />
</ProtectedFeature>
```

---

## 14. Form Handling & Validation

### Pattern Used

All authenticated/critical forms use:
- **react-hook-form** for field registration and submission
- **@hookform/resolvers/zod** to bind Zod schemas as resolvers
- **Inline error display** via `formState.errors.fieldName?.message`

### Zod Schemas (Frontend)

```typescript
// Auth schemas
registerSchema: name(min:2), email, phone(Indian 10-digit), password(min:8+upper+lower+digit), confirmPassword
loginSchema: email, password(min:1)

// Course schema (admin)
courseSchema: title(min:3), description(min:10), category, level(enum), isPaid, price(optional)

// Exam schema
examSchema: title, totalMarks, passingMarks, duration, questions[]

// Profile schema
profileSchema: name(min:2), phone(optional)
changePasswordSchema: currentPassword, newPassword, confirmNewPassword

// RBAC schema ✨
assignRoleSchema: userId, roleId, expiresAt(optional date)
updatePermissionSchema: moduleId, featureId, permissions(object), fieldLevel(object)
```

### Client-Side Validation Summary

| Page | Fields Validated | Method |
|------|-----------------|--------|
| RegisterPage | name, email, phone, password, confirmPassword | Zod + react-hook-form |
| LoginPage | email, password | Zod + react-hook-form |
| AddCoursePage | title, category, level | Zod + react-hook-form |
| PresidentDetails | name, mobile (length check), PAN format | Local state + regex → migrate to FieldController |
| VicePresidentDetails | Same as President | Local state + regex → migrate to FieldController |
| EvaluateExamPage | marks ≤ question.marks, all questions filled | Local state validation |
| ExamSectionPage | At least one answer per question (partial) | Local state |
| RbacManagementPage | roleId required, moduleId required | Zod + react-hook-form |

---

## 15. Gap Analysis — Frontend vs Backend

### ⚠️ Frontend Calls Non-Existent Backend Endpoints

| UI Action | Service Call | Missing Endpoint | Impact |
|-----------|-------------|-----------------|--------|
| Admin Exam list page load | `adminService.adminGetExams()` | `GET /exams` | Page fails to load exam list |
| Admin Create Exam form submit | `adminService.adminCreateExam()` | `POST /exams` | Cannot create exams from admin panel |
| Admin Edit Exam | `adminService.adminUpdateExam()` | `PUT /exams/:id` | Cannot edit exams |
| Admin Delete Exam | `adminService.adminDeleteExam()` | `DELETE /exams/:id` | Cannot delete exams |
| ForgotPasswordPage submit | Simulated — no real call | `POST /auth/forgot-password` | Forgot password is non-functional |

### 🔴 Frontend UI With No API Calls (Mock or Simulated)

| Screen | Issue | Impact |
|--------|-------|--------|
| `CoursesPage` (public) | Uses `getMockCourses()` — service function with real API exists but unused | Course list never reflects real DB data |
| `CourseDetailPage` (public) | Same mock pattern | Course details never from DB |
| `ForgotPasswordPage` | `setTimeout` simulation | Password reset completely non-functional |
| Temple Registration (all 4 steps) | Zero API calls; all data discarded on submit | Registration form collects data but saves nothing to DB |
| Temple "Verify Mobile" | Local state only — no OTP sent | Security bypass: anyone can "verify" any number |

### ✅ Backend Endpoints Not Yet Used by Any UI

| Endpoint | Status |
|---------|--------|
| `POST /api/v1/temples/step` | Backend fully implemented; 0% connected |
| `POST /api/v1/temples/validate-step` | Backend complete; 0% connected |
| `POST /api/v1/temples/register` | Backend with MongoDB transactions; 0% connected |
| `GET /api/v1/temples/:id` | Backend complete; 0% connected |
| `POST /api/v1/otp/send` | Backend complete; 0% connected |
| `POST /api/v1/otp/verify` | Backend complete; 0% connected |
| `POST /api/v1/uploads` | Backend complete; temple frontend uses base64 only |
| `GET /api/v1/temple-users/check-duplicate` | Backend complete; 0% connected |
| `GET /api/v1/rbac/permissions/me` | ✨ New endpoint; frontend permissionsStore not yet wired |
| `GET /api/v1/rbac/modules` | ✨ New endpoint; DynamicSidebar not yet implemented |
| `PUT /api/v1/rbac/role-permissions/:roleId` | ✨ New endpoint; RbacManagementPage not yet built |

### API Response Shape Mismatches

| Issue | Frontend Expects | Backend Returns |
|-------|-----------------|----------------|
| `GET /results/my` | `data.results[]` | `data[]` (flat array) |
| `GET /enrollments/my` | `data.enrollments[]` | `data[]` (flat array) |
| `GET /certificates/my` | `data.certificates[]` | `data[]` (flat array) |
| Student ID format | `PIHE-YYYY-NNNN` | Inconsistent: some docs show `ISK-2026-NNNNN`, some `STU-XXXX` |

---

## 16. Improvement Suggestions

### Immediate Fixes (High Priority)

1. **Wire up `permissionsStore`** — call `GET /rbac/permissions/me` in `authStore.login()` and `OAuthCallbackPage` immediately after token storage. Until this is done, all RBAC UI components will default to showing nothing.

2. **Replace hardcoded sidebar nav** in `AdminLayout`, `ExaminerLayout`, and `StudentLayout` with `DynamicSidebar` once `permissionsStore` is populated.

3. **Replace mock data in CoursesPage and CourseDetailPage** with real API calls to `courseService.getCourses()` and `getCourseById()` — service functions already exist.

4. **Connect Temple Registration to backend** — replace all 4 `navigate()` calls with actual API calls; implement real OTP flow; implement `POST /api/v1/uploads` for file uploads.

5. **Add missing exam admin endpoints** — `GET/POST/PUT/DELETE /api/v1/exams` — and wire them to ExamManagementPage.

6. **Fix response data shape** — update service functions to correctly destructure `data.results`, `data.enrollments`, `data.certificates` vs `data[]` array.

7. **Implement ForgotPasswordPage** — replace `setTimeout` with real `POST /auth/forgot-password` flow.

### Architecture Improvements

8. **React Query (`@tanstack/react-query`)** — replace manual `useEffect` + `useState` data fetching with React Query for caching, background refetch, optimistic updates, and deduplication.

9. **Centralise mock data fallbacks** — currently scattered (`MOCK_ENROLLMENTS`, `MOCK_RESULTS`) — move to a `__mocks__` directory or remove entirely for production.

10. **Student ID standardisation** — ensure consistent format (`PIHE-YYYY-NNNN`) across: backend `generateStudentId()`, auth module docs, API response, and UI display.

11. **Error boundary** — add React `ErrorBoundary` components around dashboard pages so one failed API call doesn't crash the whole layout.

12. **Skeleton loading states** — replace `<Spinner>` with `<Skeleton>` components (already available in shadcn/ui) for better perceived performance.

### Folder Structure Improvements

13. **Merge `app/` and `src/`** — the current structure has two separate React app roots (`src/App.tsx` and `src/app/App.tsx`). Consolidate into one entry point with proper routing.

14. **Standardise shadcn/ui usage** — `src/app/components/ui/` (shadcn) and `src/components/ui/` (custom) are parallel. Prefer shadcn/ui primitives wrapped with custom variants rather than maintaining two parallel UI systems.

15. **Move validators to shared package** — Zod schemas should be shared between frontend and backend (as per the original architecture intent). Create `src/validators/` that exports schemas usable by both.

16. **RBAC permission cache invalidation** — when `permissionsStore.loadPermissions()` fails (e.g., network error during silently refreshed session), retry with exponential backoff before falling back to the last known permissions. Stale permissions are safer than no permissions for UX continuity.
