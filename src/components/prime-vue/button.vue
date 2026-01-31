<template>
  <Button
    :label="label"
    :icon="icon"
    :iconPos="iconPos"
    :loading="loading"
    :disabled="disabled"
    :severity="severity"
    :text="text"
    :outlined="outlined"
    :raised="raised"
    :rounded="rounded"
    :size="size"
    :badge="badge"
    :badgeClass="badgeClass"
    :type="type"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Pass through all slots for customization -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </Button>
</template>

<script>
import Button from 'primevue/button'

export default {
  name: 'ButtonComponent',

  components: {
    Button
  },

  props: {
    // Label text
    label: {
      type: String,
      default: null
    },

    // Icon class
    icon: {
      type: String,
      default: null
    },

    // Icon position: 'left' or 'right'
    iconPos: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value)
    },

    // Loading state
    loading: {
      type: Boolean,
      default: false
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Severity: 'primary', 'secondary', 'success', 'info', 'warning', 'danger'
    severity: {
      type: String,
      default: null
    },

    // Text button (no background)
    text: {
      type: Boolean,
      default: false
    },

    // Outlined button
    outlined: {
      type: Boolean,
      default: false
    },

    // Raised button (with shadow)
    raised: {
      type: Boolean,
      default: false
    },

    // Rounded button
    rounded: {
      type: Boolean,
      default: false
    },

    // Size: 'small', 'large'
    size: {
      type: String,
      default: null
    },

    // Badge value
    badge: {
      type: String,
      default: null
    },

    // Badge class
    badgeClass: {
      type: String,
      default: null
    },

    // Button type: 'button', 'submit', 'reset'
    type: {
      type: String,
      default: 'button'
    }
  },

  emits: ['click'],

  computed: {
    buttonClasses() {
      return {
        'compact-button': true
      }
    }
  },

  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.compact-button {
  :deep(.p-button) {
    padding: 0.375rem 0.75rem; // Compact padding
    font-size: 0.75rem; // 12px
    min-height: 30px; // Compact height
    height: 30px;
    gap: 0.375rem; // Gap between icon and text
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;

    .p-button-label {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .p-button-icon {
      font-size: 0.75rem;
    }

    // Loading icon
    .p-button-loading-icon {
      font-size: 0.75rem;
    }
  }
}
</style>

<style lang="scss">
// Global button styles (not scoped) for consistent compact sizing
.compact-button.p-button {
  padding: 0.375rem 0.75rem !important;
  font-size: 0.75rem !important;
  min-height: 30px !important;
  height: 30px !important;
  gap: 0.375rem !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;

  .p-button-label {
    font-size: 0.75rem !important;
    font-weight: 600 !important;
  }

  .p-button-icon {
    font-size: 0.75rem !important;
  }

  .p-button-loading-icon {
    font-size: 0.75rem !important;
  }

  // Primary button - Gold theme
  &.p-button-primary:not(.p-button-outlined):not(.p-button-text) {
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
    color: #1f2937;
    border: none;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #dfd070 0%, #dfd070 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }

    &:active:not(:disabled) {
      background: linear-gradient(135deg, #c0ab28 0%, #c0ab28 100%);
      transform: translateY(0);
    }
  }

  // Outlined button
  &.p-button-outlined {
    border-width: 1px !important;
    background: transparent;

    &.p-button-primary {
      border-color: #e7de99;
      color: #e7de99;

      &:hover:not(:disabled) {
        background: rgba(231, 222, 153, 0.1);
        border-color: #dfd070;
        color: #dfd070;
      }
    }

    &.p-button-secondary {
      border-color: #6b7280;
      color: #6b7280;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        border-color: #9ca3af;
        color: #374151;
      }
    }
  }

  // Text button
  &.p-button-text {
    background: transparent;
    border: none;

    &.p-button-primary {
      color: #e7de99;

      &:hover:not(:disabled) {
        background: rgba(231, 222, 153, 0.1);
        color: #dfd070;
      }
    }

    &.p-button-secondary {
      color: #6b7280;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        color: #374151;
      }
    }
  }

  // Secondary button
  &.p-button-secondary:not(.p-button-outlined):not(.p-button-text) {
    background: #6b7280;
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #4b5563;
    }

    &:active:not(:disabled) {
      background: #374151;
    }
  }

  // Disabled state
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // Badge
  .p-badge {
    min-width: 1rem;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.6875rem; // 11px
  }
}
</style>
