import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion'
import { FormField } from '@/components/temple/FormField'
import { TempleFileUpload } from '@/components/temple/FileUpload'
import type { PersonData, FamilyMember } from '@/context/TempleFormContext'

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

const GOVT_ID_OPTIONS = [
  { value: 'Aadhaar', label: 'Aadhaar Card' },
  { value: 'PAN', label: 'PAN Card' },
  { value: 'Passport', label: 'Passport' },
  { value: 'Voter ID', label: 'Voter ID' },
]

const RELATION_OPTIONS = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Child', label: 'Child' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Sibling', label: 'Sibling' },
]

export type PersonErrors = Partial<Record<keyof PersonData, string>>

export interface PersonFormProps {
  title: string
  data: PersonData
  errors: PersonErrors
  otp: string
  otpSent: boolean
  onChange: (field: keyof PersonData, value: any) => void
  onOtpChange: (val: string) => void
  onSendOtp: () => void
  onVerifyOtp: () => void
}

export const PersonForm = ({
  title, data, errors, otp, otpSent,
  onChange, onOtpChange, onSendOtp, onVerifyOtp,
}: PersonFormProps) => {
  const addMember = () =>
    onChange('familyMembers', [...data.familyMembers, { name: '', relation: '', age: '' }])

  const removeMember = (i: number) =>
    onChange('familyMembers', data.familyMembers.filter((_, idx) => idx !== i))

  const updateMember = (i: number, field: keyof FamilyMember, val: string) => {
    const members = [...data.familyMembers]
    members[i] = { ...members[i], [field]: val }
    onChange('familyMembers', members)
  }

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border-l-4 border-[#E8720C] p-4 rounded-r-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">Complete all sections. Required fields are marked with *</p>
      </div>

      <Accordion type="multiple" defaultValue={['basic']} className="space-y-3">

        {/* Basic Info */}
        <AccordionItem value="basic" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">Basic Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name" required
                  value={data.fullName} onChange={v => onChange('fullName', v)}
                  placeholder="Enter full name" error={errors.fullName}
                />
                <FormField
                  label="Date of Birth" required type="date"
                  value={data.dob} onChange={v => onChange('dob', v)}
                  error={errors.dob}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Gender" required variant="select"
                  value={data.gender} onChange={v => onChange('gender', v)}
                  options={GENDER_OPTIONS} error={errors.gender}
                />
                <FormField
                  label="Father's Name" required
                  value={data.fatherName} onChange={v => onChange('fatherName', v)}
                  placeholder="Enter father's name" error={errors.fatherName}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Address */}
        <AccordionItem value="address" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">Address Details</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <FormField
                label="Address Line 1" required
                value={data.address1} onChange={v => onChange('address1', v)}
                placeholder="Building No., Street Name" error={errors.address1}
              />
              <FormField
                label="Address Line 2"
                value={data.address2} onChange={v => onChange('address2', v)}
                placeholder="Landmark, Area (optional)"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="State" required
                  value={data.state} onChange={v => onChange('state', v)}
                  placeholder="Enter state" error={errors.state}
                />
                <FormField
                  label="City" required
                  value={data.city} onChange={v => onChange('city', v)}
                  placeholder="Enter city" error={errors.city}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Country"
                  value={data.country} onChange={v => onChange('country', v)}
                  placeholder="Enter country"
                />
                <FormField
                  label="Pincode" required
                  value={data.pincode} onChange={v => onChange('pincode', v)}
                  placeholder="400001" error={errors.pincode}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Contact Info */}
        <AccordionItem value="contact" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">Contact Info</span>
              {data.mobileVerified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <FormField
                label="Mobile Number" required
                value={data.mobile} onChange={v => onChange('mobile', v)}
                placeholder="+91 9876543210" error={errors.mobile}
                disabled={data.mobileVerified}
              />

              {!data.mobileVerified && (
                <div className="flex items-center gap-2 flex-wrap">
                  {!otpSent ? (
                    <button
                      type="button" onClick={onSendOtp}
                      className="px-4 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <>
                      <input
                        type="text" value={otp} onChange={e => onOtpChange(e.target.value)}
                        placeholder="6-digit OTP" maxLength={6}
                        className="w-36 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E8720C]"
                      />
                      <button
                        type="button" onClick={onVerifyOtp}
                        className="px-4 py-1.5 bg-[#E8720C] text-white rounded-md text-sm hover:bg-[#C55E00] transition-colors"
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button" onClick={onSendOtp}
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Resend
                      </button>
                    </>
                  )}
                </div>
              )}

              <FormField
                label="Google Email" required type="email"
                value={data.googleEmail} onChange={v => onChange('googleEmail', v)}
                placeholder="name@temple.org" error={errors.googleEmail}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Identity */}
        <AccordionItem value="identity" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">Identity Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Government ID Type" required variant="select"
                  value={data.govtIdType} onChange={v => onChange('govtIdType', v)}
                  options={GOVT_ID_OPTIONS} error={errors.govtIdType}
                />
                <FormField
                  label="ID Number" required
                  value={data.govtIdNumber} onChange={v => onChange('govtIdNumber', v)}
                  placeholder="Enter ID number" error={errors.govtIdNumber}
                />
              </div>
              <TempleFileUpload
                label="Upload ID Document" required accept="image/*,.pdf"
                value={data.govtIdFile} onChange={f => onChange('govtIdFile', f)}
                helperText="JPG, PNG, or PDF — scanned copy" error={errors.govtIdFile}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Personal */}
        <AccordionItem value="personal" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">Personal Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <TempleFileUpload
                label="Passport-size Photo" required accept="image/*"
                value={data.photo} onChange={f => onChange('photo', f)}
                helperText="JPG, PNG — passport size" error={errors.photo}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Alternate Phone"
                  value={data.altPhone} onChange={v => onChange('altPhone', v)}
                  placeholder="+91 9876543210"
                />
                <FormField
                  label="Emergency Contact"
                  value={data.emergencyContact} onChange={v => onChange('emergencyContact', v)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Professional */}
        <AccordionItem value="professional" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">Professional Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Occupation"
                  value={data.occupation} onChange={v => onChange('occupation', v)}
                  placeholder="e.g. Teacher"
                />
                <FormField
                  label="Organization Name"
                  value={data.orgName} onChange={v => onChange('orgName', v)}
                  placeholder="Enter organization"
                />
              </div>
              <FormField
                label="Work Address" variant="textarea"
                value={data.workAddress} onChange={v => onChange('workAddress', v)}
                placeholder="Enter work address"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Family */}
        <AccordionItem value="family" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">Family Info</span>
              {data.familyMembers.length > 0 && (
                <span className="text-xs font-normal text-gray-400">
                  ({data.familyMembers.length} member{data.familyMembers.length > 1 ? 's' : ''})
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 pt-2">
              {data.familyMembers.map((member, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Member {i + 1}</span>
                    <button
                      type="button" onClick={() => removeMember(i)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text" placeholder="Name" value={member.name}
                      onChange={e => updateMember(i, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E8720C]"
                    />
                    <select
                      value={member.relation}
                      onChange={e => updateMember(i, 'relation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E8720C]"
                    >
                      <option value="">Relation</option>
                      {RELATION_OPTIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <input
                      type="number" placeholder="Age" value={member.age}
                      min={0} max={120}
                      onChange={e => updateMember(i, 'age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E8720C]"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button" onClick={addMember}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#E8720C] hover:text-[#E8720C] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Family Member
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ISKCON Info */}
        <AccordionItem value="iskcon" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
            <span className="font-semibold text-gray-900 text-sm">ISKCON Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Initiation Name"
                  value={data.initiationName} onChange={v => onChange('initiationName', v)}
                  placeholder="Enter spiritual name"
                />
                <FormField
                  label="Guru / Spiritual Master"
                  value={data.guru} onChange={v => onChange('guru', v)}
                  placeholder="Enter guru name"
                />
              </div>
              <FormField
                label="Years Associated with ISKCON"
                value={data.yearsWithISKCON} onChange={v => onChange('yearsWithISKCON', v)}
                placeholder="e.g. 5"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}

export function validatePerson(data: PersonData): PersonErrors {
  const e: PersonErrors = {}
  if (!data.fullName.trim()) e.fullName = 'Full name is required'
  if (!data.dob) e.dob = 'Date of birth is required'
  if (!data.gender) e.gender = 'Gender is required'
  if (!data.fatherName.trim()) e.fatherName = "Father's name is required"
  if (!data.address1.trim()) e.address1 = 'Address Line 1 is required'
  if (!data.state.trim()) e.state = 'State is required'
  if (!data.city.trim()) e.city = 'City is required'
  if (!data.pincode.trim()) e.pincode = 'Pincode is required'
  else if (!/^\d{6}$/.test(data.pincode.trim())) e.pincode = 'Pincode must be 6 digits'
  if (!data.mobile.trim()) e.mobile = 'Mobile number is required'
  else if (!data.mobileVerified) e.mobile = 'Please verify your mobile number via OTP'
  if (!data.googleEmail.trim()) e.googleEmail = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.googleEmail)) e.googleEmail = 'Invalid email format'
  if (!data.govtIdType) e.govtIdType = 'Government ID type is required'
  if (!data.govtIdNumber.trim()) e.govtIdNumber = 'ID number is required'
  if (!data.govtIdFile) e.govtIdFile = 'Please upload ID document'
  if (!data.photo) e.photo = 'Please upload a passport-size photo'
  return e
}
