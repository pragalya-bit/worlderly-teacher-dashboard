import { useState } from 'react'
import { STUDENT_UPDATES, KIND_LABEL } from '../data.js'
import { LibraryPicker } from './LibraryPicker.jsx'
import { Avatar, avatarUrl } from './Avatar.jsx'

const UPDATE_STYLE = {
  submitted: { icon: 'fa-solid fa-inbox', cls: 'bg-orange-50 text-orange-500' },
  quiz: { icon: 'fa-solid fa-circle-question', cls: 'bg-sky-50 text-sky-500' },
  class: { icon: 'fa-solid fa-circle-check', cls: 'bg-emerald-50 text-emerald-500' },
  streak: { icon: 'fa-solid fa-fire', cls: 'bg-amber-50 text-amber-500' },
}

// Task kinds — each opens the library to pick a specific item to push.
const TASK_KINDS = [
  { id: 'assignment', label: 'Assignment', icon: 'fa-solid fa-pen-to-square' },
  { id: 'worksheet', label: 'Worksheet', icon: 'fa-solid fa-file-lines' },
  { id: 'quiz', label: 'Quiz', icon: 'fa-solid fa-circle-question' },
  { id: 'classnotes', label: 'Class Notes', icon: 'fa-solid fa-note-sticky' },
]

// Shows a student's recent updates AND lets the mentor push a task from the
// library straight into their journey.
export function StudentUpdatesModal({ student, onClose }) {
  const updates = STUDENT_UPDATES[student.id] || []
  const [assigned, setAssigned] = useState([])
  const [pickerKind, setPickerKind] = useState(null) // open the library picker for this kind

  function pushItem(item) {
    setAssigned((prev) => [{ id: `${item.id}-${prev.length}`, name: item.name, kind: item.kind }, ...prev])
    setPickerKind(null)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={avatarUrl(student.name)} initial={student.initial} color={student.color} className="w-12 h-12 rounded-2xl text-lg" />
          <div className="min-w-0">
            <div className="font-bold text-slate-800">{student.name}</div>
            <div className="text-xs text-slate-400 font-medium">{student.grade} · {student.subject}</div>
          </div>
          <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Quick progress */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <Stat label="Week" value={`${student.week}/${student.totalWeeks}`} />
          <Stat label="Progress" value={`${student.progress}%`} />
          <Stat label="Last quiz" value={`${student.lastQuiz}%`} />
        </div>

        {/* Recent updates */}
        <h3 className="text-sm font-bold text-slate-700 mb-2">Recent updates</h3>
        <div className="space-y-2 mb-6">
          {updates.length === 0 && <p className="text-sm text-slate-400">No recent activity.</p>}
          {updates.map((u, i) => {
            const st = UPDATE_STYLE[u.type]
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <span className={`w-9 h-9 rounded-xl ${st.cls} flex items-center justify-center`}>
                  <i className={st.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800">{u.title}</div>
                  <div className="text-xs text-slate-500 truncate">{u.detail}</div>
                </div>
                {u.score != null && (
                  <span className={`text-sm font-extrabold ${u.score >= 60 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {u.score}%
                  </span>
                )}
                <span className="text-[0.65rem] text-slate-400 font-medium shrink-0 ml-1">{u.time}</span>
              </div>
            )
          })}
        </div>

        {/* Assign a task from the library */}
        <div className="rounded-3xl border border-orange-200 p-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-mountain-sun text-orange-500" /> Assign next task
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Pick a task type → choose it from the library → it’s pushed to {student.name.split(' ')[0]}’s journey
          </p>

          <div className="flex flex-wrap gap-1.5">
            {TASK_KINDS.map((t) => (
              <button
                key={t.id}
                onClick={() => setPickerKind(t.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                <i className={`${t.icon} mr-1.5`} />
                {t.label}
              </button>
            ))}
          </div>

          {assigned.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-bold text-slate-500">Pushed to journey</div>
              {assigned.map((a) => (
                <div key={a.id} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-600">
                    {KIND_LABEL[a.kind]}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 truncate">{a.name}</span>
                  <i className="fa-solid fa-circle-check text-emerald-500 ml-auto shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pickerKind && (
        <LibraryPicker kind={pickerKind} onClose={() => setPickerKind(null)} onSelect={pushItem} />
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-extrabold text-slate-800">{value}</div>
      <div className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wide">{label}</div>
    </div>
  )
}
