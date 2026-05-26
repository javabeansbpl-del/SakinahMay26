import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
]

// ─── Accurate Hijri conversion ────────────────────────────────────────────────
function gregorianToHijri(gYear: number, gMonth: number, gDay: number) {
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

// ─── Find Gregorian start date of a Hijri month ───────────────────────────────
function findMonthStart(hYear: number, hMonth: number): string {
  const today = new Date()

  // Search ±60 days around today for day 1 of the target hijri month
  for (let offset = -60; offset <= 60; offset++) {
    const candidate = new Date(today)
    candidate.setUTCDate(today.getUTCDate() + offset)

    const h = gregorianToHijri(
      candidate.getUTCFullYear(),
      candidate.getUTCMonth() + 1,
      candidate.getUTCDate()
    )

    if (h.year === hYear && h.month === hMonth && h.day === 1) {
      return candidate.toISOString().split('T')[0]
    }
  }

  // Fallback: use today minus current day offset
  const h = gregorianToHijri(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate())
  const fallback = new Date(today)
  fallback.setUTCDate(today.getUTCDate() - (h.day - 1))
  return fallback.toISOString().split('T')[0]
}

// ─── Month duration (29 or 30 days) ──────────────────────────────────────────
function getMonthDuration(hYear: number, hMonth: number): number {
  const leapYears = [2, 5, 7, 10, 13, 15, 18, 21, 24, 26, 29]
  const isLeap = leapYears.includes(hYear % 30)
  if (hMonth === 12) return isLeap ? 30 : 29
  return hMonth % 2 === 1 ? 30 : 29
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const today = new Date()
    const hijri = gregorianToHijri(
      today.getUTCFullYear(),
      today.getUTCMonth() + 1,
      today.getUTCDate()
    )

    // ── Save current month ──────────────────────────────────────────────────
    const monthStart = findMonthStart(hijri.year, hijri.month)
    const duration   = getMonthDuration(hijri.year, hijri.month)

    const { data, error } = await supabase
      .from('hijri_months')
      .upsert({
        hijri_year:      hijri.year,
        hijri_month:     hijri.month,
        gregorian_start: monthStart,
        duration,
        confirmed:       true,
        confirmed_at:    today.toISOString(),
        source:          'astronomical'
      }, { onConflict: 'hijri_year,hijri_month' })
      .select()
      .single()

    if (error) throw error

    // ── Pre-save next month ─────────────────────────────────────────────────
    let nextMonth = hijri.month + 1
    let nextYear  = hijri.year
    if (nextMonth > 12) { nextMonth = 1; nextYear++ }

    const nextStart    = findMonthStart(nextYear, nextMonth)
    const nextDuration = getMonthDuration(nextYear, nextMonth)

    await supabase
      .from('hijri_months')
      .upsert({
        hijri_year:      nextYear,
        hijri_month:     nextMonth,
        gregorian_start: nextStart,
        duration:        nextDuration,
        confirmed:       false,
        source:          'astronomical'
      }, { onConflict: 'hijri_year,hijri_month' })

    return new Response(JSON.stringify({
      message: 'Hijri month calculated and saved',
      today:   today.toISOString().split('T')[0],
      hijri:   `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year}`,
      saved:   data
    }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

