import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
              {isLast || !item.to ? (
                <span className={isLast ? 'text-gray-500 font-medium' : 'text-[#E8720C] hover:underline'}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="text-[#E8720C] hover:underline font-medium">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
