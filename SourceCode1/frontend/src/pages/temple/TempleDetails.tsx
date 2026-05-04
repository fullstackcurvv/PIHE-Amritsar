import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Building2 } from 'lucide-react'
import { Stepper } from '@/components/temple/Stepper'
import { TempleFormInput } from '@/components/temple/FormInput'
import { TempleFormSelect } from '@/components/temple/FormSelect'
import { TempleFileUpload } from '@/components/temple/FileUpload'
import { useTempleFormContext } from '@/context/TempleFormContext'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const COUNTRIES = ['India']

export default function TempleDetailsStep() {
  const navigate = useNavigate()
  const { formData, updateTemple } = useTempleFormContext()
  const [localData, setLocalData] = useState(formData.temple)

  const handleChange = (field: string, value: string) =>
    setLocalData((prev) => ({ ...prev, [field]: value }))

  const handleNext = () => {
    updateTemple(localData)
    navigate('/temple-registration/president')
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={1} />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#E8720C]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Temple Basic Details</h2>
          </div>

          <TempleFormInput
            label="Temple Name *"
            value={localData.templeName}
            onChange={(e) => handleChange('templeName', e.target.value)}
            placeholder="Enter temple name"
          />

          <TempleFormInput
            label="GST Number *"
            value={localData.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
            placeholder="Enter GST number"
          />

          <TempleFormInput
            label="Address Line 1 *"
            value={localData.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            placeholder="Enter address line 1"
          />

          <TempleFormInput
            label="Address Line 2"
            value={localData.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            placeholder="Enter address line 2 (optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TempleFormInput
              label="City *"
              value={localData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Enter city"
            />
            <TempleFormSelect
              label="State *"
              options={INDIAN_STATES}
              value={localData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            <TempleFormSelect
              label="Country *"
              options={COUNTRIES}
              value={localData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </div>

          <TempleFormInput
            label="Pin Code *"
            value={localData.pinCode}
            onChange={(e) => handleChange('pinCode', e.target.value)}
            placeholder="Enter pin code"
            maxLength={6}
          />

          <TempleFileUpload
            label="Temple Logo Upload"
            preview
            value={localData.logo}
            onChange={(file) => handleChange('logo', file ?? '')}
          />

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              disabled
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed text-sm"
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
