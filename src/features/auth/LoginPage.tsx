import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, LogIn, AlertCircle, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

/* ── Schema de validação ── */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail')
    .email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Informe sua senha')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Redireciona para onde o usuário tentou ir, ou para o dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const result = await login(data.email, data.password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setServerError(result.error ?? 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Painel esquerdo: visual / branding ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden
                      bg-gradient-to-br from-navy-950 via-navy to-navy-light
                      flex-col justify-between p-14">

        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Círculos de lentes decorativos */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full border border-white/5" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full border border-gold/10" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full border border-gold/10" />
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full border border-white/5" />

          {/* Linha dourada horizontal */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* Grid sutil */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <OpticalLogo size={44} />
          <div>
            <p className="font-display text-2xl font-semibold text-white tracking-wide">
              Optical <span className="text-gold">Pro</span>
            </p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">
              Software Premium Óptico
            </p>
          </div>
        </motion.div>

        {/* Ilustração central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-8"
        >
          {/* SVG de lentes estilizado */}
          <LensIllustration />

          <div className="text-center max-w-sm">
            <h2 className="font-display text-3xl font-semibold text-white leading-tight">
              Precisão em cada{' '}
              <span className="text-gold italic">cálculo</span>
            </h2>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Plataforma completa para óticas, consultores ópticos e laboratórios.
              Calcule, compare e gerencie com excelência.
            </p>
          </div>
        </motion.div>

        {/* Rodapé do painel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="flex gap-6">
            {[
              { value: '2.000+', label: 'Lentes' },
              { value: '50+', label: 'Fabricantes' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Optical Pro
          </p>
        </motion.div>
      </div>

      {/* ── Painel direito: formulário ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px]">

          {/* Logo mobile */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex lg:hidden items-center gap-2.5 mb-10"
          >
            <OpticalLogo size={36} />
            <p className="font-display text-xl font-semibold text-navy">
              Optical <span className="text-gold">Pro</span>
            </p>
          </motion.div>

          {/* Header do formulário */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-semibold text-navy">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Acesse sua conta para continuar
            </p>
          </motion.div>

          {/* Formulário */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Campo e-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="seu@email.com.br"
                  {...register('email')}
                  className={`
                    w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-white
                    placeholder:text-text-tertiary text-text-primary
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/60
                    ${errors.email
                      ? 'border-error bg-error-light/30 focus:ring-error/20 focus:border-error/60'
                      : 'border-border hover:border-border-strong'
                    }
                  `}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-xs text-error flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Campo senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-text-secondary uppercase tracking-wider"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-xs text-gold hover:text-gold-light font-medium transition-colors"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`
                    w-full pl-10 pr-11 py-3 text-sm rounded-xl border bg-white
                    placeholder:text-text-tertiary text-text-primary
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/60
                    ${errors.password
                      ? 'border-error bg-error-light/30 focus:ring-error/20 focus:border-error/60'
                      : 'border-border hover:border-border-strong'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary
                             hover:text-text-secondary transition-colors p-0.5"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-xs text-error flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Erro do servidor */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-start gap-2.5 p-3.5 bg-error-light border border-error/20 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                  <p className="text-xs text-error-text leading-relaxed">{serverError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6
                         bg-gradient-to-r from-navy to-navy-hover text-white text-sm font-semibold
                         rounded-xl shadow-md hover:shadow-lg
                         transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                         focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar no sistema
                </>
              )}
            </button>
          </motion.form>

          {/* Rodapé */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 text-center text-xs text-text-tertiary"
          >
            Problemas para acessar?{' '}
            <a href="mailto:suporte@opticalpro.com.br" className="text-gold hover:text-gold-light font-medium transition-colors">
              Fale com o suporte
            </a>
          </motion.p>
        </div>
      </div>
    </div>
  )
}

/* ── Logo SVG ── */
function OpticalLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0D1B36" />
      <circle cx="15" cy="20" r="8" stroke="#B68A35" strokeWidth="1.8" />
      <circle cx="25" cy="20" r="8" stroke="#B68A35" strokeWidth="1.8" />
      <line x1="20" y1="13" x2="20" y2="27" stroke="#B68A35" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

/* ── Ilustração de lentes SVG ── */
function LensIllustration() {
  return (
    <div className="relative">
      {/* Brilho dourado atrás */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <svg width="280" height="180" viewBox="0 0 280 180" fill="none" className="relative z-10">
        <defs>
          <linearGradient id="lensGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B68A35" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B68A35" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lensGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Armação esquerda */}
        <ellipse cx="95" cy="90" rx="72" ry="58" fill="url(#lensGrad1)" stroke="#B68A35" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#glow)" />
        <ellipse cx="95" cy="90" rx="72" ry="58" fill="url(#lensGrad2)" />

        {/* Armação direita */}
        <ellipse cx="185" cy="90" rx="72" ry="58" fill="url(#lensGrad1)" stroke="#B68A35" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#glow)" />
        <ellipse cx="185" cy="90" rx="72" ry="58" fill="url(#lensGrad2)" />

        {/* Ponte */}
        <path d="M 123 90 Q 140 82 157 90" stroke="#B68A35" strokeWidth="1.5" strokeOpacity="0.7" fill="none" strokeLinecap="round" />

        {/* Hastes */}
        <line x1="23" y1="75" x2="5" y2="65" stroke="#B68A35" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="257" y1="75" x2="275" y2="65" stroke="#B68A35" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Reflexo interno esquerda */}
        <ellipse cx="78" cy="74" rx="18" ry="12" fill="white" fillOpacity="0.04" transform="rotate(-20 78 74)" />

        {/* Reflexo interno direita */}
        <ellipse cx="168" cy="74" rx="18" ry="12" fill="white" fillOpacity="0.04" transform="rotate(-20 168 74)" />

        {/* Cruz central decorativa */}
        <line x1="95" y1="70" x2="95" y2="110" stroke="#B68A35" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="2 3" />
        <line x1="75" y1="90" x2="115" y2="90" stroke="#B68A35" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="2 3" />
        <line x1="185" y1="70" x2="185" y2="110" stroke="#B68A35" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="2 3" />
        <line x1="165" y1="90" x2="205" y2="90" stroke="#B68A35" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="2 3" />
      </svg>
    </div>
  )
}
