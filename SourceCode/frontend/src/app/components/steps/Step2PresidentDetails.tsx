import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FormField } from "../form/FormField";
import { FileUpload } from "../ui/file-upload";
import { Button } from "../ui/button";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface FamilyMember {
  name: string;
  relation: string;
  age: string;
}

interface PresidentData {
  fullName: string;
  dob: string;
  gender: string;
  fatherName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mobile: string;
  mobileVerified: boolean;
  googleEmail: string;
  govtIdType: string;
  govtIdNumber: string;
  govtIdFile: File | null;
  photo: File | null;
  altPhone: string;
  emergencyContact: string;
  occupation: string;
  orgName: string;
  workAddress: string;
  familyMembers: FamilyMember[];
  initiationName: string;
  guru: string;
  yearsWithISKCON: string;
}

interface Step2Props {
  data: PresidentData;
  onChange: (data: PresidentData) => void;
  errors: Partial<Record<keyof PresidentData, string>>;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const govtIdOptions = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "passport", label: "Passport" },
  { value: "voter", label: "Voter ID" },
];

const relationOptions = [
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
];

export const Step2PresidentDetails: React.FC<Step2Props> = ({
  data,
  onChange,
  errors,
}) => {
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);

  const updateField = (field: keyof PresidentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addFamilyMember = () => {
    updateField("familyMembers", [
      ...data.familyMembers,
      { name: "", relation: "", age: "" },
    ]);
  };

  const removeFamilyMember = (index: number) => {
    const newMembers = data.familyMembers.filter((_, i) => i !== index);
    updateField("familyMembers", newMembers);
  };

  const updateFamilyMember = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const newMembers = [...data.familyMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateField("familyMembers", newMembers);
  };

  const sendOTP = () => {
    setOtpSent(true);
    setTimeout(() => {
      alert("OTP sent to " + data.mobile);
    }, 500);
  };

  const verifyOTP = () => {
    if (otp === "123456") {
      updateField("mobileVerified", true);
      alert("Mobile verified successfully!");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          President Details
        </h3>
        <p className="text-sm text-gray-600">
          Complete all sections to register the temple president.
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["basic"]}>
        <AccordionItem value="basic" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-md font-semibold">Basic Info</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  required
                  value={data.fullName}
                  onChange={(value) => updateField("fullName", value)}
                  placeholder="Enter full name"
                  error={errors.fullName}
                />
                <FormField
                  label="Date of Birth"
                  required
                  type="date"
                  value={data.dob}
                  onChange={(value) => updateField("dob", value)}
                  error={errors.dob}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Gender"
                  required
                  variant="select"
                  value={data.gender}
                  onChange={(value) => updateField("gender", value)}
                  options={genderOptions}
                  error={errors.gender}
                />
                <FormField
                  label="Father's Name"
                  required
                  value={data.fatherName}
                  onChange={(value) => updateField("fatherName", value)}
                  placeholder="Enter father's name"
                  error={errors.fatherName}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="address" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">Address Details</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <FormField
                label="Address Line 1"
                required
                value={data.address1}
                onChange={(value) => updateField("address1", value)}
                placeholder="Building No., Street Name"
                error={errors.address1}
              />
              <FormField
                label="Address Line 2"
                value={data.address2}
                onChange={(value) => updateField("address2", value)}
                placeholder="Landmark, Area"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Country"
                  value={data.country}
                  onChange={(value) => updateField("country", value)}
                  placeholder="Enter country"
                />
                <FormField
                  label="State"
                  required
                  value={data.state}
                  onChange={(value) => updateField("state", value)}
                  placeholder="Enter state"
                  error={errors.state}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="City"
                  required
                  value={data.city}
                  onChange={(value) => updateField("city", value)}
                  placeholder="Enter city"
                  error={errors.city}
                />
                <FormField
                  label="Pincode"
                  required
                  value={data.pincode}
                  onChange={(value) => updateField("pincode", value)}
                  placeholder="400001"
                  error={errors.pincode}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-md font-semibold">Contact Info</span>
              {data.mobileVerified && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div>
                <FormField
                  label="Mobile Number"
                  required
                  value={data.mobile}
                  onChange={(value) => updateField("mobile", value)}
                  placeholder="+91 9876543210"
                  error={errors.mobile}
                  disabled={data.mobileVerified}
                />
                {!data.mobileVerified && (
                  <div className="mt-3">
                    {!otpSent ? (
                      <Button onClick={sendOTP} variant="outline" size="sm">
                        Send OTP
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="flex h-9 w-40 rounded-md border border-gray-300 px-3 text-sm"
                        />
                        <Button onClick={verifyOTP} size="sm">
                          Verify OTP
                        </Button>
                        <Button
                          onClick={sendOTP}
                          variant="ghost"
                          size="sm"
                        >
                          Resend
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormField
                label="Google Email"
                required
                type="email"
                value={data.googleEmail}
                onChange={(value) => updateField("googleEmail", value)}
                placeholder="president@temple.org"
                error={errors.googleEmail}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="identity" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">Identity Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Government ID Type"
                  required
                  variant="select"
                  value={data.govtIdType}
                  onChange={(value) => updateField("govtIdType", value)}
                  options={govtIdOptions}
                  error={errors.govtIdType}
                />
                <FormField
                  label="ID Number"
                  required
                  value={data.govtIdNumber}
                  onChange={(value) => updateField("govtIdNumber", value)}
                  placeholder="Enter ID number"
                  error={errors.govtIdNumber}
                />
              </div>
              <FileUpload
                label="Upload ID Document"
                required
                accept="image/*,.pdf"
                value={data.govtIdFile}
                onChange={(file) => updateField("govtIdFile", file)}
                error={errors.govtIdFile}
                helperText="Upload scanned copy of ID"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="personal" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">Personal Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <FileUpload
                label="Upload Photo"
                required
                accept="image/*"
                value={data.photo}
                onChange={(file) => updateField("photo", file)}
                error={errors.photo}
                helperText="Passport size photo (JPG, PNG)"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Alternate Phone"
                  value={data.altPhone}
                  onChange={(value) => updateField("altPhone", value)}
                  placeholder="+91 9876543210"
                />
                <FormField
                  label="Emergency Contact"
                  value={data.emergencyContact}
                  onChange={(value) => updateField("emergencyContact", value)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="professional" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">Professional Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Occupation"
                  value={data.occupation}
                  onChange={(value) => updateField("occupation", value)}
                  placeholder="Enter occupation"
                />
                <FormField
                  label="Organization Name"
                  value={data.orgName}
                  onChange={(value) => updateField("orgName", value)}
                  placeholder="Enter organization"
                />
              </div>
              <FormField
                label="Work Address"
                variant="textarea"
                value={data.workAddress}
                onChange={(value) => updateField("workAddress", value)}
                placeholder="Enter work address"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="family" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">Family Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {data.familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-sm">
                      Family Member {index + 1}
                    </h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFamilyMember(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) =>
                        updateFamilyMember(index, "name", e.target.value)
                      }
                      className="flex h-9 rounded-md border border-gray-300 px-3 text-sm"
                    />
                    <select
                      value={member.relation}
                      onChange={(e) =>
                        updateFamilyMember(index, "relation", e.target.value)
                      }
                      className="flex h-9 rounded-md border border-gray-300 px-3 text-sm"
                    >
                      <option value="">Select Relation</option>
                      {relationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Age"
                      value={member.age}
                      onChange={(e) =>
                        updateFamilyMember(index, "age", e.target.value)
                      }
                      className="flex h-9 rounded-md border border-gray-300 px-3 text-sm"
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={addFamilyMember}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Family Member
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="iskcon" className="bg-white border border-gray-200 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-md font-semibold">ISKCON Info</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Initiation Name"
                  value={data.initiationName}
                  onChange={(value) => updateField("initiationName", value)}
                  placeholder="Enter spiritual name"
                />
                <FormField
                  label="Guru/Spiritual Master"
                  value={data.guru}
                  onChange={(value) => updateField("guru", value)}
                  placeholder="Enter guru name"
                />
              </div>
              <FormField
                label="Years Associated with ISKCON"
                value={data.yearsWithISKCON}
                onChange={(value) => updateField("yearsWithISKCON", value)}
                placeholder="Enter years"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
