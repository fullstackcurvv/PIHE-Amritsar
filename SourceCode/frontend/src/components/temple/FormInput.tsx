import { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: string
  onSuffixClick?: () => void
}

export const TempleFormInput = ({
  label,
  suffix,
  onSuffixClick,
  ...props
}: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...props}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E8720C] focus:border-transparent transition-all text-sm"
        />
        {suffix && (
          <button
            type="button"
            onClick={onSuffixClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8720C] text-xs font-medium hover:text-[#c4610a] transition-colors"
          >
            {suffix}
          </button>
        )}
      </div>
    </div>
  )
}
