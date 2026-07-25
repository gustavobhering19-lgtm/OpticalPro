import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Frame, Layers, BarChart2, Calculator, RotateCcw, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatMm, formatGrams, formatDiopter } from '@/utils/format'

/* ── Zod schema de validação da receita ── */
const eyeSchema = z.object({
  spherical: z.number({ invalid_type_error: 'Obrigatório' }).min(-30).max(30),

  // ALTERADO: max(10) → max(0) para aceitar apenas valores negativos
  cylindrical: z.number().min(-10).max(0).optional().nullable(),

  axis: z.number().min(0).max(180).optional().nullable(),

  // SEM ALTERAÇÃO: prisma já era opcional
  prism: z.number().min(0).max(10).optional().nullable(),
  prismBase: z.enum(['up', 'down', 'in', 'out']).optional().nullable(),

  dnp: z.number().min(20).max(40),
  height: z.number().min(10).max(30).optional().nullable(),

  // SEM ALTERAÇÃO: adição já era opcional
  addition: z.number().min(0).max(4).optional().nullable(),
})

const calculatorSchema = z.object({
  od: eyeSchema,
  oe: eyeSchema,
  frame: z.object({
    horizontal: z.number().min(30).max(70),
    vertical: z.number().min(20).max(60),
    diagonal: z.number().min(30).max(80).optional(),
    bridge: z.number().min(10).max(30),
    curvature: z.number().min(0).max(15).optional(),
    type: z.enum(['full-rim', 'semi-rim', 'rimless']),
    shape: z.string().optional(),
    material: z.string().optional(),
  }),
  lens: z.object({
    manufacturerId: z.string().optional(),
    // ALTERADO: laboratoryId removido do schema
    line: z.string().optional(),
    index: z.number().min(1.49).max(1.90),
    // ALTERADO: material removido do schema
    blueBlock: z.boolean().default(false),
    photochromic: z.boolean().default(false),
    antireflection: z.boolean().default(true),
    diameter: z.number().min(50).max(80).optional(),
  }),
})

type CalculatorFormData = z.infer<typeof calculatorSchema>

/* ── mock result ── */
const MOCK_RESULT = {
  od: { centerThickness: 1.0, edgeThickness: 4.23, weight: 3.1, abbeNumber: 32 },
  oe: { centerThickness: 1.0, edgeThickness: 4.89, weight: 3.4, abbeNumber: 32 },
  recommendedIndex: 1.74,
  estimatedReduction: 22,
  lateralDistortion: 8.4,
}

