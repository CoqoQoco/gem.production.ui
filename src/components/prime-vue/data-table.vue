<template>
  <div class="base-datatable">
    <DataTable
      :value="items"
      :selection="itemsSelection"
      @update:selection="$emit('update:itemsSelection', $event)"
      v-model:expandedRows="expandedRows"
      :dataKey="dataKey"
      class="p-datatable-sm"
      scrollable
      :scrollHeight="scrollHeight"
      columnResizeMode="expand"
      resizableColumns
      :paginator="paginator"
      @page="handlePageChange"
      :lazy="true"
      sortMode="multiple"
      @sort="handleSortChange"
      stripedRows
      :showGridlines="showGridlines"
      removableSort
      :rows="perPage"
      :rowsPerPageOptions="rowsPerPageOptions"
      :totalRecords="totalRecords"
      :paginatorTemplate="paginatorTemplate"
      :currentPageReportTemplate="currentPageReportTemplate"
      v-bind="$attrs"
    >
      <!-- Expander Column -->
      <Column v-if="expandable" :expander="true" headerStyle="width: 50px" />

      <!-- Expanded Row Template -->
      <template #expansion="slotProps">
        <slot name="expansion" v-bind="slotProps">
          <div class="expanded-row-content">
            {{ slotProps.data }}
          </div>
        </slot>
      </template>

      <!-- Selection Column -->
      <Column
        v-if="selectionMode"
        selectionMode="null"
        headerStyle="width: 50px"
      >
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-center">
            <template v-if="selectionType === 'single'">
              <RadioButton
                :modelValue="isSelectedSingle(slotProps.data)"
                :disabled="isDisabled(slotProps.data)"
                @change="onSingleSelectionChange($event, slotProps.data)"
                :binary="true"
                :class="{ 'selected-row': isSelectedSingle(slotProps.data) }"
                name="selection-group"
              />
            </template>
            <template v-else>
              <Checkbox
                :modelValue="isSelected(slotProps.data)"
                :disabled="isDisabled(slotProps.data)"
                @change="onSelectionChange($event, slotProps.data)"
                :binary="true"
                :class="{ 'selected-row': isSelected(slotProps.data) }"
                :data-pre-selected="isPreSelected(slotProps.data)"
              />
            </template>
          </div>
        </template>

        <!-- Header checkbox for multiple selection -->
        <template #header v-if="selectionType === 'multiple'">
          <div class="flex align-items-center justify-content-center">
            <Checkbox
              :modelValue="isAllSelected"
              :disabled="false"
              @update:modelValue="onSelectAllChange"
              :binary="true"
            />
          </div>
        </template>
      </Column>

      <!-- Dynamic Columns -->
      <template v-for="col in columns" :key="col.field">
        <Column
          v-bind="col"
          :sortable="col.sortable !== false"
          :style="{
            'min-width': col.minWidth,
            width: col.width || 'auto',
            backgroundColor: col.backgroundColor || 'transparent',
          }"
          :alignHeader="col.align || 'left'"
          :bodyStyle="{ textAlign: col.align || 'left' }"
          :class="col.className"
        >
          <template #header v-if="$slots[`header-${col.field}`]">
            <slot :name="`header-${col.field}`"></slot>
          </template>

          <template #body="slotProps">
            <slot
              :name="`${col.field}Template`"
              v-bind="slotProps"
              v-if="$slots[`${col.field}Template`]"
            >
            </slot>
            <template v-else>
              <div :style="{ textAlign: col.align || 'left' }">
                <div v-if="col.format">
                  {{ formatValue(slotProps.data[col.field], col.format) }}
                </div>
                <div v-else>
                  {{ slotProps.data[col.field] }}
                </div>
              </div>
            </template>
          </template>
        </Column>
      </template>

      <!-- Empty template -->
      <template #empty>
        <slot name="empty">
          <div class="empty-message">
            <i class="pi pi-inbox"></i>
            <p>{{ emptyMessage }}</p>
          </div>
        </slot>
      </template>

      <!-- Custom Paginator Templates -->
      <template #paginatorstart>
        <slot name="paginatorstart"></slot>
      </template>

      <template #paginatorend>
        <div class="paginator-end-content">
          <slot name="paginator-buttons"></slot>
        </div>
      </template>

      <!-- Footer -->
      <template #footer v-if="$slots.footer">
        <slot name="footer" />
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  itemsSelection: {
    type: Array,
    default: () => [],
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
  selectionMode: {
    type: Boolean,
    default: false,
  },
  selectionType: {
    type: String,
    default: 'multiple',
    validator: (value) => ['single', 'multiple'].includes(value),
  },
  columns: {
    type: Array,
    required: true,
  },
  dataKey: {
    type: String,
    default: 'id',
  },
  showGridlines: {
    type: Boolean,
    default: true,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  scrollHeight: {
    type: String,
    default: 'calc(100vh - 340px)',
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  showViewButton: {
    type: Boolean,
    default: true,
  },
  paginator: {
    type: Boolean,
    default: true,
  },
  paginatorTemplate: {
    type: String,
    default:
      'paginatorstart FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport paginatorend',
  },
  currentPageReportTemplate: {
    type: String,
    default: 'แสดงข้อมูล {first} - {last} จากทั้งหมด {totalRecords} รายการ',
  },
  emptyMessage: {
    type: String,
    default: 'ไม่พบข้อมูล',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  expandable: {
    type: Boolean,
    default: false,
  },
  disabledItems: {
    type: Array,
    default: () => [],
  },
  preSelectedItems: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits([
  'page',
  'sort',
  'update:itemsSelection',
  'update:modelValue',
  'row-expand',
  'row-collapse',
])

// Refs
const expandedRows = ref([])

// Computed
const isAllSelected = computed(() => {
  if (props.items.length === 0) return false

  // Count only selectable items (non-preselected and non-disabled)
  const selectableItems = props.items.filter((item) => {
    const isPreSelectedItem = props.preSelectedItems.some(
      (preSelected) => preSelected[props.dataKey] === item[props.dataKey]
    )
    const isDisabledItem = isDisabled(item)
    return !isPreSelectedItem && !isDisabledItem
  })

  // Check if all selectable items are selected
  return (
    selectableItems.length > 0 &&
    selectableItems.every((item) =>
      props.itemsSelection.some(
        (selected) => selected[props.dataKey] === item[props.dataKey]
      )
    )
  )
})

// Watchers
watch(
  () => props.modelValue,
  (newVal) => {
    expandedRows.value = newVal
  },
  { deep: true }
)

watch(
  expandedRows,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

// Methods
const handlePageChange = (event) => {
  emit('page', {
    first: event.first,
    rows: event.rows,
  })
}

const handleSortChange = (event) => {
  // Convert PrimeVue multiSortMeta to backend format
  // PrimeVue format: [{ field: 'fieldName', order: 1 or -1 }]
  // Backend format: [{ field: 'fieldName', dir: 'asc' or 'desc' }]
  const sortArray = (event.multiSortMeta || []).map(sort => ({
    field: sort.field,
    dir: sort.order === 1 ? 'asc' : 'desc'
  }))

  emit('sort', {
    first: event.first,
    rows: event.rows,
    sort: sortArray
  })
}

const formatValue = (value, format) => {
  if (!value && value !== 0) return '-'

  switch (format) {
    case 'date':
      return value ? new Date(value).toLocaleDateString('th-TH') : '-'
    case 'datetime':
      return value ? new Date(value).toLocaleString('th-TH') : '-'
    case 'currency':
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
      }).format(value)
    case 'number':
      return new Intl.NumberFormat('th-TH').format(value)
    case 'decimal3':
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(value)
    case 'decimal2':
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    case 'decimal1':
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value)
    default:
      if (typeof format === 'string' && format.startsWith('decimal')) {
        const places = parseInt(format.replace('decimal', ''))
        if (!isNaN(places)) {
          return new Intl.NumberFormat('th-TH', {
            minimumFractionDigits: places,
            maximumFractionDigits: places,
          }).format(value)
        }
      }
      return value
  }
}

// Check if item is selected
const isSelected = (item) => {
  return (
    props.itemsSelection.some(
      (selected) => selected[props.dataKey] === item[props.dataKey]
    ) ||
    props.preSelectedItems.some(
      (preSelected) => preSelected[props.dataKey] === item[props.dataKey]
    )
  )
}

// Check if item is disabled
const isDisabled = (item) => {
  return props.disabledItems.some(
    (disabled) => disabled[props.dataKey] === item[props.dataKey]
  )
}

// Check if item is pre-selected
const isPreSelected = (item) => {
  return props.preSelectedItems.some(
    (preSelected) => preSelected[props.dataKey] === item[props.dataKey]
  )
}

// Handle select all change
const onSelectAllChange = (value) => {
  let newSelection = [...props.itemsSelection]

  if (value) {
    // Check all
    props.items.forEach((item) => {
      if (isPreSelected(item) || isDisabled(item)) return

      const exists = newSelection.some(
        (selected) => selected[props.dataKey] === item[props.dataKey]
      )
      if (!exists) {
        newSelection.push(item)
      }
    })
  } else {
    // Uncheck all
    newSelection = []
  }

  emit('update:itemsSelection', newSelection)
}

// Handle selection change
const onSelectionChange = (checked, item) => {
  if (isDisabled(item)) return

  const isPreSelectedItem = props.preSelectedItems.some(
    (preSelected) => preSelected[props.dataKey] === item[props.dataKey]
  )

  if (isPreSelectedItem) {
    return
  }

  let newSelection = [...props.itemsSelection]

  if (checked) {
    const exists = newSelection.some(
      (selected) => selected[props.dataKey] === item[props.dataKey]
    )
    if (!exists) {
      newSelection.push(item)
    } else {
      newSelection = newSelection.filter(
        (selected) => selected[props.dataKey] !== item[props.dataKey]
      )
    }
  } else {
    newSelection = newSelection.filter(
      (selected) => selected[props.dataKey] !== item[props.dataKey]
    )
  }

  emit('update:itemsSelection', newSelection)
}

// Check if item is selected in single mode
const isSelectedSingle = (item) => {
  return (
    props.itemsSelection.length === 1 &&
    props.itemsSelection[0][props.dataKey] === item[props.dataKey]
  )
}

// Handle single selection change
const onSingleSelectionChange = (checked, item) => {
  if (isDisabled(item)) return
  if (isPreSelected(item)) return

  let newSelection = []

  if (checked) {
    newSelection = [item]
  }

  emit('update:itemsSelection', newSelection)
}
</script>

<style lang="scss" scoped>
.base-datatable {
  :deep(.p-datatable) {
    font-size: 14px;

    // Header Styles - Pink Theme
    .p-datatable-thead > tr > th {
      background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
      padding: 0.75rem 1rem;
      border: 1px solid #ffd7e1;
      color: #ffffff;
      font-weight: 600;

      .p-column-header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .p-column-title {
          color: #ffffff;
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .p-sortable-column-icon,
        .pi {
          color: #ffffff;
          font-size: 0.875rem;
        }

        .p-sortable-column-badge {
          background-color: #ffffff;
          color: #ff69b4;
          font-size: 0.75rem;
          margin-left: 0.25rem;
          min-width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &.p-sortable-column {
        &:hover {
          background: linear-gradient(135deg, #ffa6b1 0%, #ffb0bb 100%);

          .p-sortable-column-icon,
          .pi {
            color: #ffffff;
          }
        }

        &.p-highlight {
          background: linear-gradient(135deg, #ff96a1 0%, #ffa0ab 100%);

          .p-sortable-column-icon,
          .pi {
            color: #ffffff;
          }
        }
      }
    }

    // Body Styles
    .p-datatable-tbody > tr {
      transition: all 0.2s;

      &.p-highlight {
        background-color: rgba(255, 182, 193, 0.2);

        &:hover {
          background-color: rgba(255, 182, 193, 0.3);
        }

        &:nth-child(even) {
          background-color: rgba(255, 182, 193, 0.25);
        }
      }

      > td {
        padding: 0.75rem 1rem;
        font-size: 14px;
        color: #374151;
        border: 1px solid #f3f4f6;
      }

      &:nth-child(even) {
        background-color: #fef8f9;
      }

      &:hover {
        background-color: rgba(255, 182, 193, 0.1);
      }
    }

    // Empty Message
    .p-datatable-emptymessage > td {
      text-align: center;
      padding: 3rem;
    }
  }

  // Paginator Styles - Pink Theme
  :deep(.p-paginator) {
    font-size: 11px;
    padding: 0.5rem;
    background: #ffffff;
    border: 1px solid #ffd7e1;
    border-radius: 8px;

    // Override PrimeVue default grid layout
    display: grid !important;
    grid-template-columns: auto 1fr auto !important;
    grid-template-areas: "left center right" !important;
    align-items: center !important;
    gap: 0.5rem !important;
    width: 100% !important;

    // Left section (First, Prev buttons)
    .p-paginator-left,
    > .p-paginator-first,
    > .p-paginator-prev {
      grid-area: left !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.25rem !important;
      flex-shrink: 0 !important;
    }

    // Center section (Page numbers, dropdown, current report)
    .p-paginator-pages,
    > .p-paginator-pages,
    > .p-dropdown,
    .p-paginator-current,
    > .p-paginator-current {
      grid-area: center !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.25rem !important;
      flex-shrink: 0 !important;
    }

    // Right section (Next, Last buttons)
    .p-paginator-right,
    > .p-paginator-next,
    > .p-paginator-last {
      grid-area: right !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.25rem !important;
      flex-shrink: 0 !important;
    }

    // All elements forced to not wrap
    * {
      flex-wrap: nowrap !important;
    }

    .p-paginator-first,
    .p-paginator-prev,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-page {
      min-width: 1.75rem !important;
      width: 1.75rem !important;
      height: 1.75rem !important;
      margin: 0 0.1rem !important;
      border: 1px solid #ffd7e1;
      border-radius: 6px;
      transition: all 0.2s;
      flex-shrink: 0 !important;
      font-size: 11px !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;

      &:not(.p-disabled):not(.p-highlight):hover {
        background: rgba(255, 182, 193, 0.1);
        border-color: #ffb6c1;
      }

      &.p-highlight {
        background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
        color: #ffffff;
        border-color: #ffb6c1;
      }
    }

    .p-paginator-pages {
      display: inline-flex !important;
      align-items: center !important;
      flex-wrap: nowrap !important;
      gap: 0.1rem !important;
      flex-shrink: 0 !important;
    }

    // Rows per page dropdown
    .p-dropdown,
    .p-paginator-rpp-options {
      height: 1.75rem !important;
      width: 90px !important;
      min-width: 90px !important;
      max-width: 90px  !important;
      margin: 0 0.25rem !important;
      border: 1px solid #ffd7e1 !important;
      border-radius: 6px !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
      font-size: 11px !important;

      &:hover {
        border-color: #ffb6c1 !important;
      }

      .p-dropdown-label {
        font-size: 11px !important;
        padding: 0.25rem 0.3rem !important;
        text-align: center !important;
        line-height: 1.2 !important;
      }

      .p-dropdown-trigger {
        width: 1.25rem !important;
      }

      &.p-inputwrapper {
        width: 90px !important;
        max-width: 90px !important;
      }
    }

    // Target the wrapper of dropdown if exists
    .p-paginator-rpp-options,
    span:has(> .p-dropdown) {
      width: 90px !important;
      max-width: 90px !important;
      flex-shrink: 0 !important;
    }

    .p-paginator-current {
      margin: 0 0.25rem !important;
      color: #6b7280;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      font-size: 11px !important;
      min-width: max-content !important;
      display: inline-block !important;
    }

    // Responsive: Switch to wrapped layout on smaller screens
    @media (max-width: 1200px) {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 0.5rem !important;

      .p-paginator-left,
      .p-paginator-right,
      .p-paginator-pages,
      .p-paginator-current,
      > * {
        grid-area: unset !important;
      }

      .p-paginator-current {
        width: 100%;
        text-align: center;
      }
    }
  }

  // Empty Message
  :deep(.empty-message) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    color: #9ca3af;

    i {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #ffb6c1;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }
  }

  // Action Buttons
  .btn-action-container {
    display: flex;
    gap: 0.5rem;
    justify-content: center;

    .btn {
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      transition: all 0.2s;

      i {
        font-size: 1rem;
      }
    }
  }

  // Loading Overlay
  :deep(.p-datatable-loading-overlay) {
    background: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // Table Scrollbar - Pink Theme
  :deep(.p-datatable-wrapper) {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
      border-radius: 4px;

      &:hover {
        background: linear-gradient(135deg, #ffa6b1 0%, #ffb0bb 100%);
      }
    }

    &::-webkit-scrollbar-track {
      background-color: #fef8f9;
      border-radius: 4px;
    }
  }

  // Resize Handle - Pink Theme
  :deep(.p-column-resizer) {
    &:hover {
      background-color: #ffb6c1;
    }
  }

  // Override for sort icons
  :deep(.p-datatable .p-sortable-column),
  :deep(.p-datatable .p-sortable-column.p-highlight) {
    .p-sortable-column-icon,
    .pi-sort,
    .pi-sort-amount-up-alt,
    .pi-sort-amount-down,
    .p-sortable-column-badge {
      color: #ffffff;
    }
  }

  // Expanded content - Pink Theme
  :deep(.expanded-row-content) {
    background-color: #fef8f9;
    border-bottom: 1px solid #ffd7e1;
    padding: 1rem;
  }

  // Expand button - Pink Theme
  :deep(.p-row-toggler) {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(255, 182, 193, 0.1);
    }

    .p-row-toggler-icon {
      font-size: 1rem;
      color: #ff69b4;
    }
  }

  // Checkbox & Radio Button - Pink Theme
  :deep(.p-checkbox),
  :deep(.p-radiobutton) {
    .p-checkbox-box,
    .p-radiobutton-box {
      border-color: #ffd7e1;

      &:hover {
        border-color: #ffb6c1;
      }

      &.p-highlight {
        background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
        border-color: #ffb6c1;
      }
    }

    &.selected-row {
      .p-checkbox-box,
      .p-radiobutton-box {
        background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
        border-color: #ffb6c1;
      }
    }
  }
}

// Flex utilities
.flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}
</style>

<style lang="scss">
// Global styles (not scoped) to override PrimeVue dropdown in paginator
.base-datatable .p-datatable .p-paginator .p-dropdown,
.base-datatable .p-paginator .p-dropdown,
.p-paginator .p-dropdown.p-component.p-inputwrapper,
.p-datatable-paginator .p-dropdown {
  width: 90px !important;
  min-width: 90px !important;
  max-width: 90px !important;
  height: 1.75rem !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  flex-basis: 90px !important;
}

.base-datatable .p-paginator .p-dropdown .p-dropdown-label,
.p-paginator .p-dropdown .p-dropdown-label {
  font-size: 11px !important;
  padding: 0.25rem 0.3rem !important;
  width: 100% !important;
  line-height: 1.2 !important;
}

.base-datatable .p-paginator .p-dropdown .p-dropdown-trigger,
.p-paginator .p-dropdown .p-dropdown-trigger {
  width: 1.25rem !important;
  flex-shrink: 0 !important;
}

// Additional override for inputwrapper
.p-paginator .p-inputwrapper,
.p-paginator .p-inputwrapper.p-inputwrapper-filled,
.p-paginator .p-inputwrapper.p-inputwrapper-focus {
  width: 90px !important;
  min-width: 90px !important;
  max-width: 90px !important;
  height: 1.75rem !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
}

// Force enable dropdown (override disabled state)
.p-paginator .p-dropdown,
.p-paginator .p-dropdown.p-disabled {
  pointer-events: auto !important;
  opacity: 1 !important;
  cursor: pointer !important;
}

.p-paginator .p-dropdown .p-dropdown-trigger,
.p-paginator .p-dropdown.p-disabled .p-dropdown-trigger {
  pointer-events: auto !important;
  cursor: pointer !important;
}

.p-paginator .p-dropdown .p-dropdown-label,
.p-paginator .p-dropdown.p-disabled .p-dropdown-label {
  cursor: pointer !important;
}
</style>
