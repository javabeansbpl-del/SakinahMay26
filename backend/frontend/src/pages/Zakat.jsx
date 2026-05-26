import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/zakat.css";

/* ─── Nisab thresholds (approximate, update as needed) ─── */
const NISAB_GOLD_GRAMS   = 85;   // 85g of gold
const NISAB_SILVER_GRAMS = 595;  // 595g of silver
const GOLD_PRICE_PER_GRAM   = 6200; // ₹ per gram (approx)
const SILVER_PRICE_PER_GRAM = 78;   // ₹ per gram (approx)
const NISAB_GOLD   = NISAB_GOLD_GRAMS   * GOLD_PRICE_PER_GRAM;
const NISAB_SILVER = NISAB_SILVER_GRAMS * SILVER_PRICE_PER_GRAM;

const ZAKAT_RATE = 0.025;

/* ─── Wealth category config ─── */
const CATEGORIES = [
  {
    id: "cash",
    label: "Cash & Bank Savings",
    arabic: "النقود والمدخرات",
    icon: "💰",
    hint: "Cash on hand, savings accounts, fixed deposits",
    color: "gold",
  },
  {
    id: "gold",
    label: "Gold & Silver",
    arabic: "الذهب والفضة",
    icon: "🪙",
    hint: "Jewellery, coins, bullion held as investment",
    color: "gold",
  },
  {
    id: "business",
    label: "Business Assets",
    arabic: "أصول الأعمال",
    icon: "🏪",
    hint: "Stock-in-trade, receivables, liquid business funds",
    color: "green",
  },
  {
    id: "investments",
    label: "Investments",
    arabic: "الاستثمارات",
    icon: "📈",
    hint: "Shares, mutual funds, rental income receivable",
    color: "green",
  },
  {
    id: "livestock",
    label: "Agricultural / Other",
    arabic: "الزراعة وغيرها",
    icon: "🌾",
    hint: "Agricultural produce, other zakatable assets",
    color: "gold",
  },
];

