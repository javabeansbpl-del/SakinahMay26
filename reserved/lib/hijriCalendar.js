import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ─── Gregorian to Hijri conversion (same algorithm as edge function) ──────────
export function gregorianToHijri(gYear, gMonth, gDay) {
  const jdn = Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4)
    + Math.floor((367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12)
    - Math.floor((3 * Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4)
    + gDay - 32075

  let l = jdn - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  l = l - 10631 * n + 354
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238)
  l = l
    - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43)
    + 29

  const hYear  = 30 * n + j - 30
  const hMonth = Math.floor((24 * (l - 1)) / 709) + 1
  const hDay   = l - Math.floor((709 * (hMonth - 1) + 1) / 24) - 1

  return { year: hYear, month: hMonth, day: hDay }
}

export const HIJRI_MONTH_NAMES = [
  '', 'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
]

export const HIJRI_MONTH_ARABIC = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
]

// ─── Hook: fetch hijri month data from Supabase ───────────────────────────────
export function useHijriCalendar() {
  const [hijriMonths, setHijriMonths]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    async function fetchMonths() {
      try {
        // Get current year's months + next year just in case
        const today = new Date()
        const h = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate())

        const { data, error } = await supabase
          .from('hijri_months')
          .select('*')
          .gte('hijri_year', h.year - 1)
          .lte('hijri_year', h.year + 1)
          .order('hijri_year')
          .order('hijri_month')

        if (error) throw error
        setHijriMonths(data || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMonths()
  }, [])

  // Get hijri date for any gregorian date
  function getHijriDate(date) {
    return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  // Get confirmed status for a hijri month
  function getMonthInfo(hYear, hMonth) {
    return hijriMonths.find(m => m.hijri_year === hYear && m.hijri_month === hMonth)
  }

  return { hijriMonths, loading, error, getHijriDate, getMonthInfo }
}