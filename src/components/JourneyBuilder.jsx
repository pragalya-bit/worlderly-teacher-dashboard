import { useState } from 'react'
import { KIND_LABEL, upcomingSlotsFor } from '../data.js'
import { LibraryPicker } from './LibraryPicker.jsx'
import { Avatar, avatarUrl } from './Avatar.jsx'

// Task kinds a mentor can hang off a class — all pulled from the library.
const TASK_KINDS = [
  { id: 'assignment', label: 'Assignment', icon: 'fa-solid fa-pen-to-square' },
  { id: 'worksheet', label: 'Worksheet', icon: 'fa-solid fa-file-lines' },
  { id: 'quiz', label: 'Quiz', icon: 'fa-solid fa-circle-question' },
  { id: 'classnotes', label: 'Class Notes', icon: 'fa-solid fa-note-sticky' },
]

const TASK_TINT = {
  assignment: 'bg-orange-100 text-orange-700',
  worksheet: 'bg-sky-100 text-sky-700',
  quiz: 'bg-purple-100 text-purple-700',
  classnotes: 'bg-amber-100 text-amber-700',
}

let _id = 0
const uid = () => `j${_id++}`

export function JourneyBuilder({ student, onClose }) {
  // steps: [{ id, topic, tasks: [{id, name, kind}] }]
  const [steps, setSteps] = useState([])
  const [tab, setTab] = useState('build') // 'build' | 'preview'
  const [addingClass, setAddingClass] = useState(false)
  const [topic, setTopic] = useState('')
  const [when, setWhen] = useState('')
  const slots = upcomingSlotsFor(student.id)
  const [picker, setPicker] = useState(null) // { stepId, kind } | null
  const [sent, setSent] = useState(false)

  function addClass() {
    if (!topic.trim()) return
    setSteps((prev) => [...prev, { id: uid(), topic: topic.trim(), when, tasks: [] }])
    setTopic('')
    setWhen('')
    setAddingClass(false)
  }

  function removeStep(id) {
    setSteps((prev) => prev.filter((s) => s.id !== id))
  }

  function addTaskToStep(stepId, item) {
    setSteps((prev) =>
      prev.map((s) =>
        s.id !== stepId ? s : { ...s, tasks: [...s.tasks, { id: uid(), name: item.name, kind: item.kind }] },
      ),
    )
    setPicker(null)
  }

  function removeTask(stepId, taskId) {
    setSteps((prev) =>
      prev.map((s) => (s.id !== stepId ? s : { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) })),
    )
  }

  const totalTasks = steps.reduce((n, s) => n + s.tasks.length, 0)

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-50">
          <Avatar src={avatarUrl(student.name)} initial={student.initial} color={student.color} className="w-11 h-11 rounded-2xl" />
          <div className="min-w-0">
            <div className="font-bold text-slate-800">Journey Map · {student.name}</div>
            <div className="text-xs text-slate-400">{student.grade} · {student.subject}</div>
          </div>
          <div className="ml-auto flex bg-slate-100 rounded-full p-1">
            {['build', 'preview'].map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full capitalize transition-colors ${
                  tab === tb ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {tb === 'preview' ? 'Preview map' : 'Build'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {sent ? (
            <div className="rounded-3xl bg-emerald-50 text-emerald-700 p-10 text-center font-semibold">
              <i className="fa-solid fa-paper-plane text-3xl mb-3 block" />
              Journey map sent to {student.name.split(' ')[0]}! It now appears on their trek.
            </div>
          ) : tab === 'build' ? (
            <BuildView
              student={student}
              steps={steps}
              slots={slots}
              addingClass={addingClass}
              setAddingClass={setAddingClass}
              topic={topic}
              setTopic={setTopic}
              when={when}
              setWhen={setWhen}
              addClass={addClass}
              removeStep={removeStep}
              removeTask={removeTask}
              openPicker={(stepId, kind) => setPicker({ stepId, kind })}
            />
          ) : (
            <PreviewMap student={student} steps={steps} />
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="flex items-center gap-3 p-4 border-t border-slate-50">
            <span className="text-xs text-slate-400 font-medium">
              {steps.length} classes · {totalTasks} tasks
            </span>
            <button
              onClick={() => setTab(tab === 'build' ? 'preview' : 'build')}
              className="ml-auto text-sm font-bold px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              {tab === 'build' ? (
                <>
                  <i className="fa-solid fa-eye mr-2" /> Preview map
                </>
              ) : (
                <>
                  <i className="fa-solid fa-pen mr-2" /> Keep building
                </>
              )}
            </button>
            <button
              disabled={steps.length === 0}
              onClick={() => setSent(true)}
              className="text-sm font-bold px-5 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-100"
            >
              <i className="fa-solid fa-paper-plane mr-2" /> Confirm & send
            </button>
          </div>
        )}
      </div>

      {picker && (
        <LibraryPicker
          kind={picker.kind}
          onClose={() => setPicker(null)}
          onSelect={(item) => addTaskToStep(picker.stepId, item)}
        />
      )}
    </div>
  )
}

