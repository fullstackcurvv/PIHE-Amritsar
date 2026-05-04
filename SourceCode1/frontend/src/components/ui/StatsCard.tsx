import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  iconBg?: string
}

export function StatsCard({
  icon,
  title,
  value,
  trend,
  trendLabel,
  iconBg = 'bg-primary/10',
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <p
          className="font-bold text-3xl text-gray-900 mt-1"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {value}
        </p>
        {trendLabel && <p className="text-gray-400 text-xs mt-1">{trendLabel}</p>}
      </div>
    </div>
  )
}
