import { useEffect, useMemo, useReducer } from 'react'

const initialState = {
  tasks: [],
  exams: [],
  studySessions: [],
  xp: 0,
  theme: 'system',
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? { ...t, ...action.payload } : t)),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) }
    case 'REORDER_TASKS':
      return { ...state, tasks: action.tasks }
    case 'ADD_EXAM':
      return { ...state, exams: [...state.exams, action.payload] }
    case 'UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map(e => (e.id === action.payload.id ? { ...e, ...action.payload } : e)),
      }
    case 'DELETE_EXAM':
      return { ...state, exams: state.exams.filter(e => e.id !== action.id) }
    case 'ADD_SESSION':
      return { ...state, studySessions: [...state.studySessions, action.payload] }
    case 'DELETE_SESSION':
      return { ...state, studySessions: state.studySessions.filter(s => s.id !== action.id) }
    case 'ADD_XP': {
      const xp = state.xp + (action.points || 0)
      return { ...state, xp }
    }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'IMPORT_DATA':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function useLocalStore() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('student-app-store')
      if (raw) {
        const parsed = JSON.parse(raw)
        dispatch({ type: 'INIT', payload: parsed })
      }
    } catch (e) {
      console.error('Failed to load store', e)
    }
  }, [])

  // persist
  useEffect(() => {
    localStorage.setItem('student-app-store', JSON.stringify(state))
  }, [state])

  const level = useMemo(() => Math.floor((state.xp || 0) / 100) + 1, [state.xp])
  const levelProgress = useMemo(() => (state.xp % 100) / 100, [state.xp])

  return { state, dispatch, level, levelProgress }
}

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const daysUntil = (dateStr) => {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target.setHours(0,0,0,0) - now.setHours(0,0,0,0)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const startOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay() || 7 // make Monday-first
  const diff = d.getDate() - day + 1
  const r = new Date(d.setDate(diff))
  r.setHours(0,0,0,0)
  return r
}

export const endOfWeek = (date = new Date()) => {
  const s = startOfWeek(date)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23,59,59,999)
  return e
}

export const inSameWeek = (dateStr, base = new Date()) => {
  const d = new Date(dateStr)
  return d >= startOfWeek(base) && d <= endOfWeek(base)
}