function BuildView({ student, steps, slots, addingClass, setAddingClass, topic, setTopic, when, setWhen, addClass, removeStep, removeTask, openPicker }) {
  return (
    <div className="space-y-4">
      {steps.length === 0 && !addingClass && (
        <div className="text-center text-slate-400 py-8">
          <i className="fa-solid fa-mountain-sun text-3xl text-orange-200 mb-2 block" />
          <p className="font-semibold">Start the journey by assigning a class.</p>
        </div>
      )}

      {steps.map((s, i) => (
        <div key={s.id} className="rounded-3xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="text-[0.65rem] font-bold uppercase tracking-wide text-orange-400">Class</div>
              <div className="font-bold text-slate-800 truncate">{s.topic}</div>
              {s.when && (
                <div className="text-[0.7rem] text-slate-400 font-medium">
                  <i className="fa-regular fa-calendar mr-1" />
                  {s.when}
                </div>
              )}
            </div>
            <button
              onClick={() => removeStep(s.id)}
              className="ml-auto w-8 h-8 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50"
              title="Remove class"
            >
              <i className="fa-solid fa-trash-can text-xs" />
            </button>
          </div>

          {/* Tasks under this class */}
          {s.tasks.length > 0 && (
            <div className="mt-3 ml-4 pl-5 border-l-2 border-dashed border-slate-200 space-y-2">
              {s.tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 group">
                  <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${TASK_TINT[t.kind]}`}>
                    {KIND_LABEL[t.kind]}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 truncate">{t.name}</span>
                  <button
                    onClick={() => removeTask(s.id, t.id)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 text-xs"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Assign task chips */}
          <div className="mt-3 ml-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Assign task:</span>
            {TASK_KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => openPicker(s.id, k.id)}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                <i className={`${k.icon} mr-1`} />
                {k.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Assign class */}
      {addingClass ? (
        <div className="rounded-3xl border border-orange-200 p-4 space-y-3">
          <input
            autoFocus
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addClass()}
            placeholder="Class topic e.g. Linear Equations"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300"
          />

          {/* Student's available slots — plan a month ahead */}
          <div>
            <div className="text-xs font-bold text-slate-500 mb-1.5">
              <i className="fa-regular fa-calendar-check text-orange-400 mr-1.5" />
              {student.name.split(' ')[0]}’s available slots
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {slots.map((sl) => {
                const label = `${sl.date} · ${sl.time}`
                const on = when === label
                return (
                  <button
                    key={label}
                    onClick={() => setWhen(on ? '' : label)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${
                      on ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addClass}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl"
            >
              Add class
            </button>
            <button
              onClick={() => setAddingClass(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-3"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingClass(true)}
          className="w-full rounded-3xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600 font-bold py-4 transition-colors"
        >
          <i className="fa-solid fa-plus mr-2" /> Assign class
        </button>
      )}
    </div>
  )
}

// A lightweight, trek-style preview of the journey being built.
function PreviewMap({ student, steps }) {
  if (steps.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10">
        <i className="fa-solid fa-map text-3xl text-orange-200 mb-2 block" />
        <p className="font-semibold">Nothing to preview yet — assign a class first.</p>
      </div>
    )
  }
  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        This is how {student.name.split(' ')[0]}’s trek will look. Confirm to send it to their journey map.
      </p>
      <div className="rounded-3xl bg-gradient-to-b from-sky-50 to-orange-50 p-6">
        <div className="flex flex-col items-center">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center w-full max-w-sm">
              {/* Class node */}
              <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex flex-col items-center justify-center shadow-md ring-4 ring-white">
                <i className="fa-solid fa-chalkboard-user" />
                <span className="text-[0.55rem] font-bold mt-0.5">CLASS {i + 1}</span>
              </div>
              <div className="text-sm font-bold text-slate-700 text-center mt-2 leading-tight">{s.topic}</div>
              {s.when && <div className="text-[0.65rem] text-slate-400 font-medium">{s.when}</div>}

              {/* Tasks UNDER the node */}
              {s.tasks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {s.tasks.map((t) => (
                    <span key={t.id} className={`text-[0.6rem] font-bold rounded-full py-1 px-2.5 ${TASK_TINT[t.kind]}`}>
                      {KIND_LABEL[t.kind]}
                    </span>
                  ))}
                </div>
              )}

              {/* Downward connector */}
              <div className="h-8 flex items-center">
                <i className="fa-solid fa-ellipsis-vertical text-orange-300" />
              </div>
            </div>
          ))}

          {/* Summit flag with all tasks gathered beneath it */}
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-white text-xl">
            <i className="fa-solid fa-flag-checkered" />
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-2">Summit 🎉</div>
          {steps.some((s) => s.tasks.length > 0) && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2 max-w-md">
              {steps.flatMap((s) => s.tasks).map((t) => (
                <span key={t.id} className={`text-[0.6rem] font-bold rounded-full py-1 px-2.5 ${TASK_TINT[t.kind]}`}>
                  {KIND_LABEL[t.kind]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
