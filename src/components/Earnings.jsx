import { EARNINGS as E } from '../data.js'

export function Earnings() {
  const max = Math.max(...E.history.map((h) => h.amount))
  const fmt = (n) => `${E.currency}${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Earnings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Paid monthly for every completed class · next payout {E.paidOn}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Hero balance */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl p-6 text-white shadow-md bg-gradient-to-br from-orange-500 to-orange-600">
          <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-sm font-semibold text-white/85">Earnings · {E.month}</div>
            <div className="text-4xl font-extrabold mt-1">{fmt(E.total)}</div>
            <div className="text-sm text-white/85 mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1.5" />
              Projected {fmt(E.projected)} at current pace
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-white/15 p-3">
                <div className="text-xl font-extrabold">{E.classesCompleted}</div>
                <div className="text-xs text-white/80 font-semibold">Classes completed</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-3">
                <div className="text-xl font-extrabold">{fmt(E.perClass)}</div>
                <div className="text-xs text-white/80 font-semibold">Per class</div>
              </div>
            </div>

            <button className="mt-6 w-full bg-white text-orange-600 font-bold text-sm py-3 rounded-full hover:bg-orange-50 transition-colors">
              <i className="fa-solid fa-file-invoice mr-2" /> Download statement
            </button>
          </div>
        </div>

        {/* History chart */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Last 6 months</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <i className="fa-solid fa-arrow-up mr-1" /> +26% vs Jan
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 md:gap-4 h-48">
            {E.history.map((h) => {
              const hPct = 15 + (h.amount / max) * 80
              const isCurrent = h.month === 'Jun'
              return (
                <div key={h.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[0.6rem] font-bold text-slate-500">{fmt(h.amount)}</span>
                  <div
                    className={`w-full rounded-xl ${isCurrent ? 'bg-gradient-to-t from-orange-500 to-orange-400' : 'bg-orange-100'}`}
                    style={{ height: `${hPct}%` }}
                  />
                  <span className={`text-xs font-bold ${isCurrent ? 'text-orange-600' : 'text-slate-400'}`}>{h.month}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-50 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-sm font-extrabold text-slate-800">{fmt(E.total - E.bonus)}</div>
              <div className="text-[0.65rem] text-slate-400 font-semibold uppercase">Base pay</div>
            </div>
            <div>
              <div className="text-sm font-extrabold text-emerald-600">+{fmt(E.bonus)}</div>
              <div className="text-[0.65rem] text-slate-400 font-semibold uppercase">Rating bonus</div>
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-800">{E.paidOn}</div>
              <div className="text-[0.65rem] text-slate-400 font-semibold uppercase">Payout date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
