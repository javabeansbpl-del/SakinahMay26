import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Aqiqah.css";

/* ═══════════════════════════════════════════════════
   CALCULATION LOGIC
   Day of birth = Day 1, so 7th day = +6 days
   ═══════════════════════════════════════════════════ */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const fmtShort = (d) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const fmtHijri = (d) => {
  try {
    return new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(d);
  } catch { return ""; }
};

const daysUntil = (d) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(d); target.setHours(0,0,0,0);
  return Math.ceil((target - today) / 86400000);
};

/* ── Calendar constants ── */
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

function sameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/* ── Mini inline calendar ── */
function AqiqahCalendar({ birthDate, onBirthDateChange, highlightDates }) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(birthDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(birthDate.getMonth());

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y=>y-1); } else setViewMonth(m=>m-1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y=>y+1); } else setViewMonth(m=>m+1); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  return (
    <div className="aq-cal">
      <div className="aq-cal__nav">
        <button className="aq-cal__nav-btn" onClick={prev}>
          <svg viewBox="0 0 20 20" fill="none"><path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="aq-cal__nav-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="aq-cal__nav-btn" onClick={next}>
          <svg viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="aq-cal__headers">
        {DAYS_SHORT.map(d => <span key={d} className="aq-cal__hdr">{d}</span>)}
      </div>

      <div className="aq-cal__grid">
        {cells.map((date, i) => {
          if (!date) return <span key={`e-${i}`} className="aq-cal__cell aq-cal__cell--empty" />;
          const isBirth    = sameDay(date, birthDate);
          const isHighlit  = highlightDates.some(h => sameDay(date, h));
          const isToday    = sameDay(date, today);
          let cls = "aq-cal__cell";
          if (isBirth)    cls += " aq-cal__cell--birth";
          else if (isHighlit) cls += " aq-cal__cell--highlight";
          else if (isToday)   cls += " aq-cal__cell--today";
          return (
            <button key={date.toISOString()} className={cls} onClick={() => onBirthDateChange(date)}>
              {date.getDate()}
              {isBirth && <span className="aq-cal__cell-dot aq-cal__cell-dot--birth" />}
              {isHighlit && !isBirth && <span className="aq-cal__cell-dot aq-cal__cell-dot--aqiqah" />}
            </button>
          );
        })}
      </div>

      <div className="aq-cal__legend">
        <span className="aq-cal__legend-item"><span className="aq-cal__legend-dot aq-cal__legend-dot--birth"/>Birth date</span>
        <span className="aq-cal__legend-item"><span className="aq-cal__legend-dot aq-cal__legend-dot--7th"/>7th day</span>
        <span className="aq-cal__legend-item"><span className="aq-cal__legend-dot aq-cal__legend-dot--alt"/>Alt. dates</span>
        <span className="aq-cal__legend-item"><span className="aq-cal__legend-dot aq-cal__legend-dot--today"/>Today</span>
      </div>
    </div>
  );
}

