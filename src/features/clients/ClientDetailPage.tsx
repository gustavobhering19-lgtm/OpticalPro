import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, Calendar, FileText, Pencil, Plus, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatDiopter, getInitials } from '@/utils/format'

const MOCK_CLIENT = {
  id: '1',
  name: 'Maria Santos',
  email: 'maria@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  birthDate: '1985-03-22',
  address: 'Rua das Flores, 123 — São Paulo, SP',
  notes: 'Cliente fiel. Prefere lentes Essilor. Sensível a reflexos.',
  status: 'active' as const,
  prescriptions: [
    { id: 'r1', date: '2024-09-15', od: { s: -2.5, c: -0.75, a: 90 }, oe: { s: -3.0, c: -1.0, a: 85 }, index: 1.67 },
    { id: 'r2', date: '2024-06-10', od: { s: -2.25, c: -0.5, a: 90 }, oe: { s: -2.75, c: -0.75, a: 85 }, index: 1.61 },
    { id: 'r3', date: '2024-01-20', od: { s: -2.0, c: -0.5, a: 90 }, oe: { s: -2.5, c: -0.5, a: 85 }, index: 1.56 },
  ],
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const client = MOCK_CLIENT // In prod: useQuery by id

  return (
    <div className="page-enter">
      <PageHeader
        title={client.name}
        subtitle="Ficha do cliente"
        breadcrumb={
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Clientes
          </button>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Pencil className="w-3.5 h-3.5" />}>Editar</Button>
            <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Nova Receita</Button>
          </>
        }
      />

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: info card */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="card-base p-6 space-y-5"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-xl font-bold">
              {getInitials(client.name)}
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">{client.name}</h2>
              <Badge variant={client.status === 'active' ? 'success' : 'muted'} dot className="mt-1">
                {client.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            <InfoRow icon={Mail} label="E-mail" value={client.email} />
            <InfoRow icon={Phone} label="Telefone" value={client.phone} />
            <InfoRow icon={Calendar} label="Nascimento" value={formatDate(client.birthDate)} />
            <InfoRow icon={FileText} label="CPF" value={client.cpf} />
          </div>

          {/* Address */}
          <div className="pt-4 border-t border-border">
            <p className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Endereço</p>
            <p className="text-sm text-text-secondary">{client.address}</p>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-border">
            <p className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Observações</p>
            <p className="text-sm text-text-secondary leading-relaxed">{client.notes}</p>
          </div>
        </motion.div>

        {/* Right: prescription history */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="xl:col-span-2 card-base overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              <h3 className="font-semibold text-sm text-text-primary">Histórico de Receitas</h3>
            </div>
            <Badge variant="navy">{client.prescriptions.length} receitas</Badge>
          </div>

          <div className="divide-y divide-border">
            {client.prescriptions.map((rx, i) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
                className="px-5 py-4 hover:bg-navy/[0.02] cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-navy/50" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{formatDate(rx.date)}</p>
                      <p className="text-2xs text-text-tertiary mt-0.5">Índice {rx.index}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <PrescriptionCard label="OD" data={rx.od} />
                  <PrescriptionCard label="OE" data={rx.oe} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-text-tertiary" />
      </div>
      <div className="min-w-0">
        <p className="text-2xs text-text-tertiary">{label}</p>
        <p className="text-sm text-text-primary truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function PrescriptionCard({ label, data }: { label: string; data: { s: number; c: number; a: number } }) {
  return (
    <div className="p-3 rounded-xl bg-background border border-border">
      <p className="text-2xs font-bold text-text-tertiary uppercase tracking-wider mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-1 text-center">
        {[
          { l: 'ESF', v: formatDiopter(data.s) },
          { l: 'CIL', v: formatDiopter(data.c) },
          { l: 'EIXO', v: `${data.a}°` },
        ].map(({ l, v }) => (
          <div key={l}>
            <p className="text-2xs text-text-tertiary">{l}</p>
            <p className="text-xs font-semibold text-text-primary tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
