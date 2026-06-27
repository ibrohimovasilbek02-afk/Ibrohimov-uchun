'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  DollarSign,
  MessageSquare,
  BarChart3,
  Activity,
  Eye,
  Shield,
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const adminTabs = ['Overview', 'Users', 'Statistics', 'Payments', 'Reports']

const mockStats = {
  totalUsers: 1247,
  activeToday: 342,
  premiumUsers: 89,
  revenue: '$4,230',
  newUsersToday: 23,
  sessionsToday: 1560,
}

const mockUsers = [
  { id: '1', name: 'Asilbek Yusupov', email: 'asilbek@email.com', level: 5, xp: 4200, premium: true, lastActive: '2 min ago' },
  { id: '2', name: 'Nodira Karimova', email: 'nodira@email.com', level: 3, xp: 1800, premium: false, lastActive: '15 min ago' },
  { id: '3', name: 'Sardor Toshmatov', email: 'sardor@email.com', level: 7, xp: 6500, premium: true, lastActive: '1 hour ago' },
  { id: '4', name: 'Dilnoza Raimova', email: 'dilnoza@email.com', level: 2, xp: 950, premium: false, lastActive: '3 hours ago' },
  { id: '5', name: 'Jasur Bekmurodov', email: 'jasur@email.com', level: 4, xp: 3100, premium: true, lastActive: '5 min ago' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary-500" />
              Admin Panel
            </h1>
            <p className="text-slate-500">Sukut AI platformasi boshqaruv paneli</p>
          </div>
          <Badge variant="premium" size="lg">Admin</Badge>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {adminTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                activeTab === tab
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card hover:scale-105'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'Overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Jami Users', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { label: 'Active Today', value: mockStats.activeToday, icon: Activity, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
                { label: 'Premium Users', value: mockStats.premiumUsers, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                { label: 'Revenue', value: mockStats.revenue, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                { label: 'New Today', value: mockStats.newUsersToday, icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
                { label: 'Sessions Today', value: mockStats.sessionsToday.toLocaleString(), icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
              ].map((stat, i) => (
                <GlassCard key={i} delay={i * 0.1}>
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                      <stat.icon className={cn('w-6 h-6', stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Recent Activity */}
            <GlassCard hover={false}>
              <h3 className="font-bold mb-4">Oxirgi faollik</h3>
              <div className="space-y-3">
                {[
                  { text: 'Asilbek Speaking sessiya tugatdi - Band 6.5', time: '2 min ago', type: 'speaking' },
                  { text: 'Nodira ro\'yxatdan o\'tdi', time: '5 min ago', type: 'new' },
                  { text: 'Sardor Premium sotib oldi', time: '15 min ago', type: 'premium' },
                  { text: 'Jasur Writing essay topshirdi - Band 7.0', time: '20 min ago', type: 'writing' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm">{activity.text}</span>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Users */}
        {activeTab === 'Users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard hover={false}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Level</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">XP</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="info" size="sm">Lv. {user.level}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium">{user.xp.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.premium ? 'premium' : 'default'} size="sm">
                            {user.premium ? 'Premium' : 'Free'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-500">{user.lastActive}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
