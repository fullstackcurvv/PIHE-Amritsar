import api from './api'

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboard = async () => {
  const res = await api.get('/admin/dashboard')
  return res.data.data
}

// ── Students ──────────────────────────────────────────────────────────────────
export const getStudents = async (params?: { search?: string; page?: number; limit?: number }) => {
  const res = await api.get('/admin/students', { params })
  return res.data.data
}

export const toggleStudentStatus = async (id: string) => {
  const res = await api.patch(`/admin/students/${id}/toggle`)
  return res.data.data
}

// ── Examiners ─────────────────────────────────────────────────────────────────
export const getExaminers = async (params?: { search?: string }) => {
  const res = await api.get('/admin/examiners', { params })
  return res.data.data
}

export const createExaminer = async (payload: { name: string; email: string; password: string; phone?: string }) => {
  const res = await api.post('/admin/examiners', payload)
  return res.data.data
}

export const toggleExaminerStatus = async (id: string) => {
  const res = await api.patch(`/admin/examiners/${id}/toggle`)
  return res.data.data
}

// ── Submissions ───────────────────────────────────────────────────────────────
export const getAllSubmissions = async (params?: { status?: string; page?: number; limit?: number }) => {
  const res = await api.get('/admin/submissions', { params })
  return res.data.data
}

export const assignSubmission = async (submissionId: string, examinerId: string) => {
  const res = await api.patch(`/admin/submissions/${submissionId}/assign`, { examinerId })
  return res.data.data
}

// ── Results ───────────────────────────────────────────────────────────────────
export const getAllResults = async (params?: { page?: number; limit?: number }) => {
  const res = await api.get('/admin/results', { params })
  return res.data.data
}

export const getPendingResults = async (params?: { page?: number; limit?: number }) => {
  const res = await api.get('/admin/results/pending', { params })
  return res.data.data
}

export const approveResult = async (resultId: string) => {
  const res = await api.patch(`/admin/results/${resultId}/approve`)
  return res.data.data
}

// ── Certificates ──────────────────────────────────────────────────────────────
export const getAllCertificates = async (params?: { page?: number; limit?: number }) => {
  const res = await api.get('/admin/certificates', { params })
  return res.data.data
}

// ── Reports ───────────────────────────────────────────────────────────────────
export const getReports = async () => {
  const res = await api.get('/admin/reports')
  return res.data.data
}

// ── CSV Export ────────────────────────────────────────────────────────────────
export const exportCSV = async (type: 'students' | 'results' | 'certificates') => {
  const res = await api.get('/admin/export', {
    params: { type },
    responseType: 'blob',
  })
  const url  = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', `${type}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// ── Courses (admin CRUD — reuses course endpoints) ────────────────────────────
export const adminGetCourses = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await api.get('/courses', { params })
  return res.data.data
}

export const adminCreateCourse = async (payload: FormData) => {
  const res = await api.post('/courses', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export const adminUpdateCourse = async (id: string, payload: Record<string, unknown>) => {
  const res = await api.put(`/courses/${id}`, payload)
  return res.data.data
}

export const adminDeleteCourse = async (id: string) => {
  const res = await api.delete(`/courses/${id}`)
  return res.data.data
}

// ── Exams (admin) ─────────────────────────────────────────────────────────────
export const adminGetExams = async () => {
  const res = await api.get('/exams')
  return res.data.data
}

export const adminCreateExam = async (payload: Record<string, unknown>) => {
  const res = await api.post('/exams', payload)
  return res.data.data
}

export const adminUpdateExam = async (id: string, payload: Record<string, unknown>) => {
  const res = await api.put(`/exams/${id}`, payload)
  return res.data.data
}

export const adminDeleteExam = async (id: string) => {
  const res = await api.delete(`/exams/${id}`)
  return res.data.data
}
