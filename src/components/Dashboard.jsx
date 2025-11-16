import { useMemo, useState } from 'react'
import { Card, Section, Progress, Button, IconButton, useCountdown } from './UI'
import { inSameWeek, todayISO, daysUntil } from './useLocalStore'

export default function Dashboard({ state, dispatch, level, levelProgress, onOpenAddTask, onOpenAddExam }) {
  const today = todayISO()
  const tasksToday = useMemo(() => state.tasks.filter(t => t.due === today && t.status !== 'erledigt'), [state.tasks, today])
  const weekTasks = useMemo(() => state.tasks.filter(t => inSameWeek(t.due)), [state.tasks])
  const weekDone = weekTasks.filter(t => t.status === 'erledigt').length
  const weekTotal = weekTasks.length || 1
  const nextExams = useMemo(() => [...state.exams].sort((a,b) => a.date.localeCompare(b.date)).slice(0,3), [state.exams])

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Level</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{level}</div>
            <div className="mt-2"><Progress value={levelProgress} /></div>
          </div>
          <div className="flex-1 grid sm:grid-cols-3 gap-4">
            <Stat label="Heute fällig" value={tasksToday.length} />
            <Stat label="Woche erledigt" value={`${weekDone}/${weekTotal}`} />
            <Stat label="Nächste Prüfung in" value={nextExams[0] ? `${Math.max(0, daysUntil(nextExams[0].date))} Tagen` : '—'} />
          </div>
        </div>
      </Card>

      <Section title="Heute anstehend" action={<Button onClick={onOpenAddTask}>Neue Aufgabe</Button>}>
        <div className="grid gap-3">
          {tasksToday.length === 0 && <div className="text-gray-500">Keine Aufgaben heute. ✨</div>}
          {tasksToday.map(t => (
            <TaskRow key={t.id} task={t} onToggle={() => dispatch({ type:'UPDATE_TASK', payload:{ id: t.id, status: t.status === 'erledigt' ? 'offen' : 'erledigt' } })} />
          ))}
        </div>
      </Section>

      <Section title="Nächste Prüfungen" action={<Button onClick={onOpenAddExam}>Prüfung eintragen</Button>}>
        <div className="grid sm:grid-cols-2 gap-3">
          {nextExams.length === 0 && <div className="text-gray-500">Keine Einträge</div>}
          {nextExams.map(e => (
            <ExamCard key={e.id} exam={e} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  )
}

function TaskRow({ task, onToggle }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{task.subject} — {task.description}</div>
        <div className="text-sm text-gray-500">Fällig: {task.due} • Prio: {task.priority}</div>
      </div>
      <Button onClick={onToggle}>{task.status === 'erledigt' ? 'Rückgängig' : 'Erledigt'}</Button>
    </div>
  )
}

function ExamCard({ exam }) {
  const { days, hours } = useCountdown(exam.date)
  return (
    <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
      <div className="text-sm text-gray-500">{exam.subject}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exam.topic || 'Prüfung'}</div>
      <div className="text-sm text-gray-500 mt-1">{exam.date}</div>
      <div className="mt-3">
        <Progress value={Math.max(0, 1 - days / Math.max(1, days + 14))} />
      </div>
      <div className="text-sm text-gray-500 mt-2">in {days} Tagen {days === 0 ? `(${hours}h)` : ''}</div>
    </div>
  )
}
