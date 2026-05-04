import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: number
}

const STEPS = [
  { number: 1, label: 'Temple Details' },
  { number: 2, label: 'President' },
  { number: 3, label: 'Vice-President' },
  { number: 4, label: 'Review' },
]

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                  currentStep > step.number
                    ? 'bg-[#E8720C] border-[#E8720C] text-white'
                    : currentStep === step.number
                    ? 'bg-[#E8720C] border-[#E8720C] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold text-base">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  currentStep >= step.number ? 'text-[#E8720C]' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 md:w-32 mx-2 transition-colors ${
                  currentStep > step.number ? 'bg-[#E8720C]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
