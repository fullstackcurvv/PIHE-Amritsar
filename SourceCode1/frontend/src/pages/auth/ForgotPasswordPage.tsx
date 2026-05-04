import { useState } from 'react'
import { Link } from 'react-router'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input }  from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setError(null)
    setLoading(true)
    try {
      // API call would go here — for now simulate success
      await new Promise(r => setTimeout(r, 800))
      setSubmitted(true)
    } catch {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <Link to="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowLeft size={16} />Back to login
        </Link>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h2 className="font-bold text-xl text-gray-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Check Your Email</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
            </p>
            <p className="text-xs text-gray-400">Didn't receive it? Check your spam folder or{' '}
              <button onClick={() => setSubmitted(false)} className="text-[#E8720C] underline">try again</button>.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#FDE8D8' }}>
                <Mail size={28} style={{ color: '#E8720C' }} />
              </div>
              <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Forgot Password?</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="arjuna@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
              />
              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
