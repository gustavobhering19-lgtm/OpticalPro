import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, ScanLine, Info } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Marking {
  id: string
  symbol: string
  manufacturer: string
  line: string
  type: string
  compatibility: string[]
  description: string
}

const MOCK_MARKINGS: Marking[] = [
  { id: '1', symbol: 'Z', manufacturer: 'Zeiss', line: 'Progressive Individual', type: 'Multifocal', compatibility: ['1.50', '1.60', '1.67', '1.74'], description: 'Marcação principal da linha Progressive Individual da Zeiss. Indica a zona de progressão otimizada.' },
  { id: '2', symbol: 'VX', manufacturer: 'Essilor', line: 'Varilux', type: 'Multifocal', compatibility: ['1.56', '1.60', '1.67', '1.74'], description: 'Símbolo da linha Varilux da Essilor. Identifica lentes com tecnologia W.A.V.E. 2.' },
  { id: '3', symbol: 'LS3', manufacturer: 'Hoya', line: 'Lifestyle 3', type: 'Multifocal', compatibility: ['1.50', '1.60', '1.67'], description: 'Marcação da linha Lifestyle 3 da Hoya. Lente com design binocular intuitivo.' },
  { id: '4', symbol: 'NK', manufacturer: 'Nikon', line: 'Lite 3', type: 'Multifocal', compatibility: ['1.56', '1.60', '1.67'], description: 'Símbolo da linha Lite da Nikon. Alta nitidez nas zonas de transição.' },
]

export default function MarkingsPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Marking | null>(null)
  const [notFound, setNotFound] = useState(false)

  function handleSearch() {
    const found = MOCK_MARKINGS.find(m =>
      m.symbol.toLowerCase() === query.trim().toLowerCase(),
    )
    setResult(found ?? null)
    setNotFound(!found && query.trim().length > 0)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="page-enter">
      <PageHeader
        title="Marcações"
        subtitle="Identifique marcações de lentes oftálmicas"
      />

      <div className="p-6 space-y-6 max-w-2xl">
        {/* Search card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <h2 className="font-semibold text-sm text-text-primary mb-1 flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-gold" /> Pesquisar Marcação
          </h2>
          <p className="text-xs text-text-secondary mb-4">Digite o símbolo ou código encontrado na lente</p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setResult(null); setNotFound(false) }}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Z, VX, LS3…"
                className="w-full pl-9 pr-4 py-3 text-base bg-background border border-border rounded-xl
                           placeholder:text-text-tertiary text-text-primary font-mono
                           focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim()}>Identificar</Button>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-tertiary mb-2">Exemplos de marcações disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_MARKINGS.map((m) => (
                <button key={m.id}
                  onClick={() => { setQuery(m.symbol); setResult(null); setNotFound(false) }}
                  className="px-2.5 py-1 text-xs font-mono font-semibold bg-background border border-border rounded-lg
                             hover:border-gold/50 hover:text-gold transition-all">
                  {m.symbol}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upload card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="card-base p-6 border-dashed border-2 border-border hover:border-gold/40 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-gold/8 transition-colors">
              <Upload className="w-5 h-5 text-text-tertiary group-hover:text-gold transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Identificar por imagem</p>
              <p className="text-xs text-text-secondary mt-0.5">Arraste uma foto da marcação ou clique para selecionar</p>
            </div>
            <Badge variant="warning">Em breve · OCR com IA</Badge>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card-base overflow-hidden"
            >
              <div className="bg-gradient-to-br from-navy to-navy-light p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-2xl font-bold font-mono shrink-0">
                    {result.symbol}
                  </div>
                  <div>
                    <p className="text-xs text-gold uppercase tracking-widest font-semibold mb-1">{result.manufacturer}</p>
                    <h3 className="text-lg font-display font-semibold text-white">{result.line}</h3>
                    <Badge variant="gold" className="mt-2">{result.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 p-3.5 bg-background rounded-xl border border-border">
                  <Info className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                  <p className="text-sm text-text-secondary leading-relaxed">{result.description}</p>
                </div>

                <div>
                  <p className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Compatibilidade de Índices</p>
                  <div className="flex flex-wrap gap-2">
                    {result.compatibility.map(c => <Badge key={c} variant="navy" className="font-mono">{c}</Badge>)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card-base p-8 text-center"
            >
              <ScanLine className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
              <p className="font-semibold text-text-primary">Marcação não encontrada</p>
              <p className="text-sm text-text-secondary mt-1">
                A marcação "<strong>{query}</strong>" não está no banco de dados. Tente enviar uma imagem.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
