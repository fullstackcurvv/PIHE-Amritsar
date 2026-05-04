import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, User, Lock, GraduationCap, Copy, CheckCheck, Save } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import api from '@/services/api'

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
})

// Password form schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null)
  const [copied, setCopied] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' },
  })

  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onProfileSave = async (data: ProfileFormData) => {
    try {
      const res = await api.patch('/auth/profile', data)
      if (user) setAuth(res.data.data, useAuthStore.getState().accessToken ?? '')
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch {
      // silently fail for demo
    }
  }

  const onPasswordChange = async (data: PasswordFormData) => {
    setPasswordError(null)
    try {
      await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setPasswordSuccess(true)
      resetPw()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch {
      setPasswordError('Incorrect current password. Please try again.')
    }
  }

  const copyStudentId = async () => {
    if (!user?.studentId) return
    await navigator.clipboard.writeText(user.studentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Cinzel, serif' }}>
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar + Student ID */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={36} style={{ color: '#E8720C' }} />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md"
              style={{ backgroundColor: '#E8720C' }}
            >
              <Camera size={14} className="text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Student ID card */}
      {user?.studentId && (
        <div
          className="rounded-2xl p-5 border"
          style={{ backgroundColor: '#FDE8D8', borderColor: '#E8720C20' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#E8720C' }}
              >
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Your Student ID</p>
                <p
                  className="text-xl font-bold tracking-widest"
                  style={{ fontFamily: 'Cinzel, serif', color: '#E8720C' }}
                >
                  {user.studentId}
                </p>
              </div>
            </div>
            <button
              onClick={copyStudentId}
              className="p-2.5 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Copy student ID"
            >
              {copied ? (
                <CheckCheck size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Keep this ID safe — you'll need it for exams and certificates.
          </p>
        </div>
      )}

      {/* Personal info form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <User size={18} style={{ color: '#E8720C' }} />
          Personal Information
        </h2>

        <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your full name"
            error={profileErrors.name?.message}
            required
            {...regProfile('name')}
          />
          <Input
            label="Email Address"
            type="email"
            value={user?.email ?? ''}
            disabled
            hint="Email cannot be changed"
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            error={profileErrors.phone?.message}
            {...regProfile('phone')}
          />

          <div className="flex items-center gap-3">
            <Button type="submit" loading={profileSubmitting} icon={<Save size={16} />} size="md">
              Save Changes
            </Button>
            {profileSuccess && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCheck size={14} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <Lock size={18} style={{ color: '#E8720C' }} />
          Change Password
        </h2>

        {passwordSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700 mb-4">
            <CheckCheck size={14} /> Password changed successfully!
          </div>
        )}
        {passwordError && (
          <div className="p-3 bg-red-50 rounded-xl text-sm text-red-600 mb-4">{passwordError}</div>
        )}

        <form onSubmit={handlePwSubmit(onPasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            error={pwErrors.currentPassword?.message}
            required
            {...regPw('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={pwErrors.newPassword?.message}
            hint="Min 8 characters, 1 uppercase, 1 number"
            required
            {...regPw('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={pwErrors.confirmPassword?.message}
            required
            {...regPw('confirmPassword')}
          />
          <Button type="submit" loading={pwSubmitting} variant="outline" size="md">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}
