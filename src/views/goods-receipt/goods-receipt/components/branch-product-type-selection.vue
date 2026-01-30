<template>
  <div class="selection-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-building"></i>
      <span>ข้อมูลสาขา</span>
    </div>

    <!-- Selection Form -->
    <div class="selection-form">
      <!-- Branch AutoComplete -->
      <div class="form-group">
        <label>
          {{ $t('goodsReceipt.form.branch') || 'สาขา' }}
          <span class="required">*</span>
        </label>
        <AutoComplete
          v-model="selectedBranch"
          :suggestions="filteredBranches"
          field="nameTh"
          :option-label="(item) => `${item.nameEn} - ${item.nameTh}`"
          :dropdown="true"
          :placeholder="$t('goodsReceipt.form.branchPlaceholder') || 'เลือกสาขา'"
          :invalid="!!errors.branchId"
          @complete="searchBranches"
          @item-select="handleBranchChange"
        />
        <small v-if="errors.branchId" class="p-error">
          {{ errors.branchId }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'
import { useBranchApiStore } from '@/stores/api/branch-api'

export default {
  name: 'BranchSelection',

  components: {
    AutoComplete
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        branchId: null,
        branchNameTh: '',
        branchNameEn: ''
      })
    }
  },

  emits: ['update:modelValue', 'validate'],

  data() {
    return {
      branchApiStore: useBranchApiStore(),
      selectionData: {
        branchId: null,
        branchNameTh: '',
        branchNameEn: ''
      },
      branches: [],
      filteredBranches: [],
      selectedBranch: null,
      errors: {},
      isUpdatingFromParent: false
    }
  },

  async mounted() {
    await this.loadBranches()
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue && !this.isUpdatingFromParent) {
          this.isUpdatingFromParent = true
          this.selectionData = JSON.parse(JSON.stringify(newValue))
          this.$nextTick(() => {
            this.isUpdatingFromParent = false
          })
        }
      },
      deep: true,
      immediate: true
    },

    selectionData: {
      handler(newValue) {
        if (!this.isUpdatingFromParent) {
          this.$emit('update:modelValue', newValue)
        }
      },
      deep: true
    }
  },

  methods: {
    async loadBranches() {
      try {
        const result = await this.branchApiStore.listBranches({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.branches = result.data
          // Set selected branch if branchId exists
          if (this.selectionData.branchId) {
            this.selectedBranch = this.branches.find(
              b => b.branchId === this.selectionData.branchId
            )
          }
        }
      } catch (error) {
        console.error('Error loading branches:', error)
      }
    },

    searchBranches(event) {
      const query = event.query.toLowerCase().trim()
      this.filteredBranches = query
        ? this.branches.filter(branch =>
            branch.nameTh.toLowerCase().includes(query) ||
            branch.nameEn.toLowerCase().includes(query) ||
            (branch.code && branch.code.toLowerCase().includes(query))
          )
        : [...this.branches]
    },

    handleBranchChange(event) {
      const selectedBranch = event.value
      if (selectedBranch) {
        this.selectionData.branchId = selectedBranch.branchId
        this.selectionData.branchNameTh = selectedBranch.nameTh
        this.selectionData.branchNameEn = selectedBranch.nameEn
      }
      this.clearError('branchId')
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },

    validate() {
      this.errors = {}

      // Branch validation
      if (!this.selectionData.branchId) {
        this.errors.branchId = this.$t('goodsReceipt.validation.branchRequired') || 'กรุณาเลือกสาขา'
      }

      const isValid = Object.keys(this.errors).length === 0
      this.$emit('validate', isValid)
      return isValid
    },

    reset() {
      this.selectionData = {
        branchId: null,
        branchNameTh: '',
        branchNameEn: ''
      }
      this.errors = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.selection-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
    color: #e7de99;
  }
}

.selection-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.625rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }
  }

  small.p-error {
    color: #ef4444;
    font-size: 0.6875rem;
    margin-top: -0.125rem;
  }
}
</style>
