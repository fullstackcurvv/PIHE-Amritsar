import { useNavigate } from 'react-router'
import { Edit2, CheckCircle2, FileText } from 'lucide-react'
import { Stepper } from '@/components/temple/Stepper'
import { useTempleFormContext } from '@/context/TempleFormContext'

export default function ReviewSubmitStep() {
  const navigate = useNavigate()
  const { formData } = useTempleFormContext()

  const handleSubmit = () => navigate('/temple-registration/success')
  const handleBack = () => navigate('/temple-registration/vice-president')

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
    </div>
  )

  return (
    <div className="py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={4} />

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>

        <div className="space-y-4">
          {/* ── Temple Details Card ── */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Temple Details</h3>
              <button
                onClick={() => navigate('/temple-registration')}
                className="flex items-center gap-1.5 text-[#E8720C] hover:text-[#c4610a] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
            <div className="h-px bg-gray-200 mb-3" />

            {formData.temple.logo && (
              <div className="mb-3">
                <img
                  src={formData.temple.logo}
                  alt="Temple Logo"
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                />
              </div>
            )}

            <InfoRow label="Temple Name"   value={formData.temple.templeName} />
            <InfoRow label="GSTN Number"   value={formData.temple.gstNumber} />
            <InfoRow label="Address Line 1" value={formData.temple.addressLine1} />
            <InfoRow label="Address Line 2" value={formData.temple.addressLine2} />
            <InfoRow label="City"          value={formData.temple.city} />
            <InfoRow label="State"         value={formData.temple.state} />
            <InfoRow label="Country"       value={formData.temple.country} />
            <InfoRow label="Pin Code"      value={formData.temple.pinCode} />
          </div>

          {/* ── President Details Card ── */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">President Details</h3>
              <button
                onClick={() => navigate('/temple-registration/president')}
                className="flex items-center gap-1.5 text-[#E8720C] hover:text-[#c4610a] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
            <div className="h-px bg-gray-200 mb-3" />

            {formData.president.photo && (
              <div className="mb-3">
                <img
                  src={formData.president.photo}
                  alt="President"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <InfoRow label="Name"   value={formData.president.name} />
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mobile</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{formData.president.mobile || '—'}</span>
                {formData.president.mobileVerified && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <InfoRow label="PAN"    value={formData.president.pan} />
            <InfoRow label="Aadhar" value={formData.president.aadhar} />
            <InfoRow label="Email"  value={formData.president.email} />
            {formData.president.idCard && (
              <div className="flex items-center gap-2 py-1.5">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">ID Card uploaded</span>
              </div>
            )}
          </div>

          {/* ── Vice-President Details Card ── */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Vice-President Details</h3>
              <button
                onClick={() => navigate('/temple-registration/vice-president')}
                className="flex items-center gap-1.5 text-[#E8720C] hover:text-[#c4610a] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
            <div className="h-px bg-gray-200 mb-3" />

            {formData.vicePresident.photo && (
              <div className="mb-3">
                <img
                  src={formData.vicePresident.photo}
                  alt="Vice President"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <InfoRow label="Name"   value={formData.vicePresident.name} />
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mobile</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{formData.vicePresident.mobile || '—'}</span>
                {formData.vicePresident.mobileVerified && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <InfoRow label="PAN"    value={formData.vicePresident.pan} />
            <InfoRow label="Aadhar" value={formData.vicePresident.aadhar} />
            <InfoRow label="Email"  value={formData.vicePresident.email} />
            {formData.vicePresident.idCard && (
              <div className="flex items-center gap-2 py-1.5">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">ID Card uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-[#E8720C] text-white rounded-md hover:bg-[#c4610a] transition-colors font-medium text-sm"
          >
            Submit Registration
          </button>
        </div>
      </div>
    </div>
  )
}
