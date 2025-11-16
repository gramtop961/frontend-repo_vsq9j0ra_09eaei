import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Planner from './components/Planner'
import Exams from './components/Exams'
import Study from './components/Study'
import { Modal, Card, Button, Input, Select, Textarea } from './components/UI'
import { TaskForm, ExamForm } from './components/Forms'
import { useLocalStore } from './components/useLocalStore'

function App() {
  const { state, dispatch, level, levelProgress } = useLocalStore()
  const [active, setActive] = useState('dashboard')
  const [openTask, setOpenTask] = useState(false)
  const [openExam, setOpenExam] = useState(false)
  const importRef = useRef(null)

  // theme handling (system + dark mode)
  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = state.theme === 'dark' || (state.theme === 'system' && prefersDark)
    root.classList.toggle('dark', dark)
  }, [state.theme])

  const addTask = (task) => {
    dispatch({ type: 'ADD_TASK', payload: task })
    if (task.status === 'erledigt') dispatch({ type: 'ADD_XP', points: 5 })
    setOpenTask(false)
  }

  const addExam = (exam) => {
    dispatch({ type: 'ADD_EXAM', payload: exam })
    setOpenExam(false)
  }

  const onExport = () => {
    const data = JSON.stringify(state, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studyboard-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = () => {
    importRef.current?.click()
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed || typeof parsed !== 'object') throw new Error('Ungültige Datei')
        dispatch({ type: 'IMPORT_DATA', payload: parsed })
        alert('Backup importiert!')
      } catch (err) {
        alert('Import fehlgeschlagen: ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const onStartFocus = () => {
    setActive('study')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-50 via-white to-indigo-50 dark:from-[#0b1020] dark:via-[#0a0f1a] dark:to-[#0b1020] text-gray-900 dark:text-gray-100">
      <Navbar
        active={active}
        setActive={setActive}
        onAddTask={() => setOpenTask(true)}
        onAddExam={() => setOpenExam(true)}
        onStartFocus={onStartFocus}
        onExport={onExport}
        onImport={onImport}
        level={level}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {active === 'dashboard' && (
          <Dashboard
            state={state}
            dispatch={dispatch}
            level={level}
            levelProgress={levelProgress}
            onOpenAddTask={() => setOpenTask(true)}
            onOpenAddExam={() => setOpenExam(true)}
          />
        )}
        {active === 'planner' && <Planner state={state} dispatch={dispatch} />}
        {active === 'exams' && <Exams state={state} dispatch={dispatch} />}
        {active === 'study' && <Study state={state} dispatch={dispatch} />}
      </main>

      <footer className="pb-8 text-center text-xs text-gray-500">
        Offline-fähig • Daten bleiben auf diesem Gerät • iOS/ macOS freundlich
      </footer>

      <Modal open={openTask} onClose={() => setOpenTask(false)} title="Aufgabe hinzufügen">
        <TaskForm onSubmit={addTask} />
      </Modal>

      <Modal open={openExam} onClose={() => setOpenExam(false)} title="Prüfung hinzufügen">
        <ExamForm onSubmit={addExam} />
      </Modal>

      <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
    </div>
  )
}

export default App
