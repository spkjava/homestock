/* ========================================
   Household Stock Tracker — Application Logic
   localStorage-based, no framework needed
   ======================================== */

(function () {
  'use strict';

  // --- Constants ---
  const STORAGE_KEY = 'household_stock_tracker';

  // --- State ---
  let state = {
    locations: [],
    activeLocationId: null
  };

  let searchQuery = '';

  // --- UUID Generator ---
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // --- Storage ---
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      showToast('⚠️ ไม่สามารถบันทึกข้อมูลได้');
    }
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      state = { locations: [], activeLocationId: null };
    }
  }

  // --- Helpers ---
  function getActiveLocation() {
    return state.locations.find(l => l.id === state.activeLocationId) || null;
  }

  function getStatus(qty) {
    if (qty <= 0) return { key: 'empty', label: 'ของหมด', icon: '🔴', cssClass: 'status-badge--empty' };
    if (qty === 1) return { key: 'low', label: 'เหลือ 1 ชิ้น', icon: '🟡', cssClass: 'status-badge--low' };
    return { key: 'available', label: 'ใช้งานอยู่', icon: '🟢', cssClass: 'status-badge--available' };
  }

  function getFilteredItems(loc) {
    if (!searchQuery) return loc.items;
    const q = searchQuery.toLowerCase();
    return loc.items.filter(item => item.name.toLowerCase().includes(q));
  }

  // --- Location Actions ---
  function addLocation(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const loc = {
      id: generateId(),
      name: trimmed,
      items: []
    };
    state.locations.push(loc);
    state.activeLocationId = loc.id;
    saveState();
    render();
    showToast(`📍 เพิ่มสถานที่ "${trimmed}" แล้ว`);
  }

  function deleteLocation(id) {
    const loc = state.locations.find(l => l.id === id);
    if (!loc) return;
    if (!confirm(`ลบสถานที่ "${loc.name}" และสินค้าทั้งหมด?`)) return;

    state.locations = state.locations.filter(l => l.id !== id);
    if (state.activeLocationId === id) {
      state.activeLocationId = state.locations.length ? state.locations[0].id : null;
    }
    saveState();
    render();
    showToast(`🗑️ ลบ "${loc.name}" แล้ว`);
  }

  function switchLocation(id) {
    state.activeLocationId = id;
    searchQuery = '';
    saveState();
    render();
  }

  // --- Item Actions ---
  function addItem(name, defaultQty) {
    const loc = getActiveLocation();
    if (!loc) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const qty = Math.max(0, parseInt(defaultQty, 10) || 1);

    loc.items.push({
      id: generateId(),
      name: trimmed,
      quantity: qty,
      defaultQty: qty
    });
    saveState();
    render();
    showToast(`✅ เพิ่ม "${trimmed}" (${qty} ชิ้น)`);
  }

  function deleteItem(itemId) {
    const loc = getActiveLocation();
    if (!loc) return;

    const item = loc.items.find(i => i.id === itemId);
    if (!item) return;

    loc.items = loc.items.filter(i => i.id !== itemId);
    saveState();
    render();
    showToast(`🗑️ ลบ "${item.name}" แล้ว`);
  }

  function incrementItem(itemId) {
    const loc = getActiveLocation();
    if (!loc) return;

    const item = loc.items.find(i => i.id === itemId);
    if (!item) return;

    item.quantity++;
    saveState();
    render();
  }

  function decrementItem(itemId) {
    const loc = getActiveLocation();
    if (!loc) return;

    const item = loc.items.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return;

    item.quantity--;
    saveState();
    render();

    if (item.quantity === 0) {
      showToast(`⚠️ "${item.name}" หมดแล้ว!`);
    } else if (item.quantity === 1) {
      showToast(`⚠️ "${item.name}" เหลือ 1 ชิ้น!`);
    }
  }

  // --- Toast ---
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  // --- Render ---
  function render() {
    renderLocationTabs();
    renderStockSection();
  }

  function renderLocationTabs() {
    const container = document.getElementById('location-tabs');
    container.innerHTML = '';

    if (state.locations.length === 0) {
      container.innerHTML = '<div class="no-location-hint">ยังไม่มีสถานที่ </div>';
      return;
    }

    state.locations.forEach(loc => {
      const tab = document.createElement('button');
      tab.className = 'location-tab' + (loc.id === state.activeLocationId ? ' active' : '');
      tab.setAttribute('data-id', loc.id);

      const nameSpan = document.createElement('span');
      nameSpan.textContent = loc.name;
      tab.appendChild(nameSpan);

      const countBadge = document.createElement('span');
      countBadge.style.opacity = '0.6';
      countBadge.style.fontSize = '0.75rem';
      countBadge.textContent = `(${loc.items.length})`;
      tab.appendChild(countBadge);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'location-tab__delete';
      deleteBtn.innerHTML = '✕';
      deleteBtn.title = 'ลบสถานที่';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteLocation(loc.id);
      });
      tab.appendChild(deleteBtn);

      tab.addEventListener('click', () => switchLocation(loc.id));
      container.appendChild(tab);
    });
  }

  function renderStockSection() {
    const section = document.getElementById('stock-section');
    const loc = getActiveLocation();

    if (!loc) {
      section.innerHTML = `
        <div class="glass-card">
          <div class="empty-state">
            <div class="empty-state__icon">📍</div>
            <div class="empty-state__text">เลือกหรือสร้างสถานที่ก่อน</div>
            <div class="empty-state__hint">เพิ่มสถานที่ด้านบนเพื่อเริ่มจัดการ stock</div>
          </div>
        </div>`;
      return;
    }

    // Stats (always from all items, not filtered)
    const stats = { available: 0, low: 0, empty: 0 };
    loc.items.forEach(item => {
      const s = getStatus(item.quantity);
      stats[s.key]++;
    });

    // Filtered items
    const filteredItems = getFilteredItems(loc);

    let html = '';

    // Add Item Form
    html += `
      <div class="glass-card" id="add-item-card">
        <div class="card-title">
          <span class="card-title__icon">➕</span>
          เพิ่มสินค้าใหม่ใน "${escapeHtml(loc.name)}"
        </div>
        <form class="add-item-form" id="add-item-form">
          <div class="form-group form-group--name">
            <label for="item-name">ชื่อสินค้า</label>
            <input type="text" id="item-name" placeholder="เช่น สบู่, แชมพู, กระดาษทิชชู่" required>
          </div>
          <div class="form-group form-group--qty">
            <label for="item-qty">จำนวน (Default)</label>
            <input type="number" id="item-qty" min="0" value="1" placeholder="1">
          </div>
          <button type="submit" class="btn btn-primary">เพิ่ม</button>
        </form>
      </div>`;

    // Stats bar
    if (loc.items.length > 0) {
      html += `
        <div class="stats-bar">
          <div class="stat-chip stat-chip--green">🟢 ใช้งานอยู่ <span class="stat-chip__count">${stats.available}</span></div>
          <div class="stat-chip stat-chip--yellow">🟡 เหลือ 1 ชิ้น <span class="stat-chip__count">${stats.low}</span></div>
          <div class="stat-chip stat-chip--red">🔴 ของหมด <span class="stat-chip__count">${stats.empty}</span></div>
        </div>`;
    }

    // Stock List
    html += `
      <div class="glass-card">
        <div class="card-title">
          <span class="card-title__icon">📦</span>
          รายการสินค้า (${loc.items.length})
        </div>`;

    // Search bar (show when there are items)
    if (loc.items.length > 0) {
      html += `
        <div class="search-bar">
          <span class="search-bar__icon">🔍</span>
          <input type="search" id="search-input" placeholder="ค้นหาสินค้า..." value="${escapeHtml(searchQuery)}">
          <button class="search-bar__clear ${searchQuery ? 'visible' : ''}" id="search-clear" title="ล้างการค้นหา">✕</button>
        </div>`;
    }

    html += `<div class="stock-list" id="stock-list">`;

    if (loc.items.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state__icon">📭</div>
          <div class="empty-state__text">ยังไม่มีสินค้า</div>
          <div class="empty-state__hint">เพิ่มสินค้าด้านบนเพื่อเริ่มติดตาม stock</div>
        </div>`;
    } else if (filteredItems.length === 0) {
      html += `
        <div class="search-no-results">
          <span class="search-no-results__icon">🔍</span>
          ไม่พบสินค้าที่ตรงกับ "${escapeHtml(searchQuery)}"
        </div>`;
    } else {
      filteredItems.forEach(item => {
        const status = getStatus(item.quantity);
        html += `
          <div class="stock-item" data-item-id="${item.id}">
            <div class="stock-item__info">
              <div class="stock-item__name">${escapeHtml(item.name)}</div>
              <div class="stock-item__meta">Default: ${item.defaultQty} ชิ้น</div>
            </div>
            <span class="status-badge ${status.cssClass}">
              <span class="status-dot"></span>
              ${status.label}
            </span>
            <div class="stock-item__quantity">${item.quantity}</div>
            <div class="stock-item__controls">
              <button class="btn btn-icon btn-decrement" data-action="decrement" data-id="${item.id}" title="ลดจำนวน">−</button>
              <button class="btn btn-icon btn-increment" data-action="increment" data-id="${item.id}" title="เพิ่มจำนวน">+</button>
              <button class="btn btn-delete-item" data-action="delete" data-id="${item.id}" title="ลบสินค้า">🗑️</button>
            </div>
          </div>`;
      });
    }

    html += `
        </div>
      </div>`;

    section.innerHTML = html;

    // Bind add-item form
    const form = document.getElementById('add-item-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('item-name');
        const qtyInput = document.getElementById('item-qty');
        addItem(nameInput.value, qtyInput.value);
        nameInput.value = '';
        qtyInput.value = '1';
        nameInput.focus();
      });
    }

    // Bind search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
        // Re-focus and restore cursor position
        const newInput = document.getElementById('search-input');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      });
    }

    const searchClear = document.getElementById('search-clear');
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchQuery = '';
        render();
        const newInput = document.getElementById('search-input');
        if (newInput) newInput.focus();
      });
    }

    // Bind stock item buttons (event delegation)
    const stockList = document.getElementById('stock-list');
    if (stockList) {
      stockList.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        switch (action) {
          case 'increment': incrementItem(id); break;
          case 'decrement': decrementItem(id); break;
          case 'delete': deleteItem(id); break;
        }
      });
    }
  }

  // --- Escape HTML ---
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Init ---
  function init() {
    loadState();

    // Location form
    const locationForm = document.getElementById('location-form');
    locationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('location-name');
      addLocation(input.value);
      input.value = '';
    });

    render();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
