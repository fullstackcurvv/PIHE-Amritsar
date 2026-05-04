import { useState } from 'react'
import { useNavigate } from 'react-router'
import { UserCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Stepper } from '@/components/temple/Stepper'
import { TempleFormInput } from '@/components/temple/FormInput'
import { TempleFileUpload } from '@/components/temple/FileUpload'
import { useTempleFormContext } from '@/context/TempleFormContext'

export default function PresidentDetailsStep() {
  const navigate = useNavigate()
  const { formData, updatePresident } = useTempleFormContext()
  const [localData, setLocalData] = useState(formData.president)

  const handleChange = (field: string, value: string | boolean) =>
    setLocalData((prev) => ({ ...prev, [field]: value }))

  const handleVerifyMobile = () => {
    if (localData.mobile.length === 10) {
      handleChange('mobileVerified', true)
      toast.success('Mobile number verified successfully!')
    } else {
      toast.error('Please enter a valid 10-digit mobile number')
    }
  }

  const handleBack = () => navigate('/temple-registration')

  const handleNext = () => {
    updatePresident(localData)
    navigate('/temple-registration/vice-president')
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={2} />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#E8720C]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">President Details</h2>
          </div>

          <TempleFileUpload
            label="Upload Photo *"
            preview
            value={localData.photo}
            onChange={(file) => handleChange('photo', file ?? '')}
          />

          <TempleFormInput
            label="Name *"
            value={localData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
          />

          <TempleFormInput
            label="Mobile Number *"
            value={localData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            suffix={localData.mobileVerified ? '✓ Verified' : 'Verify'}
            onSuffixClick={handleVerifyMobile}
          />

          <TempleFormInput
            label="PAN Number *"
            value={localData.pan}
            onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
            placeholder="Enter PAN number"
            maxLength={10}
          />

          <TempleFormInput
            label="Aadhar Card Number *"
            value={localData.aadhar}
            onChange={(e) => handleChange('aadhar', e.target.value)}
            placeholder="Enter 12-digit Aadhar number"
            maxLength={12}
          />

          <TempleFormInput
            label="Google Email ID *"
            type="email"
            value={localData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
          />

          <TempleFileUpload
            label="Upload ID Card *"
            preview
            value={localData.idCard}
            onChange={(file) => handleChange('idCard', file ?? '')}
          />

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-2 bg-[#E8720C] text-white rounded-md hover:bg-[#c4610a] transition-colors font-medium text-sm"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
