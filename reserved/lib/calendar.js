import { supabase } from './supabase'

// ─── ISLAMIC EVENTS ───────────────────────────────────────────────────────────
export async function getIslamicEvents() {
  const { data, error } = await supabase
    .from('islamic_events')
    .select('*')
    .order('hijri_month', { ascending: true })
  if (error) throw error
  return data
}

// ─── USER REMINDERS ───────────────────────────────────────────────────────────
export async function getReminders() {
  const { data, error } = await supabase
    .from('user_reminders')
    .select('*')
    .order('remind_date', { ascending: true })
  if (error) throw error
  return data
}

export async function addReminder({ title, note, remind_date, remind_time, recurring }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('user_reminders')
    .insert([{ user_id: user.id, title, note, remind_date, remind_time, recurring }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteReminder(id) {
  const { error } = await supabase
    .from('user_reminders')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── FASTING LOG ──────────────────────────────────────────────────────────────
export async function getFastingLog() {
  const { data, error } = await supabase
    .from('fasting_log')
    .select('*')
    .order('fast_date', { ascending: false })
  if (error) throw error
  return data
}

export async function logFast({ fast_date, fast_type, completed, note }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('fasting_log')
    .upsert([{ user_id: user.id, fast_date, fast_type, completed, note }],
      { onConflict: 'user_id,fast_date' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFast(id) {
  const { error } = await supabase
    .from('fasting_log')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── PRAYER LOG ───────────────────────────────────────────────────────────────
export async function getPrayerLog(date) {
  const { data, error } = await supabase
    .from('prayer_log')
    .select('*')
    .eq('prayer_date', date)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertPrayerLog({ prayer_date, fajr, dhuhr, asr, maghrib, isha }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('prayer_log')
    .upsert([{ user_id: user.id, prayer_date, fajr, dhuhr, asr, maghrib, isha }],
      { onConflict: 'user_id,prayer_date' })
    .select()
    .single()
  if (error) throw error
  return data
}