export default function CalculatorPage() {
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      frame: { type: 'full-rim' },
      lens: { index: 1.67, antireflection: true, blueBlock: false, photochromic: false },
    },
  })

  async function onSubmit(_data: CalculatorFormData) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setResult(MOCK_RESULT)
    setLoading(false)
  }

  return (
    <div className="page-enter">
      <PageHeader
        title="Calculadora"
        subtitle="Calcule a espessura e as propriedades da lente"
        actions={
          <Button variant="secondary" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { reset(); setResult(null) }}>
            Limpar
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* LEFT: Receita + Armação */}
          <div className="xl:col-span-2 space-y-5">

            {/* ── Receita ── */}
            <SectionCard icon={Eye} title="Receita" subtitle="Dados da prescrição oftálmica">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EyeForm label="Olho Direito (OD)" prefix="od" register={register} errors={errors.od} />
                <EyeForm label="Olho Esquerdo (OE)" prefix="oe" register={register} errors={errors.oe} />
              </div>
            </SectionCard>

            {/* ── Armação — SEM ALTERAÇÕES ── */}
            <SectionCard icon={Frame} title="Armação" subtitle="Medidas e características da armação">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FieldGroup label="Horizontal (A)" error={errors.frame?.horizontal?.message}>
                  <input {...register('frame.horizontal', { valueAsNumber: true })} type="number" step="0.5" placeholder="52" className={inputClass} />
                </FieldGroup>
                <FieldGroup label="Vertical (B)" error={errors.frame?.vertical?.message}>
                  <input {...register('frame.vertical', { valueAsNumber: true })} type="number" step="0.5" placeholder="36" className={inputClass} />
                </FieldGroup>
                <FieldGroup label="Diagonal (D)" error={errors.frame?.diagonal?.message}>
                  <input {...register('frame.diagonal', { valueAsNumber: true })} type="number" step="0.5" placeholder="60" className={inputClass} />
                </FieldGroup>
                <FieldGroup label="Ponte (DBL)">
                  <input {...register('frame.bridge', { valueAsNumber: true })} type="number" step="0.5" placeholder="18" className={inputClass} />
                </FieldGroup>
                <FieldGroup label="Curvatura">
                  <input {...register('frame.curvature', { valueAsNumber: true })} type="number" step="0.5" placeholder="4" className={inputClass} />
                </FieldGroup>
                <FieldGroup label="Tipo">
                  <select {...register('frame.type')} className={inputClass}>
                    <option value="full-rim">Aro Fechado</option>
                    <option value="semi-rim">Nylon (Fio)</option>
                    <option value="rimless">Três Peças</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Formato">
                  <select {...register('frame.shape')} className={inputClass}>
                    <option value="">Selecione</option>
                    <option value="oval">Oval</option>
                    <option value="retangular">Retangular</option>
                    <option value="redondo">Redondo</option>
                    <option value="aviador">Aviador</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Material">
                  <select {...register('frame.material')} className={inputClass}>
                    <option value="">Selecione</option>
                    <option value="acetato">Acetato</option>
                    <option value="metal">Metal</option>
                    <option value="titanio">Titânio</option>
                    <option value="inox">Inox</option>
                  </select>
                </FieldGroup>
              </div>
            </SectionCard>

            {/* ── Lente ── */}
            <SectionCard icon={Layers} title="Lente" subtitle="Especificações técnicas da lente">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                <FieldGroup label="Fabricante">
                  <select {...register('lens.manufacturerId')} className={inputClass}>
                    <option value="">Todos</option>
                    <option value="essilor">Essilor</option>
                    <option value="zeiss">Zeiss</option>
                    <option value="hoya">Hoya</option>
                    <option value="nikon">Nikon</option>
                  </select>
                </FieldGroup>

                {/* ALTERADO: FieldGroup "Laboratório" removido daqui */}

                <FieldGroup label="Linha">
                  <input {...register('lens.line')} placeholder="Ex: Varilux" className={inputClass} />
                </FieldGroup>

                <FieldGroup label="Índice" error={errors.lens?.index?.message}>
                  <select {...register('lens.index', { valueAsNumber: true })} className={inputClass}>
                    <option value={1.49}>1.49 — CR-39</option>
                    <option value={1.56}>1.56 — Resina</option>
                    <option value={1.59}>1.59 — Policarbonato</option>
                    <option value={1.61}>1.61 — Alto índice</option>
                    <option value={1.67}>1.67 — Alto índice +</option>
                    <option value={1.74}>1.74 — Ultra-fino</option>
                  </select>
                </FieldGroup>

                {/* ALTERADO: FieldGroup "Material" removido daqui */}

                <FieldGroup label="Diâmetro">
                  <select {...register('lens.diameter', { valueAsNumber: true })} className={inputClass}>
                    <option value={65}>65 mm</option>
                    <option value={70}>70 mm</option>
                    <option value={75}>75 mm</option>
                    <option value={80}>80 mm</option>
                  </select>
                </FieldGroup>

              </div>

              {/* Tratamentos — SEM ALTERAÇÕES */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Tratamentos</p>
                <div className="flex flex-wrap gap-3">
                  <CheckToggle label="Antirreflexo" name="lens.antireflection" control={control} />
                  <CheckToggle label="Blue Block" name="lens.blueBlock" control={control} />
                  <CheckToggle label="Fotossensível" name="lens.photochromic" control={control} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT: Resultado — SEM ALTERAÇÕES */}
          <div className="space-y-5">
            <SectionCard icon={BarChart2} title="Resultado" subtitle="Espessura e propriedades estimadas">
              {!result ? (
                <div className="py-12 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-text-tertiary" />
                  </div>
                  <p className="text-sm text-text-secondary">
                    Preencha os dados ao lado e clique em <strong>Calcular</strong> para ver o resultado.
                  </p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <LensIllustration result={result} />
                  <div className="grid grid-cols-2 gap-3">
                    <ResultMetric label="Centro OD" value={formatMm(result.od.centerThickness)} accent />
                    <ResultMetric label="Borda OD" value={formatMm(result.od.edgeThickness)} accent />
                    <ResultMetric label="Centro OE" value={formatMm(result.oe.centerThickness)} />
                    <ResultMetric label="Borda OE" value={formatMm(result.oe.edgeThickness)} />
                    <ResultMetric label="Peso estimado" value={formatGrams((result.od.weight + result.oe.weight))} />
                    <ResultMetric label="Número de Abbe" value={String(result.od.abbeNumber)} />
                  </div>
                  <div className="p-3.5 rounded-xl bg-gold-subtle border border-gold/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold">Índice recomendado</span>
                      <Badge variant="gold">{result.recommendedIndex}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Redução estimada</span>
                      <span className="text-xs font-semibold text-success">{result.estimatedReduction}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Distorção lateral</span>
                      <span className="text-xs font-medium text-text-primary">{result.lateralDistortion}%</span>
                    </div>
                  </div>
                  <Badge variant="success" dot className="w-full justify-center py-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Cálculo concluído
                  </Badge>
                </motion.div>
              )}
            </SectionCard>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              <Calculator className="w-4 h-4" />
              Calcular Espessura
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

/* ── Sub-componentes ── */

