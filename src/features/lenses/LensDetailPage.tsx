import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GitCompareArrows, ArrowLeftRight, ShieldCheck, Zap, Eye } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/format'

const MOCK_LENS = {
  id: '1',
  manufacturer: 'Essilor', line: 'Varilux Comfort', index: 1.67,
  material: 'Orgânico', treatments: ['AR', 'Blue Block', 'Hidrofóbico'],
  abbeNumber: 32, diameter: 70, averagePrice: 850,
  density: 1.35, uvProtection: true, blueBlock: true, photochromic: false,
  warranty: '2 anos', fieldOfView: 'Amplo', compatibility: 'Alta',
  description: 'Lente progressiva de alto desempenho com tecnologia W.A.V.E. 2, proporcionando adaptação rápida e visão nítida em todas as distâncias.',
}

export default function LensDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lens = MOCK_LENS

  return (
    <div className="page-enter">
      <PageHeader
        title={lens.line}
        subtitle={lens.manufacturer}
        breadcrumb={
          <button onClick={() => navigate('/lenses')}
            className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors">
            <ArrowLeft className="w-3 h-3" /> Banco de Lentes
          </button>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<GitCompareArrows className="w-3.5 h-3.5" />} onClick={() => navigate('/comparison')}>Comparar</Button>
            <Button variant="secondary" size="sm" icon={<ArrowLeftRight className="w-3.5 h-3.5" />} onClick={() => navigate('/converter')}>Converter</Button>
          </>
        }
      />

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="xl:col-span-2 space-y-5">

          <div className="card-base p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">{lens.line}</h2>
                <p className="text-sm text-text-secondary mt-1">{lens.manufacturer} · Índice {lens.index}</p>
              </div>
              <Badge variant="gold" className="text-sm px-3 py-1">{formatCurrency(lens.averagePrice)}</Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{lens.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {lens.treatments.map((t) => <Badge key={t} variant="navy">{t}</Badge>)}
            </div>
          </div>

          {/* Specs grid */}
          <div className="card-base overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="font-semibold text-sm text-text-primary">Especificações Técnicas</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-y divide-border">
              {[
                { l: 'Índice', v: lens.index },
                { l: 'Abbe', v: lens.abbeNumber },
                { l: 'Diâmetro', v: `${lens.diameter} mm` },
                { l: 'Densidade', v: `${lens.density} g/cm³` },
                { l: 'Campo visual', v: lens.fieldOfView },
                { l: 'Garantia', v: lens.warranty },
              ].map(({ l, v }) => (
                <div key={l} className="p-4">
                  <p className="text-2xs text-text-tertiary uppercase tracking-wider mb-1">{l}</p>
                  <p className="text-sm font-semibold text-text-primary">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Side panel */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
          className="space-y-4">
          <div className="card-base p-5 space-y-3">
            <h3 className="font-semibold text-sm text-text-primary mb-4">Proteções</h3>
            <ProtectionRow icon={ShieldCheck} label="Proteção UV" active={lens.uvProtection} />
            <ProtectionRow icon={Eye} label="Blue Block" active={lens.blueBlock} />
            <ProtectionRow icon={Zap} label="Fotossensível" active={lens.photochromic} />
          </div>

          <div className="card-base p-5">
            <h3 className="font-semibold text-sm text-text-primary mb-4">Compatibilidade</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Compatibilidade geral</span>
              <Badge variant="success">{lens.compatibility}</Badge>
            </div>
          </div>

          <Button fullWidth icon={<ArrowLeftRight className="w-4 h-4" />} onClick={() => navigate('/converter')}>
            Buscar Equivalentes
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ProtectionRow({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-text-tertiary" />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <Badge variant={active ? 'success' : 'muted'} dot>{active ? 'Sim' : 'Não'}</Badge>
    </div>
  )
}
