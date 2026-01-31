<template>
  <div class="form-calendar-wrapper">
    <Calendar
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :dateFormat="dateFormat"
      :showIcon="showIcon"
      :iconDisplay="iconDisplay"
      :showButtonBar="showButtonBar"
      :minDate="minDate"
      :maxDate="maxDate"
      :disabledDates="disabledDates"
      :disabledDays="disabledDays"
      :selectionMode="selectionMode"
      :inline="inline"
      :showTime="showTime"
      :timeOnly="timeOnly"
      :hourFormat="hourFormat"
      :numberOfMonths="numberOfMonths"
      :view="view"
      :touchUI="touchUI"
      :monthNavigator="monthNavigator"
      :yearNavigator="yearNavigator"
      :yearRange="yearRange"
      :appendTo="appendTo"
      :manualInput="manualInput"
      :class="{ 'p-invalid': invalid }"
      @date-select="handleDateSelect"
      @show="handleShow"
      @hide="handleHide"
      @today-click="handleTodayClick"
      @clear-click="handleClearClick"
      @month-change="handleMonthChange"
      @year-change="handleYearChange"
    >
      <!-- Pass through all slots for customization -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </Calendar>
  </div>
</template>

<script>
import Calendar from 'primevue/calendar'

export default {
  name: 'CalendarComponent',

  components: {
    Calendar
  },

  props: {
    // v-model binding
    modelValue: {
      type: [Date, Array, String],
      default: null
    },

    // Placeholder text
    placeholder: {
      type: String,
      default: 'เลือกวันที่'
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Date format (e.g., 'dd/mm/yy')
    dateFormat: {
      type: String,
      default: 'dd/mm/yy'
    },

    // Show calendar icon
    showIcon: {
      type: Boolean,
      default: true
    },

    // Icon display mode: 'button' or 'input'
    iconDisplay: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'input'].includes(value)
    },

    // Show button bar (Today, Clear)
    showButtonBar: {
      type: Boolean,
      default: false
    },

    // Minimum selectable date
    minDate: {
      type: Date,
      default: null
    },

    // Maximum selectable date
    maxDate: {
      type: Date,
      default: null
    },

    // Array of disabled dates
    disabledDates: {
      type: Array,
      default: null
    },

    // Array of disabled days (0=Sunday, 1=Monday, etc.)
    disabledDays: {
      type: Array,
      default: null
    },

    // Selection mode: 'single', 'multiple', 'range'
    selectionMode: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'multiple', 'range'].includes(value)
    },

    // Display inline
    inline: {
      type: Boolean,
      default: false
    },

    // Show time picker
    showTime: {
      type: Boolean,
      default: false
    },

    // Time only picker
    timeOnly: {
      type: Boolean,
      default: false
    },

    // Hour format: '12' or '24'
    hourFormat: {
      type: String,
      default: '24',
      validator: (value) => ['12', '24'].includes(value)
    },

    // Number of months to display
    numberOfMonths: {
      type: Number,
      default: 1
    },

    // View mode: 'date', 'month', 'year'
    view: {
      type: String,
      default: 'date',
      validator: (value) => ['date', 'month', 'year'].includes(value)
    },

    // Touch UI mode
    touchUI: {
      type: Boolean,
      default: false
    },

    // Month navigator dropdown
    monthNavigator: {
      type: Boolean,
      default: false
    },

    // Year navigator dropdown
    yearNavigator: {
      type: Boolean,
      default: false
    },

    // Year range for navigator (e.g., '2000:2030')
    yearRange: {
      type: String,
      default: null
    },

    // Append overlay to element
    appendTo: {
      type: String,
      default: 'body'
    },

    // Allow manual input
    manualInput: {
      type: Boolean,
      default: true
    },

    // Invalid state for validation
    invalid: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'update:modelValue',
    'date-select',
    'show',
    'hide',
    'today-click',
    'clear-click',
    'month-change',
    'year-change'
  ],

  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
    handleDateSelect(event) {
      this.$emit('date-select', event)
    },

    handleShow() {
      this.$emit('show')
    },

    handleHide() {
      this.$emit('hide')
    },

    handleTodayClick(event) {
      this.$emit('today-click', event)
    },

    handleClearClick(event) {
      this.$emit('clear-click', event)
    },

    handleMonthChange(event) {
      this.$emit('month-change', event)
    },

    handleYearChange(event) {
      this.$emit('year-change', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-calendar-wrapper {
  width: 100%;

  // Root wrapper: p-datepicker is the root element (inline, not the overlay panel)
  :deep(.p-datepicker) {
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    padding: 0 !important;

    // Input field (v4 class)
    .p-datepicker-input {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.75rem !important;
      min-height: 30px !important;
      height: 30px !important;
      border: 1px solid #e5e7eb !important;
      //border-radius: 8px !important;
      transition: all 0.2s !important;
      width: 100% !important;
      box-sizing: border-box !important;

      &::placeholder {
        font-size: 0.75rem !important;
        color: #9ca3af !important;
      }

      &:hover:not(:disabled) {
        border-color: #d1d5db !important;
      }

      &:focus {
        border-color: #e7de99 !important;
        box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1) !important;
        outline: none !important;
      }
    }

    // Dropdown button (v4 class)
    .p-datepicker-dropdown {
      width: 30px !important;
      height: 30px !important;
      padding: 0 !important;
      //border-radius: 8px !important;
      background: transparent !important;
      border: 1px solid #e5e7eb !important;
      color: #6b7280 !important;
      transition: all 0.2s !important;
      justify-content: center !important;

      .p-icon,
      svg {
        width: 0.75rem !important;
        height: 0.75rem !important;
      }

      &:hover:not(:disabled) {
        background: rgba(231, 222, 153, 0.1) !important;
        border-color: #e7de99 !important;
        color: #e7de99 !important;
      }

      &:focus {
        box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.2) !important;
        outline: none !important;
      }
    }

    // Invalid state
    &.p-invalid {
      .p-datepicker-input {
        border-color: #ef4444 !important;

        &:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      }
    }

    // Disabled state
    &.p-disabled {
      .p-datepicker-input {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f3f4f6 !important;
      }

      .p-datepicker-dropdown {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>

<!-- Global styles for calendar overlay panel (portalled to body, needs unscoped) -->
<style lang="scss">
.p-datepicker-panel {
  background: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
  padding: 0.5rem !important;
  font-size: 0.75rem !important;

  // Header
  .p-datepicker-header {
    padding: 0.375rem !important;
    background: transparent !important;
    border-bottom: 1px solid #e5e7eb !important;
    margin-bottom: 0.375rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;

    .p-datepicker-title {
      font-size: 0.8125rem !important;
      font-weight: 600 !important;
      color: #374151 !important;
      gap: 0.25rem !important;
      display: flex !important;
      align-items: center !important;
    }

    .p-datepicker-select-month,
    .p-datepicker-select-year {
      font-size: 0.8125rem !important;
      padding: 0.125rem 0.25rem !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      border: none !important;
      background: transparent !important;
      color: #374151 !important;
      font-weight: 600 !important;

      &:hover {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }
    }

    .p-datepicker-prev-button,
    .p-datepicker-next-button {
      width: 24px !important;
      height: 24px !important;
      border-radius: 6px !important;
      color: #6b7280 !important;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;

      &:hover {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }

      svg, .p-icon {
        width: 0.75rem !important;
        height: 0.75rem !important;
      }
    }
  }

  // Calendar grid
  .p-datepicker-calendar-container {
    .p-datepicker-calendar {
      width: 100% !important;
    }
  }

  // Day headers (weekdays)
  .p-datepicker-weekday-cell {
    padding: 0.25rem !important;
    text-align: center !important;

    .p-datepicker-weekday {
      font-size: 0.6875rem !important;
      font-weight: 600 !important;
      color: #6b7280 !important;
    }
  }

  // Day cells
  .p-datepicker-day-cell {
    padding: 0.125rem !important;
    text-align: center !important;

    .p-datepicker-day {
      width: 28px !important;
      height: 28px !important;
      border-radius: 6px !important;
      font-size: 0.6875rem !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s !important;
      cursor: pointer !important;
      border: none !important;
      background: transparent !important;
      color: #374151 !important;
      margin: 0 auto !important;

      &:hover:not([data-p-disabled="true"]) {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }

      &[data-p-disabled="true"] {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
      }
    }

    // Selected day
    &.p-datepicker-day-selected .p-datepicker-day,
    .p-datepicker-day-selected {
      background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%) !important;
      color: #1f2937 !important;
      font-weight: 600 !important;

      &:hover {
        background: linear-gradient(135deg, #dfd070 0%, #dfd070 100%) !important;
      }
    }

    // Today
    &.p-datepicker-today .p-datepicker-day {
      border: 1px solid #e7de99 !important;
      color: #e7de99 !important;
      font-weight: 600 !important;

      &.p-datepicker-day-selected {
        background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%) !important;
        color: #1f2937 !important;
        border-color: transparent !important;
      }
    }
  }

  // Month view
  .p-datepicker-month-view {
    .p-datepicker-month {
      padding: 0.375rem !important;
      border-radius: 6px !important;
      font-size: 0.75rem !important;
      transition: all 0.2s !important;
      cursor: pointer !important;
      border: none !important;
      background: transparent !important;
      color: #374151 !important;

      &:hover:not([data-p-disabled="true"]) {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }

      &.p-datepicker-month-selected {
        background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%) !important;
        color: #1f2937 !important;
        font-weight: 600 !important;
      }
    }
  }

  // Year view
  .p-datepicker-year-view {
    .p-datepicker-year {
      padding: 0.375rem !important;
      border-radius: 6px !important;
      font-size: 0.75rem !important;
      transition: all 0.2s !important;
      cursor: pointer !important;
      border: none !important;
      background: transparent !important;
      color: #374151 !important;

      &:hover:not([data-p-disabled="true"]) {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }

      &.p-datepicker-year-selected {
        background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%) !important;
        color: #1f2937 !important;
        font-weight: 600 !important;
      }
    }
  }

  // Time picker
  .p-datepicker-time-picker {
    padding: 0.5rem !important;
    border-top: 1px solid #e5e7eb !important;
    margin-top: 0.375rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.25rem !important;

    .p-datepicker-increment-button,
    .p-datepicker-decrement-button {
      width: 24px !important;
      height: 24px !important;
      border-radius: 6px !important;
      color: #6b7280 !important;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;

      &:hover {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }

      svg, .p-icon {
        width: 0.75rem !important;
        height: 0.75rem !important;
      }
    }

    .p-datepicker-separator {
      font-size: 0.8125rem !important;
      color: #374151 !important;
      font-weight: 600 !important;
    }

    .p-datepicker-hour-picker,
    .p-datepicker-minute-picker,
    .p-datepicker-second-picker,
    .p-datepicker-ampm-picker {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.125rem !important;

      span {
        font-size: 0.8125rem !important;
        color: #374151 !important;
        font-weight: 600 !important;
      }
    }
  }

  // Button bar (Today / Clear)
  .p-datepicker-buttonbar {
    padding: 0.375rem !important;
    border-top: 1px solid #e5e7eb !important;
    margin-top: 0.375rem !important;
    display: flex !important;
    gap: 0.375rem !important;

    .p-datepicker-today-button,
    .p-datepicker-clear-button {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.75rem !important;
      height: 26px !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
      color: #6b7280 !important;
      border: none !important;
      background: transparent !important;
      cursor: pointer !important;

      &:hover {
        background: rgba(231, 222, 153, 0.1) !important;
        color: #e7de99 !important;
      }
    }
  }
}
</style>
