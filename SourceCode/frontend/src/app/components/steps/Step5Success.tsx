import * as React from "react";
import { CheckCircle, Download, Home } from "lucide-react";
import { Button } from "../ui/button";

interface Step5Props {
  referenceNumber?: string;
}

export const Step5Success: React.FC<Step5Props> = ({ referenceNumber }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping" />
            <div className="relative bg-green-500 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Temple Registered Successfully!
          </h2>

          <p className="text-lg text-gray-600 max-w-xl">
            Your temple registration has been submitted successfully. Our team
            will review the details and send login credentials to the registered
            email address.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Verification Process
                </p>
                <p className="text-sm text-gray-600">
                  Our team will verify the submitted documents and information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Creation
                </p>
                <p className="text-sm text-gray-600">
                  User accounts will be created for President and Vice President
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Credentials Sent
                </p>
                <p className="text-sm text-gray-600">
                  Login credentials will be sent to the registered email addresses
                  within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {referenceNumber && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <p className="text-sm text-orange-700 mb-1">Reference Number</p>
            <p className="text-2xl font-bold tracking-widest text-orange-600">{referenceNumber}</p>
            <p className="text-xs text-orange-600 mt-1">Keep this for your records</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">
            Registration Summary Sent
          </h4>
          <p className="text-sm text-blue-800">
            A confirmation email with your registration summary has been sent to
            the president's email address. Please check your inbox and spam
            folder.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button variant="default" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Download Receipt
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
