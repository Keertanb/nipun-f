import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  School, GraduationCap, Users, Clock, MapPin, Layers,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import {
  getAdminStats, getDistrictProgress, getBlockProgress, getSchoolCompletion,
} from '../../data/mockData'

const PIE_COLORS = ['#22B566', '#FFBE22']

export default function AdminDashboard() {
  const stats = useMemo(() => getAdminStats(), [])
  const districtProgress = useMemo(() => getDistrictProgress(), [])
  const blockProgress = useMemo(() => getBlockProgress(), [])
  const schoolCompletion = useMemo(() => getSchoolCompletion().slice(0, 8), [])

  const pieData = [
    { name: 'Reviewed', value: stats.studentsReviewed },
    { name: 'Pending', value: stats.pendingReviews },
  ]

  const lineData = districtProgress.map((d) => ({ name: d.district, pct: d.pct }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-sky-900">Admin Control Center</h1>
        <p className="text-sky-800/60 text-sm mt-1">Government of Gujarat &middot; State-wide review progress</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={School} label="Schools" value={stats.schools} theme="sky" delay={0} />
        <StatCard icon={GraduationCap} label="Teachers" value={stats.teachers} theme="green" delay={0.05} />
        <StatCard icon={Users} label="Students Reviewed" value={stats.studentsReviewed} theme="sunny" delay={0.1} />
        <StatCard icon={Clock} label="Pending Reviews" value={stats.pendingReviews} theme="sky" delay={0.15} />
        <StatCard icon={MapPin} label="Districts" value={stats.districts} theme="green" delay={0.2} />
        <StatCard icon={Layers} label="Clusters" value={stats.clusters} theme="sunny" delay={0.25} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6"
        >
          <h3 className="font-heading font-bold text-sky-900 mb-4">Review Completion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-good inline-block" /> Reviewed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-avg inline-block" /> Pending</span>
          </div>
        </motion.div>

        {/* District line/bar progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6 lg:col-span-2"
        >
          <h3 className="font-heading font-bold text-sky-900 mb-4">District Review Progress (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E0F2FE" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pct" stroke="#1084D1" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Block progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6 space-y-4"
        >
          <h3 className="font-heading font-bold text-sky-900 mb-1">Block-wise Progress</h3>
          {blockProgress.map((b) => (
            <ProgressBar key={b.block} pct={b.pct} label={b.block} color="green" />
          ))}
        </motion.div>

        {/* School completion bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6"
        >
          <h3 className="font-heading font-bold text-sky-900 mb-4">School Completion %</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={schoolCompletion} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E0F2FE" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="school"
                width={140}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (v.length > 18 ? v.slice(0, 18) + '…' : v)}
              />
              <Tooltip />
              <Bar dataKey="pct" fill="#F9A007" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
