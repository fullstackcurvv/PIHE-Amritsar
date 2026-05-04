import { useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useExamStore } from '@/store/examStore'

interface ExamTimerProps {
  onExpire: () => void
}

export function ExamTimer({ onExpire }: ExamTimerProps) {
  const { timeLeft, decrementTimer } = useExamStore()

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }
    const interval = setInterval(() => {
      decrementTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, decrementTimer, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft < 300  // last 5 minutes
  const isCritical = timeLeft < 60  // last 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg transition-colors ${
        isCritical
          ? 'bg-red-100 text-red-600 animate-pulse'
          : isWarning
          ? 'bg-orange-100 text-orange-600'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      <Clock size={18} />
      <span style={{ fontFamily: 'Cinzel, serif' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
