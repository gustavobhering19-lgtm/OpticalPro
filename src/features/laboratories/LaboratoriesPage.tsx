import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Mail, MapPin, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'

interface Laboratory {
  id: string
  name: string
  city: string
  state: string
  phone?: string
  email?: string
  status: 'active' | 'inactive' | 'pending'
  integrations: string[]
}

const MOCK: Laboratory[] = [
  { id: '1', name: 'Lab Óptico SP', city: 'São Paulo', state: 'SP', phone: '(11) 3333-4444', email: 'contato@labsp.com.br', status: 'active', integrations: ['API', 'EDI'] },
  { id: '2', name: 'Óptika Lab Rio', city: 'Rio de Janeiro', state: 'RJ', phone: '(21) 2222-5555', email: 'lab@optika.com.br', status: 'active', integrations: ['API'] },
  { id: '3', name: 'LensCenter BH', city: 'Belo Horizonte', state: 'MG', phone: '(31) 3444-6666', email: '', status: 'pending', integrations: [] },
  { id: '4', name: 'SulLab Curitiba', city: 'Curitiba', state: 'PR', phone: '(41) 3555-7777', email: 'sul@sullab.com.br', status: 'active', integrations: ['EDI'] },
  { id: '5', name: 'NorteVis Manaus', city: 'Manaus', state: 'AM', phone: '(92) 3666-8888', email: '', status: 'inactive', integrations: [] },
]

const STATUS_LABELS: Record<Laboratory['status'], string> = {
  active: 'Ativo', inactive: 'Inativo', pending: 'Pendente',
}
const STATUS_BADGE: Record<Laboratory['status'], 'success' | 'muted' | 'warning'> = {
  active: 'success', inactive: 'muted', pending: 'warning',
}

export default function LaboratoriesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = MOCK.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: Column<Laboratory>[] = [
    {
      key: 'name', label: 'Laboratório', sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-text-primary">{row.name}</p>
          <p className="text-2xs text-text-tertiary flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5" /> {row.city}, {row.state}
          </p>
        </div>
      ),
    },
    {
      key: 'contact', label: 'Contato',
      render: (row) => (
        <div className="space-y-0.5">
          {row.phone && <p className="text-xs text-text-secondary flex items-center gap-1"><Phone className="w-3 h-3" /> {row.phone}</p>}
          {row.email && <p className="text-xs text-text-secondary flex items-center gap-1"><Mail className="w-3 h-3" /> {row.email}</p>}
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <Badge variant={STATUS_BADGE[row.status]} dot>{STATUS_LABELS[row.status]}</Badge>,
    },
    {
      key: 'integrations', label: 'Integrações',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.integrations.length > 0
            ? row.integrations.map((i) => (
              <Badge key={i} variant="navy" className="flex items-center gap-1">
                <Link2 className="w-2.5 h-2.5" /> {i}
              </Badge>
            ))
            : <span className="text-2xs text-text-tertiary">—</span>
          }
        </div>
      ),
    },
    {
      key: 'actions', label: '', width: '80px',
      render: () => (
        <Button variant="ghost" size="xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
          Detalhes
        </Button>
      ),
    },
  ]

  return (
    <div className="page-enter">
      <PageHeader
        title="Laboratórios"
        subtitle={`${MOCK.length} laboratórios cadastrados`}
        actions={<Button icon={<Plus className="w-4 h-4" />}>Novo Laboratório</Button>}
      />

      <div className="p-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar laboratório ou cidade…" className="w-72" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base overflow-hidden">
          <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyTitle="Nenhum laboratório encontrado" />
          <Pagination page={page} totalPages={Math.ceil(filtered.length / 10)} total={filtered.length} pageSize={10} onPageChange={setPage} />
        </motion.div>
      </div>
    </div>
  )
}
