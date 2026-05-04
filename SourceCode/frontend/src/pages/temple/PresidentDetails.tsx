import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Stepper } from '@/components/temple/Stepper'
import { PersonForm, validatePerson, type PersonErrors } from '@/components/temple/PersonForm'
import { useTempleFormContext, type PersonData } from '@/context/TempleFormContext'

export default function PresidentDetailsStep() {
  const navigate = useNavigate()
  const { formData, updatePresident } = useTempleFormContext()
  const [local, setLocal] = useState<PersonData>(formData.president)
  const [errors, setErrors] = useState<PersonErrors>({})
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const update = (field: keyof PersonData, val: any) =>
    setLocal(prev => ({ ...prev, [field]: val }))

  const sendOTP = () => {
    if (!local.mobile.trim()) { toast.error('Enter a mobile number first'); return }
    setOtpSent(true)
    toast.info(`OTP sent to ${local.mobile} — use 123456 to verify`)
  }

  const verifyOTP = () => {
    if (otp === '123456') {
      update('mobileVerified', true)
      toast.success('Mobile number verified!')
    } else {
      toast.error('Incorrect OTP. Use 123456 for this demo.')
    }
  }

  const handleNext = () => {
    const e = validatePerson(local)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    updatePresident(local)
    navigate('/temple-registration/vice-president')
  }

  return (
    <div className="py-6 px-4 bg-[#FFFAF5] min-h-[calc(100vh-8rem)]">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={2} />

        <div className="space-y-5">

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}

          <PersonForm
            title="President Details"
            data={local}
            errors={errors}
            otp={otp}
            otpSent={otpSent}
            onChange={update}
            onOtpChange={setOtp}
            onSendOtp={sendOTP}
            onVerifyOtp={verifyOTP}
          />

          <div className="flex justify-between pb-4">
            <button
              onClick={() => navigate('/temple-registration')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-[#E8720C] text-white rounded-md hover:bg-[#C55E00] transition-colors font-medium text-sm"
            >
              Next Step →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
