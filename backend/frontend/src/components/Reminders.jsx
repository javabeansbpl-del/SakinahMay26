import { useState, useEffect } from 'react'
import { getReminders, addReminder, deleteReminder } from '../lib/calendar'

const RECURRING_LABELS = { none: 'One time', yearly: 'Every year', monthly: 'Every month' }

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', note: '', remind_date: '', remind_time: '', recurring: 'none' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadReminders() }, [])

  async function loadReminders() {
    setLoading(true)
    try {
      const data = await getReminders()
      setReminders(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const saved = await addReminder(form)
      setReminders(prev => [...prev, saved].sort((a, b) => a.remind_date.localeCompare(b.remind_date)))
      setShowForm(false)
      setForm({ title: '', note: '', remind_date: '', remind_time: '', recurring: 'none' })
    } catch (e) {
      setError(e.message || 'Could not save reminder.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(id)
      setReminders(prev => prev.filter(r => r.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  // Group reminders: upcoming vs past
  const today = new Date().toISOString().split('T')[0]
  const upcoming = reminders.filter(r => r.remind_date >= today)
  const past = reminders.filter(r => r.remind_date < today)

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">📅 Reminders</h2>
          <p className="tracker-subtitle">{upcoming.length} upcoming</p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form className="fast-form" onSubmit={handleAdd}>
          {error && <p className="form-error">{error}</p>}

          <div className="input-wrapper">
            <label className="field-label">Title</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Son's birthday"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="fast-form-row">
            <div className="input-wrapper">
              <label className="field-label">Date</label>
              <input
                type="date"
                className="text-input"
                value={form.remind_date}
                onChange={e => setForm(f => ({ ...f, remind_date: e.target.value }))}
                required
              />
            </div>
            <div className="input-wrapper">
              <label className="field-label">Time (optional)</label>
              <input
                type="time"
                className="text-input"
                value={form.remind_time}
                onChange={e => setForm(f => ({ ...f, remind_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="fast-form-row">
            <div className="input-wrapper">
              <label className="field-label">Repeat</label>
              <select
                className="text-input"
                value={form.recurring}
                onChange={e => setForm(f => ({ ...f, recurring: e.target.value }))}
              >
                {Object.entries(RECURRING_LABELS).map(([v, l]) =>
                  <option key={v} value={v}>{l}</option>
                )}
              </select>
            </div>
            <div className="input-wrapper">
              <label className="field-label">Note (optional)</label>
              <input
                type="text"
                className="text-input"
                placeholder="Extra details..."
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>

          <button type="submit" className="action-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Reminder'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : reminders.length === 0 ? (
        <p className="empty-text">No reminders yet. Click "+ Add" to create one.</p>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="reminder-group">
              <p className="reminder-group-label">Upcoming</p>
              {upcoming.map(r => (
                <div key={r.id} className="reminder-item">
                  <div className="reminder-dot upcoming-dot" />
                  <div className="reminder-content">
                    <span className="reminder-title">{r.title}</span>
                    <span className="reminder-date">
                      {r.remind_date}{r.remind_time ? ` at ${r.remind_time}` : ''}
                      {r.recurring !== 'none' && ` · ${RECURRING_LABELS[r.recurring]}`}
                    </span>
                    {r.note && <span className="fast-note">{r.note}</span>}
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="reminder-group">
              <p className="reminder-group-label" style={{ opacity: 0.5 }}>Past</p>
              {past.map(r => (
                <div key={r.id} className="reminder-item" style={{ opacity: 0.5 }}>
                  <div className="reminder-dot past-dot" />
                  <div className="reminder-content">
                    <span className="reminder-title">{r.title}</span>
                    <span className="reminder-date">{r.remind_date}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}