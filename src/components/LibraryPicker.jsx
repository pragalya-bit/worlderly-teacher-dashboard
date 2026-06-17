import { useMemo, useState } from 'react'
import { LIBRARY, PUSHABLE_KINDS, KIND_LABEL } from '../data.js'

const KIND_BADGE = {
  classnotes: 'bg-amber-50 text-amber-600',
  worksheet: 'bg-sky-50 text-sky-600',
  assignment: 'bg-orange-50 text-orange-600',
  quiz: 'bg-purple-50 text-purple-600',
}

// Flatten every pushable item across the library, with its material context.
function flattenLibrary() {
  const out = []
  Object.values(LIBRARY).forEach((subject) => {
    subject.materials.forEach((m) => {
      m.items.forEach((it) => {
        if (PUSHABLE_KINDS.includes(it.kind)) {
          out.push({ ...it, subject: subject.name, material: m.title, grade: m.grade, board: m.board })
        }
      })
    })
  })
  return out
}

// In-context library picker — same content as the Worlderly Library, used to
// select an item to push into a journey / to a student. `kind` filters the list.
export function LibraryPicker({ kind, title, onSelect, onClose }) {
  const all = useMemo(flattenLibrary, [])
  const [q, setQ] = useState('')
  const list = all.filter(
    (it) =>
      (!kind || it.kind === kind) &&
      (it.name.toLowerCase().includes(q.toLowerCase()) || it.material.toLowerCase().includes(q.toLowerCase())),
  )

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-5 border-b border-slate-50">
          <span className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-lg">
            <i className="fa-solid fa-book-open" />
          </span>
          <div className="min-w-0">
            <div className="font-bold text-slate-800">{title || 'Worlderly Library'}</div>
            <div className="text-xs text-slate-400">
              {kind ? `Pick a ${KIND_LABEL[kind].toLowerCase()} to push` : 'Pick an item to push'}
            </div>
          </div>
          <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-50">
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2.5">
            <i className="fa-solid fa-magnifying-glass text-slate-300" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search library…"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-2">
          {list.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No items found.</p>}
          {list.map((it) => (
            <button
              key={it.id}
              onClick={() => onSelect(it)}
              className="w-full text-left flex items-center gap-3 rounded-2xl border border-slate-100 p-3 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                <i className={it.kind === 'quiz' ? 'fa-solid fa-circle-question' : 'fa-solid fa-file-pdf'} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800 truncate">{it.name}</span>
                <span className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full ${KIND_BADGE[it.kind]}`}>
                    {KIND_LABEL[it.kind]}
                  </span>
                  <span className="text-[0.65rem] text-slate-400 truncate">{it.material} · {it.subject}</span>
                </span>
              </span>
              <span className="text-xs font-bold text-orange-600 shrink-0">
                Select <i className="fa-solid fa-chevron-right ml-1 text-[0.6rem]" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
