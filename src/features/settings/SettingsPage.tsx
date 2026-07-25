import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, User, ImagePlus, CreditCard, Plug, Users, ShieldCheck,
  HardDrive, Key, Palette, Save, ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const SECTIONS = [
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'logo', label: 'Logo', icon: ImagePlus },
  { id: 'plan', label: 'Plano', icon: CreditCard },
  { id: 'integrations', label: 'Integrações', icon: Plug },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'permissions', label: 'Permissões', icon: ShieldCheck },
  { id: 'backup', label: 'Backup', icon: HardDrive },
  { id: 'api', label: 'API', icon: Key },
  { id: 'theme', label: 'Tema', icon: Palette },
]

const inputClass = `w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
  placeholder:text-text-tertiary text-text-primary
  focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all`

export default function SettingsPage() {
  const [active, setActive] = useState('company')

  return (
    <div className="page-enter">
      <PageHeader title="Configurações" subtitle="Gerencie sua conta e preferências" />

      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Sidebar menu */}
        <nav className="w-56 shrink-0 border-r border-border bg-background p-3 space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${active === s.id
                  ? 'bg-navy text-white font-medium'
                  : 'text-text-secondary hover:bg-navy/5 hover:text-text-primary'
                }`}
            >
              <s.icon className={`w-4 h-4 shrink-0 ${active === s.id ? 'text-gold-light' : 'text-text-tertiary'}`} />
              {s.label}
              {active !== s.id && <ChevronRight className="w-3 h-3 ml-auto text-text-tertiary opacity-40" />}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {active === 'company' && <CompanySection />}
            {active === 'profile' && <ProfileSection />}
            {active === 'plan' && <PlanSection />}
            {active === 'api' && <ApiSection />}
            {active === 'integrations' && <IntegrationsSection />}
            {!['company','profile','plan','api','integrations'].includes(active) && (
              <PlaceholderSection label={SECTIONS.find(s => s.id === active)?.label ?? ''} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl font-semibold text-navy mb-1">{children}</h2>
}
function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-text-secondary mb-6">{children}</p>
}
function FieldGroup({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-2xs text-text-tertiary">{hint}</p>}
    </div>
  )
}

function CompanySection() {
  return (
    <div className="max-w-lg space-y-5">
      <div><SectionTitle>Dados da Empresa</SectionTitle><SectionDesc>Informações exibidas em relatórios e documentos.</SectionDesc></div>
      <div className="card-base p-6 space-y-4">
        <FieldGroup label="Nome da empresa"><input placeholder="Ótica Visão Perfeita" className={inputClass} defaultValue="Ótica Visão Perfeita" /></FieldGroup>
        <FieldGroup label="CNPJ"><input placeholder="00.000.000/0000-00" className={inputClass} /></FieldGroup>
        <FieldGroup label="Telefone"><input placeholder="(11) 3333-4444" className={inputClass} /></FieldGroup>
        <FieldGroup label="E-mail de contato"><input type="email" placeholder="contato@otica.com.br" className={inputClass} /></FieldGroup>
        <FieldGroup label="Endereço"><input placeholder="Rua das Flores, 123 — São Paulo, SP" className={inputClass} /></FieldGroup>
      </div>
      <Button icon={<Save className="w-4 h-4" />}>Salvar alterações</Button>
    </div>
  )
}

function ProfileSection() {
  return (
    <div className="max-w-lg space-y-5">
      <div><SectionTitle>Perfil</SectionTitle><SectionDesc>Suas informações pessoais de acesso.</SectionDesc></div>
      <div className="card-base p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-xl font-bold">AB</div>
          <div>
            <p className="font-semibold text-text-primary">Ana Beatriz</p>
            <p className="text-sm text-text-secondary">Administradora</p>
            <button className="text-xs text-gold hover:text-gold-light transition-colors mt-1">Alterar foto</button>
          </div>
        </div>
        <FieldGroup label="Nome completo"><input defaultValue="Ana Beatriz" className={inputClass} /></FieldGroup>
        <FieldGroup label="E-mail"><input type="email" defaultValue="ana@opticalpro.com.br" className={inputClass} /></FieldGroup>
        <FieldGroup label="Nova senha" hint="Deixe em branco para manter a senha atual."><input type="password" placeholder="••••••••" className={inputClass} /></FieldGroup>
      </div>
      <Button icon={<Save className="w-4 h-4" />}>Salvar perfil</Button>
    </div>
  )
}

function PlanSection() {
  return (
    <div className="max-w-xl space-y-5">
      <div><SectionTitle>Plano</SectionTitle><SectionDesc>Gerencie sua assinatura do Optical Pro.</SectionDesc></div>

      <div className="card-base p-6 border-2 border-gold/30">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-text-primary">Plano Pro</h3>
              <Badge variant="gold">Atual</Badge>
            </div>
            <p className="text-sm text-text-secondary">Acesso completo a todos os módulos</p>
          </div>
          <p className="text-2xl font-bold text-navy">R$ 149<span className="text-sm font-normal text-text-secondary">/mês</span></p>
        </div>
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-sm text-text-secondary">
          {['Calculadora avançada', 'Banco de lentes completo', 'Relatórios analíticos', 'Integrações API', 'Suporte prioritário', 'Histórico ilimitado'].map(f => (
            <div key={f} className="flex items-center gap-2"><span className="text-success">✓</span>{f}</div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary">Ver outros planos</Button>
        <Button variant="ghost" className="text-error hover:text-error hover:bg-error-light">Cancelar assinatura</Button>
      </div>
    </div>
  )
}

function ApiSection() {
  return (
    <div className="max-w-lg space-y-5">
      <div><SectionTitle>Chaves de API</SectionTitle><SectionDesc>Acesse o Optical Pro via API REST.</SectionDesc></div>
      <div className="card-base p-6 space-y-4">
        <FieldGroup label="Chave de API" hint="Nunca compartilhe sua chave de API com terceiros.">
          <div className="flex gap-2">
            <input readOnly value="op_sk_••••••••••••••••••••••••••••••••" className={`${inputClass} font-mono text-xs`} />
            <Button variant="secondary" size="sm">Copiar</Button>
          </div>
        </FieldGroup>
        <FieldGroup label="Endpoint base">
          <input readOnly value="https://api.opticalpro.com.br/v1" className={`${inputClass} font-mono text-xs`} />
        </FieldGroup>
      </div>
      <Button variant="danger" size="sm">Gerar nova chave</Button>
    </div>
  )
}

function IntegrationsSection() {
  const integrations = [
    { name: 'EDI Óptico', description: 'Troca eletrônica de dados com laboratórios', connected: true },
    { name: 'API Laboratório SP', description: 'Integração direta com Lab SP', connected: true },
    { name: 'WhatsApp Business', description: 'Envio de receitas por WhatsApp', connected: false },
    { name: 'Google Calendar', description: 'Sincronização de consultas', connected: false },
  ]
  return (
    <div className="max-w-lg space-y-5">
      <div><SectionTitle>Integrações</SectionTitle><SectionDesc>Conecte o Optical Pro com outros sistemas.</SectionDesc></div>
      <div className="space-y-3">
        {integrations.map(i => (
          <div key={i.name} className="card-base p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">{i.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">{i.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={i.connected ? 'success' : 'muted'} dot>{i.connected ? 'Conectado' : 'Desconectado'}</Badge>
              <Button variant={i.connected ? 'ghost' : 'secondary'} size="xs">{i.connected ? 'Desconectar' : 'Conectar'}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mb-4">
        <ShieldCheck className="w-6 h-6 text-text-tertiary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-navy mb-2">{label}</h3>
      <p className="text-sm text-text-secondary max-w-xs">Esta seção está em desenvolvimento e estará disponível em breve.</p>
      <Badge variant="warning" className="mt-4">Em breve</Badge>
    </div>
  )
}
