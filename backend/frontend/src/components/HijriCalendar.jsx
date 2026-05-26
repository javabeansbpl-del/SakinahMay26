import { useState } from 'react'
import {
  getHijriDate,
  getHijriMonthLength,
  getHijriMonthStart,
  HIJRI_MONTH_NAMES,
  HIJRI_MONTH_ARABIC,
} from '../lib/hijriCalendar'
import '../css/HijriCalendar.css'

const WEEKDAYS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const GREG_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function toDateKey(date) {
  return date.toISOString().split('T')[0]
}

// ── build an array of JS Dates covering all days of a Hijri month ──────────
function buildHijriMonthDays(hYear, hMonth) {
  const start = getHijriMonthStart(hYear, hMonth)
  const length = getHijriMonthLength(hYear, hMonth)
  const days = []
  for (let i = 0; i < length; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

// ── One month grid (Hijri) ─────────────────────────────────────────────────
function HijriMonthGrid({ hYear, hMonth, today, selected, onSelect, isPrediction }) {
  const days = buildHijriMonthDays(hYear, hMonth)
  const firstDow = days[0].getDay() // 0 = Sun

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  days.forEach(d => cells.push(d))

  return (
    <div className="hc-month">
      <div className="hc-month__header">
        <div className="hc-month__name-ar">{HIJRI_MONTH_ARABIC[hMonth]}</div>
        <div className="hc-month__name-en">{HIJRI_MONTH_NAMES[hMonth]}</div>
        <div className="hc-month__year">{hYear} AH</div>
        {isPrediction && (
          <span className="hc-month__predict-badge">~ Estimated</span>
        )}
      </div>

      <div className="hc-weekdays">
        {WEEKDAYS.map(d => (
          <div key={d} className={`hc-weekday ${d === 'Fri' ? 'friday' : ''}`}>{d}</div>
        ))}
      </div>

      <div className="hc-grid">
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} className="hc-cell hc-cell--empty" />

          const key         = toDateKey(date)
          const greg        = getHijriDate(date)
          const isToday     = key === toDateKey(today)
          const isSelected  = key === selected
          const isFriday    = date.getDay() === 5
          const hijriDay    = greg.day

          return (
            <button
              key={key}
              onClick={() => onSelect(key, date)}
              className={[
                'hc-cell',
                isToday    ? 'hc-cell--today'    : '',
                isSelected ? 'hc-cell--selected' : '',
                isFriday   ? 'hc-cell--friday'   : '',
              ].join(' ')}
            >
              <span className="hc-cell__greg">{date.getDate()}</span>
              <span className="hc-cell__hijri">{hijriDay}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function HijriCalendar() {
  const today    = new Date()
  const todayKey = toDateKey(today)

  // View state: which Hijri month pair to show
  const todayHijri = getHijriDate(today)
  const [viewHYear, setViewHYear]   = useState(todayHijri.year)
  const [viewHMonth, setViewHMonth] = useState(todayHijri.month)

  // Selection
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [selectedDate, setSelectedDate] = useState(today)

  // "Next" Hijri month for the second panel
  const nextHMonth = viewHMonth === 12 ? 1 : viewHMonth + 1
  const nextHYear  = viewHMonth === 12 ? viewHYear + 1 : viewHYear

  function prevMonth() {
    if (viewHMonth === 1) { setViewHMonth(12); setViewHYear(y => y - 1) }
    else setViewHMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewHMonth === 12) { setViewHMonth(1); setViewHYear(y => y + 1) }
    else setViewHMonth(m => m + 1)
  }

  function goToday() {
    const h = getHijriDate(today)
    setViewHYear(h.year)
    setViewHMonth(h.month)
    setSelectedKey(todayKey)
    setSelectedDate(today)
  }

  function handleSelect(key, date) {
    setSelectedKey(key)
    setSelectedDate(date)
  }

  const selHijri = getHijriDate(selectedDate)
  const monthLen = getHijriMonthLength(viewHMonth === 12 && nextHMonth === 1 ? nextHYear : viewHYear, viewHMonth)

  return (
    <div className="hc-wrapper">

      {/* ── Selected date panel ── */}
      <div className="hc-selected-panel">
        <div className="hc-selected__greg">
          <span className="hc-selected__greg-day">{selectedDate.getDate()}</span>
          <div>
            <span className="hc-selected__greg-month">{GREG_MONTHS[selectedDate.getMonth()]}</span>
            <span className="hc-selected__greg-year">{selectedDate.getFullYear()}</span>
          </div>
        </div>

        <div className="hc-selected__divider" />

        <div className="hc-selected__hijri">
          <span className="hc-selected__hijri-day">{selHijri.day}</span>
          <div>
            <span className="hc-selected__hijri-month-ar">{HIJRI_MONTH_ARABIC[selHijri.month]}</span>
            <span className="hc-selected__hijri-month-en">
              {HIJRI_MONTH_NAMES[selHijri.month]} {selHijri.year} AH
            </span>
          </div>
        </div>

        <div className="hc-selected__info">
          <span className="hc-selected__month-len">{monthLen}-day month</span>
          {selectedKey === todayKey && (
            <span className="hc-selected__today-tag">Today</span>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="hc-nav">
        <button className="hc-nav__btn" onClick={prevMonth}>‹</button>
        <div className="hc-nav__center">
          <span className="hc-nav__label">
            {HIJRI_MONTH_NAMES[viewHMonth]} {viewHYear} — {HIJRI_MONTH_NAMES[nextHMonth]} {nextHYear}
          </span>
          <span className="hc-nav__label-ar">
            {HIJRI_MONTH_ARABIC[viewHMonth]} ← {HIJRI_MONTH_ARABIC[nextHMonth]}
          </span>
        </div>
        <button className="hc-nav__btn" onClick={nextMonth}>›</button>
      </div>

      {/* ── Two month grids ── */}
      <div className="hc-months-row">
        <HijriMonthGrid
          hYear={viewHYear}
          hMonth={viewHMonth}
          today={today}
          selected={selectedKey}
          onSelect={handleSelect}
          isPrediction={false}
        />
        <HijriMonthGrid
          hYear={nextHYear}
          hMonth={nextHMonth}
          today={today}
          selected={selectedKey}
          onSelect={handleSelect}
          isPrediction={true}
        />
      </div>

      {/* ── Footer ── */}
      <div className="hc-footer">
        <button
          className={`hc-today-btn ${selectedKey !== todayKey ? 'active' : ''}`}
          onClick={goToday}
        >
          Jump to today
        </button>
        <div className="hc-legend">
          <span className="hc-legend__item">
            <span className="hc-legend__dot hc-legend__dot--today" />Today
          </span>
          <span className="hc-legend__item">
            <span className="hc-legend__dot hc-legend__dot--selected" />Selected
          </span>
          <span className="hc-legend__item">
            <span className="hc-legend__dot hc-legend__dot--friday" />Friday
          </span>
          <span className="hc-legend__item hc-legend__item--note">
            ~ Next month is estimated
          </span>
        </div>
      </div>
    </div>
  )
}