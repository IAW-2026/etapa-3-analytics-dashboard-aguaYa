import { Suspense } from "react"
import { Truck, Droplets, Clock, Users, Building2, Store } from "lucide-react"
import { deliveryApi } from "@/lib/delivery-api"
import DeliveryStatCard from "@/components/metrics/DeliveryStatCard"
import MetricCard from "@/components/metrics/MetricCard"
import DateFilter from "@/components/metrics/DateFilter"
import CompanyFilter from "@/components/metrics/CompanyFilter"
import DailyTrendChart from "@/components/charts/DailyTrendChart"
import HourlyBarChart from "@/components/charts/HourlyBarChart"
import DeliveryZoneBarChart from "@/components/charts/DeliveryZoneBarChart"
import DriverRankingTable from "@/components/tables/DriverRankingTable"
import CompanyComparisonTable from "@/components/tables/CompanyComparisonTable"
import { formatNumber } from "@/lib/utils"

export const metadata = { title: "Delivery - Analytics Dashboard" }

type Props = {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string; companyId?: string }>
}

export default async function DeliveryDashboard({ searchParams }: Props) {
  const params = await searchParams
  const dateFrom = params.dateFrom ?? ""
  const dateTo = params.dateTo ?? ""
  const companyId = params.companyId ?? ""

  const filterParams: Record<string, string> = {}
  if (dateFrom) filterParams.dateFrom = dateFrom
  if (dateTo) filterParams.dateTo = dateTo
  if (companyId) filterParams.empresaId = companyId
  const effectiveFilterParams = Object.keys(filterParams).length > 0 ? filterParams : undefined

  const dateOnlyParams: Record<string, string> = {}
  if (dateFrom) dateOnlyParams.dateFrom = dateFrom
  if (dateTo) dateOnlyParams.dateTo = dateTo
  const effectiveDateOnlyParams = Object.keys(dateOnlyParams).length > 0 ? dateOnlyParams : undefined

  async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try { return await fn() } catch { return fallback }
  }

  const [
    orders, bidones, zones, times, drivers, comparison,
    trend, ranking, hourly,
    vehicles, requests, blocked,
    companies, byCompany,
  ] = await Promise.all([
    safeFetch(() => deliveryApi.getStats.orders(effectiveFilterParams), { completed: 0, failed: 0 }),
    safeFetch(() => deliveryApi.getStats.bidones(effectiveFilterParams), { totalBidones: 0 }),
    safeFetch(() => deliveryApi.getStats.zones(effectiveFilterParams), { zones: {} }),
    safeFetch(() => deliveryApi.getStats.times(effectiveFilterParams), { avgMinutes: 0 }),
    safeFetch(() => deliveryApi.getStats.drivers(effectiveFilterParams), { drivers: { available: 0, total: 0 } }),
    safeFetch(() => deliveryApi.getAdvanced.comparison(effectiveFilterParams), {
      current: { ordersCompleted: 0, bidones: 0, avgMinutes: 0, availableDrivers: 0 },
      previous: { ordersCompleted: 0, bidones: 0, avgMinutes: 0, availableDrivers: 0 },
    }),
    safeFetch(() => deliveryApi.getAdvanced.dailyTrend(effectiveFilterParams), []),
    safeFetch(() => deliveryApi.getAdvanced.driverRanking(effectiveFilterParams), []),
    safeFetch(() => deliveryApi.getAdvanced.hourlyDistribution(effectiveFilterParams), []),
    safeFetch(() => deliveryApi.getStats.vehicles(effectiveFilterParams), { vehicles: { active: 0, paused: 0 } }),
    safeFetch(() => deliveryApi.getStats.requests(effectiveFilterParams), { pendingRequests: 0 }),
    safeFetch(() => deliveryApi.getStats.blocked(effectiveFilterParams), { blockedUsers: 0 }),
    safeFetch(() => deliveryApi.getCompanies(), []),
    safeFetch(() => deliveryApi.getStatsByCompany(effectiveDateOnlyParams), []),
  ]);

  function calcTrend(current: number, previous: number) {
    if (!previous || previous === 0) return undefined
    const pct = Math.round(((current - previous) / previous) * 100)
    if (pct === 0) return undefined
    return { direction: (pct > 0 ? "up" : "down") as "up" | "down", percent: Math.abs(pct) }
  }

  const trendOrders = calcTrend(comparison.current.ordersCompleted, comparison.previous.ordersCompleted)
  const trendBidones = calcTrend(comparison.current.bidones, comparison.previous.bidones)
  const trendTimes = comparison.current.avgMinutes && comparison.previous.avgMinutes
    ? calcTrend(comparison.previous.avgMinutes, comparison.current.avgMinutes)
    : undefined
  const trendDrivers = calcTrend(comparison.current.availableDrivers, comparison.previous.availableDrivers)

  const totalOrders = orders.completed + orders.failed
  const registeredCompanies = companies.length
  const activeCompanies = byCompany.filter(
    (c: { ordersCompleted: number; ordersFailed: number }) => c.ordersCompleted > 0 || c.ordersFailed > 0
  ).length

  const mergedZones = Object.entries(zones.zones).reduce((acc, [key, value]) => {
    const normalized = key.toLowerCase();
    acc[normalized] = (acc[normalized] || 0) + (value as number);
    return acc;
  }, {} as Record<string, number>);

  const displayZones = Object.fromEntries(
    Object.entries(mergedZones).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v])
  );
  const topZonesEntries = Object.entries(displayZones)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topZones = Object.fromEntries(topZonesEntries);

  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
        Delivery
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard de Delivery</h1>
        <Suspense fallback={<div className="h-9 w-[760px] rounded-lg bg-white/20 backdrop-blur-xl dark:bg-slate-800/40" />}>
          <div className="flex items-center gap-3">
            <CompanyFilter companies={companies} />
            <DateFilter />
          </div>
        </Suspense>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DeliveryStatCard
          label={companyId ? "Pedidos Completados" : "Pedidos Totales"}
          value={formatNumber(orders.completed)}
          icon={Truck}
          color="sky"
          trend={trendOrders ? { ...trendOrders, tooltip: `vs. período anterior` } : undefined}
        />
        <DeliveryStatCard
          label={companyId ? "Bidones Entregados" : "Bidones Totales Entregados"}
          value={formatNumber(bidones.totalBidones)}
          icon={Droplets}
          color="emerald"
          trend={trendBidones ? { ...trendBidones, tooltip: `vs. período anterior` } : undefined}
        />
        {companyId ? (
          <DeliveryStatCard
            label="Tiempo Promedio"
            value={`${times.avgMinutes.toFixed(1)} min`}
            icon={Clock}
            color="amber"
            trend={trendTimes ? { ...trendTimes, tooltip: `vs. período anterior` } : undefined}
          />
        ) : (
          <DeliveryStatCard
            label="Empresas Registradas"
            value={formatNumber(registeredCompanies)}
            icon={Building2}
            color="sky"
          />
        )}
        {companyId ? (
          <DeliveryStatCard
            label="Choferes Disponibles"
            value={`${drivers.drivers.available} / ${drivers.drivers.total}`}
            icon={Users}
            color="purple"
            trend={trendDrivers ? { ...trendDrivers, tooltip: `vs. período anterior` } : undefined}
          />
        ) : (
          <DeliveryStatCard
            label="Empresas con Actividad"
            value={formatNumber(activeCompanies)}
            icon={Store}
            color="emerald"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DailyTrendChart data={trend} />
          <MetricCard
            title="Pedidos Fallidos"
            value={formatNumber(orders.failed)}
            subtitle={`${orders.failed > 0 ? ((orders.failed / totalOrders) * 100).toFixed(1) : 0}% del total`}
          />
        </div>
        <div className="space-y-4">
          <HourlyBarChart data={hourly} />
          {companyId ? (
            <div className="grid grid-cols-3 gap-3">
              <MetricCard title="Vehículos Activos" value={formatNumber(vehicles.vehicles.active)} />
              <MetricCard title="Vehículos Pausados" value={formatNumber(vehicles.vehicles.paused)} />
              <MetricCard title="Solicitudes Pend." value={formatNumber(requests.pendingRequests)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <MetricCard title="Vehículos Pausados" value={formatNumber(vehicles.vehicles.paused)} />
              <MetricCard title="Solicitudes Pend." value={formatNumber(requests.pendingRequests)} />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DeliveryZoneBarChart zones={topZones} />
          <MetricCard title="Usuarios Bloqueados" value={formatNumber(blocked.blockedUsers)} />
        </div>
        <div>
          <DriverRankingTable drivers={ranking} />
        </div>
      </div>

      {!companyId && (
        <Suspense fallback={<div className="h-48 rounded-xl bg-white/20 backdrop-blur-xl dark:bg-slate-800/40" />}>
          <CompanyComparisonTable stats={byCompany} />
        </Suspense>
      )}
    </div>
  )
}
