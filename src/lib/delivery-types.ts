export type DeliveryStats = {
  orders: { completed: number; failed: number }
  bidones: { totalBidones: number }
  zones: { zones: Record<string, number> }
  times: { avgMinutes: number }
  drivers: { drivers: { available: number; total: number } }
  vehicles: { vehicles: { active: number; paused: number } }
  requests: { pendingRequests: number }
  blocked: { blockedUsers: number }
}

export type DailyTrendPoint = {
  date: string
  completed: number
  failed?: number
}

export type DriverRankingEntry = {
  name: string
  deliveries: number
  avgTime?: number
  rating?: number
  trend?: number[]
}

export type HourlyEntry = {
  hour: number
  count: number
}

export type ComparisonData = {
  current: {
    ordersCompleted: number
    bidones: number
    avgMinutes: number
    availableDrivers: number
  }
  previous: {
    ordersCompleted: number
    bidones: number
    avgMinutes: number
    availableDrivers: number
  }
}

export type Company = {
  id: string
  name: string
}

export type CompanyStats = {
  companyId: string
  companyName: string
  ordersCompleted: number
  ordersFailed: number
  totalBidones: number
  avgMinutes: number
  availableDrivers: number
  totalDrivers: number
  activeVehicles: number
  pausedVehicles: number
  pendingRequests: number
  blockedUsers: number
}
