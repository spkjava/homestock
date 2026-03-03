# 🏠 HOME STOCK — จัดการของใช้ในบ้าน

แอปเว็บสำหรับติดตามจำนวนของใช้ในชีวิตประจำวัน เช่น สบู่ แชมพู กระดาษทิชชู่ ฯลฯ รองรับหลายสถานที่ เก็บข้อมูลใน localStorage ไม่ต้องใช้ server

## ✨ ฟีเจอร์

- **📍 หลายสถานที่** — สร้างที่อยู่ได้หลายแห่ง เช่น บ้าน คอนโด หอพัก
- **➕ เพิ่มสินค้า Default** — ตั้งชื่อสินค้าและจำนวน default ได้
- **🔢 เพิ่ม/ลด Stock** — กดปุ่ม +/- เพื่อปรับจำนวน
- **🔍 ค้นหาสินค้า** — พิมพ์ชื่อเพื่อกรองรายการแบบ real-time
- **🚦 สถานะ 3 ระดับ**:
  - 🟢 **ใช้งานอยู่** — มีสินค้ามากกว่า 1 ชิ้น
  - 🟡 **เหลือ 1 ชิ้น** — เตือนว่าใกล้หมด
  - 🔴 **ของหมด** — จำนวน = 0
- **💾 localStorage** — ข้อมูลเก็บใน browser ไม่หายเมื่อปิดหน้า

## 🚀 วิธีใช้งาน

1. เปิดไฟล์ `index.html` ใน browser
2. สร้างสถานที่ (เช่น "บ้าน")
3. เพิ่มสินค้าพร้อมตั้งจำนวน default
4. ใช้ปุ่ม +/- เพื่อจัดการ stock
5. ใช้ช่องค้นหาเพื่อหาสินค้าที่ต้องการ

## 🌐 Deploy ลง GitHub Pages

1. สร้าง repository ใหม่บน GitHub
2. Push โค้ดทั้งหมดขึ้น repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HOME STOCK"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. ไปที่ **Settings** → **Pages**
4. เลือก **Source** เป็น `main` branch, folder `/` (root)
5. กด **Save** — เว็บจะพร้อมใช้ที่ `https://<your-username>.github.io/<repo-name>/`

---

## 🛠️ เทคโนโลยีที่ใช้ + อธิบายการทำงาน

### 1. HTML5 — โครงสร้างหน้าเว็บ
- ใช้ **Semantic HTML** เช่น `<header>`, `<section>` เพื่อให้โค้ดอ่านง่ายและดีต่อ SEO
- ใช้ `<form>` จัดการ input การเพิ่มสถานที่และสินค้า
- ใส่ **meta tags** สำหรับ SEO (`description`, `theme-color`, `viewport`)
- 📚 ศึกษาเพิ่ม: [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

### 2. CSS3 — ดีไซน์และ Responsive
- **CSS Variables** (`--bg-primary`, `--accent-purple` ฯลฯ) — ตั้งค่าสีและขนาดเป็นตัวแปร เปลี่ยนธีมได้ง่าย
- **Glassmorphism** — ใช้ `backdrop-filter: blur()` + `background: rgba()` ทำให้ card มีเอฟเฟกต์กระจกฝ้า
- **CSS Animations** — ใช้ `@keyframes` สร้าง animation เช่น float, slideIn, pulse
- **Flexbox** — จัด layout แบบยืดหยุ่น (ใช้ `display: flex` ทั้งโปรเจค)
- **Media Queries** (`@media`) — ทำ Responsive Design รองรับมือถือ
- **Google Fonts** — ใช้ font "Inter" ผ่าน `@import url()`
- 📚 ศึกษาเพิ่ม: [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [CSS Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### 3. JavaScript (Vanilla) — Logic ของแอป
- **IIFE** (Immediately Invoked Function Expression) — ครอบโค้ดทั้งหมดด้วย `(function() { ... })()` ป้องกัน global scope pollution
- **localStorage API** — เก็บข้อมูลใน browser ด้วย `localStorage.setItem()` / `getItem()` เป็น JSON string
- **Event Delegation** — ใช้ `addEventListener` บน parent element แทนที่จะ bind ทีละปุ่ม ช่วยเรื่อง performance
- **DOM Manipulation** — ใช้ `innerHTML` render UI จาก state, ใช้ `document.getElementById()` / `document.createElement()` จัดการ DOM
- **State Management** — ใช้ object `state` เก็บข้อมูลทั้งหมด, ทุกครั้งที่เปลี่ยน state จะ save + re-render
- **Array Methods** — ใช้ `.find()`, `.filter()`, `.forEach()` จัดการข้อมูล
- 📚 ศึกษาเพิ่ม: [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JavaScript.info](https://javascript.info/)

### 4. GitHub Pages — Hosting ฟรี
- Deploy เว็บ static (HTML/CSS/JS) ได้ฟรี ผ่าน GitHub
- ไม่ต้องมี server, ไม่ต้องจ่ายเงิน
- 📚 ศึกษาเพิ่ม: [GitHub Pages Docs](https://docs.github.com/en/pages)

---

## 📁 โครงสร้างไฟล์

```
stock/
├── index.html      # หน้าหลัก — โครงสร้าง HTML
├── style.css       # ดีไซน์ — CSS Variables, Animations, Responsive
├── app.js          # ลอจิก — State, localStorage, DOM rendering
└── README.md       # เอกสารนี้
```

## 📄 สรุป Flow การทำงาน

```
User เปิดหน้าเว็บ
  → app.js โหลดข้อมูลจาก localStorage
  → render UI ตาม state

User เพิ่มสถานที่/สินค้า/กด +/-
  → อัปเดต state object
  → บันทึกลง localStorage
  → re-render UI ทั้งหมด

User ปิดแล้วเปิดใหม่
  → localStorage ยังเก็บข้อมูลอยู่ ไม่หาย
```

