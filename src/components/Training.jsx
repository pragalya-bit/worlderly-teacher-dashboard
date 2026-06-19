import { useState } from 'react'
import { TRAINING, TRAINING_TINT } from '../data.js'

// Board logo (from public/boards/) with graceful fallback to the FA icon.
function BoardLogo({ board, box, iconText }) {
  const [err, setErr] = useState(false)
  const t = TRAINING_TINT[board.tint]
  if (board.logo && !err) {
    return (
      <span className={`${box} rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shrink-0`}>
        <img src={board.logo} alt={board.name} onError={() => setErr(true)} className="max-w-full max-h-full object-contain" />
      </span>
    )
  }
  return (
    <span className={`${box} rounded-2xl ${t.bg} ${t.text} ${iconText} flex items-center justify-center shrink-0`}>
      <i className={board.icon} />
    </span>
  )
}

export function Training() {
  const [openId, setOpenId] = useState(null)
  // completed module ids per board: { [boardId]: string[] }
  const [completed, setCompleted] = useState({})

  const pctOf = (b) => Math.round(((completed[b.id]?.length || 0) / b.modules.length) * 100)

  function markComplete(boardId, moduleId) {
    setCompleted((prev) => {
      const cur = prev[boardId] || []
      if (cur.includes(moduleId)) return prev
      return { ...prev, [boardId]: [...cur, moduleId] }
    })
  }

  if (openId) {
    const board = TRAINING.find((b) => b.id === openId)
    return (
      <CourseView
        board={board}
        done={completed[board.id] || []}
        pct={pctOf(board)}
        onBack={() => setOpenId(null)}
        onComplete={(mid) => markComplete(board.id, mid)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Teacher Training</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Master each board so every Worlderly class is taught the same way — structure, gestures & tone.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRAINING.map((b) => {
          const t = TRAINING_TINT[b.tint]
          const pct = pctOf(b)
          const done = pct === 100
          return (
            <button
              key={b.id}
              onClick={() => setOpenId(b.id)}
              className="text-left bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-end">
                <ProgressRing pct={pct} tint={t} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4">{b.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{b.board}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-500">
                  <i className="fa-solid fa-clapperboard mr-1.5 text-slate-300" />
                  {b.modules.length} modules
                </span>
                {done ? (
                  <span className="text-[0.65rem] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <i className="fa-solid fa-paper-plane mr-1" /> Sent to SME
                  </span>
                ) : pct > 0 ? (
                  <span className="text-[0.65rem] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">In progress</span>
                ) : (
                  <span className="text-[0.65rem] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">Start</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProgressRing({ pct, tint }) {
  const r = 18
  const c = 2 * Math.PI * r
  const off = c - (pct / 100) * c
  const stroke = tint.text.replace('text-', '').replace('-600', '')
  // map tailwind color name to a hex for the SVG stroke
  const HEX = { indigo: '#6366f1', orange: '#f97316', sky: '#0ea5e9', emerald: '#10b981', rose: '#f43f5e' }
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={HEX[stroke] || '#f97316'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] font-extrabold text-slate-700">
        {pct}%
      </span>
    </div>
  )
}

function CourseView({ board, done, pct, onBack, onComplete }) {
  const t = TRAINING_TINT[board.tint]
  const firstIncomplete = board.modules.find((m) => !done.includes(m.id)) || board.modules[0]
  const [currentId, setCurrentId] = useState(firstIncomplete.id)
  const current = board.modules.find((m) => m.id === currentId)
  const idx = board.modules.findIndex((m) => m.id === currentId)
  const isDone = done.includes(current.id)

  function completeAndAdvance() {
    onComplete(current.id)
    const next = board.modules[idx + 1]
    if (next) setCurrentId(next.id)
  }

  return (
    <div className="space-y-6">
      <header>
        <button onClick={onBack} className="text-sm font-semibold text-orange-600 hover:text-orange-700 mb-2">
          <i className="fa-solid fa-arrow-left mr-1.5" /> Teacher Training
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{board.name}</h1>
            <p className="text-xs text-slate-400 font-medium">{board.board}</p>
          </div>
          {pct === 100 && (
            <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-circle-check mr-1.5" /> Certified · sent to SME
            </span>
          )}
        </div>

        {/* progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>{done.length} of {board.modules.length} modules complete</span>
            <span className={t.text}>{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${t.grad}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${t.grad} aspect-video flex items-center justify-center shadow-md`}>
            <div className="absolute inset-0 bg-black/10" />
            <button className="relative w-16 h-16 rounded-full bg-white/90 text-slate-800 flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform">
              <i className="fa-solid fa-play ml-1" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[0.65rem] font-bold px-2 py-1 rounded-md">
              {current.dur}
            </span>
            <span className="absolute top-3 left-3 bg-white/20 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full">
              Module {idx + 1} of {board.modules.length}
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">{current.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{current.desc}</p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {isDone ? (
                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-bold px-5 py-2.5 rounded-full">
                  <i className="fa-solid fa-circle-check" /> Completed
                </span>
              ) : (
                <button
                  onClick={completeAndAdvance}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
                >
                  <i className="fa-solid fa-check" /> Mark complete
                </button>
              )}
              {board.modules[idx + 1] && (
                <button
                  onClick={() => setCurrentId(board.modules[idx + 1].id)}
                  className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors text-sm font-bold px-5 py-2.5 rounded-full"
                >
                  Next module <i className="fa-solid fa-arrow-right" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 px-2 pt-1 pb-3">Course content</h3>
          <div className="space-y-1">
            {board.modules.map((m, i) => {
              const mDone = done.includes(m.id)
              const active = m.id === currentId
              return (
                <button
                  key={m.id}
                  onClick={() => setCurrentId(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
                    active ? 'bg-orange-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      mDone ? 'bg-emerald-500 text-white' : active ? `${t.solid} text-white` : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {mDone ? <i className="fa-solid fa-check" /> : active ? <i className="fa-solid fa-play text-[0.6rem] ml-0.5" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-800 truncate">{m.title}</span>
                    <span className="block text-[0.65rem] text-slate-400 font-medium">
                      <i className="fa-solid fa-clapperboard mr-1" />
                      Video · {m.dur}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
