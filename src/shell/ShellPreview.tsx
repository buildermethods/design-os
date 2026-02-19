import { useState } from 'react'
import AppShell from './components/AppShell'
import type { NavigationItem } from './components/MainNav'
import {
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', isActive: true },
  { label: 'Products', href: '/products', icon: 'products' },
  { label: 'Bill of Materials', href: '/bill-of-materials', icon: 'bill-of-materials' },
  { label: 'Sourcing', href: '/sourcing', icon: 'sourcing' },
  { label: 'Calendar', href: '/calendar', icon: 'calendar' },
]

const user = {
  name: 'Alex Morgan',
  role: 'Product Manager',
  avatarUrl: undefined,
}

// ─── Sample Dashboard Content ───
function DashboardContent() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Welcome back, Alex
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening across your product portfolio.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Products"
          value="247"
          change="+12"
          changeType="positive"
          icon={<Package className="size-5" strokeWidth={1.5} />}
        />
        <KpiCard
          label="On-Time Delivery"
          value="94.2%"
          change="+2.1%"
          changeType="positive"
          icon={<TrendingUp className="size-5" strokeWidth={1.5} />}
        />
        <KpiCard
          label="Pending Approvals"
          value="18"
          change="-3"
          changeType="positive"
          icon={<Clock className="size-5" strokeWidth={1.5} />}
        />
        <KpiCard
          label="Open RFQs"
          value="34"
          change="+5"
          changeType="neutral"
          icon={<BarChart3 className="size-5" strokeWidth={1.5} />}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Accessed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recently Accessed
            </h2>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {[
              { name: 'FW25 Denim Jacket', type: 'Product', status: 'In Review', time: '2h ago' },
              { name: 'Organic Cotton Blend #442', type: 'Material', status: 'Active', time: '3h ago' },
              { name: 'SS26 Sneaker Collection', type: 'Product', status: 'Development', time: '5h ago' },
              { name: 'Zhongshan Textiles Co.', type: 'Supplier', status: 'Qualified', time: '1d ago' },
              { name: 'Resort 26 Timeline', type: 'Calendar', status: 'On Track', time: '1d ago' },
            ].map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.type}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === 'Active' || item.status === 'Qualified' || item.status === 'On Track'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : item.status === 'In Review'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  }`}
                >
                  {item.status}
                </span>
                <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 w-12 text-right">
                  {item.time}
                </span>
                <ChevronRight className="size-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Activity
            </h2>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Sarah Chen', action: 'approved', target: 'FW25 Denim Jacket BOM', time: '1h ago' },
              { user: 'Marcus Lee', action: 'submitted', target: 'RFQ #892 for review', time: '2h ago' },
              { user: 'Yuki Tanaka', action: 'uploaded', target: 'tech pack for SS26 Tee', time: '4h ago' },
              { user: 'Priya Sharma', action: 'commented on', target: 'Resort 26 timeline', time: '6h ago' },
              { user: 'James Wilson', action: 'created', target: 'new supplier profile', time: '1d ago' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 size-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.user.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.user}
                    </span>{' '}
                    {item.action}{' '}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.target}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts row */}
      <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            3 milestones approaching deadline
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
            FW25 Sample Review (2 days), SS26 Fabric Approval (4 days), Resort 26 Costing (5 days)
          </p>
        </div>
        <button className="shrink-0 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline">
          View all
        </button>
      </div>
    </div>
  )
}

// ─── KPI Card ───
function KpiCard({
  label,
  value,
  change,
  changeType,
  icon,
}: {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${
            changeType === 'positive'
              ? 'text-emerald-600 dark:text-emerald-400'
              : changeType === 'negative'
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {changeType === 'positive' && <ArrowUpRight className="size-3" strokeWidth={2} />}
          {changeType === 'negative' && <ArrowDownRight className="size-3" strokeWidth={2} />}
          {change}
        </span>
      </div>
    </div>
  )
}

// ─── Shell Preview Entry Point ───
export default function ShellPreview() {
  const [activeHref, setActiveHref] = useState('/dashboard')

  const navItems = navigationItems.map((item) => ({
    ...item,
    isActive: item.href === activeHref,
  }))

  return (
    <AppShell
      navigationItems={navItems}
      user={user}
      productName="Centric PLM"
      productIcon="C"
      onNavigate={(href) => {
        setActiveHref(href)
        console.log('Navigate to:', href)
      }}
      onLogout={() => console.log('Logout')}
      onSettings={() => console.log('Settings')}
      onSearch={(query) => console.log('Search:', query)}
      notificationCount={3}
      onNotificationsClick={() => console.log('Notifications')}
    >
      <DashboardContent />
    </AppShell>
  )
}
