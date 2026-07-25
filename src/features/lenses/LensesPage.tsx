import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, ChevronDown, Eye, GitCompareArrows } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'

interface Lens {
  id: string
  manufacturer: string
  line: string
  index: number
  material: string
  treatments: string[]
  abbeNumber: number
  diameter: number
  averagePrice?: number
}

const MOCK: Lens[] = [
  { id: '1', manufacturer: 'Essilor', line: 'Varilux Comfort', index: 1.67, material: 'Orgânico', treatments: ['AR', 'Blue Block'], abbeNumber: 32, diameter: 70, averagePrice: 850 },
  { id: '2', manufacturer: 'Zeiss', line: 'Progressive Individual', index: 1.74, material: 'Orgânico', treatments: ['AR', 'UV'], abbeNumber: 36, diameter: 65, averagePrice: 1200 },
  { id: '3', manufacturer: 'Hoya', line: 'Lifestyle 3', index: 1.60, material: 'Policarbonato', treatments: ['AR'], abbeNumber: 42, diameter: 70, averagePrice: 620 },
  { id: '4', manufacturer: 'Nikon', line: 'Lite 3', index: 1.67, material: 'Orgânico', treatments: ['AR', 'Fotossensível'], abbeNumber: 32, diameter: 70, averagePrice: 780 },
  { id: '5', manufacturer: 'Essilor', line: 'Crizal Rock', index: 1.56, material: 'Orgânico', treatments: ['AR', 'Hidrofóbico'], abbeNumber: 38, diameter: 65, averagePrice: 390 },
  { id: '6', manufacturer: 'Kodak', line: 'Unique HD', index: 1.61, material: 'Orgânico', treatments: ['AR', 'Blue Block'], abbeNumber: 40, diameter: 70, averagePrice: 540 },
  { id: '7', manufacturer: 'Zeiss', line: 'DuraVision', index: 1.50, material: 'Orgânico', treatments: ['AR'], abbeNumber: 58, diameter: 65, averagePrice: 290 },
]

const INDEX_OPTS = ['Todos', '1.49', '1.50', '1.56', '1.59', '1.60', '1.61', '1.67', '1.74']
const BRAND_OPTS = ['Todos', 'Essilor', 'Zeiss', 'Hoya', 'Nikon', 'Kodak']

export default function LensesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [indexFilter, setIndexFilter] = useState('Todos')
  const [brandFilter, setBrandFilter] = useState('Todos')
  const [page, setPage] = useState(1)

  const filtered = MOCK.filter((l) => {
    const matchSearch = l.line.toLowerCase().includes(search.toLowerCase()) ||
      l.manufacturer.toLowerCase().includes(search.toLowerCase())
    const matchIndex = indexFilter === 'Todos' || l.index === parseFloat(indexFilter)
    const matchBrand = brandFilter === 'Todos' || l.manufacturer === brandFilter
    return matchSearch && matchIndex && matchBrand
  })

  const columns: Column<Lens>[] = [
    {
      key: 'lens', label: 'Fabricante / Linha', sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-text-primary">{row.line}</p>
          <p className="text-2xs text-text-tertiary mt-0.5">{row.manufacturer}</p>
        </div>
      ),
    },
    {
      key: 'index', label: 'Índice', sortable: true,
      render: (row) => <Badge variant="navy" className="font-mono">{row.index}</Badge>,
    },
    {
      key: 'material', label: 'Material',
      render: (row) => <span className="text-sm text-text-secondary">{row.material}</span>,
    },
    {
      key: 'abbe', label: 'Abbe', sortable: true,
      render: (row) => (
        <span className={`text-sm font-semibold tabular-nums ${row.abbeNumber >= 40 ? 'text-success' : row.abbeNumber >= 32 ? 'text-warning-text' : 'text-error-text'}`}>
          {row.abbeNumber}
        </span>
      ),
    },
    {
      key: 'treatments', label: 'Tratamentos',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.treatments.map((t) => (
            <Badge key={t} variant="muted" className="text-2xs">{t}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'diameter', label: 'Diâmetro',
      render: (row) => <span className="text-sm text-text-secondary">{row.diameter} mm</span>,
    },
    {
      key: 'actions', label: '', width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button title="Detalhes" onClick={(e) => { e.stopPropagation(); navigate(`/lenses/${row.id}`) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-navy/8 text-text-tertiary hover:text-navy transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button title="Comparar" onClick={(e) => { e.stopPropagation(); navigate('/comparison') }}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-navy/8 text-text-tertiary hover:text-navy transition-colors">
            <GitCompareArrows className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="page-enter">
      <PageHeader
        title="Banco de Lentes"
        subtitle={`${MOCK.length} lentes cadastradas`}
        actions={<Button icon={<Plus className="w-4 h-4" />}>Nova Lente</Button>}
      />

      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar lente ou fabricante…" className="w-72" />
          <FilterSelect label="Índice" options={INDEX_OPTS} value={indexFilter} onChange={setIndexFilter} />
          <FilterSelect label="Fabricante" options={BRAND_OPTS} value={brandFilter} onChange={setBrandFilter} />
          {(indexFilter !== 'Todos' || brandFilter !== 'Todos') && (
            <button onClick={() => { setIndexFilter('Todos'); setBrandFilter('Todos') }}
              className="text-xs text-gold hover:text-gold-light font-medium transition-colors">
              Limpar filtros
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-base overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => navigate(`/lenses/${r.id}`)}
            emptyTitle="Nenhuma lente encontrada"
            emptyDescription="Tente ajustar os filtros ou cadastre uma nova lente."
          />
          <Pagination page={page} totalPages={Math.ceil(filtered.length / 10)} total={filtered.length} pageSize={10} onPageChange={setPage} />
        </motion.div>
      </div>
    </div>
  )
}

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-border rounded-lg
                   text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50
                   cursor-pointer transition-all"
      >
        {options.map((o) => <option key={o} value={o}>{o === 'Todos' ? `${label}: Todos` : o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
    </div>
  )
}
