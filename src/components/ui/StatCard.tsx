import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number        // percentage, positive = up, negative = down
  trendLabel?: string
  color?: 'navy' | 'gold' | 'success' | 'warning'
  className?: string
  index?: number        // for stagger animation
}

const COLOR_MAP = {
  navy: {
    icon: 'bg-navy/8 text-navy',
    trend: 'text-navy',
  },
  gold: {
    icon: 'bg-gold/10 text-gold',
    trend: 'text-gold',
  },
  success: {
    icon: 'bg-success-light text-success',
    trend: 'text-success',
  },
  warning: {
    icon: 'bg-warning-light text-warning',
    trend: 'text-warning',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs. mês anterior',
  color = 'navy',
  className,
  index = 0,
}: StatCardProps) {
  const colors = COLOR_MAP[color]
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown
  const trendPositive = trend !== undefined && trend > 0
  const trendNeutral = trend === undefined || trend === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('card-base p-5 flex flex-col gap-4 hover:shadow-md transition-shadow', className)}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              trendNeutral
                ? 'bg-muted text-text-tertiary'
                : trendPositive
                  ? 'bg-success-light text-success-text'
                  : 'bg-error-light text-error-text',
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-text-primary tabular-nums">{value}</p>
        <p className="text-sm text-text-secondary mt-0.5">{title}</p>
        {trend !== undefined && (
          <p className="text-2xs text-text-tertiary mt-1">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  )
}
