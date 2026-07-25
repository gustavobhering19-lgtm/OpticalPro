import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebarContext } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

export function Navbar() {
  const { toggle, openMobile } = useSidebarContext()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    setUserMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-border flex items-center px-4 gap-4">

      {/* Toggle desktop */}
      <button
        onClick={toggle}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-navy/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4 text-text-secondary" />
      </button>

      {/* Toggle mobile */}
      <button
        onClick={openMobile}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-navy/5 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-4 h-4 text-text-secondary" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <OpticalLogo />
        <span className="font-display text-lg font-semibold text-navy hidden sm:block">
          Optical <span className="text-gold">Pro</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Buscar lentes, clientes, receitas…"
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-background border border-border rounded-lg
                       placeholder:text-text-tertiary text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center
                          px-1.5 py-0.5 text-2xs text-text-tertiary bg-muted border border-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notificações */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-navy/5 transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-navy/5 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                            text-white bg-gradient-to-br from-navy to-navy-light shrink-0">
              {user?.avatarInitials ?? 'OP'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-text-primary leading-none">{user?.name ?? 'Usuário'}</p>
              <p className="text-2xs text-text-tertiary mt-0.5">{user?.company ?? ''}</p>
            </div>
            <ChevronDown className={cn(
              'w-3 h-3 text-text-tertiary transition-transform duration-200 hidden sm:block',
              userMenuOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
              >
                {/* Info do usuário */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-tertiary mt-0.5 truncate">{user?.email}</p>
                </div>

                {/* Ações */}
                <div className="py-1">
                  <DropdownItem
                    icon={User}
                    label="Meu perfil"
                    onClick={() => { setUserMenuOpen(false); navigate('/settings') }}
                  />
                  <DropdownItem
                    icon={Settings}
                    label="Configurações"
                    onClick={() => { setUserMenuOpen(false); navigate('/settings') }}
                  />
                </div>

                <div className="py-1 border-t border-border">
                  <DropdownItem
                    icon={LogOut}
                    label="Sair"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

function DropdownItem({
  icon: Icon, label, onClick, danger,
}: {
  icon: React.ElementType; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left',
        danger
          ? 'text-error hover:bg-error-light'
          : 'text-text-secondary hover:bg-navy/5 hover:text-text-primary',
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}

function OpticalLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#0D1B36" />
      <circle cx="10.5" cy="14" r="5.5" stroke="#B68A35" strokeWidth="1.5" />
      <circle cx="17.5" cy="14" r="5.5" stroke="#B68A35" strokeWidth="1.5" />
      <path d="M14 10.5V17.5" stroke="#B68A35" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
