import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Fitrah.css";

/* ── Presets ── */
const PRESETS = [
  {
    id: "wheat",
    label: "Wheat",
    arabic: "القمح",
    icon: "🌾",
    amount: 80,
    desc: "Most common staple — widely accepted",
    color: "gold",
  },
  {
    id: "barley",
    label: "Barley",
    arabic: "الشعير",
    icon: "🌿",
    amount: 120,
    desc: "Traditional grain of the Prophet's era",
    color: "green",
  },
  {
    id: "dates",
    label: "Dates",
    arabic: "التمر",
    icon: "🫙",
    amount: 180,
    desc: "Beloved Sunnah food — higher value",
    color: "gold",
  },
  {
    id: "raisins",
    label: "Raisins",
    arabic: "الزبيب",
    icon: "🍇",
    amount: 220,
    desc: "Highest among classical benchmarks",
    color: "green",
  },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

/* ── Member row component ── */
function MemberRow({ member, onChange, onRemove, canRemove }) {
  return (
    <div className="ft-member-row">
      <div className="ft-member-row__avatar">{member.type === "child" ? "👶" : "🧑"}</div>
      <div className="ft-member-row__info">
        <input
          className="ft-member-row__name"
          value={member.name}
          placeholder={`Member name`}
          onChange={(e) => onChange({ ...member, name: e.target.value })}
        />
        <div className="ft-member-row__type-toggle">
          <button
            className={`ft-type-btn ${member.type === "adult" ? "active" : ""}`}
            onClick={() => onChange({ ...member, type: "adult" })}
          >Adult</button>
          <button
            className={`ft-type-btn ${member.type === "child" ? "active" : ""}`}
            onClick={() => onChange({ ...member, type: "child" })}
          >Child</button>
        </div>
      </div>
      {canRemove && (
        <button className="ft-member-row__remove" onClick={onRemove} aria-label="Remove">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

let nextId = 1;
const newMember = (type = "adult") => ({
  id: nextId++,
  name: "",
  type,
});

export default function Fitrah() {
  const [members, setMembers] = useState([newMember("adult")]);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].id);
  const [customAmount, setCustomAmount] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const preset = PRESETS.find((p) => p.id === selectedPreset);
  const ratePerPerson = customAmount !== "" ? Math.max(0, Number(customAmount)) : preset.amount;

  const adults = members.filter((m) => m.type === "adult").length;
  const children = members.filter((m) => m.type === "child").length;
  const totalMembers = members.length;
  const total = useMemo(() => totalMembers * ratePerPerson, [totalMembers, ratePerPerson]);

  const addMember = () => setMembers((prev) => [...prev, newMember("adult")]);
  const removeMember = (id) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const updateMember = (updated) =>
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="ft-hero">
        <div className="ft-hero__bg" aria-hidden="true">
          <div className="ft-hero__img" />
          <div className="ft-hero__overlay" />
          <div className="ft-hero__grid" />
        </div>

        <div className="ft-hero__body">
          <span className="ft-hero__eyebrow">
            <span className="ft-hero__eyebrow-dot" />
            Ramadan Charity
          </span>

          <h1 className="ft-hero__title">
            <span className="ft-hero__title-ar">صَدَقَةُ الفِطْر</span>
            Fitrah Calculator
          </h1>

          <p className="ft-hero__sub">
            Estimate your family's Sadaqat al-Fitr with clarity — so every
            soul under your care is covered before Eid prayer begins.
          </p>

          {/* Verse */}
          <div className="ft-hero__verse">
            <span className="ft-hero__verse-ar">
              قَدْ أَفْلَحَ مَن تَزَكَّىٰ
            </span>
            <span className="ft-hero__verse-ref">
              "He has succeeded who purifies himself" — Al-A'la 87:14
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="ft-hero__stats">
          {[
            { val: "1 Sa'", label: "Food per person" },
            { val: "~3 kg", label: "Approx weight" },
            { val: "Before", label: "Eid Salah" },
            { val: "Fardh", label: "Obligation level" },
          ].map((s) => (
            <div key={s.label} className="ft-hero__stat">
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <main className="ft-main">
        <div className="ft-layout">

          {/* ── LEFT COLUMN ── */}
          <div className="ft-left">

            {/* Benchmark selector */}
            <div className="ft-panel">
              <h3 className="ft-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="ft-panel__icon">
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 7v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Select Benchmark
              </h3>

              <div className="ft-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    className={`ft-preset ${selectedPreset === p.id ? `ft-preset--active ft-preset--${p.color}` : ""}`}
                    onClick={() => { setSelectedPreset(p.id); setCustomAmount(""); }}
                  >
                    <span className="ft-preset__icon">{p.icon}</span>
                    <span className="ft-preset__ar">{p.arabic}</span>
                    <span className="ft-preset__label">{p.label}</span>
                    <span className="ft-preset__amount">{fmt(p.amount)}</span>
                    <span className="ft-preset__desc">{p.desc}</span>
                  </button>
                ))}
              </div>

              {/* Custom override */}
              <div className="ft-custom">
                <label className="ft-custom__label">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Custom rate (from your local masjid)
                </label>
                <div className="ft-custom__row">
                  <span className="ft-custom__prefix">₹</span>
                  <input
                    type="number"
                    min="0"
                    className="ft-custom__input"
                    placeholder={`${preset.amount} (current preset)`}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                  {customAmount !== "" && (
                    <button className="ft-custom__clear" onClick={() => setCustomAmount("")}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="ft-info-grid">
              <div className="ft-info-card ft-info-card--gold">
                <div className="ft-info-card__icon">📖</div>
                <h4>What is Fitrah?</h4>
                <p>
                  A mandatory charity on behalf of every Muslim — including
                  infants — to purify fasting and bring joy to the poor on Eid.
                </p>
              </div>
              <div className="ft-info-card ft-info-card--green">
                <div className="ft-info-card__icon">🕌</div>
                <h4>When to Pay?</h4>
                <p>
                  Ideally in the last days of Ramadan, ensuring it reaches
                  beneficiaries before the Eid congregation begins.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="ft-right">

            {/* Family members */}
            <div className="ft-panel">
              <div className="ft-panel__head">
                <h3 className="ft-panel__title">
                  <svg viewBox="0 0 20 20" fill="none" className="ft-panel__icon">
                    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 18c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M11 18c0-2.5 1.3-4.5 3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Family Members
                </h3>
                <div className="ft-panel__badge">{totalMembers} person{totalMembers !== 1 ? "s" : ""}</div>
              </div>

              <div className="ft-members-list">
                {members.map((m) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    onChange={updateMember}
                    onRemove={() => removeMember(m.id)}
                    canRemove={members.length > 1}
                  />
                ))}
              </div>

              <button className="ft-add-btn" onClick={addMember}>
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Family Member
              </button>
            </div>

            {/* Result card */}
            <div className="ft-result">
              <div className="ft-result__header">
                <span className="ft-result__crescent">☽</span>
                <h3 className="ft-result__title">Total Fitrah Due</h3>
              </div>

              <div className="ft-result__amount">{fmt(total)}</div>

              <div className="ft-result__meta">
                <span>{totalMembers} person{totalMembers !== 1 ? "s" : ""}</span>
                <span className="ft-result__meta-sep">×</span>
                <span>{fmt(ratePerPerson)} per person</span>
                {customAmount !== "" && (
                  <span className="ft-result__meta-custom">(custom rate)</span>
                )}
              </div>

              {/* Toggle breakdown */}
              <button
                className="ft-result__breakdown-toggle"
                onClick={() => setShowBreakdown((v) => !v)}
              >
                {showBreakdown ? "Hide" : "Show"} breakdown
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ transform: showBreakdown ? "rotate(180deg)" : "none", transition: "transform .3s" }}
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showBreakdown && (
                <div className="ft-result__breakdown">
                  <div className="ft-result__breakdown-row">
                    <span>Adults ({adults})</span>
                    <strong>{fmt(adults * ratePerPerson)}</strong>
                  </div>
                  <div className="ft-result__breakdown-row">
                    <span>Children ({children})</span>
                    <strong>{fmt(children * ratePerPerson)}</strong>
                  </div>
                  <div className="ft-result__breakdown-div" />
                  <div className="ft-result__breakdown-row ft-result__breakdown-row--total">
                    <span>Total</span>
                    <strong>{fmt(total)}</strong>
                  </div>
                </div>
              )}

              <p className="ft-result__note">
                Confirm the per-person rate with your local masjid committee before payment.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* ══ QURAN BANNER ══ */}
      <div className="ft-quran-banner">
        <span className="ft-quran-banner__ar">
          وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ
        </span>
        <span className="ft-quran-banner__en">
          "Give Zakat and bow with those who bow." — Al-Baqarah 2:43
        </span>
      </div>

      <Footer />
    </>
  );
}