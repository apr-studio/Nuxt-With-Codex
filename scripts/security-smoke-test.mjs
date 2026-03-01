/* eslint-disable no-console */

const baseURL = process.env.SECURITY_TEST_BASE_URL || 'http://localhost:3000'

function createCookieJar() {
  const jar = new Map()
  return {
    setFromResponse(response) {
      const raw = response.headers.get('set-cookie')
      if (!raw) {
        return
      }

      // This project currently sets one cookie per response in these test flows.
      const cookiePair = raw.split(';')[0] || ''
      const [name, ...valueParts] = cookiePair.split('=')
      if (!name || valueParts.length === 0) {
        return
      }
      jar.set(name.trim(), valueParts.join('=').trim())
    },
    toHeader() {
      if (!jar.size) {
        return ''
      }
      return Array.from(jar.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join('; ')
    }
  }
}

async function request(path, options = {}, cookieJar) {
  const headers = new Headers(options.headers || {})
  const cookie = cookieJar?.toHeader()
  if (cookie) {
    headers.set('cookie', cookie)
  }

  const response = await fetch(`${baseURL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body
  })

  cookieJar?.setFromResponse(response)

  let json
  try {
    json = await response.json()
  } catch {
    json = null
  }

  return { response, json }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function getCsrfContext() {
  const jar = createCookieJar()
  const { response, json } = await request('/api/auth/csrf', {}, jar)

  assert(response.ok, `GET /api/auth/csrf failed with status ${response.status}`)
  assert(json?.success === true, 'CSRF endpoint did not return success payload.')
  assert(typeof json?.data?.token === 'string' && json.data.token.length > 0, 'CSRF token missing in payload.')

  return {
    jar,
    csrfToken: json.data.token
  }
}

async function testCsrfRejectsMissingToken() {
  const { response, json } = await request('/api/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      email: 'ava@example.com',
      password: '1111111111'
    })
  })

  assert(response.status === 403, `Expected 403 without CSRF token, got ${response.status}`)
  assert(json?.success === false, 'Expected API failure payload for missing CSRF.')
  assert(json?.error?.code === 'CSRF_INVALID', `Expected CSRF_INVALID, got ${json?.error?.code || 'unknown'}`)
  console.log('PASS: CSRF rejects missing token')
}

async function testCsrfAllowsToken() {
  const { jar, csrfToken } = await getCsrfContext()
  const { response, json } = await request('/api/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': csrfToken
    },
    body: JSON.stringify({
      email: 'unknown-user@example.com',
      password: '1111111111'
    })
  }, jar)

  assert(response.status !== 403, 'CSRF-protected login still returned 403 with valid token.')
  assert(json?.success === false, 'Expected login to fail for unknown user in smoke test.')
  console.log('PASS: CSRF accepts valid token')
}

async function testRateLimitOnLogin() {
  const { jar, csrfToken } = await getCsrfContext()
  let hit429 = false

  for (let i = 0; i < 12; i += 1) {
    const { response, json } = await request('/api/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrfToken
      },
      body: JSON.stringify({
        email: 'rate-limit-check@example.com',
        password: '1111111111'
      })
    }, jar)

    if (response.status === 429) {
      hit429 = true
      assert(json?.success === false, 'Expected failure payload on 429 response.')
      assert(json?.error?.code === 'RATE_LIMITED', `Expected RATE_LIMITED on 429, got ${json?.error?.code || 'unknown'}`)
      break
    }
  }

  assert(hit429, 'Rate limit test did not receive 429 after repeated login attempts.')
  console.log('PASS: Rate limit returns 429 + RATE_LIMITED')
}

async function main() {
  console.log(`Running security smoke tests against: ${baseURL}`)
  await testCsrfRejectsMissingToken()
  await testCsrfAllowsToken()
  await testRateLimitOnLogin()
  console.log('All security smoke tests passed.')
}

main().catch((error) => {
  console.error('Security smoke test failed:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
