# গ্রামের হাট (Gramer Hat) - E-Commerce Platform

[![Development by SINI IT](https://img.shields.io/badge/Developed%20by-SINI%20IT-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/8801647236359)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Gramer Hat (গ্রামের হাট)** is a full-stack, bilingual (Bengali/English) agro e-commerce platform and mobile-ready headless CMS specializing in authentic Bangladeshi rural essentials: raw Sundarbans honey, hand-churned Bilona cow ghee, cold-pressed mustard oil, Dinajpur aromatic chinigura rice, and winter date palm jaggery.

---

## 👨‍💻 Developer Attribution
- **Developed by:** **SINI IT**
- **WhatsApp Direct Hotline:** [+8801647236359](https://wa.me/8801647236359) *(Click to open chat directly)*

---

## 🎨 Figma Design System Alignment
Pixel-perfect implementation of the **Gramer Hat Figma Design System** (`3hHgTV4qg4Vau3UyLR7rPi`):
- **Desktop Storefront (`1440 × 3760px`)** & **Mobile Storefront (`390 × 4879px`)**
- **Color Palette:**
  - Primary Forest Green: `#2D5F3F`
  - Deep Heritage Green: `#1E4029`
  - Warm Natural Cream: `#F7F4EC`
  - Soft Borders: `#E5E7EB`
- **Typography:**
  - Display & Headings: `Playfair Display` & `Noto Serif Bengali`
  - Interface & Body: `DM Sans` & `Noto Sans Bengali`
- **Sections:**
  1. Announcement Top Bar (`খাঁটি স্বাদের ঠিকানা · A little closer to nature, every day.`)
  2. Header with Wordmark, 839px Search with `⌘ K`, Language Toggle (`EN / বাংলা`), and Cart Indicator
  3. Warm Cream Hero (`গ্রামের খাঁটি স্বাদ, এবার আপনার ঘরে।`) with local harvest banquet photography
  4. 3-Column Trust Strip (*Thoughtfully sourced*, *Quality comes first*, *Delivered with care*)
  5. 110px Circular Category Showcase (Honey, Ghee, Spices, Rice, Jaggery)
  6. Regional Bestsellers with Badges (*Pantry favourite*, *Small-batch*, *Kitchen essential*, *Everyday goodness*)
  7. Seasonal Winter Feature (Jessore Date Palm Jaggery)
  8. Our Roots 3-Step Story (Source thoughtfully, Pack with care, Bring it home)
  9. Shopping Peace of Mind & Newsletter Subscription
  10. Footer with SINI IT Developer attribution & multi-currency payment icons

---

## 🛍️ Core Customer Features
- **Bilingual Experience:** Seamless instant toggle between বাংলা and English across all products, cart, and checkout.
- **Dynamic Slide-out Cart:** Real-time quantity adjustments, subtotal, shipping cost (Free over ৳1,000), and coupon support (`GRAMER10` / `FREESHIP`).
- **Single-Page Express Checkout:**
  - All Bangladesh districts & thanas with phone validation
  - **Cash on Delivery (COD)**
  - **bKash Send Money** with Merchant Number `01647-236359` & Transaction ID (TrxID) input
  - **Nagad Send Money**
  - Instant celebratory confetti on order placement
- **Order Tracking:** Live 5-step delivery pipeline from Order Placed → Verification → Processing → Courier Dispatch (Steadfast / Pathao) → Delivery.

---

## 📊 Headless CMS & Backoffice
- **Role-Based Access Control (RBAC):** Super Admin vs Moderator
- **Live Sales Analytics:** Daily revenue charts, order counts, and low-stock alerts
- **Product Management:** Add/edit products with multiple images, variant pricing (250g, 500g, 1kg), stock control, and pre-order flags
- **Order Management:** View customer payment details, verify bKash TrxIDs, update order states, and print invoices
- **Mobile CMS (PWA):** Manage the entire store from your smartphone

---

## 🗄️ Database Schema (Prisma)
The database models are structured in `prisma/schema.prisma` targeting PostgreSQL 15+:
- `User` (RBAC: `admin`, `moderator`, `customer`)
- `Product` & `ProductVariant`
- `Category`
- `Order` & `OrderItem`
- `OrderStatusHistory`
- `Banner` & `BlogPost`
- `SiteSetting` & `Coupon`

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📞 Support & Inquiries
For software development, customization, or e-commerce development:
- **Agency:** SINI IT
- **WhatsApp:** [+8801647236359](https://wa.me/8801647236359)
- **Email:** support@gramerhat.com.bd
