import { useState } from 'react'
import { KIND_LABEL, upcomingSlotsFor, classSessionsFor, classWorkFor } from '../data.js'
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
  const [picker, setPicker] = useState(null) // { target, kind } | null  (target = stepId | 'scheduled')
  const [sent, setSent] = useState(false)

  // Editable "up next" scheduled class shown in History.
  const [scheduled, setScheduled] = useState({
    topic: 'Review & Mastery',
    when: student.next,
    tasks: [{ id: uid(), name: 'Algebra - Worksheet', kind: 'worksheet' }],
  })
  const addScheduledTask = (item) =>
    setScheduled((sc) => ({ ...sc, tasks: [...sc.tasks, { id: uid(), name: item.name, kind: item.kind }] }))
  const removeScheduledTask = (taskId) =>
    setScheduled((sc) => ({ ...sc, tasks: sc.tasks.filter((t) => t.id !== taskId) }))

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
  }

  function onPickItem(item) {
    if (picker?.target === 'scheduled') addScheduledTask(item)
    else if (picker?.target) addTaskToStep(picker.target, item)
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
          <Avatar photo={`/kids/${student.id}.jpg`} src={avatarUrl(student.name)} initial={student.initial} color={student.color} className="w-11 h-11 rounded-2xl" />
          <div className="min-w-0">
            <div className="font-bold text-slate-800">Journey Map · {student.name}</div>
            <div className="text-xs text-slate-400">{student.grade} · {student.subject}</div>
          </div>
          <div className="ml-auto flex bg-slate-100 rounded-full p-1">
            {[
              { id: 'history', label: 'History' },
              { id: 'build', label: 'Build' },
              { id: 'preview', label: 'Preview map' },
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                  tab === tb.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {tb.label}
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
          ) : tab === 'history' ? (
            <HistoryView
              student={student}
              scheduled={scheduled}
              setScheduled={setScheduled}
              slots={slots}
              removeScheduledTask={removeScheduledTask}
              openPicker={(kind) => setPicker({ target: 'scheduled', kind })}
            />
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
              openPicker={(stepId, kind) => setPicker({ target: stepId, kind })}
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

      {picker && <LibraryPicker kind={picker.kind} onClose={() => setPicker(null)} onSelect={onPickItem} />}
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

// Past classes (expandable) + an editable next scheduled class.
function HistoryView({ student, scheduled, setScheduled, slots, removeScheduledTask, openPicker }) {
  const sessions = classSessionsFor(student)
  const n = sessions.length
  const score = (i) => Math.max(45, Math.min(100, student.lastQuiz - (n - 1 - i) * 4))
  const [openDay, setOpenDay] = useState(null)
  const [editSched, setEditSched] = useState(false)

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        {student.name.split(' ')[0]}’s journey so far — tap a class to see its recording, work & quiz.
      </p>

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />

        {sessions.map((s, i) => {
          const isOpen = openDay === s.day
          return (
            <div key={s.day} className="relative mb-4">
              <span className="absolute -left-[18px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[0.6rem] ring-4 ring-white">
                <i className="fa-solid fa-check" />
              </span>
              <button
                onClick={() => setOpenDay(isOpen ? null : s.day)}
                className={`w-full text-left rounded-2xl border p-3 transition-colors ${isOpen ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-100 hover:border-orange-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 text-sm">Class · {s.topic}</div>
                  <span className="text-[0.65rem] text-slate-400 font-medium">
                    {s.date} <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ml-1 text-[0.55rem]`} />
                  </span>
                </div>
                <div className="text-[0.7rem] text-emerald-600 font-semibold mt-0.5">Completed</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Chip cls="bg-orange-100 text-orange-700" icon="fa-pen-to-square" text="Assignment ✓" />
                  <Chip cls="bg-sky-100 text-sky-700" icon="fa-file-lines" text="Worksheet ✓" />
                  <Chip cls={score(i) >= 60 ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-700'} icon="fa-circle-question" text={`Quiz ${score(i)}%`} />
                  <Chip cls={s.recordings.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} icon="fa-microphone" text={s.recordings.length ? 'Voice note' : 'No voice note'} />
                </div>
              </button>

              {isOpen && <ClassDetail session={s} scorePct={score(i)} studentName={student.name} />}
            </div>
          )
        })}

        {/* Editable next scheduled class */}
        <div className="relative">
          <span className="absolute -left-[18px] top-1 w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[0.55rem] ring-4 ring-white">
            <i className="fa-solid fa-clock" />
          </span>
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[0.7rem] text-amber-600 font-semibold uppercase tracking-wide">Up next · Scheduled</div>
              <button
                onClick={() => setEditSched((v) => !v)}
                className="text-[0.7rem] font-bold text-amber-700 hover:text-amber-800"
              >
                <i className={`fa-solid ${editSched ? 'fa-check' : 'fa-pen'} mr-1`} />{editSched ? 'Done' : 'Edit'}
              </button>
            </div>

            {editSched ? (
              <div className="mt-2 space-y-2">
                <input
                  value={scheduled.topic}
                  onChange={(e) => setScheduled((sc) => ({ ...sc, topic: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-bold outline-none focus:border-orange-300"
                />
                <select
                  value={scheduled.when}
                  onChange={(e) => setScheduled((sc) => ({ ...sc, when: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-300 bg-white"
                >
                  <option>{scheduled.when}</option>
                  {slots.map((sl) => (
                    <option key={`${sl.date}-${sl.time}`}>{`${sl.date} · ${sl.time}`}</option>
                  ))}
                </select>
                <div className="flex flex-wrap items-center gap-1.5">
                  {scheduled.tasks.map((t) => (
                    <span key={t.id} className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center gap-1">
                      {KIND_LABEL[t.kind]}: {t.name}
                      <button onClick={() => removeScheduledTask(t.id)} className="text-slate-400 hover:text-rose-500">
                        <i className="fa-solid fa-xmark text-[0.6rem]" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[['assignment', 'Assignment'], ['worksheet', 'Worksheet'], ['quiz', 'Quiz'], ['classnotes', 'Class Notes']].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => openPicker(k)}
                      className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
                    >
                      <i className="fa-solid fa-plus mr-1" />{label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <div className="font-bold text-slate-800 text-sm">{scheduled.topic}</div>
                <div className="text-xs text-slate-500">{scheduled.when}</div>
                {scheduled.tasks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {scheduled.tasks.map((t) => (
                      <span key={t.id} className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {KIND_LABEL[t.kind]}: {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Chip({ cls, icon, text }) {
  return (
    <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      <i className={`fa-solid ${icon} mr-1`} />
      {text}
    </span>
  )
}

const pct = (items) => {
  const tot = items.reduce((n, it) => n + it.total, 0) || 1
  const got = items.reduce((n, it) => n + it.marks, 0)
  return Math.round((got / tot) * 100)
}

// Expanded detail for a past class. Defaults to the recording; Assignment /
// Worksheet / Quiz reveal their content when their button is clicked.
function ClassDetail({ session, scorePct, studentName }) {
  const work = classWorkFor(session.topic, scorePct)
  const [view, setView] = useState('recording')
  const first = studentName.split(' ')[0]

  const TABS = [
    { id: 'recording', label: 'Recording', icon: 'fa-microphone' },
    { id: 'assignment', label: 'Assignment', icon: 'fa-pen-to-square' },
    { id: 'worksheet', label: 'Worksheet', icon: 'fa-file-lines' },
    { id: 'quiz', label: 'Quiz', icon: 'fa-circle-question' },
  ]

  return (
    <div className="mt-2 ml-1 rounded-2xl bg-slate-50 border border-slate-100 p-3">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={`text-[0.7rem] font-bold px-3 py-1.5 rounded-full transition-colors ${
              view === t.id ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'
            }`}
          >
            <i className={`fa-solid ${t.icon} mr-1.5`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Recording */}
      {view === 'recording' &&
        (session.recordings.length > 0 ? (
          session.recordings.map((r) => (
            <div key={r.id} className="flex items-center gap-2 rounded-xl bg-white p-2.5">
              <button className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                <i className="fa-solid fa-play text-xs" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-700 truncate">{r.label}</div>
                <div className="h-1.5 bg-orange-200 rounded-full mt-1"><div className="h-full w-1/4 bg-orange-500 rounded-full" /></div>
              </div>
              <span className="text-[0.6rem] text-slate-400 font-medium shrink-0">{r.dur}</span>
            </div>
          ))
        ) : (
          <div className="text-xs text-amber-600 font-semibold rounded-xl bg-amber-50 border border-amber-200 p-2.5">
            <i className="fa-solid fa-triangle-exclamation mr-1" /> No class recording uploaded
          </div>
        ))}

      {/* Assignment / Worksheet — question PDF + answer PDF + score */}
      {view === 'assignment' && (
        <PdfWork label="Assignment" file={`${session.topic} - Assignment`} student={first} score={pct(work.assignment)} />
      )}
      {view === 'worksheet' && (
        <PdfWork label="Worksheet" file={`${session.topic} - Worksheet`} student={first} score={pct(work.worksheet)} />
      )}

      {/* Quiz — score + automated corrections */}
      {view === 'quiz' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.7rem] font-bold text-slate-500">Auto-graded</span>
            <span className={`text-sm font-extrabold ${work.quiz.score >= 60 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {work.quiz.score}% ({work.quiz.correct}/{work.quiz.total})
            </span>
          </div>
          <div className="space-y-1.5">
            {work.quiz.items.map((it, i) => (
              <div key={i} className="rounded-xl bg-white p-2 flex items-start gap-2">
                <i className={`fa-solid ${it.ok ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-rose-500'} mt-0.5`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-700">{it.q}</div>
                  <div className="text-[0.7rem] text-slate-500">
                    Answered <span className={it.ok ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold line-through'}>{it.studentAns}</span>
                    {!it.ok && <> · correct <span className="text-emerald-600 font-semibold">{it.correctAns}</span></>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Question PDF + student's answer PDF + score, for Assignment / Worksheet.
function PdfWork({ label, file, student, score }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold text-slate-500">{label}</span>
        <span className={`text-sm font-extrabold ${score >= 60 ? 'text-emerald-600' : 'text-rose-500'}`}>Score {score}%</span>
      </div>
      <PdfRow tint="bg-rose-50 text-rose-500" name={`${file} (Questions).pdf`} caption="Question paper · by mentor" />
      <PdfRow tint="bg-sky-50 text-sky-500" name={`${student} - ${label} (Answers).pdf`} caption="Student submission" />
    </div>
  )
}

function PdfRow({ tint, name, caption }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-100 p-2.5">
      <span className={`w-9 h-9 rounded-lg ${tint} flex items-center justify-center shrink-0`}>
        <i className="fa-solid fa-file-pdf" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-700 truncate">{name}</div>
        <div className="text-[0.6rem] text-slate-400">{caption}</div>
      </div>
      <button className="px-3 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full shrink-0">
        <i className="fa-solid fa-eye mr-1" /> View
      </button>
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
  // Group classes into weeks — each week ends in a summit.
  const WEEK_SIZE = 2
  const weeks = []
  for (let i = 0; i < steps.length; i += WEEK_SIZE) weeks.push(steps.slice(i, i + WEEK_SIZE))

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        This is how {student.name.split(' ')[0]}’s trek will look — each week ends in a summit. Confirm to send it.
      </p>
      <div className="rounded-3xl bg-gradient-to-b from-sky-50 to-orange-50 p-6">
        <div className="flex flex-col items-center">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col items-center w-full">
              {week.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center w-full max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex flex-col items-center justify-center shadow-md ring-4 ring-white">
                    <i className="fa-solid fa-chalkboard-user" />
                    <span className="text-[0.55rem] font-bold mt-0.5">CLASS {w * WEEK_SIZE + i + 1}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-700 text-center mt-2 leading-tight">{s.topic}</div>
                  {s.when && <div className="text-[0.65rem] text-slate-400 font-medium">{s.when}</div>}
                  {s.tasks.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                      {s.tasks.map((t) => (
                        <span key={t.id} className={`text-[0.6rem] font-bold rounded-full py-1 px-2.5 ${TASK_TINT[t.kind]}`}>
                          {KIND_LABEL[t.kind]}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="h-8 flex items-center">
                    <i className="fa-solid fa-ellipsis-vertical text-orange-300" />
                  </div>
                </div>
              ))}

              {/* Summit = end of this week */}
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-white text-xl">
                <i className="fa-solid fa-flag-checkered" />
              </div>
              <div className="text-sm font-black text-emerald-700 mt-2">Summit · Week {w + 1} 🎉</div>
              {week.some((s) => s.tasks.length > 0) && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-2 max-w-md">
                  {week.flatMap((s) => s.tasks).map((t) => (
                    <span key={t.id} className={`text-[0.6rem] font-bold rounded-full py-1 px-2.5 ${TASK_TINT[t.kind]}`}>
                      {KIND_LABEL[t.kind]}
                    </span>
                  ))}
                </div>
              )}

              {/* connector to next week */}
              {w < weeks.length - 1 && (
                <div className="h-8 flex items-center">
                  <i className="fa-solid fa-ellipsis-vertical text-emerald-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
