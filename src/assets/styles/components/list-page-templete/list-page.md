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

## API Request/Response Pattern

### Standard List API Pattern

All list pages must follow this standard API request/response pattern for consistency and proper pagination functionality.

#### API Store Function (e.g., customer-api.js, worker-sale-api.js)

```javascript
const listItems = async (params = {}) => {
  isLoading.value = true
  error.value = null

  try {
    // ✅ CORRECT: Use skip, take, and sort array for backend API
    const payload = {
      skip: params.pageIndex || 0,
      take: params.pageSize || 10,
      sort: params.sort || [],  // Multi-sort array
      criteria: {
        searchText: params.criteria?.searchText || null
      }
    }

    const response = await api.jewelry.post('api/endpoint/list', payload)

    isLoading.value = false

    // ✅ CORRECT: Map response fields for frontend
    return {
      success: true,
      data: response.data || [],
      totalRecords: response.total || 0,
      pageIndex: payload.skip || 0,
      pageSize: payload.take || 10,
      //totalPages: response.totalPages || 0
    }
  } catch (err) {
    isLoading.value = false
    error.value = err.response?.data?.message || err.message

    return {
      success: false,
      message: error.value,
      data: [],
      totalRecords: 0
    }
  }
}
```

#### Sort Array Format

The `sort` parameter is an array of sort objects supporting **multi-column sorting**:

```javascript
// Single sort
sort: [
  { field: 'CreateDate', dir: 'desc' }
]

// Multi-sort (e.g., sort by name ascending, then by date descending)
sort: [
  { field: 'customerName', dir: 'asc' },
  { field: 'CreateDate', dir: 'desc' }
]

// No sort (let backend use default)
sort: []
```

**Important Notes**:
- **NO default sort** - Always pass empty array `[]` if no sort is selected
- Direction values: `'asc'` or `'desc'` (lowercase)
- Field names must match backend entity property names
- Order matters - first item is primary sort, second is secondary, etc.

#### Key Points

1. **Request Payload (to Backend)**:
   - Use `skip` - maps from `params.pageIndex`
   - Use `take` - maps from `params.pageSize`
   - Use `sort` - array of `{ field, dir }` objects
   - Backend expects `skip`, `take`, and `sort` fields

2. **Response Mapping (from Backend to Frontend)**:
   - Use `response.total` (backend returns `total`)
   - Map `payload.skip` to `pageIndex` for frontend
   - Map `payload.take` to `pageSize` for frontend

3. **Multi-Sort Support**:
   - Frontend DataTable component uses `sortMode="multiple"`
   - Users can hold Ctrl/Cmd and click multiple column headers
   - Data-table.vue automatically converts PrimeVue's multiSortMeta to sort array format
   - Sort array is passed through: DataTable → data-table-view.vue → index.vue → API store

4. **Why This Pattern**:
   - Backend API uses `skip/take` convention for pagination
   - Backend uses `sort` array for flexible multi-column sorting
   - Frontend components use `pageIndex/pageSize` convention
   - API store acts as translator between backend and frontend

---

## Expandable Row Pattern (Nested Table)

### Overview
For list pages that need to show child/detail data in expandable rows (e.g., showing stock materials within stock products), use PrimeVue DataTable's expandable row feature with nested tables.

### When to Use
- Show hierarchical data (parent-child relationships)
- Display detailed components/materials for each main row
- Provide additional information without navigating to another page
- Keep user context while exploring details

### Implementation Pattern

#### 1. data-table-view.vue with Expandable Rows

