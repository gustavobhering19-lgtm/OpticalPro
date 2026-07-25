import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange, className }: PaginationProps) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-border', className)}>
      <p className="text-xs text-text-tertiary">
        Mostrando <span className="font-medium text-text-secondary">{from}–{to}</span> de{' '}
        <span className="font-medium text-text-secondary">{total}</span> registros
      </p>

      <div className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </PageButton>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1
          return (
            <PageButton
              key={p}
              onClick={() => onPageChange(p)}
              active={p === page}
            >
              {p}
            </PageButton>
          )
        })}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </PageButton>
      </div>
    </div>
  )
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ...props
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  [key: string]: unknown
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors',
        active
          ? 'bg-navy text-white'
          : 'text-text-secondary hover:bg-muted disabled:opacity-40 disabled:pointer-events-none',
      )}
      {...props}
    >
      {children}
    </button>
  )
}
