import * as React from "react";
import { CheckCircle2, Edit } from "lucide-react";
import { Button } from "../ui/button";

interface ReviewProps {
  templeData: any;
  presidentData: any;
  vicePresidentData: any;
  onEdit: (step: number) => void;
}

export const Step4ReviewSubmit: React.FC<ReviewProps> = ({
  templeData,
  presidentData,
  vicePresidentData,
  onEdit,
}) => {
  const InfoRow: React.FC<{ label: string; value: string }> = ({
    label,
    value,
  }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Review & Submit
        </h3>
        <p className="text-sm text-gray-600">
          Please review all information before submitting.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Temple Details
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-1">
          <InfoRow label="Temple Name" value={templeData.templeName} />
          <InfoRow label="GSTN" value={templeData.gstn} />
          <InfoRow
            label="Address"
            value={`${templeData.templeAddress1}, ${templeData.city}`}
          />
          <InfoRow label="State" value={templeData.state} />
          <InfoRow label="Pincode" value={templeData.pincode} />
          {templeData.templeLogo && (
            <InfoRow label="Logo" value={templeData.templeLogo.name} />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            President Details
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">
              Basic Info
            </h5>
            <InfoRow label="Full Name" value={presidentData.fullName} />
            <InfoRow label="DOB" value={presidentData.dob} />
            <InfoRow label="Gender" value={presidentData.gender} />
            <InfoRow label="Father's Name" value={presidentData.fatherName} />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">
              Contact Info
            </h5>
            <InfoRow
              label="Mobile"
              value={
                presidentData.mobile +
                (presidentData.mobileVerified ? " ✓" : "")
              }
            />
            <InfoRow label="Email" value={presidentData.googleEmail} />
            <InfoRow label="Alt Phone" value={presidentData.altPhone} />
          </div>
        </div>

        {presidentData.familyMembers?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">
              Family Members ({presidentData.familyMembers.length})
            </h5>
            <div className="space-y-2">
              {presidentData.familyMembers.map((member: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                >
                  <span>{member.name}</span>
                  <span className="text-gray-600">
                    {member.relation} • Age {member.age}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">
            ISKCON Info
          </h5>
          <div className="space-y-1">
            <InfoRow
              label="Initiation Name"
              value={presidentData.initiationName}
            />
            <InfoRow label="Guru" value={presidentData.guru} />
            <InfoRow
              label="Years with ISKCON"
              value={presidentData.yearsWithISKCON}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Vice President Details
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">
              Basic Info
            </h5>
            <InfoRow label="Full Name" value={vicePresidentData.fullName} />
            <InfoRow label="DOB" value={vicePresidentData.dob} />
            <InfoRow label="Gender" value={vicePresidentData.gender} />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">
              Contact Info
            </h5>
            <InfoRow
              label="Mobile"
              value={
                vicePresidentData.mobile +
                (vicePresidentData.mobileVerified ? " ✓" : "")
              }
            />
            <InfoRow label="Email" value={vicePresidentData.googleEmail} />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Once submitted, your temple registration will
          be processed. You will receive login credentials via email within
          24-48 hours.
        </p>
      </div>
    </div>
  );
};
