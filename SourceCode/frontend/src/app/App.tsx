import * as React from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Stepper } from "./components/form/Stepper";
import { Step1TempleDetails } from "./components/steps/Step1TempleDetails";
import { Step2PresidentDetails } from "./components/steps/Step2PresidentDetails";
import { Step3VicePresidentDetails } from "./components/steps/Step3VicePresidentDetails";
import { Step4ReviewSubmit } from "./components/steps/Step4ReviewSubmit";
import { Step5Success } from "./components/steps/Step5Success";
import { Button } from "./components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const steps = [
  { number: 1, label: "Temple Details" },
  { number: 2, label: "President Details" },
  { number: 3, label: "Vice President Details" },
  { number: 4, label: "Review & Submit" },
  { number: 5, label: "Success" },
];

export default function App() {
  const [currentStep, setCurrentStep] = React.useState(1);

  const [templeData, setTempleData] = React.useState({
    templeName: "",
    templeAddress1: "",
    templeAddress2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    gstn: "",
    templeLogo: null as File | null,
  });

  const [presidentData, setPresidentData] = React.useState({
    fullName: "",
    dob: "",
    gender: "",
    fatherName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile: "",
    mobileVerified: false,
    googleEmail: "",
    govtIdType: "",
    govtIdNumber: "",
    govtIdFile: null as File | null,
    photo: null as File | null,
    altPhone: "",
    emergencyContact: "",
    occupation: "",
    orgName: "",
    workAddress: "",
    familyMembers: [],
    initiationName: "",
    guru: "",
    yearsWithISKCON: "",
  });

  const [vicePresidentData, setVicePresidentData] = React.useState({
    fullName: "",
    dob: "",
    gender: "",
    fatherName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    mobile: "",
    mobileVerified: false,
    googleEmail: "",
    govtIdType: "",
    govtIdNumber: "",
    govtIdFile: null as File | null,
    photo: null as File | null,
    altPhone: "",
    emergencyContact: "",
    occupation: "",
    orgName: "",
    workAddress: "",
    familyMembers: [],
    initiationName: "",
    guru: "",
    yearsWithISKCON: "",
  });

  const [errors, setErrors] = React.useState<any>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState("");

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!templeData.templeName)
      newErrors.templeName = "Temple name is required";
    if (!templeData.gstn) newErrors.gstn = "GSTN is required";
    if (templeData.gstn && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(templeData.gstn)) {
      newErrors.gstn = "Invalid GSTN format";
    }
    if (!templeData.templeAddress1)
      newErrors.templeAddress1 = "Address is required";
    if (!templeData.country) newErrors.country = "Country is required";
    if (!templeData.state) newErrors.state = "State is required";
    if (!templeData.city) newErrors.city = "City is required";
    if (!templeData.pincode) newErrors.pincode = "Pincode is required";
    if (templeData.pincode && !/^\d{6}$/.test(templeData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!templeData.templeLogo) newErrors.templeLogo = "Logo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    // Basic Info - Required fields
    if (!presidentData.fullName)
      newErrors.fullName = "Full name is required";
    if (!presidentData.dob) newErrors.dob = "Date of birth is required";
    if (!presidentData.gender) newErrors.gender = "Gender is required";
    if (!presidentData.fatherName)
      newErrors.fatherName = "Father's name is required";

    // Address Details - Required fields
    if (!presidentData.address1)
      newErrors.address1 = "Address line 1 is required";
    if (!presidentData.city) newErrors.city = "City is required";
    if (!presidentData.state) newErrors.state = "State is required";
    if (!presidentData.pincode) newErrors.pincode = "Pincode is required";
    if (presidentData.pincode && !/^\d{6}$/.test(presidentData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Contact Info - Required fields
    if (!presidentData.mobile) newErrors.mobile = "Mobile number is required";
    if (presidentData.mobile && !/^\+?[\d\s-]{10,}$/.test(presidentData.mobile)) {
      newErrors.mobile = "Invalid mobile number format";
    }
    if (!presidentData.mobileVerified) {
      newErrors.mobile = "Please verify your mobile number";
    }
    if (!presidentData.googleEmail)
      newErrors.googleEmail = "Email is required";
    if (presidentData.googleEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(presidentData.googleEmail)) {
      newErrors.googleEmail = "Invalid email format";
    }

    // Identity Info - Required fields
    if (!presidentData.govtIdType)
      newErrors.govtIdType = "Government ID type is required";
    if (!presidentData.govtIdNumber)
      newErrors.govtIdNumber = "ID number is required";
    if (!presidentData.govtIdFile)
      newErrors.govtIdFile = "Please upload ID document";

    // Personal Info - Required fields
    if (!presidentData.photo)
      newErrors.photo = "Please upload photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: any = {};

    // Basic Info - Required fields
    if (!vicePresidentData.fullName)
      newErrors.fullName = "Full name is required";
    if (!vicePresidentData.dob) newErrors.dob = "Date of birth is required";
    if (!vicePresidentData.gender) newErrors.gender = "Gender is required";
    if (!vicePresidentData.fatherName)
      newErrors.fatherName = "Father's name is required";

    // Address Details - Required fields
    if (!vicePresidentData.address1)
      newErrors.address1 = "Address line 1 is required";
    if (!vicePresidentData.city) newErrors.city = "City is required";
    if (!vicePresidentData.state) newErrors.state = "State is required";
    if (!vicePresidentData.pincode) newErrors.pincode = "Pincode is required";
    if (vicePresidentData.pincode && !/^\d{6}$/.test(vicePresidentData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Contact Info - Required fields
    if (!vicePresidentData.mobile)
      newErrors.mobile = "Mobile number is required";
    if (vicePresidentData.mobile && !/^\+?[\d\s-]{10,}$/.test(vicePresidentData.mobile)) {
      newErrors.mobile = "Invalid mobile number format";
    }
    if (!vicePresidentData.mobileVerified) {
      newErrors.mobile = "Please verify your mobile number";
    }
    if (!vicePresidentData.googleEmail)
      newErrors.googleEmail = "Email is required";
    if (vicePresidentData.googleEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vicePresidentData.googleEmail)) {
      newErrors.googleEmail = "Invalid email format";
    }

    // Identity Info - Required fields
    if (!vicePresidentData.govtIdType)
      newErrors.govtIdType = "Government ID type is required";
    if (!vicePresidentData.govtIdNumber)
      newErrors.govtIdNumber = "ID number is required";
    if (!vicePresidentData.govtIdFile)
      newErrors.govtIdFile = "Please upload ID document";

    // Personal Info - Required fields
    if (!vicePresidentData.photo)
      newErrors.photo = "Please upload photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors({});

    const fd = new FormData();

    // Temple
    fd.append("templeName", templeData.templeName);
    fd.append("templeAddress1", templeData.templeAddress1);
    if (templeData.templeAddress2) fd.append("templeAddress2", templeData.templeAddress2);
    fd.append("country", templeData.country);
    fd.append("state", templeData.state);
    fd.append("city", templeData.city);
    fd.append("pincode", templeData.pincode);
    fd.append("gstn", templeData.gstn);
    if (templeData.templeLogo) fd.append("templeLogo", templeData.templeLogo);

    // President
    fd.append("presidentFullName", presidentData.fullName);
    fd.append("presidentDob", presidentData.dob);
    fd.append("presidentGender", presidentData.gender);
    fd.append("presidentFatherName", presidentData.fatherName);
    fd.append("presidentAddress1", presidentData.address1);
    if (presidentData.address2) fd.append("presidentAddress2", presidentData.address2);
    fd.append("presidentCity", presidentData.city);
    fd.append("presidentState", presidentData.state);
    if (presidentData.country) fd.append("presidentCountry", presidentData.country);
    fd.append("presidentPincode", presidentData.pincode);
    fd.append("presidentMobile", presidentData.mobile);
    fd.append("presidentMobileVerified", String(presidentData.mobileVerified));
    fd.append("presidentGoogleEmail", presidentData.googleEmail);
    fd.append("presidentGovtIdType", presidentData.govtIdType);
    fd.append("presidentGovtIdNumber", presidentData.govtIdNumber);
    if (presidentData.altPhone) fd.append("presidentAltPhone", presidentData.altPhone);
    if (presidentData.emergencyContact) fd.append("presidentEmergencyContact", presidentData.emergencyContact);
    if (presidentData.occupation) fd.append("presidentOccupation", presidentData.occupation);
    if (presidentData.orgName) fd.append("presidentOrgName", presidentData.orgName);
    if (presidentData.workAddress) fd.append("presidentWorkAddress", presidentData.workAddress);
    if (presidentData.initiationName) fd.append("presidentInitiationName", presidentData.initiationName);
    if (presidentData.guru) fd.append("presidentGuru", presidentData.guru);
    if (presidentData.yearsWithISKCON) fd.append("presidentYearsWithISKCON", presidentData.yearsWithISKCON);
    fd.append("presidentFamilyMembers", JSON.stringify(presidentData.familyMembers));
    if (presidentData.photo) fd.append("presidentPhoto", presidentData.photo);
    if (presidentData.govtIdFile) fd.append("presidentGovtIdFile", presidentData.govtIdFile);

    // Vice President
    fd.append("vpFullName", vicePresidentData.fullName);
    fd.append("vpDob", vicePresidentData.dob);
    fd.append("vpGender", vicePresidentData.gender);
    fd.append("vpFatherName", vicePresidentData.fatherName);
    fd.append("vpAddress1", vicePresidentData.address1);
    if (vicePresidentData.address2) fd.append("vpAddress2", vicePresidentData.address2);
    fd.append("vpCity", vicePresidentData.city);
    fd.append("vpState", vicePresidentData.state);
    if (vicePresidentData.country) fd.append("vpCountry", vicePresidentData.country);
    fd.append("vpPincode", vicePresidentData.pincode);
    fd.append("vpMobile", vicePresidentData.mobile);
    fd.append("vpMobileVerified", String(vicePresidentData.mobileVerified));
    fd.append("vpGoogleEmail", vicePresidentData.googleEmail);
    fd.append("vpGovtIdType", vicePresidentData.govtIdType);
    fd.append("vpGovtIdNumber", vicePresidentData.govtIdNumber);
    if (vicePresidentData.altPhone) fd.append("vpAltPhone", vicePresidentData.altPhone);
    if (vicePresidentData.emergencyContact) fd.append("vpEmergencyContact", vicePresidentData.emergencyContact);
    if (vicePresidentData.occupation) fd.append("vpOccupation", vicePresidentData.occupation);
    if (vicePresidentData.orgName) fd.append("vpOrgName", vicePresidentData.orgName);
    if (vicePresidentData.workAddress) fd.append("vpWorkAddress", vicePresidentData.workAddress);
    if (vicePresidentData.initiationName) fd.append("vpInitiationName", vicePresidentData.initiationName);
    if (vicePresidentData.guru) fd.append("vpGuru", vicePresidentData.guru);
    if (vicePresidentData.yearsWithISKCON) fd.append("vpYearsWithISKCON", vicePresidentData.yearsWithISKCON);
    fd.append("vpFamilyMembers", JSON.stringify(vicePresidentData.familyMembers));
    if (vicePresidentData.photo) fd.append("vpPhoto", vicePresidentData.photo);
    if (vicePresidentData.govtIdFile) fd.append("vpGovtIdFile", vicePresidentData.govtIdFile);

    try {
      const apiBase = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";
      const res = await fetch(`${apiBase}/api/registrations`, { method: "POST", body: fd });
      const data = await res.json();

      if (res.status === 422) {
        setErrors(data.errors);
        window.scrollTo({ top: 300, behavior: "smooth" });
        return;
      }
      if (!res.ok) {
        setErrors({ _form: data.error || "Submission failed. Please try again." });
        window.scrollTo({ top: 300, behavior: "smooth" });
        return;
      }

      setReferenceNumber(data.referenceNumber);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _form: "Network error. Please check your connection and try again." });
      window.scrollTo({ top: 300, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1">
        {currentStep < 5 && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-6">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                Temple Registration
              </h2>
              <p className="text-orange-50 text-sm">
                Register your temple to access the ISKCON Course Portal
              </p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-8">
          {currentStep < 5 && <Stepper steps={steps} currentStep={currentStep} />}

        <div className="mt-8">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <Step1TempleDetails
              data={templeData}
              onChange={setTempleData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <Step2PresidentDetails
              data={presidentData}
              onChange={setPresidentData}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <Step3VicePresidentDetails
              data={vicePresidentData}
              onChange={setVicePresidentData}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <Step4ReviewSubmit
              templeData={templeData}
              presidentData={presidentData}
              vicePresidentData={vicePresidentData}
              onEdit={handleEdit}
            />
          )}

          {currentStep === 5 && <Step5Success referenceNumber={referenceNumber} />}
        </div>

          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pb-8">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep === 4 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Registration"}
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2 bg-orange-500 hover:bg-orange-600">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}