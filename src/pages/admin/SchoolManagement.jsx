import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Layers, School, GraduationCap, Eye } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { schools, teachers, students, districts } from '../../data/mockData'

function TreeNode({ label, icon: Icon, count, children, depth = 0, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={depth > 0 ? 'ml-4 sm:ml-6 border-l-2 border-sky-100 pl-4 sm:pl-6' : ''}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 py-2.5 group"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-sky-400" />
        </motion.div>
        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-heading font-bold text-sky-900 text-sm group-hover:text-sky-600 transition-colors">{label}</span>
        {count !== undefined && (
          <span className="text-xs font-semibold text-sky-700/50 bg-sky-50 px-2.5 py-0.5 rounded-full">{count}</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SchoolManagement() {
  const navigate = useNavigate()

  const tree = useMemo(() => {
    return districts.map((district) => {
      const districtSchools = schools.filter((s) => s.district === district)
      const blocks = [...new Set(districtSchools.map((s) => s.block))]
      return {
        district,
        blocks: blocks.map((block) => {
          const blockSchools = districtSchools.filter((s) => s.block === block)
          const clusters = [...new Set(blockSchools.map((s) => s.cluster))]
          return {
            block,
            clusters: clusters.map((cluster) => ({
              cluster,
              schools: blockSchools.filter((s) => s.cluster === cluster),
            })),
          }
        }),
      }
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">School Management</h1>
        <p className="text-sky-800/60 text-sm mt-1">District &rarr; Block &rarr; Cluster &rarr; School &rarr; Teachers</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5 sm:p-7">
        {tree.map((d) => (
          <TreeNode key={d.district} label={d.district} icon={MapPin} count={`${d.blocks.reduce((a, b) => a + b.clusters.reduce((x, c) => x + c.schools.length, 0), 0)} schools`}>
            {d.blocks.map((b) => (
              <TreeNode key={b.block} label={b.block} icon={Layers} depth={1}>
                {b.clusters.map((c) => (
                  <TreeNode key={c.cluster} label={c.cluster} icon={Layers} depth={2}>
                    {c.schools.map((school) => {
                      const schoolTeachers = teachers.filter((t) => t.schoolId === school.id)
                      return (
                        <TreeNode key={school.id} label={school.name} icon={School} depth={3} count={`${schoolTeachers.length} teachers`}>
                          <div className="grid sm:grid-cols-2 gap-3 mt-2">
                            {schoolTeachers.map((t) => {
                              const list = students.filter((s) => s.teacherId === t.id)
                              const completed = list.filter((s) => s.status === 'Completed').length
                              return (
                                <div key={t.id} className="bg-sky-50/60 rounded-2xl border border-sky-100 p-4 flex items-center gap-3">
                                  <Avatar seed={t.avatarSeed} name={t.name} size={44} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-heading font-bold text-sky-900 text-sm truncate">{t.name}</p>
                                    <p className="text-xs text-sky-700/60 truncate">{school.name}</p>
                                    <div className="flex gap-2 mt-1.5">
                                      <Badge type="Completed">{completed} done</Badge>
                                      <Badge type="Pending">{list.length - completed} left</Badge>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => navigate(`/admin/teachers/${t.id}/reviews`)}
                                    className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center text-sky-600 hover:bg-sky-100 shrink-0"
                                    title="View Reviews"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </TreeNode>
                      )
                    })}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </div>
    </div>
  )
}
