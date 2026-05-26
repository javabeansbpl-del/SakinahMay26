import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Inheritence.css";

/* ══════════════════════════════════════════════════
   FARAID ENGINE — Islamic Inheritance Calculator
   Based on classical Hanafi / majority opinion rules
   ══════════════════════════════════════════════════ */

const HEIR_CONFIG = [
  // Spouse
  { id: "husband",        label: "Husband",           arabic: "الزوج",        group: "spouse",    gender: "male"   },
  { id: "wife",           label: "Wife / Wives",      arabic: "الزوجة",       group: "spouse",    gender: "female" },
  // Children
  { id: "son",            label: "Son(s)",             arabic: "الابن",        group: "children",  gender: "male"   },
  { id: "daughter",       label: "Daughter(s)",        arabic: "البنت",        group: "children",  gender: "female" },
  // Parents
  { id: "father",         label: "Father",             arabic: "الأب",         group: "parents",   gender: "male"   },
  { id: "mother",         label: "Mother",             arabic: "الأم",         group: "parents",   gender: "female" },
  // Grandparents
  { id: "pGrandfather",   label: "Paternal Grandfather", arabic: "الجد",      group: "grandparents", gender: "male" },
  { id: "pGrandmother",   label: "Paternal Grandmother", arabic: "الجدة",     group: "grandparents", gender: "female" },
  { id: "mGrandmother",   label: "Maternal Grandmother", arabic: "الجدة لأم", group: "grandparents", gender: "female" },
  // Siblings
  { id: "fullBrother",    label: "Full Brother(s)",    arabic: "الأخ الشقيق", group: "siblings",  gender: "male"   },
  { id: "fullSister",     label: "Full Sister(s)",     arabic: "الأخت الشقيقة", group: "siblings", gender: "female" },
  { id: "pBrother",       label: "Paternal Brother(s)", arabic: "الأخ لأب",  group: "siblings",  gender: "male"   },
  { id: "pSister",        label: "Paternal Sister(s)", arabic: "الأخت لأب",  group: "siblings",  gender: "female" },
  { id: "mBrother",       label: "Maternal Brother(s)", arabic: "الأخ لأم",  group: "siblings",  gender: "male"   },
  { id: "mSister",        label: "Maternal Sister(s)", arabic: "الأخت لأم",  group: "siblings",  gender: "female" },
];

const GROUP_LABELS = {
  spouse: "Spouse",
  children: "Children",
  parents: "Parents",
  grandparents: "Grandparents",
  siblings: "Siblings",
};

const GROUP_ICONS = {
  spouse: "💍",
  children: "👶",
  parents: "👨‍👩‍👦",
  grandparents: "👴",
  siblings: "🤝",
};

/* ── GCD helper for fraction reduction ── */
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }

