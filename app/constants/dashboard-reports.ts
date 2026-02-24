export const DASHBOARD_REPORT_THEME = {
  palette: {
    light: ['#2563eb', '#059669', '#d97706', '#db2777', '#7c3aed'],
    dark: ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']
  },
  axisText: {
    light: '#334155',
    dark: '#cbd5e1'
  },
  splitLine: {
    light: 'rgba(51,65,85,0.18)',
    dark: 'rgba(148,163,184,0.25)'
  },
  tooltip: {
    light: { background: '#ffffff', text: '#0f172a' },
    dark: { background: '#0f172a', text: '#e2e8f0' }
  }
} as const

export const DASHBOARD_REPORT_GRIDS = {
  trend: { left: 36, right: 20, top: 28, bottom: 28 },
  revenue: { left: 36, right: 12, top: 20, bottom: 24 }
} as const

export const DASHBOARD_REPORT_LABELS = {
  'Last 7 days': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  'Last 30 days': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
  'Last 90 days': ['W1', 'W3', 'W5', 'W7', 'W9', 'W11', 'W13']
} as const

export const DASHBOARD_REPORT_CHART_HEIGHTS = {
  trend: 'h-72 w-full',
  revenue: 'h-72 w-full',
  acquisition: 'h-80 w-full'
} as const
