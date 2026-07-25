/** Formata dióptrias: +2.00 / -1.50 / Plano */
export function formatDiopter(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  if (value === 0) return 'Plano'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}`
}

/** Formata eixo com símbolo de grau */
export function formatAxis(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value}°`
}

/** Formata mm */
export function formatMm(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(2)} mm`
}

/** Formata gramas */
export function formatGrams(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(1)} g`
}

/** Formata porcentagem */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(0)}%`
}

/** Formata moeda BRL */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/** Formata data pt-BR */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/** Formata data + hora */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/** Abreviação de nome */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
