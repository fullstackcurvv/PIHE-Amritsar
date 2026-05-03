import * as React from "react";
import { FormField } from "../form/FormField";
import { FileUpload } from "../ui/file-upload";

interface Step1Data {
  templeName: string;
  templeAddress1: string;
  templeAddress2: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  gstn: string;
  templeLogo: File | null;
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  errors: Partial<Record<keyof Step1Data, string>>;
}

const countries = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
];

const indianStates = [
  { value: "maharashtra", label: "Maharashtra" },
  { value: "karnataka", label: "Karnataka" },
  { value: "delhi", label: "Delhi" },
  { value: "westbengal", label: "West Bengal" },
  { value: "tamilnadu", label: "Tamil Nadu" },
];

const cities = [
  { value: "mumbai", label: "Mumbai" },
  { value: "bangalore", label: "Bangalore" },
  { value: "delhi", label: "Delhi" },
  { value: "kolkata", label: "Kolkata" },
  { value: "chennai", label: "Chennai" },
];

export const Step1TempleDetails: React.FC<Step1Props> = ({
  data,
  onChange,
  errors,
}) => {
  const updateField = (field: keyof Step1Data, value: string | File | null) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Temple Details
        </h3>
        <p className="text-sm text-gray-600">
          Please provide basic information about the temple/organization.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Temple Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Temple/Organization Name"
            required
            value={data.templeName}
            onChange={(value) => updateField("templeName", value)}
            placeholder="Enter temple name"
            error={errors.templeName}
          />

          <FormField
            label="GSTN"
            required
            value={data.gstn}
            onChange={(value) => updateField("gstn", value)}
            placeholder="22AAAAA0000A1Z5"
            error={errors.gstn}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Address Information
        </h4>
        <div className="space-y-4">
          <FormField
            label="Address Line 1"
            required
            value={data.templeAddress1}
            onChange={(value) => updateField("templeAddress1", value)}
            placeholder="Building No., Street Name"
            error={errors.templeAddress1}
          />

          <FormField
            label="Address Line 2"
            value={data.templeAddress2}
            onChange={(value) => updateField("templeAddress2", value)}
            placeholder="Landmark, Area"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Country"
              required
              variant="select"
              value={data.country}
              onChange={(value) => updateField("country", value)}
              options={countries}
              error={errors.country}
            />

            <FormField
              label="State"
              required
              variant="select"
              value={data.state}
              onChange={(value) => updateField("state", value)}
              options={indianStates}
              error={errors.state}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="City"
              required
              variant="select"
              value={data.city}
              onChange={(value) => updateField("city", value)}
              options={cities}
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
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Temple Logo
        </h4>
        <FileUpload
          label="Upload Logo"
          required
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          value={data.templeLogo}
          onChange={(file) => updateField("templeLogo", file)}
          error={errors.templeLogo}
          helperText="PNG, JPG up to 5MB"
        />
      </div>
    </div>
  );
};
