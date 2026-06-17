import { useState } from 'react'
import { STUDENTS, classSessionsFor } from '../data.js'
import { SendMessageModal } from './SendMessageModal.jsx'
import { JourneyBuilder } from './JourneyBuilder.jsx'
import { ReportCard } from './ReportCard.jsx'
import { Avatar, avatarUrl } from './Avatar.jsx'

// The student-side personalised journey map runs here.
const JOURNEY_URL = 'http://localhost:3001/'

const STATUS = {
  'on-track': { label: 'On track', cls: 'bg-emerald-50 text-emerald-600' },
  ahead: { label: 'Ahead', cls: 'bg-purple-50 text-purple-600' },
  'needs-help': { label: 'Needs help', cls: 'bg-rose-50 text-rose-600' },
}

const FILTERS = [
  { id: 'all', label: 'All Students' },
  { id: 'Math', label: 'Math' },
  { id: 'Science', label: 'Science' },
  { id: 'needs-help', label: 'Needs help' },
]

export function Students() {
  const [filter, setFilter] = useState('all')
  const [msgTo, setMsgTo] = useState(null)
  const [journeyFor, setJourneyFor] = useState(null)
  const [reportFor, setReportFor] = useState(null)

  const list = STUDENTS.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'needs-help') return s.status === 'needs-help'
    return s.subject === filter
  })

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Students</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {STUDENTS.length} students across Math & Science · tracking their trek progress
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((s) => (
          <StudentCard
            key={s.id}
            s={s}
            onMessage={() => setMsgTo(s)}
            onEditJourney={() => setJourneyFor(s)}
            onReport={() => setReportFor(s)}
          />
        ))}
      </div>

      {msgTo && (
        <SendMessageModal to={msgTo.name} initial={msgTo.initial} color={msgTo.color} onClose={() => setMsgTo(null)} />
      )}
      {journeyFor && <JourneyBuilder student={journeyFor} onClose={() => setJourneyFor(null)} />}
      {reportFor && <ReportCard student={reportFor} onClose={() => setReportFor(null)} />}
    </div>
  )
}

function StudentCard({ s, onMessage, onEditJourney, onReport }) {
  const st = STATUS[s.status]
  const missingNotes = classSessionsFor(s).filter((c) => c.recordings.length === 0).length

  function openJourney() {
    // Open the student's personalised journey map (student dashboard).
    window.open(JOURNEY_URL, '_blank', 'noopener')
  }
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Avatar src={avatarUrl(s.name)} initial={s.initial} color={s.color} className="w-12 h-12 rounded-2xl text-lg" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-800 truncate">{s.name}</div>
          <div className="text-xs text-slate-400 font-medium">{s.grade} · {s.subject}</div>
        </div>
        <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
      </div>

      {/* Trek progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>Week {s.week} of {s.totalWeeks}</span>
          <span className="text-orange-600">{s.progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-orange-50 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: `${s.progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl bg-slate-50 p-3 text-center">
          <div className={`text-lg font-extrabold ${s.lastQuiz >= 60 ? 'text-slate-800' : 'text-rose-500'}`}>
            {s.lastQuiz}%
          </div>
          <div className="text-[0.65rem] text-slate-400 font-semibold uppercase tracking-wide">Last quiz</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 text-center">
          <div className="text-lg font-extrabold text-slate-800">
            <i className="fa-solid fa-fire text-orange-400 text-sm mr-1" />
            {s.streak}
          </div>
          <div className="text-[0.65rem] text-slate-400 font-semibold uppercase tracking-wide">Day streak</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-400 font-medium">
          <i className="fa-solid fa-calendar-day mr-1.5 text-orange-300" />
          {s.next}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={onMessage}
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors text-xs"
            title={`Message ${s.name.split(' ')[0]}`}
          >
            <i className="fa-solid fa-comment-dots" />
          </button>
          <button
            onClick={openJourney}
            className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors text-xs"
            title="View live journey map"
          >
            <i className="fa-solid fa-mountain-sun" />
          </button>
        </div>
      </div>

      {missingNotes > 0 && (
        <button
          onClick={onReport}
          className="mt-3 w-full flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 text-xs font-bold hover:bg-amber-100 transition-colors"
        >
          <i className="fa-solid fa-triangle-exclamation" />
          {missingNotes} class{missingNotes > 1 ? 'es' : ''} need a voice note
          <i className="fa-solid fa-chevron-right ml-auto text-[0.6rem]" />
        </button>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onEditJourney}
          className="flex items-center justify-center gap-2 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors text-xs font-bold py-2.5"
        >
          <i className="fa-solid fa-map-location-dot" /> Journey map
        </button>
        <button
          onClick={onReport}
          className="flex items-center justify-center gap-2 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors text-xs font-bold py-2.5"
        >
          <i className="fa-solid fa-id-card" /> Report card
        </button>
      </div>
    </div>
  )
}
