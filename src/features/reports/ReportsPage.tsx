import { motion } from 'framer-motion'
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Download, TrendingUp, FileText, Users, ArrowLeftRight, Layers } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'

const MONTHLY = [
  { month: 'Abr', receitas: 74, conversoes: 12, clientes: 18 },
  { month: 'Mai', receitas: 88, conversoes: 18, clientes: 24 },
  { month: 'Jun', receitas: 102, conversoes: 14, clientes: 20 },
  { month: 'Jul', receitas: 91, conversoes: 21, clientes: 22 },
  { month: 'Ago', receitas: 124, conversoes: 19, clientes: 31 },
  { month: 'Set', receitas: 148, conversoes: 27, clientes: 36 },
]

const BY_INDEX = [
  { name: '1.49', value: 5 },
  { name: '1.56', value: 28 },
  { name: '1.59', value: 8 },
  { name: '1.61', value: 18 },
  { name: '1.67', value: 30 },
  { name: '1.74', value: 11 },
]

const BY_BRAND = [
  { name: 'Essilor', lentes: 312, conversoes: 45 },
  { name: 'Zeiss', lentes: 184, conversoes: 30 },
  { name: 'Hoya', lentes: 220, conversoes: 28 },
  { name: 'Nikon', lentes: 156, conversoes: 22 },
  { name: 'Kodak', lentes: 98, conversoes: 14 },
]

const PIE_COLORS = ['#0D1B36', '#B68A35', '#16A34A', '#3B82F6', '#F59E0B', '#8B5CF6']

const STATS = [
  { title: 'Receitas no mês', value: '148', icon: FileText, trend: 19, color: 'navy' as const },
  { title: 'Novos clientes', value: '36', icon: Users, trend: 16, color: 'gold' as const },
  { title: 'Conversões', value: '27', icon: ArrowLeftRight, trend: 42, color: 'success' as const },
  { title: 'Lentes consultadas', value: '341', icon: Layers, trend: 8, color: 'warning' as const },
]

export default function ReportsPage() {
  return (
    <div className="page-enter">
      <PageHeader
        title="Relatórios"
        subtitle="Análise e performance do sistema"
        actions={
          <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Exportar PDF
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatCard key={s.title} {...s} index={i} />)}
        </div>

        {/* Main chart */}
        <ChartCard title="Evolução Mensal" subtitle="Receitas, conversões e clientes" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <defs>
                {['navy', 'gold', 'success'].map((name, i) => {
                  const colors = ['#0D1B36', '#B68A35', '#16A34A']
                  return (
                    <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[i]} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity={0} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D7DCE5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #D7DCE5', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#0D1B36" strokeWidth={2} fill="url(#grad-navy)" />
              <Area type="monotone" dataKey="conversoes" name="Conversões" stroke="#B68A35" strokeWidth={2} fill="url(#grad-gold)" />
              <Area type="monotone" dataKey="clientes" name="Clientes" stroke="#16A34A" strokeWidth={2} fill="url(#grad-success)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Row 2: by index + by brand */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ChartCard title="Lentes por Índice" subtitle="Distribuição de uso por índice de refração">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={BY_INDEX} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {BY_INDEX.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lentes por Fabricante" subtitle="Lentes cadastradas e conversões">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BY_BRAND} margin={{ left: -20 }} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D7DCE5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="lentes" name="Lentes" fill="#0D1B36" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="#B68A35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, icon: Icon, children }: {
  title: string; subtitle?: string; icon?: React.ElementType; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-base p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-4 h-4 text-gold" />}
        <div>
          <h3 className="font-semibold text-sm text-text-primary">{title}</h3>
          {subtitle && <p className="text-2xs text-text-tertiary">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}
