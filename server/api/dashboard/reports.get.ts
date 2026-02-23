import { assertPermission } from '../../utils/rbac'

export default defineEventHandler((event) => {
  assertPermission(event, 'reports:view')

  return {
    ranges: ['Last 7 days', 'Last 30 days', 'Last 90 days'],
    metrics: {
      'Last 7 days': {
        summary: [
          { name: 'Conversion Rate', value: '4.2%', change: '+0.3%' },
          { name: 'Avg Session', value: '05:58', change: '+0:18' },
          { name: 'Retention D30', value: '35%', change: '+1.1%' }
        ],
        trend: [22, 24, 21, 26, 29, 31, 34],
        revenueByChannel: [
          { name: 'Organic Search', value: 18 },
          { name: 'Paid Ads', value: 12 },
          { name: 'Referral', value: 7 },
          { name: 'Direct', value: 5 }
        ],
        acquisitionMix: [
          { name: 'Organic Search', value: 57 },
          { name: 'Paid Ads', value: 24 },
          { name: 'Referral', value: 12 },
          { name: 'Direct', value: 7 }
        ]
      },
      'Last 30 days': {
        summary: [
          { name: 'Conversion Rate', value: '4.8%', change: '+0.6%' },
          { name: 'Avg Session', value: '06:21', change: '+0:42' },
          { name: 'Retention D30', value: '39%', change: '+2.1%' }
        ],
        trend: [94, 102, 98, 110, 116, 121, 134],
        revenueByChannel: [
          { name: 'Organic Search', value: 61 },
          { name: 'Paid Ads', value: 22 },
          { name: 'Referral', value: 11 },
          { name: 'Direct', value: 6 }
        ],
        acquisitionMix: [
          { name: 'Organic Search', value: 61 },
          { name: 'Paid Ads', value: 22 },
          { name: 'Referral', value: 11 },
          { name: 'Direct', value: 6 }
        ]
      },
      'Last 90 days': {
        summary: [
          { name: 'Conversion Rate', value: '5.1%', change: '+1.0%' },
          { name: 'Avg Session', value: '06:44', change: '+1:07' },
          { name: 'Retention D30', value: '42%', change: '+3.4%' }
        ],
        trend: [280, 301, 296, 320, 338, 355, 372],
        revenueByChannel: [
          { name: 'Organic Search', value: 168 },
          { name: 'Paid Ads', value: 76 },
          { name: 'Referral', value: 42 },
          { name: 'Direct', value: 24 }
        ],
        acquisitionMix: [
          { name: 'Organic Search', value: 54 },
          { name: 'Paid Ads', value: 26 },
          { name: 'Referral', value: 14 },
          { name: 'Direct', value: 6 }
        ]
      }
    }
  }
})
