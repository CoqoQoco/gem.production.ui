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

        <!-- Roles Information -->
        <div class="list-detail-section">
          <h4 class="list-detail-section-title">
            <i class="pi pi-shield"></i>
            {{ $t("account.columns.roles") || "บทบาท" }}
          </h4>
          <div class="list-detail-tags-container">
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

export default {
  name: "DetailView",

  components: {
    Dialog,
    Button,
    Tag,
    ProgressSpinner,
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
  },

  created() {
    // You can add any initialization logic here if needed
    //console.log('DetailView component created', this.userDetail)
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
