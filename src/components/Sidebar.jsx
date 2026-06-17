import { COACH } from '../data.js'
import { Avatar, avatarUrl } from './Avatar.jsx'

export const NAV_ITEMS = [
  { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Today' },
  { id: 'schedule', icon: 'fa-solid fa-calendar-days', label: 'Schedule' },
  { id: 'availability', icon: 'fa-solid fa-calendar-check', label: 'Availability' },
  { id: 'students', icon: 'fa-solid fa-user-group', label: 'My Students' },
  { id: 'checkpoints', icon: 'fa-solid fa-clipboard-check', label: 'Checkpoints', badge: 4 },
  { id: 'library', icon: 'fa-solid fa-book-open', label: 'Worlderly Library' },
  { id: 'messages', icon: 'fa-solid fa-comment-dots', label: 'Messages', badge: 3 },
  { id: 'earnings', icon: 'fa-solid fa-wallet', label: 'Earnings' },
  { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' },
]

export function Sidebar({ activeTab, onSelect }) {
  return (
    <aside className="hidden md:flex w-60 lg:w-64 h-full bg-white border-r border-orange-100 flex-col justify-between p-5 shrink-0 z-10">
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl font-black text-orange-600 tracking-wide">Worlderly</span>
        </div>
        <div className="text-[0.65rem] font-bold tracking-[0.2em] text-orange-300 uppercase text-center mb-6">
          Mentor Studio
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ id, icon, label, badge }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className={
                  isActive
                    ? 'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-orange-500 text-white shadow-md shadow-orange-100'
                    : 'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 transition-all hover:bg-orange-50 hover:text-orange-600'
                }
              >
                <i className={`${icon} text-base w-5 text-center`} />
                <span>{label}</span>
                {badge ? (
                  <span
                    className={`ml-auto text-[0.65rem] font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center ${
                      isActive ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-3 border-t border-slate-100 pt-4">
        <Avatar src={avatarUrl(COACH.name)} initial={COACH.initial} color="bg-orange-600" className="w-10 h-10 rounded-full text-base" />
        <div className="min-w-0">
          <div className="font-bold text-sm text-slate-800 truncate">Ms. {COACH.name.split(' ')[0]}</div>
          <div className="text-xs text-slate-400 font-medium truncate">{COACH.title}</div>
        </div>
      </div>
    </aside>
  )
}
