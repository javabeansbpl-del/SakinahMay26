// ─── Pure Hijri Calendar library — no Supabase, no external deps ─────────────

/**
 * Gregorian → Hijri conversion using the Khwarizmi/Kuwait algorithm.
 * Accurate to within ~1 day for dates after ~1900.
 */
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
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29

  const hYear  = 30 * n + j - 30
  const hMonth = Math.floor((24 * (l - 1)) / 709) + 1
  const hDay   = l - Math.floor((709 * (hMonth - 1) + 1) / 24) - 1

  return { year: hYear, month: hMonth, day: hDay }
}

/** Hijri → Gregorian (for finding the Gregorian date of a Hijri month start) */
export function hijriToGregorian(hYear, hMonth, hDay) {
  const N = hDay + Math.ceil(29.5001 * (hMonth - 1)) + (hYear - 1) * 354 +
    Math.floor((3 + 11 * hYear) / 30) + 1948440 - 385

  let J = N
  let l = J + 68569
  const n = Math.floor((4 * l) / 146097)
  l = l - Math.floor((146097 * n + 3) / 4)
  const i = Math.floor((4000 * (l + 1)) / 1461001)
  l = l - Math.floor((1461 * i) / 4) + 31
  const j = Math.floor((80 * l) / 2447)
  const day   = l - Math.floor((2447 * j) / 80)
  l = Math.floor(j / 11)
  const month = j + 2 - 12 * l
  const year  = 100 * (n - 49) + i + l

  return { year, month, day }
}

/** Approximate start date of a Hijri month (Gregorian) */
export function getHijriMonthStart(hYear, hMonth) {
  const { year, month, day } = hijriToGregorian(hYear, hMonth, 1)
  return new Date(year, month - 1, day)
}

/** Get Hijri date for a JS Date object */
export function getHijriDate(date) {
  return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/** Predict whether a Hijri month has 29 or 30 days.
 *  Islamic months alternate but use astronomical moon cycle (~29.53 days).
 *  We compute via the difference between two consecutive month starts.
 */
export function getHijriMonthLength(hYear, hMonth) {
  const start = getHijriMonthStart(hYear, hMonth)
  const nextHMonth = hMonth === 12 ? 1 : hMonth + 1
  const nextHYear  = hMonth === 12 ? hYear + 1 : hYear
  const end = getHijriMonthStart(nextHYear, nextHMonth)
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return diff === 30 ? 30 : 29
}

export const HIJRI_MONTH_NAMES = [
  '', 'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
]

export const HIJRI_MONTH_ARABIC = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
]

/** Simple hook — pure calculation, no network */
export function useHijriCalendar() {
  function getMonthInfo(hYear, hMonth) {
    const length = getHijriMonthLength(hYear, hMonth)
    return { hijri_year: hYear, hijri_month: hMonth, length, confirmed: false }
  }

  return { loading: false, error: null, getHijriDate, getMonthInfo }
}