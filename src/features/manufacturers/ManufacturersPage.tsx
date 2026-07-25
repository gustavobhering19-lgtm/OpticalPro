import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Layers } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'

interface Manufacturer {
  id: string
  name: string
  country: string
  countryFlag: string
  lensCount: number
  website?: string
  initials: string
  color: string
}

const MOCK: Manufacturer[] = [
  { id: '1', name: 'Essilor', country: 'França', countryFlag: '🇫🇷', lensCount: 312, website: 'essilor.com', initials: 'ES', color: 'from-blue-600 to-blue-800' },
  { id: '2', name: 'Zeiss', country: 'Alemanha', countryFlag: '🇩🇪', lensCount: 184, website: 'zeiss.com', initials: 'ZS', color: 'from-slate-600 to-slate-800' },
  { id: '3', name: 'Hoya', country: 'Japão', countryFlag: '🇯🇵', lensCount: 220, website: 'hoya.com', initials: 'HY', color: 'from-red-600 to-red-800' },
  { id: '4', name: 'Nikon', country: 'Japão', countryFlag: '🇯🇵', lensCount: 156, website: 'nikon.com', initials: 'NK', color: 'from-yellow-600 to-yellow-800' },
  { id: '5', name: 'Kodak', country: 'EUA', countryFlag: '🇺🇸', lensCount: 98, website: 'kodaklens.com', initials: 'KD', color: 'from-red-500 to-orange-600' },
  { id: '6', name: 'Shamir', country: 'Israel', countryFlag: '🇮🇱', lensCount: 74, website: 'shamir.com', initials: 'SH', color: 'from-teal-600 to-teal-800' },
  { id: '7', name: 'Indo', country: 'Espanha', countryFlag: '🇪🇸', lensCount: 62, website: 'indo.es', initials: 'IN', color: 'from-orange-500 to-red-600' },
  { id: '8', name: 'Rodenstock', country: 'Alemanha', countryFlag: '🇩🇪', lensCount: 118, website: 'rodenstock.com', initials: 'RD', color: 'from-indigo-600 to-indigo-800' },
]

export default function ManufacturersPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.country.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="page-enter">
      <PageHeader
        title="Fabricantes"
        subtitle={`${MOCK.length} fabricantes cadastrados`}
        actions={<Button icon={<Plus className="w-4 h-4" />}>Novo Fabricante</Button>}
      />

      <div className="p-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar fabricante ou país…" className="w-72" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="card-base p-5 hover:shadow-md transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                  {m.initials}
                </div>
                {m.website && (
                  <a
                    href={`https://${m.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-navy/8 text-text-tertiary hover:text-navy transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <h3 className="font-semibold text-text-primary">{m.name}</h3>
              <p className="text-sm text-text-secondary mt-0.5">
                {m.countryFlag} {m.country}
              </p>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Layers className="w-3.5 h-3.5 text-text-tertiary" />
                  {m.lensCount} lentes
                </div>
                <Badge variant="navy">Ver lentes</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
