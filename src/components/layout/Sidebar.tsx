import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calculator,
  Users,
  FileText,
  Layers,
  Factory,
  FlaskConical,
  ArrowLeftRight,
  GitCompareArrows,
  ScanLine,
  BarChart3,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSidebarContext } from '@/contexts/SidebarContext'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Calculadora', to: '/calculator', icon: Calculator },
  { label: 'Clientes', to: '/clients', icon: Users },
  { label: 'Receitas', to: '/recipes', icon: FileText },
  { label: 'Banco de Lentes', to: '/lenses', icon: Layers },
  { label: 'Fabricantes', to: '/manufacturers', icon: Factory },
  { label: 'Laboratórios', to: '/laboratories', icon: FlaskConical },
  { label: 'Conversor', to: '/converter', icon: ArrowLeftRight },
  { label: 'Comparador', to: '/comparison', icon: GitCompareArrows },
  { label: 'Marcações', to: '/markings', icon: ScanLine },
  { label: 'Relatórios', to: '/reports', icon: BarChart3 },
  { label: 'Configurações', to: '/settings', icon: Settings },
]

/* ── Desktop Sidebar ── */
export function Sidebar() {
  const { collapsed } = useSidebarContext()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-14 bottom-0 z-30 bg-white border-r border-border
                 flex flex-col overflow-hidden hidden lg:flex"
    >
      <SidebarContent collapsed={collapsed} />
    </motion.aside>
  )
}

/* ── Mobile Sidebar Drawer ── */
export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebarContext()

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
            className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-white border-r border-border
                       flex flex-col shadow-xl lg:hidden"
          >
            {/* Mobile header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <OpticalLogoSmall />
                <span className="font-display text-lg font-semibold text-navy">
                  Optical <span className="text-gold">Pro</span>
                </span>
              </div>
              <button
                onClick={closeMobile}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-navy/5 transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <SidebarContent collapsed={false} onNavigate={closeMobile} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Conteúdo compartilhado da sidebar ── */
interface SidebarContentProps {
  collapsed: boolean
  onNavigate?: () => void
}

function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-3 gap-0.5 px-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.to === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.to)

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-150 cursor-pointer select-none group relative',
              'hover:bg-navy/5 hover:text-text-primary',
              isActive
                ? 'bg-navy text-white hover:bg-navy-hover'
                : 'text-text-secondary',
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-navy rounded-lg"
                style={{ zIndex: -1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            <item.icon
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isActive ? 'text-gold-light' : 'text-text-tertiary group-hover:text-text-secondary',
              )}
            />

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {item.badge && !collapsed && (
              <span className="ml-auto text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-gold/15 text-gold">
                {item.badge}
              </span>
            )}

            {/* Tooltip on collapsed */}
            {collapsed && (
              <div
                className="absolute left-full ml-2 px-2.5 py-1.5 bg-navy text-white text-xs
                           rounded-lg shadow-lg whitespace-nowrap pointer-events-none
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
              >
                {item.label}
                <ChevronRight className="inline-block w-3 h-3 ml-1 text-gold" />
              </div>
            )}
          </NavLink>
        )
      })}
    </div>
  )
}

function OpticalLogoSmall() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#0D1B36" />
      <circle cx="10.5" cy="14" r="5.5" stroke="#B68A35" strokeWidth="1.5" />
      <circle cx="17.5" cy="14" r="5.5" stroke="#B68A35" strokeWidth="1.5" />
    </svg>
  )
}
