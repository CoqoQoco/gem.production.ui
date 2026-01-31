<template>
  <div class="form-input-chips-wrapper">
    <InputChips
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :separator="separator"
      :allowDuplicate="allowDuplicate"
      :addOnBlur="addOnBlur"
      :max="max"
      :inputClass="inputClasses"
      :class="{ 'p-invalid': invalid }"
      @add="handleAdd"
      @remove="handleRemove"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- Pass through all slots for customization -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </InputChips>
  </div>
</template>

<script>
import InputChips from 'primevue/inputchips'

export default {
  name: 'InputChipsComponent',

  components: {
    InputChips
  },

  props: {
    // v-model binding
    modelValue: {
      type: Array,
      default: () => []
    },

    // Placeholder text
    placeholder: {
      type: String,
      default: 'กด Enter เพื่อเพิ่ม'
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Separator character to split input (e.g., ',')
    separator: {
      type: [String, RegExp],
      default: null
    },

    // Allow duplicate values
    allowDuplicate: {
      type: Boolean,
      default: true
    },

    // Add chip on blur event
    addOnBlur: {
      type: Boolean,
      default: false
    },

    // Maximum number of chips
    max: {
      type: Number,
      default: null
    },

    // Invalid state for validation
    invalid: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'update:modelValue',
    'add',
    'remove',
    'focus',
    'blur'
  ],

  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(value) {
        // Trim all string values
        const trimmedValue = value.map(item =>
          typeof item === 'string' ? item.trim() : item
        ).filter(item => item !== '')

        this.$emit('update:modelValue', trimmedValue)
      }
    },

    inputClasses() {
      return {
        'p-invalid': this.invalid
      }
    }
  },

  methods: {
    handleAdd(event) {
      this.$emit('add', event)
    },

    handleRemove(event) {
      this.$emit('remove', event)
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
.form-input-chips-wrapper {
  width: 100%;

  :deep(.p-inputchips) {
    width: 100%;

    // Main input container (ul element)
    .p-inputchips-input {
      margin: 0 !important;
      list-style-type: none !important;
      cursor: text !important;
      overflow: hidden !important;
      display: flex !important;
      align-items: center !important;
      flex-wrap: wrap !important; // Allow wrapping when many chips
      padding: 0.25rem 0.5rem !important; // Compact padding
      gap: 0.25rem !important;
      color: #1f2937 !important;
      background: white !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      width: 100% !important;
      transition: background 0.2s, color 0.2s, border-color 0.2s, outline-color 0.2s, box-shadow 0.2s !important;
      outline-color: transparent !important;
      box-shadow: none !important;
      min-height: 30px !important; // Compact height

      &:hover {
        border-color: #d1d5db !important;
      }

      &:focus-within {
        border-color: #e7de99 !important; // Gold theme
        box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1) !important;
        outline: none !important;
      }
    }

    // Individual chip
    .p-inputchips-chip {
      display: inline-flex !important;
      align-items: center !important;
      background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%) !important; // Gold gradient
      color: #1f2937 !important;
      padding: 0.125rem 0.375rem !important; // Compact chip
      border-radius: 4px !important;
      font-size: 0.6875rem !important; // 11px
      font-weight: 500 !important;
      margin: 0 !important;
      height: auto !important;
      line-height: 1.2 !important;

      .p-inputchips-chip-label {
        font-size: 0.6875rem !important;
      }

      .p-inputchips-chip-icon {
        font-size: 0.6875rem !important;
        margin-left: 0.25rem !important;
        cursor: pointer !important;

        &:hover {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      }
    }

    // Input item (li element containing input field)
    .p-inputchips-input-item {
      flex: 1 !important;
      padding: 0 !important;
      margin: 0 !important;
      list-style: none !important;

      input {
        width: 100% !important;
        padding: 0.125rem 0.25rem !important;
        font-size: 0.75rem !important; // 12px
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
        min-height: auto !important;
        height: auto !important;
        line-height: 1.5 !important;
        color: #1f2937 !important;

        &::placeholder {
          font-size: 0.75rem !important; // 12px
          color: #9ca3af !important;
        }
      }
    }

    // Invalid state
    &.p-invalid {
      .p-inputchips-input {
        border-color: #ef4444 !important;

        &:focus-within {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      }
    }

    // Disabled state
    &.p-disabled {
      .p-inputchips-input {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f3f4f6 !important;
      }
    }
  }
}
</style>
