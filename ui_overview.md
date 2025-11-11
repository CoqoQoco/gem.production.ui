# UI Design System Overview

## Project Information
- **Project Name:** Jewelry POS + WMS System
- **Technology Stack:** Vue 3 + PrimeVue 4.0
- **Target:** 3 Branches Jewelry Store
- **Phase 1 Scope:** Authentication Module + Dashboard Overview

---

## Design Reference
Based on client's existing website theme:
- **Business Type:** Jewelry Retail & Wholesale + Custom Jewelry
- **Target Audience:** B2C (Retail customers) + B2B (Wholesale)

---

## Color Palette

### Primary Colors (จากธีมร้านค้าเดิม - Jewelry Theme)
```css
--primary-50: #fef3e7;
--primary-100: #fde7cf;
--primary-200: #fbcea0;
--primary-300: #f9b670;
--primary-400: #f79d41;
--primary-500: #f58511;  /* Main Brand Color - Gold/Orange */
--primary-600: #c46a0e;
--primary-700: #93500a;
--primary-800: #623507;
--primary-900: #311b03;

/* Alternative Gold Accent */
--gold-light: #FFD700;
--gold-medium: #DAA520;
--gold-dark: #B8860B;
```

### Secondary Colors (เพื่อความหรูหราและสง่างาม)
```css
--secondary-50: #f0f4f8;
--secondary-100: #d9e2ec;
--secondary-200: #bcccdc;
--secondary-300: #9fb3c8;
--secondary-400: #829ab1;
--secondary-500: #627d98;  /* Professional Gray-Blue */
--secondary-600: #486581;
--secondary-700: #334e68;
--secondary-800: #243b53;
--secondary-900: #102a43;
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

--white: #ffffff;
--black: #000000;
```

### Status Colors
```css
--success: #10b981;  /* สำหรับการขายสำเร็จ */
--warning: #f59e0b;  /* สำหรับ pending/warning */
--error: #ef4444;    /* สำหรับ error/reject */
--info: #3b82f6;     /* สำหรับข้อมูล */
```

---

## Typography

### Font Family
```css
/* Primary Font */
font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;

/* Numbers & Data Display */
font-family: 'Inter', 'Roboto', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Fully rounded */
```

---

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## Layout Structure

### Screen Breakpoints
```css
--screen-sm: 640px;   /* Mobile */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large Desktop */
--screen-2xl: 1536px; /* Extra Large */
```

### Container Max Width
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

---

## Component Standards

### Buttons
- **Height:** 40px (default), 32px (small), 48px (large)
- **Padding:** 12px 24px (default)
- **Border Radius:** var(--radius-lg)
- **Font Weight:** var(--font-medium)

### Input Fields
- **Height:** 40px
- **Padding:** 0 12px
- **Border:** 1px solid var(--gray-300)
- **Border Radius:** var(--radius-md)
- **Focus Border:** 2px solid var(--primary-500)

### Cards
- **Background:** var(--white)
- **Border:** 1px solid var(--gray-200)
- **Border Radius:** var(--radius-xl)
- **Padding:** var(--space-6)
- **Shadow:** var(--shadow-md)

---

## Icons
- **Library:** PrimeIcons (included in PrimeVue)
- **Size:** 16px (small), 20px (default), 24px (large)

---

## Animation & Transitions
```css
--transition-fast: 150ms ease-in-out;
--transition-normal: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

---

## Accessibility
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum touch target: 44x44px
- Focus indicators: Always visible with 2px outline
- Alt text for all images
- ARIA labels for interactive elements

---

## Notes for Claude Code
1. ใช้ PrimeVue 4.0 components เป็นหลัก
2. ไม่ต้องเชื่อมต่อ API ในเฟสนี้ (mock data เท่านั้น)
3. ให้ความสำคัญกับ UX/UI ที่เหมาะกับธุรกิจจิวเวลรี่ (หรูหรา, น่าเชื่อถือ)
4. Responsive design สำหรับทุก screen size
5. ใช้ภาษาไทยเป็นหลัก (labels, messages, etc.)
6. Component ต้อง reusable และ maintainable

---

## Project Structure
```
src/
├── assets/
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── primevue-theme.css
│   └── images/
├── components/
│   ├── common/
│   ├── auth/
│   └── dashboard/
├── views/
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   └── dashboard/
│       └── DashboardView.vue
├── router/
│   └── index.js
├── stores/
│   └── auth.js
├── App.vue
└── main.js
```

---

## Next Steps
1. อ่านและทำความเข้าใจ Design System นี้
2. ดู ui-auth.md สำหรับ Login/Register pages
3. ดู ui-dashboard.md สำหรับ Main Dashboard
4. ดู ui-components.md สำหรับ Reusable Components
5. เริ่มพัฒนาตาม specification

---

**Created by:** Full Stack Developer  
**Last Updated:** {{ current_date }}  
**Version:** 1.0