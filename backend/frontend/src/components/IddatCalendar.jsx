import { useState } from "react";
import "../css/Iddat.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function sameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
}

function inRange(date, start, end) {
  if (!start || !end) return false;
  const t = date.getTime();
  return t >= start.setHours(0,0,0,0) && t <= end.setHours(23,59,59,999);
}

function buildDays(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));
  return cells;
}

export default function IddatCalendar({ selectedDate, onDateChange, rangeStart, rangeEnd }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(selectedDate ? selectedDate.getFullYear()  : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth()     : today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build two months: current view + next
  const months = [
    { year: viewYear, month: viewMonth },
    viewMonth === 11
      ? { year: viewYear + 1, month: 0 }
      : { year: viewYear,     month: viewMonth + 1 },
  ];

  return (
    <div className="idc-wrap">
      {/* Navigation */}
      <div className="idc-nav">
        <button className="idc-nav-btn" onClick={prevMonth} aria-label="Previous">
          <svg viewBox="0 0 20 20" fill="none"><path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="idc-nav-label">
          {MONTHS[viewMonth]} {viewYear}
          {" — "}
          {MONTHS[months[1].month]} {months[1].year}
        </span>
        <button className="idc-nav-btn" onClick={nextMonth} aria-label="Next">
          <svg viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Two month grids */}
      <div className="idc-months">
        {months.map(({ year, month }) => {
          const cells = buildDays(year, month);
          return (
            <div key={`${year}-${month}`} className="idc-month">
              <div className="idc-month-label">{MONTHS[month]} {year}</div>
              <div className="idc-day-headers">
                {DAYS.map(d => <span key={d} className="idc-day-hdr">{d}</span>)}
              </div>
              <div className="idc-grid">
                {cells.map((date, i) => {
                  if (!date) return <span key={`e-${i}`} className="idc-cell idc-cell--empty" />;

                  const isToday    = sameDay(date, today);
                  const isSelected = sameDay(date, selectedDate);
                  const isStart    = sameDay(date, rangeStart);
                  const isEnd      = sameDay(date, rangeEnd);
                  const isIn       = rangeStart && rangeEnd && inRange(
                    new Date(date), new Date(rangeStart), new Date(rangeEnd)
                  );

                  let cls = "idc-cell";
                  if (isStart) cls += " idc-cell--start";
                  else if (isEnd) cls += " idc-cell--end";
                  else if (isIn) cls += " idc-cell--in-range";
                  if (isToday && !isSelected && !isStart && !isEnd) cls += " idc-cell--today";
                  if (isSelected && !isStart && !isEnd) cls += " idc-cell--selected";

                  return (
                    <button
                      key={date.toISOString()}
                      className={cls}
                      onClick={() => onDateChange(date)}
                      aria-label={date.toDateString()}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="idc-legend">
        <span className="idc-legend-item"><span className="idc-legend-dot idc-legend-dot--start" />Start date</span>
        <span className="idc-legend-item"><span className="idc-legend-dot idc-legend-dot--range" />Iddat period</span>
        <span className="idc-legend-item"><span className="idc-legend-dot idc-legend-dot--end" />End date</span>
        <span className="idc-legend-item"><span className="idc-legend-dot idc-legend-dot--today" />Today</span>
      </div>
    </div>
  );
}