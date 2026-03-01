type GeneratePasswordOptions = {
  length?: number
  includeSymbols?: boolean
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*_-+=?'

// Shared password helpers for generation and clipboard actions.
export function usePasswordTools() {
  const toast = useToast()

  function generatePassword(options: GeneratePasswordOptions = {}) {
    const length = Math.max(8, options.length ?? 12)
    const charset = `${LOWER}${UPPER}${DIGITS}${options.includeSymbols === false ? '' : SYMBOLS}`
    const values = new Uint32Array(length)

    // Web Crypto gives stronger randomness than Math.random.
    crypto.getRandomValues(values)

    let output = ''
    for (let i = 0; i < length; i += 1) {
      const randomValue = values[i] ?? 0
      output += charset[randomValue % charset.length]
    }
    return output
  }

  async function copyText(value: string, label = 'Password') {
    if (!value) {
      toast.add({
        color: 'warning',
        title: `${label} is empty`,
        description: 'Generate or enter a value first.'
      })
      return false
    }

    try {
      await navigator.clipboard.writeText(value)
      toast.add({
        color: 'success',
        title: `${label} copied`
      })
      return true
    } catch {
      toast.add({
        color: 'error',
        title: 'Copy failed',
        description: 'Clipboard permission was denied.'
      })
      return false
    }
  }

  return {
    generatePassword,
    copyText
  }
}
