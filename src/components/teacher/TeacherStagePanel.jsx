import { memo, useCallback, useMemo, useState } from 'react'
import { CheckCircle2, CircleDashed, Lock, Plus, Sparkles } from 'lucide-react'
import Accordion from '../ui/Accordion'
import Button from '../ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useReviews } from '../../context/ReviewContext'
import { formatMessage } from '../../i18n/translations'
import { addTeacherStageQuestion, completeTeacherStage, fetchTeacherStageWorkspace } from '../../api/stages'

const statusStyles = {
  completed: 'bg-leaf-100 text-leaf-700 border-leaf-200',
  active: 'bg-sky-100 text-sky-800 border-sky-200',
  locked: 'bg-sky-50 text-sky-500 border-sky-100',
}

function stageLabel(stage, t) {
  const code = String(stage?.code || '').toLowerCase()
  if (code === 'baseline') return t('stageBaseline')
  if (code === 'midline') return t('stageMidline')
  if (code === 'endline') return t('stageEndline')
  return stage?.name || '—'
}

function statusLabel(status, t) {
  if (status === 'completed') return t('stageCompleted')
  if (status === 'active') return t('stageActive')
  return t('stageLocked')
}

function TeacherStagePanel() {
  const { t, lang } = useLanguage()
  const { workspace, loading: contextLoading, updateWorkspace, reloadStudents } = useReviews()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [question, setQuestion] = useState('')

  const active = workspace?.activeStage
  const completion = workspace?.completion
  const levelCounts = workspace?.levelCounts || { Bad: 0, Average: 0, Good: 0, total: 0 }

  const canShowQuestions =
    active && (active.stageType === 'intervention' || active.stageType === 'summary')

  const actionLabels = useMemo(() => {
    const map = {}
    ;(workspace?.suggestedActions || []).forEach((a) => {
      map[a.id] = lang === 'gu' ? a.labelGu : a.labelEn
    })
    return map
  }, [workspace?.suggestedActions, lang])

  const handleAddQuestion = useCallback(
    async (e) => {
      e.preventDefault()
      if (!active || !question.trim()) return
      setSaving(true)
      setError('')
      try {
        await addTeacherStageQuestion(active.id, { prompt: question.trim(), subject: 'All' })
        setQuestion('')
        const data = await fetchTeacherStageWorkspace()
        updateWorkspace(data)
      } catch (err) {
        setError(err.message || 'Failed to add question')
      } finally {
        setSaving(false)
      }
    },
    [active, question, updateWorkspace],
  )

  const handleComplete = useCallback(async () => {
    if (!active || !completion?.canComplete) return
    setSaving(true)
    setError('')
    try {
      const data = await completeTeacherStage(active.id)
      updateWorkspace(data)
      // Students list may reset for the new stage; skip duplicate workspace fetch
      await reloadStudents({ withWorkspace: false, silent: true })
    } catch (err) {
      setError(err.message || 'Failed to complete stage')
    } finally {
      setSaving(false)
    }
  }, [active, completion?.canComplete, updateWorkspace, reloadStudents])

  if (contextLoading && !workspace) {
    return <p className="text-sm text-sky-700/50 py-4">{t('loadingStudents')}</p>
  }

  if (!workspace?.stages?.length) return null

  const subtitle = `${t('currentStage')}: ${stageLabel(active, t)}`

  return (
    <Accordion
      title={t('stageProgress')}
      subtitle={subtitle}
      icon={Sparkles}
      color="sky"
      badge={
        workspace.round?.roundNumber ? (
          <span className="text-xs font-semibold text-sky-700/60">
            {t('reviewRound')} {workspace.round.roundNumber}
          </span>
        ) : null
      }
    >
      <div className="space-y-5 pt-2">
        {active?.description ? (
          <p className="text-sm text-sky-800/60 max-w-2xl">{active.description}</p>
        ) : null}

        <ol className="grid sm:grid-cols-3 gap-3">
          {workspace.stages.map((stage, idx) => {
            const Icon =
              stage.status === 'completed' ? CheckCircle2 : stage.status === 'active' ? Sparkles : Lock
            return (
              <li
                key={stage.id}
                className={`rounded-2xl border px-3 py-3 ${statusStyles[stage.status] || statusStyles.locked}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm truncate">
                      {idx + 1}. {stageLabel(stage, t)}
                    </p>
                    <p className="text-[11px] opacity-80">{statusLabel(stage.status, t)}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        {levelCounts.total > 0 ? (
          <div>
            <p className="text-xs font-semibold text-sky-700/60 mb-2">{t('levelMixFromPrior')}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-red-50 border border-red-100 px-3 py-2 text-center">
                <p className="font-heading font-extrabold text-red-700 text-lg">{levelCounts.Bad}</p>
                <p className="text-[11px] text-red-700/80">{t('levelBadShort')}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 px-3 py-2 text-center">
                <p className="font-heading font-extrabold text-amber-700 text-lg">{levelCounts.Average}</p>
                <p className="text-[11px] text-amber-700/80">{t('levelAverageShort')}</p>
              </div>
              <div className="rounded-2xl bg-leaf-50 border border-leaf-100 px-3 py-2 text-center">
                <p className="font-heading font-extrabold text-leaf-700 text-lg">{levelCounts.Good}</p>
                <p className="text-[11px] text-leaf-700/80">{t('levelGoodShort')}</p>
              </div>
            </div>
          </div>
        ) : null}

        {completion ? (
          <div className="rounded-2xl bg-sky-50/80 border border-sky-100 p-3 space-y-2">
            <p className="text-xs font-semibold text-sky-700/60">{t('stageRequirements')}</p>
            <p className="text-sm text-sky-900 flex items-center gap-2">
              <CircleDashed className="w-4 h-4 text-sky-500" />
              {formatMessage(t('assessedCount'), {
                n: completion.assessedStudents,
                total: completion.totalStudents,
              })}
            </p>
            {active?.stageType === 'intervention' ? (
              <>
                <p className="text-sm text-sky-900">
                  {formatMessage(t('questionsCount'), { n: completion.questionsCount })}
                </p>
                <p className="text-sm text-sky-900">
                  {formatMessage(t('interventionsCount'), {
                    n: completion.interventionsDone,
                    total: completion.interventionsNeeded,
                  })}
                </p>
              </>
            ) : null}
            <p className="text-xs text-sky-700/50">{t('completeStageHint')}</p>
          </div>
        ) : null}

        {canShowQuestions ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-sky-900">{t('addCustomQuestion')}</p>
            <ul className="space-y-2">
              {(workspace.questions || []).map((q) => (
                <li
                  key={q.id}
                  className="rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm text-sky-900"
                >
                  {q.prompt}
                  {q.isCustom ? (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-sky-600 font-bold">custom</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddQuestion} className="flex flex-col sm:flex-row gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('questionPlaceholder')}
                className="flex-1 rounded-2xl border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <Button type="submit" size="sm" icon={Plus} disabled={saving || !question.trim()}>
                {t('addCustomQuestion')}
              </Button>
            </form>
          </div>
        ) : null}

        {(workspace.priorInterventions || []).length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-sky-900">{t('priorActions')}</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {workspace.priorInterventions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-leaf-100 bg-leaf-50/50 px-3 py-2 text-xs text-sky-900"
                >
                  <p className="font-semibold">
                    {item.studentId} · {item.subject}
                  </p>
                  <p className="mt-0.5">
                    {(item.actions || []).map((a) => actionLabels[a] || a).join(' · ') || '—'}
                  </p>
                  {item.notes ? <p className="mt-0.5 text-sky-800/70">{item.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : active?.stageType === 'summary' ? (
          <p className="text-sm text-sky-700/50">{t('noPriorActions')}</p>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {active && active.status === 'active' ? (
          <Button
            type="button"
            disabled={saving || !completion?.canComplete || !workspace.canSubmit}
            onClick={handleComplete}
          >
            {saving ? t('saving') : t('completeStage')}
          </Button>
        ) : null}
      </div>
    </Accordion>
  )
}

export default memo(TeacherStagePanel)
