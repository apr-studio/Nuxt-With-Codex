import { z } from 'zod'
import { parseResponseSchema } from '../utils/zod-schema'
import type { ActivityResponse, KpiItem } from '#shared/dashboard-types'
import type { ReportResponse } from '#shared/dashboard-reports'
import {
  activitySchema,
  reportsSchema,
  statsItemSchema
} from '#shared/schemas/dashboard'

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
