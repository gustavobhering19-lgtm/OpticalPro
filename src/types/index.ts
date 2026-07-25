/* ── Receita ── */
export interface EyePrescription {
  spherical: number | null
  cylindrical: number | null
  axis: number | null
  prism: number | null
  prismBase: PrismBase | null
  dnp: number | null
  height: number | null
  addition: number | null
}

export interface Prescription {
  id: string
  clientId: string
  clientName: string
  date: string
  od: EyePrescription
  oe: EyePrescription
  notes?: string
  createdAt: string
  updatedAt: string
}

export type PrismBase = 'up' | 'down' | 'in' | 'out'
export type LensType = 'single' | 'bifocal' | 'progressive' | 'occupational'
export type FrameType = 'full-rim' | 'semi-rim' | 'rimless'

/* ── Armação ── */
export interface Frame {
  horizontal: number
  vertical: number
  diagonal: number
  bridge: number
  curvature: number
  type: FrameType
  shape: string
  material: string
}

/* ── Lente ── */
export type LensMaterial = 'organic' | 'polycarbonate' | 'trivex' | 'glass' | 'minerite'
export type LensCoating =
  | 'ar'
  | 'blue-block'
  | 'photochromic'
  | 'polarized'
  | 'mirror'
  | 'hydrophobic'
  | 'oleophobic'

export interface Lens {
  id: string
  manufacturerId: string
  manufacturerName: string
  laboratoryId?: string
  line: string
  index: number
  material: LensMaterial
  treatments: LensCoating[]
  blueBlock: boolean
  photochromic: boolean
  antireflection: boolean
  diameter: number
  abbeNumber: number
  density: number
  uvProtection: boolean
  averagePrice?: number
  createdAt: string
  updatedAt: string
}

/* ── Fabricante ── */
export interface Manufacturer {
  id: string
  name: string
  country: string
  logoUrl?: string
  lensCount: number
  website?: string
  createdAt: string
}

/* ── Laboratório ── */
export type LabStatus = 'active' | 'inactive' | 'pending'

export interface Laboratory {
  id: string
  name: string
  city: string
  state: string
  phone?: string
  email?: string
  status: LabStatus
  integrations: string[]
  createdAt: string
}

/* ── Cliente ── */
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  cpf?: string
  birthDate?: string
  address?: string
  notes?: string
  prescriptionCount: number
  lastVisit?: string
  createdAt: string
  updatedAt: string
}

/* ── Cálculo ── */
export interface LensCalculationResult {
  centerThickness: number
  edgeThickness: number
  weight: number
  recommendedIndex: number
  estimatedReduction: number
  lateralDistortion: number
  abbeNumber: number
  eye: 'OD' | 'OE'
}

/* ── Marcação ── */
export interface LensMarking {
  id: string
  symbol: string
  imageUrl?: string
  manufacturerId: string
  manufacturerName: string
  line: string
  type: string
  compatibility: string[]
  description?: string
}

/* ── Comparação ── */
export interface LensComparison {
  lens: Lens
  material: string
  abbeNumber: number
  weight: number
  centerThickness: number
  warranty: string
  uvProtection: boolean
  blueBlock: boolean
  fieldOfView: string
  averagePrice?: number
  compatibility: string
}

/* ── Dashboard ── */
export interface DashboardStats {
  calculatedPrescriptions: number
  clients: number
  conversions: number
  lenses: number
  trends: {
    calculatedPrescriptions: number
    clients: number
    conversions: number
    lenses: number
  }
}

/* ── Paginação ── */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/* ── API Response genérico ── */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/* ── Filtros ── */
export interface LensFilters {
  search?: string
  manufacturerId?: string
  index?: number
  material?: LensMaterial
  line?: string
  treatment?: LensCoating
  type?: LensType
  page?: number
  pageSize?: number
}

export interface ClientFilters {
  search?: string
  page?: number
  pageSize?: number
}
