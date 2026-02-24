<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

type CategoryKey = 'navigation' | 'feedback' | 'forms' | 'data' | 'layout'

type PropRow = {
  prop: string
  value: string
  description: string
}

type DemoItem = {
  id: string
  name: string
  category: CategoryKey
  description: string
  props: PropRow[]
}

const seed = useState('showcase-seed-v2', () => Math.floor(Math.random() * 1_000_000))

function randomAt<T>(list: T[], index: number) {
  const value = Math.abs(Math.sin(seed.value + index) * 10_000)
  return list[Math.floor(value) % list.length]
}

const randomNames = ['Orbit', 'Aurora', 'Nimbus', 'Atlas', 'Delta', 'Nova']
const randomStatus = ['ready', 'running', 'queued', 'paused']
const randomText = [
  'Auto-generated sample text for layout testing.',
  'Preview different content lengths on the same component.',
  'Use this route as a reusable Nuxt UI component sandbox.',
  'This content changes with a random seed per app session.'
]

const categories: { key: CategoryKey, label: string, icon: string }[] = [
  { key: 'navigation', label: 'Navigation', icon: 'i-lucide-compass' },
  { key: 'feedback', label: 'Feedback', icon: 'i-lucide-bell' },
  { key: 'forms', label: 'Forms', icon: 'i-lucide-list-checks' },
  { key: 'data', label: 'Data', icon: 'i-lucide-table' },
  { key: 'layout', label: 'Layout', icon: 'i-lucide-layout-grid' }
]

