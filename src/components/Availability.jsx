import { useState } from 'react'
import { LEAVE_HISTORY } from '../data.js'
import { useWeekly, fmtRange, DAY_NAMES } from '../availabilityStore.js'
import { AvailabilityEditor } from './AvailabilityEditor.jsx'

const SHORT = DAY_NAMES.map((d) => d.slice(0, 3))

export function Availability() {
  const week = useWeekly()
  const [history, setHistory] = useState(LEAVE_HISTORY)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)

  function addLeave(entry) {
    setHistory((prev) => [entry, ...prev])
    setShowForm(false)
  }

  // ── Edit mode: Calendly-style editor ──
  if (editing) {
    return (
      <div className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button onClick={() => setEditing(false)} className="text-sm font-semibold text-orange-600 hover:text-orange-700 mb-2">
              <i className="fa-solid fa-arrow-left mr-1.5" /> Availability Calendar
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Availability</h1>
            <p className="text-sm text-slate-500 mt-0.5">Add weekly hours and date-specific overrides</p>
          </div>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
          >
            <i className="fa-solid fa-check" /> Save & Done
          </button>
        </header>
        <AvailabilityEditor />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Availability Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your weekly teaching hours — edit to add more availability</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 border border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors text-sm font-bold px-5 py-2.5 rounded-full"
          >
            <i className="fa-solid fa-pen" /> Edit availability
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
          >
            <i className="fa-solid fa-plus" /> Request Leave
          </button>
        </div>
      </header>

      {showForm && <RequestLeaveForm onSubmit={addLeave} onCancel={() => setShowForm(false)} />}

      {/* This Week's Schedule — read-only reflection of weekly availability */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-lg">
            <i className="fa-solid fa-calendar-days" />
          </span>
          <h2 className="text-xl font-bold text-slate-800">This Week's Schedule</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">Your available teaching hours · use “Edit availability” to add more</p>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 md:p-5 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[760px]">
            {week.map((intervals, di) => (
              <div key={di} className="flex flex-col">
                <div className="text-center text-xs font-bold tracking-wide text-slate-500 mb-3">{SHORT[di]}</div>
                <div className="space-y-2">
                  {intervals.length === 0 ? (
                    <div className="text-center text-[0.7rem] text-slate-300 font-medium py-4">Unavailable</div>
                  ) : (
                    intervals.map((iv, i) => (
                      <div key={i} className="rounded-xl border bg-emerald-100 border-emerald-300 text-emerald-800 px-2.5 py-2 text-center">
                        <div className="text-[0.7rem] font-bold leading-tight">{fmtRange(iv)}</div>
                        <div className="text-[0.6rem] font-semibold opacity-90">Available</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 pt-4 border-t border-slate-200/70">
            <Legend dot="bg-emerald-500" label="Available" />
            <Legend dot="bg-slate-300" label="Unavailable" />
          </div>
        </div>
      </div>

      {/* Leave history */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-5">Leave History</h2>
        <div className="space-y-2">
          {history.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50/70 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-800">{l.type}</div>
                <div className="text-xs text-slate-500">
                  {l.dates}
                  {l.reason ? ` · ${l.reason}` : ''}
                </div>
              </div>
              <StatusBadge status={l.status} />
              <div className="text-xs text-slate-400 font-medium w-full sm:w-auto sm:text-right">Submitted: {l.submitted}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Legend({ dot, label }) {
  return (
    <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
      <span className={`w-3 h-3 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function StatusBadge({ status }) {
  const cls =
    status === 'Approved'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Pending'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-rose-100 text-rose-600'
  return <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${cls}`}>{status}</span>
}

function RequestLeaveForm({ onSubmit, onCancel }) {
  const [type, setType] = useState('Casual Leave')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [reason, setReason] = useState('')

  function submit(e) {
    e.preventDefault()
    const dates = to && to !== from ? `${from || '—'} to ${to}` : from || '—'
    onSubmit({ id: `lh-${reason}-${from}`, type, dates, reason, status: 'Pending', submitted: '2026-06-16' })
  }

  return (
    <form onSubmit={submit} className="bg-white border border-orange-200 rounded-3xl p-5 md:p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Request Leave</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300 bg-white"
          >
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Emergency Leave</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Reason</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Family event"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
        >
          <i className="fa-solid fa-paper-plane mr-2" /> Submit request
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
