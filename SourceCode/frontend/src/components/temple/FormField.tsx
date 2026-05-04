interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  variant?: 'input' | 'select' | 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  options?: { value: string; label: string }[]
}

const inputBase = (error?: string, disabled?: boolean) =>
  [
    'w-full px-3 py-2 border rounded-md text-sm transition-all',
    'focus:outline-none focus:ring-2 focus:ring-[#E8720C] focus:border-transparent',
    error ? 'border-red-500 bg-red-50' : 'border-gray-300',
    disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white',
  ].join(' ')

export const FormField = ({
  label, required, error,
  variant = 'input',
  value, onChange,
  placeholder, type = 'text',
  disabled = false,
  options = [],
}: FormFieldProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    {variant === 'input' && (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputBase(error, disabled)}
      />
    )}

    {variant === 'select' && (
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={`${inputBase(error, disabled)} appearance-none pr-10`}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )}

    {variant === 'textarea' && (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className={inputBase(error, disabled)}
      />
    )}

    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
  </div>
)
