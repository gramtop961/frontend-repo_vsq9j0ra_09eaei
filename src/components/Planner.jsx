import { useEffect, useMemo, useRef, useState } from 'react'
import { Section, Card, Button, Input, IconButton, Progress } from './UI'
import { daysUntil, endOfWeek, inSameWeek, startOfWeek, todayISO, uid } from './useLocalStore'

export default function Planner({ state, dispatch }) {
  const [filter, setFilter] = useState({ subject: 'alle', status: 'alle', sort: 'date' })
  const [dragIndex, setDragIndex] = useState(null)

  const tasks = useMemo(() => {
    let arr = [...state.tasks]
    if (filter.subject !== 'alle') arr = arr.filter(t => t.subject === filter.subject)
    if (filter.status !== 'alle') arr = arr.filter(t => t.status === filter.status)
    if (filter.sort === 'date') arr.sort((a,b) => a.due.localeCompare(b.due))
    if (filter.sort === 'prio') arr.sort((a,b) => (prioWeight(b.priority) - prioWeight(a.priority)))
    return arr
  }, [state.tasks, filter])

  const onDragStart = (i) => setDragIndex(i)
  const onDrop = (i) => {
    if (dragIndex === null) return
    const newTasks = [...tasks]
    const [moved] = newTasks.splice(dragIndex, 1)
    newTasks.splice(i, 0, moved)
    setDragIndex(null)
    dispatch({ type: 'REORDER_TASKS', tasks: newTasks })
  }

  const subjects = Array.from(new Set(state.tasks.map(t => t.subject).filter(Boolean)))

  const weekMinutes = state.studySessions
    .filter(s => inSameWeek(s.date))
    .reduce((sum, s) => sum + (s.minutes || 0), 0)

  return (
    <div className="space-y-6">
      <Section title="Aufgaben" action={
        <div className="flex gap-2">
          <select className="h-10 rounded-xl px-3 bg-white/70 border border-white/50" value={filter.subject} onChange={e=>setFilter({ ...filter, subject: e.target.value })}>
            <option value="alle">Alle Fächer</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="h-10 rounded-xl px-3 bg-white/70 border border-white/50" value={filter.status} onChange={e=>setFilter({ ...filter, status: e.target.value })}>
            <option value="alle">Alle</option>
            <option value="offen">Offen</option>
            <option value="erledigt">Erledigt</option>
          </select>
          <select className="h-10 rounded-xl px-3 bg-white/70 border border-white/50" value={filter.sort} onChange={e=>setFilter({ ...filter, sort: e.target.value })}>
            <option value="date">Nach Datum</option>
            <option value="prio">Nach Priorität</option>
          </select>
        </div>
      }>
        <div className="grid gap-3">
          {tasks.map((t, i) => (
            <div key={t.id} draggable onDragStart={() => onDragStart(i)} onDragOver={e=>e.preventDefault()} onDrop={() => onDrop(i)} className="p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{t.subject} — {t.description}</div>
                  <div className="text-sm text-gray-500">Fällig: {t.due} • Prio: {t.priority} • Status: {t.status}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => dispatch({ type:'UPDATE_TASK', payload:{ id: t.id, status: t.status === 'erledigt' ? 'offen' : 'erledigt' } })}>{t.status === 'erledigt' ? 'Rückgängig' : 'Erledigt'}</Button>
                  <IconButton onClick={() => dispatch({ type:'DELETE_TASK', id: t.id })}>🗑️</IconButton>
                </div>
              </div>
              {t.notes && <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Notizen: {t.notes}</div>}
              {t.attachments?.length ? (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {t.attachments.map((a, idx) => (
                    <a key={idx} href={a.dataUrl} download={a.name} className="text-xs px-2 py-1 rounded-lg bg-white/70 border border-white/50">{a.name}</a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lernzeiten diese Woche">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Gesamte Minuten</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{weekMinutes} min</div>
            <div className="mt-3"><Progress value={Math.min(1, weekMinutes / 300)} /></div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">History</div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(startOfWeek())
                d.setDate(d.getDate() + i)
                const minutes = state.studySessions.filter(s => s.date === d.toISOString().slice(0,10)).reduce((sum,s)=>sum+s.minutes,0)
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500">{['Mo','Di','Mi','Do','Fr','Sa','So'][i]}</div>
                    <div className="w-full h-16 rounded-xl bg-white/40 dark:bg-white/10 overflow-hidden">
                      <div className="w-full bg-emerald-400" style={{ height: `${Math.min(100, (minutes/120)*100)}%` }} />
                    </div>
                    <div className="text-xs text-gray-500">{minutes}m</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </Section>
    </div>
  )
}

function prioWeight(p) {
  return p === 'hoch' ? 3 : p === 'mittel' ? 2 : 1
}
