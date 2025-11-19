# Style Guide - Gem UI Project

## *31: -H2@-*2#5IH-@5" CSS/SCSS

---

## <¨ General Styling Principles

### 1. **D!HC
I List Page Template *3+#1+I25HD!HC
H List Page**

L **-"H23:**
```scss
@import '@/assets/styles/components/list-page-templete/index-view.scss';
@import '@/assets/styles/components/list-page-templete/search-view.scss';
@import '@/assets/styles/components/list-page-templete/data-table-view.scss';
```

 **3A5IA:**
- @5" custom styles @	20*3+#1+I21IF
- C
I class names 5H*7H-'2!+!2"@	20+I2
- 1'-"H2: `adjust-role-page`, `user-profile-page`, `settings-page`

---

## =Ð Layout & Spacing

### Page Structure

```scss
// Container +%1-+I2
.page-name-page {
  min-height: 100vh;
  background: #f3f4f6; // *57I+%1 gray-100
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header -+I2
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem; // #0"0+H2@H21 sections -7HF
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

// Content +%1-+I2
.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // #0"0+H2#0+'H2 sections
}
```

### Standard Spacing

**#0"0+H2!2#2:**
- #0+'H2 sections: `0.75rem` (12px)
- Padding  2"C card: `1.5rem` (24px)
- Gap #0+'H2 elements @%GF: `0.5rem` - `1rem`

**W *31: C
I#0"0+H2@H211I+!**
```scss
.page-header {
  margin-bottom: 0.75rem; //  @H21 gap - page-content
}

.page-content {
  gap: 0.75rem; //  @H21 margin-bottom - header
}
```

---

## <¯ Common Sections

### Section Cards

```scss
.section-card {
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
    margin: 0 0 1rem 0; // margin-bottom C+II-"%

    i {
      color: #f58511; // Primary color
      font-size: 1.25rem;
    }
  }
}
```

### Action Buttons Section

** 8H! Action I--"9H
4'2@*!-**

```scss
.action-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;

  // Indicator +#7- message -"9HI2"
  .info-indicator {
    margin-right: auto; // %1DI2"
  }

  // 8H! Cancel H- Save
  // Save button -"9H'2*8@*!-
  .save-button {
    margin-left: auto; // %1D'2 (I2D!H!5 indicator)
    background: #f58511;
    border: none;

    &:hover {
      background: #e67710;
    }
  }
}
```

**Template Example:**
```vue
<div class="action-section">
  <!-- Info/Warning Message (Optional) -->
  <span v-if="hasChanges" class="info-indicator">
    <i class="pi pi-exclamation-circle"></i>
    {{ $t('common.hasChanges') }}
  </span>

  <!-- Cancel Button (I2") -->
  <Button
    :label="$t('common.cancel')"
    icon="pi pi-times"
    @click="handleCancel"
    outlined
  />

  <!-- Save Button ('2*8) -->
  <Button
    :label="$t('common.save')"
    icon="pi pi-save"
    @click="handleSave"
    class="save-button"
  />
</div>
```

---

## =« Max-Height / Fixed Height

**L -"H23+ max-height +#7- fixed height**

```scss
// L D!H5 - 312+I2-
.content-wrapper {
  max-height: calc(100vh - 380px);
  overflow-y: auto;
}

//  5 - C+I content "2"2!4
.content-wrapper {
  // D!HI-3+ max-height
}
```

**I-"@'I:** C
IDI@	20#5:
- Modal/Dialog 5HI-2# scroll  2"C
- Table 5H!5 fixed header
- Specific UI components 5H3@G

---

## <¨ Colors

### Primary Colors
```scss
$primary: #f58511;      // Orange (Main brand color)
$primary-hover: #e67710;
$primary-light: rgba(245, 133, 17, 0.1);
```

### Neutral Colors
```scss
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-700: #374151;
$gray-900: #1f2937;
```

### Status Colors
```scss
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #3b82f6;
```

---

## =ñ Responsive Design

### Breakpoints
```scss
// Mobile
@media (max-width: 480px) { }

// Tablet
@media (max-width: 768px) { }

// Desktop
@media (min-width: 769px) { }
```

### Mobile-First Approach
```scss
.section-title {
  font-size: 1.5rem; // Mobile default

  @media (max-width: 768px) {
    font-size: 1.25rem; // Tablet
  }

  @media (min-width: 769px) {
    font-size: 1.75rem; // Desktop
  }
}
```

---

## <­ Component Patterns

### Title with Actions

```scss
.title-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  .title-group {
    flex: 1;

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
      }
    }

    .page-subtitle {
      color: #6b7280;
      font-size: 0.95rem;
      margin: 0;
    }
  }

  .action-group {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .action-group {
      width: 100%;
    }
  }
}
```

### Info Card/Grid

```scss
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

---

## =æ Shadow & Border Radius

### Shadows
```scss
// Subtle shadow for cards
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

// Medium shadow for elevated cards
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

// Strong shadow for modals
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```

### Border Radius
```scss
// Standard card
border-radius: 12px;

// Small elements (buttons, tags)
border-radius: 8px;

// Input fields
border-radius: 6px;
```

---

## ( Scrollbar Styling

```scss
.scrollable-area {
  overflow-y: auto;

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
```

---

## = Example: Complete Page Structure

```scss
// Main page container
.feature-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;
}

// Page header with title and actions
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// Main content area
.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

// Content sections
.content-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// Action buttons area
.action-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;

  .info-message {
    margin-right: auto;
  }

  .primary-button {
    margin-left: auto;
    background: #f58511;

    &:hover {
      background: #e67710;
    }
  }
}
```

---

## =Ë Checklist

@!7H-@5" styles C+I#'*-:

- [ ] D!HDI import list-page-template B"D!H3@G
- [ ] #0"0+H2#0+'H2 sections @H211I+! (0.75rem)
- [ ] 8H! Action -"9H
4'2
- [ ] D!H!5 max-height 5HD!H3@G
- [ ] Responsive design *3+#1 mobile/tablet
- [ ] C
I*52!!2#2 (#f58511 *3+#1 primary)
- [ ] Shadow A%0 border-radius 2!!2#2
- [ ] Class names *7H-'2!+!2"
1@

---

**Last Updated:** 2025-01-19
**Version:** 1.0
