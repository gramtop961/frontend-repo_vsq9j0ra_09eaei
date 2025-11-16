import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Input, Progress, Section } from './UI'
import { StudyForm } from './Forms'
import { todayISO, uid } from './useLocalStore'

export default function Study({ state, dispatch, onAddSession }) {
  const [running, setRunning] = useState(false)
  const [start, setStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const raf = useRef()

  useEffect(() => {
    if (!running) return
    const tick = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [running, start])

  const startFocus = () => {
    setStart(Date.now())
    setRunning(true)
  }
  const stopFocus = () => {
    setRunning(false)
    const minutes = Math.max(1, Math.round(elapsed / 60))
    const session = { id: uid(), subject: 'Fokus', minutes, date: todayISO() }
    dispatch({ type: 'ADD_SESSION', payload: session })
    dispatch({ type: 'ADD_XP', points: 10 })
    setElapsed(0)
  }

  const totalWeek = state.studySessions
    .filter(s => new Date(s.date) > new Date(Date.now() - 7*24*60*60*1000))
    .reduce((sum, s) => sum + (s.minutes||0), 0)

  return (
    <div className="space-y-6">
      <Section title="Fokus">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Aktuelle Session</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}</div>
          </div>
          <div className="flex gap-2">
            {!running ? (
              <Button onClick={startFocus}>Ich lerne jetzt</Button>
            ) : (
              <Button onClick={stopFocus}>Beenden</Button>
            )}
          </div>
        </div>
      </Section>

      <Section title="Lernsitzung eintragen">
        <StudyForm onSubmit={(s)=>{ dispatch({ type:'ADD_SESSION', payload:s }); dispatch({ type:'ADD_XP', points: 5 }) }} />
      </Section>

      <Section title="Verlauf (letzte 7 Tage)">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Gesamt</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalWeek} min</div>
          <div className="mt-3"><Progress value={Math.min(1, totalWeek/300)} /></div>
        </Card>
        <div className="mt-4 grid gap-2">
          {state.studySessions.slice().reverse().map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
              <div>{s.date} — {s.subject}</div>
              <div className="text-sm text-gray-500">{s.minutes} Minuten</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
