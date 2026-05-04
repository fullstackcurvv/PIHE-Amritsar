import { useNavigate } from 'react-router'
import { Edit2, CheckCircle2, FileText, AlertCircle } from 'lucide-react'
import { Stepper } from '@/components/temple/Stepper'
import { useTempleFormContext } from '@/context/TempleFormContext'

export default function ReviewSubmitStep() {
  const navigate = useNavigate()
  const { formData } = useTempleFormContext()
  const { temple, president, vicePresident } = formData

  const handleSubmit = () => navigate('/temple-registration/success')

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value || '—'}</span>
    </div>
  )

  const SectionHeader = ({
    title,
    onEdit,
  }: {
    title: string
    onEdit: () => void
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 text-[#E8720C] hover:text-[#C55E00] transition-colors text-sm"
      >
        <Edit2 className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>
  )

  return (
    <div className="py-6 px-4 bg-[#FFFAF5] min-h-[calc(100vh-8rem)]">
      <div className="max-w-3xl mx-auto">
        <Stepper currentStep={4} />

        <div className="space-y-5">

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
            <p className="text-sm text-gray-600">
              Please review all information before submitting. Use Edit to make corrections.
            </p>
          </div>

          {/* Temple Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SectionHeader title="Temple Details" onEdit={() => navigate('/temple-registration')} />
            <div className="h-px bg-gray-100 mb-4" />

            {temple.templeLogo && (
              <div className="mb-4">
                <img
                  src={temple.templeLogo}
                  alt="Temple Logo"
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                />
              </div>
            )}

            <InfoRow label="Temple Name"    value={temple.templeName} />
            <InfoRow label="GSTN"           value={temple.gstn} />
            <InfoRow label="Address Line 1" value={temple.templeAddress1} />
            {temple.templeAddress2 && <InfoRow label="Address Line 2" value={temple.templeAddress2} />}
            <InfoRow label="City"           value={temple.city} />
            <InfoRow label="State"          value={temple.state} />
            <InfoRow label="Country"        value={temple.country} />
            <InfoRow label="Pincode"        value={temple.pincode} />
          </div>

          {/* President Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SectionHeader title="President Details" onEdit={() => navigate('/temple-registration/president')} />
            <div className="h-px bg-gray-100 mb-4" />

            {president.photo && (
              <div className="mb-4">
                <img
                  src={president.photo}
                  alt="President"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Basic Info</p>
                <InfoRow label="Full Name"     value={president.fullName} />
                <InfoRow label="Date of Birth" value={president.dob} />
                <InfoRow label="Gender"        value={president.gender} />
                <InfoRow label="Father's Name" value={president.fatherName} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Mobile</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{president.mobile || '—'}</span>
                    {president.mobileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                </div>
                <InfoRow label="Email"     value={president.googleEmail} />
                <InfoRow label="Alt Phone" value={president.altPhone} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ID &amp; Documents</p>
              <InfoRow label="ID Type"   value={president.govtIdType} />
              <InfoRow label="ID Number" value={president.govtIdNumber} />
              {president.govtIdFile && (
                <div className="flex items-center gap-2 py-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">ID document uploaded</span>
                </div>
              )}
            </div>

            {(president.initiationName || president.guru || president.yearsWithISKCON) && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ISKCON Info</p>
                <InfoRow label="Initiation Name"      value={president.initiationName} />
                <InfoRow label="Guru"                 value={president.guru} />
                <InfoRow label="Years with ISKCON"    value={president.yearsWithISKCON} />
              </div>
            )}

            {president.familyMembers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Family Members ({president.familyMembers.length})
                </p>
                <div className="space-y-1.5">
                  {president.familyMembers.map((m, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-1.5">
                      <span className="font-medium text-gray-900">{m.name || '—'}</span>
                      <span className="text-gray-500">{m.relation}{m.age ? ` • Age ${m.age}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vice President Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SectionHeader
              title="Vice President Details"
              onEdit={() => navigate('/temple-registration/vice-president')}
            />
            <div className="h-px bg-gray-100 mb-4" />

            {vicePresident.photo && (
              <div className="mb-4">
                <img
                  src={vicePresident.photo}
                  alt="Vice President"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Basic Info</p>
                <InfoRow label="Full Name"     value={vicePresident.fullName} />
                <InfoRow label="Date of Birth" value={vicePresident.dob} />
                <InfoRow label="Gender"        value={vicePresident.gender} />
                <InfoRow label="Father's Name" value={vicePresident.fatherName} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Mobile</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{vicePresident.mobile || '—'}</span>
                    {vicePresident.mobileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                </div>
                <InfoRow label="Email"     value={vicePresident.googleEmail} />
                <InfoRow label="Alt Phone" value={vicePresident.altPhone} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ID &amp; Documents</p>
              <InfoRow label="ID Type"   value={vicePresident.govtIdType} />
              <InfoRow label="ID Number" value={vicePresident.govtIdNumber} />
              {vicePresident.govtIdFile && (
                <div className="flex items-center gap-2 py-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">ID document uploaded</span>
                </div>
              )}
            </div>

            {(vicePresident.initiationName || vicePresident.guru || vicePresident.yearsWithISKCON) && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ISKCON Info</p>
                <InfoRow label="Initiation Name"   value={vicePresident.initiationName} />
                <InfoRow label="Guru"              value={vicePresident.guru} />
                <InfoRow label="Years with ISKCON" value={vicePresident.yearsWithISKCON} />
              </div>
            )}
          </div>

          {/* Processing note */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Once submitted, your registration will be reviewed by the ISKCON team.
              Login credentials will be sent to the registered email addresses within 24–48 hours.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pb-4">
            <button
              onClick={() => navigate('/temple-registration/vice-president')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-[#E8720C] text-white rounded-md hover:bg-[#C55E00] transition-colors font-medium text-sm"
            >
              Submit Registration
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
