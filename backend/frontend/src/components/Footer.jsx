import { useEffect, useState } from 'react'
import "../css/Home.css"

function Footer() {
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email) => {
    // Basic but reliable email regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()

    // Email validation check
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // If valid
    setEmailError('')
    alert(`Thank you for subscribing with: ${email}`)
    e.target.reset()
  }

  useEffect(() => {
    const contactItems = document.querySelectorAll('.contact-item')

    contactItems.forEach(item => {
      item.addEventListener('mouseenter', function () {
        this.style.paddingLeft = '10px'
      })
      item.addEventListener('mouseleave', function () {
        this.style.paddingLeft = '0'
      })
    })
  }, [])

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-section">
            <div className="logo-section">
              <div className="logo-icon">
                <i className="fas fa-mosque"></i>
              </div>
              <div className="logo-content">
                <h2>SAKINAH</h2>
              </div>
            </div>
            <div className="mission-box">
              <h4>Our Mission</h4>
              <p>
                Cultivating peace and knowledge through quality Islamic education
                and community outreach, striving for spiritual excellence.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+000 123 456 789 213</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>username@domain.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>380 St Kilda Road, Jackson Store, United States</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="quick-links">
              <li><a href="#courses">Online Courses</a></li>
              <li><a href="#audio">Audio Listening</a></li>
              <li><a href="#islam">Site for Islam</a></li>
              <li><a href="#services">Our Services</a></li>
              <li><a href="#quran">Quran Hifz Classes</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#donation">Urgent Donation</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Subscribe for Updates</h3>
            <p>
              Stay connected with our latest news, courses, and Islamic content.
            </p>

            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={() => setEmailError('')}
                required
              />

              {emailError && (
                <span className="error-text">{emailError}</span>
              )}

              <button type="submit">Subscribe</button>
            </form>

            <h3>Follow Us</h3>
            <div className="social-media">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-telegram-plane"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © Sakinah 2025. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="#terms">Terms and Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