/* ── Sunnah checklist items ── */
const CHECKLIST = [
  { id: "naming",    label: "Give the child a good Islamic name",      icon: "✍️", day: "Day 1–7" },
  { id: "adhan",     label: "Recite Adhan in the right ear",           icon: "📢", day: "At birth" },
  { id: "tahnik",    label: "Perform Tahnik (date on the palate)",     icon: "🌴", day: "At birth" },
  { id: "shaving",   label: "Shave the baby's head on 7th day",       icon: "✂️", day: "Day 7" },
  { id: "sadaqah",   label: "Give silver's weight in charity",        icon: "⚖️", day: "Day 7" },
  { id: "aqiqah",    label: "Slaughter the Aqiqah animal",            icon: "🐐", day: "Day 7" },
  { id: "distribute","label": "Distribute meat — family & poor",      icon: "🍖", day: "Day 7" },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Aqiqah() {
  const [birthDate, setBirthDate]     = useState(new Date());
  const [gender, setGender]           = useState("boy");
  const [childName, setChildName]     = useState("");
  const [checked, setChecked]         = useState({});

  /* ── Computed dates ── */
  const day7  = useMemo(() => addDays(birthDate, 6),  [birthDate]);
  const day14 = useMemo(() => addDays(birthDate, 13), [birthDate]);
  const day21 = useMemo(() => addDays(birthDate, 20), [birthDate]);

  const highlightDates = [day7, day14, day21];

  const countdown7  = daysUntil(day7);
  const countdown14 = daysUntil(day14);
  const countdown21 = daysUntil(day21);

  const isBoy = gender === "boy";

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="aq-hero">
        <div className="aq-hero__bg" aria-hidden="true">
          <div className="aq-hero__overlay" />
          <div className="aq-hero__stars" />
          <div className="aq-hero__ring aq-hero__ring--a" />
          <div className="aq-hero__ring aq-hero__ring--b" />
          <div className="aq-hero__ring aq-hero__ring--c" />
          {/* Floating crescents */}
          <span className="aq-hero__crescent aq-hero__crescent--1">☽</span>
          <span className="aq-hero__crescent aq-hero__crescent--2">☽</span>
          <span className="aq-hero__crescent aq-hero__crescent--3">✦</span>
          <span className="aq-hero__crescent aq-hero__crescent--4">✦</span>
        </div>

        <div className="aq-hero__body">
          <span className="aq-hero__eyebrow">
            <span className="aq-hero__eyebrow-dot" />
            Birth Celebration · Sunnah Practice
          </span>

          <h1 className="aq-hero__title">
            <span className="aq-hero__title-ar">حاسبة العَقِيقَة</span>
            Aqiqah Calculator
          </h1>

          <p className="aq-hero__sub">
            Calculate the blessed Aqiqah dates for your newborn — the 7th,
            14th, and 21st day — and follow the complete Sunnah of welcoming
            a new soul into the world.
          </p>

          <div className="aq-hero__verse">
            <span className="aq-hero__verse-ar">
              كُلُّ غُلَامٍ رَهِينٌ بِعَقِيقَتِهِ
            </span>
            <span className="aq-hero__verse-ref">
              "Every child is pledged by his Aqiqah" — Sunan Abu Dawood
            </span>
          </div>
        </div>

        <div className="aq-hero__stats">
          {[
            { val: "Day 7",  label: "Preferred date" },
            { val: "2",      label: "Goats for a boy" },
            { val: "1",      label: "Goat for a girl" },
            { val: "Sunnah", label: "Obligation level" },
          ].map((s) => (
            <div key={s.label} className="aq-hero__stat">
              <strong>{s.val}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <main className="aq-main">
        <div className="aq-layout">

          {/* ── LEFT: Inputs ── */}
          <div className="aq-left">

            {/* Child details */}
            <div className="aq-panel">
              <h3 className="aq-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="aq-panel__icon">
                  <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Child Details
              </h3>

              {/* Name */}
              <div className="aq-field">
                <label className="aq-label">Child's Name (optional)</label>
                <input
                  type="text"
                  className="aq-input"
                  placeholder="Enter baby's name…"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                />
              </div>

              {/* Gender */}
              <div className="aq-field">
                <label className="aq-label">Gender</label>
                <div className="aq-gender-toggle">
                  <button
                    className={`aq-gender-btn ${gender === "boy" ? "active active--blue" : ""}`}
                    onClick={() => setGender("boy")}
                  >
                    <span className="aq-gender-btn__icon">👦</span>
                    <span className="aq-gender-btn__label">Boy</span>
                    <span className="aq-gender-btn__ar">ولد</span>
                    <span className="aq-gender-btn__rule">2 goats</span>
                  </button>
                  <button
                    className={`aq-gender-btn ${gender === "girl" ? "active active--pink" : ""}`}
                    onClick={() => setGender("girl")}
                  >
                    <span className="aq-gender-btn__icon">👧</span>
                    <span className="aq-gender-btn__label">Girl</span>
                    <span className="aq-gender-btn__ar">بنت</span>
                    <span className="aq-gender-btn__rule">1 goat</span>
                  </button>
                </div>
              </div>

              {/* Birth date */}
              <div className="aq-field">
                <label className="aq-label">Date of Birth</label>
                <input
                  type="date"
                  className="aq-date-input"
                  value={birthDate.toISOString().split("T")[0]}
                  onChange={e => {
                    const d = new Date(e.target.value);
                    if (!isNaN(d)) setBirthDate(d);
                  }}
                />
                <span className="aq-date-hijri">{fmtHijri(birthDate)}</span>
              </div>
            </div>

            {/* Animal summary */}
            <div className={`aq-animal-card ${isBoy ? "aq-animal-card--boy" : "aq-animal-card--girl"}`}>
              <div className="aq-animal-card__icon">🐐</div>
              <div className="aq-animal-card__body">
                <h4 className="aq-animal-card__title">
                  {isBoy ? "Two Goats Recommended" : "One Goat Recommended"}
                </h4>
                <p className="aq-animal-card__desc">
                  {isBoy
                    ? "The Prophet ﷺ sacrificed two equal goats for a boy (Tirmidhi). One is also permissible."
                    : "One goat is prescribed for a girl, equivalent in quality to those for a boy."}
                </p>
                <div className="aq-animal-card__goats">
                  {Array.from({ length: isBoy ? 2 : 1 }).map((_, i) => (
                    <span key={i} className="aq-animal-card__goat">🐐</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sunnah checklist */}
            <div className="aq-panel">
              <div className="aq-panel__head">
                <h3 className="aq-panel__title">
                  <svg viewBox="0 0 20 20" fill="none" className="aq-panel__icon">
                    <path d="M5 10l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Sunnah Checklist
                </h3>
                <span className="aq-panel__badge">{checkedCount}/{CHECKLIST.length}</span>
              </div>

              {/* Progress bar */}
              <div className="aq-checklist-progress">
                <div className="aq-checklist-progress__fill" style={{ width: `${(checkedCount/CHECKLIST.length)*100}%` }} />
              </div>

              <div className="aq-checklist">
                {CHECKLIST.map(item => (
                  <label key={item.id} className={`aq-check-item ${checked[item.id] ? "aq-check-item--done" : ""}`}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggleCheck(item.id)}
                      className="aq-check-input"
                    />
                    <span className="aq-check-box">
                      {checked[item.id] && (
                        <svg viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="aq-check-icon">{item.icon}</span>
                    <div className="aq-check-text">
                      <span className="aq-check-label">{item.label}</span>
                      <span className="aq-check-day">{item.day}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Calendar + Results ── */}
          <div className="aq-right">

            {/* Calendar */}
            <div className="aq-panel">
              <h3 className="aq-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="aq-panel__icon">
                  <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 2v3M13 2v3M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Aqiqah Calendar
              </h3>
              <AqiqahCalendar
                birthDate={birthDate}
                onBirthDateChange={setBirthDate}
                highlightDates={highlightDates}
              />
            </div>

            {/* Date cards — 7th, 14th, 21st */}
            <div className="aq-date-cards">
              {[
                { label: "7th Day", arabic: "اليوم السابع", date: day7,  count: countdown7,  preferred: true,  desc: "Preferred — most reward" },
                { label: "14th Day",arabic: "اليوم الرابع عشر", date: day14, count: countdown14, preferred: false, desc: "If 7th was missed" },
                { label: "21st Day",arabic: "اليوم الحادي والعشرون", date: day21, count: countdown21, preferred: false, desc: "Final recommended day" },
              ].map(({ label, arabic, date, count, preferred, desc }) => {
                const isPast = count < 0;
                const isToday = count === 0;
                return (
                  <div key={label} className={`aq-date-card ${preferred ? "aq-date-card--preferred" : ""} ${isPast ? "aq-date-card--past" : ""}`}>
                    {preferred && <span className="aq-date-card__preferred-badge">⭐ Preferred</span>}
                    <div className="aq-date-card__top">
                      <div>
                        <span className="aq-date-card__arabic">{arabic}</span>
                        <h4 className="aq-date-card__label">{label}</h4>
                        <span className="aq-date-card__gregorian">{fmtDate(date)}</span>
                        <span className="aq-date-card__hijri">{fmtHijri(date)}</span>
                      </div>
                      <div className="aq-date-card__countdown">
                        {isPast ? (
                          <span className="aq-date-card__past-label">Passed</span>
                        ) : isToday ? (
                          <span className="aq-date-card__today-label">Today!</span>
                        ) : (
                          <>
                            <span className="aq-date-card__days">{count}</span>
                            <span className="aq-date-card__days-label">days away</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="aq-date-card__desc">{desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Birth summary banner */}
            <div className="aq-birth-banner">
              <div className="aq-birth-banner__left">
                <span className="aq-birth-banner__emoji">🌙</span>
                <div>
                  {childName && (
                    <span className="aq-birth-banner__name">{childName}</span>
                  )}
                  <span className="aq-birth-banner__label">
                    {isBoy ? "Baby Boy" : "Baby Girl"} born on
                  </span>
                  <span className="aq-birth-banner__date">{fmtDate(birthDate)}</span>
                  <span className="aq-birth-banner__hijri">{fmtHijri(birthDate)}</span>
                </div>
              </div>
              <div className="aq-birth-banner__dua">
                <span className="aq-birth-banner__dua-ar">بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوبِ لَكَ</span>
                <span className="aq-birth-banner__dua-en">"May Allah bless you in what He has gifted you"</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ══ SUNNAH ACTS STRIP ══ */}
      <section className="aq-sunnah-strip">
        <div className="aq-sunnah-strip__inner">
          <h2 className="aq-sunnah-strip__heading">Sunnah Acts on the 7th Day</h2>
          <div className="aq-sunnah-grid">
            {[
              { icon: "✂️", title: "Shaving the Head",   arabic: "حلق الرأس",  desc: "The baby's head is shaved and silver equivalent to the hair's weight is given in charity." },
              { icon: "🐐", title: "Aqiqah Slaughter",   arabic: "ذبح العقيقة", desc: "Two goats for a boy and one for a girl, slaughtered as thanksgiving to Allah." },
              { icon: "✍️", title: "Naming the Child",   arabic: "تسمية الطفل", desc: "Choose a beautiful Islamic name — the Prophet ﷺ encouraged names with good meanings." },
              { icon: "🍖", title: "Distributing Meat",  arabic: "توزيع اللحم", desc: "Meat is distributed among family, neighbours, and the poor — a Sunnah of generosity." },
            ].map(item => (
              <div key={item.title} className="aq-sunnah-card">
                <span className="aq-sunnah-card__icon">{item.icon}</span>
                <span className="aq-sunnah-card__ar">{item.arabic}</span>
                <h4 className="aq-sunnah-card__title">{item.title}</h4>
                <p className="aq-sunnah-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QURAN BANNER ══ */}
      <div className="aq-quran-banner">
        <span className="aq-quran-banner__ar">
          رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ
        </span>
        <span className="aq-quran-banner__en">
          "My Lord, grant me from Yourself good offspring. Indeed, You are the Hearer of supplication." — Āl 'Imrān 3:38
        </span>
      </div>

      <Footer />
    </>
  );
}