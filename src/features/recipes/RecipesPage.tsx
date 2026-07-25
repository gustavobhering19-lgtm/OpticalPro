import { useState } from 'react'
import { motion } from 'framer-motion'
import { FilePlus, Filter, Download, Eye, Calculator } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'
import { formatDate, formatDiopter, getInitials } from '@/utils/format'

interface Recipe {
  id: string
  clientName: string
  date: string
  od: { s: number; c: number | null; a: number | null }
  oe: { s: number; c: number | null; a: number | null }
  index: number
  type: 'single' | 'progressive' | 'bifocal'
}

const MOCK: Recipe[] = [
  { id: '1', clientName: 'Maria Santos', date: '2024-09-15', od: { s: -2.5, c: -0.75, a: 90 }, oe: { s: -3.0, c: -1.0, a: 85 }, index: 1.67, type: 'progressive' },
  { id: '2', clientName: 'João Pereira', date: '2024-09-15', od: { s: 1.25, c: null, a: null }, oe: { s: 1.0, c: null, a: null }, index: 1.56, type: 'single' },
  { id: '3', clientName: 'Ana Lima', date: '2024-09-14', od: { s: -5.0, c: -1.5, a: 180 }, oe: { s: -4.75, c: -1.25, a: 175 }, index: 1.74, type: 'single' },
  { id: '4', clientName: 'Carlos Mendes', date: '2024-09-14', od: { s: -1.0, c: -0.5, a: 45 }, oe: { s: -1.25, c: -0.75, a: 50 }, index: 1.56, type: 'progressive' },
  { id: '5', clientName: 'Fernanda Costa', date: '2024-09-13', od: { s: 3.0, c: null, a: null }, oe: { s: 2.75, c: null, a: null }, index: 1.61, type: 'bifocal' },
]

const TYPE_LABELS: Record<Recipe['type'], string> = {
  single: 'Visão Simples',
  progressive: 'Multifocal',
  bifocal: 'Bifocal',
}
const TYPE_BADGE: Record<Recipe['type'], 'navy' | 'gold' | 'info'> = {
  single: 'navy', progressive: 'gold', bifocal: 'info',
}

export default function RecipesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = MOCK.filter((r) =>
    r.clientName.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: Column<Recipe>[] = [
    {
      key: 'client',
      label: 'Cliente',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {getInitials(row.clientName)}
          </div>
          <span className="text-sm font-medium text-text-primary">{row.clientName}</span>
        </div>
      ),
    },
    {
      key: 'date', label: 'Data', sortable: true,
      render: (row) => <span className="text-sm text-text-secondary">{formatDate(row.date)}</span>,
    },
    {
      key: 'od', label: 'OD',
      render: (row) => (
        <span className="text-sm font-mono text-text-primary">
          {formatDiopter(row.od.s)} {row.od.c ? `/ ${formatDiopter(row.od.c)}` : ''}
        </span>
      ),
    },
    {
      key: 'oe', label: 'OE',
      render: (row) => (
        <span className="text-sm font-mono text-text-primary">
          {formatDiopter(row.oe.s)} {row.oe.c ? `/ ${formatDiopter(row.oe.c)}` : ''}
        </span>
      ),
    },
    {
      key: 'index', label: 'Índice',
      render: (row) => <Badge variant="navy">{row.index}</Badge>,
    },
    {
      key: 'type', label: 'Tipo',
      render: (row) => <Badge variant={TYPE_BADGE[row.type]}>{TYPE_LABELS[row.type]}</Badge>,
    },
    {
      key: 'actions', label: '', width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn icon={Eye} label="Ver" />
          <ActionBtn icon={Calculator} label="Calcular" onClick={() => navigate('/calculator')} />
        </div>
      ),
    },
  ]

  return (
    <div className="page-enter">
      <PageHeader
        title="Receitas"
        subtitle="Histórico de prescrições oftálmicas"
        actions={<Button icon={<FilePlus className="w-4 h-4" />}>Nova Receita</Button>}
      />

      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por cliente…" className="w-72" />
          <Button variant="secondary" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>Filtros</Button>
          <Button variant="ghost" size="sm" icon={<Download className="w-3.5 h-3.5" />} className="ml-auto">Exportar</Button>
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
            emptyTitle="Nenhuma receita encontrada"
          />
          <Pagination page={page} totalPages={Math.ceil(filtered.length / 10)} total={filtered.length} pageSize={10} onPageChange={setPage} />
        </motion.div>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <button
      title={label}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-navy/8 text-text-tertiary hover:text-navy transition-colors"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}
