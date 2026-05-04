import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Stepper } from '@/components/temple/Stepper'
import { FormField } from '@/components/temple/FormField'
import { TempleFileUpload } from '@/components/temple/FileUpload'
import { useTempleFormContext, type TempleData } from '@/context/TempleFormContext'

const COUNTRIES = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
].map(s => ({ value: s, label: s }))

type Errors = Partial<Record<keyof TempleData, string>>

export default function TempleDetailsStep() {
  const navigate = useNavigate()
  const { formData, updateTemple } = useTempleFormContext()
  const [local, setLocal] = useState<TempleData>(formData.temple)
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: keyof TempleData, val: string | null) =>
    setLocal(prev => ({ ...prev, [field]: val }))

  const validate = (): boolean => {
    const e: Errors = {}
    if (!local.templeName.trim()) e.templeName = 'Temple name is required'
    if (!local.gstn.trim()) {
      e.gstn = 'GSTN is required'
    } else if (!/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(local.gstn.trim())) {
      e.gstn = 'Invalid GSTN format (e.g. 22AAAAA0000A1Z5)'
    }
    if (!local.templeAddress1.trim()) e.templeAddress1 = 'Address Line 1 is required'
    if (!local.country) e.country = 'Country is required'
    if (!local.state) e.state = 'State is required'
    if (!local.city.trim()) e.city = 'City is required'
    if (!local.pincode.trim()) {
      e.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(local.pincode.trim())) {
      e.pincode = 'Pincode must be 6 digits'
    }
    if (!local.templeLogo) e.templeLogo = 'Temple logo is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    updateTemple(local)
    navigate('/temple-registration/president')
  }

  return (
    <div className="py-6 px-4 bg-[#FFFAF5] min-h-[calc(100vh-8rem)]">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={1} />

        <div className="space-y-5">

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}

          <div className="bg-orange-50 border-l-4 border-[#E8720C] p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Temple Details</h3>
            <p className="text-sm text-gray-600">
              Please provide basic information about the temple/organization.
            </p>
          </div>

          {/* Temple Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Temple Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Temple/Organization Name" required
                value={local.templeName}
                onChange={v => set('templeName', v)}
                placeholder="Enter temple name"
                error={errors.templeName}
              />
              <FormField
                label="GSTN" required
                value={local.gstn}
                onChange={v => set('gstn', v.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                error={errors.gstn}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Address Information</h4>
            <FormField
              label="Address Line 1" required
              value={local.templeAddress1}
              onChange={v => set('templeAddress1', v)}
              placeholder="Building No., Street Name"
              error={errors.templeAddress1}
            />
            <FormField
              label="Address Line 2"
              value={local.templeAddress2}
              onChange={v => set('templeAddress2', v)}
              placeholder="Landmark, Area (optional)"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Country" required variant="select"
                value={local.country}
                onChange={v => set('country', v)}
                options={COUNTRIES}
                error={errors.country}
              />
              <FormField
                label="State" required variant="select"
                value={local.state}
                onChange={v => set('state', v)}
                options={INDIAN_STATES}
                error={errors.state}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="City" required
                value={local.city}
                onChange={v => set('city', v)}
                placeholder="Enter city"
                error={errors.city}
              />
              <FormField
                label="Pincode" required
                value={local.pincode}
                onChange={v => set('pincode', v)}
                placeholder="400001"
                error={errors.pincode}
              />
            </div>
          </div>

          {/* Temple Logo */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Temple Logo</h4>
            <TempleFileUpload
              label="Upload Logo" required
              accept="image/*" maxSizeMB={5}
              value={local.templeLogo}
              onChange={f => set('templeLogo', f)}
              helperText="PNG, JPG up to 5MB"
              error={errors.templeLogo}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pb-4">
            <button
              disabled
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed text-sm"
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
