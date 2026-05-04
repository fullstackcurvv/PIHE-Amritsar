import { create } from 'zustand'
import type { Exam, Answer, Question } from '@/types/exam'

interface ExamState {
  currentExam: Exam | null
  answers: Answer[]
  timeLeft: number          // seconds remaining
  isSubmitted: boolean
  isLoading: boolean

  // Actions
  setExam: (exam: Exam) => void
  setAnswer: (questionId: string, value: string, type: 'mcq' | 'short' | 'long') => void
  decrementTimer: () => void
  submitExam: () => void
  resetExam: () => void
  setLoading: (loading: boolean) => void
}

export const useExamStore = create<ExamState>((set) => ({
  currentExam: null,
  answers: [],
  timeLeft: 0,
  isSubmitted: false,
  isLoading: false,

  setExam: (exam) =>
    set({
      currentExam: exam,
      answers: exam.questions.map((q: Question) => ({ questionId: q._id })),
      timeLeft: exam.duration * 60,
      isSubmitted: false,
    }),

  setAnswer: (questionId, value, type) =>
    set((state) => ({
      answers: state.answers.map((a) =>
        a.questionId === questionId
          ? {
              ...a,
              ...(type === 'mcq' ? { selectedOption: value } : { answerText: value }),
            }
          : a
      ),
    })),

  decrementTimer: () =>
    set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

  submitExam: () => set({ isSubmitted: true }),

  resetExam: () =>
    set({ currentExam: null, answers: [], timeLeft: 0, isSubmitted: false }),

  setLoading: (isLoading) => set({ isLoading }),
}))
