<template>
  <div class="form-autocomplete-wrapper">
    <AutoComplete
      v-model="model"
      :suggestions="filteredSuggestions"
      :field="field"
      :placeholder="placeholder"
      :disabled="disabled"
      :dropdown="dropdown"
      :multiple="multiple"
      :minLength="minLength"
      :delay="delay"
      :forceSelection="forceSelection"
      :autoHighlight="autoHighlight"
      :completeOnFocus="completeOnFocus"
      :inputClass="inputClasses"
      :class="{ 'p-invalid': invalid }"
      :emptySearchMessage="emptySearchMessage"
      :virtualScrollerOptions="virtualScrollerOptions"
      appendTo="body"
      @complete="handleComplete"
      @item-select="handleItemSelect"
      @item-unselect="handleItemUnselect"
      @dropdown-click="handleDropdownClick"
      @clear="handleClear"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- Pass through all slots for customization -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </AutoComplete>
  </div>
</template>

<script>
import AutoComplete from 'primevue/autocomplete'

export default {
  name: 'AutoCompleteComponent',

  components: {
    AutoComplete
  },

  props: {
    // v-model binding
    modelValue: {
      type: [String, Number, Object, Array],
      default: null
    },

    // Suggestions array
    suggestions: {
      type: Array,
      default: () => []
    },

    // Field name for suggestion object display (e.g., 'name', 'label')
    field: {
      type: String,
      default: null
    },

    // Placeholder text
    placeholder: {
      type: String,
      default: 'ค้นหา...'
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Show dropdown button
    dropdown: {
      type: Boolean,
      default: false
    },

    // Multiple selection mode
    multiple: {
      type: Boolean,
      default: false
    },

    // Minimum characters to trigger search
    minLength: {
      type: Number,
      default: 1
    },

    // Delay before search (milliseconds)
    delay: {
      type: Number,
      default: 300
    },

    // Force selection from suggestions only
    forceSelection: {
      type: Boolean,
      default: false
    },

    // Auto highlight first suggestion
    autoHighlight: {
      type: Boolean,
      default: true
    },

    // Show suggestions on focus
    completeOnFocus: {
      type: Boolean,
      default: false
    },

    // Invalid state for validation
    invalid: {
      type: Boolean,
      default: false
    },

    // Empty search message
    emptySearchMessage: {
      type: String,
      default: 'ไม่พบข้อมูล'
    },

    // Virtual scroller for large datasets
    virtualScrollerOptions: {
      type: Object,
      default: null
    },

    // Custom filter function (optional)
    customFilter: {
      type: Function,
      default: null
    }
  },

  emits: [
    'update:modelValue',
    'complete',
    'item-select',
    'item-unselect',
    'dropdown-click',
    'clear',
    'focus',
    'blur'
  ],

  data() {
    return {
      filteredSuggestions: []
    }
  },

  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },

    inputClasses() {
      return {
        'p-invalid': this.invalid
      }
    }
  },

  watch: {
    suggestions: {
      handler(newVal) {
        this.filteredSuggestions = newVal
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    handleComplete(event) {
      const query = event.query

      // Use custom filter if provided
      if (this.customFilter) {
        this.filteredSuggestions = this.customFilter(this.suggestions, query)
      } else {
        // Default filtering logic
        this.filteredSuggestions = this.filterSuggestions(query)
      }

      this.$emit('complete', {
        originalEvent: event,
        query: query,
        suggestions: this.filteredSuggestions
      })
    },

    filterSuggestions(query) {
      if (!query) {
        return this.suggestions
      }

      const searchQuery = query.toLowerCase().trim()

      return this.suggestions.filter(item => {
        // Handle string items
        if (typeof item === 'string') {
          return item.toLowerCase().includes(searchQuery)
        }

        // Handle object items
        if (typeof item === 'object' && item !== null) {
          // If field is specified, search in that field
          if (this.field && item[this.field]) {
            return String(item[this.field]).toLowerCase().includes(searchQuery)
          }

          // Otherwise, search in all string fields
          return Object.values(item).some(value => {
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchQuery)
            }
            return false
          })
        }

        return false
      })
    },

    handleItemSelect(event) {
      this.$emit('item-select', event)
    },

    handleItemUnselect(event) {
      this.$emit('item-unselect', event)
    },

    handleDropdownClick(event) {
      // Show all suggestions when dropdown is clicked
      this.filteredSuggestions = this.suggestions
      this.$emit('dropdown-click', event)
    },

    handleClear(event) {
      this.$emit('clear', event)
    },

    handleFocus(event) {
      this.$emit('focus', event)
    },

    handleBlur(event) {
      this.$emit('blur', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-autocomplete-wrapper {
  width: 100%;

  :deep(.p-autocomplete) {
    width: 100%;

    // Input field styling - Compact size
    .p-autocomplete-input {
      width: 100%;
      min-height: 30px;
      height: 30px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem; // 12px for compact sizing
      transition: all 0.2s;
      color: #374151;

      &::placeholder {
        color: #9ca3af;
        font-size: 0.75rem;
      }

      &:enabled:hover {
        border-color: #9ca3af;
      }

      &:enabled:focus {
        outline: none;
        border-color: #ff69b4; // Pink theme
        box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.1);
      }
    }

    // Invalid state
    &.p-invalid {
      .p-autocomplete-input {
        border-color: #ef4444 !important;

        &:enabled:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
        }
      }
    }

    // Dropdown button
    .p-autocomplete-dropdown {
      background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%); // Pink gradient
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 0 6px 6px 0;
      transition: all 0.2s;

      &:enabled:hover {
        background: linear-gradient(135deg, #ff1493 0%, #c71585 100%);
      }

      .p-icon {
        font-size: 0.75rem;
      }
    }

    // Multiple selection chips
    .p-autocomplete-multiple-container {
      min-height: 30px;
      padding: 0.125rem 0.25rem;
      gap: 0.25rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;

      .p-autocomplete-token {
        padding: 0.125rem 0.375rem;
        background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
        color: white;
        border-radius: 4px;
        font-size: 0.6875rem; // 11px
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        .p-autocomplete-token-label {
          line-height: 1.2;
        }

        .p-autocomplete-token-icon {
          font-size: 0.625rem;
          cursor: pointer;

          &:hover {
            color: #fff;
          }
        }
      }

      .p-autocomplete-input-token {
        padding: 0.125rem 0.25rem;

        input {
          font-size: 0.75rem;
          padding: 0;
          margin: 0;
        }
      }
    }

    // Loader icon
    .p-autocomplete-loader {
      font-size: 0.875rem;
      color: #ff69b4;
    }
  }
}
</style>

<style lang="scss">
// Global styles for dropdown panel (not scoped)
.p-autocomplete-overlay {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  margin-top: 0.25rem;
  font-size: 0.75rem; // 12px for compact sizing

  .p-autocomplete-list {
    padding: 0.25rem;
    max-height: 300px; // Compact scroll height

    .p-autocomplete-option {
      padding: 0.375rem 0.75rem;
      margin: 0.125rem 0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.75rem; // 12px
      color: #374151;

      &:hover {
        background: rgba(255, 105, 180, 0.1); // Pink hover
        color: #ff69b4;
      }

      &.p-highlight {
        background: linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(255, 20, 147, 0.15) 100%);
        color: #ff1493;
      }

      &.p-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    // Empty message
    .p-autocomplete-empty-message {
      padding: 0.75rem;
      text-align: center;
      color: #9ca3af;
      font-size: 0.75rem;
    }
  }

  // Virtual scroller
  .p-virtualscroller {
    .p-virtualscroller-content {
      .p-autocomplete-option {
        padding: 0.375rem 0.75rem;
      }
    }
  }
}
</style>
