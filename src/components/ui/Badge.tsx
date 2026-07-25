import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'navy' | 'gold' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-muted text-text-secondary border-border',
  success: 'bg-success-light text-success-text border-success/20',
  error: 'bg-error-light text-error-text border-error/20',
  warning: 'bg-warning-light text-warning-text border-warning/20',
  info: 'bg-info-light text-info-text border-info/20',
  navy: 'bg-navy/8 text-navy border-navy/15',
  gold: 'bg-gold-subtle text-gold border-gold/20',
  muted: 'bg-background text-text-tertiary border-border',
}

const DOT_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-text-tertiary',
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
  navy: 'bg-navy',
  gold: 'bg-gold',
  muted: 'bg-text-tertiary',
}

export function Badge({ variant = 'default', children, dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border',
        VARIANTS[variant],
        className,
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_VARIANTS[variant])} />}
      {children}
    </span>
  )
}
