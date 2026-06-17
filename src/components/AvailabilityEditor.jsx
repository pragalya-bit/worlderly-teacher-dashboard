import { useState } from 'react'
import {
  useWeekly,
  addInterval,
  setIntervalField,
  copyIntervals,
  parseTime,
  fmtTime,
  TIME_CHOICES,
  DAY_LABELS,
  DAY_NAMES,
} from '../availabilityStore.js'

const TIMEZONES = [
  'India Standard Time - (GMT+5:30)',
  'Eastern Time - US & Canada',
  'Pacific Time - US & Canada',
  'Greenwich Mean Time - (GMT)',
  'Singapore Standard Time - (GMT+8)',
]

let nextDateId = 0

// Calendly-style editor. Teachers can ONLY add availability (no remove on
// weekly hours). Edits write to the shared store, so This Week's Schedule and
// the Schedule page reflect them immediately.
export function AvailabilityEditor() {
  const week = useWeekly()
  const [tz, setTz] = useState(TIMEZONES[0])
  const [copyOpen, setCopyOpen] = useState(null)
  const [dateHours, setDateHours] = useState([])

  function addDateHours() {
    setDateHours((p) => [...p, { id: `dh-${nextDateId++}`, date: '', start: '9:00am', end: '5:00pm' }])
  }
  function removeDateHours(id) {
    setDateHours((p) => p.filter((d) => d.id !== id))
  }
  function setDateField(id, field, value) {
    setDateHours((p) => p.map((d) => (d.id !== id ? d : { ...d, [field]: value })))
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x lg:divide-slate-100">
        {/* ── Weekly hours ── */}
        <div className="lg:pr-8">
          <div className="flex items-center gap-2 text-slate-800">
            <i className="fa-solid fa-arrow-right-arrow-left text-slate-500" />
            <h2 className="text-xl font-bold">Weekly hours</h2>
          </div>
          <p className="text-sm text-slate-400 mb-2">Set when you are typically available for meetings</p>
          <p className="text-xs text-orange-500 font-semibold mb-5">
            <i className="fa-solid fa-circle-info mr-1" /> You can add extra availability — existing times can’t be removed.
          </p>

          <div className="space-y-3">
            {week.map((intervals, di) => (
              <div key={di} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  {DAY_LABELS[di]}
                </span>

                {intervals.length === 0 ? (
                  <div className="flex items-center gap-3 h-11">
                    <span className="text-sm text-slate-400 font-medium">Unavailable</span>
                    <button
                      onClick={() => addInterval(di)}
                      className="w-7 h-7 rounded-full text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                      title="Add interval"
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 space-y-2">
                    {intervals.map((iv, ii) => (
                      <div key={ii} className="flex items-center gap-2 relative">
                        <TimeSelect value={fmtTime(iv.start)} onChange={(v) => setIntervalField(di, ii, 'start', parseTime(v))} />
                        <span className="text-slate-400">–</span>
                        <TimeSelect value={fmtTime(iv.end)} onChange={(v) => setIntervalField(di, ii, 'end', parseTime(v))} />
                        {ii === 0 && (
                          <>
                            <button
                              onClick={() => addInterval(di)}
                              className="w-7 h-7 rounded-full text-slate-400 hover:text-orange-600 hover:bg-orange-50 shrink-0"
                              title="Add interval"
                            >
                              <i className="fa-solid fa-plus" />
                            </button>
                            <button
                              onClick={() => setCopyOpen(copyOpen === di ? null : di)}
                              className="w-7 h-7 rounded-full text-slate-400 hover:text-sky-600 hover:bg-sky-50 shrink-0"
                              title="Copy times to…"
                            >
                              <i className="fa-regular fa-copy" />
                            </button>
                            {copyOpen === di && (
                              <CopyPopover
                                fromIdx={di}
                                onApply={(t) => {
                                  copyIntervals(di, t)
                                  setCopyOpen(null)
                                }}
                                onClose={() => setCopyOpen(null)}
                              />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timezone */}
          <div className="mt-6">
            <div className="relative inline-flex items-center">
              <i className="fa-solid fa-globe text-sky-600 mr-2" />
              <select
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                className="appearance-none bg-transparent text-sky-600 font-bold text-sm pr-6 outline-none cursor-pointer"
              >
                {TIMEZONES.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down text-sky-600 text-xs pointer-events-none -ml-5" />
            </div>
          </div>
        </div>

        {/* ── Date-specific hours ── */}
        <div className="lg:pl-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-800">
                <i className="fa-regular fa-calendar text-slate-500" />
                <h2 className="text-xl font-bold">Date-specific hours</h2>
              </div>
              <p className="text-sm text-slate-400">Adjust hours for specific days</p>
            </div>
            <button
              onClick={addDateHours}
              className="flex items-center gap-1.5 border border-slate-300 rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-colors shrink-0"
            >
              <i className="fa-solid fa-plus" /> Hours
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {dateHours.length === 0 && (
              <div className="text-sm text-slate-300 text-center py-10">
                <i className="fa-regular fa-calendar-plus text-2xl mb-2 block" />
                No date-specific overrides yet
              </div>
            )}
            {dateHours.map((d) => (
              <div key={d.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={d.date}
                    onChange={(e) => setDateField(d.id, 'date', e.target.value)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-orange-300"
                  />
                  <button
                    onClick={() => removeDateHours(d.id)}
                    className="ml-auto w-7 h-7 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TimeSelect value={d.start} onChange={(v) => setDateField(d.id, 'start', v)} />
                  <span className="text-slate-400">–</span>
                  <TimeSelect value={d.end} onChange={(v) => setDateField(d.id, 'end', v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-50 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer w-28"
    >
      {TIME_CHOICES.map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>
  )
}

function CopyPopover({ fromIdx, onApply, onClose }) {
  const [targets, setTargets] = useState([])
  function toggle(i) {
    setTargets((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }
  return (
    <div className="absolute top-9 right-0 z-30 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3" onClick={(e) => e.stopPropagation()}>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Copy times to</div>
      <div className="space-y-1">
        {DAY_NAMES.map((d, i) => (
          <label
            key={i}
            className={`flex items-center gap-2 text-sm font-medium rounded-lg px-2 py-1.5 cursor-pointer ${
              i === fromIdx ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              disabled={i === fromIdx}
              checked={targets.includes(i)}
              onChange={() => toggle(i)}
              className="accent-orange-500"
            />
            {d}
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => onApply(targets)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 rounded-full">
          Apply
        </button>
        <button onClick={onClose} className="px-3 text-sm font-semibold text-slate-400 hover:text-slate-600">
          Cancel
        </button>
      </div>
    </div>
  )
}
