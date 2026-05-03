import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../ui/utils";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all",
                    step.number < currentStep
                      ? "bg-orange-500 border-orange-500 text-white"
                      : step.number === currentStep
                      ? "bg-white border-orange-500 text-orange-500"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-all",
                      step.number < currentStep
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  step.number <= currentStep
                    ? "text-gray-900"
                    : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
