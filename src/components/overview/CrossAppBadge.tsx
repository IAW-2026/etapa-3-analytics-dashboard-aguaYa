export default function CrossAppBadge({ apps }: { apps: string[] }) {
  const colors: Record<string, string> = {
    Buyer: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    Seller: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    Feedback: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    Delivery: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    Payments: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Cruza:
            </span>
      {apps.map((app) => (
        <span
          key={app}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colors[app] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
        >
          {app}
        </span>
      ))}
    </div>
  )
}
