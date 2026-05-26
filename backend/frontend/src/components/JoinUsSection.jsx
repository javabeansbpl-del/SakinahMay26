import { useState } from 'react'
import "../css/Home.css"
import { useNavigate } from 'react-router-dom'

function JoinUsSection() {
  const navigate = useNavigate()


const handleRegisterSubmit = (e) => {
  e.preventDefault()

  if (!validateRegister()) return

  console.log('Register:', formData)
  navigate('/signup')
}

const handleSignInSubmit = (e) => {
  e.preventDefault()

  if (!validateSignIn()) return

  console.log('Sign In:', formData)
  navigate('/login')
}

  const [activeTab, setActiveTab] = useState('register')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: ''
  })

  /* ✅ NEW: holds validation errors */
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    /* ✅ NEW: remove error as user types */
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ''
    }))
  }

  /* ✅ NEW: email format validation */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /* ✅ NEW: register form validation */
  const validateRegister = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ✅ NEW: sign-in validation */
  const validateSignIn = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }





  return (
    <section className="community-section">
      <div className="membership-wrapper">

        {/* ⛔ LEFT PANEL — NOT TOUCHED */}
        <div className="info-panel">
          <h2 className="heading-primary">Join Our Community</h2>
          <p className="description-text">
            Become part of our growing Muslim community and get free access to
            accurate prayer times, zakat, fitra, inheritance and iddah
            calculations, along with other helpful Islamic resources.
          </p>
          <ul className="benefits-list">
            <li>Accurate prayer times for your location</li>
            <li>Zakat & Fitra calculators</li>
            <li>Inheritance calculation tools</li>
            <li>Iddah period tracker</li>
            <li>Islamic resources & guidance</li>
          </ul>
        </div>

        {/* ✅ RIGHT PANEL ONLY */}
        <div className="forms-panel">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'register' ? 'selected' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
            <button
              className={`tab-button ${activeTab === 'signin' ? 'selected' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Login
            </button>
          </div>

          {/* REGISTER FORM */}
          <form
            className={`registration-form ${activeTab === 'register' ? 'visible' : ''}`}
            onSubmit={handleRegisterSubmit}
          >
            <div className="input-wrapper">
              <label className="field-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="text-input"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-wrapper">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="text-input"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-wrapper">
              <label className="field-label">Password</label>
              <input
                type="password"
                name="password"
                className="text-input"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="action-button">
              Create Account
            </button>
          </form>

          {/* SIGN IN FORM */}
          <form
            className={`registration-form ${activeTab === 'signin' ? 'visible' : ''}`}
            onSubmit={handleSignInSubmit}
          >
            <div className="input-wrapper">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="text-input"
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-wrapper">
              <label className="field-label">Password</label>
              <input
                type="password"
                name="password"
                className="text-input"
                onChange={handleInputChange}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="action-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default JoinUsSection


