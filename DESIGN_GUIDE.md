# TeslaMR Design System Specification

> **Purpose**: This document provides a complete design specification for maintaining visual and interaction consistency across TeslaMR web applications. Use this as a reference when creating new pages.

---

## Table of Contents

1. [Foundation](#foundation)
   - [Colors](#colors)
   - [Typography](#typography)
   - [Spacing System](#spacing-system)
   - [Border Radius](#border-radius)
   - [Shadows](#shadows)
2. [Layout](#layout)
3. [Components](#components)
4. [Animations](#animations)
5. [Responsive Design](#responsive-design)
6. [Interactive States](#interactive-states)
7. [Accessibility](#accessibility)

---

## Foundation

### Colors

#### Primary Palette
```css
/* Primary Blue (Interactive Elements) */
--primary-blue: #0A84FF;
--primary-blue-dark: #0077ED;
--primary-blue-darker: #0066CC;
--primary-blue-light: #f0f8ff;
--primary-blue-lighter: #e0f0ff;

/* Success Green */
--success-green: #34C759;
--success-green-dark: #28a745;
--success-green-bg: #d5f4e6;
--success-green-bg-alt: #b8e5d2;

/* Error Red */
--error-red: #FF3B30;
--error-red-bg: #ffe5e5;
--error-red-bg-alt: #ffd4d4;

/* Warning Orange */
--warning-orange: #FF9500;
--warning-orange-dark: #FF8C00;

/* Purple (Accent) */
--accent-purple: #5856D6;
```

#### Neutral Palette
```css
/* Grays */
--gray-900: #1a1a1a;  /* Primary text */
--gray-700: #666;     /* Secondary text */
--gray-500: #ccc;     /* Disabled states */
--gray-300: #e0e0e0;  /* Borders */
--gray-200: #f0f0f0;  /* Light borders, backgrounds */
--gray-100: #f8f9fa;  /* Subtle backgrounds */
--gray-50: #fafbfc;   /* Lightest backgrounds */

/* White */
--white: #ffffff;
```

#### Background Gradients
```css
/* Page Background */
body {
    background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 50%, #fafbfc 100%);
}

/* Header Background */
.top-header {
    background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
}

/* Primary Button */
.primary-btn {
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
}

/* Primary Button Hover */
.primary-btn:hover {
    background: linear-gradient(135deg, #0077ED 0%, #0066CC 100%);
}

/* Success Elements */
.success-bg {
    background: linear-gradient(135deg, #34C759 0%, #28a745 100%);
}

/* Selected/Active States */
.selected {
    background: linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 100%);
}

/* Correct Answer */
.correct {
    background: linear-gradient(135deg, #d5f4e6 0%, #b8e5d2 100%);
}

/* Incorrect Answer */
.incorrect {
    background: linear-gradient(135deg, #ffe5e5 0%, #ffd4d4 100%);
}

/* Info Box */
.info-box {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Warning State */
.warning {
    background: linear-gradient(135deg, #FF9500 0%, #FF8C00 100%);
}
```

---

### Typography

#### Font Stack
```css
body {
    font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

#### Font Sizes & Weights
```css
/* Headers */
.page-title {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
}

.subsection-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
}

.header-title {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.3px;
}

/* Content */
.question-text {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
}

.body-large {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
}

.body-medium {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
}

.body-regular {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
}

.body-small {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
}

.body-tiny {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
}

.caption {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
}

.label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
    .page-title { font-size: 24px; }
    .section-title { font-size: 22px; }
    .question-text { font-size: 22px; font-weight: 700; }
    .body-large { font-size: 17px; }
    .body-medium { font-size: 15px; }
}
```

#### Letter Spacing
```css
/* Tight for large text */
.tight-spacing {
    letter-spacing: -0.5px; /* For 28px+ headings */
}

.medium-spacing {
    letter-spacing: -0.3px; /* For 20-24px headings */
}

/* Wide for labels */
.uppercase-label {
    letter-spacing: 0.5px;
}
```

---

### Spacing System

Use an 8px base grid system:

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;
--space-32: 32px;
--space-40: 40px;
--space-48: 48px;

/* Component-specific spacing */
.header-padding: 16px 24px;
.card-padding: 32px;
.section-gap: 24px;
.element-gap: 12px;

/* Mobile */
@media (max-width: 768px) {
    .header-padding: 12px 16px;
    .card-padding: 20px 16px;
    .section-gap: 16px;
    .element-gap: 10px;
}
```

---

### Border Radius

```css
--radius-small: 4px;    /* Badges, tags */
--radius-medium: 8px;   /* Buttons, inputs */
--radius-large: 12px;   /* Cards, sections */
--radius-xl: 16px;      /* Modals */
--radius-pill: 24px;    /* Pills, toggles */
--radius-circle: 50%;   /* Avatar circles */
```

**Usage:**
- **4px**: Small badges, progress bars
- **8px**: Standard buttons, inputs, nav items
- **12px**: Answer options, cards, main content areas
- **16px**: Modals, popups
- **24px**: Section pills, filter toggles
- **50%**: Letter badges, avatar circles

---

### Shadows

```css
/* Elevation System */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.shadow-md {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.shadow-lg {
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.shadow-xl {
    box-shadow: 0 12px 48px rgba(0,0,0,0.3);
}

/* Colored Shadows (for interactive elements) */
.shadow-primary {
    box-shadow: 0 4px 16px rgba(10, 132, 255, 0.3);
}

.shadow-primary-lg {
    box-shadow: 0 8px 24px rgba(10, 132, 255, 0.4);
}

.shadow-success {
    box-shadow: 0 6px 20px rgba(88, 214, 141, 0.4);
}

.shadow-error {
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

/* Inset Shadows */
.inset-shadow {
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

---

## Layout

### Page Structure

```html
<body>
    <!-- Top Header: Fixed navigation -->
    <div class="top-header">
        <div class="header-left">
            <a href="index.html">
                <img src="logo.png" alt="TeslaMR" class="logo-img">
            </a>
            <div class="header-title">Page Title</div>
        </div>
        
        <div class="auth-section">
            <!-- Auth buttons/user info -->
        </div>
    </div>
    
    <!-- Main Content: Flexbox centering -->
    <div class="main-content">
        <div class="quiz-container">
            <!-- Page content -->
        </div>
    </div>
</body>
```

### Header Specifications

```css
.top-header {
    background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
    border-bottom: 1px solid #e0e0e0;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    min-height: 72px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
}

.logo-img {
    height: 48px;
    width: auto;
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: scale(1.05);
}

.header-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.3;
    letter-spacing: -0.3px;
}

/* Mobile */
@media (max-width: 768px) {
    .top-header {
        flex-direction: column;
        padding: 16px 16px 12px 16px;
        min-height: 64px;
        gap: 8px;
    }
    
    .header-left {
        flex-direction: column;
        gap: 6px;
        align-items: center;
    }
    
    .logo-img {
        height: 32px;
    }
    
    .header-title {
        font-size: 13px;
        font-weight: 600;
        text-align: center;
    }
}
```

### Main Content Container

```css
.main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
}

.quiz-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    max-width: 800px;
    width: 100%;
    padding: 32px;
    transition: all 0.3s ease;
}

.quiz-container:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}

/* Mobile */
@media (max-width: 768px) {
    .quiz-container {
        padding: 20px 16px;
        border-radius: 0;
        box-shadow: none;
        border: none;
    }
}
```

---

## Components

### Buttons

#### Primary Button
```css
.primary-btn {
    padding: 16px 48px;
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(10, 132, 255, 0.3);
}

.primary-btn:hover {
    background: linear-gradient(135deg, #0077ED 0%, #0066CC 100%);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 24px rgba(10, 132, 255, 0.4);
}

.primary-btn:active {
    transform: translateY(0) scale(0.98);
}

.primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}
```

#### Secondary Button
```css
.secondary-btn {
    padding: 12px 24px;
    background: transparent;
    border: 2px solid #0A84FF;
    color: #0A84FF;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-btn:hover:not(:disabled) {
    background: #0A84FF;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(10, 132, 255, 0.3);
}

.secondary-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #ccc;
    color: #ccc;
}
```

#### Auth Button
```css
.auth-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.auth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

.auth-btn.secondary {
    background: transparent;
    border: 2px solid #0A84FF;
    color: #0A84FF;
    padding: 8px 16px;
}

.auth-btn.secondary:hover {
    background: #0A84FF;
    color: white;
}
```

#### Mobile Button Adjustments
```css
@media (max-width: 768px) {
    .primary-btn {
        padding: 16px 40px;
        font-size: 17px;
        width: 100%;
    }
    
    .secondary-btn {
        flex: 1;
        padding: 14px 20px;
        font-size: 15px;
        min-height: 56px;
    }
    
    .auth-btn {
        font-size: 13px;
        padding: 8px 16px;
    }
}
```

---

### Answer Options

```css
.answers {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
}

.answer-option {
    padding: 16px 20px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeIn 0.4s ease-out backwards;
}

/* Staggered animation for options */
.answer-option:nth-child(1) { animation-delay: 0.1s; }
.answer-option:nth-child(2) { animation-delay: 0.15s; }
.answer-option:nth-child(3) { animation-delay: 0.2s; }
.answer-option:nth-child(4) { animation-delay: 0.25s; }

.answer-option:hover {
    background: #f0f8ff;
    border-color: #0A84FF;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.1);
}

.answer-option.selected {
    background: linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 100%);
    border-color: #0A84FF;
    box-shadow: 0 2px 8px rgba(10, 132, 255, 0.15);
}

.answer-option.correct {
    background: linear-gradient(135deg, #d5f4e6 0%, #b8e5d2 100%);
    border-color: #58d68d;
    box-shadow: 0 6px 20px rgba(88, 214, 141, 0.4);
    animation: celebrate 0.6s ease;
}

.answer-option.incorrect {
    background: linear-gradient(135deg, #ffe5e5 0%, #ffd4d4 100%);
    border-color: #ff6b6b;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    animation: shake 0.5s ease;
}

.answer-option.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

/* Letter Badge */
.answer-letter {
    width: 32px;
    height: 32px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: #666;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.answer-option:hover .answer-letter {
    border-color: #0A84FF;
    color: #0A84FF;
}

.answer-option.selected .answer-letter {
    background: #0A84FF;
    border-color: #0A84FF;
    color: white;
}

.answer-option.correct .answer-letter {
    background: #34C759;
    border-color: #34C759;
    color: white;
}

.answer-option.incorrect .answer-letter {
    background: #FF3B30;
    border-color: #FF3B30;
    color: white;
}

/* Mobile */
@media (max-width: 768px) {
    .answer-option {
        padding: 18px 16px;
        font-size: 16px;
        min-height: 60px;
    }
    
    .answer-letter {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
}
```

---

### Section Pills (Category Selectors)

```css
.section-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 32px;
    justify-content: center;
}

.section-pill {
    padding: 12px 24px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 24px;
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
}

.section-pill:hover {
    background: #f0f8ff;
    border-color: #0A84FF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.15);
}

.section-pill.active {
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    border-color: #0A84FF;
    color: white;
    box-shadow: 0 4px 16px rgba(10, 132, 255, 0.3);
}

.section-pill.completed {
    background: linear-gradient(135deg, #34C759 0%, #28a745 100%);
    border-color: #34C759;
    color: white;
}

.section-pill.in-progress {
    background: linear-gradient(135deg, #FF9500 0%, #FF8C00 100%);
    border-color: #FF9500;
    color: white;
}

.section-icon {
    font-size: 18px;
}

.section-progress {
    font-size: 12px;
    opacity: 0.9;
}

/* Mobile */
@media (max-width: 768px) {
    .section-selector {
        display: none; /* Moved to drawer */
    }
    
    /* In drawer */
    .section-drawer .section-selector {
        display: flex !important;
        flex-direction: column;
        gap: 10px;
    }
    
    .section-drawer .section-pill {
        padding: 14px 16px;
        font-size: 15px;
        width: 100%;
        justify-content: space-between;
        border-radius: 12px;
    }
}
```

---

### Progress Bar

```css
.progress-section {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.progress-text {
    font-size: 13px;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.progress-bar {
    height: 8px;
    background: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    border-radius: 8px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px rgba(10, 132, 255, 0.3);
}

.stats {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #666;
}

.stat {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat strong {
    color: #1a1a1a;
    font-weight: 600;
}

/* Mobile */
@media (max-width: 768px) {
    .progress-section {
        margin-bottom: 16px;
        padding-bottom: 12px;
    }
    
    .progress-text {
        font-size: 12px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .progress-bar {
        height: 4px;
        margin-bottom: 10px;
    }
    
    .stats {
        gap: 8px;
        flex-wrap: nowrap;
    }
    
    .stat {
        font-size: 11px;
        padding: 4px 8px;
        background: #f8f9fa;
        border-radius: 4px;
        flex: 1;
        justify-content: center;
    }
    
    .stat strong {
        font-size: 13px;
    }
}
```

---

### Modals & Overlays

#### Modal Overlay
```css
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 2000;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
}

.modal-overlay.show {
    display: flex;
}
```

#### Modal Content
```css
.modal {
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    padding: 40px;
    max-width: 450px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.4s ease-out;
}

.modal h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.modal p {
    font-size: 15px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 24px;
}

.modal input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    margin-bottom: 16px;
    transition: border-color 0.3s ease;
}

.modal input:focus {
    outline: none;
    border-color: #0A84FF;
}

.modal-actions {
    display: flex;
    gap: 12px;
}

.modal-actions button {
    flex: 1;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* Mobile */
@media (max-width: 768px) {
    .modal {
        padding: 32px 24px;
        width: 95%;
    }
    
    .modal h2 {
        font-size: 20px;
    }
    
    .modal p {
        font-size: 14px;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .modal-actions button {
        width: 100%;
    }
}
```

#### Feedback Popup
```css
.feedback-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
}

.feedback-overlay.show {
    display: flex;
}

.feedback-popup {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 32px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease-out;
    position: relative;
    z-index: 1001;
}

.feedback-icon {
    font-size: 72px;
    margin-bottom: 20px;
    animation: celebrate 0.6s ease;
}

.feedback-icon.correct-icon {
    color: #28a745;
    filter: drop-shadow(0 0 20px rgba(40, 167, 69, 0.4));
}

.feedback-icon.incorrect-icon {
    color: #ff3b30;
    filter: drop-shadow(0 0 20px rgba(255, 59, 48, 0.4));
    animation: shake 0.5s ease;
}

.feedback-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
}

.feedback-title.correct {
    color: #34C759;
}

.feedback-title.incorrect {
    color: #FF3B30;
}

.feedback-message {
    font-size: 15px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 24px;
}

.feedback-message strong {
    color: #1a1a1a;
    font-weight: 600;
}

.feedback-continue-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

.feedback-continue-btn:hover {
    background: linear-gradient(135deg, #0077ED 0%, #0066CC 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(10, 132, 255, 0.4);
}

.feedback-continue-btn:active {
    transform: translateY(0);
}

/* Mobile */
@media (max-width: 768px) {
    .feedback-popup {
        width: 95%;
        padding: 28px 24px;
        margin: 20px;
    }
    
    .feedback-icon {
        font-size: 56px;
        margin-bottom: 12px;
    }
    
    .feedback-title {
        font-size: 22px;
        margin-bottom: 10px;
    }
    
    .feedback-message {
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .feedback-continue-btn {
        width: 100%;
        padding: 16px 32px;
        font-size: 17px;
        font-weight: 700;
    }
}
```

---

### Info Boxes

```css
.info-box {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 32px;
    text-align: left;
}

.info-box h3 {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}

.info-box ul {
    list-style: none;
    font-size: 14px;
    color: #1a1a1a;
    line-height: 2;
}

.info-box ul li:before {
    content: "✓";
    color: #34C759;
    font-weight: 600;
    margin-right: 8px;
}

/* Mobile */
@media (max-width: 768px) {
    .info-box {
        padding: 16px;
        margin-bottom: 20px;
    }
    
    .info-box h3 {
        font-size: 12px;
        margin-bottom: 12px;
    }
    
    .info-box ul {
        font-size: 13px;
        line-height: 1.8;
    }
}
```

---

### Badges & Labels

```css
.badge {
    display: inline-block;
    padding: 4px 12px;
    background: #f0f8ff;
    color: #0A84FF;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge.success {
    background: #d5f4e6;
    color: #28a745;
}

.badge.error {
    background: #ffe5e5;
    color: #ff3b30;
}

.badge.warning {
    background: #fff3e0;
    color: #FF9500;
}

/* Mobile */
@media (max-width: 768px) {
    .badge {
        font-size: 10px;
        padding: 4px 10px;
    }
}
```

---

### Mobile Drawer (Hamburger Menu)

```css
/* Drawer Toggle (Mobile Only) */
.drawer-toggle {
    display: none;
}

@media (max-width: 768px) {
    /* Overlay */
    .drawer-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .drawer-overlay.open {
        display: block;
        opacity: 1;
    }
    
    /* Hamburger Toggle */
    .drawer-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: transparent;
        color: #0A84FF;
        border: none;
        border-radius: 8px;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: fixed;
        top: 10px;
        left: 16px;
        z-index: 1001;
    }
    
    .drawer-toggle:active {
        transform: scale(0.95);
        background: rgba(10, 132, 255, 0.1);
    }
    
    /* Drawer */
    .drawer {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 280px;
        background: white;
        box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
    }
    
    .drawer.open {
        transform: translateX(0);
    }
    
    .drawer-header {
        padding: 20px 16px 16px 16px;
        border-bottom: 1px solid #e0e0e0;
        background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
    }
    
    .drawer-title {
        font-size: 18px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0;
    }
    
    .drawer-content {
        padding: 16px;
    }
}
```

---

## Animations

### Core Animations

```css
/* Fade In */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Slide Up */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scale In */
@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Celebrate (Success) */
@keyframes celebrate {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-5deg); }
    50% { transform: scale(1.2) rotate(5deg); }
    75% { transform: scale(1.1) rotate(-5deg); }
    100% { transform: scale(1) rotate(0deg); }
}

/* Shake (Error) */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

/* Confetti Fall */
@keyframes confetti-fall {
    0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translateY(100vh) rotate(720deg);
    }
}
```

### Animation Usage

```css
/* Apply animations */
.fade-in {
    animation: fadeIn 0.4s ease-out;
}

.slide-up {
    animation: slideUp 0.5s ease-out;
}

.scale-in {
    animation: scaleIn 0.5s ease-out;
}

/* With delays (staggered) */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.15s; }
.stagger-3 { animation-delay: 0.2s; }
.stagger-4 { animation-delay: 0.25s; }
```

### Confetti Effect (JavaScript)

```javascript
function createConfetti() {
    const colors = ['#58d68d', '#667eea', '#764ba2', '#f093fb', '#FFD700', '#FF69B4', '#0A84FF', '#34C759'];
    const confettiCount = 40;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2500);
    }
}
```

```css
.confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    background: #58d68d;
    opacity: 0;
    animation: confetti-fall 2s ease-out forwards;
    z-index: 10000;
}
```

---

## Responsive Design

### Mobile Breakpoint

```css
@media (max-width: 768px) {
    /* Mobile-specific styles */
}
```

### Key Mobile Adaptations

1. **Header**: Stack vertically, reduce logo size, center align
2. **Navigation**: Convert to hamburger drawer
3. **Container**: Full-width, no rounded corners, reduced padding
4. **Buttons**: Full-width, larger touch targets (min 56px height)
5. **Typography**: Slightly smaller for content, larger for questions
6. **Section Pills**: Move to side drawer instead of inline
7. **Stats**: Compact cards with smaller text
8. **Progress Bar**: Thinner (4px vs 8px)
9. **Bottom Navigation**: Sticky at bottom with safe area padding

### Touch Optimization

```css
/* Remove tap highlight */
* {
    -webkit-tap-highlight-color: transparent;
}

/* Enable touch manipulation */
body {
    touch-action: manipulation;
}

/* Larger touch targets on mobile */
@media (max-width: 768px) {
    .answer-option {
        min-height: 60px;
        padding: 18px 16px;
    }
    
    .nav-btn {
        min-height: 56px;
    }
}
```

### Prevent Body Scroll (when drawer open)

```javascript
// When drawer opens
if (drawer.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
} else {
    document.body.style.overflow = '';
}
```

---

## Interactive States

### Hover States

```css
/* General hover pattern */
.interactive-element:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.2);
}

/* Button hover */
.button:hover {
    background: /* darker gradient */;
    transform: translateY(-3px) scale(1.02);
    box-shadow: /* larger shadow */;
}

/* Answer option hover */
.answer-option:hover {
    background: #f0f8ff;
    border-color: #0A84FF;
    transform: translateX(4px);
}

/* Link hover */
.link:hover {
    color: #0066CC;
    transform: translateX(-3px);
}
```

### Active/Press States

```css
/* Button press */
.button:active {
    transform: translateY(0) scale(0.98);
}

/* Mobile tap feedback */
@media (max-width: 768px) {
    .button:active {
        transform: scale(0.95);
    }
}
```

### Disabled States

```css
.button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.button:disabled:hover {
    transform: none;
    box-shadow: none;
}
```

### Selected/Active States

```css
.selected {
    background: linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 100%);
    border-color: #0A84FF;
    box-shadow: 0 2px 8px rgba(10, 132, 255, 0.15);
}

.active {
    background: linear-gradient(135deg, #0A84FF 0%, #0077ED 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(10, 132, 255, 0.3);
}
```

### Focus States

```css
input:focus,
textarea:focus {
    outline: none;
    border-color: #0A84FF;
    box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.1);
}
```

---

## Accessibility

### Focus Visible

```css
/* Keyboard navigation */
button:focus-visible,
a:focus-visible {
    outline: 2px solid #0A84FF;
    outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Color Contrast

- Body text (`#1a1a1a`) on white: 16.24:1 ✓ WCAG AAA
- Secondary text (`#666`) on white: 5.74:1 ✓ WCAG AA
- Primary blue (`#0A84FF`) on white: 3.32:1 (for large text only)

### Semantic HTML

Always use:
- `<button>` for clickable actions
- `<a>` for navigation
- `<label>` for form inputs
- Proper heading hierarchy (`h1`, `h2`, `h3`)
- ARIA labels where needed

---

## Assets & Icons

### Logo

- **Desktop**: 48px height
- **Mobile**: 32px height
- **Format**: PNG with transparency
- **Location**: `/logo.png`

### Favicon

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
```

### Apple Touch Icon

```html
<link rel="apple-touch-icon" href="logo.png">
```

### Emoji Icons Used

| Icon | Usage | Unicode |
|------|-------|---------|
| 📚 | Books/Learning | U+1F4DA |
| 📝 | Suffixes | U+1F4DD |
| 🔤 | Prefixes | U+1F524 |
| 🌿 | Root Words | U+1F33F |
| 📋 | Abbreviations | U+1F4CB |
| 🧍 | Positioning | U+1F9CD |
| 🎉 | Celebration/Success | U+1F389 |
| 🏆 | Excellence | U+1F3C6 |
| ✓ | Checkmark | U+2713 |
| 💡 | Hint/Idea | U+1F4A1 |
| 🚀 | Quick Start | U+1F680 |
| 🔄 | Retry/Refresh | U+1F504 |
| ← | Back | U+2190 |
| → | Next | U+2192 |
| ☰ | Hamburger Menu | U+2630 |

---

## Code Snippets

### Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="mobile-web-app-capable" content="yes">
    <title>Page Title | TeslaMR</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
    <link rel="apple-touch-icon" href="logo.png">
</head>
<body>
    <!-- Page structure -->
</body>
</html>
```

### Reset & Base Styles

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 50%, #fafbfc 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: manipulation;
}
```

### Transition Timing Functions

```css
/* Standard easing */
.standard {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fast easing (for small elements) */
.fast {
    transition: all 0.2s ease;
}

/* Slow easing (for large movements) */
.slow {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Haptic Feedback (JavaScript)

```javascript
function playHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}
```

---

## Implementation Checklist

When creating a new page, ensure:

- [ ] Meta tags for mobile optimization included
- [ ] Base reset styles applied
- [ ] Body gradient background used
- [ ] Header with logo and title implemented
- [ ] Main content container with proper centering
- [ ] Buttons follow primary/secondary patterns
- [ ] All interactive elements have hover/active states
- [ ] Mobile drawer implemented if navigation needed
- [ ] Progress indicators use standard styling
- [ ] Animations applied to page transitions
- [ ] Modal overlays use backdrop blur
- [ ] Color palette maintained throughout
- [ ] Typography hierarchy followed
- [ ] Touch targets minimum 44px on mobile
- [ ] Responsive breakpoint at 768px
- [ ] Focus states for keyboard navigation
- [ ] Reduced motion media query included
- [ ] Proper semantic HTML used
- [ ] ARIA labels where appropriate

---

## Additional Notes

### Performance Considerations

1. **Use CSS transforms** for animations (better performance than position changes)
2. **Backdrop-filter** may be heavy on older devices—test performance
3. **Confetti animation** creates DOM elements—limit to 40 pieces max
4. **Transition all** is convenient but less performant than specific properties

### Browser Compatibility

- **backdrop-filter**: May need fallback for older browsers
- **CSS gradients**: Fully supported in modern browsers
- **Flexbox**: Fully supported
- **CSS animations**: Fully supported
- **Vibration API**: Limited to mobile devices

### Best Practices

1. Always test on actual mobile devices, not just browser DevTools
2. Use Safari Web Inspector for iOS-specific debugging
3. Test touch interactions thoroughly
4. Ensure drawer closes on section selection (mobile)
5. Prevent body scroll when modals/drawers are open
6. Clean up event listeners to prevent memory leaks
7. Use semantic HTML for better accessibility
8. Test with screen readers when possible

---

## Questions?

If you need clarification on any design element, refer back to the source file `medterm.html` or consult with the design team.

**Last Updated**: October 23, 2025
**Version**: 1.0
**Maintainer**: TeslaMR Design Team

