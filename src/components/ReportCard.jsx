import { useState } from 'react'
import {
  FEEDBACK_TAGS, REPORT_BADGES, CLASS_QUESTIONS, classSessionsFor, reportRecordsFor,
  PERFORMANCE_LEVELS, STRATEGY_PHASES, defaultPerformance,
} from '../data.js'
import { Avatar, avatarUrl } from './Avatar.jsx'

const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Per-student report card, styled like the student app "My Portfolio" page.
export function ReportCard({ student, onClose }) {
  const records = reportRecordsFor(student)

  const [tags, setTags] = useState(['Focused', 'Improving'])
  const [customTag, setCustomTag] = useState('')
  const [sessions, setSessions] = useState(() => classSessionsFor(student))
  const [selDay, setSelDay] = useState(() => classSessionsFor(student).slice(-1)[0].day)
  const [recording, setRecording] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sent, setSent] = useState(false)

  // Strategy & Roadmap state
  const [perf, setPerf] = useState(() => defaultPerformance(student))
  const [gaps, setGaps] = useState(['Weak Broad Foundations'])
  const [phaseTags, setPhaseTags] = useState({ immediate: [], core: [], midterm: [], examprep: [] })
  const [phaseFocus, setPhaseFocus] = useState({})

  const addPhaseTag = (id, t) => setPhaseTags((p) => ({ ...p, [id]: [...p[id], t] }))
  const removePhaseTag = (id, t) => setPhaseTags((p) => ({ ...p, [id]: p[id].filter((x) => x !== t) }))

  const selected = sessions.find((s) => s.day === selDay)

  function toggleTag(t) {
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))
  }
  function addCustom() {
    const t = customTag.trim()
    if (t && !tags.includes(t)) setTags((p) => [...p, t])
    setCustomTag('')
  }
  function recordForSelected() {
    if (!recording) {
      setRecording(true)
      return
    }
    setRecording(false)
    setSessions((p) =>
      p.map((s) =>
        s.day !== selDay
          ? s
          : { ...s, rec: true, recordings: [{ id: `${student.id}-${s.day}-new`, label: `After Class · ${s.topic}`, dur: '0:21', date: s.date }, ...s.recordings] },
      ),
    )
  }

  // June 2026 calendar
  const firstDow = new Date(2026, 5, 1).getDay()
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)]
  const sessionByDay = Object.fromEntries(sessions.map((s) => [s.day, s]))

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#FDF8F4] w-full max-w-3xl max-h-[92vh] flex flex-col rounded-[2rem] shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200/70 bg-white rounded-t-[2rem]">
          <i className="fa-solid fa-id-card text-orange-500 text-lg" />
          <h2 className="font-bold text-slate-800">Report Card</h2>
          {saved && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Saved ✓</span>}
          <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          {/* Profile header */}
          <section className="relative overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="absolute -top-16 -left-12 w-48 h-48 bg-fuchsia-400 rounded-full blur-[70px] opacity-20" />
            <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-amber-400 rounded-full blur-[70px] opacity-20" />
            <div className="relative z-10 rounded-full p-1 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 shadow-lg">
              <Avatar src={avatarUrl(student.name)} initial={student.initial} color={student.color} className="w-24 h-24 rounded-full border-4 border-white" />
            </div>
            <div className="relative z-10 text-center sm:text-left">
              <h1 className="text-2xl font-black text-slate-900">{student.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 text-xs font-semibold">
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full">{student.grade}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{student.subject}</span>
                <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  <i className="fa-solid fa-fire" /> {student.streak}-day streak
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  <i className="fa-solid fa-star" /> Last quiz {student.lastQuiz}%
                </span>
              </div>
            </div>
          </section>

          {/* Feedback tags */}
          <section className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-tags text-orange-500" /> Feedback tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {FEEDBACK_TAGS.map((t) => {
                const on = tags.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      on ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                    }`}
                  >
                    {on && <i className="fa-solid fa-check mr-1.5" />}
                    {t}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                placeholder="Add your own tag…"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
              />
              <button onClick={addCustom} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold px-4 py-2 rounded-xl">
                Add
              </button>
            </div>
          </section>

          {/* Strategy & Roadmap (LEC / PTM report) */}
          <section className="rounded-[1.5rem] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#0f2a4a] text-white px-6 py-4">
              <h3 className="font-black flex items-center gap-2">
                <i className="fa-solid fa-route text-amber-300" /> {student.subject} Strategy & Roadmap
              </h3>
              <p className="text-xs text-white/70 mt-0.5">Shared with the Learning Experience Co-ordinator for the PTM</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Performance level */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Overall performance</div>
                <div className="flex flex-wrap gap-2">
                  {PERFORMANCE_LEVELS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPerf(p.id)}
                      className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                        perf === p.id ? p.chip : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identified gaps */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                <div className="text-sm font-black text-slate-800 flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-triangle-exclamation text-rose-500" /> Identified Gaps
                </div>
                <TagInput tags={gaps} onAdd={(t) => setGaps((g) => [...g, t])} onRemove={(t) => setGaps((g) => g.filter((x) => x !== t))} placeholder="Type a gap & press Enter…" tone="rose" />
              </div>

              {/* Strategic action plan */}
              <div>
                <div className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-list-check text-orange-500" /> Strategic Action Plan
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STRATEGY_PHASES.map((ph) => (
                    <div key={ph.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-1 self-stretch rounded ${ph.bar}`} />
                        <i className={`${ph.icon} ${ph.accent}`} />
                        <span className="font-bold text-slate-800 text-sm">{ph.name}</span>
                      </div>
                      <textarea
                        rows={2}
                        value={phaseFocus[ph.id] ?? ''}
                        onChange={(e) => setPhaseFocus((f) => ({ ...f, [ph.id]: e.target.value }))}
                        placeholder={ph.placeholder}
                        className="w-full text-xs rounded-xl border border-slate-200 px-2.5 py-2 outline-none focus:border-orange-300 resize-none mb-2"
                      />
                      <TagInput
                        tags={phaseTags[ph.id]}
                        onAdd={(t) => addPhaseTag(ph.id, t)}
                        onRemove={(t) => removePhaseTag(ph.id, t)}
                        placeholder="Add tag…"
                        tone="orange"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Class reflections — calendar driven */}
          <section className="rounded-[1.5rem] bg-white p-6 shadow-sm">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-calendar-day text-orange-500" /> Class reflections
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Calendar */}
              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">June 2026</div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {WD.map((d, i) => (
                    <div key={i} className="text-[0.6rem] font-bold text-slate-400 py-1">{d}</div>
                  ))}
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />
                    const sess = sessionByDay[day]
                    const isSel = day === selDay
                    return (
                      <button
                        key={i}
                        disabled={!sess}
                        onClick={() => sess && setSelDay(day)}
                        className={`relative h-9 rounded-lg text-sm font-semibold transition-colors ${
                          isSel ? 'bg-orange-500 text-white' : sess ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'text-slate-300'
                        }`}
                      >
                        {day}
                        {sess && (
                          <span
                            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                              sess.recordings.length ? 'bg-emerald-500' : 'bg-amber-500'
                            } ${isSel ? 'ring-1 ring-white' : ''}`}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[0.65rem] font-semibold text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Voice note added</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Missing</span>
                </div>
              </div>

              {/* Selected session */}
              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">
                  {selected.date} · {selected.topic}
                </div>

                {/* Recordings or reminder */}
                {selected.recordings.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selected.recordings.map((r) => (
                      <div key={r.id} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                        <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-play text-xs" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-700 truncate">{r.label}</div>
                          <div className="h-1.5 bg-orange-200 rounded-full mt-1"><div className="h-full w-1/3 bg-orange-500 rounded-full" /></div>
                        </div>
                        <span className="text-[0.6rem] text-slate-400 font-medium shrink-0">{r.dur}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-3">
                    <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <i className="fa-solid fa-triangle-exclamation" /> No voice note for this class yet
                    </div>
                    <button
                      onClick={recordForSelected}
                      className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-full ${recording ? 'bg-rose-500 text-white animate-pulse' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                    >
                      <i className="fa-solid fa-microphone mr-1.5" /> {recording ? 'Stop & save' : 'Record now'}
                    </button>
                  </div>
                )}

                {/* 4 questions + answers */}
                <div className="space-y-2">
                  {CLASS_QUESTIONS.map((q, i) => (
                    <div key={i} className="rounded-xl bg-slate-50 p-2.5">
                      <div className="text-xs font-bold text-slate-700"><span className="text-orange-500 mr-1">Q{i + 1}.</span>{q}</div>
                      <div className="text-xs text-slate-600 mt-0.5"><i className="fa-solid fa-reply text-slate-300 text-[0.6rem] mr-1.5" />{i === 2 ? `${selected.answers[i]} / 5` : selected.answers[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Badges + results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <section className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-medal text-amber-500" /> Earned badges
              </h3>
              <div className="flex flex-wrap gap-4">
                {REPORT_BADGES.map((b) => (
                  <div key={b.label} className="group relative cursor-pointer">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${b.grad} flex items-center justify-center text-2xl text-white shadow-lg border-4 border-white group-hover:scale-110 transition-transform`}>
                      <i className={b.icon} />
                    </div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[0.6rem] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {b.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-regular fa-folder-open text-purple-500" /> Assignment & quiz results
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {records.map((r) => (
                  <div key={r.title} className="min-w-[120px] rounded-2xl border border-slate-100 p-3 flex flex-col items-center gap-2 shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.grad} text-white flex items-center justify-center text-xl shadow`}>
                      <i className="fa-solid fa-file-pdf" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-700 leading-tight">{r.title}</div>
                      <div className="text-[0.65rem] text-slate-400">{r.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-slate-200/70 bg-white rounded-b-[2rem]">
          <span className="text-xs text-slate-400 font-medium">
            {sent ? 'Sent to Learning Experience Co-ordinator ✓' : saved ? 'Saved ✓' : `${tags.length} tags · ${sessions.filter((s) => s.recordings.length).length}/${sessions.length} classes with voice notes`}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSaved(true)}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors text-sm font-bold px-5 py-2.5 rounded-full"
            >
              <i className="fa-solid fa-floppy-disk" /> Save
            </button>
            <button
              onClick={() => {
                setSent(true)
                setTimeout(onClose, 1100)
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
            >
              <i className="fa-solid fa-paper-plane" /> Send to LEC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Instant tag input — typing + Enter (or comma) adds a chip immediately.
function TagInput({ tags, onAdd, onRemove, placeholder, tone = 'orange' }) {
  const [v, setV] = useState('')
  const chip =
    tone === 'rose' ? 'bg-rose-100 text-rose-700' : tone === 'sky' ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'

  function commit() {
    const t = v.replace(/,$/, '').trim()
    if (t && !tags.includes(t)) onAdd(t)
    setV('')
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <span key={t} className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${chip}`}>
          {t}
          <button onClick={() => onRemove(t)} className="opacity-60 hover:opacity-100">
            <i className="fa-solid fa-xmark text-[0.65rem]" />
          </button>
        </span>
      ))}
      <input
        value={v}
        onChange={(e) => {
          if (e.target.value.endsWith(',')) {
            setV(e.target.value)
            commit()
          } else setV(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
        }}
        onBlur={commit}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] text-xs rounded-full border border-slate-200 px-3 py-1.5 outline-none focus:border-orange-300"
      />
    </div>
  )
}
