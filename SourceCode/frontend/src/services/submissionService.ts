import api from './api'
import type { AssignedSubmission, ExaminerSubmission } from '@/types/exam'

export interface EvaluatePayload {
  marksObtained: number
  remarks: string
}

/**
 * GET /submissions/assigned
 * Returns all submissions assigned to the authenticated examiner.
 * Pass status='pending'|'evaluated' for filtered views.
 */
export const getAssignedSubmissions = async (
  status?: 'pending' | 'evaluated'
): Promise<AssignedSubmission[]> => {
  const params = status ? { status } : {}
  const res = await api.get('/submissions/assigned', { params })
  return res.data.data
}

/**
 * GET /submissions/:id
 * Returns a fully populated submission (student + exam + course).
 */
export const getSubmissionById = async (id: string): Promise<ExaminerSubmission> => {
  const res = await api.get(`/submissions/${id}`)
  return res.data.data
}

/**
 * PATCH /submissions/:id/evaluate
 * Submits the examiner's marks and remarks.
 */
export const evaluateSubmission = async (
  id: string,
  payload: EvaluatePayload
): Promise<unknown> => {
  const res = await api.patch(`/submissions/${id}/evaluate`, payload)
  return res.data.data
}
