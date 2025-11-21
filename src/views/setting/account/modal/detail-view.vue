<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('account.userDetail') || 'รายละเอียดผู้ใช้'"
    :style="{ width: '700px' }"
    :modal="true"
    :draggable="false"
    class="list-detail-dialog"
  >
    <div v-if="loading" class="list-detail-loading">
      <ProgressSpinner />
      <p>{{ $t("common.loading") || "กำลังโหลด..." }}</p>
    </div>

    <div v-else-if="userDetail" class="list-detail-content">
      <!-- User Header -->
      <div class="list-detail-header">
        <div class="list-detail-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="list-detail-title-group">
          <h3>{{ userDetail.firstName }} {{ userDetail.lastName }}</h3>
          <p class="list-detail-subtitle">@{{ userDetail.username }}</p>
        </div>
        <div class="list-detail-status-badge">
          <Tag
            :value="
              userDetail
                ? $t('account.active') || 'ใช้งาน'
                : $t('account.inactive') || 'ไม่ใช้งาน'
            "
            :severity="userDetail.isActive ? 'success' : 'danger'"
          />
        </div>
      </div>

      <!-- User Information Sections -->
      <div class="list-detail-sections">
        <!-- Contact Information -->
        <div class="list-detail-section">
          <h4 class="list-detail-section-title">
            <i class="pi pi-info-circle"></i>
            {{ $t("account.contactInfo") || "ข้อมูลติดต่อ" }}
          </h4>
          <div class="list-detail-info-grid">
            <div class="list-detail-info-item">
              <label>{{ $t("account.columns.email") || "อีเมล" }}</label>
              <div class="list-detail-info-value">
                <i class="pi pi-envelope"></i>
                <span>{{ userDetail.email }}</span>
              </div>
            </div>
            <div class="list-detail-info-item">
              <label>{{ $t("account.columns.tel") || "เบอร์โทรศัพท์" }}</label>
              <div class="list-detail-info-value">
                <i class="pi pi-phone"></i>
                <span>{{ userDetail.tel || "-" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Information with Edit -->
        <div class="list-detail-section">
          <h4 class="list-detail-section-title">
            <i class="pi pi-shield"></i>
            {{ $t("account.columns.roles") || "บทบาท" }}
          </h4>

          <!-- Display Mode -->
          <div v-if="!isEditingRole" class="list-detail-tags-container">
            <Tag
              v-for="role in userDetail.roles"
              :key="role.roleId"
              :value="role.roleName"
              severity="info"
              class="list-detail-tag"
            />
            <span
              v-if="!userDetail.roles || userDetail.roles.length === 0"
              class="list-detail-no-item"
            >
              {{ $t("account.noRole") || "ไม่มีบทบาท" }}
            </span>
            <Button
              :label="$t('common.edit') || 'แก้ไข'"
              icon="pi pi-pencil"
              class="p-button-sm p-button-text"
              @click="startEditRole"
              style="margin-top: 0.5rem;"
            />
          </div>

          <!-- Edit Mode -->
          <div v-else class="list-detail-edit-role">
            <Dropdown
              v-model="selectedRoleId"
              :options="roleOptions"
              optionLabel="name"
              optionValue="id"
              :placeholder="$t('account.selectRole') || 'เลือกบทบาท'"
              class="w-full"
              :loading="loadingRoles"
            />
            <div class="edit-role-actions">
              <Button
                :label="$t('common.cancel') || 'ยกเลิก'"
                icon="pi pi-times"
                class="p-button-sm p-button-text"
                @click="cancelEditRole"
              />
              <Button
                :label="$t('common.save') || 'บันทึก'"
                icon="pi pi-check"
                class="p-button-sm"
                @click="saveRole"
                :loading="savingRole"
                :disabled="!selectedRoleId"
              />
            </div>
          </div>
        </div>

        <!-- New User Approval Section (only if isNew = true) -->
        <div v-if="userDetail.isNew" class="list-detail-section new-user-section">
          <h4 class="list-detail-section-title">
            <i class="pi pi-user-plus"></i>
            {{ $t("account.newUserApproval") || "อนุมัติผู้ใช้ใหม่" }}
          </h4>
          <div class="new-user-info">
            <Message :closable="false" severity="warn">
              {{ $t("account.newUserMessage") || "ผู้ใช้รายนี้ยังไม่ได้รับอนุมัติ กรุณาเลือกบทบาทและอนุมัติการใช้งาน" }}
            </Message>
            <Button
              :label="$t('account.allowUser') || 'อนุมัติผู้ใช้'"
              icon="pi pi-check-circle"
              class="p-button-success allow-user-button"
              @click="allowNewUser"
              :loading="allowingUser"
              :disabled="!userDetail.roles || userDetail.roles.length === 0"
            />
          </div>
        </div>

        <!-- Activity Information -->
        <div class="list-detail-section">
          <h4 class="list-detail-section-title">
            <i class="pi pi-clock"></i>
            {{ $t("account.activityInfo") || "ข้อมูลกิจกรรม" }}
          </h4>
          <div class="list-detail-info-grid">
            <div class="list-detail-info-item">
              <label>{{
                $t("account.columns.createDate") || "วันที่สร้าง"
              }}</label>
              <div class="list-detail-info-value">
                <i class="pi pi-calendar-plus"></i>
                <span>{{ formatDateTime(userDetail.createDate) }}</span>
              </div>
            </div>
            <div class="list-detail-info-item">
              <label>{{ $t("account.columns.createBy") || "สร้างโดย" }}</label>
              <div class="list-detail-info-value">
                <i class="pi pi-user"></i>
                <span>{{ userDetail.createBy }}</span>
              </div>
            </div>
            <div class="list-detail-info-item">
              <label>{{
                $t("account.columns.lastLogin") || "เข้าใช้ล่าสุด"
              }}</label>
              <div class="list-detail-info-value">
                <i class="pi pi-sign-in"></i>
                <span>{{
                  userDetail.lastLogin
                    ? formatDateTime(userDetail.lastLogin)
                    : "-"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="list-detail-no-data">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ $t("account.noDetailData") || "ไม่พบข้อมูลผู้ใช้" }}</p>
    </div>

    <template #footer>
      <div class="list-detail-footer">
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
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import { useRoleApiStore } from "@/stores/api/role-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "DetailView",

  components: {
    Dialog,
    Button,
    Tag,
    ProgressSpinner,
    Dropdown,
    Message,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userDetail: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      roleApiStore: useRoleApiStore(),
      toast: useToast(),
      isEditingRole: false,
      selectedRoleId: null,
      roleOptions: [],
      loadingRoles: false,
      savingRole: false,
      allowingUser: false,
    };
  },

  methods: {
    formatDateTime(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async startEditRole() {
      this.isEditingRole = true;
      this.selectedRoleId = this.userDetail.roles?.[0]?.roleId || null;
      await this.loadRoles();
    },

    cancelEditRole() {
      this.isEditingRole = false;
      this.selectedRoleId = null;
    },

    async loadRoles() {
      this.loadingRoles = true;
      try {
        const response = await this.roleApiStore.listRoles({ isActiveOnly: true });
        if (response.success) {
          this.roleOptions = response.data.map((role) => ({
            id: role.roleId,
            name: role.roleName,
          }));
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: this.$t("account.loadRolesError") || "ไม่สามารถโหลดรายการบทบาทได้",
            life: 3000,
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || "เกิดข้อผิดพลาด",
          life: 3000,
        });
      } finally {
        this.loadingRoles = false;
      }
    },

    async saveRole() {
      if (!this.selectedRoleId) return;

      this.savingRole = true;
      try {
        // TODO: Call API to update user role
        // For now, emit event to parent
        this.$emit("role-updated", {
          userId: this.userDetail.id,
          roleId: this.selectedRoleId,
        });

        this.toast.add({
          severity: "success",
          summary: this.$t("common.success") || "สำเร็จ",
          detail: this.$t("account.updateRoleSuccess") || "อัปเดตบทบาทสำเร็จ",
          life: 3000,
        });

        this.isEditingRole = false;
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || "เกิดข้อผิดพลาด",
          life: 3000,
        });
      } finally {
        this.savingRole = false;
      }
    },

    async allowNewUser() {
      if (!this.userDetail.roles || this.userDetail.roles.length === 0) {
        this.toast.add({
          severity: "warn",
          summary: this.$t("common.warning") || "คำเตือน",
          detail: this.$t("account.selectRoleFirst") || "กรุณาเลือกบทบาทก่อนอนุมัติผู้ใช้",
          life: 3000,
        });
        return;
      }

      this.allowingUser = true;
      try {
        // TODO: Call API to update isNew to false
        // For now, emit event to parent
        this.$emit("user-allowed", {
          userId: this.userDetail.id,
        });

        this.toast.add({
          severity: "success",
          summary: this.$t("common.success") || "สำเร็จ",
          detail: this.$t("account.allowUserSuccess") || "อนุมัติผู้ใช้สำเร็จ",
          life: 3000,
        });
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || "เกิดข้อผิดพลาด",
          life: 3000,
        });
      } finally {
        this.allowingUser = false;
      }
    },
  },

  created() {
    // You can add any initialization logic here if needed
    //console.log('DetailView component created', this.userDetail)
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";

.list-detail-edit-role {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .edit-role-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

.new-user-section {
  background: linear-gradient(135deg, #fffbf5 0%, #fff5e6 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 1.5rem;

  .list-detail-section-title {
    color: #d97706;

    i {
      color: #fbbf24;
    }
  }

  .new-user-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .allow-user-button {
      align-self: flex-start;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
      }
    }
  }
}

.w-full {
  width: 100%;
}
</style>
