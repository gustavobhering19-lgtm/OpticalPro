import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, ChevronDown, ExternalLink, Star, Zap } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatMm } from '@/utils/format'

interface Equivalent {
  id: string
  manufacturer: string
  line: string
  compatibility: number     // 0–100
  similarity: 'Alta' | 'Média' | 'Baixa'
  centerThickness: number
  averagePrice?: number
  isRecommended?: boolean
  treatments: string[]
}

const MOCK_EQUIVALENTS: Equivalent[] = [
  { id: '1', manufacturer: 'Hoya', line: 'Lifestyle 3 Plus', compatibility: 96, similarity: 'Alta', centerThickness: 1.0, averagePrice: 720, isRecommended: true, treatments: ['AR', 'Blue Block'] },
  { id: '2', manufacturer: 'Zeiss', line: 'Progressive Classic', compatibility: 88, similarity: 'Alta', centerThickness: 1.1, averagePrice: 950, treatments: ['AR', 'UV'] },
  { id: '3', manufacturer: 'Nikon', line: 'Lite Fusion', compatibility: 81, similarity: 'Média', centerThickness: 1.2, averagePrice: 680, treatments: ['AR'] },
  { id: '4', manufacturer: 'Kodak', line: 'Unique HD 2', compatibility: 74, similarity: 'Média', centerThickness: 1.3, averagePrice: 490, treatments: ['AR', 'UV'] },
]

const LENS_OPTIONS = [
  { value: '', label: 'Selecione a lente atual…' },
  { value: 'varilux', label: 'Essilor — Varilux Comfort (1.67)' },
  { value: 'physio', label: 'Essilor — Varilux Physio (1.74)' },
  { value: 'zeiss', label: 'Zeiss — Progressive Individual (1.74)' },
]

export default function ConverterPage() {
  const [selected, setSelected] = useState('')
  const [result, setResult] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConvert() {
    if (!selected) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setResult(true)
    setLoading(false)
  }

  return (
    <div className="page-enter">
      <PageHeader
        title="Conversor"
        subtitle="Encontre equivalentes de lentes entre fabricantes"
      />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* Lens selector */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <h2 className="font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-gold" /> Selecionar Lente Atual
          </h2>

          <div className="relative mb-5">
            <select
              value={selected}
              onChange={(e) => { setSelected(e.target.value); setResult(false) }}
              className="w-full appearance-none pl-4 pr-10 py-3 text-sm bg-background border border-border rounded-xl
                         text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
            >
              {LENS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          </div>

          <Button fullWidth onClick={handleConvert} disabled={!selected} loading={loading}
            icon={<ArrowLeftRight className="w-4 h-4" />}>
            Buscar Equivalentes
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  {MOCK_EQUIVALENTS.length} equivalentes encontrados
                </h3>
                <Badge variant="navy">Varilux Comfort 1.67</Badge>
              </div>

              {MOCK_EQUIVALENTS.map((eq, i) => (
                <motion.div
                  key={eq.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`card-base p-5 hover:shadow-md transition-all duration-200 cursor-pointer
                    ${eq.isRecommended ? 'ring-2 ring-gold/30' : ''}`}
                >
                  {eq.isRecommended && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                      <span className="text-xs font-semibold text-gold">Melhor equivalente</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-text-primary">{eq.line}</p>
                      <p className="text-sm text-text-secondary mt-0.5">{eq.manufacturer}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {eq.treatments.map(t => <Badge key={t} variant="muted" className="text-2xs">{t}</Badge>)}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {eq.averagePrice && (
                        <p className="text-base font-bold text-text-primary">{formatCurrency(eq.averagePrice)}</p>
                      )}
                      <p className="text-2xs text-text-tertiary mt-0.5">Preço médio</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CompatBar value={eq.compatibility} />
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Zap className="w-3 h-3 text-text-tertiary" />
                        Centro: {formatMm(eq.centerThickness)}
                      </div>
                      <Badge variant={eq.similarity === 'Alta' ? 'success' : eq.similarity === 'Média' ? 'warning' : 'error'}>
                        {eq.similarity}
                      </Badge>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition-colors">
                      Ver detalhes <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CompatBar({ value }: { value: number }) {
  const color = value >= 85 ? 'bg-success' : value >= 70 ? 'bg-warning' : 'bg-error'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`} />
      </div>
      <span className="text-xs font-semibold text-text-secondary tabular-nums">{value}%</span>
    </div>
  )
}
