import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../css/calculations.css";

const calcTools = [
  {
    to: "/calculations/zakat",
    accent: "gold",
    arabicTitle: "الزكاة",
    title: "Zakat Calculator",
    desc: "Accurately calculate your annual Zakat obligations with ease and full transparency.",
    number: "01",
    tag: "Wealth Purification",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M20 10 L24 17 L31 17 L25.5 22 L27.5 29 L20 25 L12.5 29 L14.5 22 L9 17 L16 17 Z" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
  },
  {
    to: "/calculations/fitrah",
    accent: "green",
    arabicTitle: "الفطرة",
    title: "Fitrah Calculator",
    desc: "Calculate Sadaqat al-Fitr for Ramadan with confidence and scholarly guidance.",
    number: "02",
    tag: "Ramadan Obligation",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 6 C20 6 8 14 8 22 A12 12 0 0 0 32 22 C32 14 20 6 20 6Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15"/>
        <path d="M20 14 C20 14 14 19 14 23 A6 6 0 0 0 26 23 C26 19 20 14 20 14Z" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
  {
    to: "/calculations/inheritence",
    accent: "gold",
    arabicTitle: "الميراث",
    title: "Inheritance",
    desc: "Structured Islamic inheritance distribution according to authentic Shariah principles.",
    number: "03",
    tag: "Estate Division",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="8" y="8" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
        <rect x="22" y="8" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
        <rect x="15" y="22" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.6"/>
        <line x1="13" y1="18" x2="20" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="27" y1="18" x2="20" y2="22" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    to: "/calculations/iddat",
    accent: "green",
    arabicTitle: "العِدَّة",
    title: "Iddat Period",
    desc: "Determine the sacred waiting period with precise calculation and Hijri calendar guidance.",
    number: "04",
    tag: "Sacred Waiting Period",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 10 L20 20 L27 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    to: "/calculations/aqiqah",
    accent: "gold",
    arabicTitle: "العَقِيقَة",
    title: "Aqiqah",
    desc: "Calculate the recommended Aqiqah date and Sunnah guidelines simply and clearly.",
    number: "05",
    tag: "Birth Celebration",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 7 L23.5 14 L32 15.3 L26 21 L27.5 29.5 L20 25.5 L12.5 29.5 L14 21 L8 15.3 L16.5 14 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15"/>
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
  },
];

function Calculations() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="ch-hero">
        {/* Geometric ornamental background */}
        <div className="ch-hero__ornament" aria-hidden="true">
          <div className="ch-hero__ring ch-hero__ring--1" />
          <div className="ch-hero__ring ch-hero__ring--2" />
          <div className="ch-hero__ring ch-hero__ring--3" />
          <div className="ch-hero__dots" />
        </div>

        <div className="ch-hero__inner">
          <span className="ch-hero__eyebrow">Sakinah · Tools</span>
          <h1 className="ch-hero__title">
            <span className="ch-hero__title-arabic">الحسابات الإسلامية</span>
            Islamic Calculations
            <br />
            <em>&amp; Life Tools</em>
          </h1>
          <p className="ch-hero__sub">
            Spiritually aligned tools rooted in authentic Islamic principles —
            helping you manage wealth, family, obligations, and sacred
            responsibilities with clarity and confidence.
          </p>

          <div className="ch-hero__meta">
            <div className="ch-hero__meta-item">
              <span className="ch-hero__meta-num">5</span>
              <span className="ch-hero__meta-label">Tools</span>
            </div>
            <div className="ch-hero__meta-divider" />
            <div className="ch-hero__meta-item">
              <span className="ch-hero__meta-num">100%</span>
              <span className="ch-hero__meta-label">Shariah Aligned</span>
            </div>
            <div className="ch-hero__meta-divider" />
            <div className="ch-hero__meta-item">
              <span className="ch-hero__meta-num">Free</span>
              <span className="ch-hero__meta-label">Always</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="ch-grid-section">
        <div className="ch-grid">

          {/* Featured first card — large */}
          <Link to={calcTools[0].to} className={`ch-card ch-card--featured ch-card--${calcTools[0].accent}`}>
            <div className="ch-card__number">{calcTools[0].number}</div>
            <div className="ch-card__icon-wrap">
              {calcTools[0].icon}
            </div>
            <div className="ch-card__tag">{calcTools[0].tag}</div>
            <div className="ch-card__arabic">{calcTools[0].arabicTitle}</div>
            <h3 className="ch-card__title">{calcTools[0].title}</h3>
            <p className="ch-card__desc">{calcTools[0].desc}</p>
            <div className="ch-card__cta">
              <span>Open Calculator</span>
              <svg viewBox="0 0 20 20" fill="none" className="ch-card__arrow">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ch-card__glow" aria-hidden="true" />
          </Link>

          {/* Remaining 4 cards */}
          {calcTools.slice(1).map((tool) => (
            <Link key={tool.to} to={tool.to} className={`ch-card ch-card--${tool.accent}`}>
              <div className="ch-card__number">{tool.number}</div>
              <div className="ch-card__icon-wrap">
                {tool.icon}
              </div>
              <div className="ch-card__tag">{tool.tag}</div>
              <div className="ch-card__arabic">{tool.arabicTitle}</div>
              <h3 className="ch-card__title">{tool.title}</h3>
              <p className="ch-card__desc">{tool.desc}</p>
              <div className="ch-card__cta">
                <span>Open Calculator</span>
                <svg viewBox="0 0 20 20" fill="none" className="ch-card__arrow">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="ch-card__glow" aria-hidden="true" />
            </Link>
          ))}

        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="ch-banner">
        <div className="ch-banner__inner">
          <div className="ch-banner__ornament" aria-hidden="true">
            <span className="ch-banner__bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>
          <p className="ch-banner__text">
            All tools are built with care to reflect authentic scholarly
            guidance. Always consult a qualified scholar for individual rulings.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Calculations;