const demos: DemoItem[] = [
  {
    id: 'breadcrumb',
    name: 'UBreadcrumb',
    category: 'navigation',
    description: 'Hierarchical route trail.',
    props: [
      { prop: 'items', value: '[{ label, to }]', description: 'Breadcrumb links.' },
      { prop: 'class', value: '"..."', description: 'Style overrides.' }
    ]
  },
  {
    id: 'pagination',
    name: 'UPagination',
    category: 'navigation',
    description: 'Page number navigation.',
    props: [
      { prop: 'v-model:page', value: 'number', description: 'Current page.' },
      { prop: 'total', value: 'number', description: 'Total items.' },
      { prop: 'items-per-page', value: 'number', description: 'Items per page.' }
    ]
  },
  {
    id: 'dropdown',
    name: 'UDropdownMenu',
    category: 'navigation',
    description: 'Action menu for compact commands.',
    props: [
      { prop: 'items', value: 'MenuGroup[]', description: 'Grouped menu options.' },
      { prop: 'content', value: '{ align: "end" }', description: 'Menu alignment.' }
    ]
  },
  {
    id: 'stepper',
    name: 'UStepper',
    category: 'navigation',
    description: 'Step-based progress navigation.',
    props: [
      { prop: 'items', value: '[{ title, description }]', description: 'Step list.' },
      { prop: 'orientation', value: '"horizontal"', description: 'Layout direction.' }
    ]
  },
  {
    id: 'alert',
    name: 'UAlert',
    category: 'feedback',
    description: 'Status and inline feedback message.',
    props: [
      { prop: 'title', value: '"..."', description: 'Primary text.' },
      { prop: 'description', value: '"..."', description: 'Secondary text.' },
      { prop: 'color', value: '"success"', description: 'Semantic color.' }
    ]
  },
  {
    id: 'progress',
    name: 'UProgress',
    category: 'feedback',
    description: 'Visual progress indicator.',
    props: [
      { prop: 'model-value', value: '0..100', description: 'Progress value.' },
      { prop: 'color', value: '"primary"', description: 'Bar color.' }
    ]
  },
  {
    id: 'tooltip',
    name: 'UTooltip',
    category: 'feedback',
    description: 'Context hint on hover or focus.',
    props: [
      { prop: 'text', value: '"..."', description: 'Tooltip content.' },
      { prop: 'delay-duration', value: 'number', description: 'Open delay in ms.' }
    ]
  },
  {
    id: 'skeleton',
    name: 'USkeleton',
    category: 'feedback',
    description: 'Loading placeholder block.',
    props: [
      { prop: 'class', value: '"h-4 w-40"', description: 'Custom shape and size.' }
    ]
  },
  {
    id: 'input',
    name: 'UInput',
    category: 'forms',
    description: 'Single-line text input.',
    props: [
      { prop: 'v-model', value: 'string', description: 'Input value.' },
      { prop: 'placeholder', value: '"..."', description: 'Hint text.' },
      { prop: 'icon', value: '"i-lucide-search"', description: 'Leading icon.' }
    ]
  },
  {
    id: 'textarea',
    name: 'UTextarea',
    category: 'forms',
    description: 'Multi-line text input.',
    props: [
      { prop: 'v-model', value: 'string', description: 'Textarea value.' },
      { prop: 'rows', value: 'number', description: 'Visible line count.' }
    ]
  },
  {
    id: 'select',
    name: 'USelect',
    category: 'forms',
    description: 'Single choice select list.',
    props: [
      { prop: 'v-model', value: 'string', description: 'Selected item.' },
      { prop: 'items', value: 'string[]', description: 'Available options.' }
    ]
  },
  {
    id: 'check-radio',
    name: 'UCheckboxGroup + URadioGroup',
    category: 'forms',
    description: 'Multiple and single choice controls.',
    props: [
      { prop: 'v-model', value: 'string[] | string', description: 'Selected values.' },
      { prop: 'items', value: 'string[]', description: 'Choice list.' }
    ]
  },
  {
    id: 'switch-slider',
    name: 'USwitch + USlider',
    category: 'forms',
    description: 'Boolean toggle and ranged value input.',
    props: [
      { prop: 'v-model', value: 'boolean | number', description: 'Bound state.' },
      { prop: 'min/max', value: 'number', description: 'Slider range.' }
    ]
  },
  {
    id: 'table',
    name: 'UTable',
    category: 'data',
    description: 'Structured row/column data display.',
    props: [
      { prop: 'columns', value: 'ColumnDef[]', description: 'Table schema.' },
      { prop: 'data', value: 'Record[]', description: 'Row items.' }
    ]
  },
  {
    id: 'accordion',
    name: 'UAccordion',
    category: 'data',
    description: 'Collapsible grouped content.',
    props: [
      { prop: 'items', value: '[{ label, content }]', description: 'Accordion panels.' }
    ]
  },
  {
    id: 'avatar-group',
    name: 'UAvatar + UAvatarGroup',
    category: 'data',
    description: 'Compact user identity stack.',
    props: [
      { prop: 'icon', value: '"i-lucide-user"', description: 'Avatar icon.' },
      { prop: 'size', value: '"md"', description: 'Avatar size.' }
    ]
  },
  {
    id: 'kbd',
    name: 'UKbd',
    category: 'data',
    description: 'Keyboard shortcut hint.',
    props: [
      { prop: 'value', value: '"Ctrl + K"', description: 'Shortcut text.' }
    ]
  },
  {
    id: 'card',
    name: 'UCard',
    category: 'layout',
    description: 'Composable card layout container.',
    props: [
      { prop: 'class', value: '"..."', description: 'Container styling.' }
    ]
  },
  {
    id: 'separator',
    name: 'USeparator',
    category: 'layout',
    description: 'Visual separation between blocks.',
    props: [
      { prop: 'orientation', value: '"horizontal"', description: 'Line direction.' }
    ]
  },
  {
    id: 'chip-badge',
    name: 'UChip + UBadge',
    category: 'layout',
    description: 'Small metadata and status indicators.',
    props: [
      { prop: 'color', value: '"primary"', description: 'Indicator color.' },
      { prop: 'variant', value: '"subtle"', description: 'Visual style.' }
    ]
  },
  {
    id: 'buttons',
    name: 'UButton + UButtonGroup',
    category: 'layout',
    description: 'Primary actions and grouped controls.',
    props: [
      { prop: 'color', value: '"neutral"', description: 'Button tone.' },
      { prop: 'variant', value: '"outline"', description: 'Button style.' },
      { prop: 'icon', value: '"i-lucide-..."', description: 'Leading icon.' }
    ]
  }
]

const propColumns = [
  { accessorKey: 'prop', header: 'Prop' },
  { accessorKey: 'value', header: 'Example Value' },
  { accessorKey: 'description', header: 'Description' }
]

const breadcrumbItems = [
  { label: 'Home', to: '/' },
  { label: 'UI Showcase', to: '/ui-showcase' }
]

const dropdownItems = [
  [{ label: 'Refresh', icon: 'i-lucide-refresh-ccw' }],
  [{ label: 'Back to Routes', to: '/', icon: 'i-lucide-home' }]
]

const accordionItems = [
  { label: 'API', content: randomAt(randomText, 1) },
  { label: 'Examples', content: randomAt(randomText, 2) },
  { label: 'Customization', content: randomAt(randomText, 3) }
]

const tableColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'score', header: 'Score' }
]

const tableData = Array.from({ length: 8 }, (_, i) => ({
  name: `${randomAt(randomNames, i)}-${i + 1}`,
  status: randomAt(randomStatus, i + 8),
  score: Math.floor(Math.abs(Math.sin(seed.value + i)) * 100)
}))

