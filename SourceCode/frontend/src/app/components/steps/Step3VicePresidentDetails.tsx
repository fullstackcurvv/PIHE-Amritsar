import * as React from "react";
import { Step2PresidentDetails } from "./Step2PresidentDetails";

interface VicePresidentData {
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
  familyMembers: Array<{ name: string; relation: string; age: string }>;
  initiationName: string;
  guru: string;
  yearsWithISKCON: string;
}

interface Step3Props {
  data: VicePresidentData;
  onChange: (data: VicePresidentData) => void;
  errors: Partial<Record<keyof VicePresidentData, string>>;
}

export const Step3VicePresidentDetails: React.FC<Step3Props> = (props) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Vice President Details
        </h3>
        <p className="text-sm text-gray-600">
          Complete all sections to register the vice president.
        </p>
      </div>
      <Step2PresidentDetails {...props} />
    </div>
  );
};
