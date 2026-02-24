import { z } from 'zod'
import { REPORT_RANGES } from '~/features/dashboard/types/reports'

export const reportRangeSchema = z.enum(REPORT_RANGES)

export const statsItemSchema = z.object({
  title: z.string(),
  value: z.string(),
  trend: z.string(),
  icon: z.string()
})

export const activitySchema = z.object({
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

export const reportMetricsSchema = z.object({
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

export const reportsSchema = z.object({
  ranges: z.array(reportRangeSchema).min(1),
  metrics: z.record(reportRangeSchema, reportMetricsSchema)
})

export type StatsItem = z.infer<typeof statsItemSchema>
export type ActivityResponse = z.infer<typeof activitySchema>
export type ReportMetrics = z.infer<typeof reportMetricsSchema>
export type ReportResponse = z.infer<typeof reportsSchema>
