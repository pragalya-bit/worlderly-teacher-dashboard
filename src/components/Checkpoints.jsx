import { useState } from 'react'
import { SUBMISSIONS } from '../data.js'
import { Avatar, avatarUrl } from './Avatar.jsx'

const KIND_ICON = {
  Assignment: 'fa-solid fa-pen-to-square',
  Worksheet: 'fa-solid fa-file-lines',
  Quiz: 'fa-solid fa-circle-question',
}

export function Checkpoints() {
  const [subs, setSubs] = useState(SUBMISSIONS)
  const [tab, setTab] = useState('pending')
  const [selectedId, setSelectedId] = useState(SUBMISSIONS.find((s) => s.status === 'pending')?.id)
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState('')

  const visible = subs.filter((s) => s.status === tab)
  const selected = subs.find((s) => s.id === selectedId)
  const pendingCount = subs.filter((s) => s.status === 'pending').length

  function grade() {
    setSubs((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, status: 'graded', score: score ? Number(score) : s.score } : s)),
    )
    setFeedback('')
    setScore('')
    const nextPending = subs.find((s) => s.status === 'pending' && s.id !== selectedId)
    setSelectedId(nextPending?.id)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkpoints</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {pendingCount} submissions waiting for your feedback
        </p>
      </header>

      <div className="flex gap-2">
        {[
          { id: 'pending', label: `To review (${subs.filter((s) => s.status === 'pending').length})` },
          { id: 'graded', label: `Graded (${subs.filter((s) => s.status === 'graded').length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
              tab === t.id ? 'bg-orange-500 text-white shadow-sm shadow-orange-100' : 'bg-white border border-slate-100 text-slate-500 hover:text-orange-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-5 space-y-3">
          {visible.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center text-slate-400 shadow-sm">
              <i className="fa-solid fa-circle-check text-3xl text-emerald-300 mb-2 block" />
              <p className="font-semibold">All caught up!</p>
            </div>
          )}
          {visible.map((s) => {
            const active = s.id === selectedId
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left bg-white border rounded-3xl p-4 shadow-sm transition-all flex items-center gap-3 ${
                  active ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-100 hover:border-orange-200'
                }`}
              >
                <Avatar src={avatarUrl(s.student)} initial={s.initial} color={s.color} className="w-11 h-11 rounded-2xl" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-800 truncate">{s.student}</span>
                  <span className="block text-xs text-slate-500 truncate">
                    <i className={`${KIND_ICON[s.kind]} mr-1 text-orange-400`} />
                    {s.kind} · {s.topic}
                  </span>
                </span>
                <span className="text-right shrink-0">
                  {s.kind === 'Quiz' && s.score != null ? (
                    <span className="block text-sm font-extrabold text-slate-800">{s.score}%</span>
                  ) : null}
                  <span className="block text-[0.65rem] text-slate-400 font-medium">{s.submitted}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Review pane */}
        <div className="lg:col-span-7">
          {selected ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-50">
                <Avatar src={avatarUrl(selected.student)} initial={selected.initial} color={selected.color} className="w-12 h-12 rounded-2xl text-lg" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-800">{selected.student}</div>
                  <div className="text-xs text-slate-400 font-medium">
                    {selected.subject} · submitted {selected.submitted}
                  </div>
                </div>
                <span className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-600">
                  <i className={`${KIND_ICON[selected.kind]} mr-1.5`} />
                  {selected.kind}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-5">{selected.topic}</h3>

              {/* Faux submission preview */}
              <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-5 text-sm text-slate-500 space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <i className="fa-solid fa-paperclip" /> {selected.student.split(' ')[0]}_submission.pdf
                </div>
                <div className="h-2 rounded bg-slate-200 w-5/6" />
                <div className="h-2 rounded bg-slate-200 w-4/6" />
                <div className="h-2 rounded bg-slate-200 w-3/6" />
                <button className="mt-2 text-orange-600 font-semibold hover:text-orange-700">
                  <i className="fa-solid fa-up-right-from-square mr-1.5" /> Open in viewer
                </button>
              </div>

              {selected.status === 'graded' ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 text-emerald-700 p-4 text-sm font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-circle-check" /> Graded{selected.score != null ? ` · ${selected.score}%` : ''} · feedback sent
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Score</label>
                    <div className="flex items-center gap-2">
                      <input
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        placeholder={selected.score != null ? String(selected.score) : '0'}
                        className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-orange-300"
                      />
                      <span className="text-sm text-slate-400 font-semibold">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Feedback for {selected.student.split(' ')[0]}</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      placeholder="Great effort! Here's what to focus on next…"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300 resize-none"
                    />
                  </div>
                  <button
                    onClick={grade}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
                  >
                    <i className="fa-solid fa-paper-plane" /> Send feedback & mark graded
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center text-slate-400 shadow-sm">
              <i className="fa-solid fa-clipboard-check text-3xl text-orange-200 mb-2 block" />
              <p className="font-semibold">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
