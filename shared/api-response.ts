export type ApiMeta = Record<string, unknown>

export type ApiSuccess<T, M extends ApiMeta | undefined = undefined> = {
  success: true
  data: T
  meta?: M
}

export type ApiFailure = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T, M extends ApiMeta | undefined = undefined> = ApiSuccess<T, M> | ApiFailure
