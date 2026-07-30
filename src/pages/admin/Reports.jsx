import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { getTeacherCompletion } from '../../data/mockData'

export default function Reports() {
  const teacherCompletion = useMemo(() => getTeacherCompletion().slice(0, 12), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Reports</h1>
        <p className="text-sky-800/60 text-sm mt-1">Teacher-wise completion percentage overview.</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6">
        <h3 className="font-heading font-bold text-sky-900 mb-4">Teacher Completion %</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={teacherCompletion} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E0F2FE" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="teacher" width={130} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="pct" fill="#22B566" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