const searchText = ref(randomAt(randomText, 0))
const noteText = ref(randomAt(randomText, 2))
const selectedCity = ref('Taipei')
const selectedChecks = ref<string[]>(['Email'])
const selectedPeriod = ref('Weekly')
const enabled = ref(true)
const rangeValue = ref(45)
const demoProgress = ref(Math.floor(Math.abs(Math.cos(seed.value)) * 100))
const demoPageNav = ref(2)

const cityOptions = ['Taipei', 'Taichung', 'Kaohsiung', 'Tainan', 'Hsinchu']
const checkOptions = ['Email', 'SMS', 'Push']
const periodOptions = ['Daily', 'Weekly', 'Monthly']

const activeCategory = ref<CategoryKey>('navigation')
const pageSize = 4
const pageByCategory = reactive<Record<CategoryKey, number>>({
  navigation: 1,
  feedback: 1,
  forms: 1,
  data: 1,
  layout: 1
})

const categoryCount = computed(() =>
  categories.reduce<Record<CategoryKey, number>>((acc, category) => {
    acc[category.key] = demos.filter(demo => demo.category === category.key).length
    return acc
  }, {
    navigation: 0,
    feedback: 0,
    forms: 0,
    data: 0,
    layout: 0
  })
)

const currentPage = computed({
  get: () => pageByCategory[activeCategory.value],
  set: (value: number) => {
    pageByCategory[activeCategory.value] = value
  }
})

const filteredDemos = computed(() =>
  demos.filter(demo => demo.category === activeCategory.value)
)

const totalForCurrent = computed(() => filteredDemos.value.length)

const pagedDemos = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDemos.value.slice(start, start + pageSize)
})

