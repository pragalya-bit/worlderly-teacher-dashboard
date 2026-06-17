import { useState } from 'react'
import { COACH } from '../data.js'
import { Avatar, avatarUrl } from './Avatar.jsx'

export function Settings() {
  const [panel, setPanel] = useState('profile')
  const [editing, setEditing] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your mentor profile</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm">
          {[
            { id: 'profile', icon: 'fa-solid fa-user', label: "Mentor's Profile" },
            { id: 'notifications', icon: 'fa-solid fa-bell', label: 'Notifications' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPanel(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                panel === p.id ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <i className={`${p.icon} w-5 text-center`} />
              {p.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          {panel === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Mentor's Profile</h2>
                <button
                  onClick={() => setEditing((v) => !v)}
                  className={`text-sm font-bold px-5 py-2 rounded-full transition-colors ${
                    editing
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-100'
                      : 'border border-orange-300 text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <i className={`fa-solid ${editing ? 'fa-check' : 'fa-pen'} mr-2`} />
                  {editing ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Avatar src={avatarUrl(COACH.name)} initial={COACH.initial} color="bg-orange-600" className="w-16 h-16 rounded-2xl text-2xl" />
                {editing && (
                  <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                    <i className="fa-solid fa-camera mr-1.5" /> Change photo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" value={COACH.name} editing={editing} />
                <Field label="Title" value={COACH.title} editing={editing} />
                <Field label="Email" value={COACH.email} editing={editing} />
                <Field label="Phone" value={COACH.phone} editing={editing} />
                <Field label="Experience" value={COACH.experience} editing={editing} />
                <Field label="Specialisation" value={COACH.experienceDetail} editing={editing} />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Subjects</label>
                <div className="flex gap-2">
                  {COACH.subjects.map((s) => (
                    <span key={s} className="text-sm font-semibold bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <h3 className="text-sm font-bold text-slate-700 mt-6 mb-3">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FileField label="Resume" file={COACH.resume} icon="fa-solid fa-file-lines" editing={editing} />
                <FileField label="ID proof" file={COACH.idProof} icon="fa-solid fa-id-card" editing={editing} />
              </div>
            </div>
          )}

          {panel === 'notifications' && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-5">Notifications</h2>
              <div className="space-y-2">
                {[
                  'New checkpoint submissions',
                  'Class reminders (15 min before)',
                  'Messages from students & parents',
                  'Monthly payout summary',
                ].map((n, i) => (
                  <Toggle key={n} label={n} defaultOn={i !== 3} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, editing }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {editing ? (
        <input
          defaultValue={value}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300"
        />
      ) : (
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">{value}</div>
      )}
    </div>
  )
}

function FileField({ label, file, icon, editing }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
        <span className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
          <i className={icon} />
        </span>
        <span className="text-sm font-semibold text-slate-700 truncate flex-1">{file}</span>
        {editing ? (
          <button className="text-xs font-bold text-orange-600 hover:text-orange-700 shrink-0">
            <i className="fa-solid fa-upload mr-1" /> Replace
          </button>
        ) : (
          <button className="text-xs font-bold text-slate-400 hover:text-slate-600 shrink-0">
            <i className="fa-solid fa-eye" />
          </button>
        )}
      </div>
    </div>
  )
}

function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
    >
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`w-10 h-6 rounded-full flex items-center transition-colors ${on ? 'bg-orange-500 justify-end' : 'bg-slate-200 justify-start'} px-0.5`}>
        <span className="w-5 h-5 rounded-full bg-white shadow" />
      </span>
    </button>
  )
}
