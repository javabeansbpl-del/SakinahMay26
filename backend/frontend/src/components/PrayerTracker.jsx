import { useState, useEffect } from 'react'
import { getPrayerLog, upsertPrayerLog } from '../lib/calendar'

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
const PRAYER_LABELS = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }
const PRAYER_ARABIC = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' }
const STATUSES = ['pending', 'prayed', 'missed', 'qada']

const STATUS_STYLE = {
  prayed:  { bg: 'var(--accent-green-100)', border: 'var(--accent-green-300)', color: 'var(--accent-green-500)', label: 'Prayed' },
  missed:  { bg: 'rgba(220,38,38,0.1)',     border: '#dc2626',                 color: '#ef4444',                 label: 'Missed' },
  qada:    { bg: 'rgba(230,187,81,0.1)',     border: 'var(--border-primary)',   color: 'var(--text-gold)',        label: 'Qada'   },
  pending: { bg: 'var(--bg-tertiary)',       border: 'var(--border-secondary)', color: 'var(--text-tertiary)',    label: 'Pending'},
}

function toDateString(d) {
  return d.toISOString().split('T')[0]
}

export default function PrayerTracker() {
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()))
  const [log, setLog] = useState({ fajr: 'pending', dhuhr: 'pending', asr: 'pending', maghrib: 'pending', isha: 'pending' })
  const [saving, setSaving] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLog(selectedDate)
  }, [selectedDate])

  async function loadLog(date) {
    setLoading(true)
    try {
      const data = await getPrayerLog(date)
      if (data) {
        setLog({ fajr: data.fajr, dhuhr: data.dhuhr, asr: data.asr, maghrib: data.maghrib, isha: data.isha })
      } else {
        setLog({ fajr: 'pending', dhuhr: 'pending', asr: 'pending', maghrib: 'pending', isha: 'pending' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function cycleStatus(prayer) {
    const current = log[prayer]
    const next = STATUSES[(STATUSES.indexOf(current) + 1) % STATUSES.length]
    const newLog = { ...log, [prayer]: next }
    setLog(newLog)
    setSaving(prayer)
    try {
      await upsertPrayerLog({ prayer_date: selectedDate, ...newLog })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(null)
    }
  }

  const prayedCount = PRAYERS.filter(p => log[p] === 'prayed').length

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">🕌 Prayer Tracker</h2>
          <p className="tracker-subtitle">Tap a prayer to cycle its status</p>
        </div>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Progress bar */}
      <div className="prayer-progress">
        <div className="prayer-progress-bar" style={{ width: `${(prayedCount / 5) * 100}%` }} />
      </div>
      <p className="prayer-progress-label">{prayedCount} of 5 prayed today</p>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="prayer-grid">
          {PRAYERS.map(prayer => {
            const style = STATUS_STYLE[log[prayer]]
            return (
              <button
                key={prayer}
                className="prayer-btn"
                style={{ background: style.bg, borderColor: style.border }}
                onClick={() => cycleStatus(prayer)}
                disabled={saving === prayer}
              >
                <span className="prayer-arabic">{PRAYER_ARABIC[prayer]}</span>
                <span className="prayer-name">{PRAYER_LABELS[prayer]}</span>
                <span className="prayer-status" style={{ color: style.color }}>
                  {saving === prayer ? '...' : style.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}