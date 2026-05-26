import { useState, useEffect } from 'react'
import { getIslamicEvents } from '../lib/calendar'

const HIJRI_MONTHS = [
  '', 'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
]

const TYPE_COLORS = {
  holiday:     { bg: 'rgba(230,187,81,0.12)',  color: 'var(--text-gold)',        label: 'Holiday'     },
  fast:        { bg: 'rgba(50,156,91,0.12)',   color: 'var(--accent-green-500)', label: 'Fast'        },
  observance:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa',                 label: 'Observance'  },
}

export default function IslamicEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getIslamicEvents()
      .then(data => setEvents(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)

  return (
    <div className="tracker-card">
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">☪️ Islamic Events</h2>
          <p className="tracker-subtitle">Key dates of the Hijri year</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="event-filters">
        {['all', 'holiday', 'fast', 'observance'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : TYPE_COLORS[f].label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-text">No events found.</p>
      ) : (
        <div className="events-list">
          {filtered.map(event => {
            const typeStyle = TYPE_COLORS[event.event_type] || TYPE_COLORS.observance
            return (
              <div key={event.id} className="event-item" style={{ background: typeStyle.bg }}>
                <div className="event-item-left">
                  <span className="event-name">{event.name_en}</span>
                  {event.name_ar && <span className="event-arabic">{event.name_ar}</span>}
                  <span className="event-date">
                    {HIJRI_MONTHS[event.hijri_month]} {event.hijri_day}
                    {event.duration_days > 1 ? ` — ${event.duration_days} days` : ''}
                  </span>
                </div>
                <span className="event-type-badge" style={{ color: typeStyle.color }}>
                  {typeStyle.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}