import { useSyncExternalStore } from 'react'

// ── Time helpers (decimal hours <-> "9:00am") ──
export function parseTime(str) {
  const m = String(str).match(/(\d+):(\d+)\s*(am|pm)/i)
  if (!m) return 9
  let h = Number(m[1]) % 12
  if (/pm/i.test(m[3])) h += 12
  return h + Number(m[2]) / 60
}
export function fmtTime(dec) {
  const h = Math.floor(dec)
  const mins = Math.round((dec - h) * 60)
  const ap = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(mins).padStart(2, '0')}${ap}`
}
export function fmtRange(iv) {
  return `${fmtTime(iv.start)} – ${fmtTime(iv.end)}`
}

// 30-minute options for the editor selects.
export const TIME_CHOICES = (() => {
  const out = []
  for (let h = 0; h < 24; h++) for (const m of [0, 30]) out.push(fmtTime(h + m / 60))
  return out
})()

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ── The store: weekly[weekday 0=Sun..6=Sat] = [{start,end}] decimal hours ──
let weekly = [
  [], // Sun
  [{ start: 9, end: 13 }, { start: 14, end: 18 }], // Mon
  [{ start: 9, end: 13 }, { start: 14, end: 18 }], // Tue
  [{ start: 9, end: 13 }, { start: 14, end: 18 }], // Wed
  [{ start: 9, end: 13 }, { start: 14, end: 18 }], // Thu
  [{ start: 9, end: 13 }, { start: 14, end: 18 }], // Fri
  [{ start: 10, end: 13 }], // Sat
]

const listeners = new Set()
const emit = () => listeners.forEach((l) => l())
const subscribe = (cb) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const getSnapshot = () => weekly

export function useWeekly() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function setIntervalField(dayIdx, ivIdx, field, value) {
  weekly = weekly.map((d, i) =>
    i !== dayIdx ? d : d.map((iv, j) => (j !== ivIdx ? iv : { ...iv, [field]: value })),
  )
  emit()
}

// Teachers can only ADD availability — append a fresh interval.
export function addInterval(dayIdx, interval = { start: 9, end: 17 }) {
  weekly = weekly.map((d, i) => (i !== dayIdx ? d : [...d, { ...interval }]))
  emit()
}

// Copy one day's intervals onto other days (append, never remove).
export function copyIntervals(fromIdx, targets) {
  const src = weekly[fromIdx]
  weekly = weekly.map((d, i) => {
    if (!targets.includes(i)) return d
    const merged = [...d]
    src.forEach((iv) => {
      if (!merged.some((x) => x.start === iv.start && x.end === iv.end)) merged.push({ ...iv })
    })
    return merged
  })
  emit()
}
