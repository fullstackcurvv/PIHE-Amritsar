import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { StudentIdModal } from '@/components/shared/StudentIdModal'
import PublicLayout   from '@/layouts/PublicLayout'
import StudentLayout  from '@/layouts/StudentLayout'
import ExaminerLayout from '@/layouts/ExaminerLayout'
import AdminLayout    from '@/layouts/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute }     from './GuestRoute'

// Shared content-area loader (used by public + auth routes)
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" className="text-[#E8720C]" />
    </div>
  )
}

// ── Public pages (lazy) ─────────────────────────────
const HomePage           = lazy(() => import('@/pages/public/HomePage'))
const AboutPage          = lazy(() => import('@/pages/public/AboutPage'))
const CoursesPage        = lazy(() => import('@/pages/public/CoursesPage'))
const CourseDetailPage   = lazy(() => import('@/pages/public/CourseDetailPage'))
const HowItWorksPage     = lazy(() => import('@/pages/public/HowItWorksPage'))
const ExamGuidelinesPage = lazy(() => import('@/pages/public/ExamGuidelinesPage'))
const ContactPage        = lazy(() => import('@/pages/public/ContactPage'))

// ── Temple Registration (lazy) ───────────────────────
const TempleRegistrationPage    = lazy(() => import('@/pages/public/TempleRegistrationPage'))
const TempleDetailsStep         = lazy(() => import('@/pages/temple/TempleDetails'))
const PresidentDetailsStep      = lazy(() => import('@/pages/temple/PresidentDetails'))
const VicePresidentDetailsStep  = lazy(() => import('@/pages/temple/VicePresidentDetails'))
const ReviewSubmitStep          = lazy(() => import('@/pages/temple/ReviewSubmit'))
const RegistrationSuccess       = lazy(() => import('@/pages/temple/RegistrationSuccess'))

// ── Auth pages (lazy) ───────────────────────────────
const RegisterPage       = lazy(() => import('@/pages/auth/RegisterPage'))
const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const OAuthCallbackPage  = lazy(() => import('@/pages/auth/OAuthCallbackPage'))

// ── Examiner portal pages (lazy) ───────────────────
const ExaminerDashboardPage   = lazy(() => import('@/pages/examiner/DashboardPage'))
const AssignedStudentsPage    = lazy(() => import('@/pages/examiner/AssignedStudentsPage'))
const StudentProfilePage      = lazy(() => import('@/pages/examiner/StudentProfilePage'))
const EvaluateExamPage        = lazy(() => import('@/pages/examiner/EvaluateExamPage'))

// ── Admin portal pages (lazy) ──────────────────────
const AdminDashboardPage        = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminCourseManagementPage = lazy(() => import('@/pages/admin/CourseManagementPage'))
const AdminAddCoursePage        = lazy(() => import('@/pages/admin/AddCoursePage'))
const AdminStudentManagementPage = lazy(() => import('@/pages/admin/StudentManagementPage'))
const AdminExamManagementPage   = lazy(() => import('@/pages/admin/ExamManagementPage'))
const AdminExaminerManagementPage = lazy(() => import('@/pages/admin/ExaminerManagementPage'))
const AdminCertificatePage      = lazy(() => import('@/pages/admin/CertificateManagementPage'))
const AdminReportsPage          = lazy(() => import('@/pages/admin/ReportsPage'))

// ── Student portal pages (lazy) ─────────────────────
const DashboardPage      = lazy(() => import('@/pages/student/DashboardPage'))
const ProfilePage        = lazy(() => import('@/pages/student/ProfilePage'))
const MyCoursesPage      = lazy(() => import('@/pages/student/MyCoursesPage'))
const CoursePageStudent  = lazy(() => import('@/pages/student/CoursePageStudent'))
const ExamSectionPage    = lazy(() => import('@/pages/student/ExamSectionPage'))
const ResultsPage        = lazy(() => import('@/pages/student/ResultsPage'))
const CertificatesPage   = lazy(() => import('@/pages/student/CertificatesPage'))
const SupportPage        = lazy(() => import('@/pages/student/SupportPage'))

function PlaceholderPortal({ role }: { role: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="text-5xl">🚧</div>
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
        {role} Portal
      </h1>
      <p className="text-gray-400">This module is coming soon — Module 4+</p>
      <a href="/" className="text-[#E8720C] underline text-sm">← Back to Home</a>
    </div>
  )
}

