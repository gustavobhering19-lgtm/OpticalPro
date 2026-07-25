import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar, MobileSidebar } from './Sidebar'
import { useSidebarContext } from '@/contexts/SidebarContext'

export function AppLayout() {
  const { collapsed } = useSidebarContext()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <MobileSidebar />

      {/* Main content — shifts with sidebar */}
      <motion.main
        animate={{ paddingLeft: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="pt-14 min-h-screen lg:block"
        style={{ paddingLeft: collapsed ? 64 : 240 }}
      >
        {/* On mobile there's no sidebar shift */}
        <div className="lg:hidden pt-14" />

        <div className="max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
