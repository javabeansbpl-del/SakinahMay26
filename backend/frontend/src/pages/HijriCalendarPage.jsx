import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HijriCalendar from '../components/HijriCalendar'

export default function HijriCalendarPage() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        padding: '2rem 1.25rem 4rem',
      }}>
        {/* Page header */}
        <div style={{ maxWidth: '52rem', margin: '0 auto 2rem' }}>
          <p style={{
            fontFamily: "'Scheherazade New', serif",
            fontSize: '1.4rem',
            color: 'var(--text-gold)',
            marginBottom: '0.25rem'
          }}>
            التقويم الهجري
          </p>
          <h1 style={{
            fontFamily: "'Amiri', serif",
            fontSize: '2.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.375rem'
          }}>
            Hijri Calendar
          </h1>
          <p style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: '0.95rem',
            color: 'var(--text-tertiary)'
          }}>
            Both Gregorian and Hijri dates shown on every day.
            The next month panel is a calculated estimate based on the lunar cycle.
          </p>
        </div>

        <HijriCalendar />
      </div>
      <Footer />
    </>
  )
}