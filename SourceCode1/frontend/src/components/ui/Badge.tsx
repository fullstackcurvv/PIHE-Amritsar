import { ReactNode } from 'react'

type BadgeVariant = 'free' | 'paid' | 'bestseller' | 'popular' | 'beginner' | 'intermediate' | 'advanced' | 'new'

interface BadgeProps {
  variant: BadgeVariant
  children?: ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  free:         { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Free' },
  paid:         { bg: 'bg-indigo-100',  text: 'text-indigo-700',  label: 'Paid' },
  bestseller:   { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Best Seller' },
  popular:      { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Popular' },
  new:          { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'New' },
  beginner:     { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Beginner' },
  intermediate: { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Intermediate' },
  advanced:     { bg: 'bg-purple-100',  text: 'text-purple-700',  label: 'Advanced' },
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const { bg, text, label } = variantMap[variant]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text} ${className}`}>
      {children ?? label}
    </span>
  )
}
