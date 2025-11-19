<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('account.userDetail') || 'รายละเอียดผู้ใช้'"
    :style="{ width: '700px' }"
    :modal="true"
    :draggable="false"
    class="user-detail-dialog"
  >
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>{{ $t('common.loading') || 'กำลังโหลด...' }}</p>
    </div>

    <div v-else-if="userDetail" class="user-detail-content">
      <!-- User Header -->
      <div class="user-header">
        <div class="user-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="user-title">
          <h3>{{ userDetail.firstName }} {{ userDetail.lastName }}</h3>
          <p class="username">@{{ userDetail.username }}</p>
        </div>
        <div class="user-status">
          <Tag
            :value="userDetail.isActive ? ($t('account.active') || 'ใช้งาน') : ($t('account.inactive') || 'ไม่ใช้งาน')"
            :severity="userDetail.isActive ? 'success' : 'danger'"
          />
        </div>
      </div>

      <!-- User Information Sections -->
      <div class="user-info-sections">
        <!-- Contact Information -->
        <div class="info-section">
          <h4 class="section-title">
            <i class="pi pi-info-circle"></i>
            {{ $t('account.contactInfo') || 'ข้อมูลติดต่อ' }}
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>{{ $t('account.columns.email') || 'อีเมล' }}</label>
              <div class="info-value">
                <i class="pi pi-envelope"></i>
                <span>{{ userDetail.email }}</span>
              </div>
            </div>
            <div class="info-item">
              <label>{{ $t('account.columns.tel') || 'เบอร์โทรศัพท์' }}</label>
              <div class="info-value">
                <i class="pi pi-phone"></i>
                <span>{{ userDetail.tel || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Information -->
        <div class="info-section">
          <h4 class="section-title">
            <i class="pi pi-shield"></i>
            {{ $t('account.columns.roles') || 'บทบาท' }}
          </h4>
          <div class="roles-container">
            <Tag
              v-for="role in userDetail.roles"
              :key="role.roleId"
              :value="role.roleName"
              severity="info"
              class="role-tag"
            />
            <span v-if="!userDetail.roles || userDetail.roles.length === 0" class="no-role">
              {{ $t('account.noRole') || 'ไม่มีบทบาท' }}
            </span>
          </div>
        </div>

        <!-- Activity Information -->
        <div class="info-section">
          <h4 class="section-title">
            <i class="pi pi-clock"></i>
            {{ $t('account.activityInfo') || 'ข้อมูลกิจกรรม' }}
          </h4>
          <div class="info-grid">
            <div class="info-item">
              <label>{{ $t('account.columns.createDate') || 'วันที่สร้าง' }}</label>
              <div class="info-value">
                <i class="pi pi-calendar-plus"></i>
                <span>{{ formatDateTime(userDetail.createDate) }}</span>
              </div>
            </div>
            <div class="info-item">
              <label>{{ $t('account.columns.createBy') || 'สร้างโดย' }}</label>
              <div class="info-value">
                <i class="pi pi-user"></i>
                <span>{{ userDetail.createBy }}</span>
              </div>
            </div>
            <div class="info-item">
              <label>{{ $t('account.columns.lastLogin') || 'เข้าใช้ล่าสุด' }}</label>
              <div class="info-value">
                <i class="pi pi-sign-in"></i>
                <span>{{ userDetail.lastLogin ? formatDateTime(userDetail.lastLogin) : '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data-container">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ $t('account.noDetailData') || 'ไม่พบข้อมูลผู้ใช้' }}</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          :label="$t('common.close') || 'ปิด'"
          icon="pi pi-times"
          @click="$emit('update:visible', false)"
          class="p-button-text"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'DetailView',

  components: {
    Dialog,
    Button,
    Tag,
    ProgressSpinner
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userDetail: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    formatDateTime(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-detail-dialog {
  :deep(.p-dialog-header) {
    background: linear-gradient(135deg, #f58511 0%, #ff9a3c 100%);
    color: #ffffff;
    border-radius: 12px 12px 0 0;
    padding: 1.5rem;

    .p-dialog-title {
      color: #ffffff;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .p-dialog-header-icon {
      color: #ffffff;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  :deep(.p-dialog-content) {
    padding: 2rem;
    max-height: 70vh;
    overflow-y: auto;
  }

  :deep(.p-dialog-footer) {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
}

// Loading Container
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;

  p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
}

// No Data Container
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;

  i {
    font-size: 3rem;
    color: #fbbf24;
  }

  p {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }
}

// User Detail Content
.user-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// User Header
.user-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff5e6 0%, #ffe4cc 100%);
  border-radius: 12px;

  .user-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #f58511 0%, #ff9a3c 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 2.5rem;
      color: #ffffff;
    }
  }

  .user-title {
    flex: 1;

    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .username {
      margin: 0;
      font-size: 1rem;
      color: #6b7280;
    }
  }

  .user-status {
    flex-shrink: 0;
  }
}

// Info Sections
.user-info-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;

    i {
      color: #f58511;
      font-size: 1.25rem;
    }
  }
}

// Info Grid
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }

    .info-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      color: #1f2937;
      padding: 0.75rem;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      i {
        color: #9ca3af;
        font-size: 1rem;
      }

      span {
        flex: 1;
      }
    }
  }
}

// Roles Container
.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .role-tag {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  .no-role {
    color: #9ca3af;
    font-size: 0.875rem;
    font-style: italic;
  }
}

// Dialog Footer
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

// Responsive
@media (max-width: 768px) {
  .user-detail-dialog {
    :deep(.p-dialog) {
      width: 95vw !important;
      max-width: 95vw !important;
    }

    :deep(.p-dialog-content) {
      padding: 1rem;
    }
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    padding: 1rem;

    .user-title h3 {
      font-size: 1.25rem;
    }
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
