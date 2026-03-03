// ==========================================================
// 📋 Google Apps Script สำหรับ HOME STOCK
// ==========================================================
// วิธีใช้:
// 1. เปิด Google Sheet: https://docs.google.com/spreadsheets/d/1prO_4wCYP36ZuzYyBa46whJ-dPgmvzpW-2RrArog7f0/edit
// 2. ไปที่ Extensions → Apps Script
// 3. ลบโค้ดเดิมทั้งหมด แล้ว copy โค้ดด้านล่างนี้ไปวาง (ตั้งแต่บรรทัด "// --- START COPY ---" ถึง "// --- END COPY ---")
// 4. กด 💾 Save (Ctrl+S)
// 5. กด Deploy → New deployment
// 6. เลือก Type = "Web app"
// 7. ตั้ง "Execute as" = "Me"
// 8. ตั้ง "Who has access" = "Anyone"
// 9. กด Deploy → อนุญาต (Authorize)
// 10. Copy URL ที่ได้ → ใส่ใน app.js ที่บรรทัด APPS_SCRIPT_URL
//
// ⚠️ ทุกครั้งที่แก้โค้ด Apps Script ต้อง Deploy → Manage deployments → แก้ Version เป็น "New version" → กด Deploy
// ==========================================================

// --- START COPY ---

var SHEET_NAME = 'Data';

function doGet(e) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(SHEET_NAME);

        if (!sheet) {
            return jsonResponse({ locations: [], activeLocationId: null });
        }

        var dataRange = sheet.getRange('A1');
        var data = dataRange.getValue();

        if (!data) {
            return jsonResponse({ locations: [], activeLocationId: null });
        }

        var parsed = JSON.parse(data);
        return jsonResponse(parsed);
    } catch (err) {
        return jsonResponse({ error: err.message });
    }
}

function doPost(e) {
    try {
        var body = JSON.parse(e.postData.contents);
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(SHEET_NAME);

        if (!sheet) {
            sheet = ss.insertSheet(SHEET_NAME);
        }

        // เก็บ JSON ทั้งก้อนใน cell A1
        sheet.getRange('A1').setValue(JSON.stringify(body));

        // เขียนข้อมูลแบบอ่านง่ายใน cell ถัดไปด้วย
        // Clear old readable data
        var lastRow = sheet.getLastRow();
        if (lastRow > 2) {
            sheet.getRange(3, 1, lastRow - 2, 5).clearContent();
        }

        // Header row
        sheet.getRange('A2:E2').setValues([['สถานที่', 'สินค้า', 'จำนวน', 'Default', 'สถานะ']]);
        sheet.getRange('A2:E2').setFontWeight('bold');

        // Data rows
        var row = 3;
        if (body.locations && body.locations.length > 0) {
            body.locations.forEach(function (loc) {
                if (loc.items && loc.items.length > 0) {
                    loc.items.forEach(function (item) {
                        var status = item.quantity <= 0 ? '🔴 ของหมด' : (item.quantity === 1 ? '🟡 เหลือ 1 ชิ้น' : '🟢 ใช้งานอยู่');
                        sheet.getRange(row, 1, 1, 5).setValues([[loc.name, item.name, item.quantity, item.defaultQty, status]]);
                        row++;
                    });
                } else {
                    sheet.getRange(row, 1, 1, 5).setValues([[loc.name, '(ไม่มีสินค้า)', '', '', '']]);
                    row++;
                }
            });
        }

        return jsonResponse({ success: true });
    } catch (err) {
        return jsonResponse({ error: err.message });
    }
}

function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

// --- END COPY ---
