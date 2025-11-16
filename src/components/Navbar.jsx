import { IconButton } from './UI'

export default function Navbar({ active, setActive, onAddTask, onAddExam, onStartFocus, onExport, onImport, level }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 dark:bg-black/30 border-b border-white/40 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">StudyBoard</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">Lv {level}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className={`px-3 h-9 rounded-xl ${active==='dashboard'?'bg-black/10 dark:bg-white/10':''}`} onClick={()=>setActive('dashboard')}>Dashboard</button>
          <button className={`px-3 h-9 rounded-xl ${active==='planner'?'bg-black/10 dark:bg-white/10':''}`} onClick={()=>setActive('planner')}>Planer</button>
          <button className={`px-3 h-9 rounded-xl ${active==='exams'?'bg-black/10 dark:bg-white/10':''}`} onClick={()=>setActive('exams')}>Prüfungen</button>
          <button className={`px-3 h-9 rounded-xl ${active==='study'?'bg-black/10 dark:bg-white/10':''}`} onClick={()=>setActive('study')}>Lernen</button>
        </div>
        <div className="flex items-center gap-2">
          <IconButton title="Aufgabe" onClick={onAddTask}>➕</IconButton>
          <IconButton title="Prüfung" onClick={onAddExam}>📝</IconButton>
          <IconButton title="Fokus" onClick={onStartFocus}>🎯</IconButton>
          <IconButton title="Export" onClick={onExport}>⬇️</IconButton>
          <IconButton title="Import" onClick={onImport}>⬆️</IconButton>
        </div>
      </div>
    </div>
  )
}
