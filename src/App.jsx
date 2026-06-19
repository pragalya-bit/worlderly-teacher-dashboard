import { useState } from 'react'
import { Sidebar, NAV_ITEMS } from './components/Sidebar.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { Schedule } from './components/Schedule.jsx'
import { Availability } from './components/Availability.jsx'
import { Students } from './components/Students.jsx'
import { Checkpoints } from './components/Checkpoints.jsx'
import { Library } from './components/Library.jsx'
import { Training } from './components/Training.jsx'
import { Messages } from './components/Messages.jsx'
import { Earnings } from './components/Earnings.jsx'
import { Settings } from './components/Settings.jsx'
import { COACH, TODAY } from './data.js'
import { Avatar, avatarUrl } from './components/Avatar.jsx'

const PANELS = {
  dashboard: Dashboard,
  schedule: Schedule,
  availability: Availability,
  students: Students,
  checkpoints: Checkpoints,
  library: Library,
  training: Training,
  messages: Messages,
  earnings: Earnings,
  settings: Settings,
}

// Bottom nav on mobile shows the 5 most-used destinations.
const MOBILE_ITEMS = NAV_ITEMS.filter((i) =>
  ['dashboard', 'schedule', 'students', 'checkpoints', 'messages'].includes(i.id),
)

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const Panel = PANELS[activeTab]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FDF8F4] text-slate-800">
      <Sidebar activeTab={activeTab} onSelect={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <Panel onSelect={setActiveTab} />
          </div>
        </main>
      </div>

      <MobileNav activeTab={activeTab} onSelect={setActiveTab} />
    </div>
  )
}

function TopBar() {
  return (
    <header className="h-16 shrink-0 bg-white/80 backdrop-blur border-b border-orange-100 flex items-center gap-4 px-5 md:px-8">
      <div className="md:hidden text-xl font-black text-orange-600">Worlderly</div>

      <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium">
        <i className="fa-solid fa-calendar-day text-orange-400" />
        <span>{TODAY.label}</span>
      </div>

      <div className="hidden lg:flex items-center ml-6 flex-1 max-w-sm">
        <div className="w-full flex items-center gap-2 bg-orange-50/70 rounded-full px-4 py-2">
          <i className="fa-solid fa-magnifying-glass text-orange-300 text-sm" />
          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-orange-300/80 text-slate-600"
            placeholder="Search students, classes…"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          className="relative w-10 h-10 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors flex items-center justify-center"
          title="Notifications"
        >
          <i className="fa-solid fa-bell" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>
        <Avatar photo="/kids/mentor.jpg" src={avatarUrl(COACH.name)} initial={COACH.initial} color="bg-orange-600" className="w-9 h-9 rounded-full text-sm" />
      </div>
    </header>
  )
}

function MobileNav({ activeTab, onSelect }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-orange-100 flex justify-around px-1 py-2">
      {MOBILE_ITEMS.map(({ id, icon, label, badge }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[0.65rem] font-semibold transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-400'
            }`}
          >
            <i className={`${icon} text-lg`} />
            <span>{label}</span>
            {badge ? (
              <span className="absolute top-0 right-1 bg-orange-500 text-white text-[0.55rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {badge}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
