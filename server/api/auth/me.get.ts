import { getRole } from '../../utils/auth'

export default defineEventHandler((event) => {
  return {
    role: getRole(event)
  }
})
