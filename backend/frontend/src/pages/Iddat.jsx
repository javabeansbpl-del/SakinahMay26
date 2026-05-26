import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IddatCalendar from "../components/IddatCalendar";
import "../css/Iddat.css";

/* ═══════════════════════════════════════
   IDDAH CALCULATION RULES
   ═══════════════════════════════════════ */

// Widow: 4 months + 10 days from date of husband's death
function calcWidow(start) {
  const d = new Date(start);
  d.setMonth(d.getMonth() + 4);
  d.setDate(d.getDate() + 10);
  return d;
}

// Divorce (regular menstruating woman): 3 complete menstrual cycles
// Approximated as 90 days; note: actual depends on cycles
function calcDivorce(start) {
  const d = new Date(start);
  d.setDate(d.getDate() + 90);
  return d;
}

// Divorce (post-menopausal / non-menstruating): 3 lunar months = ~89 days
function calcDivorceLunar(start) {
  const d = new Date(start);
  d.setMonth(d.getMonth() + 3);
  return d;
}

// Pregnant: until delivery (user enters expected due date)
// We just show until due date

const TYPES = [
  {
    id: "death",
    label: "Death of Husband",
    arabic: "وفاة الزوج",
    icon: "🌙",
    desc: "4 months and 10 days from the date of death",
    rule: "4 months + 10 days",
    color: "gold",
    calc: calcWidow,
  },
  {
    id: "divorce",
    label: "Divorce (Menstruating)",
    arabic: "طلاق — ذات الحيض",
    icon: "📅",
    desc: "Three complete menstrual cycles (~90 days)",
    rule: "3 menstrual cycles ≈ 90 days",
    color: "green",
    calc: calcDivorce,
  },
  {
    id: "divorce_lunar",
    label: "Divorce (Non-menstruating)",
    arabic: "طلاق — غير ذات الحيض",
    icon: "🗓️",
    desc: "Three lunar months for post-menopausal or young girls",
    rule: "3 lunar months",
    color: "gold",
    calc: calcDivorceLunar,
  },
];

