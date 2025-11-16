import { useState } from 'react'
import { Button, Input, Select, Textarea } from './UI'
import { uid, todayISO } from './useLocalStore'

export function TaskForm({ onSubmit, initial }) {
  const [form, setForm] = useState(
    initial || {
      id: uid(),
      subject: '',
      description: '',
      due: todayISO(),
      priority: 'mittel',
      status: 'offen',
      notes: '',
      attachments: [], // {name, dataUrl}
    }
  )

  const onFile = async (e) => {
    const files = Array.from(e.target.files || [])
    const items = await Promise.all(
      files.map(
        (f) =>
          new Promise((res) => {
            const r = new FileReader()
            r.onload = () => res({ name: f.name, dataUrl: r.result })
            r.readAsDataURL(f)
          })
      )
    )
    setForm((s) => ({ ...s, attachments: [...(s.attachments || []), ...items] }))
  }

  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Fach" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="hoch">Priorität: Hoch</option>
          <option value="mittel">Priorität: Mittel</option>
          <option value="niedrig">Priorität: Niedrig</option>
        </Select>
      </div>
      <Textarea rows={3} placeholder="Beschreibung" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
        <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="offen">Status: offen</option>
          <option value="erledigt">Status: erledigt</option>
        </Select>
      </div>
      <Textarea rows={2} placeholder="Notizen" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <div className="flex items-center gap-3">
        <input type="file" multiple accept="image/*,application/pdf" onChange={onFile} />
        <span className="text-sm text-gray-500">Optional: Fotos/PDFs als Base64</span>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Speichern</Button>
      </div>
    </form>
  )
}

export function ExamForm({ onSubmit, initial }) {
  const [form, setForm] = useState(
    initial || {
      id: uid(),
      subject: '',
      date: todayISO(),
      topic: '',
      description: '',
    }
  )

  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Fach" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </div>
      <Input placeholder="Thema" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
      <Textarea rows={3} placeholder="Beschreibung" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="flex justify-end">
        <Button type="submit">Speichern</Button>
      </div>
    </form>
  )
}

export function StudyForm({ onSubmit }) {
  const [form, setForm] = useState({ id: uid(), subject: '', minutes: 30, date: todayISO() })
  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, minutes: Number(form.minutes) })
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <Input placeholder="Fach" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <Input type="number" min={5} step={5} placeholder="Minuten" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} />
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Hinzufügen</Button>
      </div>
    </form>
  )
}
