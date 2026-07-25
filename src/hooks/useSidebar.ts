import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'optical_pro_sidebar_collapsed'

export function useSidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'true'
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  /* Persiste preferência */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  /* Fecha sidebar mobile em resize */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const toggle = useCallback(() => setCollapsed((c) => !c), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return { collapsed, toggle, mobileOpen, openMobile, closeMobile }
}