/* ── helpers ── */
const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const fmtHijri = (d) => {
  try {
    return new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
};

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function progressPct(start, end) {
  const today = new Date();
  if (today <= start) return 0;
  if (today >= end)   return 100;
  return Math.round(((today - start) / (end - start)) * 100);
}

/* ── countdown segments ── */
function decompose(startDate, endDate, typeId) {
  if (typeId === "death") {
    return [
      { label: "Months", val: 4 },
      { label: "Extra Days", val: 10 },
    ];
  }
  if (typeId === "divorce") {
    return [{ label: "Menstrual cycles", val: 3 }, { label: "Approx. days", val: 90 }];
  }
  return [{ label: "Lunar months", val: 3 }];
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function Iddat() {
  const today = new Date();
  const [selectedType, setSelectedType] = useState("death");
  const [startDate, setStartDate] = useState(today);

  const typeCfg = TYPES.find((t) => t.id === selectedType);

  const endDate = useMemo(
    () => typeCfg.calc(startDate),
    [startDate, selectedType] // eslint-disable-line
  );

  const totalDays    = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);
  const daysElapsed  = useMemo(() => Math.max(0, Math.min(totalDays, daysBetween(startDate, today))), [startDate, totalDays]);
  const daysLeft     = useMemo(() => Math.max(0, daysBetween(today, endDate)), [endDate]);
  const pct          = useMemo(() => progressPct(startDate, endDate), [startDate, endDate]);
  const isComplete   = today >= endDate;
  const notStarted   = today < startDate;
  const segments     = decompose(startDate, endDate, selectedType);

  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="id-hero">
        <div className="id-hero__bg" aria-hidden="true">
          <div className="id-hero__overlay" />
          <div className="id-hero__dots" />
          <div className="id-hero__ring id-hero__ring--a" />
          <div className="id-hero__ring id-hero__ring--b" />
          <div className="id-hero__ring id-hero__ring--c" />
        </div>

        <div className="id-hero__body">
          <span className="id-hero__eyebrow">
            <span className="id-hero__eyebrow-dot" />
            Islamic Law · Waiting Period
          </span>

          <h1 className="id-hero__title">
            <span className="id-hero__title-ar">حاسبة العِدَّة</span>
            Iddat Period Calculator
          </h1>

          <p className="id-hero__sub">
            Calculate the sacred waiting period with precision — guided by
            Quranic injunctions and classical Fiqh rulings.
          </p>

          <div className="id-hero__verse">
            <span className="id-hero__verse-ar">
              وَالْمُطَلَّقَاتُ يَتَرَبَّصْنَ بِأَنفُسِهِنَّ ثَلَاثَةَ قُرُوءٍ
            </span>
            <span className="id-hero__verse-ref">
              "Divorced women remain in waiting for three periods" — Al-Baqarah 2:228
            </span>
          </div>
        </div>

        <div className="id-hero__stats">
          {[
            { val: "3",          label: "Types of Iddat" },
            { val: "4m 10d",     label: "Widow period" },
            { val: "3 cycles",   label: "Divorce period" },
            { val: "Delivery",   label: "If pregnant" },
          ].map((s) => (
            <div key={s.label} className="id-hero__stat">
              <strong>{s.val}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <main className="id-main">
        <div className="id-layout">

          {/* ── LEFT: Type + Date ── */}
          <div className="id-left">

            {/* Type selector */}
            <div className="id-panel">
              <h3 className="id-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="id-panel__icon">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 7v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Type of Iddat
              </h3>

              <div className="id-types">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    className={`id-type-card ${selectedType === t.id ? `id-type-card--active id-type-card--${t.color}` : ""}`}
                    onClick={() => setSelectedType(t.id)}
                  >
                    <span className="id-type-card__icon">{t.icon}</span>
                    <div className="id-type-card__body">
                      <span className="id-type-card__ar">{t.arabic}</span>
                      <span className="id-type-card__label">{t.label}</span>
                      <span className="id-type-card__rule">{t.rule}</span>
                    </div>
                    {selectedType === t.id && (
                      <span className="id-type-card__check">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <p className="id-type-note">
                {typeCfg.desc}
              </p>
            </div>

            {/* Start date picker */}
            <div className="id-panel">
              <h3 className="id-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="id-panel__icon">
                  <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 2v3M13 2v3M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Start Date
              </h3>

              <div className="id-date-field">
                <label className="id-date-label">
                  {selectedType === "death"
                    ? "Date of husband's death"
                    : "Date divorce was pronounced"}
                </label>
                <input
                  type="date"
                  className="id-date-input"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!isNaN(d)) setStartDate(d);
                  }}
                />
                <div className="id-date-hijri">{fmtHijri(startDate)}</div>
              </div>
            </div>

            {/* Scholarly note */}
            <div className="id-scholar-note">
              <div className="id-scholar-note__icon">📚</div>
              <div>
                <h4>Important Note</h4>
                <p>
                  These calculations are based on majority Fiqh opinion. For
                  pregnancy, Iddat ends upon delivery regardless of duration.
                  Always consult a qualified Islamic scholar for individual rulings.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Calendar + Results ── */}
          <div className="id-right">

            {/* Calendar */}
            <div className="id-panel id-panel--calendar">
              <h3 className="id-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="id-panel__icon">
                  <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 2v3M13 2v3M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Iddat Calendar
              </h3>

              <IddatCalendar
                selectedDate={startDate}
                onDateChange={setStartDate}
                rangeStart={startDate}
                rangeEnd={endDate}
              />
            </div>

            {/* Result card */}
            <div className={`id-result ${isComplete ? "id-result--complete" : notStarted ? "id-result--future" : "id-result--active"}`}>

              {/* Status badge */}
              <div className="id-result__status">
                {isComplete  && <span className="id-result__badge id-result__badge--done">✓ Iddat Completed</span>}
                {notStarted  && <span className="id-result__badge id-result__badge--future">⏳ Not Yet Started</span>}
                {!isComplete && !notStarted && <span className="id-result__badge id-result__badge--active">● Active Iddat</span>}
              </div>

              {/* Dates row */}
              <div className="id-result__dates">
                <div className="id-result__date-block">
                  <span className="id-result__date-label">Start</span>
                  <span className="id-result__date-val">{fmtDate(startDate)}</span>
                  <span className="id-result__date-hijri">{fmtHijri(startDate)}</span>
                </div>
                <div className="id-result__date-arrow">→</div>
                <div className="id-result__date-block id-result__date-block--end">
                  <span className="id-result__date-label">Ends</span>
                  <span className="id-result__date-val">{fmtDate(endDate)}</span>
                  <span className="id-result__date-hijri">{fmtHijri(endDate)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="id-result__progress-wrap">
                <div className="id-result__progress-track">
                  <div
                    className="id-result__progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="id-result__progress-labels">
                  <span>{pct}% elapsed</span>
                  <span>{totalDays} total days</span>
                </div>
              </div>

              {/* Big countdown */}
              {!isComplete && (
                <div className="id-result__countdown">
                  <div className="id-result__countdown-num">{daysLeft}</div>
                  <div className="id-result__countdown-label">days remaining</div>
                </div>
              )}

              {isComplete && (
                <div className="id-result__complete-msg">
                  <span>الحمد لله</span>
                  <p>The Iddat period has been completed.</p>
                </div>
              )}

              {/* Breakdown segments */}
              <div className="id-result__segments">
                {segments.map((s) => (
                  <div key={s.label} className="id-result__seg">
                    <span className="id-result__seg-val">{s.val}</span>
                    <span className="id-result__seg-label">{s.label}</span>
                  </div>
                ))}
                <div className="id-result__seg">
                  <span className="id-result__seg-val">{daysElapsed}</span>
                  <span className="id-result__seg-label">Days elapsed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ══ INFO STRIP ══ */}
      <section className="id-info-strip">
        <div className="id-info-strip__inner">
          {[
            { icon: "💍", title: "After Death", desc: "4 months and 10 days. If pregnant, until delivery. Based on Quran 2:234." },
            { icon: "📜", title: "After Divorce", desc: "3 complete menstrual cycles for women who menstruate. 3 lunar months for others." },
            { icon: "🤰", title: "If Pregnant", desc: "Iddat ends at delivery, regardless of duration. Applies to both death and divorce." },
            { icon: "🕌", title: "Purpose", desc: "To confirm absence of pregnancy, honour the marriage bond, and allow for reconciliation." },
          ].map((item) => (
            <div key={item.title} className="id-info-card">
              <span className="id-info-card__icon">{item.icon}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ QURAN BANNER ══ */}
      <div className="id-quran-banner">
        <span className="id-quran-banner__ar">
          وَالَّذِينَ يُتَوَفَّوْنَ مِنكُمْ وَيَذَرُونَ أَزْوَاجًا يَتَرَبَّصْنَ بِأَنفُسِهِنَّ أَرْبَعَةَ أَشْهُرٍ وَعَشْرًا
        </span>
        <span className="id-quran-banner__en">
          "Those who die and leave wives behind — they shall wait for four months and ten days." — Al-Baqarah 2:234
        </span>
      </div>

      <Footer />
    </>
  );
}