import { useEffect, useMemo, useState } from 'react'
import { CalendarRange, Plus, Save } from 'lucide-react'
import Button from '../../components/ui/Button'
import { createRound, fetchRounds, updateRound } from '../../api/rounds'

const inputClass =
  'w-full rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400'

function statusBadge(status) {
  if (status === 'active') return 'bg-leaf-100 text-leaf-700'
  if (status === 'upcoming') return 'bg-sky-100 text-sky-700'
  return 'bg-tangerine-50 text-tangerine-700'
}

export default function ReviewRounds() {
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', name: '' })
  const [editDrafts, setEditDrafts] = useState({})

  const nextRoundNumber = useMemo(() => {
    const max = rounds.reduce((m, r) => Math.max(m, r.roundNumber || 0), 0)
    return max + 1
  }, [rounds])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchRounds()
      const list = data.rounds || []
      setRounds(list)
      const drafts = {}
      list.forEach((r) => {
        drafts[r.id] = { startDate: r.startDate, endDate: r.endDate, name: r.name || '' }
      })
      setEditDrafts(drafts)
    } catch (err) {
      setError(err.message || 'Failed to load rounds')
      setRounds([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.startDate || !form.endDate) return
    setSaving(true)
    setError('')
    try {
      await createRound({
        startDate: form.startDate,
        endDate: form.endDate,
        name: form.name || `Round ${nextRoundNumber}`,
      })
      setForm({ startDate: '', endDate: '', name: '' })
      await load()
    } catch (err) {
      setError(err.message || 'Failed to create round')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(roundId) {
    const draft = editDrafts[roundId]
    if (!draft?.startDate || !draft?.endDate) return
    setSaving(true)
    setError('')
    try {
      await updateRound(roundId, draft)
      await load()
    } catch (err) {
      setError(err.message || 'Failed to update round')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Review Rounds</h1>
        <p className="text-sky-800/60 text-sm mt-1">
          Set start and end dates for each review round. Teachers can submit only while a round is open.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sky-900">Start Round {nextRoundNumber}</h2>
            <p className="text-xs text-sky-700/50">Add a new review cycle with dates</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Name</span>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={`Round ${nextRoundNumber}`}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Start date</span>
            <input
              type="date"
              required
              className={inputClass}
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">End date</span>
            <input
              type="date"
              required
              className={inputClass}
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            />
          </label>
        </div>

        <Button type="submit" disabled={saving || !form.startDate || !form.endDate}>
          {saving ? 'Saving…' : `Create Round ${nextRoundNumber}`}
        </Button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-sky-100 flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-sky-600" />
          <h2 className="font-heading font-bold text-sky-900">All rounds</h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-sky-700/50">Loading rounds…</p>
        ) : rounds.length === 0 ? (
          <p className="p-6 text-sm text-sky-700/50">No rounds yet. Create Round 1 to begin.</p>
        ) : (
          <div className="divide-y divide-sky-50">
            {rounds.map((round) => {
              const draft = editDrafts[round.id] || { startDate: '', endDate: '', name: '' }
              return (
                <div key={round.id} className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading font-extrabold text-sky-900">
                        {round.name || `Round ${round.roundNumber}`}
                      </p>
                      <p className="text-xs text-sky-700/50 mt-0.5">Round {round.roundNumber}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold capitalize ${statusBadge(round.status)}`}>
                      {round.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Name</span>
                      <input
                        className={inputClass}
                        value={draft.name}
                        onChange={(e) =>
                          setEditDrafts((d) => ({
                            ...d,
                            [round.id]: { ...draft, name: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Start date</span>
                      <input
                        type="date"
                        className={inputClass}
                        value={draft.startDate}
                        onChange={(e) =>
                          setEditDrafts((d) => ({
                            ...d,
                            [round.id]: { ...draft, startDate: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">End date</span>
                      <input
                        type="date"
                        className={inputClass}
                        value={draft.endDate}
                        onChange={(e) =>
                          setEditDrafts((d) => ({
                            ...d,
                            [round.id]: { ...draft, endDate: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={Save}
                    disabled={saving}
                    onClick={() => handleUpdate(round.id)}
                  >
                    Save dates
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