watch([activeCategory, totalForCurrent], () => {
  const maxPage = Math.max(1, Math.ceil(totalForCurrent.value / pageSize))
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <UBreadcrumb :items="breadcrumbItems" />

    <UCard>
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold">
              Nuxt UI Categorized Showcase
            </h1>
            <p class="text-sm text-muted mt-1">
              Category-based paging with live examples and common props.
            </p>
          </div>
          <UButton
            to="/"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            label="Back to Routes"
          />
        </div>
      </template>

      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="category in categories"
          :key="category.key"
          :icon="category.icon"
          :variant="activeCategory === category.key ? 'solid' : 'outline'"
          color="neutral"
          @click="activeCategory = category.key"
        >
          {{ category.label }} ({{ categoryCount[category.key] }})
        </UButton>
      </div>
    </UCard>

    <div class="grid gap-4 lg:grid-cols-2">
      <UCard
        v-for="demo in pagedDemos"
        :key="demo.id"
      >
        <template #header>
          <div>
            <h2 class="text-lg font-semibold">
              {{ demo.name }}
            </h2>
            <p class="text-sm text-muted">
              {{ demo.description }}
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <template v-if="demo.id === 'breadcrumb'">
            <UBreadcrumb :items="breadcrumbItems" />
          </template>

          <template v-else-if="demo.id === 'pagination'">
            <UPagination
              v-model:page="demoPageNav"
              :total="240"
              :items-per-page="20"
            />
            <p class="text-sm text-muted">
              Current page: {{ demoPageNav }}
            </p>
          </template>

          <template v-else-if="demo.id === 'dropdown'">
            <UDropdownMenu :items="dropdownItems">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-menu"
                label="Open Menu"
              />
            </UDropdownMenu>
          </template>

          <template v-else-if="demo.id === 'stepper'">
            <UStepper
              :items="[
                { title: 'Init', description: 'nuxi init .' },
                { title: 'Install', description: 'npm install' },
                { title: 'Develop', description: 'Build routes and pages' },
                { title: 'Ship', description: 'Deploy to production' }
              ]"
            />
          </template>

          <template v-else-if="demo.id === 'alert'">
            <UAlert
              title="Build status: healthy"
              description="No blocking checks found in this demo state."
              color="success"
              variant="subtle"
              icon="i-lucide-check-circle"
            />
          </template>

          <template v-else-if="demo.id === 'progress'">
            <div class="space-y-2">
              <p class="text-sm text-muted">
                Progress value: {{ demoProgress }}%
              </p>
              <UProgress :model-value="demoProgress" />
            </div>
          </template>

          <template v-else-if="demo.id === 'tooltip'">
            <UTooltip text="Tooltip content from prop: text">
              <UButton
                color="neutral"
                variant="outline"
                label="Hover me"
              />
            </UTooltip>
          </template>

          <template v-else-if="demo.id === 'skeleton'">
            <div class="space-y-2">
              <USkeleton class="h-4 w-40" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-2/3" />
            </div>
          </template>

          <template v-else-if="demo.id === 'input'">
            <UForm :state="{ searchText }">
              <UFormField label="Search">
                <UInput
                  v-model="searchText"
                  icon="i-lucide-search"
                  placeholder="Search keywords"
                />
              </UFormField>
            </UForm>
          </template>

          <template v-else-if="demo.id === 'textarea'">
            <UForm :state="{ noteText }">
              <UFormField label="Note">
                <UTextarea
                  v-model="noteText"
                  :rows="3"
                />
              </UFormField>
            </UForm>
          </template>

          <template v-else-if="demo.id === 'select'">
            <UForm :state="{ selectedCity }">
              <UFormField label="City">
                <USelect
                  v-model="selectedCity"
                  :items="cityOptions"
                />
              </UFormField>
            </UForm>
          </template>

          <template v-else-if="demo.id === 'check-radio'">
            <div class="space-y-3">
              <UFormField label="Channels">
                <UCheckboxGroup
                  v-model="selectedChecks"
                  :items="checkOptions"
                />
              </UFormField>
              <UFormField label="Schedule">
                <URadioGroup
                  v-model="selectedPeriod"
                  :items="periodOptions"
                />
              </UFormField>
            </div>
          </template>

          <template v-else-if="demo.id === 'switch-slider'">
            <div class="space-y-4">
              <USwitch
                v-model="enabled"
                label="Enable automation"
              />
              <UFormField label="Threshold">
                <USlider
                  v-model="rangeValue"
                  :min="0"
                  :max="100"
                />
              </UFormField>
            </div>
          </template>

          <template v-else-if="demo.id === 'table'">
            <UTable
              :columns="tableColumns"
              :data="tableData"
            />
          </template>

          <template v-else-if="demo.id === 'accordion'">
            <UAccordion :items="accordionItems" />
          </template>

          <template v-else-if="demo.id === 'avatar-group'">
            <UAvatarGroup>
              <UAvatar icon="i-lucide-user" />
              <UAvatar icon="i-lucide-user-round" />
              <UAvatar icon="i-lucide-user-plus" />
              <UAvatar icon="i-lucide-user-check" />
            </UAvatarGroup>
          </template>

          <template v-else-if="demo.id === 'kbd'">
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted">Quick search:</span>
              <UKbd value="Ctrl + K" />
            </div>
          </template>

          <template v-else-if="demo.id === 'card'">
            <UCard class="bg-elevated/40">
              <template #header>
                <h3 class="font-medium">
                  Nested UCard
                </h3>
              </template>
              <p class="text-sm text-muted">
                Card inside card to test nesting and spacing.
              </p>
            </UCard>
          </template>

          <template v-else-if="demo.id === 'separator'">
            <div class="space-y-3">
              <p class="text-sm">
                Section A
              </p>
              <USeparator />
              <p class="text-sm">
                Section B
              </p>
            </div>
          </template>

          <template v-else-if="demo.id === 'chip-badge'">
            <div class="flex flex-wrap items-center gap-3">
              <UBadge
                color="primary"
                variant="subtle"
              >
                Stable
              </UBadge>
              <UBadge
                color="warning"
                variant="outline"
              >
                Beta
              </UBadge>
              <UChip inset>
                <UAvatar icon="i-lucide-user" />
              </UChip>
            </div>
          </template>

          <template v-else-if="demo.id === 'buttons'">
            <div class="flex flex-wrap items-center gap-3">
              <UButton icon="i-lucide-play">
                Primary
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-download"
              >
                Outline
              </UButton>
              <UButtonGroup>
                <UButton
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-chevron-left"
                />
                <UButton
                  color="neutral"
                  variant="subtle"
                  label="Center"
                />
                <UButton
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-chevron-right"
                />
              </UButtonGroup>
            </div>
          </template>
        </div>

        <template #footer>
          <p class="text-xs font-medium mb-2">
            Props Example
          </p>
          <UTable
            :columns="propColumns"
            :data="demo.props"
          />
        </template>
      </UCard>
    </div>

    <UCard>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-muted">
          Category: {{ categories.find(c => c.key === activeCategory)?.label }}
          | Total: {{ totalForCurrent }}
          | Showing: {{ pagedDemos.length }}
        </p>
        <UPagination
          v-model:page="currentPage"
          :total="totalForCurrent"
          :items-per-page="pageSize"
        />
      </div>
    </UCard>
  </UContainer>
</template>
