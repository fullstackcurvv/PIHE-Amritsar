import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'white'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<string, string> = {
  primary: 'bg-[#E8720C] text-white hover:bg-[#C55E00] active:scale-95 shadow-sm',
  outline: 'border-2 border-[#E8720C] text-[#E8720C] hover:bg-[#E8720C] hover:text-white',
  ghost:   'text-[#E8720C] hover:bg-orange-50',
  danger:  'bg-red-500 text-white hover:bg-red-600 active:scale-95',
  white:   'bg-white text-[#E8720C] hover:bg-orange-50 font-semibold shadow-sm',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8720C] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `.trim()}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  )
}
