<template>
  <div class="form-multi-select-wrapper">
    <MultiSelect
      v-model="model"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :optionGroupLabel="optionGroupLabel"
      :optionGroupChildren="optionGroupChildren"
      :placeholder="placeholder"
      :disabled="disabled"
      :filter="filter"
      :filterPlaceholder="filterPlaceholder"
      :display="display"
      :showToggleAll="showToggleAll"
      :selectionLimit="selectionLimit"
      :maxSelectedLabels="maxSelectedLabels"
      :selectedItemsLabel="selectedItemsLabel"
      :emptyFilterMessage="emptyFilterMessage"
      :emptyMessage="emptyMessage"
      :appendTo="appendTo"
      :virtualScrollerOptions="virtualScrollerOptions"
      :class="{ 'p-invalid': invalid }"
      @change="handleChange"
      @filter="handleFilter"
      @focus="handleFocus"
      @blur="handleBlur"
      @show="handleShow"
      @hide="handleHide"
    >
      <!-- Pass through all slots for customization -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </MultiSelect>
  </div>
</template>

<script>
import MultiSelect from 'primevue/multiselect'

export default {
  name: 'MultiSelectComponent',

  components: {
    MultiSelect
  },

  props: {
    // v-model binding
    modelValue: {
      type: [Array, String, Number, Object],
      default: null
    },

    // Options array
    options: {
      type: Array,
      default: () => []
    },

    // Option label field
    optionLabel: {
      type: String,
      default: 'label'
    },

    // Option value field
    optionValue: {
      type: String,
      default: 'value'
    },

    // Option group label
    optionGroupLabel: {
      type: String,
      default: null
    },

    // Option group children
    optionGroupChildren: {
      type: String,
      default: null
    },

    // Placeholder text
    placeholder: {
      type: String,
      default: 'เลือกรายการ'
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Enable filter
    filter: {
      type: Boolean,
      default: true
    },

    // Filter placeholder
    filterPlaceholder: {
      type: String,
      default: 'ค้นหา...'
    },

    // Display mode: 'comma' or 'chip'
    display: {
      type: String,
      default: 'chip',
      validator: (value) => ['comma', 'chip'].includes(value)
    },

    // Show toggle all checkbox
    showToggleAll: {
      type: Boolean,
      default: true
    },

    // Maximum number of selections
    selectionLimit: {
      type: Number,
      default: null
    },

    // Maximum selected labels to display
    maxSelectedLabels: {
      type: Number,
      default: 3
    },

    // Label when items exceed maxSelectedLabels
    selectedItemsLabel: {
      type: String,
      default: '{0} รายการถูกเลือก'
    },

    // Empty filter message
    emptyFilterMessage: {
      type: String,
      default: 'ไม่พบผลลัพธ์'
    },

    // Empty message
    emptyMessage: {
      type: String,
      default: 'ไม่มีข้อมูล'
    },

    // Append panel to body
    appendTo: {
      type: String,
      default: 'body'
    },

    // Virtual scroller options
    virtualScrollerOptions: {
      type: Object,
      default: null
    },

    // Invalid state
    invalid: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'update:modelValue',
    'change',
    'filter',
    'focus',
    'blur',
    'show',
    'hide'
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
    handleChange(event) {
      this.$emit('change', event)
    },

    handleFilter(event) {
      this.$emit('filter', event)
    },

    handleFocus(event) {
      this.$emit('focus', event)
    },

    handleBlur(event) {
      this.$emit('blur', event)
    },

    handleShow() {
      this.$emit('show')
    },

    handleHide() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-multi-select-wrapper {
  width: 100%;

  :deep(.p-multiselect) {
    width: 100%;
    min-height: 30px; // Compact height

    // Main trigger button
    .p-multiselect-label-container {
      .p-multiselect-label {
        padding: 0.25rem 0.5rem; // Compact padding
        font-size: 0.75rem; // 12px
        min-height: auto;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex-wrap: wrap;

        // Chips display mode
        &.p-multiselect-chip-item {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%); // Gold
          color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.6875rem; // 11px
          font-weight: 500;
          margin: 0.125rem;
        }

        &.p-placeholder {
          color: #9ca3af;
          font-size: 0.75rem;
        }
      }
    }

    // Trigger button
    .p-multiselect-trigger {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      .p-icon {
        font-size: 0.75rem;
      }
    }

    // Border and states
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s;

    &:not(.p-disabled):hover {
      border-color: #d1d5db;
    }

    &.p-focus {
      border-color: #e7de99; // Gold theme
      box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
      outline: none;
    }

    // Invalid state
    &.p-invalid {
      border-color: #ef4444;

      &.p-focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }

    // Disabled state
    &.p-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #f3f4f6;
    }

    // Chips inside the trigger
    .p-multiselect-chip {
      background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%); // Gold
      color: #1f2937;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.6875rem; // 11px
      font-weight: 500;
      margin: 0.125rem;

      .p-multiselect-chip-icon {
        font-size: 0.625rem;
        margin-left: 0.25rem;
      }
    }
  }
}
</style>

<style lang="scss">
// Global styles for overlay panel (not scoped)
.p-multiselect-overlay {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  margin-top: 0.25rem;

  .p-multiselect-header {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;

    .p-multiselect-filter-container {
      .p-multiselect-filter {
        padding: 0.25rem 0.5rem; // Compact
        font-size: 0.75rem; // 12px
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        min-height: 30px;

        &:focus {
          border-color: #e7de99; // Gold
          box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.1);
          outline: none;
        }
      }

      .p-multiselect-filter-icon {
        font-size: 0.75rem;
        color: #9ca3af;
      }
    }

    .p-multiselect-select-all {
      padding: 0.375rem 0.5rem; // Compact
      font-size: 0.75rem; // 12px
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.2s;

      &:hover {
        background: rgba(231, 222, 153, 0.1); // Gold hover
      }

      .p-checkbox {
        width: 16px;
        height: 16px;

        .p-checkbox-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
      }
    }

    .p-multiselect-close-button {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      color: #6b7280;

      &:hover {
        background: rgba(231, 222, 153, 0.1);
        color: #e7de99;
      }

      .p-icon {
        font-size: 0.75rem;
      }
    }
  }

  .p-multiselect-list-container {
    .p-multiselect-list {
      padding: 0.25rem;
      max-height: 300px; // Compact

      .p-multiselect-option {
        padding: 0.375rem 0.75rem; // Compact
        margin: 0.125rem 0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.75rem; // 12px
        color: #374151;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
          background: rgba(231, 222, 153, 0.1); // Gold hover
          color: #1f2937;
        }

        &.p-multiselect-option-selected {
          background: rgba(231, 222, 153, 0.2); // Gold selected
          color: #1f2937;
          font-weight: 600;
        }

        &.p-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .p-checkbox {
          width: 16px;
          height: 16px;

          .p-checkbox-box {
            width: 16px;
            height: 16px;
            border: 1px solid #d1d5db;
            border-radius: 4px;

            &.p-highlight {
              background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
              border-color: #e7de99;

              .p-checkbox-icon {
                color: #1f2937;
                font-size: 0.625rem;
              }
            }
          }
        }
      }

      .p-multiselect-empty-message {
        padding: 0.75rem;
        text-align: center;
        color: #9ca3af;
        font-size: 0.75rem; // 12px
      }
    }
  }

  // Virtual scroller
  .p-virtualscroller {
    .p-virtualscroller-content {
      .p-multiselect-option {
        padding: 0.375rem 0.75rem;
      }
    }
  }
}
</style>
