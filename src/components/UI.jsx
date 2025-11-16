import { useEffect, useMemo, useRef, useState } from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`backdrop-blur-xl bg-white/60 dark:bg-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/40 dark:border-white/10 ${className}`}>
      {children}
    </div>
  )
}

export function Section({ title, action, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {action}
      </div>
      <Card className="p-4">{children}</Card>
    </div>
  )
}

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-3 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow hover:shadow-md active:scale-[.99] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={`h-9 w-9 grid place-items-center rounded-xl bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 shadow hover:shadow-md transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-xl px-3 bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`h-10 w-full rounded-xl px-3 bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl px-3 py-2 bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
      {...props}
    />
  )
}

export function Progress({ value }) {
  return (
    <div className="h-3 w-full rounded-full bg-white/40 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, Math.round(value * 100)))}%` }}
      />
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <IconButton onClick={onClose}>✕</IconButton>
          </div>
          {children}
        </Card>
      </div>
    </div>
  )
}

export function useCountdown(targetDate) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      setLeft(Math.max(0, target - now))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [targetDate])

  const days = Math.floor(left / (1000 * 60 * 60 * 24))
  const hours = Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((left % (1000 * 60)) / 1000)

  return { left, days, hours, minutes, seconds }
}