```vue
<template>
  <div class="list-data-table-container">
    <DataTable
      :value="stocks"
      v-model:expandedRows="expandedRows"
      dataKey="stockNumber"
    >
      <!-- Expand Column -->
      <Column :expander="true" headerStyle="width: 3rem" />

      <!-- Main Data Columns -->
      <Column field="stockNumber" header="Stock Number" />
      <Column field="productName" header="Product Name" />

      <!-- Expanded Row Template (Child Table) -->
      <template #expansion="{ data }">
        <div class="stock-material-expansion">
          <h4 class="material-section-title">
            <i class="pi pi-th-large"></i>
            Material Components
          </h4>

          <!-- Nested DataTable for Child Data -->
          <div v-if="data.materials && data.materials.length > 0" class="materials-table">
            <DataTable :value="data.materials" class="nested-material-table">
              <Column field="type" header="Type" />
              <Column field="weight" header="Weight" />
              <Column field="qty" header="Qty" />
              <Column field="price" header="Price" />
            </DataTable>
          </div>

          <!-- Empty State -->
          <div v-else class="no-materials">
            <i class="pi pi-inbox"></i>
            <p>No material data</p>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expandedRows: []  // Tracks which rows are expanded
    }
  }
}
</script>
```

#### 2. Styling for Expandable Rows

```scss
// In your component's scoped style or custom SCSS file

// Expansion Section Wrapper
.stock-material-expansion {
  padding: 1.5rem;
  background: #f9fafb;
  border-top: 2px solid #ff69b4;  // Use your theme color

  .material-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #ff69b4;

    i {
      color: #ff69b4;
      font-size: 1.125rem;
    }
  }

  // Nested Table Container
  .materials-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;

    :deep(.nested-material-table) {
      .p-datatable-thead > tr > th {
        background: #f3f4f6;
        color: #374151;
        font-weight: 600;
        font-size: 0.875rem;
        padding: 0.75rem 1rem;
        border-bottom: 2px solid #e5e7eb;
      }

      .p-datatable-tbody > tr > td {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }
    }
  }

  // Empty State
  .no-materials {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #9ca3af;

    i {
      font-size: 2rem;
      color: #d1d5db;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
  }
}
```

#### 3. Key Implementation Notes

**DataTable Props**:
- `v-model:expandedRows` - Two-way binding to track expanded rows state
- `dataKey` - Unique identifier for each row (required for expansion tracking)

**Expander Column**:
- Use `<Column :expander="true" />` for expand/collapse toggle
- Automatically renders expand icon and handles click events
- Typically placed as first column with fixed width (3rem)

**Expansion Template**:
- Use `#expansion="{ data }"` slot to access row data
- `data` contains the full row object with all properties
- Can contain any content: nested tables, forms, charts, images, etc.

**Nested Table Styling**:
- Use `:deep()` selector to style nested PrimeVue DataTable
- Different background colors to distinguish parent/child tables
- Smaller font sizes for child table (0.875rem vs 1rem)
- Consistent padding and spacing

**Empty State**:
- Always provide empty state for child data
- Use consistent empty state design with icon and message
- Helps user understand when no child data exists

#### 4. Data Structure Example

```javascript
// Parent row data should include child array
stocks = [
  {
    stockNumber: 'STK-001',
    productName: 'Gold Ring',
    qty: 10,
    materials: [  // Child data array
      { type: 'Gold', weight: 5.2, qty: 1, price: 15000 },
      { type: 'Diamond', weight: 0.5, qty: 2, price: 8000 }
    ]
  },
  {
    stockNumber: 'STK-002',
    productName: 'Silver Bracelet',
    qty: 15,
    materials: []  // Empty child data
  }
]
```

#### 5. Real Example Reference

See complete implementation in:
- `gem-ui/src/views/stock/list-inventory/components/data-table-view.vue`
- Stock Inventory page with expandable materials table

### Benefits

✅ **Better UX** - View details without page navigation
✅ **Context Preservation** - Keep main list visible while exploring details
✅ **Space Efficient** - Show detailed data only when needed
✅ **Hierarchical Data** - Perfect for parent-child relationships
✅ **Flexible Content** - Can display any content in expansion area

---

## Benefits

✅ **Reusability** - Write once, use everywhere
✅ **Maintainability** - Single source of truth
✅ **Consistency** - Uniform design language
✅ **Scalability** - Easy to extend

---

**Last Updated**: 2025-12-15
**Version**: 1.2
