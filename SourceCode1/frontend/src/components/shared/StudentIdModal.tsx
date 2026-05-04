import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router'
import { GraduationCap, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'

export function StudentIdModal() {
  const { user, showStudentIdModal, setShowStudentIdModal } = useAuthStore()
  const [copied, setCopied] = useState(false)

  if (!showStudentIdModal || !user?.studentId) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(user.studentId!)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDismiss = () => setShowStudentIdModal(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">

        {/* Celebration icon */}
        <div className="text-5xl mb-4">🎉</div>

        <h2 className="font-bold text-2xl text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          Welcome to ISKCON Portal!
        </h2>
        <p className="text-gray-500 text-sm mb-6">Your account has been created successfully.</p>

        {/* Student ID card */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#FDE8D8' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap size={20} style={{ color: '#E8720C' }} />
            <span className="text-sm font-semibold text-gray-700">Your Student ID</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-bold text-3xl tracking-widest" style={{ fontFamily: 'Cinzel, serif', color: '#E8720C' }}>
              {user.studentId}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Copy student ID"
            >
              {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Please save this ID — you'll need it for exams and certificates.
          </p>
        </div>

        <Link to="/student/dashboard" onClick={handleDismiss}>
          <Button variant="primary" size="lg" className="w-full">
            Go to Dashboard →
          </Button>
        </Link>
      </div>
    </div>
  )
}