function fmtFraction(num, den) {
  if (num === 0) return "0";
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

/* ══════════════════════════════════════════════════
   CORE FARAID CALCULATOR
   Returns array of { id, share (0-1), notes, blocked }
   ══════════════════════════════════════════════════ */
function calculateFaraid(counts, gender) {
  // gender = "male" | "female" (deceased)
  const h = counts; // shorthand
  const results = {};
  const notes = {};

  const hasChild    = h.son > 0 || h.daughter > 0;
  const hasSon      = h.son > 0;
  const hasChildOrPGrandchild = hasChild; // simplified
  const hasFather   = h.father > 0;
  const hasMale     = hasSon; // for sibling blocking

  // Helper to set
  const set = (id, share, note = "") => {
    results[id] = share;
    notes[id] = note;
  };

  /* ── SPOUSE ── */
  if (h.husband > 0) {
    if (hasChild) set("husband", 1 / 4, "¼ — with children");
    else          set("husband", 1 / 2, "½ — no children");
  }

  if (h.wife > 0) {
    const wifeCount = Math.min(h.wife, 4);
    const total = hasChild ? 1 / 8 : 1 / 4;
    set("wife", total, `${hasChild ? "⅛" : "¼"} shared among ${wifeCount} wife${wifeCount > 1 ? "s" : ""}`);
  }

  /* ── MOTHER ── */
  if (h.mother > 0) {
    const hasSiblings = (h.fullBrother + h.fullSister + h.pBrother + h.pSister + h.mBrother + h.mSister) >= 2;
    if (hasChild)         set("mother", 1 / 6, "⅙ — with children");
    else if (hasSiblings) set("mother", 1 / 6, "⅙ — with 2+ siblings");
    else                  set("mother", 1 / 3, "⅓ — no children/siblings");
  }

  /* ── FATHER ── */
  if (h.father > 0) {
    if (hasChild)  set("father", 1 / 6, "⅙ fixed + residue (Asabah)");
    else           set("father", 0, "Asabah — residue after others");
    // father as Asabah is computed at residue stage
  }

  /* ── PATERNAL GRANDFATHER (blocked by father) ── */
  if (h.pGrandfather > 0) {
    if (h.father > 0) {
      set("pGrandfather", 0, "Blocked by father");
    } else if (hasChild) {
      set("pGrandfather", 1 / 6, "⅙ — like father with children");
    } else {
      set("pGrandfather", 0, "Asabah — residue after others");
    }
  }

  /* ── GRANDMOTHERS ── */
  if (h.pGrandmother > 0) {
    if (h.mother > 0 || h.father > 0) set("pGrandmother", 0, "Blocked by mother/father");
    else                               set("pGrandmother", 1 / 6, "⅙ shared");
  }
  if (h.mGrandmother > 0) {
    if (h.mother > 0) set("mGrandmother", 0, "Blocked by mother");
    else              set("mGrandmother", 1 / 6, "⅙ shared");
  }

  /* ── DAUGHTERS ── */
  if (h.daughter > 0 && h.son === 0) {
    if (h.daughter === 1) set("daughter", 1 / 2, "½ — sole daughter");
    else                  set("daughter", 2 / 3, "⅔ shared among daughters");
  }

  /* ── MATERNAL SIBLINGS (blocked by child, father, grandfather) ── */
  const mSibCount = h.mBrother + h.mSister;
  if (mSibCount > 0) {
    const blockedBy = hasChild ? "children" : hasFather ? "father" : h.pGrandfather > 0 && !hasFather ? "grandfather" : null;
    if (blockedBy) {
      set("mBrother", 0, `Blocked by ${blockedBy}`);
      set("mSister",  0, `Blocked by ${blockedBy}`);
    } else {
      const mShare = mSibCount === 1 ? 1 / 6 : 1 / 3;
      if (h.mBrother > 0) set("mBrother", mShare, `${mSibCount === 1 ? "⅙" : "⅓"} shared`);
      if (h.mSister  > 0) set("mSister",  mShare, `${mSibCount === 1 ? "⅙" : "⅓"} shared`);
    }
  }

  /* ── FULL SISTERS (as Fard, when no son/father/full-brother) ── */
  if (h.fullSister > 0 && h.son === 0 && h.father === 0 && h.fullBrother === 0) {
    if (!hasChild) {
      if (h.fullSister === 1) set("fullSister", 1 / 2, "½ — sole full sister (Fard)");
      else                    set("fullSister", 2 / 3, "⅔ shared (Fard)");
    }
  }

  /* ── PATERNAL SISTERS (blocked by full brother, son, father) ── */
  if (h.pSister > 0 && h.son === 0 && h.father === 0 && h.fullBrother === 0 && h.pBrother === 0) {
    if (!hasChild && h.fullSister === 0) {
      if (h.pSister === 1) set("pSister", 1 / 2, "½ — sole paternal sister (Fard)");
      else                 set("pSister", 2 / 3, "⅔ shared (Fard)");
    }
  }

  /* ── COMPUTE RESIDUE (Asabah) ── */
  const fixedTotal = Object.values(results).reduce((s, v) => s + v, 0);
  const residue = Math.max(0, 1 - fixedTotal);

  // Asabah priority: Son > Father > pGrandfather > fullBrother > pBrother
  let asabahRecipient = null;
  if (hasSon || (h.son > 0 && h.daughter > 0)) {
    asabahRecipient = "son_daughter";
  } else if (h.father > 0 && !hasChild) {
    asabahRecipient = "father";
  } else if (h.pGrandfather > 0 && !hasFather && !hasChild) {
    asabahRecipient = "pGrandfather";
  } else if (h.fullBrother > 0 && !hasChild && !hasFather) {
    asabahRecipient = "fullBrother";
  } else if (h.pBrother > 0 && !hasChild && !hasFather && h.fullBrother === 0) {
    asabahRecipient = "pBrother";
  } else if (h.fullSister > 0 && !hasChild && !hasFather && h.fullBrother === 0) {
    asabahRecipient = "fullSister_asabah";
  }

  if (asabahRecipient === "son_daughter") {
    // Sons get 2x daughters
    const units = h.son * 2 + h.daughter;
    if (h.son > 0)    set("son",      (residue * h.son * 2) / units,     "Asabah — 2 shares per son");
    if (h.daughter > 0) set("daughter", (residue * h.daughter) / units,  "Asabah — 1 share per daughter");
  } else if (asabahRecipient === "father") {
    if (hasChild) {
      results["father"] = (results["father"] || 0) + residue;
      notes["father"]   = "⅙ fixed + Asabah residue";
    } else {
      set("father", residue, "Asabah — full residue");
    }
  } else if (asabahRecipient === "pGrandfather") {
    if (hasChild) {
      results["pGrandfather"] = (results["pGrandfather"] || 0) + residue;
    } else {
      set("pGrandfather", residue, "Asabah — full residue");
    }
  } else if (asabahRecipient === "fullBrother") {
    const units = h.fullBrother * 2 + h.fullSister;
    if (h.fullBrother > 0) set("fullBrother", (residue * h.fullBrother * 2) / units, "Asabah");
    if (h.fullSister  > 0) set("fullSister",  (residue * h.fullSister)  / units,     "Asabah with brother");
  } else if (asabahRecipient === "pBrother") {
    const units = h.pBrother * 2 + h.pSister;
    if (h.pBrother > 0) set("pBrother", (residue * h.pBrother * 2) / units, "Asabah");
    if (h.pSister  > 0) set("pSister",  (residue * h.pSister)  / units,     "Asabah with paternal brother");
  } else if (asabahRecipient === "fullSister_asabah") {
    set("fullSister", (results["fullSister"] || 0) + residue, "Asabah with daughters");
  }

  return { results, notes };
}

/* ── Format currency ── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ── Pie chart segment paths ── */
function buildPieSegments(shares) {
  const total = shares.reduce((s, x) => s + x.value, 0);
  if (total === 0) return [];
  const COLORS = ["#e6bb51","#72c6a6","#db9e30","#329c5b","#f3e4bb","#8fd4b8","#b87d19","#1a7a4a","#edd187","#4db8ff","#ff9966","#c084fc"];
  let angle = -Math.PI / 2;
  return shares.map((s, i) => {
    const frac = s.value / total;
    const startAngle = angle;
    angle += frac * 2 * Math.PI;
    const endAngle = angle;
    const cx = 100, cy = 100, r = 85;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = frac > 0.5 ? 1 : 0;
    const midAngle = startAngle + (frac * Math.PI);
    const lx = cx + (r * 0.6) * Math.cos(midAngle);
    const ly = cy + (r * 0.6) * Math.sin(midAngle);
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: COLORS[i % COLORS.length], label: s.label, frac, lx, ly };
  });
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function Inheritence() {
  const [estate, setEstate] = useState("");
  const [deceasedGender, setDeceasedGender] = useState("male");
  const [counts, setCounts] = useState(
    Object.fromEntries(HEIR_CONFIG.map((h) => [h.id, 0]))
  );
  const [calculated, setCalculated] = useState(false);
  const [activeGroup, setActiveGroup] = useState("spouse");

  const estateVal = Math.max(0, Number(estate) || 0);

  const { results, notes } = useMemo(
    () => calculateFaraid(counts, deceasedGender),
    [counts, deceasedGender]
  );

  const activeHeirs = useMemo(
    () =>
      Object.entries(results)
        .filter(([, v]) => v > 0)
        .map(([id, share]) => {
          const cfg = HEIR_CONFIG.find((h) => h.id === id);
          return { id, share, label: cfg?.label || id, note: notes[id] || "" };
        }),
    [results, notes]
  );

  const blockedHeirs = useMemo(
    () =>
      Object.entries(notes)
        .filter(([, n]) => n.toLowerCase().includes("blocked"))
        .map(([id]) => HEIR_CONFIG.find((h) => h.id === id)?.label || id),
    [notes]
  );

  const pieData = useMemo(
    () => activeHeirs.map((h) => ({ label: h.label, value: h.share })),
    [activeHeirs]
  );
  const segments = buildPieSegments(pieData);

  const groups = [...new Set(HEIR_CONFIG.map((h) => h.group))];

  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="inh-hero">
        <div className="inh-hero__bg" aria-hidden="true">
          <div className="inh-hero__overlay" />
          <div className="inh-hero__pattern" />
          <div className="inh-hero__ring inh-hero__ring--a" />
          <div className="inh-hero__ring inh-hero__ring--b" />
        </div>

        <div className="inh-hero__body">
          <span className="inh-hero__eyebrow">
            <span className="inh-hero__eyebrow-dot" />
            Islamic Inheritance Law
          </span>

          <h1 className="inh-hero__title">
            <span className="inh-hero__title-ar">عِلْمُ الفَرَائِض</span>
            Inheritance Calculator
          </h1>

          <p className="inh-hero__sub">
            Distribute the estate according to Shariah — precise Fard shares
            and Asabah residues calculated from classical Faraid rules.
          </p>

          <div className="inh-hero__verse">
            <span className="inh-hero__verse-ar">
              لِلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ
            </span>
            <span className="inh-hero__verse-ref">
              "For men is a share of what parents and close relatives leave" — An-Nisa 4:7
            </span>
          </div>
        </div>

        <div className="inh-hero__stats">
          {[
            { val: "Fard",   label: "Fixed Shares" },
            { val: "Asabah", label: "Residuary" },
            { val: "Hajb",   label: "Blocking Rules" },
            { val: "Awl",    label: "Proportional Red." },
          ].map((s) => (
            <div key={s.label} className="inh-hero__stat">
              <strong>{s.val}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MAIN ══ */}
      <main className="inh-main">
        <div className="inh-layout">

          {/* ── LEFT: Inputs ── */}
          <div className="inh-left">

            {/* Estate & deceased */}
            <div className="inh-panel">
              <h3 className="inh-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="inh-panel__icon">
                  <rect x="3" y="5" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Estate Details
              </h3>

              <div className="inh-estate-row">
                <div className="inh-field">
                  <label className="inh-label">Total Estate Value</label>
                  <div className="inh-input-wrap">
                    <span className="inh-input-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      className="inh-input"
                      placeholder="e.g. 1,000,000"
                      value={estate}
                      onChange={(e) => setEstate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="inh-field">
                  <label className="inh-label">Deceased was a</label>
                  <div className="inh-gender-toggle">
                    <button
                      className={`inh-gender-btn ${deceasedGender === "male" ? "active" : ""}`}
                      onClick={() => setDeceasedGender("male")}
                    >♂ Male</button>
                    <button
                      className={`inh-gender-btn ${deceasedGender === "female" ? "active" : ""}`}
                      onClick={() => setDeceasedGender("female")}
                    >♀ Female</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Heirs — grouped tabs */}
            <div className="inh-panel">
              <h3 className="inh-panel__title">
                <svg viewBox="0 0 20 20" fill="none" className="inh-panel__icon">
                  <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 17c0-3 2-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 17c0-2 1-4 2-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Surviving Heirs
              </h3>

              {/* Group tabs */}
              <div className="inh-group-tabs">
                {groups.map((g) => (
                  <button
                    key={g}
                    className={`inh-group-tab ${activeGroup === g ? "active" : ""}`}
                    onClick={() => setActiveGroup(g)}
                  >
                    <span>{GROUP_ICONS[g]}</span>
                    <span>{GROUP_LABELS[g]}</span>
                  </button>
                ))}
              </div>

              {/* Heir rows for active group */}
              <div className="inh-heirs-list">
                {HEIR_CONFIG.filter((h) => h.group === activeGroup).map((heir) => (
                  <div key={heir.id} className={`inh-heir-row ${counts[heir.id] > 0 ? "inh-heir-row--active" : ""}`}>
                    <div className="inh-heir-row__info">
                      <span className="inh-heir-row__gender">{heir.gender === "male" ? "♂" : "♀"}</span>
                      <div>
                        <span className="inh-heir-row__label">{heir.label}</span>
                        <span className="inh-heir-row__ar">{heir.arabic}</span>
                      </div>
                    </div>
                    <div className="inh-heir-row__counter">
                      <button
                        className="inh-counter-btn"
                        onClick={() => setCounts((p) => ({ ...p, [heir.id]: Math.max(0, p[heir.id] - 1) }))}
                        disabled={counts[heir.id] === 0}
                      >−</button>
                      <span className="inh-counter-val">{counts[heir.id]}</span>
                      <button
                        className="inh-counter-btn"
                        onClick={() => setCounts((p) => ({ ...p, [heir.id]: p[heir.id] + 1 }))}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="inh-calc-btn" onClick={() => setCalculated(true)}>
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Calculate Distribution
            </button>

            {/* Quick heir summary */}
            {Object.values(counts).some((v) => v > 0) && (
              <div className="inh-heir-summary">
                {HEIR_CONFIG.filter((h) => counts[h.id] > 0).map((h) => (
                  <span key={h.id} className="inh-heir-chip">
                    {h.label} × {counts[h.id]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Results ── */}
          <div className="inh-right">

            {!calculated ? (
              <div className="inh-placeholder">
                <div className="inh-placeholder__icon">⚖️</div>
                <h3>Enter heirs to calculate</h3>
                <p>Add the surviving heirs on the left, enter the estate value, then click Calculate Distribution.</p>
              </div>
            ) : activeHeirs.length === 0 ? (
              <div className="inh-placeholder inh-placeholder--warn">
                <div className="inh-placeholder__icon">⚠️</div>
                <h3>No eligible heirs found</h3>
                <p>Please add at least one surviving heir from the categories on the left.</p>
              </div>
            ) : (
              <>
                {/* Pie chart */}
                <div className="inh-panel inh-pie-panel">
                  <h3 className="inh-panel__title">
                    <svg viewBox="0 0 20 20" fill="none" className="inh-panel__icon">
                      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 10L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 10L15.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Share Distribution
                  </h3>

                  <div className="inh-pie-wrap">
                    <svg viewBox="0 0 200 200" className="inh-pie-svg">
                      {segments.map((seg, i) => (
                        <path key={i} d={seg.path} fill={seg.color} opacity="0.9" className="inh-pie-seg">
                          <title>{seg.label}: {(seg.frac * 100).toFixed(1)}%</title>
                        </path>
                      ))}
                      <circle cx="100" cy="100" r="45" fill="var(--bg-primary)" />
                      <text x="100" y="96" textAnchor="middle" fill="var(--text-gold)" fontSize="10" fontFamily="Cairo,sans-serif" fontWeight="700">ESTATE</text>
                      <text x="100" y="110" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontFamily="Cairo,sans-serif">{activeHeirs.length} heirs</text>
                    </svg>

                    <div className="inh-pie-legend">
                      {segments.map((seg, i) => (
                        <div key={i} className="inh-legend-item">
                          <span className="inh-legend-dot" style={{ background: seg.color }} />
                          <span className="inh-legend-label">{seg.label}</span>
                          <span className="inh-legend-pct">{(seg.frac * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Distribution table */}
                <div className="inh-panel">
                  <h3 className="inh-panel__title">
                    <svg viewBox="0 0 20 20" fill="none" className="inh-panel__icon">
                      <path d="M4 6h12M4 10h12M4 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Detailed Distribution
                  </h3>

                  <div className="inh-table">
                    <div className="inh-table__head">
                      <span>Heir</span>
                      <span>Share</span>
                      <span>Basis</span>
                      {estateVal > 0 && <span>Amount</span>}
                    </div>

                    {activeHeirs.map((heir, i) => (
                      <div
                        key={heir.id}
                        className="inh-table__row"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        <div className="inh-table__heir">
                          <span className="inh-table__dot" style={{ background: segments[i]?.color }} />
                          <div>
                            <span className="inh-table__name">{heir.label}</span>
                            {counts[heir.id] > 1 && (
                              <span className="inh-table__count">× {counts[heir.id]}</span>
                            )}
                          </div>
                        </div>

                        <span className="inh-table__share">
                          {(heir.share * 100).toFixed(2)}%
                        </span>

                        <span className="inh-table__note">{heir.note}</span>

                        {estateVal > 0 && (
                          <span className="inh-table__amount">
                            {fmt(heir.share * estateVal)}
                          </span>
                        )}

                        {/* Per-person if multiple */}
                        {estateVal > 0 && counts[heir.id] > 1 && (
                          <div className="inh-table__perperson">
                            {fmt((heir.share * estateVal) / counts[heir.id])} each
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocked heirs */}
                {blockedHeirs.length > 0 && (
                  <div className="inh-blocked-panel">
                    <h4 className="inh-blocked-panel__title">
                      🚫 Blocked Heirs (Hajb)
                    </h4>
                    <p className="inh-blocked-panel__desc">
                      The following heirs receive no share due to the presence of closer relatives:
                    </p>
                    <div className="inh-blocked-list">
                      {blockedHeirs.map((b) => (
                        <span key={b} className="inh-blocked-chip">{b}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estate summary if amount entered */}
                {estateVal > 0 && (
                  <div className="inh-estate-summary">
                    <div className="inh-estate-summary__row">
                      <span>Total Estate</span>
                      <strong>{fmt(estateVal)}</strong>
                    </div>
                    <div className="inh-estate-summary__row">
                      <span>Distributed</span>
                      <strong className="inh-estate-summary__distributed">
                        {fmt(activeHeirs.reduce((s, h) => s + h.share * estateVal, 0))}
                      </strong>
                    </div>
                    <div className="inh-estate-summary__note">
                      * Deduct funeral expenses, debts, and bequests (up to ⅓) before distribution.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ══ LEARN STRIP ══ */}
      <section className="inh-learn">
        <div className="inh-learn__inner">
          {[
            { icon: "📜", title: "Fard (Fixed Shares)", desc: "Six fixed fractions mentioned in the Quran: ½, ¼, ⅛, ⅔, ⅓, ⅙ — allocated to specific heirs." },
            { icon: "⚖️", title: "Asabah (Residuary)", desc: "After fixed shares are distributed, the remainder goes to the nearest male agnate — usually son or father." },
            { icon: "🚫", title: "Hajb (Blocking)", desc: "A closer heir can partially or fully block a more distant one. E.g., son blocks brothers entirely." },
            { icon: "📉", title: "Awl (Proportional Reduction)", desc: "When fixed shares exceed the estate, all shares are proportionally reduced. This calculator handles it automatically." },
          ].map((item) => (
            <div key={item.title} className="inh-learn__card">
              <span className="inh-learn__card-icon">{item.icon}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ QURAN BANNER ══ */}
      <div className="inh-quran-banner">
        <span className="inh-quran-banner__ar">
          يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ
        </span>
        <span className="inh-quran-banner__en">
          "Allah instructs you regarding your children: for the male, what is equal to the share of two females." — An-Nisa 4:11
        </span>
      </div>

      <Footer />
    </>
  );
}