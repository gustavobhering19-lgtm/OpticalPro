import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompareArrows, ChevronDown, Check, X, Trophy } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatMm, formatGrams } from '@/utils/format'

interface LensOption { value: string; label: string }
const LENS_OPTIONS: LensOption[] = [
  { value: '', label: 'Selecione uma lente…' },
  { value: 'varilux-167', label: 'Essilor — Varilux Comfort (1.67)' },
  { value: 'varilux-174', label: 'Essilor — Varilux Physio (1.74)' },
  { value: 'zeiss-174', label: 'Zeiss — Progressive Individual (1.74)' },
  { value: 'hoya-160', label: 'Hoya — Lifestyle 3 (1.60)' },
  { value: 'nikon-167', label: 'Nikon — Lite 3 (1.67)' },
]

interface CompData {
  material: string
  abbe: number
  weight: number
  centerThickness: number
  warranty: string
  uv: boolean
  blueBlock: boolean
  fieldOfView: string
  avgPrice?: number
  compatibility: string
}

const MOCK_LENS_A: CompData = {
  material: 'Orgânico', abbe: 32, weight: 3.1, centerThickness: 1.0,
  warranty: '2 anos', uv: true, blueBlock: true, fieldOfView: 'Amplo',
  avgPrice: 850, compatibility: 'Alta',
}
const MOCK_LENS_B: CompData = {
  material: 'Orgânico', abbe: 36, weight: 2.7, centerThickness: 0.95,
  warranty: '3 anos', uv: true, blueBlock: false, fieldOfView: 'Muito Amplo',
  avgPrice: 1200, compatibility: 'Alta',
}

type CompRow = {
  key: keyof CompData
  label: string
  format: (v: CompData[keyof CompData]) => string
  higher?: 'better' | 'worse'    // null = neutral
  type?: 'bool'
}

const ROWS: CompRow[] = [
  { key: 'material', label: 'Material', format: (v) => String(v) },
  { key: 'abbe', label: 'Número de Abbe', format: (v) => String(v), higher: 'better' },
  { key: 'weight', label: 'Peso estimado', format: (v) => formatGrams(v as number), higher: 'worse' },
  { key: 'centerThickness', label: 'Espessura de centro', format: (v) => formatMm(v as number), higher: 'worse' },
  { key: 'warranty', label: 'Garantia', format: (v) => String(v) },
  { key: 'uv', label: 'Proteção UV', format: () => '', type: 'bool' },
  { key: 'blueBlock', label: 'Blue Block', format: () => '', type: 'bool' },
  { key: 'fieldOfView', label: 'Campo Visual', format: (v) => String(v) },
  { key: 'avgPrice', label: 'Preço médio', format: (v) => formatCurrency(v as number), higher: 'worse' },
  { key: 'compatibility', label: 'Compatibilidade', format: (v) => String(v) },
]

function winner(row: CompRow, a: CompData, b: CompData): 'A' | 'B' | 'tie' {
  if (!row.higher) return 'tie'
  const va = a[row.key] as number
  const vb = b[row.key] as number
  if (va === vb) return 'tie'
  if (row.higher === 'better') return va > vb ? 'A' : 'B'
  return va < vb ? 'A' : 'B'
}

export default function ComparisonPage() {
  const [lensA, setLensA] = useState('')
  const [lensB, setLensB] = useState('')
  const [compared, setCompared] = useState(false)

  const canCompare = lensA && lensB && lensA !== lensB

  const labelA = LENS_OPTIONS.find(o => o.value === lensA)?.label ?? 'Lente A'
  const labelB = LENS_OPTIONS.find(o => o.value === lensB)?.label ?? 'Lente B'

  const winsA = compared ? ROWS.filter(r => winner(r, MOCK_LENS_A, MOCK_LENS_B) === 'A').length : 0
  const winsB = compared ? ROWS.filter(r => winner(r, MOCK_LENS_A, MOCK_LENS_B) === 'B').length : 0

  return (
    <div className="page-enter">
      <PageHeader title="Comparador" subtitle="Compare duas lentes lado a lado" />

      <div className="p-6 space-y-5">
        {/* Selector row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="card-base p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
          <LensSelect label="Lente A" value={lensA} onChange={(v) => { setLensA(v); setCompared(false) }} options={LENS_OPTIONS} />
          <div className="flex justify-center">
            <GitCompareArrows className="w-5 h-5 text-text-tertiary" />
          </div>
          <LensSelect label="Lente B" value={lensB} onChange={(v) => { setLensB(v); setCompared(false) }} options={LENS_OPTIONS} />
          <Button disabled={!canCompare} onClick={() => setCompared(true)} icon={<GitCompareArrows className="w-4 h-4" />}>
            Comparar
          </Button>
        </motion.div>

        {/* Comparison table */}
        {compared && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="card-base overflow-hidden">
            {/* Headers */}
            <div className="grid grid-cols-[200px_1fr_1fr] border-b border-border">
              <div className="p-4" />
              {[
                { label: labelA.split('—')[1]?.trim() ?? labelA, wins: winsA, side: 'A' },
                { label: labelB.split('—')[1]?.trim() ?? labelB, wins: winsB, side: 'B' },
              ].map(({ label, wins, side }) => (
                <div key={side} className={`p-4 text-center border-l border-border ${wins > (side === 'A' ? winsB : winsA) ? 'bg-gold-subtle' : ''}`}>
                  {wins > (side === 'A' ? winsB : winsA) && (
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="w-3.5 h-3.5 text-gold" />
                      <span className="text-2xs font-bold text-gold uppercase tracking-wider">Recomendada</span>
                    </div>
                  )}
                  <p className="font-semibold text-sm text-text-primary">{label}</p>
                  <p className="text-2xs text-text-tertiary mt-0.5">{wins} vantagens</p>
                </div>
              ))}
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => {
              const w = winner(row, MOCK_LENS_A, MOCK_LENS_B)
              const va = MOCK_LENS_A[row.key]
              const vb = MOCK_LENS_B[row.key]

              return (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-[200px_1fr_1fr] border-b border-border last:border-0"
                >
                  <div className="p-4 flex items-center">
                    <span className="text-xs font-semibold text-text-secondary">{row.label}</span>
                  </div>
                  {([MOCK_LENS_A, MOCK_LENS_B] as const).map((lens, idx) => {
                    const isWinner = w === (idx === 0 ? 'A' : 'B')
                    const val = idx === 0 ? va : vb
                    return (
                      <div key={idx}
                        className={`p-4 text-center border-l border-border flex items-center justify-center
                          ${isWinner ? 'bg-success-light/30' : ''}`}>
                        {row.type === 'bool' ? (
                          val
                            ? <Check className="w-4 h-4 text-success mx-auto" />
                            : <X className="w-4 h-4 text-error mx-auto" />
                        ) : (
                          <span className={`text-sm tabular-nums ${isWinner ? 'font-semibold text-success-text' : 'text-text-secondary'}`}>
                            {row.format(val)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function LensSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: LensOption[]
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">{label}</p>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-9 py-2.5 text-sm bg-white border border-border rounded-lg
                     text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
      </div>
    </div>
  )
}
