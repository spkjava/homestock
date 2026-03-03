# 🏠 HOME STOCK — จัดการของใช้ในบ้าน

แอปเว็บสำหรับติดตามจำนวนของใช้ในชีวิตประจำวัน เช่น สบู่ แชมพู กระดาษทิชชู่ ฯลฯ รองรับหลายสถานที่ **sync ข้ามเครื่องได้** ผ่าน Google Sheets

## ✨ ฟีเจอร์

- **📍 หลายสถานที่** — สร้างที่อยู่ได้หลายแห่ง เช่น บ้าน คอนโด หอพัก
- **➕ เพิ่มสินค้า Default** — ตั้งชื่อสินค้าและจำนวน default ได้
- **🔢 เพิ่ม/ลด Stock** — กดปุ่ม +/- เพื่อปรับจำนวน
- **🔍 ค้นหาสินค้า** — พิมพ์ชื่อเพื่อกรองรายการแบบ real-time
- **🚦 สถานะ 3 ระดับ**:
  - 🟢 **ใช้งานอยู่** — มีสินค้ามากกว่า 1 ชิ้น
  - 🟡 **เหลือ 1 ชิ้น** — เตือนว่าใกล้หมด
  - 🔴 **ของหมด** — จำนวน = 0
- **☁️ Cloud Sync** — sync ข้อมูลข้ามเครื่อง/browser ผ่าน Google Sheets
- **💾 Offline Support** — ใช้ localStorage เป็น cache ใช้งาน offline ได้

## 🚀 วิธีใช้งาน

1. เปิดไฟล์ `index.html` ใน browser
2. สร้างสถานที่ (เช่น "บ้าน")
3. เพิ่มสินค้าพร้อมตั้งจำนวน default
4. ใช้ปุ่ม +/- เพื่อจัดการ stock
5. ใช้ช่องค้นหาเพื่อหาสินค้าที่ต้องการ

---

## ☁️ ตั้งค่า Cloud Sync (Google Sheets)

ถ้าต้องการ sync ข้อมูลข้ามเครื่อง/browser ให้ทำตามขั้นตอนนี้:

### ขั้นตอนที่ 1 — เปิด Apps Script

1. เปิด [Google Sheet](https://docs.google.com/spreadsheets/d/1prO_4wCYP36ZuzYyBa46whJ-dPgmvzpW-2RrArog7f0/edit)
2. ไปที่ **Extensions** → **Apps Script**
3. จะเปิดหน้า script editor ขึ้นมา

### ขั้นตอนที่ 2 — วางโค้ด

1. ลบโค้ดเดิมทั้งหมดใน editor
2. เปิดไฟล์ `google-apps-script.js` ในโปรเจคนี้
3. Copy โค้ดระหว่าง `// --- START COPY ---` ถึง `// --- END COPY ---`
4. วางลงใน Apps Script editor
5. กด **💾 Save** (Ctrl+S)

### ขั้นตอนที่ 3 — Deploy

1. กด **Deploy** → **New deployment**
2. กด ⚙️ เลือก Type = **Web app**
3. ตั้งค่า:
   - **Description**: HOME STOCK API
   - **Execute as**: Me
   - **Who has access**: Anyone
4. กด **Deploy**
5. กด **Authorize access** → เลือก Google Account → อนุญาต
6. **Copy URL** ที่ได้ (จะเป็น `https://script.google.com/macros/s/xxx/exec`)

### ขั้นตอนที่ 4 — ใส่ URL ในแอป

1. เปิดไฟล์ `app.js`
2. หาบรรทัด:
   ```js
   const APPS_SCRIPT_URL = '';
   ```
3. ใส่ URL ที่ copy มา:
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/xxx/exec';
   ```
4. Save ไฟล์ — เสร็จ! ข้อมูลจะ sync ข้ามเครื่องได้แล้ว

> ⚠️ **หมายเหตุ**: ทุกครั้งที่แก้โค้ดใน Apps Script ต้อง Deploy → Manage deployments → แก้ Version เป็น "New version" → กด Deploy

---

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
- **Fetch API** — ส่งข้อมูลไป-กลับ Google Sheets ผ่าน HTTP request (`fetch()` + `async/await`)
- **Event Delegation** — ใช้ `addEventListener` บน parent element แทนที่จะ bind ทีละปุ่ม ช่วยเรื่อง performance
- **DOM Manipulation** — ใช้ `innerHTML` render UI จาก state, ใช้ `document.getElementById()` / `document.createElement()` จัดการ DOM
- **State Management** — ใช้ object `state` เก็บข้อมูลทั้งหมด, ทุกครั้งที่เปลี่ยน state จะ save + re-render
- **Array Methods** — ใช้ `.find()`, `.filter()`, `.forEach()` จัดการข้อมูล
- 📚 ศึกษาเพิ่ม: [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JavaScript.info](https://javascript.info/)

### 4. Google Apps Script — API ตัวกลาง
- ทำหน้าที่เป็น **Web App** (REST API) ระหว่าง browser กับ Google Sheets
- `doGet()` — รับ GET request → อ่านข้อมูลจาก Sheet → ส่ง JSON กลับ
- `doPost()` — รับ POST request → เขียนข้อมูลลง Sheet
- เขียนด้วย JavaScript (ทำงานบน Google Cloud ฟรี)
- 📚 ศึกษาเพิ่ม: [Apps Script Docs](https://developers.google.com/apps-script), [Web Apps Guide](https://developers.google.com/apps-script/guides/web)

### 5. GitHub Pages — Hosting ฟรี
- Deploy เว็บ static (HTML/CSS/JS) ได้ฟรี ผ่าน GitHub
- ไม่ต้องมี server, ไม่ต้องจ่ายเงิน
- 📚 ศึกษาเพิ่ม: [GitHub Pages Docs](https://docs.github.com/en/pages)

---

## 📁 โครงสร้างไฟล์

```
stock/
├── index.html              # หน้าหลัก — โครงสร้าง HTML
├── style.css               # ดีไซน์ — CSS Variables, Animations, Responsive
├── app.js                  # ลอจิก — State, localStorage, Cloud sync
├── google-apps-script.js   # โค้ด Apps Script (copy ไปวางใน Google Sheet)
└── README.md               # เอกสารนี้
```

## 📄 สรุป Flow การทำงาน

```
User เปิดหน้าเว็บ
  → app.js โหลดข้อมูลจาก localStorage (แสดงทันที)
  → พร้อมกันก็โหลดจาก Google Sheets (cloud)
  → ถ้า cloud มีข้อมูล → อัปเดต UI

User เพิ่มสถานที่/สินค้า/กด +/-
  → อัปเดต state object
  → บันทึกลง localStorage (ทันที)
  → ส่งข้อมูลไป Google Sheets (async, ไม่ block UI)
  → re-render UI

User เปิดจากเครื่องอื่น / browser อื่น
  → โหลดข้อมูลจาก Google Sheets
  → ข้อมูลเหมือนกันทุกเครื่อง ☁️
```
