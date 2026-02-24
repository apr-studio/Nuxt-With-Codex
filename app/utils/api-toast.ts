type ToastColor = 'error' | 'success' | 'neutral' | 'primary' | 'secondary' | 'info' | 'warning'

type ToastPayload = {
  title: string
  description?: string
  color?: ToastColor
}

type ToastLike = {
  add: (payload: ToastPayload) => unknown
}

type LastMessageRef = {
  value: string
}

// Emit an error toast, optionally deduped by last message ref.
export function emitErrorToast(
  toast: ToastLike,
  title: string,
  message: string,
  lastMessageRef?: LastMessageRef
) {
  if (!import.meta.client) {
    return
  }
  if (lastMessageRef && lastMessageRef.value === message) {
    return
  }
  toast.add({
    title,
    description: message,
    color: 'error'
  })
  if (lastMessageRef) {
    lastMessageRef.value = message
  }
}

// Emit a success toast.
export function emitSuccessToast(toast: ToastLike, title: string) {
  if (!import.meta.client) {
    return
  }
  toast.add({
    title,
    color: 'success'
  })
}
