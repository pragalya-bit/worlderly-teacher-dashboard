import { useState } from 'react'
import { LIBRARY, LIBRARY_STUDENTS, PUSHABLE_KINDS, KIND_LABEL } from '../data.js'

const KIND_BADGE = {
  lessonplan: 'bg-slate-100 text-slate-500',
  classnotes: 'bg-amber-50 text-amber-600',
  worksheet: 'bg-sky-50 text-sky-600',
  assignment: 'bg-orange-50 text-orange-600',
  quiz: 'bg-purple-50 text-purple-600',
}

const TINT = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', soft: 'bg-sky-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', soft: 'bg-emerald-100' },
}

export function Library() {
  const [subject, setSubject] = useState(null) // subject key
  const [material, setMaterial] = useState(null) // material object

  if (material) {
    return <MaterialDetail subject={subject} material={material} onBack={() => setMaterial(null)} />
  }
  if (subject) {
    return <MaterialsView subjectKey={subject} onBack={() => setSubject(null)} onOpen={setMaterial} />
  }
  return <SubjectsView onPick={setSubject} />
}

/* ── View 1: Browse by Subject ── */
function SubjectsView({ onPick }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Worlderly Library</h1>
        <p className="text-sm text-slate-500 mt-0.5">Curriculum, lesson plans & worksheets — published by Worlderly experts</p>
      </header>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {Object.entries(LIBRARY).map(([key, s]) => {
            const t = TINT[s.tint]
            return (
              <button
                key={key}
                onClick={() => onPick(key)}
                className={`rounded-3xl ${t.bg} border ${t.border} p-8 text-center hover:shadow-md transition-shadow`}
              >
                <span className={`w-16 h-16 rounded-2xl ${t.soft} ${t.text} flex items-center justify-center text-2xl mx-auto mb-4`}>
                  <i className={s.icon} />
                </span>
                <div className="text-lg font-bold text-slate-800">{s.name}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">{s.materials.length} materials</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── View 2: Browse by Topics + Materials ── */
function MaterialsView({ subjectKey, onBack, onOpen }) {
  const subject = LIBRARY[subjectKey]
  const t = TINT[subject.tint]
  const [q, setQ] = useState('')
  const list = subject.materials.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-6">
      <header>
        <button onClick={onBack} className="text-sm font-semibold text-orange-600 hover:text-orange-700 mb-2">
          <i className="fa-solid fa-arrow-left mr-1.5" /> Worlderly Library
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{subject.name}</h1>
      </header>

      <div>
        <h2 className="text-base font-bold text-slate-800 mb-2">Browse by Topics</h2>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-xl shadow-sm">
          <i className="fa-solid fa-magnifying-glass text-slate-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search study materials…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Materials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((m) => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-2xl ${t.bg} ${t.text} flex items-center justify-center text-lg`}>
                  <i className="fa-solid fa-file-pdf" />
                </div>
                {m.comments > 0 && (
                  <span className="text-[0.65rem] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                    <i className="fa-solid fa-comment-dots mr-1" />{m.comments} comment{m.comments > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-800 mt-3">{m.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${t.bg} ${t.text}`}>{m.subject}</span>
                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{m.grade}</span>
                <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{m.board}</span>
              </div>
              <div className="text-[0.65rem] text-slate-400 font-medium mt-2">
                {m.type} · {m.size} · {m.date}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                <span className="text-[0.65rem] text-slate-400 font-medium">Published by {m.publishedBy}</span>
                <button
                  onClick={() => onOpen(m)}
                  className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-1.5 rounded-full"
                >
                  View
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-sm text-slate-400">No materials match “{q}”.</div>}
        </div>
      </div>
    </div>
  )
}

/* ── View 3: Material detail ── */
function MaterialDetail({ subject, material, onBack }) {
  const t = TINT[LIBRARY[subject].tint]
  const [pushItem, setPushItem] = useState(null) // item being pushed

  return (
    <div className="space-y-6">
      <header>
        <button onClick={onBack} className="text-sm font-semibold text-orange-600 hover:text-orange-700 mb-2">
          <i className="fa-solid fa-arrow-left mr-1.5" /> {LIBRARY[subject].name}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{material.title}</h1>
          <span className={`text-[0.65rem] font-bold px-2.5 py-1 rounded-full ${t.bg} ${t.text}`}>{material.subject}</span>
          <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{material.grade}</span>
          <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{material.board}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          <i className="fa-solid fa-circle-info mr-1" />
          Class notes, worksheets, assignments & quizzes can be pushed to students. Lesson plans stay mentor-only.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Items */}
        <div className="lg:col-span-7 space-y-3">
          {material.items.map((it) => {
            const pushable = PUSHABLE_KINDS.includes(it.kind)
            return (
              <div key={it.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                <span className={`w-11 h-11 rounded-xl ${t.bg} ${t.text} flex items-center justify-center text-lg shrink-0`}>
                  <i className={it.kind === 'quiz' ? 'fa-solid fa-circle-question' : 'fa-solid fa-file-pdf'} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 truncate">{it.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full ${KIND_BADGE[it.kind]}`}>
                      {KIND_LABEL[it.kind]}
                    </span>
                    <span className="text-[0.65rem] text-slate-400 font-medium">{it.type} · {it.size} · {it.date}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full shrink-0">
                  <i className="fa-solid fa-eye mr-1" /> View
                </button>
                {pushable ? (
                  <button
                    onClick={() => setPushItem(it)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full shrink-0"
                  >
                    <i className="fa-solid fa-share mr-1" /> Push
                  </button>
                ) : (
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-slate-50 rounded-full shrink-0" title="Lesson plans can't be pushed to students">
                    <i className="fa-solid fa-lock mr-1" /> Mentor only
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Notes & Comments */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3">Notes & Comments</h3>
            {material.notes.length === 0 ? (
              <p className="text-sm text-slate-400">No notes yet. Be the first to comment.</p>
            ) : (
              <div className="space-y-3">
                {material.notes.map((n, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {n.from[0]}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{n.from}</span>
                      <span className="text-[0.6rem] font-semibold text-orange-400">{n.role}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <input
                placeholder="Add a comment…"
                className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-sm outline-none focus:bg-orange-50/60"
              />
              <button className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm">
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {pushItem && <PushModal item={pushItem} onClose={() => setPushItem(null)} />}
    </div>
  )
}

function PushModal({ item, onClose }) {
  const [picked, setPicked] = useState([])
  const [done, setDone] = useState(false)

  function toggle(name) {
    setPicked((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-lg">
            <i className="fa-solid fa-share" />
          </span>
          <div className="min-w-0">
            <div className="font-bold text-slate-800">Push to students</div>
            <div className="text-xs text-slate-400 truncate">{item.name}</div>
          </div>
          <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {done ? (
          <div className="rounded-2xl bg-emerald-50 text-emerald-700 p-6 text-center font-semibold">
            <i className="fa-solid fa-circle-check text-2xl mb-2 block" />
            Pushed to {picked.length} student{picked.length > 1 ? 's' : ''}’ library!
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-3">Select who receives this in their library / journey</p>
            <div className="flex flex-wrap gap-2">
              {LIBRARY_STUDENTS.map((name) => {
                const on = picked.includes(name)
                return (
                  <button
                    key={name}
                    onClick={() => toggle(name)}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      on ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    {on && <i className="fa-solid fa-check mr-1.5" />}
                    {name}
                  </button>
                )
              })}
            </div>
            <button
              disabled={picked.length === 0}
              onClick={() => {
                setDone(true)
                setTimeout(onClose, 900)
              }}
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white text-sm font-bold py-2.5 rounded-full shadow-sm shadow-orange-100"
            >
              <i className="fa-solid fa-paper-plane mr-2" /> Push to {picked.length || ''} student{picked.length === 1 ? '' : 's'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
