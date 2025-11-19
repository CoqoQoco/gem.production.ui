# List Page Template Documentation

## Overview
This directory contains reusable SCSS templates for list pages (index pages with search, data table, and detail modal). These templates provide consistent styling across all list pages in the project.

## Purpose
- **Reusability**: Create templates once, use across multiple list pages
- **Consistency**: Maintain uniform design patterns
- **Maintainability**: Update styles in one place, apply everywhere
- **Scalability**: Easy to extend for new list pages

---

## File Structure

```
list-page-templete/
├── index-view.scss          # Main page container styles
├── search-view.scss         # Search header section styles
├── data-table-view.scss     # Data table and cell styles
├── modal-view.scss          # Detail modal/dialog styles
└── list-page.md            # This documentation file
```

---

## Template Files

### 1. index-view.scss
**Purpose**: Main container for list pages

**Usage**:
```vue
<template>
  <div class="list-page-container">
    <!-- Page content here -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/index-view.scss';
</style>
```

**Classes**:
- `.list-page-container` - Main page wrapper with background and padding

---

### 2. search-view.scss
**Purpose**: Search header section with title, search bar, and filters

**Classes**:
- `.list-search-header` - Search section wrapper
- `.list-search-container` - Container for all search elements
- `.list-page-title-section` - Page title area
- `.list-page-title` - Title with icon
- `.list-page-subtitle` - Optional subtitle
- `.list-search-bar` - Search controls wrapper
- `.list-search-input-wrapper` - Input field wrapper
- `.list-search-input` - Search input field
- `.list-search-button` - Primary search button
- `.list-refresh-button` - Optional refresh button
- `.list-active-filters` - Active filters display

---

### 3. data-table-view.scss
**Purpose**: Data table container and cell templates

**Classes**:
- `.list-data-table-container` - Table wrapper
- `.list-name-cell` - Name/item cell with icon
- `.list-item-icon` - Icon for name cell
- `.list-username-cell` - Username cell
- `.list-email-cell` - Email cell
- `.list-roles-cell` - Roles/tags cell
- `.list-tag` - Individual tag/badge
- `.list-no-item` - Empty state text
- `.list-status-cell` - Status badge cell
- `.list-date-cell` - Date/time cell
- `.list-action-buttons` - Action buttons group

---

### 4. modal-view.scss
**Purpose**: Detail view modal/dialog styling

**Classes**:
- `.list-detail-dialog` - Dialog wrapper
- `.list-detail-loading` - Loading state
- `.list-detail-no-data` - Empty state
- `.list-detail-content` - Main content
- `.list-detail-header` - Header with avatar
- `.list-detail-avatar` - Avatar circle
- `.list-detail-title-group` - Title and subtitle
- `.list-detail-subtitle` - Subtitle text
- `.list-detail-status-badge` - Status badge
- `.list-detail-sections` - Sections wrapper
- `.list-detail-section` - Individual section
- `.list-detail-section-title` - Section title
- `.list-detail-info-grid` - Info grid layout
- `.list-detail-info-item` - Info field
- `.list-detail-info-value` - Value display
- `.list-detail-tags-container` - Tags container
- `.list-detail-tag` - Individual tag
- `.list-detail-no-item` - Empty state
- `.list-detail-footer` - Dialog footer

---

## Complete Example

### account-index.vue
```vue
<template>
  <div class="list-page-container">
    <SearchView />
    <DataTableView />
    <DetailView />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/index-view.scss';
</style>
```

### search-view.vue
```vue
<template>
  <div class="list-search-header">
    <div class="list-search-container">
      <div class="list-page-title-section">
        <h2 class="list-page-title">
          <i class="pi pi-users"></i>
          Page Title
        </h2>
      </div>
      <div class="list-search-bar">
        <div class="list-search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <InputText class="list-search-input" />
        </div>
        <Button class="list-search-button" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/search-view.scss';
</style>
```

### data-table-view.vue
```vue
<template>
  <div class="list-data-table-container">
    <DataTable>
      <template #nameTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-user list-item-icon"></i>
          <span>{{ data.name }}</span>
        </div>
      </template>
      <template #actionsTemplate="{ data }">
        <div class="list-action-buttons">
          <Button icon="pi pi-eye" />
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/data-table-view.scss';
</style>
```

### detail-view.vue
```vue
<template>
  <Dialog class="list-detail-dialog">
    <div v-if="loading" class="list-detail-loading">
      <ProgressSpinner />
    </div>
    <div v-else class="list-detail-content">
      <div class="list-detail-header">
        <div class="list-detail-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="list-detail-title-group">
          <h3>{{ data.name }}</h3>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/modal-view.scss';
</style>
```

---

## Class Naming Convention

### Prefix: `list-`
All template classes use `list-` prefix for:
- Clear identification
- Avoid naming conflicts
- Easy searchability
- Reusability indication

---

## Color Palette

- Primary: `#f58511`
- Primary Hover: `#e67710`
- Dark Gray: `#1f2937`
- Medium Gray: `#6b7280`
- Light Gray: `#9ca3af`
- Background: `#f3f4f6`
- White: `#ffffff`
- Blue Links: `#3b82f6`

---

## Benefits

✅ **Reusability** - Write once, use everywhere
✅ **Maintainability** - Single source of truth
✅ **Consistency** - Uniform design language
✅ **Scalability** - Easy to extend

---

**Last Updated**: 2025-11-19
**Version**: 1.0
