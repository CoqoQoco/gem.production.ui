<template>
  <div class="profile-page">
    <!-- Page Header -->
    <div class="profile-header">
      <div class="header-container">
        <div class="title-group">
          <h2 class="page-title">
            <i class="pi pi-user"></i>
            {{ $t("profile.title") || "โปรไฟล์" }}
          </h2>
          <p class="page-subtitle">
            {{ $t("profile.subtitle") || "ข้อมูลส่วนตัวของคุณ" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- No User Data -->
      <div v-if="!userData" class="no-data-section">
        <i class="pi pi-exclamation-triangle"></i>
        <p>{{ $t("profile.noData") || "ไม่พบข้อมูลผู้ใช้" }}</p>
      </div>

      <!-- User Profile Cards -->
      <div v-else class="profile-cards">
        <!-- User Avatar & Name Card -->
        <div class="profile-card profile-main-card">
          <div class="profile-avatar-section">
            <div class="profile-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="profile-name-group">
              <h3 class="profile-name">
                {{ getUserFullName() }}
              </h3>
              <p class="profile-username">@{{ userData.username }}</p>
            </div>
          </div>
        </div>

        <!-- Account Information Card -->
        <div class="profile-card">
          <h4 class="card-title">
            <i class="pi pi-id-card"></i>
            {{ $t("profile.accountInfo") || "ข้อมูลบัญชี" }}
          </h4>
          <div class="card-content">
            <div class="info-grid">
              <!-- Username -->
              <div class="info-item">
                <label>{{ $t("profile.fields.username") || "ชื่อผู้ใช้" }}</label>
                <div class="info-value">
                  <i class="pi pi-user"></i>
                  <span>{{ userData.username }}</span>
                </div>
              </div>

              <!-- Email -->
              <div class="info-item">
                <label>{{ $t("profile.fields.email") || "อีเมล" }}</label>
                <div class="info-value">
                  <i class="pi pi-envelope"></i>
                  <span>{{ userData.email || $t("profile.notAvailable") }}</span>
                </div>
              </div>

              <!-- Phone -->
              <div class="info-item">
                <label>{{ $t("profile.fields.tel") || "เบอร์โทรศัพท์" }}</label>
                <div class="info-value">
                  <i class="pi pi-phone"></i>
                  <span>{{ userData.tel || $t("profile.notAvailable") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information Card -->
        <div class="profile-card">
          <h4 class="card-title">
            <i class="pi pi-info-circle"></i>
            {{ $t("profile.personalInfo") || "ข้อมูลส่วนตัว" }}
          </h4>
          <div class="card-content">
            <div class="info-grid">
              <!-- First Name -->
              <div class="info-item">
                <label>{{ $t("profile.fields.firstName") || "ชื่อ" }}</label>
                <div class="info-value">
                  <span>{{ userData.firstName || $t("profile.notAvailable") }}</span>
                </div>
              </div>

              <!-- Last Name -->
              <div class="info-item">
                <label>{{ $t("profile.fields.lastName") || "นามสกุล" }}</label>
                <div class="info-value">
                  <span>{{ userData.lastName || $t("profile.notAvailable") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles & Permissions Card -->
        <div class="profile-card">
          <h4 class="card-title">
            <i class="pi pi-shield"></i>
            {{ $t("profile.roleInfo") || "บทบาทและสิทธิ์" }}
          </h4>
          <div class="card-content">
            <div v-if="userData.roles && userData.roles.length > 0" class="roles-container">
              <Tag
                v-for="role in userData.roles"
                :key="role.roleId"
                :value="role.roleName"
                severity="info"
                class="role-tag"
              />
            </div>
            <div v-else class="no-role">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ $t("profile.noRole") || "ไม่มีบทบาท" }}</span>
            </div>
          </div>
        </div>

        <!-- Activity Information Card -->
        <div class="profile-card">
          <h4 class="card-title">
            <i class="pi pi-clock"></i>
            {{ $t("profile.activityInfo") || "ข้อมูลกิจกรรม" }}
          </h4>
          <div class="card-content">
            <div class="info-grid">
              <!-- Create Date -->
              <div class="info-item">
                <label>{{ $t("profile.fields.createDate") || "วันที่สร้างบัญชี" }}</label>
                <div class="info-value">
                  <i class="pi pi-calendar-plus"></i>
                  <span>{{ formatDateTime(userData.createDate) }}</span>
                </div>
              </div>

              <!-- Created By -->
              <div class="info-item">
                <label>{{ $t("profile.fields.createBy") || "สร้างโดย" }}</label>
                <div class="info-value">
                  <i class="pi pi-user"></i>
                  <span>{{ userData.createBy || $t("profile.notAvailable") }}</span>
                </div>
              </div>

              <!-- Last Login -->
              <div class="info-item">
                <label>{{ $t("profile.fields.lastLogin") || "เข้าใช้ล่าสุด" }}</label>
                <div class="info-value">
                  <i class="pi pi-sign-in"></i>
                  <span>{{ formatDateTime(userData.lastLogin) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import Tag from "primevue/tag";

export default {
  name: "ProfileIndex",

  components: {
    Tag
  },

  data() {
    return {
      authStore: useAuthStore(),
      userData: null
    };
  },

  mounted() {
    this.loadUserData();
  },

  methods: {
    /**
     * Load user data from auth store or storage
     */
    loadUserData() {
      // First try to get from auth store
      if (this.authStore.user) {
        this.userData = this.authStore.user;
        return;
      }

      // If not in store, try localStorage (remember me)
      const userFromLocalStorage = localStorage.getItem("user");
      if (userFromLocalStorage) {
        try {
          this.userData = JSON.parse(userFromLocalStorage);
          return;
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }

      // If not in localStorage, try sessionStorage
      const userFromSessionStorage = sessionStorage.getItem("user");
      if (userFromSessionStorage) {
        try {
          this.userData = JSON.parse(userFromSessionStorage);
          return;
        } catch (error) {
          console.error("Error parsing user from sessionStorage:", error);
        }
      }

      // No user data found
      this.userData = null;
    },

    /**
     * Get user's full name
     */
    getUserFullName() {
      if (!this.userData) return "";

      if (this.userData.firstName && this.userData.lastName) {
        return `${this.userData.firstName} ${this.userData.lastName}`;
      }

      if (this.userData.firstName) {
        return this.userData.firstName;
      }

      if (this.userData.lastName) {
        return this.userData.lastName;
      }

      return this.userData.username;
    },

    /**
     * Format date time to Thai locale
     */
    formatDateTime(dateString) {
      if (!dateString) return this.$t("profile.notAvailable") || "-";

      try {
        const date = new Date(dateString);
        return date.toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (error) {
        return this.$t("profile.notAvailable") || "-";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// Profile Page Styles
.profile-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Page Header
.profile-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.header-container {
  max-width: 100%;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;

  i {
    color: #ff69b4;
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

// Profile Content
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
}

.no-data-section {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  i {
    font-size: 3rem;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  p {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }
}

// Profile Cards
.profile-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &.profile-main-card {
    grid-column: 1 / -1;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;

  i {
    color: #ff69b4;
    font-size: 1.125rem;
  }
}

.card-content {
  // Content styles
}

// Profile Avatar Section
.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);

  i {
    font-size: 3rem;
    color: white;
  }
}

.profile-name-group {
  flex: 1;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.profile-username {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

// Info Grid
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #1f2937;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 6px;

    i {
      color: #ff69b4;
      font-size: 0.875rem;
    }

    span {
      word-break: break-word;
    }
  }
}

// Roles Container
.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-tag {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.no-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;

  i {
    color: #9ca3af;
  }
}
</style>
