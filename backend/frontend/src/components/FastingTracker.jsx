import { useState, useEffect } from 'react'
import { getFastingLog, logFast, deleteFast } from '../lib/calendar'

const FAST_TYPES = ['ramadan', 'voluntary', 'qada', 'arafah', 'ashura', 'shawwal']
const TYPE_LABELS = {
  ramadan: 'Ramadan', voluntary: 'Voluntary', qada: 'Qada',
  arafah: 'Arafah', ashura: 'Ashura', shawwal: 'Shawwal 6'
}
const TYPE_COLORS = {
  ramadan:   'var(--text-gold)',
  voluntary: 'var(--accent-green-500)',
  qada:      '#a78bfa',
  arafah:    '#60a5fa',
  ashura:    '#f472b6',
  shawwal:   '#34d399',
}

function toDateString(d) {
  return d.toISOString().split('T')[0]
}

export default function FastingTracker() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fast_date: toDateString(new Date()), fast_type: 'voluntary', note: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadLogs() }, [])

  async function loadLogs() {
    setLoading(true)
    try {
      const data = await getFastingLog()
      setLogs(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleLog(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const saved = await logFast({ ...form, completed: true })
      setLogs(prev => {
        const exists = prev.findIndex(l => l.fast_date === saved.fast_date)
        if (exists >= 0) { const n = [...prev]; n[exists] = saved; return n }
        return [saved, ...prev]
      })
      setShowForm(false)
      setForm({ fast_date: toDateString(new Date()), fast_type: 'voluntary', note: '' })
    } catch (e) {
      setError(e.message || 'Could not save fast.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFast(id)
      setLogs(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const totalFasts = logs.length
  const ramadanFasts = logs.filter(l => l.fast_type === 'ramadan').length

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">🌙 Fasting Tracker</h2>
          <p className="tracker-subtitle">{totalFasts} total · {ramadanFasts} Ramadan</p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Fast'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form className="fast-form" onSubmit={handleLog}>
          {error && <p className="form-error">{error}</p>}
          <div className="fast-form-row">
            <div className="input-wrapper">
              <label className="field-label">Date</label>
              <input
                type="date"
                className="text-input"
                value={form.fast_date}
                onChange={e => setForm(f => ({ ...f, fast_date: e.target.value }))}
                required
              />
            </div>
            <div className="input-wrapper">
              <label className="field-label">Type</label>
              <select
                className="text-input"
                value={form.fast_type}
                onChange={e => setForm(f => ({ ...f, fast_type: e.target.value }))}
              >
                {FAST_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>
          <div className="input-wrapper">
            <label className="field-label">Note (optional)</label>
            <input
              type="text"
              className="text-input"
              placeholder="Any notes..."
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>
          <button type="submit" className="action-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Fast'}
          </button>
        </form>
      )}

      {/* Log list */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="empty-text">No fasts logged yet. Click "+ Log Fast" to start.</p>
      ) : (
        <div className="fast-list">
          {logs.map(log => (
            <div key={log.id} className="fast-item">
              <div className="fast-item-left">
                <span className="fast-type-badge" style={{ color: TYPE_COLORS[log.fast_type] }}>
                  {TYPE_LABELS[log.fast_type]}
                </span>
                <span className="fast-date">{log.fast_date}</span>
                {log.note && <span className="fast-note">{log.note}</span>}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(log.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}