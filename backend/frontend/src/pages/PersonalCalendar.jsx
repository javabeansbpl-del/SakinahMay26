//import { useAuth } from '../context/AuthContext'

import { useAuth } from '../hooks/useAuth'

import PrayerTracker from '../components/PrayerTracker'
import FastingTracker from '../components/FastingTracker'
import Reminders from '../components/Reminders'
import IslamicEvents from '../components/IslamicEvents'
import '../css/PersonalCalendar.css'

export default function PersonalCalendar() {
  const { user } = useAuth()
  const displayName = user?.firstName;

  return (
    <div className="personal-calendar-page">

      {/* Page header */}
      <div className="cal-page-header">
        <div className="cal-header-text">
          <p className="cal-greeting">السلام عليكم، {displayName}</p>
          <h1 className="cal-page-title">My Calendar</h1>
          <p className="cal-page-subtitle">Track your prayers, fasts, and personal reminders</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="cal-grid">

        {/* Prayer tracker — full width on top */}
        <div className="cal-col-full">
          <PrayerTracker />
        </div>

        {/* Fasting + Reminders side by side */}
        <div className="cal-col-half">
          <FastingTracker />
        </div>
        <div className="cal-col-half">
          <Reminders />
        </div>

        {/* Islamic events — full width at bottom */}
        <div className="cal-col-full">
          <IslamicEvents />
        </div>

      </div>
    </div>
  )
}