import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <p className="text-sm text-text-tertiary">Carregando…</p>
      </div>
    </div>
  )
}
