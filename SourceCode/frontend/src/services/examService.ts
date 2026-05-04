import api from './api'
import type { Exam, Answer, Submission } from '@/types/exam'

export const getExamByCourse = async (courseId: string): Promise<Exam> => {
  const res = await api.get(`/exams/course/${courseId}`)
  return res.data.data
}

export const submitExam = async (payload: {
  examId: string
  answers: Answer[]
}): Promise<Submission> => {
  const res = await api.post('/submissions', payload)
  return res.data.data
}

export const uploadOfflinePaper = async (
  examId: string,
  courseId: string,
  file: File
): Promise<Submission> => {
  const formData = new FormData()
  formData.append('examId', examId)
  formData.append('courseId', courseId)
  formData.append('paper', file)
  const res = await api.post('/submissions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export const getMyResults = async () => {
  const res = await api.get('/results/my')
  return res.data.data
}
