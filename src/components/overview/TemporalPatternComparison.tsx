import type { TimelineEntry } from "@/lib/types"

type HourlyEntry = { hour: number; count: number }

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`
}

export default function TemporalPatternComparison({
  hourly,
  timeline,
}: {
  hourly: HourlyEntry[]
  timeline: TimelineEntry[]
}) {
  const maxHourly = Math.max(...hourly.map((h) => h.count), 1)
  const maxTimeline = Math.max(...timeline.map((t) => t.count), 1)

  const peakHour = hourly.reduce(
    (max, h) => (h.count > max.count ? h : max),
    { hour: 0, count: 0 },
  )

  const peakDay = timeline.reduce(
    (max, t) => (t.count > max.count ? t : max),
    { date: "", count: 0, revenue: 0 },
  )

  const hasData = hourly.length > 0 || timeline.length > 0

  if (!hasData) {
    return (
      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-white/30 to-slate-100/30 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/40 dark:to-slate-800/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay datos temporales disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Hourly Delivery Pattern */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Entregas por hora
          </h3>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Pico: {formatHour(peakHour.hour)} ({peakHour.count})
          </span>
        </div>
        <div className="flex items-end gap-0.5 h-24">
          {hourly.map((h) => {
            const height = (h.count / maxHourly) * 100
            const isPeak = h.hour === peakHour.hour
            return (
              <div
                key={h.hour}
                className="relative flex flex-1 flex-col items-center"
                title={`${formatHour(h.hour)}: ${h.count} entregas`}
              >
                <div
                  className={`w-full rounded-t ${isPeak ? "bg-emerald-500" : "bg-emerald-400/60 dark:bg-emerald-600/40"}`}
                  style={{ height: `${height}%`, minHeight: h.count > 0 ? "2px" : "0" }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-slate-400 dark:text-slate-500">
          <span>{formatHour(0)}</span>
          <span>{formatHour(12)}</span>
          <span>{formatHour(23)}</span>
        </div>
      </div>

      {/* Daily Order Pattern */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Órdenes por día
          </h3>
          {peakDay.date && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Pico: {peakDay.date} ({peakDay.count})
            </span>
          )}
        </div>
        <div className="flex items-end gap-0.5 h-24">
          {timeline.slice(-20).map((t) => {
            const height = (t.count / maxTimeline) * 100
            const isPeak = t.date === peakDay.date
            return (
              <div
                key={t.date}
                className="relative flex flex-1 flex-col items-center"
                title={`${t.date}: ${t.count} órdenes, $${t.revenue}`}
              >
                <div
                  className={`w-full rounded-t ${isPeak ? "bg-blue-500" : "bg-blue-400/60 dark:bg-blue-600/40"}`}
                  style={{ height: `${height}%`, minHeight: t.count > 0 ? "2px" : "0" }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-slate-400 dark:text-slate-500">
          <span>hoy</span>
          <span>hace 20 días</span>
        </div>
      </div>

      {/* Insight */}
      {peakHour.hour > 0 && peakDay.date && (
        <div className="sm:col-span-2 rounded-lg bg-slate-50/50 px-4 py-3 dark:bg-slate-800/30">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Patrón de actividad:</span>{" "}
            Las entregas se concentran a las <strong>{formatHour(peakHour.hour)}h</strong> (pico de{" "}
            {peakHour.count} entregas). El día con más órdenes registradas fue{" "}
            <strong>{peakDay.date}</strong> con {peakDay.count} órdenes.
          </p>
        </div>
      )}
    </div>
  )
}
