import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { verifiers as seedVerifiers } from '../../data/mockData'
import { districts } from '../../data/mockData'

const emptyForm = { name: '', mobile: '', email: '', district: districts[0], block: '', cluster: '', status: 'Active' }

export default function Verifiers() {
  const [verifiers, setVerifiers] = useState(seedVerifiers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(v) {
    setEditing(v.id)
    setForm({ name: v.name, mobile: v.mobile, email: v.email, district: v.district, block: v.block, cluster: v.cluster, status: v.status })
    setModalOpen(true)
  }

  function handleDelete(id) {
    setVerifiers((prev) => prev.filter((v) => v.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      setVerifiers((prev) => prev.map((v) => (v.id === editing ? { ...v, ...form } : v)))
    } else {
      setVerifiers((prev) => [{ id: `VER${Date.now()}`, ...form }, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 relative pb-20">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Verifier Management</h1>
        <p className="text-sky-800/60 text-sm mt-1">Assign and manage cluster-level verifiers.</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-sky-700/50 border-b border-sky-100">
              <th className="px-5 py-3 font-semibold">Verifier</th>
              <th className="px-5 py-3 font-semibold">Mobile</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">District / Block</th>
              <th className="px-5 py-3 font-semibold">Cluster</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifiers.map((v) => (
              <tr key={v.id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50">
                <td className="px-5 py-3 font-semibold text-sky-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" /> {v.name}
                </td>
                <td className="px-5 py-3 text-sky-800/70">{v.mobile}</td>
                <td className="px-5 py-3 text-sky-800/70">{v.email}</td>
                <td className="px-5 py-3 text-sky-800/70">{v.district} / {v.block}</td>
                <td className="px-5 py-3 text-sky-800/70">{v.cluster}</td>
                <td className="px-5 py-3"><Badge type={v.status}>{v.status}</Badge></td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 hover:bg-sky-100">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="w-8 h-8 rounded-full bg-bad/10 flex items-center justify-center text-bad hover:bg-bad/20">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={openAdd}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-sunny-400 to-tangerine-500 text-white shadow-soft flex items-center justify-center z-40"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Verifier' : 'Add Verifier'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Verifier Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Mobile Number</label>
              <input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">District</label>
              <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Block</label>
              <input required value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Cluster</label>
              <input required value={form.cluster} onChange={(e) => setForm({ ...form, cluster: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-sky-800/70 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full mt-2">{editing ? 'Save Changes' : 'Add Verifier'}</Button>
        </form>
      </Modal>
    </div>
  )
}
