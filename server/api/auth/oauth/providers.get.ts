import { defineApiHandler } from '../../../utils/api-handler'
import { apiSuccess } from '../../../utils/api-response'

export default defineApiHandler(() => {
  const config = useRuntimeConfig()

  const enabled = {
    google: Boolean(config.oauthGoogleClientId && config.oauthGoogleClientSecret),
    facebook: Boolean(config.oauthFacebookClientId && config.oauthFacebookClientSecret),
    apple: Boolean(config.oauthAppleClientId && config.oauthAppleClientSecret)
  }

  return apiSuccess({ enabled })
})
