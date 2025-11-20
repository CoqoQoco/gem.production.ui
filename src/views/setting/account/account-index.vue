<template>
  <div class="list-page-container">
    <!-- Search Header Component -->
    <SearchView
      :search-text="searchParams.searchText"
      :loading="isLoading"
      @search="handleSearch"
      @refresh="handleRefresh"
    />

    <!-- Data Table Component -->
    <DataTableView
      :users="users"
      :total-records="totalRecords"
      :per-page="perPage"
      :loading="isLoading"
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @view="handleViewDetail"
      @activate="handleActivateUser"
      @deactivate="handleDeactivateUser"
    />

    <!-- Detail Modal Component -->
    <DetailView
      v-model:visible="showDetailModal"
      :user-detail="selectedUserDetail"
      :loading="isLoadingDetail"
      @role-updated="handleRoleUpdated"
      @user-allowed="handleUserAllowed"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useAccountApiStore } from '@/stores/api/account-api'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

// Components
import SearchView from './components/search-view.vue'
import DataTableView from './components/data-table-view.vue'
import DetailView from './modal/detail-view.vue'

export default {
  name: 'AccountIndex',

  components: {
    SearchView,
    DataTableView,
    DetailView,
    ConfirmDialog,
    Toast
  },

  data() {
    return {
      // Store
      accountApiStore: useAccountApiStore(),
      confirm: null,
      toast: null,

      // Data
      users: [],
      totalRecords: 0,
      perPage: 10,

      // Search Parameters
      searchParams: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'CreateDate',
        isDescending: true,
        searchText: ''
      },

      // UI State
      isLoading: false,
      isLoadingDetail: false,
      showDetailModal: false,
      selectedUser: null,
      selectedUserDetail: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadUsers()
  },

  methods: {
    /**
     * Load users list with current search parameters
     */
    async loadUsers() {
      this.isLoading = true

      try {
        const result = await this.accountApiStore.listUsers({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sortBy: this.searchParams.sortBy,
          isDescending: this.searchParams.isDescending,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          this.users = result.data
          this.totalRecords = result.totalRecords
          this.perPage = result.pageSize
        } else {
          this.showError(result.message || this.$t('account.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Handle search event from SearchView
     */
    handleSearch(params) {
      this.searchParams.searchText = params.searchText
      this.searchParams.pageIndex = 0 // Reset to first page
      this.loadUsers()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sortBy = 'CreateDate'
      this.searchParams.isDescending = true
      this.loadUsers()
    },

    /**
     * Handle page change event from DataTable
     */
    handlePageChange(params) {
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      this.loadUsers()
    },

    /**
     * Handle sort change event from DataTable
     */
    handleSortChange(params) {
      this.searchParams.sortBy = params.sortBy
      this.searchParams.isDescending = params.isDescending
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      this.loadUsers()
    },

    /**
     * Handle view detail event - Load user details and show modal
     */
    async handleViewDetail(user) {
      this.selectedUser = user
      this.showDetailModal = true
      this.isLoadingDetail = true

      console.log('Loading details for user:', user)

      try {
        const result = await this.accountApiStore.getUser({
          id: user.id,
          username: user.username
        })

        if (result.success) {
          this.selectedUserDetail = result.data
        } else {
          this.showError(result.message || this.$t('account.getDetailError') || 'เกิดข้อผิดพลาดในการโหลดรายละเอียด')
          this.showDetailModal = false
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.getDetailError') || 'เกิดข้อผิดพลาดในการโหลดรายละเอียด')
        this.showDetailModal = false
      } finally {
        this.isLoadingDetail = false
      }
    },

    /**
     * Handle activate user event
     */
    handleActivateUser(user) {
      this.confirm.require({
        message: this.$t('account.confirmActivate', { name: `${user.firstName} ${user.lastName}` }) || `คุณต้องการเปิดใช้งานบัญชี ${user.firstName} ${user.lastName} หรือไม่?`,
        header: this.$t('account.activateUser') || 'เปิดใช้งานบัญชี',
        icon: 'pi pi-check-circle',
        acceptLabel: this.$t('common.confirm') || 'ยืนยัน',
        rejectLabel: this.$t('common.cancel') || 'ยกเลิก',
        acceptClass: 'p-button-success',
        accept: async () => {
          await this.activateUser(user)
        }
      })
    },

    /**
     * Handle deactivate user event
     */
    handleDeactivateUser(user) {
      this.confirm.require({
        message: this.$t('account.confirmDeactivate', { name: `${user.firstName} ${user.lastName}` }) || `คุณต้องการปิดใช้งานบัญชี ${user.firstName} ${user.lastName} หรือไม่?`,
        header: this.$t('account.deactivateUser') || 'ปิดใช้งานบัญชี',
        icon: 'pi pi-times-circle',
        acceptLabel: this.$t('common.confirm') || 'ยืนยัน',
        rejectLabel: this.$t('common.cancel') || 'ยกเลิก',
        acceptClass: 'p-button-danger',
        accept: async () => {
          await this.deactivateUser(user)
        }
      })
    },

    /**
     * Activate user API call
     */
    async activateUser(user) {
      try {
        const result = await this.accountApiStore.activateUser({
          id: user.id
        })

        if (result.success) {
          this.showSuccess(result.message || this.$t('account.activateSuccess') || 'เปิดใช้งานบัญชีสำเร็จ')
          await this.loadUsers() // Reload data
        } else {
          this.showError(result.message || this.$t('account.activateError') || 'เกิดข้อผิดพลาดในการเปิดใช้งานบัญชี')
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.activateError') || 'เกิดข้อผิดพลาดในการเปิดใช้งานบัญชี')
      }
    },

    /**
     * Deactivate user API call
     */
    async deactivateUser(user) {
      try {
        const result = await this.accountApiStore.deactivateUser({
          id: user.id
        })

        if (result.success) {
          this.showSuccess(result.message || this.$t('account.deactivateSuccess') || 'ปิดใช้งานบัญชีสำเร็จ')
          await this.loadUsers() // Reload data
        } else {
          this.showError(result.message || this.$t('account.deactivateError') || 'เกิดข้อผิดพลาดในการปิดใช้งานบัญชี')
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.deactivateError') || 'เกิดข้อผิดพลาดในการปิดใช้งานบัญชี')
      }
    },

    /**
     * Handle role updated event from DetailView
     */
    async handleRoleUpdated(data) {
      try {
        const result = await this.accountApiStore.updateUserRole({
          userId: data.userId,
          roleId: data.roleId,
          updateIsNew: null // ไม่เปลี่ยน isNew ในกรณีนี้
        })

        if (result.success) {
          this.showSuccess(result.message || this.$t('account.updateRoleSuccess') || 'อัปเดตบทบาทสำเร็จ')

          // Reload user detail
          await this.handleViewDetail(this.selectedUser)

          // Reload user list
          await this.loadUsers()
        } else {
          this.showError(result.message || this.$t('account.updateRoleError') || 'เกิดข้อผิดพลาดในการอัปเดตบทบาท')
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.updateRoleError') || 'เกิดข้อผิดพลาดในการอัปเดตบทบาท')
      }
    },

    /**
     * Handle user allowed event from DetailView (isNew user approval)
     */
    async handleUserAllowed(data) {
      try {
        // Get current role from selectedUserDetail
        if (!this.selectedUserDetail || !this.selectedUserDetail.roles || this.selectedUserDetail.roles.length === 0) {
          this.showError(this.$t('account.selectRoleFirst') || 'กรุณาเลือกบทบาทก่อนอนุมัติผู้ใช้')
          return
        }

        const currentRole = this.selectedUserDetail.roles[0]

        const result = await this.accountApiStore.updateUserRole({
          userId: data.userId,
          roleId: currentRole.roleId,
          updateIsNew: false // Set isNew to false เมื่อ allow user
        })

        if (result.success) {
          this.showSuccess(result.message || this.$t('account.allowUserSuccess') || 'อนุมัติผู้ใช้สำเร็จ')

          // Reload user detail
          await this.handleViewDetail(this.selectedUser)

          // Reload user list
          await this.loadUsers()
        } else {
          this.showError(result.message || this.$t('account.allowUserError') || 'เกิดข้อผิดพลาดในการอนุมัติผู้ใช้')
        }
      } catch (error) {
        this.showError(error.message || this.$t('account.allowUserError') || 'เกิดข้อผิดพลาดในการอนุมัติผู้ใช้')
      }
    },

    /**
     * Show success toast
     */
    showSuccess(message) {
      this.toast.add({
        severity: 'success',
        summary: this.$t('common.success') || 'สำเร็จ',
        detail: message,
        life: 3000
      })
    },

    /**
     * Show error toast
     */
    showError(message) {
      this.toast.add({
        severity: 'error',
        summary: this.$t('common.error') || 'ผิดพลาด',
        detail: message,
        life: 5000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/index-view.scss';
</style>
