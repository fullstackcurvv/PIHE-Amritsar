import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input }  from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

const registerSchema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Invalid email address'),
  phone:           z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number').optional().or(z.literal('')),
  password:        z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Must contain a lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Must contain an uppercase letter')
    .regex(/(?=.*\d)/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path:    ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isLoading, error } = useAuth()
  const [showPw, setShowPw]     = useState(false)
  const [showCPw, setShowCPw]   = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setFormError(null)
    try {
      await registerUser(data)
    } catch (err: unknown) {
      setFormError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#FDE8D8' }}>
            <GraduationCap size={28} style={{ color: '#E8720C' }} />
          </div>
          <h1 className="font-bold text-2xl text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Begin your spiritual learning journey today</p>
        </div>

        {/* Global error */}
        {(formError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {formError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            placeholder="Arjuna Das"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="arjuna@example.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />
          <Input
            label="Phone Number (optional)"
            placeholder="9876543210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min 8 chars, A-Z, a-z, 0-9"
              error={errors.password?.message}
              required
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />
          </div>
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showCPw ? 'text' : 'password'}
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              required
              rightIcon={
                <button type="button" onClick={() => setShowCPw(!showCPw)} className="text-gray-400 hover:text-gray-600">
                  {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" loading={isLoading} className="w-full mt-2" size="lg">
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google OAuth */}
        <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/google`}>
          <Button variant="outline" size="lg" className="w-full gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </a>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#E8720C' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
