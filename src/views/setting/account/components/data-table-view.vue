<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="users"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('account.noData') || 'ไม่พบข้อมูลผู้ใช้'"
      data-key="id"
      :show-gridlines="true"
      :paginator="true"
      @page="handlePageChange"
      @sort="handleSortChange"
    >
      <!-- Full Name Template -->
      <template #fullNameTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-user list-item-icon"></i>
          <span>{{ data.firstName }} {{ data.lastName }}</span>
        </div>
      </template>

      <!-- Username Template -->
      <template #usernameTemplate="{ data }">
        <div class="list-username-cell">
          <i class="pi pi-at"></i>
          <span>{{ data.username }}</span>
        </div>
      </template>

      <!-- Email Template -->
      <template #emailTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-envelope"></i>
          <span>{{ data.email }}</span>
        </div>
      </template>

      <!-- Roles Template -->
      <template #rolesTemplate="{ data }">
        <div class="list-roles-cell">
          <Tag
            v-for="role in data.roles"
            :key="role.roleId"
            :value="role.roleName"
            severity="info"
            class="list-tag"
          />
          <span v-if="!data.roles || data.roles.length === 0" class="list-no-item">
            {{ $t('account.noRole') || 'ไม่มีบทบาท' }}
          </span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="data.isActive ? ($t('account.active') || 'ใช้งาน') : ($t('account.inactive') || 'ไม่ใช้งาน')"
            :severity="data.isActive ? 'success' : 'danger'"
          />
        </div>
      </template>

      <!-- Last Login Template -->
      <template #lastLoginTemplate="{ data }">
        <div class="list-date-cell">
          <span v-if="data.lastLogin">
            {{ formatDateTime(data.lastLogin) }}
          </span>
          <span v-else class="no-data">-</span>
        </div>
      </template>

      <!-- Actions Template -->
      <template #actionsTemplate="{ data }">
        <div class="list-action-buttons">
          <!-- View Detail Button -->
          <Button
            icon="pi pi-eye"
            class="p-button-text p-button-info"
            v-tooltip.top="$t('common.view') || 'ดูรายละเอียด'"
            @click="$emit('view', data)"
          />

          <!-- Activate/Deactivate Button -->
          <Button
            v-if="!data.isActive"
            icon="pi pi-check-circle"
            class="p-button-text p-button-success"
            v-tooltip.top="$t('account.activate') || 'เปิดใช้งาน'"
            @click="$emit('activate', data)"
          />
          <Button
            v-else
            icon="pi pi-times-circle"
            class="p-button-text p-button-danger"
            v-tooltip.top="$t('account.deactivate') || 'ปิดใช้งาน'"
            @click="$emit('deactivate', data)"
          />
        </div>
      </template>
    </DataTableComponent>
  </div>
</template>

<script>
import DataTableComponent from '@/components/prime-vue/data-table.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

export default {
  name: 'DataTableView',

  components: {
    DataTableComponent,
    Tag,
    Button
  },

  props: {
    users: {
      type: Array,
      default: () => []
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    perPage: {
      type: Number,
      default: 10
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      columns: [
        {
          field: 'id',
          header: this.$t('account.columns.id') || 'ID',
          sortable: true,
          width: '80px',
          align: 'center'
        },
        {
          field: 'fullName',
          header: this.$t('account.columns.fullName') || 'ชื่อ-นามสกุล',
          sortable: false,
          minWidth: '200px'
        },
        {
          field: 'username',
          header: this.$t('account.columns.username') || 'ชื่อผู้ใช้',
          sortable: true,
          minWidth: '150px'
        },
        {
          field: 'email',
          header: this.$t('account.columns.email') || 'อีเมล',
          sortable: true,
          minWidth: '200px'
        },
        {
          field: 'roles',
          header: this.$t('account.columns.roles') || 'บทบาท',
          sortable: false,
          minWidth: '180px'
        },
        {
          field: 'isActive',
          header: this.$t('account.columns.status') || 'สถานะ',
          sortable: true,
          width: '120px',
          align: 'center'
        },
        {
          field: 'lastLogin',
          header: this.$t('account.columns.lastLogin') || 'เข้าใช้ล่าสุด',
          sortable: true,
          minWidth: '180px'
        },
        {
          field: 'actions',
          header: this.$t('common.actions') || 'จัดการ',
          sortable: false,
          width: '120px',
          align: 'center'
        }
      ]
    }
  },

  methods: {
    handlePageChange(event) {
      this.$emit('page-change', {
        pageIndex: event.first / event.rows,
        pageSize: event.rows
      })
    },

    handleSortChange(event) {
      const sortMeta = event.multiSortMeta
      if (sortMeta && sortMeta.length > 0) {
        const primarySort = sortMeta[0]
        this.$emit('sort-change', {
          sortBy: primarySort.field,
          isDescending: primarySort.order === -1,
          pageIndex: event.first / event.rows,
          pageSize: event.rows
        })
      }
    },

    formatDateTime(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/data-table-view.scss';
</style>
