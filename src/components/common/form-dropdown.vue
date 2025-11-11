<template>
  <div class="form-dropdown-wrapper">
    <Select
      v-model="model"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ 'p-invalid': invalid }"
      appendTo="body"
      @change="handleChange"
    >
      <!-- Pass through all slots -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </Select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const handleChange = (event) => {
  emit('change', event)
}
</script>

<style lang="scss" scoped>
.form-dropdown-wrapper {
  width: 100%;

  :deep(.p-select) {
    width: 100%;
    min-height: 40px;

    &.p-invalid {
      border-color: #dc3545 !important;
    }
  }
}
</style>