export default function AppRouter() {
  return (
    <>
      {/* Student ID welcome modal — global */}
      <StudentIdModal />

      {/*
        NOTE: No top-level <Suspense> around <Routes>.
        Each layout owns its own <Suspense> boundary around <Outlet />,
        so the persistent shell (navbar/sidebar) is never replaced by a spinner.
      */}
      <Routes>

        {/* ── Public routes ─────────────────────────── */}
        {/* PublicLayout has its own <Suspense> around <Outlet /> */}
        <Route element={<PublicLayout />}>
          <Route path="/"                 element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
          <Route path="/about"            element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
          <Route path="/courses"          element={<Suspense fallback={<PageLoader />}><CoursesPage /></Suspense>} />
          <Route path="/courses/:id"      element={<Suspense fallback={<PageLoader />}><CourseDetailPage /></Suspense>} />
          <Route path="/how-it-works"     element={<Suspense fallback={<PageLoader />}><HowItWorksPage /></Suspense>} />
          <Route path="/exam-guidelines"  element={<Suspense fallback={<PageLoader />}><ExamGuidelinesPage /></Suspense>} />
          <Route path="/contact"             element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />

          {/* ── Temple Registration (multi-step) ────── */}
          {/*
            TempleRegistrationPage is the layout: it wraps child routes with
            TempleFormProvider so form state persists across all steps.
            The Navbar + Footer come from the parent PublicLayout.
          */}
          <Route
            path="/temple-registration"
            element={<Suspense fallback={<PageLoader />}><TempleRegistrationPage /></Suspense>}
          >
            <Route index                    element={<Suspense fallback={<PageLoader />}><TempleDetailsStep /></Suspense>} />
            <Route path="president"         element={<Suspense fallback={<PageLoader />}><PresidentDetailsStep /></Suspense>} />
            <Route path="vice-president"    element={<Suspense fallback={<PageLoader />}><VicePresidentDetailsStep /></Suspense>} />
            <Route path="review"            element={<Suspense fallback={<PageLoader />}><ReviewSubmitStep /></Suspense>} />
            <Route path="success"           element={<Suspense fallback={<PageLoader />}><RegistrationSuccess /></Suspense>} />
          </Route>
        </Route>

        {/* ── Auth routes (guest only) ───────────────── */}
        <Route element={<GuestRoute />}>
          <Route path="/register"        element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
          <Route path="/login"           element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>} />
        </Route>

        {/* OAuth callback — no auth guard needed */}
        <Route path="/auth/callback" element={<Suspense fallback={<PageLoader />}><OAuthCallbackPage /></Suspense>} />

        {/* ── Student Portal ────────────────────────── */}
        {/* StudentLayout owns <Suspense> around its <Outlet />, keeping sidebar always visible */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard"          element={<DashboardPage />} />
            <Route path="/student/profile"            element={<ProfilePage />} />
            <Route path="/student/courses"            element={<MyCoursesPage />} />
            <Route path="/student/courses/:id"        element={<CoursePageStudent />} />
            <Route path="/student/courses/:id/exam"   element={<ExamSectionPage />} />
            <Route path="/student/results"            element={<ResultsPage />} />
            <Route path="/student/certificates"       element={<CertificatesPage />} />
            <Route path="/student/support"            element={<SupportPage />} />
          </Route>
        </Route>

        {/* ── Examiner Portal (Module 4) ────────────── */}
        {/* ExaminerLayout owns <Suspense> around its <Outlet />, keeping sidebar alive */}
        <Route element={<ProtectedRoute allowedRoles={['examiner']} />}>
          <Route element={<ExaminerLayout />}>
            <Route path="/examiner/dashboard"          element={<ExaminerDashboardPage />} />
            <Route path="/examiner/students"           element={<AssignedStudentsPage />} />
            <Route path="/examiner/students/:id"       element={<StudentProfilePage />} />
            <Route path="/examiner/evaluate"           element={<AssignedStudentsPage />} />
            <Route path="/examiner/evaluate/:submissionId" element={<EvaluateExamPage />} />
            <Route path="/examiner/support"            element={
              <div className="max-w-2xl mx-auto py-16 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
                  Support
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Contact admin for any issues with assigned exams.</p>
              </div>
            } />
          </Route>
        </Route>

        {/* ── Admin Panel (Module 5) ─────────────────── */}
        {/* AdminLayout owns <Suspense> around its <Outlet />, keeping sidebar alive */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard"    element={<AdminDashboardPage />} />
            <Route path="/admin/courses"      element={<AdminCourseManagementPage />} />
            <Route path="/admin/courses/add"  element={<AdminAddCoursePage />} />
            <Route path="/admin/students"     element={<AdminStudentManagementPage />} />
            <Route path="/admin/exams"        element={<AdminExamManagementPage />} />
            <Route path="/admin/examiners"    element={<AdminExaminerManagementPage />} />
            <Route path="/admin/certificates" element={<AdminCertificatePage />} />
            <Route path="/admin/submissions"  element={<AdminCertificatePage />} />
            <Route path="/admin/reports"      element={<AdminReportsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4" style={{ backgroundColor: '#FFFAF5' }}>
            <h1 className="text-6xl font-bold" style={{ color: '#E8720C', fontFamily: 'Cinzel, serif' }}>404</h1>
            <p className="text-xl text-gray-600">Page not found</p>
            <a href="/" className="text-[#E8720C] underline">Go home</a>
          </div>
        } />

      </Routes>
    </>
  )
}
