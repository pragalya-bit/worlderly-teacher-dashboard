import { useState } from 'react'
import { COACH, STATS, TODAY_CLASSES, STUDENTS, SUBMISSIONS, ACCENT } from '../data.js'
import { SendMessageModal } from './SendMessageModal.jsx'
import { StudentUpdatesModal } from './StudentUpdatesModal.jsx'
import { Avatar, avatarUrl } from './Avatar.jsx'

export function Dashboard({ onSelect }) {
  const liveClass = TODAY_CLASSES.find((c) => c.status === 'live')
  const nextClass = TODAY_CLASSES.find((c) => c.status === 'upcoming')
  const featured = liveClass || nextClass
  const pending = SUBMISSIONS.filter((s) => s.status === 'pending')

  const [msgTo, setMsgTo] = useState(null) // student-like object or null (live card)
  const [updatesFor, setUpdatesFor] = useState(null) // student for the updates modal

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Hi, Ms. {COACH.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          You have {TODAY_CLASSES.filter((c) => c.status !== 'done').length} classes left today and{' '}
          {pending.length} checkpoints to review.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((s) => {
          const a = ACCENT[s.accent]
          return (
            <div key={s.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <div className={`w-11 h-11 rounded-2xl ${a.bg} ${a.text} flex items-center justify-center text-lg mb-3`}>
                <i className={s.icon} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">{s.value}</div>
              <div className="text-sm font-semibold text-slate-600 mt-1">{s.label}</div>
              <div className={`text-xs font-medium mt-1 ${a.text}`}>{s.delta}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: featured class + today's timeline */}
        <div className="lg:col-span-8 space-y-6">
          {featured && (
            <FeaturedClass
              cls={featured}
              onMessage={() => setMsgTo({ name: featured.student })}
            />
          )}

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Today's Classes</h2>
              <button
                onClick={() => onSelect('schedule')}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Full schedule →
              </button>
            </div>
            <div className="space-y-2">
              {TODAY_CLASSES.map((c) => (
                <ClassRow key={c.id} cls={c} onAssign={(s) => setUpdatesFor(s)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Student's Corner */}
        <div className="lg:col-span-4">
          <StudentsCorner onOpen={(s) => setUpdatesFor(s)} onSeeAll={() => onSelect('students')} />
        </div>
      </div>

      {msgTo && (
        <SendMessageModal
          to={msgTo.name}
          initial={msgTo.initial || msgTo.name?.[0]}
          color={msgTo.color}
          onClose={() => setMsgTo(null)}
        />
      )}
      {updatesFor && <StudentUpdatesModal student={updatesFor} onClose={() => setUpdatesFor(null)} />}
    </div>
  )
}

function StudentsCorner({ onOpen, onSeeAll }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-slate-800">Student's Corner</h2>
        <button onClick={onSeeAll} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
          See all →
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">Tap a student to see their updates · badges = new submissions</p>

      <div className="grid grid-cols-3 gap-3">
        {STUDENTS.map((s) => (
          <button
            key={s.id}
            onClick={() => onOpen(s)}
            className="flex flex-col items-center gap-1.5 group"
            title={`View ${s.name}'s updates`}
          >
            <span className="relative">
              <Avatar
                photo={`/kids/${s.id}.jpg`}
                src={avatarUrl(s.name)}
                initial={s.initial}
                color={s.color}
                className="w-14 h-14 rounded-full text-xl shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform"
              />
              {s.pending > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-rose-500 text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {s.pending}
                </span>
              )}
            </span>
            <span className="text-[0.7rem] font-semibold text-slate-600 text-center leading-tight truncate w-full">
              {s.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FeaturedClass({ cls, onMessage }) {
  const initial = cls.student?.[0] || 'S'
  const matched = STUDENTS.find((st) => st.name.split(' ')[0] === cls.student?.split(' ')[0])
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
      <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/10" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Left: class details + actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1 text-xs font-bold">
              <i className="fa-solid fa-clock" /> UP NEXT · {cls.time}
            </span>
            <span className="bg-white/20 rounded-full px-2.5 py-1 text-xs font-bold">{cls.type}</span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight">{cls.topic}</h2>
          <p className="text-white/85 text-sm mt-1 font-medium">{cls.subject}</p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button className="bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-50 transition-colors shadow-sm">
              <i className="fa-solid fa-video mr-2" /> Join class
            </button>
            <button
              onClick={onMessage}
              className="bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-full"
            >
              <i className="fa-solid fa-comment-dots mr-2" /> Message student
            </button>
            <button className="bg-white/15 hover:bg-white/25 transition-colors text-white font-semibold text-sm px-5 py-2.5 rounded-full">
              <i className="fa-solid fa-book-open mr-2" /> Open lesson plan
            </button>
          </div>
        </div>

        {/* Right: student profile (no background box) */}
        <div className="shrink-0 sm:w-44 flex flex-row sm:flex-col items-center text-left sm:text-center gap-3 sm:pr-2">
          <Avatar
            photo={matched ? `/kids/${matched.id}.jpg` : undefined}
            src={avatarUrl(cls.student)}
            initial={initial}
            color="bg-white/25"
            className="w-16 h-16 rounded-full text-xl ring-2 ring-white/50"
          />
          <div className="min-w-0">
            <div className="font-extrabold leading-tight truncate">{cls.student}</div>
            <div className="text-white/85 text-xs font-medium">{cls.grade}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClassRow({ cls, onAssign }) {
  const map = {
    done: { dot: 'bg-emerald-400', label: 'Done', cls: 'text-emerald-600 bg-emerald-50' },
    live: { dot: 'bg-orange-500', label: 'Now', cls: 'text-orange-600 bg-orange-50' },
    upcoming: { dot: 'bg-slate-300', label: 'Upcoming', cls: 'text-slate-500 bg-slate-50' },
  }[cls.status]
  // Match a 1:1 class to a student so the mentor can assign their next task.
  const firstName = cls.student?.split(' ')[0]
  const matched = cls.type === '1:1' ? STUDENTS.find((s) => s.name.split(' ')[0] === firstName) : null

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="text-center w-14 shrink-0">
        <div className="text-sm font-extrabold text-slate-800">{cls.time}</div>
        <div className="text-[0.65rem] text-slate-400 font-medium">{cls.duration}</div>
      </div>
      <div className={`w-1.5 self-stretch rounded-full ${map.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-800 truncate">{cls.topic}</div>
        <div className="text-xs text-slate-500 truncate">
          {cls.subject} · {cls.student} · {cls.type}
        </div>
      </div>
      {cls.status === 'done' && matched ? (
        <button
          onClick={() => onAssign(matched)}
          className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full shrink-0 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          title="Assign the next task in the journey"
        >
          <i className="fa-solid fa-plus mr-1" /> Assign task
        </button>
      ) : (
        <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full shrink-0 ${map.cls}`}>{map.label}</span>
      )}
    </div>
  )
}