/* ─── Utility ─── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) cancelAnimationFrame(ref.current);
    const start = display;
    const end = value;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplay(start + (end - start) * ease);
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]); // eslint-disable-line

  return <span>{fmt(display)}</span>;
}

/* ─── Main Component ─── */
export default function Zakat() {
  const [assets, setAssets] = useState({
    cash: "",
    gold: "",
    business: "",
    investments: "",
    livestock: "",
  });
  const [liabilities, setLiabilities] = useState("");
  const [nisabType, setNisabType] = useState("gold"); // "gold" | "silver"
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator"); // "calculator" | "learn"
  const resultRef = useRef(null);

  const totalAssets = Object.values(assets).reduce(
    (s, v) => s + (Number(v) || 0),
    0
  );
  const totalLiabilities = Number(liabilities) || 0;
  const netWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisab = nisabType === "gold" ? NISAB_GOLD : NISAB_SILVER;
  const aboveNisab = netWealth >= nisab;
  const zakatDue = aboveNisab ? netWealth * ZAKAT_RATE : 0;

  const handleCalculate = () => {
    setResult({ netWealth, zakatDue, aboveNisab, nisab });
    setCalculated(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setAssets({ cash: "", gold: "", business: "", investments: "", livestock: "" });
    setLiabilities("");
    setResult(null);
    setCalculated(false);
  };

  /* Progress bar per category */
  const maxAsset = Math.max(...Object.values(assets).map((v) => Number(v) || 0), 1);

  const learnItems = [
    {
      q: "What is Zakat?",
      a: "Zakat is one of the Five Pillars of Islam — an obligatory annual charity of 2.5% on qualifying wealth held for a full lunar year (Hawl).",
    },
    {
      q: "What is Nisab?",
      a: "Nisab is the minimum threshold of wealth above which Zakat becomes obligatory. It equals the value of 85g of gold or 595g of silver.",
    },
    {
      q: "Who must pay Zakat?",
      a: "Every adult Muslim who owns wealth above the Nisab threshold for a full lunar year must pay Zakat.",
    },
    {
      q: "Which assets are Zakatable?",
      a: "Cash, savings, gold & silver held as investment, business stock-in-trade, receivables, and shares/investments in liquid form.",
    },
    {
      q: "When should Zakat be paid?",
      a: "Once a lunar year (Hawl) has passed on your net wealth exceeding Nisab. Many Muslims pay during Ramadan for extra reward.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="zk-hero">
        <div className="zk-hero__bg" aria-hidden="true">
          <div className="zk-hero__ring zk-hero__ring--a" />
          <div className="zk-hero__ring zk-hero__ring--b" />
          <div className="zk-hero__starfield" />
        </div>

        <div className="zk-hero__body">
          <div className="zk-hero__badge">
            <span className="zk-hero__badge-dot" />
            Pillar of Islam
          </div>

          <h1 className="zk-hero__title">
            <span className="zk-hero__title-ar">حاسبة الزكاة</span>
            Zakat Calculator
          </h1>

          <p className="zk-hero__sub">
            Fulfil your sacred obligation with clarity and confidence. Calculate
            your annual Zakat accurately — rooted in authentic Islamic principles.
          </p>

          <div className="zk-hero__verse">
            <span className="zk-hero__verse-ar">
              وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ
            </span>
            <span className="zk-hero__verse-ref">
              "Establish prayer and give Zakat" — Al-Baqarah 2:43
            </span>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="zk-hero__stats">
          <div className="zk-hero__stat">
            <strong>2.5%</strong><span>Zakat Rate</span>
          </div>
          <div className="zk-hero__stat-div" />
          <div className="zk-hero__stat">
            <strong>85g</strong><span>Gold Nisab</span>
          </div>
          <div className="zk-hero__stat-div" />
          <div className="zk-hero__stat">
            <strong>595g</strong><span>Silver Nisab</span>
          </div>
          <div className="zk-hero__stat-div" />
          <div className="zk-hero__stat">
            <strong>1 Hawl</strong><span>Lunar Year</span>
          </div>
        </div>
      </section>

      {/* ══ TAB NAV ══ */}
      <div className="zk-tabs">
        <button
          className={`zk-tab ${activeTab === "calculator" ? "zk-tab--active" : ""}`}
          onClick={() => setActiveTab("calculator")}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Calculator
        </button>
        <button
          className={`zk-tab ${activeTab === "learn" ? "zk-tab--active" : ""}`}
          onClick={() => setActiveTab("learn")}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Learn About Zakat
        </button>
      </div>

      {/* ══ CALCULATOR TAB ══ */}
      {activeTab === "calculator" && (
        <section className="zk-calc-section">
          <div className="zk-calc-layout">

            {/* ── LEFT: inputs ── */}
            <div className="zk-calc-left">

              {/* Nisab selector */}
              <div className="zk-nisab-selector">
                <p className="zk-nisab-label">Calculate Nisab Based On</p>
                <div className="zk-nisab-options">
                  <button
                    className={`zk-nisab-btn ${nisabType === "gold" ? "active" : ""}`}
                    onClick={() => setNisabType("gold")}
                  >
                    <span className="zk-nisab-icon">🥇</span>
                    <span>Gold</span>
                    <span className="zk-nisab-val">{fmt(NISAB_GOLD)}</span>
                  </button>
                  <button
                    className={`zk-nisab-btn ${nisabType === "silver" ? "active" : ""}`}
                    onClick={() => setNisabType("silver")}
                  >
                    <span className="zk-nisab-icon">🥈</span>
                    <span>Silver</span>
                    <span className="zk-nisab-val">{fmt(NISAB_SILVER)}</span>
                  </button>
                </div>
              </div>

              {/* Asset categories */}
              <div className="zk-assets-section">
                <h3 className="zk-section-title">
                  <span>Assets</span>
                  <span className="zk-section-total">{fmt(totalAssets)}</span>
                </h3>

                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className={`zk-asset-row zk-asset-row--${cat.color}`}>
                    <div className="zk-asset-row__top">
                      <div className="zk-asset-row__info">
                        <span className="zk-asset-row__icon">{cat.icon}</span>
                        <div>
                          <span className="zk-asset-row__label">{cat.label}</span>
                          <span className="zk-asset-row__ar">{cat.arabic}</span>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        className="zk-input"
                        placeholder="₹ 0"
                        value={assets[cat.id]}
                        onChange={(e) =>
                          setAssets((prev) => ({ ...prev, [cat.id]: e.target.value }))
                        }
                      />
                    </div>
                    <p className="zk-asset-row__hint">{cat.hint}</p>
                    {/* mini bar */}
                    <div className="zk-asset-row__bar-track">
                      <div
                        className="zk-asset-row__bar-fill"
                        style={{ width: `${((Number(assets[cat.id]) || 0) / maxAsset) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Liabilities */}
              <div className="zk-liabilities-section">
                <h3 className="zk-section-title">
                  <span>Liabilities to Deduct</span>
                  <span className="zk-section-total zk-section-total--red">{fmt(totalLiabilities)}</span>
                </h3>
                <div className="zk-asset-row zk-asset-row--neutral">
                  <div className="zk-asset-row__top">
                    <div className="zk-asset-row__info">
                      <span className="zk-asset-row__icon">📋</span>
                      <div>
                        <span className="zk-asset-row__label">Total Liabilities</span>
                        <span className="zk-asset-row__ar">الالتزامات</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      className="zk-input"
                      placeholder="₹ 0"
                      value={liabilities}
                      onChange={(e) => setLiabilities(e.target.value)}
                    />
                  </div>
                  <p className="zk-asset-row__hint">
                    Debts due within the year — loans, rent arrears, bills
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="zk-actions">
                <button className="zk-btn-calc" onClick={handleCalculate}>
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Calculate Zakat
                </button>
                {calculated && (
                  <button className="zk-btn-reset" onClick={handleReset}>
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* ── RIGHT: summary + result ── */}
            <div className="zk-calc-right">

              {/* Live summary card */}
              <div className="zk-summary-card">
                <h4 className="zk-summary-card__title">Live Summary</h4>

                <div className="zk-summary-rows">
                  <div className="zk-summary-row">
                    <span>Total Assets</span>
                    <span className="zk-summary-val zk-summary-val--gold">{fmt(totalAssets)}</span>
                  </div>
                  <div className="zk-summary-row">
                    <span>Liabilities</span>
                    <span className="zk-summary-val zk-summary-val--red">− {fmt(totalLiabilities)}</span>
                  </div>
                  <div className="zk-summary-divider" />
                  <div className="zk-summary-row zk-summary-row--net">
                    <span>Net Zakatable Wealth</span>
                    <span className="zk-summary-val">{fmt(netWealth)}</span>
                  </div>
                  <div className="zk-summary-row">
                    <span>Nisab Threshold</span>
                    <span className="zk-summary-val">{fmt(nisab)}</span>
                  </div>
                </div>

                {/* Nisab progress bar */}
                <div className="zk-nisab-progress">
                  <div className="zk-nisab-progress__track">
                    <div
                      className="zk-nisab-progress__fill"
                      style={{ width: `${Math.min((netWealth / nisab) * 100, 100)}%` }}
                    />
                    <div className="zk-nisab-progress__marker" />
                  </div>
                  <div className="zk-nisab-progress__labels">
                    <span>₹ 0</span>
                    <span>Nisab</span>
                  </div>
                </div>

                {netWealth > 0 && (
                  <div className={`zk-nisab-badge ${aboveNisab ? "zk-nisab-badge--yes" : "zk-nisab-badge--no"}`}>
                    {aboveNisab
                      ? "✓ Wealth exceeds Nisab — Zakat is obligatory"
                      : "✗ Wealth below Nisab — Zakat not yet obligatory"}
                  </div>
                )}
              </div>

              {/* Breakdown donut */}
              {totalAssets > 0 && (
                <div className="zk-breakdown-card">
                  <h4 className="zk-summary-card__title">Asset Breakdown</h4>
                  <div className="zk-breakdown-list">
                    {CATEGORIES.filter((c) => Number(assets[c.id]) > 0).map((cat) => {
                      const pct = ((Number(assets[cat.id]) / totalAssets) * 100).toFixed(1);
                      return (
                        <div key={cat.id} className="zk-breakdown-item">
                          <div className="zk-breakdown-item__left">
                            <span className="zk-breakdown-item__icon">{cat.icon}</span>
                            <span className="zk-breakdown-item__label">{cat.label}</span>
                          </div>
                          <div className="zk-breakdown-item__right">
                            <span className="zk-breakdown-item__pct">{pct}%</span>
                            <div className="zk-breakdown-item__bar">
                              <div
                                className={`zk-breakdown-item__bar-fill zk-breakdown-item__bar-fill--${cat.color}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Result card */}
              {result !== null && (
                <div
                  ref={resultRef}
                  className={`zk-result-card ${result.aboveNisab ? "zk-result-card--due" : "zk-result-card--none"}`}
                >
                  <div className="zk-result-card__header">
                    <span className="zk-result-card__icon">
                      {result.aboveNisab ? "☪️" : "🌙"}
                    </span>
                    <h3 className="zk-result-card__title">
                      {result.aboveNisab ? "Zakat Due" : "No Zakat Due"}
                    </h3>
                  </div>

                  {result.aboveNisab ? (
                    <>
                      <div className="zk-result-amount">
                        <AnimatedNumber value={result.zakatDue} />
                      </div>
                      <p className="zk-result-card__note">
                        2.5% of net zakatable wealth of {fmt(result.netWealth)}
                      </p>

                      <div className="zk-result-breakdown">
                        <div className="zk-result-breakdown__row">
                          <span>Monthly equivalent</span>
                          <strong>{fmt(result.zakatDue / 12)}</strong>
                        </div>
                        <div className="zk-result-breakdown__row">
                          <span>Weekly equivalent</span>
                          <strong>{fmt(result.zakatDue / 52)}</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="zk-result-card__note">
                      Your net wealth ({fmt(result.netWealth)}) is below the Nisab
                      threshold ({fmt(result.nisab)}). Zakat is not obligatory this year.
                    </p>
                  )}

                  <p className="zk-result-card__disclaimer">
                    This is an estimate. Please consult a qualified Islamic scholar for a
                    binding ruling.
                  </p>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ══ LEARN TAB ══ */}
      {activeTab === "learn" && (
        <section className="zk-learn-section">
          <div className="zk-learn-inner">

            <div className="zk-learn-grid">
              {/* Left — FAQ */}
              <div className="zk-faq">
                <h2 className="zk-learn-heading">Frequently Asked Questions</h2>
                {learnItems.map((item, i) => (
                  <LearnAccordion key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>

              {/* Right — info cards */}
              <div className="zk-learn-cards">
                <div className="zk-info-card zk-info-card--gold">
                  <div className="zk-info-card__icon">⚖️</div>
                  <h4>The Five Pillars</h4>
                  <p>
                    Zakat is the Third Pillar of Islam, obligatory alongside Shahada,
                    Salah, Sawm, and Hajj.
                  </p>
                </div>
                <div className="zk-info-card zk-info-card--green">
                  <div className="zk-info-card__icon">🕌</div>
                  <h4>Who Receives Zakat?</h4>
                  <p>
                    The Quran (9:60) names eight categories: the poor, the needy, Zakat
                    administrators, those whose hearts need winning, freeing slaves, the
                    indebted, in the cause of Allah, and wayfarers.
                  </p>
                </div>
                <div className="zk-info-card zk-info-card--gold">
                  <div className="zk-info-card__icon">📿</div>
                  <h4>Wealth Purification</h4>
                  <p>
                    Giving Zakat purifies your remaining wealth and soul, removes
                    miserliness, and draws you closer to Allah.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ══ QURAN BANNER ══ */}
      <div className="zk-quran-banner">
        <span className="zk-quran-banner__ar">
          خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
        </span>
        <span className="zk-quran-banner__en">
          "Take from their wealth a charity by which you purify them and cause them
          increase." — At-Tawbah 9:103
        </span>
      </div>

      <Footer />
    </>
  );
}

/* ─── Accordion ─── */
function LearnAccordion({ q, a, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`zk-accordion ${open ? "zk-accordion--open" : ""}`}>
      <button className="zk-accordion__trigger" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <svg className="zk-accordion__chevron" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="zk-accordion__body">
        <p>{a}</p>
      </div>
    </div>
  );
}