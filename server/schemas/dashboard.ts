import { z } from 'zod'
import { REPORT_RANGES } from '#shared/dashboard-reports'
import { parseResponseSchema } from '../utils/zod-schema'
import type { ActivityResponse, KpiItem } from '#shared/dashboard-types'
import type { ReportResponse } from '#shared/dashboard-reports'

const reportRangeSchema = z.enum(REPORT_RANGES)

const statsItemSchema = z.object({
  title: z.string(),
  value: z.string(),
  trend: z.string(),
  icon: z.string()
})

const activitySchema = z.object({
  activityItems: z.array(z.object({
    label: z.string(),
    content: z.string()
  })),
  alertItems: z.array(z.object({
    title: z.string(),
    description: z.string(),
    color: z.enum(['warning', 'success'])
  }))
})

const reportMetricsSchema = z.object({
  summary: z.array(z.object({
    name: z.string(),
    value: z.string(),
    change: z.string()
  })),
  trend: z.array(z.number()),
  revenueByChannel: z.array(z.object({
    name: z.string(),
    value: z.number()
  })),
  acquisitionMix: z.array(z.object({
    name: z.string(),
    value: z.number()
  }))
})

const reportsSchema = z.object({
  ranges: z.array(reportRangeSchema).min(1),
  metrics: z.record(reportRangeSchema, reportMetricsSchema)
})

export function validateDashboardStatsResponse(value: unknown) {
  parseResponseSchema(z.array(statsItemSchema), value, 'Invalid stats response.')
}

export function validateDashboardActivityResponse(value: unknown) {
  parseResponseSchema(activitySchema, value, 'Invalid activity response.')
}

export function validateDashboardReportsResponse(value: unknown) {
  parseResponseSchema(reportsSchema, value, 'Invalid reports response.')
}

export function toDashboardStats(items: KpiItem[]): KpiItem[] {
  return items
}

export function toDashboardActivity(value: ActivityResponse): ActivityResponse {
  return value
}

export function toDashboardReports(value: ReportResponse): ReportResponse {
  return value
}
