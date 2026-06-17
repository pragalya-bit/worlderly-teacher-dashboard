import { useState } from 'react'
import { QUICK_EMOJIS } from '../data.js'
import { Avatar, avatarUrl } from './Avatar.jsx'

// Lightweight "message a student" modal, reused by the live class card and the
// student roster. Includes quick-reaction emojis, attachment & voice buttons.
export function SendMessageModal({ to, color = 'bg-orange-500', initial, onClose }) {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  function send() {
    if (!text.trim()) return
    setSent(true)
    setTimeout(onClose, 900)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={avatarUrl(to)} initial={initial || to[0]} color={color} className="w-11 h-11 rounded-full" />
          <div className="min-w-0">
            <div className="font-bold text-slate-800">Message {to}</div>
            <div className="text-xs text-orange-400 font-semibold">Direct message · Worlderly</div>
          </div>
          <button onClick={onClose} className="ml-auto w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-emerald-50 text-emerald-700 p-6 text-center font-semibold">
            <i className="fa-solid fa-paper-plane text-2xl mb-2 block" /> Message sent to {to}!
          </div>
        ) : (
          <>
            {/* Quick reactions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_EMOJIS.map((q) => (
                <button
                  key={q.e}
                  title={q.desc}
                  onClick={() => setText((t) => (t ? `${t} ${q.e}` : q.e))}
                  className="group relative w-9 h-9 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors text-lg"
                >
                  {q.e}
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[0.65rem] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {q.desc}
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              autoFocus
              placeholder={`Write a message to ${to.split(' ')[0]}…`}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300 resize-none"
            />

            <div className="flex items-center gap-2 mt-3">
              <button title="Emoji" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500">
                <i className="fa-regular fa-face-smile" />
              </button>
              <button title="Attach file" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500">
                <i className="fa-solid fa-paperclip" />
              </button>
              <button title="Voice message" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500">
                <i className="fa-solid fa-microphone" />
              </button>
              <button
                onClick={send}
                className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-orange-100"
              >
                <i className="fa-solid fa-paper-plane" /> Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
