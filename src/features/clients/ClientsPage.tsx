import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  UserPlus, Filter, Download, Eye, Pencil, Trash2,
  Phone, Mail, X, User, Calendar, MapPin, FileText,
  ClipboardList, CheckCircle2, ChevronDown,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Pagination } from '@/components/ui/Pagination'
import { formatDate, getInitials } from '@/utils/format'

/* ── Tipos ── */
interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  cpf?: string
  birthDate?: string
  address?: string
  notes?: string
  prescriptionCount: number
  lastVisit?: string
  status: 'active' | 'inactive'
}

/* ── Schema do olho ── */
const eyeSchema = z.object({
  spherical: z.number({ invalid_type_error: 'Obrigatório' }).min(-30).max(30),
  cylindrical: z.number().min(-10).max(0).optional().nullable(),
  axis: z.number().min(0).max(180).optional().nullable(),
  dnp: z.number().min(20).max(40, 'DNP inválido').optional().nullable(),
  addition: z.number().min(0).max(4).optional().nullable(),
})

/* ── Schema do formulário completo ── */
const newClientSchema = z.object({
  // Dados pessoais — OBRIGATÓRIOS
  name:      z.string().min(3, 'Informe o nome completo'),
  birthDate: z.string().min(1, 'Informe a data de nascimento'),
  phone:     z.string().min(10, 'Telefone inválido').regex(/^[\d\s()\-+]+$/, 'Telefone inválido'),
  cpf:       z.string().min(11, 'CPF inválido').regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),

  // Dados pessoais — OPCIONAIS
  email:   z.string().email('E-mail inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  notes:   z.string().optional(),

  // Receita — se addPrescription = true, OD esférico vira obrigatório
  addPrescription: z.boolean().default(false),
  prescriptionType: z.enum(['single', 'progressive', 'bifocal']).optional(),
  od: eyeSchema.optional(),
  oe: eyeSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.addPrescription) {
    if (data.od?.spherical === undefined || data.od?.spherical === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['od', 'spherical'] })
    }
    if (data.oe?.spherical === undefined || data.oe?.spherical === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['oe', 'spherical'] })
    }
  }
})

type NewClientFormData = z.infer<typeof newClientSchema>

const PRESCRIPTION_TYPES = [
  { value: 'single',      label: 'Visão Simples' },
  { value: 'progressive', label: 'Multifocal' },
  { value: 'bifocal',     label: 'Bifocal' },
]

/* ── Mock data ── */
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Maria Santos',   email: 'maria@email.com',    phone: '(11) 98765-4321', cpf: '123.456.789-00', prescriptionCount: 5, lastVisit: '2024-09-15', status: 'active' },
  { id: '2', name: 'João Pereira',   email: 'joao@email.com',     phone: '(11) 91234-5678', cpf: '234.567.890-11', prescriptionCount: 1, lastVisit: '2024-09-15', status: 'active' },
  { id: '3', name: 'Ana Lima',       email: 'ana@email.com',      phone: '(21) 99876-5432', cpf: '345.678.901-22', prescriptionCount: 7, lastVisit: '2024-09-14', status: 'active' },
  { id: '4', name: 'Carlos Mendes',  email: 'carlos@email.com',   phone: '(31) 98765-0000', cpf: '456.789.012-33', prescriptionCount: 3, lastVisit: '2024-09-14', status: 'inactive' },
  { id: '5', name: 'Fernanda Costa', email: 'fernanda@email.com', phone: '(41) 97654-3210', cpf: '567.890.123-44', prescriptionCount: 2, lastVisit: '2024-09-13', status: 'active' },
  { id: '6', name: 'Ricardo Alves',  email: 'ricardo@email.com',  phone: '(51) 96543-2109', cpf: '678.901.234-55', prescriptionCount: 4, lastVisit: '2024-09-12', status: 'active' },
  { id: '7', name: 'Patrícia Nunes', email: 'patricia@email.com', phone: '(61) 95432-1098', cpf: '789.012.345-66', prescriptionCount: 6, lastVisit: '2024-09-10', status: 'active' },
]

