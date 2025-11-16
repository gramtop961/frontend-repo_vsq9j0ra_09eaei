import { useMemo } from 'react'
import { Section, Card, Progress } from './UI'
import { daysUntil } from './useLocalStore'

export default function Exams({ state, dispatch }) {
  const exams = useMemo(() => [...state.exams].sort((a,b)=>a.date.localeCompare(b.date)), [state.exams])
  return (
    <div className="space-y-6">
      <Section title="Prüfungen">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(e => (
            <Card key={e.id} className="p-4">
              <div className="text-sm text-gray-500">{e.subject}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{e.topic || 'Prüfung'}</div>
              <div className="text-sm text-gray-500 mt-1">{e.date}</div>
              <div className="mt-3"><Progress value={Math.max(0, 1 - Math.max(0, daysUntil(e.date)) / 14)} /></div>
              <div className="text-sm text-gray-500 mt-2">in {Math.max(0, daysUntil(e.date))} Tagen</div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
