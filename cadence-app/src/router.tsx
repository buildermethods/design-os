import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from './lib/AuthGuard'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { TodayPage } from './pages/TodayPage'
import { LeadsPage } from './pages/LeadsPage'
import { DashboardPage } from './pages/DashboardPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <TodayPage /> },
          { path: 'today', element: <TodayPage /> },
          { path: 'leads', element: <LeadsPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