/* ════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════ */
export default function ClientsPage() {
  const navigate = useNavigate()
  const [clients, setClients]     = useState<Client[]>(MOCK_CLIENTS)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [successName, setSuccessName] = useState<string | null>(null)

  const PAGE_SIZE = 10
  const filtered  = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()),
  )

  function handleClientCreated(data: NewClientFormData) {
    const newClient: Client = {
      id: String(Date.now()),
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birthDate,
      address: data.address || undefined,
      notes: data.notes || undefined,
      prescriptionCount: data.addPrescription ? 1 : 0,
      lastVisit: data.addPrescription ? new Date().toISOString().split('T')[0] : undefined,
      status: 'active',
    }
    setClients((prev) => [newClient, ...prev])
    setSuccessName(data.name)
    setModalOpen(false)
    setTimeout(() => setSuccessName(null), 4000)
  }

  const columns: Column<Client>[] = [
    {
      key: 'name', label: 'Cliente', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy to-navy-light
                          flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {getInitials(row.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{row.name}</p>
            {row.email && (
              <p className="text-2xs text-text-tertiary flex items-center gap-1 mt-0.5">
                <Mail className="w-2.5 h-2.5" /> {row.email}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'phone', label: 'Telefone',
      render: (row) => row.phone
        ? <span className="flex items-center gap-1.5 text-sm text-text-secondary"><Phone className="w-3 h-3" />{row.phone}</span>
        : <span className="text-text-tertiary">—</span>,
    },
    {
      key: 'prescriptionCount', label: 'Receitas', sortable: true,
      render: (row) => (
        <Badge variant="navy">{row.prescriptionCount} {row.prescriptionCount === 1 ? 'receita' : 'receitas'}</Badge>
      ),
    },
    {
      key: 'lastVisit', label: 'Última visita', sortable: true,
      render: (row) => <span className="text-sm text-text-secondary">{formatDate(row.lastVisit)}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'muted'} dot>
          {row.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: '', width: '120px',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn icon={Eye}    label="Ver"    onClick={() => navigate(`/clients/${row.id}`)} />
          <ActionBtn icon={Pencil} label="Editar" />
          <ActionBtn icon={Trash2} label="Excluir" danger />
        </div>
      ),
    },
  ]

  return (
    <div className="page-enter">
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} clientes cadastrados`}
        actions={
          <Button icon={<UserPlus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Novo Cliente
          </Button>
        }
      />

      <div className="p-6 space-y-4">

        {/* Toast de sucesso */}
        <AnimatePresence>
          {successName && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 p-4 bg-success-light border border-success/20 rounded-xl text-success-text"
            >
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <p className="text-sm font-medium">
                Cliente <strong>{successName}</strong> cadastrado com sucesso!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          className="flex items-center gap-3 flex-wrap"
        >
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou e-mail…" className="w-72" />
          <Button variant="secondary" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>Filtros</Button>
          <Button variant="ghost" size="sm" icon={<Download className="w-3.5 h-3.5" />} className="ml-auto">Exportar</Button>
        </motion.div>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
          className="card-base overflow-hidden"
        >
          <DataTable
            columns={columns} data={filtered} keyExtractor={(r) => r.id}
            onRowClick={(r) => navigate(`/clients/${r.id}`)}
            emptyTitle="Nenhum cliente encontrado"
            emptyDescription="Tente ajustar a busca ou cadastre um novo cliente."
          />
          <Pagination
            page={page} totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
            total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage}
          />
        </motion.div>
      </div>

      <NewClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleClientCreated}
      />
    </div>
  )
}

/* ════════════════════════════════════════
   MODAL NOVO CLIENTE
════════════════════════════════════════ */
interface NewClientModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: NewClientFormData) => void
}

function NewClientModal({ open, onClose, onSubmit }: NewClientModalProps) {
  const {
    register, handleSubmit, reset, watch, control,
    formState: { errors, isSubmitting },
  } = useForm<NewClientFormData>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      addPrescription: false,
      prescriptionType: 'single',
    },
  })

  // Observa se o toggle de receita está ativo
  const addPrescription   = watch('addPrescription')
  const prescriptionType  = watch('prescriptionType')
  const showAddition      = prescriptionType === 'progressive' || prescriptionType === 'bifocal'

  function handleClose() { reset(); onClose() }

  async function handleFormSubmit(data: NewClientFormData) {
    await new Promise((r) => setTimeout(r, 600))
    onSubmit(data)
    reset()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-2xl bg-white rounded-2xl shadow-xl
                         overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-navy/6 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy">Novo Cliente</h2>
                    <p className="text-xs text-text-tertiary mt-0.5">Preencha os dados do cliente</p>
                  </div>
                </div>
                <button onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             hover:bg-navy/5 text-text-tertiary hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corpo com scroll */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                  {/* ── Dados Pessoais ── */}
                  <FormSection icon={User} title="Dados Pessoais">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ModalField label="Nome completo" required error={errors.name?.message} className="sm:col-span-2">
                        <input {...register('name')} placeholder="Ex: Maria Santos" className={fieldClass(!!errors.name)} />
                      </ModalField>
                      <ModalField label="Data de nascimento" required error={errors.birthDate?.message}>
                        <input {...register('birthDate')} type="date" className={fieldClass(!!errors.birthDate)} />
                      </ModalField>
                      <ModalField label="CPF" required error={errors.cpf?.message}>
                        <input {...register('cpf')} placeholder="000.000.000-00" className={fieldClass(!!errors.cpf)} />
                      </ModalField>
                    </div>
                  </FormSection>

                  {/* ── Contato ── */}
                  <FormSection icon={Phone} title="Contato">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ModalField label="Telefone" required error={errors.phone?.message}>
                        <input {...register('phone')} placeholder="(11) 99999-9999" className={fieldClass(!!errors.phone)} />
                      </ModalField>
                      <ModalField label="E-mail" error={errors.email?.message}>
                        <input {...register('email')} type="email" placeholder="email@exemplo.com" className={fieldClass(!!errors.email)} />
                      </ModalField>
                    </div>
                  </FormSection>

                  {/* ── Endereço ── */}
                  <FormSection icon={MapPin} title="Endereço">
                    <ModalField label="Endereço completo">
                      <input {...register('address')} placeholder="Rua, número, bairro, cidade, estado" className={fieldClass(false)} />
                    </ModalField>
                  </FormSection>

                  {/* ── Observações ── */}
                  <FormSection icon={ClipboardList} title="Observações">
                    <ModalField label="Observações sobre o cliente">
                      <textarea {...register('notes')} rows={3}
                        placeholder="Ex: Prefere lentes Essilor. Sensível a reflexos..."
                        className={`${fieldClass(false)} resize-none`} />
                    </ModalField>
                  </FormSection>

                  {/* ── Receita ── */}
                  <FormSection icon={FileText} title="Receita">

                    {/* Toggle de adicionar receita */}
                    <Controller
                      name="addPrescription"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl
                                          border border-border hover:border-gold/40 hover:bg-gold/3 transition-all">
                          {/* Switch visual */}
                          <div
                            onClick={() => field.onChange(!field.value)}
                            className={`relative w-10 h-5 rounded-full transition-colors shrink-0
                              ${field.value ? 'bg-navy' : 'bg-border'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                              ${field.value ? 'left-5' : 'left-0.5'}`} />
                          </div>
                          <input type="checkbox" className="sr-only" checked={!!field.value} onChange={field.onChange} />
                          <div>
                            <p className="text-sm font-medium text-text-primary">Adicionar receita agora</p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              Preencha a prescrição oftálmica do cliente
                            </p>
                          </div>
                        </label>
                      )}
                    />

                    {/* Formulário de receita — aparece ao ativar o toggle */}
                    <AnimatePresence>
                      {addPrescription && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">

                            {/* Tipo de receita */}
                            <div>
                              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                                Tipo de receita
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {PRESCRIPTION_TYPES.map((type) => (
                                  <label
                                    key={type.value}
                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2
                                      cursor-pointer text-sm font-medium transition-all
                                      ${prescriptionType === type.value
                                        ? 'border-navy bg-navy text-white'
                                        : 'border-border text-text-secondary hover:border-navy/30 hover:text-text-primary'
                                      }`}
                                  >
                                    <input
                                      {...register('prescriptionType')}
                                      type="radio"
                                      value={type.value}
                                      className="sr-only"
                                    />
                                    {type.label}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* OD e OE lado a lado — mesmo padrão da calculadora */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <EyeFormBlock
                                prefix="od"
                                label="Olho Direito"
                                register={register}
                                errors={errors}
                                showAddition={showAddition}
                              />
                              <EyeFormBlock
                                prefix="oe"
                                label="Olho Esquerdo"
                                register={register}
                                errors={errors}
                                showAddition={showAddition}
                              />
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormSection>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-background">
                  <p className="text-xs text-text-tertiary">
                    Campos com <span className="text-error font-semibold">*</span> são obrigatórios
                  </p>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm" loading={isSubmitting}
                      icon={!isSubmitting ? <CheckCircle2 className="w-3.5 h-3.5" /> : undefined}>
                      Salvar cliente
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════════
   BLOCO DE OLHO (OD / OE) — mesmo padrão da calculadora
════════════════════════════════════════ */
function EyeFormBlock({ prefix, label, register, errors, showAddition }: {
  prefix: 'od' | 'oe'
  label: string
  register: ReturnType<typeof useForm>['register']
  errors: Record<string, unknown>
  showAddition: boolean
}) {
  const eyeErrors = (errors[prefix] as Record<string, { message?: string }> | undefined) ?? {}

  return (
    <div className="p-4 rounded-xl border border-border bg-background space-y-3">

      {/* Header do olho */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${prefix === 'od' ? 'bg-navy' : 'bg-gold'}`} />
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
          {label} <span className="text-text-tertiary font-normal normal-case">({prefix.toUpperCase()})</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">

        {/* Esférico — OBRIGATÓRIO quando receita ativa */}
        <ModalField label="Esférico" required error={eyeErrors.spherical?.message}>
          <input
            {...register(`${prefix}.spherical`, { valueAsNumber: true })}
            type="number" step="0.25" placeholder="-2.00"
            className={fieldClass(!!eyeErrors.spherical)}
          />
        </ModalField>

        {/* Cilíndrico — só negativo */}
        <ModalField label="Cilíndrico">
          <input
            {...register(`${prefix}.cylindrical`, { valueAsNumber: true })}
            type="number" step="0.25" max={0} placeholder="-0.25"
            className={fieldClass(false)}
          />
        </ModalField>

        {/* Eixo */}
        <ModalField label="Eixo">
          <input
            {...register(`${prefix}.axis`, { valueAsNumber: true })}
            type="number" step="1" min={0} max={180} placeholder="90°"
            className={fieldClass(false)}
          />
        </ModalField>

        {/* DNP */}
        <ModalField label="DNP" error={eyeErrors.dnp?.message}>
          <input
            {...register(`${prefix}.dnp`, { valueAsNumber: true })}
            type="number" step="0.5" placeholder="32.0"
            className={fieldClass(!!eyeErrors.dnp)}
          />
        </ModalField>

        {/* Adição — só aparece em multifocal e bifocal */}
        <AnimatePresence>
          {showAddition && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="col-span-2"
            >
              <ModalField label="Adição">
                <input
                  {...register(`${prefix}.addition`, { valueAsNumber: true })}
                  type="number" step="0.25" min={0} max={4} placeholder="Ex: +2.00"
                  className={fieldClass(false)}
                />
              </ModalField>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   SUB-COMPONENTES
════════════════════════════════════════ */
function FormSection({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-gold" />
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ModalField({ label, required, error, children, className }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-2xs text-error flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2.5 text-sm bg-white border rounded-lg
    placeholder:text-text-tertiary text-text-primary
    focus:outline-none focus:ring-2 transition-all
    ${hasError
      ? 'border-error bg-error-light/20 focus:ring-error/20 focus:border-error/60'
      : 'border-border hover:border-border-strong focus:ring-gold/30 focus:border-gold/50'
    }`
}

function ActionBtn({ icon: Icon, label, onClick, danger }: {
  icon: React.ElementType; label: string; onClick?: () => void; danger?: boolean
}) {
  return (
    <button
      title={label}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors
        ${danger
          ? 'hover:bg-error-light text-text-tertiary hover:text-error'
          : 'hover:bg-navy/8 text-text-tertiary hover:text-navy'
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}