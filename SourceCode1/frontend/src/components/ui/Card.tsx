import { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const shadowMap = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' }
const padMap    = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, shadow = 'sm', padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`bg-white rounded-2xl border border-gray-100 ${shadowMap[shadow]} ${padMap[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