function SectionCard({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div className="card-base overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-navy/6 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-navy" />
        </div>
        <div>
          <h2 className="font-semibold text-sm text-text-primary">{title}</h2>
          {subtitle && <p className="text-2xs text-text-tertiary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

const inputClass = `w-full px-3 py-2 text-sm bg-white border border-border rounded-lg
  placeholder:text-text-tertiary text-text-primary
  focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50
  transition-all`

function FieldGroup({ label, children, error }: {
  label: string; children: React.ReactNode; error?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-2xs text-error">{error}</p>}
    </div>
  )
}

function EyeForm({ label, prefix, register, errors }: {
  label: string
  prefix: 'od' | 'oe'
  register: ReturnType<typeof useForm>['register']
  errors?: Record<string, { message?: string }>
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${prefix === 'od' ? 'bg-navy' : 'bg-gold'}`} />
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">

        <FieldGroup label="Esférico" error={errors?.spherical?.message}>
          <input
            {...register(`${prefix}.spherical`, { valueAsNumber: true })}
            type="number"
            step="0.25"
            placeholder="-2.00"
            className={inputClass}
          />
        </FieldGroup>

        {/* ALTERADO: adicionado max={0} e placeholder atualizado para deixar claro que só aceita negativo */}
        <FieldGroup label="Cilíndrico">
          <input
            {...register(`${prefix}.cylindrical`, { valueAsNumber: true })}
            type="number"
            step="0.25"
            max={0}
            placeholder="-0.25"
            className={inputClass}
          />
        </FieldGroup>

        <FieldGroup label="Eixo">
          <input
            {...register(`${prefix}.axis`, { valueAsNumber: true })}
            type="number"
            step="1"
            placeholder="90°"
            className={inputClass}
          />
        </FieldGroup>

        {/* SEM ALTERAÇÃO: prisma já era opcional no schema */}
        <FieldGroup label="Prisma">
          <input
            {...register(`${prefix}.prism`, { valueAsNumber: true })}
            type="number"
            step="0.25"
            placeholder="0"
            className={inputClass}
          />
        </FieldGroup>

        <FieldGroup label="DNP" error={errors?.dnp?.message}>
          <input
            {...register(`${prefix}.dnp`, { valueAsNumber: true })}
            type="number"
            step="0.5"
            placeholder="32.0"
            className={inputClass}
          />
        </FieldGroup>

        {/* SEM ALTERAÇÃO: adição já era opcional no schema */}
        <FieldGroup label="Adição">
          <input
            {...register(`${prefix}.addition`, { valueAsNumber: true })}
            type="number"
            step="0.25"
            placeholder="0"
            className={inputClass}
          />
        </FieldGroup>

      </div>
    </div>
  )
}

function CheckToggle({ label, name, control }: {
  label: string; name: string; control: ReturnType<typeof useForm>['control']
}) {
  return (
    <Controller
      name={name as 'lens.blueBlock'}
      control={control}
      render={({ field }) => (
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
            ${field.value ? 'bg-navy border-navy' : 'border-border group-hover:border-navy/40'}`}>
            {field.value && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
          </div>
          <input type="checkbox" className="sr-only" checked={!!field.value} onChange={field.onChange} />
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
        </label>
      )}
    />
  )
}

function ResultMetric({ label, value, accent }: {
  label: string; value: string; accent?: boolean
}) {
  return (
    <div className={`p-3 rounded-lg border ${accent ? 'bg-navy border-navy/10' : 'bg-background border-border'}`}>
      <p className={`text-2xs font-medium mb-1 ${accent ? 'text-white/60' : 'text-text-tertiary'}`}>{label}</p>
      <p className={`text-base font-bold tabular-nums ${accent ? 'text-white' : 'text-text-primary'}`}>{value}</p>
    </div>
  )
}

function LensIllustration({ result }: { result: typeof MOCK_RESULT }) {
  const W = 220, H = 100, MID = H / 2
  const cx = result.od.centerThickness * 6
  const bx = result.od.edgeThickness * 6
  const L = 30, R = W - 30

  const pathTop = `M ${L} ${MID - bx / 2} Q ${W / 2} ${MID - cx / 2} ${R} ${MID - bx / 2}`
  const pathBot = `L ${R} ${MID + bx / 2} Q ${W / 2} ${MID + cx / 2} ${L} ${MID + bx / 2} Z`

  return (
    <div className="flex justify-center py-2">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0D1B36" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#B68A35" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0D1B36" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path d={`${pathTop} ${pathBot}`} fill="url(#lensGrad)" stroke="#0D1B36" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1={L} y1={MID} x2={R} y2={MID} stroke="#B68A35" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
        <text x={W / 2} y={MID - cx / 2 - 6} textAnchor="middle" fontSize="8" fill="#6B7280">centro</text>
        <text x={L - 4} y={MID + 3} textAnchor="end" fontSize="8" fill="#6B7280">borda</text>
      </svg>
    </div>
  )
}