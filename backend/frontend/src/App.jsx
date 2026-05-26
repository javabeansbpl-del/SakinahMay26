import './App.css'
import { Routes, Route } from 'react-router-dom'
// Public pages
import Home               from './pages/Home'
import MasajidTimings     from './pages/MasajidTiminigs'
import Calculations       from './pages/Calculations'
import AboutUs            from './pages/AboutUs'
import JoinUs             from './pages/JoinUs'
import Zakat              from './pages/Zakat'
import Fitrah             from './pages/Fitrah'
import Inheritence        from './pages/Inheritence'
import Iddat              from './pages/Iddat'
import Aqiqah             from './pages/Aqiqah'
import HijriCalendarPage  from './pages/HijriCalendarPage'
import MosqueRegistration from './pages/MosqueRegistration'
// Auth pages
import Login              from './pages/Login'
import Signup             from './pages/Signup'
// Protected pages
import PersonalCalendar   from './pages/PersonalCalendar'
import FastingTracker     from './pages/FastingTracker'
import PrayerTracker      from './pages/PrayerTracker'
import Profile            from './pages/Profile'
// Route guard
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <main className="main-content">
      <Routes>
        {/* ── Public routes ─────────────────── */}
        <Route path='/'                          element={<Home />} />
        <Route path='/masajidtimings'            element={<MasajidTimings />} />
        <Route path='/calculations'              element={<Calculations />} />
        <Route path='/aboutus'                   element={<AboutUs />} />
        <Route path='/joinus'                    element={<JoinUs />} />
        <Route path='/mosque-registration'       element={<MosqueRegistration />} />
        <Route path='/hijri-calendar'            element={<HijriCalendarPage />} />
        {/* ── Calculator sub-routes ─────────── */}
        <Route path='/calculations/zakat'        element={<Zakat />} />
        <Route path='/calculations/fitrah'       element={<Fitrah />} />
        <Route path='/calculations/inheritence'  element={<Inheritence />} />
        <Route path='/calculations/iddat'        element={<Iddat />} />
        <Route path='/calculations/aqiqah'       element={<Aqiqah />} />
        {/* ── Auth routes ───────────────────── */}
        <Route path='/login'                     element={<Login />} />
        <Route path='/signup'                    element={<Signup />} />
        {/* ── Protected routes ──────────────── */}
        <Route path='/calendar' element={
          <ProtectedRoute><PersonalCalendar /></ProtectedRoute>
        } />
        <Route path='/fasting-tracker' element={
          <ProtectedRoute><FastingTracker /></ProtectedRoute>
        } />
        <Route path='/prayer-tracker' element={
          <ProtectedRoute><PrayerTracker /></ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Routes>
    </main>
  )
}

export default App