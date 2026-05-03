iskcon-course-portal/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── index.html
│
├── src/
│   │
│   ├── app/                                        # App bootstrap layer
│   │   ├── App.tsx                                 # Root component, router mount
│   │   ├── AppProviders.tsx                        # Composes all global providers
│   │   └── ErrorBoundary.tsx                       # Global React error boundary
│   │
│   │
│   ├── modules/                                    # ══ FEATURE MODULES (Plug-and-Play) ══
│   │   │
│   │   ├── public-website/                         # PRE-LOGIN PUBLIC PAGES
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx                    # Screen 1: Landing Page
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   ├── CoursesPublicPage.tsx
│   │   │   │   ├── CourseDetailPublicPage.tsx
│   │   │   │   ├── HowItWorksPage.tsx
│   │   │   │   ├── ExamGuidelinesPage.tsx
│   │   │   │   └── ContactPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── Navbar.tsx                      # Public navbar with auth links
│   │   │   │   ├── HeroSection.tsx                 # "Learn. Understand. Transform."
│   │   │   │   ├── FeaturedCourses.tsx             # Course cards grid (free/paid)
│   │   │   │   ├── CourseCard.tsx                  # Reusable public course card
│   │   │   │   ├── HowItWorksSection.tsx           # 4 steps: Register→Enroll→Learn→Certify
│   │   │   │   ├── PlatformStats.tsx               # 25K+ students, 120+ courses etc.
│   │   │   │   ├── CTABanner.tsx                   # "Begin your spiritual journey"
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   └── Footer.tsx                      # 5-column footer from FSD
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── auth/                                   # AUTHENTICATION MODULE
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx                   # Google / OTP / Username+Password
│   │   │   │   ├── StudentRegisterPage.tsx         # Screen 3: Student Registration
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx                   # Username+password form
│   │   │   │   ├── GoogleLoginButton.tsx           # OAuth2 Google login
│   │   │   │   ├── MobileOTPLogin.tsx              # Mobile + OTP flow
│   │   │   │   ├── OTPInputBox.tsx                 # 6-digit OTP input UI
│   │   │   │   ├── StudentRegisterForm.tsx         # firstName, lastName, email, password, mobile
│   │   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   │   └── SocialAuthDivider.tsx           # "Or continue with"
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useStudentRegister.ts
│   │   │   │   ├── useOTPVerify.ts                 # /api/auth/otp/verify
│   │   │   │   └── useGoogleAuth.ts
│   │   │   ├── api/
│   │   │   │   └── auth.service.ts                 # login, register, refresh, logout
│   │   │   ├── store/
│   │   │   │   └── authSlice.ts                    # currentUser, isLoggedIn, tokenExpiry
│   │   │   ├── schemas/
│   │   │   │   ├── login.schema.ts                 # Zod: email + password
│   │   │   │   └── student-register.schema.ts      # Zod: all student reg fields + rules
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── temple-registration/                    # SCREEN 2: TEMPLE REGISTRATION (5-step)
│   │   │   ├── pages/
│   │   │   │   └── TempleRegistrationPage.tsx      # Shell: Stepper + step router
│   │   │   ├── components/
│   │   │   │   ├── TempleRegistrationStepper.tsx   # Step indicator: 1→2→3→4→5
│   │   │   │   ├── Step1TempleBasicDetails.tsx     # Temple Name, GSTN, Logo, Location
│   │   │   │   ├── Step2PresidentDetails.tsx       # All president fields (accordion sections)
│   │   │   │   ├── Step3VicePresidentDetails.tsx   # Mirror of Step2 for VP
│   │   │   │   ├── Step4ReviewSubmit.tsx           # Read-only review of all 3 steps
│   │   │   │   ├── Step5SuccessScreen.tsx          # Confirmation + credentials info
│   │   │   │   │
│   │   │   │   ├── step2-sections/                 # President form accordion sections
│   │   │   │   │   ├── BasicInfoSection.tsx        # fullName, DOB, gender, fatherName
│   │   │   │   │   ├── AddressSection.tsx          # address1/2, city, state, country, pin
│   │   │   │   │   ├── ContactSection.tsx          # mobile (OTP), googleEmail
│   │   │   │   │   ├── IdentitySection.tsx         # govtIdType dropdown, id number, upload
│   │   │   │   │   ├── PersonalInfoSection.tsx     # photo, altPhone, emergencyContact
│   │   │   │   │   ├── ProfessionalInfoSection.tsx # occupation, orgName, workAddress
│   │   │   │   │   ├── FamilyInfoSection.tsx       # family members dynamic list
│   │   │   │   │   └── ISKCONInfoSection.tsx       # initiationName, guru, yearsWithISKCON
│   │   │   │   │
│   │   │   │   └── GovtIdInput.tsx                 # Smart input: PAN / Aadhaar / Passport switch
│   │   │   ├── hooks/
│   │   │   │   ├── useTempleRegistration.ts        # Orchestrates all 5 steps + templeId state
│   │   │   │   ├── useLocationCascade.ts           # Country → State → City dropdown chain
│   │   │   │   └── useMobileOTP.ts                 # OTP send + verify for president/VP mobile
│   │   │   ├── api/
│   │   │   │   └── temple-registration.service.ts  # step1..step4, getStep(templeId), upload
│   │   │   ├── store/
│   │   │   │   └── templeRegistrationSlice.ts      # currentStep, templeId, draftData per step
│   │   │   ├── schemas/
│   │   │   │   ├── step1-temple.schema.ts          # GSTN regex, 5MB file, 6-digit pin
│   │   │   │   ├── step2-president.schema.ts       # All president field validations
│   │   │   │   └── step3-vp.schema.ts              # Mirror of step2 schema
│   │   │   ├── types/
│   │   │   │   └── temple-registration.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── dashboard/                              # ROLE-AWARE DASHBOARDS
│   │   │   ├── president/
│   │   │   │   ├── PresidentDashboardPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── TempleOverviewCard.tsx
│   │   │   │       ├── CourseStatsWidget.tsx
│   │   │   │       ├── ExaminerAssignmentSummary.tsx
│   │   │   │       └── RecentActivityFeed.tsx
│   │   │   ├── vice-president/
│   │   │   │   ├── VicePresidentDashboardPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── StudentProgressWidget.tsx
│   │   │   │       └── PendingApprovalsCard.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── SystemStatsGrid.tsx         # Total students, exams, certs, courses
│   │   │   │       ├── CourseEnrollmentChart.tsx
│   │   │   │       ├── ExamSubmissionSummary.tsx
│   │   │   │       └── TopCoursesWidget.tsx
│   │   │   ├── examiner/
│   │   │   │   ├── ExaminerDashboardPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── AssignedStudentsWidget.tsx
│   │   │   │       └── PendingEvaluationsCard.tsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboardPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── EnrolledCoursesWidget.tsx
│   │   │   │       ├── CourseProgressBar.tsx
│   │   │   │       ├── UpcomingExamsWidget.tsx
│   │   │   │       └── MyCertificatesWidget.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboard.ts                 # Role-resolved dashboard data fetch
│   │   │   ├── api/
│   │   │   │   └── dashboard.service.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── course-management/                      # ADMIN: COURSE MANAGEMENT
│   │   │   ├── pages/
│   │   │   │   ├── CourseListPage.tsx              # All courses with filters
│   │   │   │   ├── CreateCoursePage.tsx            # Add Course form
│   │   │   │   ├── EditCoursePage.tsx
│   │   │   │   └── CourseDetailPage.tsx            # Admin detail: lessons, materials, exams
│   │   │   ├── components/
│   │   │   │   ├── CourseForm.tsx                  # Course name, type (free/paid), description
│   │   │   │   ├── CourseTable.tsx                 # DataTable of all courses
│   │   │   │   ├── LessonManager.tsx               # Add/edit/reorder lessons per course
│   │   │   │   ├── LessonForm.tsx
│   │   │   │   ├── StudyMaterialUpload.tsx         # PDF/video upload per lesson
│   │   │   │   ├── CourseLevelBadge.tsx            # Beginner / Intermediate / Advanced
│   │   │   │   └── CourseStatusToggle.tsx          # Active / Inactive toggle
│   │   │   ├── hooks/
│   │   │   │   ├── useCourseList.ts
│   │   │   │   ├── useCourseForm.ts
│   │   │   │   └── useLessonManager.ts
│   │   │   ├── api/
│   │   │   │   └── course.service.ts               # CRUD /api/courses, /api/lessons
│   │   │   ├── store/
│   │   │   │   └── courseSlice.ts
│   │   │   ├── schemas/
│   │   │   │   └── course.schema.ts
│   │   │   ├── types/
│   │   │   │   └── course.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── student-portal/                         # STUDENT: MY LEARNING PORTAL
│   │   │   ├── pages/
│   │   │   │   ├── MyCoursesPage.tsx               # Enrolled + Completed tabs
│   │   │   │   ├── CourseViewPage.tsx              # Course page: lessons + materials
│   │   │   │   ├── LessonPlayerPage.tsx            # Video/text lesson viewer
│   │   │   │   └── MyProfilePage.tsx               # Student profile edit
│   │   │   ├── components/
│   │   │   │   ├── EnrolledCourseCard.tsx
│   │   │   │   ├── CourseProgressTracker.tsx       # Progress % per course
│   │   │   │   ├── LessonList.tsx                  # Sidebar lesson nav
│   │   │   │   ├── LessonContent.tsx               # Renders text/video content
│   │   │   │   ├── StudyMaterialsList.tsx          # Downloadable materials list
│   │   │   │   └── CourseEnrollButton.tsx          # Free (enroll) / Paid (payment gate)
│   │   │   ├── hooks/
│   │   │   │   ├── useMyEnrollments.ts
│   │   │   │   ├── useCourseProgress.ts
│   │   │   │   └── useLessonPlayer.ts
│   │   │   ├── api/
│   │   │   │   └── student-portal.service.ts       # /api/enrollments, /api/progress
│   │   │   ├── types/
│   │   │   │   └── student-portal.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── student-management/                     # ADMIN: STUDENT MANAGEMENT
│   │   │   ├── pages/
│   │   │   │   ├── StudentListPage.tsx             # All students — DataTable
│   │   │   │   └── StudentProfilePage.tsx          # Individual student view
│   │   │   ├── components/
│   │   │   │   ├── StudentTable.tsx
│   │   │   │   ├── StudentProfileCard.tsx
│   │   │   │   ├── StudentStatusBadge.tsx          # ACTIVE / INACTIVE
│   │   │   │   ├── AssignExaminerButton.tsx
│   │   │   │   └── StudentFilterBar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStudentList.ts
│   │   │   │   └── useStudentProfile.ts
│   │   │   ├── api/
│   │   │   │   └── student-management.service.ts
│   │   │   ├── types/
│   │   │   │   └── student.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── exam-management/                        # EXAM MODULE (student + admin + examiner)
│   │   │   ├── pages/
│   │   │   │   ├── OnlineExamPage.tsx              # Student: timed MCQ exam
│   │   │   │   ├── OfflineExamUploadPage.tsx       # Student: upload answer sheet PDF
│   │   │   │   ├── ExamResultPage.tsx              # Student: view results
│   │   │   │   ├── AdminExamListPage.tsx           # Admin: all exams
│   │   │   │   ├── CreateExamPage.tsx              # Admin: create exam + questions
│   │   │   │   └── ExamSubmissionsPage.tsx         # Admin: all offline submissions
│   │   │   ├── components/
│   │   │   │   ├── online/
│   │   │   │   │   ├── ExamTimer.tsx               # Countdown + auto-submit on expiry
│   │   │   │   │   ├── QuestionCard.tsx            # Single MCQ question display
│   │   │   │   │   ├── QuestionNavigator.tsx       # Grid of question numbers
│   │   │   │   │   ├── ExamProgressBar.tsx
│   │   │   │   │   └── ExamSubmitConfirmModal.tsx
│   │   │   │   ├── offline/
│   │   │   │   │   ├── AnswerSheetUpload.tsx       # PDF upload, max 10MB
│   │   │   │   │   └── UploadConfirmation.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── ExamForm.tsx                # Create/edit exam metadata
│   │   │   │   │   ├── QuestionBuilder.tsx         # Add MCQ questions + options
│   │   │   │   │   └── ExamSubmissionsTable.tsx
│   │   │   │   └── ResultCard.tsx                  # Score, pass/fail, remarks
│   │   │   ├── hooks/
│   │   │   │   ├── useOnlineExam.ts                # Timer, answer state, auto-submit
│   │   │   │   ├── useExamSubmit.ts
│   │   │   │   ├── useOfflineUpload.ts
│   │   │   │   └── useExamResult.ts
│   │   │   ├── api/
│   │   │   │   └── exam.service.ts                 # /api/exams, /api/submissions
│   │   │   ├── store/
│   │   │   │   └── examSlice.ts                    # timer, currentQuestion, answers map
│   │   │   ├── schemas/
│   │   │   │   └── exam.schema.ts
│   │   │   ├── types/
│   │   │   │   └── exam.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── examiner/                               # EXAMINER PORTAL
│   │   │   ├── pages/
│   │   │   │   ├── ExaminerDashboardPage.tsx
│   │   │   │   ├── AssignedStudentsPage.tsx        # List of assigned students
│   │   │   │   ├── StudentExamViewPage.tsx         # Student's submitted answer sheet
│   │   │   │   └── EvaluationPage.tsx             # Add marks + remarks + approve
│   │   │   ├── components/
│   │   │   │   ├── AssignedStudentTable.tsx
│   │   │   │   ├── AnswerSheetViewer.tsx           # PDF viewer for offline submissions
│   │   │   │   ├── EvaluationForm.tsx              # Marks input, remarks, approve button
│   │   │   │   └── EvaluationStatusBadge.tsx       # Pending / Evaluated / Approved
│   │   │   ├── hooks/
│   │   │   │   ├── useAssignedStudents.ts
│   │   │   │   └── useEvaluation.ts
│   │   │   ├── api/
│   │   │   │   └── examiner.service.ts             # /api/examiner/students, /evaluations
│   │   │   ├── types/
│   │   │   │   └── examiner.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── examiner-management/                    # ADMIN: EXAMINER MANAGEMENT
│   │   │   ├── pages/
│   │   │   │   ├── ExaminerListPage.tsx
│   │   │   │   ├── CreateExaminerPage.tsx          # Role = EXAMINER, assign privilege
│   │   │   │   └── AssignStudentsPage.tsx          # Map students → examiner
│   │   │   ├── components/
│   │   │   │   ├── ExaminerTable.tsx
│   │   │   │   ├── ExaminerForm.tsx
│   │   │   │   └── StudentAssignmentModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useExaminerManagement.ts
│   │   │   ├── api/
│   │   │   │   └── examiner-management.service.ts
│   │   │   ├── schemas/
│   │   │   │   └── examiner.schema.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── certificate/                            # CERTIFICATE MODULE
│   │   │   ├── pages/
│   │   │   │   ├── MyCertificatesPage.tsx          # Student: list + download
│   │   │   │   └── AdminCertificatesPage.tsx       # Admin: generate + manage
│   │   │   ├── components/
│   │   │   │   ├── CertificateCard.tsx             # Preview card per certificate
│   │   │   │   ├── CertificateViewer.tsx           # Full-screen PDF view
│   │   │   │   ├── DownloadCertificateButton.tsx
│   │   │   │   └── GenerateCertificateModal.tsx    # Admin: trigger generation
│   │   │   ├── hooks/
│   │   │   │   ├── useMyCertificates.ts
│   │   │   │   └── useCertificateGenerate.ts
│   │   │   ├── api/
│   │   │   │   └── certificate.service.ts          # /api/certificates/:id/download
│   │   │   ├── types/
│   │   │   │   └── certificate.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── rbac/                                   # RBAC MODULE
│   │   │   ├── pages/
│   │   │   │   ├── RoleListPage.tsx                # Admin: view all roles
│   │   │   │   ├── PrivilegeSetupPage.tsx          # Admin: create privilege sets
│   │   │   │   └── RolePermissionsPage.tsx         # Admin: manage role_permissions matrix
│   │   │   ├── components/
│   │   │   │   ├── RoleTable.tsx
│   │   │   │   ├── PermissionMatrix.tsx            # Module × Action grid (canView/Create/Edit)
│   │   │   │   └── FieldAccessEditor.tsx           # Field-level: READ_ONLY/EDITABLE/HIDDEN
│   │   │   ├── hooks/
│   │   │   │   └── useRBACAdmin.ts
│   │   │   ├── api/
│   │   │   │   └── rbac.service.ts                 # /api/roles, /api/role-permissions
│   │   │   ├── types/
│   │   │   │   └── rbac.types.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── notifications/                          # NOTIFICATION MODULE
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell.tsx            # TopNav bell icon + badge count
│   │   │   │   ├── NotificationDropdown.tsx        # Dropdown list of recent notifs
│   │   │   │   └── NotificationItem.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useNotifications.ts             # Poll / websocket for new notifs
│   │   │   ├── api/
│   │   │   │   └── notification.service.ts
│   │   │   ├── store/
│   │   │   │   └── notificationSlice.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── reports/                                # ADMIN: REPORTS & ANALYTICS
│   │   │   ├── pages/
│   │   │   │   └── ReportsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CourseEnrollmentReport.tsx
│   │   │   │   ├── ExamResultsReport.tsx
│   │   │   │   ├── CertificateIssuanceReport.tsx
│   │   │   │   └── ExportReportButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useReports.ts
│   │   │   ├── api/
│   │   │   │   └── reports.service.ts
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   └── support/                                # SUPPORT / HELP
│   │       ├── pages/
│   │       │   ├── SupportPage.tsx
│   │       │   └── FAQPage.tsx
│   │       ├── components/
│   │       │   ├── SupportForm.tsx
│   │       │   └── FAQAccordion.tsx
│   │       └── index.ts
│   │
│   │
│   ├── shared/                                     # ══ SHARED REUSABLE LAYER ══
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/                                 # Primitive design system atoms
│   │   │   │   ├── Button.tsx                      # variants: primary/secondary/ghost/danger
│   │   │   │   ├── Input.tsx                       # text, password (toggle), number
│   │   │   │   ├── Select.tsx                      # single/multi select
│   │   │   │   ├── Textarea.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── RadioGroup.tsx
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   ├── PhoneInput.tsx                  # country code + number + validation
│   │   │   │   ├── Modal.tsx                       # Portal-based modal with backdrop
│   │   │   │   ├── Drawer.tsx                      # Slide-in panel (right/left)
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Accordion.tsx                   # Used in president/VP detail sections
│   │   │   │   ├── Badge.tsx                       # status badges: ACTIVE, PENDING, FREE, PAID
│   │   │   │   ├── Avatar.tsx                      # initials or photo
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Divider.tsx
│   │   │   │
│   │   │   ├── form/                               # Form composition system
│   │   │   │   ├── FormBuilder.tsx                 # Config-driven form renderer
│   │   │   │   ├── FieldWrapper.tsx                # Label + error + RBAC field-level gating
│   │   │   │   ├── FormSection.tsx                 # Collapsible accordion section wrapper
│   │   │   │   ├── DependentSelect.tsx             # Country → State → City cascade
│   │   │   │   ├── FamilyMembersForm.tsx           # Dynamic add/remove family rows
│   │   │   │   └── FormStepper.tsx                 # Multi-step wizard shell + indicator
│   │   │   │
│   │   │   ├── table/                              # Enterprise data table system
│   │   │   │   ├── DataTable.tsx                   # Sortable, filterable, server-side
│   │   │   │   ├── TablePagination.tsx
│   │   │   │   ├── TableFilterBar.tsx
│   │   │   │   ├── TableActionMenu.tsx             # Row-level actions (edit, delete, view)
│   │   │   │   ├── TableColumnConfig.tsx           # Show/hide columns toggle
│   │   │   │   └── TableExportButton.tsx           # CSV / Excel export
│   │   │   │
│   │   │   ├── layout/                             # App shell layout components
│   │   │   │   ├── PageShell.tsx                   # Sidebar + TopNav + main content wrapper
│   │   │   │   ├── Sidebar.tsx                     # RBAC-filtered nav menu
│   │   │   │   ├── SidebarNavItem.tsx
│   │   │   │   ├── TopNavbar.tsx                   # Search, NotificationBell, UserMenu
│   │   │   │   ├── UserMenu.tsx                    # Avatar + role + logout
│   │   │   │   ├── BreadcrumbNav.tsx
│   │   │   │   └── PageHeader.tsx                  # Page title + action buttons
│   │   │   │
│   │   │   ├── feedback/                           # User feedback components
│   │   │   │   ├── Toast.tsx                       # Success / Error / Warning toasts
│   │   │   │   ├── ToastContainer.tsx
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── EmptyState.tsx                  # "No data found" illustration
│   │   │   │   ├── ConfirmDialog.tsx               # "Are you sure?" modal
│   │   │   │   └── FullPageLoader.tsx
│   │   │   │
│   │   │   ├── file/                               # File upload/display system
│   │   │   │   ├── FileUpload.tsx                  # Drag-drop, type+size validation, progress
│   │   │   │   ├── FilePreview.tsx                 # Image thumb or PDF icon
│   │   │   │   ├── PDFViewer.tsx                   # In-browser PDF viewer
│   │   │   │   └── FileDownloadButton.tsx
│   │   │   │
│   │   │   └── rbac/                               # RBAC gating components
│   │   │       ├── RoleGuard.tsx                   # <RoleGuard roles={["PRESIDENT"]}> wrapper
│   │   │       ├── PermissionGate.tsx              # <PermissionGate moduleId featureId action>
│   │   │       └── FieldAccessGate.tsx             # READ_ONLY / HIDDEN / EDITABLE auto-apply
│   │   │
│   │   ├── hooks/                                  # Generic reusable hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useFileUpload.ts                    # Shared file upload logic + progress
│   │   │   ├── useCountdown.ts                     # Exam timer / OTP resend timer
│   │   │   ├── useToast.ts                         # Programmatic toast trigger
│   │   │   ├── useConfirm.ts                       # Programmatic confirm dialog
│   │   │   └── useMediaQuery.ts                    # Responsive breakpoint detection
│   │   │
│   │   ├── utils/                                  # Pure utility functions
│   │   │   ├── formatDate.ts
│   │   │   ├── formatFileSize.ts
│   │   │   ├── maskIdentityId.ts                   # Mask Aadhaar: XXXX-XXXX-1234
│   │   │   ├── generateStudentId.ts
│   │   │   ├── downloadFile.ts                     # Trigger browser download
│   │   │   ├── parseApiError.ts                    # Extract user-friendly error message
│   │   │   └── cn.ts                               # className merge util (clsx + twMerge)
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.constants.ts                  # PRESIDENT | VP | ADMIN | EXAMINER | STUDENT
│   │   │   ├── routes.constants.ts                 # All route path strings
│   │   │   ├── regex.constants.ts                  # GSTN, PAN, Aadhaar, mobile regexes
│   │   │   ├── fileTypes.constants.ts              # Allowed MIME types per upload context
│   │   │   └── api.constants.ts                    # API endpoint strings
│   │   │
│   │   └── types/                                  # Global shared TypeScript types
│   │       ├── api-response.types.ts               # ApiResponse<T>, PaginatedResponse<T>
│   │       ├── user.types.ts                       # User, Role, UserRole
│   │       ├── file.types.ts                       # FileMetadata
│   │       └── common.types.ts                     # SelectOption, PaginationParams
│   │
│   │
│   ├── core/                                       # ══ FRAMEWORK-LEVEL CONCERNS ══
│   │   │
│   │   ├── api/
│   │   │   ├── client.ts                           # Axios instance: baseURL, timeout
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts             # Inject JWT on every request
│   │   │   │   ├── refresh.interceptor.ts          # 401 → silent token refresh
│   │   │   │   └── error.interceptor.ts            # 403 RBAC deny, network error handler
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── tokenManager.ts                     # In-memory token store (no localStorage)
│   │   │   ├── sessionManager.ts                   # tokenVersion, expiry tracking
│   │   │   └── authGuard.ts                        # isAuthenticated() check util
│   │   │
│   │   ├── rbac/
│   │   │   ├── rbacEngine.ts                       # checkPermission(moduleId, featureId, action)
│   │   │   ├── fieldAccessResolver.ts              # getFieldAccess(moduleId, fieldName) → enum
│   │   │   ├── menuFilter.ts                       # Filter sidebar nav items by role
│   │   │   └── rbac.constants.ts                   # Actions: CREATE READ UPDATE DELETE APPROVE
│   │   │
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx                    # Hydrates auth state on app load
│   │   │   ├── RBACProvider.tsx                    # Fetches + provides permissions
│   │   │   └── QueryProvider.tsx                   # TanStack Query client setup
│   │   │
│   │   └── error/
│   │       ├── GlobalErrorHandler.ts
│   │       └── httpErrorMessages.ts                # HTTP status → user message map
│   │
│   │
│   ├── infrastructure/                             # ══ EXTERNAL INTEGRATIONS ══
│   │   ├── storage/
│   │   │   ├── localStorage.ts                     # Type-safe localStorage wrapper
│   │   │   └── sessionStorage.ts
│   │   ├── analytics/
│   │   │   └── analytics.ts                        # Google Analytics / custom events
│   │   └── sentry/
│   │       └── sentry.ts                           # Error monitoring setup
│   │
│   │
│   ├── routes/                                     # ══ ROUTING ══
│   │   ├── AppRouter.tsx                           # Root router: public + protected routes
│   │   ├── ProtectedRoute.tsx                      # Redirect to /login if not authenticated
│   │   ├── RoleRoute.tsx                           # Redirect to /unauthorized if wrong role
│   │   ├── routes.config.ts                        # Central lazy-loaded route registry
│   │   └── UnauthorizedPage.tsx
│   │
│   │
│   ├── store/                                      # ══ REDUX TOOLKIT ROOT STORE ══
│   │   ├── index.ts                                # configureStore, export RootState
│   │   ├── rootReducer.ts                          # combineReducers from all modules
│   │   └── middleware.ts                           # logger, thunk, serializable check
│   │
│   │
│   ├── styles/                                     # ══ GLOBAL STYLES ══
│   │   ├── globals.css                             # CSS reset + base typography
│   │   ├── variables.css                           # Design tokens: colors, spacing, radii
│   │   ├── themes/
│   │   │   ├── iskcon-theme.css                    # ISKCON brand colors (saffron, gold, deep blue)
│   │   │   └── dark-theme.css
│   │   └── animations.css
│   │
│   │
│   ├── config/
│   │   ├── env.ts                                  # Typed env variable access (import.meta.env)
│   │   ├── feature-flags.ts                        # Toggle features without redeploy
│   │   └── app.config.ts                           # App-level config (pagination defaults, etc.)
│   │
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── iskcon-logo.png
│   │   │   └── hero-bg.jpg
│   │   ├── icons/                                  # SVG icon components
│   │   └── fonts/
│   │
│   │
│   └── tests/                                      # ══ TEST UTILITIES ══
│       ├── setup.ts                                # vitest + testing-library config
│       ├── mocks/
│       │   ├── handlers/                           # MSW request handlers per module
│       │   │   ├── auth.handlers.ts
│       │   │   ├── temple.handlers.ts
│       │   │   └── exam.handlers.ts
│       │   └── server.ts                           # MSW server setup
│       └── utils/
│           ├── renderWithProviders.tsx             # Render with Redux + Query + Router
│           └── testFactories.ts                    # Mock data factories per entity
│
│
├── .env                                            # VITE_API_BASE_URL etc.
├── .env.example
├── vite.config.ts                                  # Aliases: @modules, @shared, @core, @store
├── tsconfig.json
├── tsconfig.paths.json                             # Path aliases for TypeScript
├── tailwind.config.ts                              # ISKCON custom color tokens
├── eslint.config.ts
├── prettier.config.ts
├── package.json
└── README.md