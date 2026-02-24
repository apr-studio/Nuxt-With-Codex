import { computed, reactive, ref, watch } from 'vue'
import type { UserRole, UserRow, UsersResponse, UserStatus } from '~/features/dashboard/types/types'
import { useDashboardRole } from '~/composables/useDashboardRole'

type FormError = {
  name?: string
  message: string
}

// Users page state: list, filters, pagination, and modal CRUD flow.
export function useUsersCrud() {
  const { normalizedRole, can } = useDashboardRole()
  const canCreate = computed(() => can('users:create'))
  const canUpdate = computed(() => can('users:update'))
  const canDelete = computed(() => can('users:delete'))

  // List query params drive the users table results.
  const usersApi = useApiPath('/api/users')
  const query = ref('')
  const statusFilter = ref<'all' | UserStatus>('all')
  const page = ref(1)
  const pageSize = 5

  const queryParams = computed(() => ({
    q: query.value,
    status: statusFilter.value,
    page: page.value,
    pageSize
  }))

  // Fetch list data with retry + toast on failures.
  const { payload: usersData, pending, refresh } = useApiFetch<UsersResponse>(usersApi, {
    query: queryParams,
    retryOptions: {
      count: 2,
      delayMs: 500,
      backoff: 'exponential',
      retryOnCodes: ['REQUEST_FAILED', 'INTERNAL_ERROR']
    },
    toastOptions: {
      error: 'Failed to load users'
    },
    defaultData: {
      items: [],
      total: 0,
      page: 1,
      pageSize
    }
  })

  // Reset to first page when filters change.
  watch([query, statusFilter], () => {
    page.value = 1
  })

  // Modal state + form state for create/edit.
  const modalOpen = ref(false)
  const editingUserId = ref<number | null>(null)
  const actionError = ref('')

  const formState = reactive({
    name: '',
    email: '',
    role: 'viewer' as UserRole,
    status: 'active' as UserStatus
  })
  type UserFormState = typeof formState

  const modalTitle = computed(() => editingUserId.value ? 'Edit User' : 'Create User')

  // Mutations for create/update/delete.
  const createUserMutation = useApiMutation<{ user: UserRow }, typeof formState>({
    method: 'POST',
    retryOptions: {
      count: 1,
      delayMs: 600,
      backoff: 'fixed',
      retryOnCodes: ['REQUEST_FAILED', 'INTERNAL_ERROR']
    },
    toastOptions: {
      success: 'User created',
      error: 'Create failed'
    }
  })
  const updateUserMutation = useApiMutation<{ user: UserRow }, typeof formState>({
    method: 'PUT',
    retryOptions: {
      count: 1,
      delayMs: 600,
      backoff: 'fixed',
      retryOnCodes: ['REQUEST_FAILED', 'INTERNAL_ERROR']
    },
    toastOptions: {
      success: 'User updated',
      error: 'Update failed'
    }
  })
  const deleteUserMutation = useApiMutation<{ ok: true }>({
    method: 'DELETE',
    retryOptions: {
      count: 1,
      delayMs: 600,
      backoff: 'fixed',
      retryOnCodes: ['REQUEST_FAILED', 'INTERNAL_ERROR']
    },
    toastOptions: {
      success: 'User deleted',
      error: 'Delete failed'
    }
  })
  // Combined mutation state for disabling UI.
  const isMutating = computed(() =>
    createUserMutation.pending.value || updateUserMutation.pending.value || deleteUserMutation.pending.value
  )

  // Reset form to defaults and clear errors.
  function resetForm() {
    editingUserId.value = null
    formState.name = ''
    formState.email = ''
    formState.role = 'viewer'
    formState.status = 'active'
    actionError.value = ''
  }

  // Open create modal (with permission guard).
  function openCreateModal() {
    if (!canCreate.value) {
      return
    }
    resetForm()
    modalOpen.value = true
  }

  // Open edit modal and populate form.
  function openEditModal(user: UserRow) {
    if (!canUpdate.value) {
      return
    }
    editingUserId.value = user.id
    formState.name = user.name
    formState.email = user.email
    formState.role = user.role
    formState.status = user.status
    actionError.value = ''
    modalOpen.value = true
  }

  // Client-side validation for the modal form.
  function validateForm(state: typeof formState): FormError[] {
    const errors: FormError[] = []

    if (!state.name || state.name.trim().length < 2) {
      errors.push({ name: 'name', message: 'Name must be at least 2 characters.' })
    }
    if (!state.email || !/^\S+@\S+\.\S+$/.test(state.email)) {
      errors.push({ name: 'email', message: 'Email format is invalid.' })
    }
    if (!['admin', 'editor', 'viewer'].includes(state.role)) {
      errors.push({ name: 'role', message: 'Role is invalid.' })
    }
    if (!['active', 'invited', 'disabled'].includes(state.status)) {
      errors.push({ name: 'status', message: 'Status is invalid.' })
    }

    return errors
  }

  function applyFormState(nextState: UserFormState) {
    formState.name = nextState.name
    formState.email = nextState.email
    formState.role = nextState.role
    formState.status = nextState.status
  }

  // Create or update a user based on current mode.
  async function submitForm(nextState?: UserFormState) {
    actionError.value = ''
    if (nextState) {
      applyFormState(nextState)
    }
    if (editingUserId.value) {
      if (!canUpdate.value) {
        actionError.value = 'Permission denied for update.'
        return
      }
      const result = await updateUserMutation.mutate({
        url: useApiPath(`/api/users/${editingUserId.value}`),
        body: formState
      })
      if (!result) {
        actionError.value = updateUserMutation.errorMessage.value || 'Failed to save user.'
        return
      }
    } else {
      if (!canCreate.value) {
        actionError.value = 'Permission denied for create.'
        return
      }
      const result = await createUserMutation.mutate({
        url: usersApi,
        body: formState
      })
      if (!result) {
        actionError.value = createUserMutation.errorMessage.value || 'Failed to save user.'
        return
      }
    }

    modalOpen.value = false
    resetForm()
    await refresh()
  }

  // Delete a user and refresh list.
  async function removeUser(id: number) {
    actionError.value = ''
    if (!canDelete.value) {
      actionError.value = 'Permission denied for delete.'
      return
    }
    const result = await deleteUserMutation.mutate({
      url: useApiPath(`/api/users/${id}`)
    })
    if (!result) {
      actionError.value = deleteUserMutation.errorMessage.value || 'Failed to delete user.'
      return
    }
    await refresh()
  }

  return {
    actionError,
    canCreate,
    canDelete,
    canUpdate,
    isMutating,
    modalOpen,
    modalTitle,
    normalizedRole,
    openCreateModal,
    openEditModal,
    page,
    pageSize,
    pending,
    query,
    refresh,
    removeUser,
    resetForm,
    statusFilter,
    submitForm,
    usersData,
    editingUserId,
    formState,
    validateForm
  }
}
