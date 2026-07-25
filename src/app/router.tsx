import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { PageLoader } from '@/components/shared/PageLoader'

function lazy_page(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  /* ── Rota pública: Login ── */
  {
    path: '/login',
    element: lazy_page(() => import('@/features/auth/LoginPage')),
  },

  /* ── Rotas protegidas: exigem autenticação ── */
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',     element: lazy_page(() => import('@/features/dashboard/DashboardPage')) },
      { path: 'calculator',    element: lazy_page(() => import('@/features/calculator/CalculatorPage')) },
      { path: 'clients',       element: lazy_page(() => import('@/features/clients/ClientsPage')) },
      { path: 'clients/:id',   element: lazy_page(() => import('@/features/clients/ClientDetailPage')) },
      { path: 'recipes',       element: lazy_page(() => import('@/features/recipes/RecipesPage')) },
      { path: 'lenses',        element: lazy_page(() => import('@/features/lenses/LensesPage')) },
      { path: 'lenses/:id',    element: lazy_page(() => import('@/features/lenses/LensDetailPage')) },
      { path: 'manufacturers', element: lazy_page(() => import('@/features/manufacturers/ManufacturersPage')) },
      { path: 'laboratories',  element: lazy_page(() => import('@/features/laboratories/LaboratoriesPage')) },
      { path: 'converter',     element: lazy_page(() => import('@/features/converter/ConverterPage')) },
      { path: 'comparison',    element: lazy_page(() => import('@/features/comparison/ComparisonPage')) },
      { path: 'markings',      element: lazy_page(() => import('@/features/markings/MarkingsPage')) },
      { path: 'reports',       element: lazy_page(() => import('@/features/reports/ReportsPage')) },
      { path: 'settings',      element: lazy_page(() => import('@/features/settings/SettingsPage')) },
    ],
  },

  /* ── 404 ── */
  {
    path: '*',
    element: lazy_page(() => import('@/components/shared/NotFoundPage')),
  },
])
