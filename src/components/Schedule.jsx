import { useState } from 'react'
import { CAL_DAYS, CAL_HOURS } from '../data.js'
import { useWeekly } from '../availabilityStore.js'

const clamp = (v) => Math.min(CAL_HOURS.end, Math.max(CAL_HOURS.start, v))

const HOUR_PX = 92
const TYPE_STYLE = {
  '1:1': 'bg-sky-500',
  Group: 'bg-emerald-500',
  Trial: 'bg-amber-500',
}
const FILTERS = [
  { id: 'all', label: 'All classes' },
  { id: 'Trial', label: 'Trial class' },
  { id: '1:1', label: '1:1 class' },
  { id: 'Group', label: 'Group class' },
]

function fmt(dec) {
  const h24 = Math.floor(dec)
  const m = Math.round((dec - h24) * 60)
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${ampm}`
}

export function Schedule() {
  const [filter, setFilter] = useState('all')
  const week = useWeekly()
  const hours = []
  for (let h = CAL_HOURS.start; h <= CAL_HOURS.end; h++) hours.push(h)
  const gridH = (CAL_HOURS.end - CAL_HOURS.start) * HOUR_PX

  const total = CAL_DAYS.reduce(
    (n, d) => n + d.events.filter((e) => filter === 'all' || e.type === filter).length,
    0,
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule</h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} classes · <span className="text-lg font-extrabold text-slate-800">16–21 June 2026 (GMT+5:30)</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-500 hover:text-orange-600 shadow-sm">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <span className="text-sm font-bold text-slate-700 px-1">This week</span>
          <button className="w-9 h-9 rounded-full bg-white border border-slate-100 text-slate-500 hover:text-orange-600 shadow-sm">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
              filter === f.id
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-100'
                : 'bg-white border border-slate-100 text-slate-500 hover:text-orange-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
          <Legend dot="bg-sky-500" label="1:1" />
          <Legend dot="bg-emerald-500" label="Group" />
          <Legend dot="bg-amber-500" label="Trial" />
        </div>
      </div>

      {/* Availability overlay legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 -mt-2">
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-emerald-200/70" /> Available (open)</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-slate-200/70" /> Unavailable</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded border-2 border-dotted border-slate-400" /> Scheduled class</span>
      </div>

      {/* Google-Calendar-style grid */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            {/* Day header row */}
            <div className="grid sticky top-0 z-10 bg-white border-b border-slate-100" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              <div />
              {CAL_DAYS.map((d) => (
                <div key={d.day} className="text-center py-3 border-l border-slate-50">
                  <div className="text-[0.65rem] font-bold tracking-wide text-slate-400">{d.day}</div>
                  <div
                    className={`mx-auto mt-1 w-9 h-9 rounded-full flex items-center justify-center text-lg font-extrabold ${
                      d.today ? 'bg-orange-500 text-white' : 'text-slate-700'
                    }`}
                  >
                    {d.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="grid" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              {/* Hour gutter */}
              <div className="relative" style={{ height: gridH }}>
                {hours.map((h, i) => (
                  <div
                    key={h}
                    className="absolute right-2 -translate-y-1/2 text-[0.65rem] font-semibold text-slate-400"
                    style={{ top: i * HOUR_PX }}
                  >
                    {fmt(h)}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {CAL_DAYS.map((d, di) => {
                const events = d.events.filter((e) => filter === 'all' || e.type === filter)
                const avail = week[di + 1] || [] // CAL_DAYS[0]=MON => weekday 1
                return (
                  <div key={d.day} className="relative border-l border-slate-50" style={{ height: gridH }}>
                    {/* base: unavailable (grey, blurred) covers the whole day */}
                    <div className="absolute inset-x-1 rounded-lg bg-slate-200/50 backdrop-blur-[1px]" style={{ top: 0, height: gridH }} />

                    {/* available time the mentor is open (green, blurred) */}
                    {avail.map((iv, k) => {
                      const s = clamp(iv.start)
                      const e = clamp(iv.end)
                      if (e <= s) return null
                      return (
                        <div
                          key={k}
                          className="absolute inset-x-1 rounded-lg bg-emerald-200/50 backdrop-blur-[1px]"
                          style={{ top: (s - CAL_HOURS.start) * HOUR_PX, height: (e - s) * HOUR_PX }}
                        />
                      )
                    })}

                    {/* hour gridlines */}
                    {hours.map((h, i) => (
                      <div key={h} className="absolute inset-x-0 border-t border-slate-100/70" style={{ top: i * HOUR_PX }} />
                    ))}

                    {/* scheduled classes (dotted border) */}
                    {events.map((e) => (
                      <EventBlock key={e.id} e={e} />
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventBlock({ e }) {
  const top = (e.start - CAL_HOURS.start) * HOUR_PX
  const height = (e.end - e.start) * HOUR_PX
  const isTrial = e.type === 'Trial'
  return (
    <div
      className={`group absolute inset-x-1.5 rounded-lg border-2 border-dotted border-white/80 px-2 py-1 text-white overflow-hidden cursor-pointer shadow-sm ${TYPE_STYLE[e.type]}`}
      style={{ top: top + 2, height: height - 4 }}
    >
      {isTrial && (
        <span className="absolute top-1 right-1 bg-white/30 text-[0.5rem] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 z-10">
          Trial class
        </span>
      )}
      <div className={`text-[0.72rem] font-bold leading-snug ${isTrial ? 'pr-14' : ''}`}>{e.title}</div>
      <div className="text-[0.6rem] opacity-90">
        {fmt(e.start)} – {fmt(e.end)}
      </div>
      <div className="text-[0.62rem] font-semibold leading-snug mt-0.5">
        <i className="fa-solid fa-user text-[0.55rem] mr-1 opacity-80" />
        {e.who}
      </div>
      <div className="text-[0.58rem] opacity-90">
        {e.subject} · {e.board}
      </div>

      {/* hover popup */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full w-44 bg-slate-800 text-white rounded-xl p-2.5 text-left opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
        {isTrial && <div className="text-[0.6rem] font-bold text-amber-300 uppercase mb-0.5">Trial class</div>}
        <div className="text-xs font-bold">{e.title}</div>
        <div className="text-[0.65rem] text-slate-300">{e.subject} · {e.type}</div>
        <div className="text-[0.65rem] text-slate-300">{fmt(e.start)} – {fmt(e.end)} · {e.who}</div>
      </div>
    </div>
  )
}

function Legend({ dot, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded ${dot}`} />
      {label}
    </span>
  )
}
