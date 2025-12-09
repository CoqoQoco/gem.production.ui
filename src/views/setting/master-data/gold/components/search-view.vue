<template>
  <div class="list-search-header">
    <div class="list-search-container">
      <!-- Page Title -->
      <div class="list-page-title-section">
        <h2 class="list-page-title">
          <i class="pi pi-circle"></i>
          {{ $t("gold.title") || "จัดการข้อมูลทอง" }}
        </h2>
      </div>

      <!-- Search and Action Bar -->
      <div class="list-search-bar">
        <!-- Search Input -->
        <div class="list-search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="localSearchText"
            :placeholder="
              $t('gold.searchPlaceholder') || 'ค้นหารหัส, ชื่อ (ไทย), ชื่อ (อังกฤษ)...'
            "
            @keyup.enter="handleSearch"
            class="list-search-input"
          />
        </div>

        <!-- Search Button -->
        <Button
          icon="pi pi-search"
          @click="handleSearch"
          class="list-search-button"
        />

        <!-- Clear Button -->
        <Button
          icon="pi pi-times"
          class="list-search-button"
          @click="handleClear"
        />

        <!-- Add Gold Button -->
        <Button
          :label="$t('gold.addGold') || 'เพิ่มทอง'"
          icon="pi pi-plus"
          @click="handleAdd"
          class="list-search-button"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default {
  name: "SearchView",

  components: {
    InputText,
    Button
  },

  props: {
    searchText: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      localSearchText: this.searchText
    };
  },

  computed: {
    hasActiveFilters() {
      return !!this.localSearchText;
    }
  },

  watch: {
    searchText(newVal) {
      this.localSearchText = newVal;
    }
  },

  methods: {
    handleSearch() {
      this.$emit("search", {
        searchText: this.localSearchText
      });
    },

    handleClear() {
      this.localSearchText = "";
      this.$emit("search", {
        searchText: ""
      });
    },

    handleRefresh() {
      this.$emit("refresh");
    },

    handleAdd() {
      this.$emit("add");
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/search-view.scss';
</style>
