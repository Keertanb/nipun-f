import { useEffect, useMemo, useState } from 'react'
import { CalendarRange, Layers, Plus, Save, Trash2, Users } from 'lucide-react'
import Button from '../../components/ui/Button'
import { createRound, fetchRounds, updateRound } from '../../api/rounds'
import {
  createRoundStage,
  createStageQuestion,
  deleteRoundStage,
  deleteStageQuestion,
  fetchRoundStages,
  fetchStageQuestions,
  fetchTeacherStageProgress,
  updateRoundStage,
} from '../../api/stages'

const inputClass =
  'w-full rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400'

function statusBadge(status) {
  if (status === 'active') return 'bg-leaf-100 text-leaf-700'
  if (status === 'upcoming') return 'bg-sky-100 text-sky-700'
  return 'bg-tangerine-50 text-tangerine-700'
}

function stageStatusBadge(status) {
  if (status === 'completed') return 'bg-leaf-100 text-leaf-700'
  if (status === 'active') return 'bg-sky-100 text-sky-800'
  return 'bg-sky-50 text-sky-500'
}

export default function ReviewRounds() {
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', name: '' })
  const [editDrafts, setEditDrafts] = useState({})
  const [expandedRoundId, setExpandedRoundId] = useState(null)
  const [stagesByRound, setStagesByRound] = useState({})
  const [questionsByStage, setQuestionsByStage] = useState({})
  const [teacherProgress, setTeacherProgress] = useState({})
  const [stageForm, setStageForm] = useState({ code: '', name: '', stageType: 'assessment', description: '' })
  const [questionDrafts, setQuestionDrafts] = useState({})

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

  async function loadRoundDetails(roundId) {
    try {
      const [{ stages }, progress] = await Promise.all([
        fetchRoundStages(roundId),
        fetchTeacherStageProgress(roundId),
      ])
      setStagesByRound((prev) => ({ ...prev, [roundId]: stages || [] }))
      setTeacherProgress((prev) => ({ ...prev, [roundId]: progress || { teachers: [], stages: [] } }))
      const qMap = {}
      await Promise.all(
        (stages || []).map(async (stage) => {
          const data = await fetchStageQuestions(roundId, stage.id)
          qMap[stage.id] = data.questions || []
        }),
      )
      setQuestionsByStage((prev) => ({ ...prev, ...qMap }))
    } catch (err) {
      setError(err.message || 'Failed to load stages')
    }
  }

  async function toggleExpand(roundId) {
    if (expandedRoundId === roundId) {
      setExpandedRoundId(null)
      return
    }
    setExpandedRoundId(roundId)
    await loadRoundDetails(roundId)
  }

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

  async function handleAddStage(roundId) {
    if (!stageForm.code.trim() || !stageForm.name.trim()) return
    setSaving(true)
    setError('')
    try {
      await createRoundStage(roundId, {
        code: stageForm.code.trim().toLowerCase(),
        name: stageForm.name.trim(),
        stageType: stageForm.stageType,
        description: stageForm.description || '',
      })
      setStageForm({ code: '', name: '', stageType: 'assessment', description: '' })
      await loadRoundDetails(roundId)
    } catch (err) {
      setError(err.message || 'Failed to add stage')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteStage(roundId, stageId) {
    setSaving(true)
    setError('')
    try {
      await deleteRoundStage(roundId, stageId)
      await loadRoundDetails(roundId)
    } catch (err) {
      setError(err.message || 'Failed to delete stage')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveStage(roundId, stage) {
    setSaving(true)
    setError('')
    try {
      await updateRoundStage(roundId, stage.id, {
        name: stage.name,
        description: stage.description,
        stageType: stage.stageType,
      })
      await loadRoundDetails(roundId)
    } catch (err) {
      setError(err.message || 'Failed to update stage')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddQuestion(roundId, stageId) {
    const prompt = (questionDrafts[stageId] || '').trim()
    if (!prompt) return
    setSaving(true)
    setError('')
    try {
      await createStageQuestion(roundId, stageId, { prompt, subject: 'All' })
      setQuestionDrafts((d) => ({ ...d, [stageId]: '' }))
      await loadRoundDetails(roundId)
    } catch (err) {
      setError(err.message || 'Failed to add question')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteQuestion(roundId, stageId, questionId) {
    setSaving(true)
    setError('')
    try {
      await deleteStageQuestion(roundId, stageId, questionId)
      await loadRoundDetails(roundId)
    } catch (err) {
      setError(err.message || 'Failed to delete question')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Review Rounds</h1>
        <p className="text-sky-800/60 text-sm mt-1">
          Manage rounds, Baseline / Midline / Endline stages, support questions, and see which teachers are on which stage.
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
            <p className="text-xs text-sky-700/50">Creates Baseline, Midline and Endline automatically</p>
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
              const stages = stagesByRound[round.id] || []
              const progress = teacherProgress[round.id]
              const expanded = expandedRoundId === round.id
              return (
                <div key={round.id} className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading font-extrabold text-sky-900">
                        {round.name || `Round ${round.roundNumber}`}
                      </p>
                      <p className="text-xs text-sky-700/50 mt-0.5">Round {round.roundNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold capitalize ${statusBadge(round.status)}`}>
                        {round.status}
                      </span>
                      <Button type="button" variant="outline" size="sm" icon={Layers} onClick={() => toggleExpand(round.id)}>
                        {expanded ? 'Hide stages' : 'Stages & progress'}
                      </Button>
                    </div>
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

                  <Button type="button" variant="outline" size="sm" icon={Save} disabled={saving} onClick={() => handleUpdate(round.id)}>
                    Save dates
                  </Button>

                  {expanded ? (
                    <div className="space-y-5 pt-2 border-t border-sky-50">
                      <div className="space-y-3">
                        <h3 className="font-heading font-bold text-sky-900 flex items-center gap-2">
                          <Layers className="w-4 h-4" /> Stages
                        </h3>
                        {stages.map((stage, idx) => (
                          <div key={stage.id} className="rounded-2xl border border-sky-100 bg-sky-50/40 p-3 space-y-3">
                            <div className="grid sm:grid-cols-4 gap-2">
                              <input
                                className={inputClass}
                                value={stage.name}
                                onChange={(e) =>
                                  setStagesByRound((prev) => ({
                                    ...prev,
                                    [round.id]: prev[round.id].map((s) =>
                                      s.id === stage.id ? { ...s, name: e.target.value } : s,
                                    ),
                                  }))
                                }
                              />
                              <select
                                className={inputClass}
                                value={stage.stageType}
                                onChange={(e) =>
                                  setStagesByRound((prev) => ({
                                    ...prev,
                                    [round.id]: prev[round.id].map((s) =>
                                      s.id === stage.id ? { ...s, stageType: e.target.value } : s,
                                    ),
                                  }))
                                }
                              >
                                <option value="assessment">Assessment</option>
                                <option value="intervention">Intervention</option>
                                <option value="summary">Summary</option>
                              </select>
                              <input className={inputClass} value={stage.code} disabled />
                              <div className="flex gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => handleSaveStage(round.id, stage)}>
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  icon={Trash2}
                                  onClick={() => handleDeleteStage(round.id, stage.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <textarea
                              className={inputClass}
                              rows={2}
                              value={stage.description || ''}
                              onChange={(e) =>
                                setStagesByRound((prev) => ({
                                  ...prev,
                                  [round.id]: prev[round.id].map((s) =>
                                    s.id === stage.id ? { ...s, description: e.target.value } : s,
                                  ),
                                }))
                              }
                              placeholder="Stage description"
                            />
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-sky-700/60">
                                Questions ({idx + 1}. {stage.name})
                              </p>
                              {(questionsByStage[stage.id] || []).map((q) => (
                                <div key={q.id} className="flex items-start justify-between gap-2 rounded-xl bg-white border border-sky-100 px-3 py-2 text-sm">
                                  <span>{q.prompt}</span>
                                  <button
                                    type="button"
                                    className="text-tangerine-600 text-xs font-semibold"
                                    onClick={() => handleDeleteQuestion(round.id, stage.id, q.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  className={inputClass}
                                  placeholder="Add question for teachers"
                                  value={questionDrafts[stage.id] || ''}
                                  onChange={(e) =>
                                    setQuestionDrafts((d) => ({ ...d, [stage.id]: e.target.value }))
                                  }
                                />
                                <Button type="button" size="sm" onClick={() => handleAddQuestion(round.id, stage.id)}>
                                  Add question
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="rounded-2xl border border-dashed border-sky-200 p-3 grid sm:grid-cols-4 gap-2">
                          <input
                            className={inputClass}
                            placeholder="code (e.g. midline2)"
                            value={stageForm.code}
                            onChange={(e) => setStageForm((f) => ({ ...f, code: e.target.value }))}
                          />
                          <input
                            className={inputClass}
                            placeholder="Stage name"
                            value={stageForm.name}
                            onChange={(e) => setStageForm((f) => ({ ...f, name: e.target.value }))}
                          />
                          <select
                            className={inputClass}
                            value={stageForm.stageType}
                            onChange={(e) => setStageForm((f) => ({ ...f, stageType: e.target.value }))}
                          >
                            <option value="assessment">Assessment</option>
                            <option value="intervention">Intervention</option>
                            <option value="summary">Summary</option>
                          </select>
                          <Button type="button" size="sm" icon={Plus} onClick={() => handleAddStage(round.id)}>
                            Add stage
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-heading font-bold text-sky-900 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Teacher stage board
                        </h3>
                        {(progress?.teachers || []).length === 0 ? (
                          <p className="text-sm text-sky-700/50">
                            No teacher progress yet. It appears when teachers open their dashboard for this round.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="text-left text-xs uppercase tracking-wide text-sky-700/50">
                                  <th className="py-2 pr-4">Teacher</th>
                                  <th className="py-2 pr-4">School</th>
                                  <th className="py-2 pr-4">Current stage</th>
                                  <th className="py-2">All stages</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-sky-50">
                                {progress.teachers.map((row) => (
                                  <tr key={`${row.teacherId}-${row.schoolId}`}>
                                    <td className="py-2 pr-4 font-semibold text-sky-900">{row.teacherId}</td>
                                    <td className="py-2 pr-4 text-sky-800/70">{row.schoolId}</td>
                                    <td className="py-2 pr-4">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${stageStatusBadge(row.currentStage?.status || 'locked')}`}>
                                        {row.currentStage?.name || '—'}
                                      </span>
                                    </td>
                                    <td className="py-2">
                                      <div className="flex flex-wrap gap-1">
                                        {(row.stages || []).map((s) => (
                                          <span
                                            key={s.stageId}
                                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${stageStatusBadge(s.status)}`}
                                          >
                                            {s.name}: {s.status}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
