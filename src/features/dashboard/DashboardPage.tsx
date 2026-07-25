import { motion } from 'framer-motion'
import {
  FileText, Users, ArrowLeftRight, Layers,
  Calculator, Clock, AlertCircle, ChevronRight,
  TrendingUp,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatDiopter } from '@/utils/format'

/* ── Mock data (substituir por TanStack Query + API) ── */
const STATS = [
  { title: 'Receitas Calculadas', value: '1.284', icon: FileText, trend: 12, color: 'navy' as const },
  { title: 'Clientes', value: '347', icon: Users, trend: 8, color: 'gold' as const },
  { title: 'Conversões', value: '93', icon: ArrowLeftRight, trend: -3, color: 'success' as const },
  { title: 'Lentes Cadastradas', value: '2.041', icon: Layers, trend: 5, color: 'warning' as const },
]

const USAGE_DATA = [
  { month: 'Abr', calculos: 84, conversoes: 12 },
  { month: 'Mai', calculos: 98, conversoes: 18 },
  { month: 'Jun', calculos: 112, conversoes: 14 },
  { month: 'Jul', calculos: 91, conversoes: 21 },
  { month: 'Ago', calculos: 134, conversoes: 19 },
  { month: 'Set', calculos: 158, conversoes: 27 },
]

const RECENT_CALCULATIONS = [
  { id: '1', client: 'Maria Santos', date: '2024-09-15', od: -2.5, oe: -3.0, index: 1.67 },
  { id: '2', client: 'João Pereira', date: '2024-09-15', od: 1.25, oe: 1.0, index: 1.56 },
  { id: '3', client: 'Ana Lima', date: '2024-09-14', od: -5.0, oe: -4.75, index: 1.74 },
  { id: '4', client: 'Carlos Mendes', date: '2024-09-14', od: -1.0, oe: -1.25, index: 1.56 },
  { id: '5', client: 'Fernanda Costa', date: '2024-09-13', od: 3.0, oe: 2.75, index: 1.61 },
]

const RECENT_CLIENTS = [
  { id: '1', name: 'Maria Santos', email: 'maria@email.com', visits: 3, lastVisit: '2024-09-15' },
  { id: '2', name: 'João Pereira', email: 'joao@email.com', visits: 1, lastVisit: '2024-09-15' },
  { id: '3', name: 'Ana Lima', email: 'ana@email.com', visits: 7, lastVisit: '2024-09-14' },
]

const ALERTS = [
  { id: '1', type: 'warning' as const, message: 'Licença expira em 12 dias. Renove para continuar.' },
  { id: '2', type: 'info' as const, message: '23 novas lentes adicionadas ao banco de dados.' },
  { id: '3', type: 'success' as const, message: 'Integração com Lab Óptico SP sincronizada.' },
]

export default function DashboardPage() {
  return (
    <div className="page-enter">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      <div className="p-6 space-y-6">
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.title} {...stat} index={i} />
          ))}
        </div>

        {/* ── Row 2: chart + recent calc ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="xl:col-span-3 card-base p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-navy">Utilização</h2>
                <p className="text-xs text-text-secondary mt-0.5">Cálculos e conversões por mês</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-navy inline-block" /> Cálculos
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block" /> Conversões
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={USAGE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D1B36" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#0D1B36" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B68A35" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#B68A35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D7DCE5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #D7DCE5',
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(13,27,54,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="calculos" stroke="#0D1B36" strokeWidth={2} fill="url(#navyGrad)" />
                <Area type="monotone" dataKey="conversoes" stroke="#B68A35" strokeWidth={2} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent calculations */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="xl:col-span-2 card-base flex flex-col"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-gold" />
                <h2 className="font-semibold text-sm text-text-primary">Últimos Cálculos</h2>
              </div>
              <button className="text-xs text-gold hover:text-gold-light font-medium flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 divide-y divide-border overflow-y-auto">
              {RECENT_CALCULATIONS.map((calc) => (
                <div key={calc.id} className="px-5 py-3 flex items-center gap-3 hover:bg-navy/[0.02] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-navy/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{calc.client}</p>
                    <p className="text-2xs text-text-tertiary mt-0.5">
                      OD {formatDiopter(calc.od)} / OE {formatDiopter(calc.oe)} · Índice {calc.index}
                    </p>
                  </div>
                  <p className="text-2xs text-text-tertiary shrink-0">{formatDate(calc.date)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Row 3: clients + alerts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Recent clients */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            className="xl:col-span-3 card-base"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                <h2 className="font-semibold text-sm text-text-primary">Últimos Clientes</h2>
              </div>
              <button className="text-xs text-gold hover:text-gold-light font-medium flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border">
              {RECENT_CLIENTS.map((client) => (
                <div key={client.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-navy/[0.02] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {client.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{client.name}</p>
                    <p className="text-2xs text-text-tertiary mt-0.5">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs text-text-tertiary">{formatDate(client.lastVisit)}</p>
                    <p className="text-2xs text-text-tertiary mt-0.5">{client.visits} consultas</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="xl:col-span-2 card-base"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gold" />
              <h2 className="font-semibold text-sm text-text-primary">Alertas e Avisos</h2>
            </div>
            <div className="p-4 space-y-3">
              {ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <Badge variant={alert.type} dot className="mt-0.5 shrink-0">
                    {alert.type === 'warning' ? 'Aviso' : alert.type === 'info' ? 'Info' : 'OK'}
                  </Badge>
                  <p className="text-xs text-text-secondary leading-relaxed">{alert.message}</p>
                </div>
              ))}

              {/* Quick action */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-navy to-navy-light text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span className="text-xs font-semibold text-gold">Dica do sistema</span>
                </div>
                <p className="text-xs leading-relaxed opacity-80">
                  Experimente o Comparador de Lentes para recomendar o melhor índice ao seu cliente.
                </p>
                <button className="mt-3 text-xs font-semibold text-gold hover:text-gold-light flex items-center gap-1 transition-colors">
                  Ir para o Comparador <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
