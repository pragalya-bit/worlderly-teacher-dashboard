import { useState } from 'react'
import { MESSAGE_GROUPS, QUICK_EMOJIS } from '../data.js'

export function Messages() {
  const [activeId, setActiveId] = useState(MESSAGE_GROUPS[2].id)
  // thread state keyed by group id so each chat keeps its own messages
  const [threads, setThreads] = useState(() =>
    Object.fromEntries(MESSAGE_GROUPS.map((g) => [g.id, g.messages])),
  )
  const [draft, setDraft] = useState('')
  const [recording, setRecording] = useState(false)

  const active = MESSAGE_GROUPS.find((g) => g.id === activeId)
  const thread = threads[activeId]
  const readOnly = active.announcement

  function append(text) {
    if (!text.trim()) return
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId], { id: prev[activeId].length + 1, from: 'Teacher', me: true, text, time: 'now' }],
    }))
    setDraft('')
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your Worlderly group chats</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Group list */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-2 shadow-sm">
          {MESSAGE_GROUPS.map((g) => {
            const isActive = g.id === activeId
            return (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                  isActive ? 'bg-orange-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`w-11 h-11 rounded-2xl ${g.color} text-white flex items-center justify-center font-bold shrink-0`}>
                  {g.announcement ? <i className="fa-solid fa-bullhorn text-sm" /> : g.initial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-800 truncate">{g.name}</span>
                    <span className="text-[0.65rem] text-slate-400 font-medium shrink-0">{g.time}</span>
                  </span>
                  <span className="block text-[0.65rem] text-orange-400 font-semibold truncate">
                    {g.members.join(' · ')}
                  </span>
                  <span className="block text-xs text-slate-500 truncate">{g.preview}</span>
                </span>
                {g.unread > 0 && (
                  <span className="shrink-0 bg-orange-500 text-white text-[0.6rem] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {g.unread}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Active thread */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center gap-3 p-4 border-b border-slate-50">
            <span className={`w-10 h-10 rounded-2xl ${active.color} text-white flex items-center justify-center font-bold`}>
              {active.announcement ? <i className="fa-solid fa-bullhorn text-sm" /> : active.initial}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 truncate">{active.name}</div>
              <div className="text-xs text-orange-400 font-semibold truncate">{active.members.join(' · ')}</div>
            </div>
            {!readOnly && (
              <button className="ml-auto w-9 h-9 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors" title="Start a call">
                <i className="fa-solid fa-video" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {thread.map((m) => (
              <div key={m.id} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${m.me ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!m.me && <span className="text-[0.6rem] font-bold text-slate-400 mb-0.5 ml-1">{m.from}</span>}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      m.me ? 'bg-orange-500 text-white rounded-br-md' : 'bg-slate-100 text-slate-700 rounded-bl-md'
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-[0.6rem] mt-1 ${m.me ? 'text-white/70' : 'text-slate-400'}`}>{m.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {readOnly ? (
            <div className="p-4 border-t border-slate-50 text-center text-xs text-slate-400 font-medium">
              <i className="fa-solid fa-lock mr-1.5" /> Announcements channel · read only
            </div>
          ) : (
            <Composer
              draft={draft}
              setDraft={setDraft}
              onSend={() => append(draft)}
              onEmoji={(e) => setDraft((d) => (d ? `${d} ${e}` : e))}
              recording={recording}
              setRecording={setRecording}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Composer({ draft, setDraft, onSend, onEmoji, recording, setRecording }) {
  return (
    <div className="border-t border-slate-50 p-3">
      {/* Quick reaction emojis with hover descriptions */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {QUICK_EMOJIS.map((q) => (
          <button
            key={q.e}
            onClick={() => onEmoji(q.e)}
            title={q.desc}
            className="group relative w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors text-base"
          >
            {q.e}
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[0.6rem] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {q.desc}
            </span>
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSend()
        }}
        className="flex items-center gap-2"
      >
        <button type="button" title="Emoji" className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 shrink-0">
          <i className="fa-regular fa-face-smile" />
        </button>
        <button type="button" title="Attach file" className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 shrink-0">
          <i className="fa-solid fa-paperclip" />
        </button>
        <button
          type="button"
          title={recording ? 'Stop recording' : 'Record voice message'}
          onClick={() => setRecording((v) => !v)}
          className={`w-10 h-10 rounded-full shrink-0 transition-colors ${
            recording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
          }`}
        >
          <i className="fa-solid fa-microphone" />
        </button>

        {recording ? (
          <div className="flex-1 flex items-center gap-2 bg-rose-50 rounded-full px-4 py-2.5 text-sm text-rose-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Recording… tap mic to stop
          </div>
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message…"
            className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 text-sm outline-none focus:bg-orange-50/60 placeholder:text-slate-400"
          />
        )}

        <button
          type="submit"
          className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-white shrink-0 shadow-sm shadow-orange-100"
        >
          <i className="fa-solid fa-paper-plane" />
        </button>
      </form>
    </div>
  )
}
