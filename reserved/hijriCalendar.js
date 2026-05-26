import { useState } from 'react'

// ── Gregorian to Hijri conversion ─────────────────────────────────────────────
export function gregorianToHijri(gYear, gMonth, gDay) {
  const jdn =
    Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
    Math.floor((367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4) +
    gDay - 32075

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

// ── Hijri month names ─────────────────────────────────────────────────────────
export const HIJRI_MONTH_NAMES = [
  '',
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
]

// ── Hijri month names in Arabic ───────────────────────────────────────────────
export const HIJRI_MONTH_ARABIC = [
  '',
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
]

// ── Hook ──────────────────────────────────────────────────────────────────────
// No DB needed — conversion is pure math
export function useHijriCalendar() {
  const [loading] = useState(false)
  const [error]   = useState(null)

  // Convert any JS Date object to Hijri
  function getHijriDate(date) {
    return gregorianToHijri(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    )
  }

  // Format Hijri date as readable string
  // e.g. "15 Ramadan 1446"
  function formatHijri(date, lang = 'en') {
    const h = getHijriDate(date)
    const monthName = lang === 'ar'
      ? HIJRI_MONTH_ARABIC[h.month]
      : HIJRI_MONTH_NAMES[h.month]
    return `${h.day} ${monthName} ${h.year}`
  }

  // Get today's Hijri date
  function getTodayHijri() {
    return getHijriDate(new Date())
  }

  return {
    loading,
    error,
    getHijriDate,
    formatHijri,
    getTodayHijri,
  }
}