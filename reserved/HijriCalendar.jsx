import { useState } from 'react'
import {
  useHijriCalendar,
  gregorianToHijri,
  HIJRI_MONTH_NAMES,
  HIJRI_MONTH_ARABIC
} from '../lib/hijriCalendar'
import '../css/HijriCalendar.css'

const WEEKDAYS     = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const GREG_MONTHS  = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function toDateKey(date) {
  return date.toISOString().split('T')[0]
}

export default function HijriCalendar() {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed
  const [selected,  setSelected]  = useState(toDateKey(today))

  const { loading, error, getHijriDate, getMonthInfo } = useHijriCalendar()

  // ── Build calendar days ────────────────────────────────────────────────────
  const firstDay  = new Date(viewYear, viewMonth, 1)
  const lastDay   = new Date(viewYear, viewMonth + 1, 0)
  const startPad  = firstDay.getDay() // 0 = Sunday
  const totalDays = lastDay.getDate()

  // All cells including padding
  const cells = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(viewYear, viewMonth, d))

  // ── Selected date info ─────────────────────────────────────────────────────
  const selectedDate = selected ? new Date(selected) : today
  const selectedHijri = getHijriDate(selectedDate)
  const monthInfo = getMonthInfo(selectedHijri.year, selectedHijri.month)

  // ── Navigation ─────────────────────────────────────────────────────────────
  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function goToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelected(toDateKey(today))
  }

  // ── Hijri month header for current view ────────────────────────────────────
  // Find what hijri month(s) overlap with this gregorian month
  const midDate    = new Date(viewYear, viewMonth, 15)
  const midHijri   = getHijriDate(midDate)
  const midMonInfo = getMonthInfo(midHijri.year, midHijri.month)

  return (
    <div className="hijri-calendar-wrapper">

      {/* ── Top: selected date display ──────────────────────────────────── */}
      <div className="selected-date-panel">
        <div className="selected-greg">
          <span className="selected-greg-day">{selectedDate.getDate()}</span>
          <div className="selected-greg-rest">
            <span className="selected-greg-month">{GREG_MONTHS[selectedDate.getMonth()]}</span>
            <span className="selected-greg-year">{selectedDate.getFullYear()}</span>
          </div>
        </div>

        <div className="selected-divider" />

        <div className="selected-hijri">
          <span className="selected-hijri-day">{selectedHijri.day}</span>
          <div className="selected-hijri-rest">
            <span className="selected-hijri-month-ar">{HIJRI_MONTH_ARABIC[selectedHijri.month]}</span>
            <span className="selected-hijri-month-en">{HIJRI_MONTH_NAMES[selectedHijri.month]} {selectedHijri.year} H</span>
          </div>
          {monthInfo && (
            <span className={`confirmed-badge ${monthInfo.confirmed ? 'confirmed' : 'tentative'}`}>
              {monthInfo.confirmed ? 'Confirmed' : '~ Tentative'}
            </span>
          )}
        </div>
      </div>

      {/* ── Calendar grid ───────────────────────────────────────────────── */}
      <div className="calendar-card">

        {/* Month navigation */}
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <div className="cal-nav-center">
            <span className="cal-greg-label">{GREG_MONTHS[viewMonth]} {viewYear}</span>
            <span className="cal-hijri-label">
              {loading ? '...' : `${HIJRI_MONTH_ARABIC[midHijri.month]} ${midHijri.year}`}
            </span>
          </div>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        {/* Weekday headers */}
        <div className="cal-weekdays">
          {WEEKDAYS.map(d => (
            <div key={d} className={`cal-weekday ${d === 'Fri' ? 'friday' : ''}`}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        {loading ? (
          <div className="cal-loading">Loading calendar...</div>
        ) : error ? (
          <div className="cal-loading">Could not load calendar data.</div>
        ) : (
          <div className="cal-grid-days">
            {cells.map((date, i) => {
              if (!date) return <div key={`pad-${i}`} className="cal-day empty" />

              const dateKey   = toDateKey(date)
              const isToday   = dateKey === toDateKey(today)
              const isSelected = dateKey === selected
              const hijri     = getHijriDate(date)
              const isFriday  = date.getDay() === 5

              return (
                <button
                  key={dateKey}
                  className={`cal-day
                    ${isToday    ? 'today'    : ''}
                    ${isSelected ? 'selected' : ''}
                    ${isFriday   ? 'friday'   : ''}
                  `}
                  onClick={() => setSelected(dateKey)}
                >
                  <span className="cal-day-greg">{date.getDate()}</span>
                  <span className="cal-day-hijri">{hijri.day}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Today button */}
        <div className="cal-footer">
          <button
            className={`today-jump-btn ${toDateKey(today) === selected ? '' : 'active'}`}
            onClick={goToday}
          >
            Jump to today
          </button>
          {midMonInfo && (
            <span className={`footer-badge ${midMonInfo.confirmed ? 'confirmed' : 'tentative'}`}>
              {midMonInfo.confirmed ? '✓ Dates confirmed' : '~ Dates tentative'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}