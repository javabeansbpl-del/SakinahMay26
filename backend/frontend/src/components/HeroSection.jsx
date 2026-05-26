import { useEffect, useRef } from 'react'
import "../css/Home.css"

function HeroServicesSection() {
  const servicesRef = useRef(null)

  const services = [
    {
      icon: '🕌',
      title: 'Prayer Times',
      description: 'Accurate and up-to-date mosque prayer times delivered to help you stay connected to your daily prayers wherever you are.'
    },
    {
      icon: '💰',
      title: 'Zakat & Fitra',
      description: 'Easy and reliable calculations for zakat and fitra to ensure your charitable obligations are fulfilled correctly.'
    },
    {
      icon: '📜',
      title: 'Inheritance Calculations',
      description: 'Clear and Shariah-compliant inheritance calculations to help distribute assets fairly and transparently.'
    },
    {
      icon: '🧕',
      title: 'Iddah Guidance',
      description: 'Accurate iddah period calculations and guidance to support women during this important phase with clarity and respect.'
    },
    {
      icon: '📖',
      title: 'Islamic Knowledge',
      description: 'Access to authentic Islamic resources and explanations to strengthen your understanding of daily obligations.'
    },
    {
      icon: '🛡️',
      title: 'Trusted Platform',
      description: 'A secure and reliable platform ensuring your data and religious calculations remain private and trustworthy.'
    }
  ]

  /* Smooth scroll for hero button */
  useEffect(() => {
    const exploreLink = document.querySelector('.explore-link')

    const handleClick = (e) => {
      e.preventDefault()
      servicesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }

    exploreLink?.addEventListener('click', handleClick)

    return () => exploreLink?.removeEventListener('click', handleClick)
  }, [])

  /* Services animation observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running'
          }
        })
      },
      { threshold: 0.1 }
    )

    const boxes = servicesRef.current?.querySelectorAll('.feature-box')
    boxes?.forEach(box => {
      box.style.animationPlayState = 'paused'
      observer.observe(box)
    })

    return () => boxes?.forEach(box => observer.unobserve(box))
  }, [])

  return (
    <section className="banner-area">
      {/* ================= HERO PART ================= */}
      <div className="animated-backdrop">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      <div className="main-wrapper">
        <h1 className="primary-heading">
          Islamic Guidance & Essential Calculations
        </h1>

        <p className="tagline">
          Accurate prayer times, zakat, fitra, inheritance, and iddah
          calculations — all in one place to help you practice with ease and
          confidence.
        </p>

        <a href="#services" className="explore-link">
          Discover Our Services
        </a>
      </div>

      <div className="decorative-line"></div>

      {/* ================= SERVICES PART ================= */}
      <div className="offerings-section" ref={servicesRef}>
        <div className="content-container">
          <div className="features-layout">
            {services.map((service, index) => (
              <div key={index} className="feature-box">
                <div className="icon-container">{service.icon}</div>
                <h3 className="feature-heading">{service.title}</h3>
                <div className="accent-bar"></div>
                <p className="feature-details">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroServicesSection
