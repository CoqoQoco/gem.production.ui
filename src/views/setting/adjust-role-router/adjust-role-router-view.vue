<template>
  <div class="adjust-role-page">
    <!-- Page Header with Role Selector -->
    <div class="page-header">
      <div class="header-container">
        <div class="title-with-selector">
          <div class="title-group">
            <h2 class="page-title">
              <i class="pi pi-shield"></i>
              {{ $t("adjustRole.title") }}
            </h2>
            <p class="page-subtitle">
              {{ $t("adjustRole.subtitle") }}
            </p>
          </div>

          <!-- Role Selector in Header -->
          <div class="role-selector-header">
            <Dropdown
              v-model="selectedRoleId"
              :options="roleList"
              optionLabel="roleName"
              optionValue="roleId"
              :placeholder="$t('adjustRole.selectRolePlaceholder')"
              :loading="isLoadingRoles"
              @change="handleRoleChange"
              class="role-dropdown"
            />

            <Button
              :label="$t('common.refresh')"
              icon="pi pi-refresh"
              @click="loadRoles"
              :loading="isLoadingRoles"
              outlined
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <!-- Selected Role Info -->
      <div v-if="selectedRole" class="adjust-section">
        <div class="role-info">
          <div class="info-card">
            <div class="info-item">
              <label>{{ $t("adjustRole.roleInfo.roleName") }}:</label>
              <span>{{ selectedRole.roleName }}</span>
            </div>
            <div class="info-item" v-if="selectedRole.description">
              <label>{{ $t("adjustRole.roleInfo.description") }}:</label>
              <span>{{ selectedRole.description }}</span>
            </div>
            <div class="info-item">
              <label>{{ $t("adjustRole.roleInfo.level") }}:</label>
              <span>{{ selectedRole.level }}</span>
            </div>
            <div class="info-item">
              <label>{{ $t("adjustRole.roleInfo.status") }}:</label>
              <Tag
                :value="
                  selectedRole.isActive
                    ? $t('adjustRole.roleInfo.active')
                    : $t('adjustRole.roleInfo.inactive')
                "
                :severity="selectedRole.isActive ? 'success' : 'danger'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Router Selection Section -->
      <div v-if="selectedRoleId" class="adjust-section router-section">
        <h3 class="section-title">
          <i class="pi pi-sitemap"></i>
          {{ $t("adjustRole.selectRouters") }}
        </h3>

        <div v-if="isLoadingRoleDetail" class="loading-section">
          <ProgressSpinner />
          <p>{{ $t("adjustRole.loading") }}</p>
        </div>

        <div v-else class="router-selection">
          <!-- Select All / Deselect All -->
          <div class="selection-toolbar">
            <Button
              :label="$t('adjustRole.selectAll')"
              icon="pi pi-check-square"
              @click="selectAllRouters"
              outlined
              size="small"
            />
            <Button
              :label="$t('adjustRole.deselectAll')"
              icon="pi pi-times"
              @click="deselectAllRouters"
              outlined
              size="small"
            />
            <div class="selected-count">
              {{ $t("adjustRole.selectedCount") }}:
              <strong>{{ selectedRouters.length }}</strong> / {{ totalRouters }}
            </div>
          </div>

          <!-- Router List Grouped by Module with Scrollable Area -->
          <div class="router-modules-wrapper">
            <div class="router-modules">
              <div
                v-for="moduleGroup in routerModules"
                :key="moduleGroup.module"
                class="module-group"
              >
                <div class="module-header">
                  <Checkbox
                    :modelValue="isModuleSelected(moduleGroup)"
                    @update:modelValue="toggleModule(moduleGroup, $event)"
                    :binary="true"
                  />
                  <h4>{{ moduleGroup.module }}</h4>
                  <span class="module-count"
                    >({{ moduleGroup.routes.length }})</span
                  >
                </div>

                <div class="module-routes">
                  <div
                    v-for="route in moduleGroup.routes"
                    :key="route.name"
                    class="route-item"
                  >
                    <Checkbox
                      v-model="selectedRouters"
                      :value="route.name"
                      :inputId="route.name"
                    />
                    <label :for="route.name" class="route-label">
                      <span class="route-title">{{ route.title }}</span>
                      <span class="route-name">{{ route.name }}</span>
                      <span class="route-path">{{ route.path }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Section -->
      <div v-if="selectedRoleId && !isLoadingRoleDetail" class="adjust-section">
        <div class="save-section">
          <span v-if="hasChanges" class="change-indicator">
            <i class="pi pi-exclamation-circle"></i>
            {{ $t("adjustRole.hasChanges") }}
          </span>
          <Button
            :label="$t('common.cancel')"
            icon="pi pi-times"
            @click="handleCancel"
            :disabled="isSaving"
            outlined
          />
          <Button
            :label="$t('common.save')"
            icon="pi pi-save"
            @click="handleSave"
            :loading="isSaving"
            :disabled="!hasChanges"
            class="save-button"
          />
        </div>
      </div>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script>
import { useRoleApiStore } from "@/stores/api/role-api";
import { useAuthStore } from "@/stores/auth";
import { getRoutesForDisplay } from "@/utils/routerHelper";
import { useToast } from "primevue/usetoast";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";

export default {
  name: "AdjustRoleRouterView",

  components: {
    Dropdown,
    Button,
    Checkbox,
    Tag,
    Toast,
    ProgressSpinner,
  },

  data() {
    return {
      // Stores
      roleApiStore: useRoleApiStore(),
      authStore: useAuthStore(),
      toast: null,

      // Role data
      roleList: [],
      selectedRoleId: null,
      selectedRole: null,
      originalRouters: [],

      // Router data
      routerModules: [],
      selectedRouters: [],
      totalRouters: 0,

      // Loading states
      isLoadingRoles: false,
      isLoadingRoleDetail: false,
      isSaving: false,
    };
  },

  computed: {
    hasChanges() {
      // Compare selected routers with original routers
      if (!this.selectedRole) return false;

      const current = [...this.selectedRouters].sort();
      const original = [...this.originalRouters].sort();

      if (current.length !== original.length) return true;

      return current.some((router, index) => router !== original[index]);
    },
  },

  mounted() {
    this.toast = useToast();
    this.loadRoles();
    this.loadRouters();
  },

  methods: {
    /**
     * Load all roles from API
     */
    async loadRoles() {
      this.isLoadingRoles = true;

      try {
        const result = await this.roleApiStore.listRoles({
          isActiveOnly: true,
        });

        if (result.success) {
          this.roleList = result.data;
        } else {
          this.showError(
            result.message || this.$t("adjustRole.loadRolesError")
          );
        }
      } catch (error) {
        this.showError(error.message || this.$t("adjustRole.loadRolesError"));
      } finally {
        this.isLoadingRoles = false;
      }
    },

    /**
     * Load all routers from Vue Router
     */
    loadRouters() {
      try {
        this.routerModules = getRoutesForDisplay();

        // Calculate total routers
        this.totalRouters = this.routerModules.reduce((sum, module) => {
          return sum + module.routes.length;
        }, 0);
      } catch (error) {
        this.showError(
          this.$t("adjustRole.loadRoutersError") + ": " + error.message
        );
      }
    },

    /**
     * Handle role selection change
     */
    async handleRoleChange() {
      if (!this.selectedRoleId) {
        this.selectedRole = null;
        this.selectedRouters = [];
        this.originalRouters = [];
        return;
      }

      this.isLoadingRoleDetail = true;

      try {
        const result = await this.roleApiStore.getRole(this.selectedRoleId);

        if (result.success) {
          this.selectedRole = result.data;
          this.selectedRouters = [...(result.data.routerAllow || [])];
          this.originalRouters = [...(result.data.routerAllow || [])];
        } else {
          this.showError(
            result.message || this.$t("adjustRole.loadRoleDetailError")
          );
          this.selectedRoleId = null;
        }
      } catch (error) {
        this.showError(
          error.message || this.$t("adjustRole.loadRoleDetailError")
        );
        this.selectedRoleId = null;
      } finally {
        this.isLoadingRoleDetail = false;
      }
    },

    /**
     * Select all routers
     */
    selectAllRouters() {
      this.selectedRouters = [];
      this.routerModules.forEach((module) => {
        module.routes.forEach((route) => {
          this.selectedRouters.push(route.name);
        });
      });
    },

    /**
     * Deselect all routers
     */
    deselectAllRouters() {
      this.selectedRouters = [];
    },

    /**
     * Check if all routes in a module are selected
     */
    isModuleSelected(moduleGroup) {
      if (!moduleGroup.routes || moduleGroup.routes.length === 0) return false;

      return moduleGroup.routes.every((route) =>
        this.selectedRouters.includes(route.name)
      );
    },

    /**
     * Toggle all routes in a module
     */
    toggleModule(moduleGroup, isSelected) {
      moduleGroup.routes.forEach((route) => {
        const index = this.selectedRouters.indexOf(route.name);

        if (isSelected && index === -1) {
          this.selectedRouters.push(route.name);
        } else if (!isSelected && index !== -1) {
          this.selectedRouters.splice(index, 1);
        }
      });
    },

    /**
     * Save router permissions
     */
    async handleSave() {
      if (!this.selectedRoleId) return;

      this.isSaving = true;

      try {
        const result = await this.roleApiStore.updateRole(this.selectedRoleId, {
          routerAllow: this.selectedRouters,
        });

        if (result.success) {
          this.showSuccess(result.message || this.$t("adjustRole.saveSuccess"));
          this.originalRouters = [...this.selectedRouters];

          // Refresh user data to get updated router permissions
          await this.authStore.refreshUser();

          // Refresh page after successful save and user data refresh
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        } else {
          this.showError(result.message || this.$t("adjustRole.saveError"));
        }
      } catch (error) {
        this.showError(error.message || this.$t("adjustRole.saveError"));
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Cancel and reset to original
     */
    handleCancel() {
      if (this.hasChanges) {
        if (confirm(this.$t("adjustRole.confirmCancel"))) {
          this.selectedRouters = [...this.originalRouters];
        }
      }
    },

    /**
     * Show success toast
     */
    showSuccess(message) {
      this.toast.add({
        severity: "success",
        summary: this.$t("common.success"),
        detail: message,
        life: 3000,
      });
    },

    /**
     * Show error toast
     */
    showError(message) {
      this.toast.add({
        severity: "error",
        summary: this.$t("common.error"),
        detail: message,
        life: 5000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// Adjust Role Router Page Styles
.adjust-role-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Page Header
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem;
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
    color: #f58511;
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

// Page Content
.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

// Title with Selector Layout
.title-with-selector {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  .title-group {
    flex: 1;
  }

  .role-selector-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-shrink: 0;

    .role-dropdown {
      min-width: 300px;
    }
  }
}

.adjust-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;

    i {
      color: #f58511;
      font-size: 1.25rem;
    }
  }

  // Special styling for router section
  &.router-section {
    display: flex;
    flex-direction: column;
  }
}

.role-info {
  .info-card {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #6b7280;
        text-transform: uppercase;
      }

      span {
        font-size: 0.875rem;
        color: #1f2937;
      }
    }
  }
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
}

.router-selection {
  display: flex;
  flex-direction: column;

  .selection-toolbar {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;

    .selected-count {
      margin-left: auto;
      font-size: 0.875rem;
      color: #6b7280;

      strong {
        color: #f58511;
        font-size: 1rem;
      }
    }
  }

  .router-modules-wrapper {
    // Custom scrollbar styling
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;

      &:hover {
        background: #9ca3af;
      }
    }
  }

  .router-modules {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .module-group {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;

      .module-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;

        h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .module-count {
          font-size: 0.875rem;
          color: #6b7280;
        }
      }

      .module-routes {
        padding: 1rem;

        .route-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 6px;
          transition: background 0.2s;

          &:hover {
            background: #f9fafb;
          }

          .route-label {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            cursor: pointer;

            .route-title {
              font-size: 0.875rem;
              font-weight: 500;
              color: #1f2937;
            }

            .route-name {
              font-size: 0.75rem;
              color: #f58511;
              font-family: monospace;
            }

            .route-path {
              font-size: 0.75rem;
              color: #9ca3af;
              font-family: monospace;
            }
          }
        }
      }
    }
  }
}

.save-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;

  .change-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #f59e0b;
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: auto;

    i {
      font-size: 1rem;
    }
  }

  .save-button {
    background: #f58511;
    border: none;
    margin-left: auto;

    &:hover {
      background: #e67710;
    }
  }
}

@media (max-width: 768px) {
  .title-with-selector {
    flex-direction: column;
    gap: 1.5rem;

    .role-selector-header {
      width: 100%;
      flex-direction: column;

      .role-dropdown {
        width: 100%;
        min-width: unset;
      }
    }
  }

  .info-card {
    grid-template-columns: 1fr !important;
  }

  .selection-toolbar {
    flex-wrap: wrap;

    .selected-count {
      margin-left: 0;
      flex-basis: 100%;
    }
  }
}

@media (max-width: 480px) {
  .role-selector-header {
    .role-dropdown {
      font-size: 0.875rem;
    }
  }
}
</style>
