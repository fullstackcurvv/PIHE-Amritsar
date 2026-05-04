export type QuestionType = 'mcq' | 'short' | 'long'

export interface Option {
  _id: string
  text: string
}

export interface Question {
  _id: string
  text: string
  type: QuestionType
  options?: Option[]
  marks: number
}

export interface Exam {
  _id: string
  title: string
  course: string
  courseTitle?: string
  duration: number     // minutes
  totalMarks: number
  passingMarks: number
  questions: Question[]
  instructions?: string
  isActive: boolean
}

export interface Answer {
  questionId: string
  selectedOption?: string
  answerText?: string
}

export interface Submission {
  _id: string
  exam: string
  student: string
  course: string
  answers: Answer[]
  type: 'online' | 'offline'
  status: 'pending' | 'evaluated'
  submittedAt: string
  paperUrl?: string
}

// ── Populated types used by the Examiner Portal ──────────────────────────────

/** A question as returned by the backend (uses questionText, not text) */
export interface BackendQuestion {
  _id: string
  questionText: string
  type: QuestionType
  options: string[]
  correctAnswer: string | null
  marks: number
}

/** An exam as returned by the backend (questions use BackendQuestion shape) */
export interface PopulatedExam {
  _id: string
  title: string
  totalMarks: number
  passingMarks: number
  duration: number
  questions: BackendQuestion[]
}

export interface StudentSummary {
  _id: string
  name: string
  studentId: string
  email: string
  phone?: string
  avatar?: string
}

export interface CourseSummary {
  _id: string
  title: string
}

/** Full populated submission returned by GET /submissions/:id */
export interface ExaminerSubmission {
  _id: string
  student: StudentSummary
  exam: PopulatedExam
  course: CourseSummary
  answers: Answer[]
  type: 'online' | 'offline'
  status: 'pending' | 'evaluated' | 'approved'
  submittedAt: string
  uploadedFile?: string | null
  assignedExaminer?: string
}

/** Row shape returned by GET /submissions/assigned (partially populated) */
export interface AssignedSubmission {
  _id: string
  student: StudentSummary
  exam: { _id: string; title: string; totalMarks: number; passingMarks: number }
  course: CourseSummary
  type: 'online' | 'offline'
  status: 'pending' | 'evaluated' | 'approved'
  submittedAt: string
  uploadedFile?: string | null
}

export interface Result {
  _id: string
  student: string
  exam: string
  course: string
  courseTitle?: string
  obtainedMarks: number
  totalMarks: number
  percentage: number
  status: 'pass' | 'fail' | 'pending'
  remarks?: string
  evaluatedAt?: string
  examinerName?: string
}

export interface Certificate {
  _id: string
  student: string
  course: string
  courseTitle: string
  certId: string
  issuedAt: string
  thumbnailUrl?: string
  pdfUrl?: string
}
