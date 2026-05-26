import api from './axios'

// ── Islamic events ────────────────────────────────
export async function getIslamicEvents() {
  const response = await api.get('/api/calendar/islamic-events')
  return response.data
}

// ── User reminders ────────────────────────────────
export async function getReminders() {
  const response = await api.get('/api/calendar/reminders')
  return response.data
}

export async function addReminder({ title, note, remind_date, remind_time, recurring }) {
  const response = await api.post('/api/calendar/reminders', {
    title, note, remind_date, remind_time, recurring
  })
  return response.data
}

export async function deleteReminder(id) {
  await api.delete(`/api/calendar/reminders/${id}`)
}

// ── Fasting log ───────────────────────────────────
export async function getFastingLog() {
  const response = await api.get('/api/fasting/log')
  return response.data
}

export async function logFast({ fast_date, fast_type, completed, note }) {
  const response = await api.post('/api/fasting/log', {
    fast_date, fast_type, completed, note
  })
  return response.data
}

export async function deleteFast(id) {
  await api.delete(`/api/fasting/log/${id}`)
}

// ── Prayer log ────────────────────────────────────
export async function getPrayerLog(date) {
  const response = await api.get(`/api/prayer/log?date=${date}`)
  return response.data
}

export async function upsertPrayerLog({ prayer_date, fajr, dhuhr, asr, maghrib, isha }) {
  const response = await api.post('/api/prayer/log', {
    prayer_date, fajr, dhuhr, asr, maghrib, isha
  })
  return response.data
}