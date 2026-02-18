/**
 * ═══════════════════════════════════════════════════════════
 *  سُكّرك مظبوط - Professional Export Utilities v3.0
 *  Supports: PDF, Excel, Print, Tax Invoice with QR Code
 *  Languages: Arabic (RTL) & English (LTR)
 * ═══════════════════════════════════════════════════════════
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

// ══════════════════════════════════════════
// BRAND CONSTANTS
// ══════════════════════════════════════════
const BRAND = {
    nameAr: 'سُكّرك مظبوط',
    nameEn: 'Sukarak Mazboot',
    taglineAr: 'نظام إدارة الصحة والمتجر الذكي',
    taglineEn: 'Smart Health & Store Management System',
    primaryColor: [22, 111, 80],
    secondaryColor: [15, 23, 42],
    accentColor: [16, 185, 129],
    headerGradient1: [22, 111, 80],
    headerGradient2: [13, 148, 136],
    lightBg: [248, 250, 252],
    tableBorder: [226, 232, 240],
    tableHeaderBg: [22, 111, 80],
    tableHeaderText: [255, 255, 255],
    tableAltRow: [240, 253, 244],
    textDark: [30, 41, 59],
    textMuted: [100, 116, 139],
    dangerColor: [239, 68, 68],
    warningColor: [245, 158, 11],
    infoColor: [59, 130, 246],
    version: 'v3.0',
    website: 'sukarak-mazboot.com',
};

// ══════════════════════════════════════════
// LOGO UTILITIES
// ══════════════════════════════════════════
let cachedLogoBase64 = null;

async function getLogoBase64() {
    if (cachedLogoBase64) return cachedLogoBase64;
    try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                cachedLogoBase64 = reader.result;
                resolve(cachedLogoBase64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

// ══════════════════════════════════════════
// PDF EXPORT
// ══════════════════════════════════════════

function createPDFDoc() {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });
    return doc;
}

function addPDFHeader(doc, logo, title, subtitle, isRTL = true, pageWidth = 210) {
    const margin = 15;
    const headerHeight = 35;

    // Header background
    doc.setFillColor(...BRAND.headerGradient1);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    // Accent bar
    doc.setFillColor(...BRAND.headerGradient2);
    doc.rect(0, headerHeight - 3, pageWidth, 3, 'F');

    // Logo
    if (logo) {
        try {
            if (isRTL) {
                doc.addImage(logo, 'PNG', pageWidth - margin - 22, 5, 22, 22);
            } else {
                doc.addImage(logo, 'PNG', margin, 5, 22, 22);
            }
        } catch (e) { /* skip logo on error */ }
    }

    // System name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    if (isRTL) {
        doc.text(BRAND.nameAr, pageWidth - margin - 28, 15, { align: 'right' });
        doc.setFontSize(8);
        doc.setTextColor(200, 230, 215);
        doc.text(BRAND.taglineAr, pageWidth - margin - 28, 21, { align: 'right' });
    } else {
        doc.text(BRAND.nameEn, margin + 26, 15);
        doc.setFontSize(8);
        doc.setTextColor(200, 230, 215);
        doc.text(BRAND.taglineEn, margin + 26, 21);
    }

    // Version
    doc.setFontSize(7);
    doc.setTextColor(160, 210, 180);
    if (isRTL) {
        doc.text(BRAND.version, margin + 5, 10);
    } else {
        doc.text(BRAND.version, pageWidth - margin - 5, 10, { align: 'right' });
    }

    // Report title area
    const titleY = headerHeight + 10;
    doc.setFontSize(14);
    doc.setTextColor(...BRAND.textDark);
    if (isRTL) {
        doc.text(title, pageWidth - margin, titleY, { align: 'right' });
    } else {
        doc.text(title, margin, titleY);
    }

    if (subtitle) {
        doc.setFontSize(9);
        doc.setTextColor(...BRAND.textMuted);
        if (isRTL) {
            doc.text(subtitle, pageWidth - margin, titleY + 7, { align: 'right' });
        } else {
            doc.text(subtitle, margin, titleY + 7);
        }
    }

    // Date
    const now = new Date();
    const dateStr = isRTL
        ? `تاريخ التصدير: ${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG')}`
        : `Export Date: ${now.toLocaleDateString('en-US')} - ${now.toLocaleTimeString('en-US')}`;
    doc.setFontSize(7);
    doc.setTextColor(...BRAND.textMuted);
    if (isRTL) {
        doc.text(dateStr, margin, titleY + 7);
    } else {
        doc.text(dateStr, pageWidth - margin, titleY + 7, { align: 'right' });
    }

    // Separator
    doc.setDrawColor(...BRAND.tableBorder);
    doc.setLineWidth(0.5);
    doc.line(margin, titleY + 12, pageWidth - margin, titleY + 12);

    return titleY + 18;
}

function addPDFFooter(doc, isRTL = true, pageWidth = 210) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;

        doc.setDrawColor(...BRAND.accentColor);
        doc.setLineWidth(0.8);
        doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

        doc.setFontSize(7);
        doc.setTextColor(...BRAND.textMuted);

        const footerLeft = isRTL ? BRAND.website : `Page ${i} / ${pageCount}`;
        const footerRight = isRTL ? `${i} / ${pageCount} صفحة` : BRAND.website;
        const footerCenter = isRTL
            ? `\u00A9 ${new Date().getFullYear()} ${BRAND.nameAr} - جميع الحقوق محفوظة`
            : `\u00A9 ${new Date().getFullYear()} ${BRAND.nameEn} - All Rights Reserved`;

        doc.text(footerLeft, 15, pageHeight - 8);
        doc.text(footerCenter, pageWidth / 2, pageHeight - 8, { align: 'center' });
        doc.text(footerRight, pageWidth - 15, pageHeight - 8, { align: 'right' });
    }
}

function addTableToPDF(doc, headers, data, startY, isRTL = true) {
    const margin = 15;
    const tableConfig = {
        startY,
        margin: { left: margin, right: margin },
        head: [headers],
        body: data,
        theme: 'grid',
        headStyles: {
            fillColor: BRAND.tableHeaderBg,
            textColor: BRAND.tableHeaderText,
            fontSize: 9,
            fontStyle: 'bold',
            halign: isRTL ? 'right' : 'left',
            cellPadding: 4,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: BRAND.textDark,
            halign: isRTL ? 'right' : 'left',
            cellPadding: 3.5,
            lineColor: BRAND.tableBorder,
            lineWidth: 0.2,
        },
        alternateRowStyles: {
            fillColor: BRAND.tableAltRow,
        },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'auto',
        },
        tableLineColor: BRAND.tableBorder,
        tableLineWidth: 0.3,
        didDrawPage: function (hookData) {
            if (hookData.pageNumber > 1) {
                doc.setFillColor(...BRAND.primaryColor);
                doc.rect(0, 0, 210, 10, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                const contText = isRTL ? (BRAND.nameAr + ' - تابع...') : (BRAND.nameEn + ' - Continued...');
                doc.text(contText, 105, 7, { align: 'center' });
            }
        },
    };

    doc.autoTable(tableConfig);
    return doc.lastAutoTable.finalY + 5;
}

function addSummaryBox(doc, items, startY, isRTL = true, pageWidth = 210) {
    const margin = 15;
    const boxWidth = pageWidth - 2 * margin;
    const itemHeight = 8;
    const boxHeight = items.length * itemHeight + 12;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, startY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setDrawColor(...BRAND.accentColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, startY, boxWidth, boxHeight, 3, 3, 'S');

    doc.setFontSize(10);
    doc.setTextColor(...BRAND.primaryColor);
    const summaryTitle = isRTL ? 'ملخص التقرير' : 'Report Summary';
    if (isRTL) {
        doc.text(summaryTitle, pageWidth - margin - 5, startY + 8, { align: 'right' });
    } else {
        doc.text(summaryTitle, margin + 5, startY + 8);
    }

    items.forEach((item, i) => {
        const y = startY + 16 + i * itemHeight;
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.textMuted);
        if (isRTL) {
            doc.text(item.label, pageWidth - margin - 8, y, { align: 'right' });
            doc.setTextColor(...BRAND.textDark);
            doc.setFontSize(9);
            doc.text(String(item.value), margin + 8, y);
        } else {
            doc.text(item.label, margin + 8, y);
            doc.setTextColor(...BRAND.textDark);
            doc.setFontSize(9);
            doc.text(String(item.value), pageWidth - margin - 8, y, { align: 'right' });
        }
    });

    return startY + boxHeight + 8;
}

/**
 * Export data as professional PDF
 */
export async function exportToPDF({ title, subtitle, headers, data, summaryItems, isRTL = true, fileName = 'report' }) {
    const doc = createPDFDoc();
    const logo = await getLogoBase64();
    const pageWidth = 210;

    let y = addPDFHeader(doc, logo, title, subtitle, isRTL, pageWidth);

    if (summaryItems && summaryItems.length) {
        y = addSummaryBox(doc, summaryItems, y, isRTL, pageWidth);
    }

    if (headers && headers.length && data && data.length) {
        y = addTableToPDF(doc, headers, data, y, isRTL);
    }

    addPDFFooter(doc, isRTL, pageWidth);

    doc.save(fileName + '_' + new Date().toISOString().split('T')[0] + '.pdf');
}

// ══════════════════════════════════════════
// EXCEL EXPORT (Professional with ExcelJS)
// ══════════════════════════════════════════

export async function exportToExcel({ title, headers, data, summaryItems, isRTL = true, fileName = 'report', sheetName }) {
    const ExcelJS = (await import('exceljs')).default;

    const wb = new ExcelJS.Workbook();
    wb.creator = BRAND.nameEn;
    wb.created = new Date();

    const safeSheetName = (sheetName || (isRTL ? 'التقرير' : 'Report')).substring(0, 31);
    const ws = wb.addWorksheet(safeSheetName, {
        properties: { defaultRowHeight: 22 },
        views: [{ rightToLeft: isRTL, state: 'frozen', ySplit: 1 }],
    });

    const colCount = (headers && headers.length) || 2;
    const brandFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166F50' } };
    const brandFont = { name: 'Cairo', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    const accentFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } };
    const lightGreenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } };
    const lightGrayFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    const borderStyle = { style: 'thin', color: { argb: 'FFE2E8F0' } };
    const fullBorder = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

    // ── ROW 1: Brand Name ──
    const row1 = ws.addRow([isRTL ? BRAND.nameAr : BRAND.nameEn]);
    ws.mergeCells(1, 1, 1, colCount);
    row1.height = 40;
    row1.getCell(1).fill = brandFill;
    row1.getCell(1).font = brandFont;
    row1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // ── ROW 2: Tagline ──
    const row2 = ws.addRow([isRTL ? BRAND.taglineAr : BRAND.taglineEn]);
    ws.mergeCells(2, 1, 2, colCount);
    row2.height = 28;
    row2.getCell(1).fill = accentFill;
    row2.getCell(1).font = { name: 'Cairo', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    row2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    // ── ROW 3: Empty separator ──
    ws.addRow([]);

    // ── ROW 4: Report Title ──
    const row4 = ws.addRow([title]);
    ws.mergeCells(4, 1, 4, colCount);
    row4.height = 32;
    row4.getCell(1).font = { name: 'Cairo', size: 14, bold: true, color: { argb: 'FF1E293B' } };
    row4.getCell(1).alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
    row4.getCell(1).fill = lightGrayFill;
    row4.getCell(1).border = { bottom: { style: 'medium', color: { argb: 'FF10B981' } } };

    // ── ROW 5: Date ──
    const dateStr = isRTL
        ? 'تاريخ التصدير: ' + new Date().toLocaleDateString('ar-EG') + ' - ' + new Date().toLocaleTimeString('ar-EG')
        : 'Export Date: ' + new Date().toLocaleDateString('en-US') + ' - ' + new Date().toLocaleTimeString('en-US');
    const row5 = ws.addRow([dateStr]);
    ws.mergeCells(5, 1, 5, colCount);
    row5.getCell(1).font = { name: 'Cairo', size: 9, color: { argb: 'FF94A3B8' } };
    row5.getCell(1).alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };

    // ── ROW 6: Empty ──
    ws.addRow([]);

    // ── SUMMARY SECTION ──
    let currentRow = 7;
    if (summaryItems && summaryItems.length) {
        const summaryTitle = ws.addRow([isRTL ? '📊  ملخص التقرير' : '📊  Report Summary']);
        ws.mergeCells(currentRow, 1, currentRow, colCount);
        summaryTitle.height = 30;
        summaryTitle.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166F50' } };
        summaryTitle.getCell(1).font = { name: 'Cairo', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        summaryTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow++;

        summaryItems.forEach(function (item, idx) {
            const sRow = ws.addRow([item.label, String(item.value)]);
            sRow.height = 26;
            const evenBg = idx % 2 === 0 ? lightGreenFill : lightGrayFill;
            sRow.getCell(1).fill = evenBg;
            sRow.getCell(1).font = { name: 'Cairo', size: 11, bold: true, color: { argb: 'FF334155' } };
            sRow.getCell(1).alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle', indent: 2 };
            sRow.getCell(1).border = fullBorder;
            sRow.getCell(2).fill = evenBg;
            sRow.getCell(2).font = { name: 'Cairo', size: 12, bold: true, color: { argb: 'FF166F50' } };
            sRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
            sRow.getCell(2).border = fullBorder;
            // Fill remaining cells
            for (let c = 3; c <= colCount; c++) {
                sRow.getCell(c).fill = evenBg;
                sRow.getCell(c).border = fullBorder;
            }
            currentRow++;
        });

        ws.addRow([]);
        currentRow++;
    }

    // ── DATA TABLE ──
    if (headers && headers.length && data && data.length) {
        // Table Header Row
        const hRow = ws.addRow(headers);
        hRow.height = 30;
        headers.forEach(function (_, ci) {
            const cell = hRow.getCell(ci + 1);
            cell.fill = headerFill;
            cell.font = { name: 'Cairo', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF166F50' } },
                bottom: { style: 'medium', color: { argb: 'FF166F50' } },
                left: { style: 'thin', color: { argb: 'FF334155' } },
                right: { style: 'thin', color: { argb: 'FF334155' } },
            };
        });
        currentRow++;

        // Data Rows
        data.forEach(function (rowData, ri) {
            const dRow = ws.addRow(rowData);
            dRow.height = 24;
            const isEven = ri % 2 === 0;
            rowData.forEach(function (_, ci) {
                const cell = dRow.getCell(ci + 1);
                cell.fill = isEven
                    ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
                    : lightGreenFill;
                cell.font = { name: 'Cairo', size: 10, color: { argb: 'FF334155' } };
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle', indent: 1 };
                cell.border = fullBorder;
            });
            currentRow++;
        });

        // Total row (bottom border highlight)
        const lastDataRow = ws.getRow(currentRow);
        for (let ci = 1; ci <= colCount; ci++) {
            const c = lastDataRow.getCell(ci);
            if (c.border) {
                c.border = { ...c.border, bottom: { style: 'medium', color: { argb: 'FF166F50' } } };
            }
        }
    }

    // ── FOOTER ──
    ws.addRow([]);
    currentRow++;
    const footerText = isRTL
        ? '\u00A9 ' + new Date().getFullYear() + ' ' + BRAND.nameAr + ' - جميع الحقوق محفوظة'
        : '\u00A9 ' + new Date().getFullYear() + ' ' + BRAND.nameEn + ' - All Rights Reserved';
    const fRow = ws.addRow([footerText]);
    ws.mergeCells(currentRow + 1, 1, currentRow + 1, colCount);
    fRow.getCell(1).font = { name: 'Cairo', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
    fRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    fRow.getCell(1).fill = lightGrayFill;

    // ── AUTO COLUMN WIDTHS ──
    if (headers && headers.length) {
        headers.forEach(function (h, i) {
            let maxLen = String(h).length;
            if (data) {
                data.forEach(function (row) {
                    const cellLen = String(row[i] || '').length;
                    if (cellLen > maxLen) maxLen = cellLen;
                });
            }
            ws.getColumn(i + 1).width = Math.min(Math.max(maxLen + 6, 14), 45);
        });
    } else {
        ws.getColumn(1).width = 35;
        ws.getColumn(2).width = 25;
    }

    // ── GENERATE & SAVE ──
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        fileName + '_' + new Date().toISOString().split('T')[0] + '.xlsx');
}

// ══════════════════════════════════════════
// PRINT UTILITY
// ══════════════════════════════════════════

export function printReport({ title, subtitle, headers, data, summaryItems, isRTL = true }) {
    const dir = isRTL ? 'rtl' : 'ltr';
    const align = isRTL ? 'right' : 'left';
    const brand = isRTL ? BRAND.nameAr : BRAND.nameEn;
    const tagline = isRTL ? BRAND.taglineAr : BRAND.taglineEn;
    const dateStr = isRTL
        ? 'تاريخ التصدير: ' + new Date().toLocaleDateString('ar-EG') + ' - ' + new Date().toLocaleTimeString('ar-EG')
        : 'Export Date: ' + new Date().toLocaleDateString('en-US') + ' - ' + new Date().toLocaleTimeString('en-US');
    const copyright = isRTL
        ? '\u00A9 ' + new Date().getFullYear() + ' ' + BRAND.nameAr + ' - جميع الحقوق محفوظة'
        : '\u00A9 ' + new Date().getFullYear() + ' ' + BRAND.nameEn + ' - All Rights Reserved';

    let summaryHtml = '';
    if (summaryItems && summaryItems.length) {
        const itemsHtml = summaryItems.map(function (item) {
            return '<div style="display:flex;justify-content:space-between;padding:4px 8px;background:#fff;border-radius:6px;">' +
                '<span style="color:#64748b;font-size:12px;">' + item.label + '</span>' +
                '<strong style="color:#1e293b;font-size:13px;">' + item.value + '</strong>' +
                '</div>';
        }).join('');
        summaryHtml = '<div style="background:#f0fdf4;border:2px solid #10b981;border-radius:12px;padding:16px 20px;margin:16px 0;">' +
            '<h3 style="color:#166f50;margin:0 0 10px;font-size:14px;">' + (isRTL ? 'ملخص التقرير' : 'Report Summary') + '</h3>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' + itemsHtml + '</div></div>';
    }

    let tableHtml = '';
    if (headers && headers.length && data && data.length) {
        const thHtml = headers.map(function (h) {
            return '<th style="background:#166f50;color:#fff;padding:10px 12px;text-align:' + align + ';font-weight:700;border:1px solid #ddd;">' + h + '</th>';
        }).join('');
        const bodyHtml = data.map(function (row, idx) {
            const bg = idx % 2 === 0 ? '#fff' : '#f0fdf4';
            const cells = row.map(function (cell) {
                return '<td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:' + align + ';color:#1e293b;">' + cell + '</td>';
            }).join('');
            return '<tr style="background:' + bg + ';">' + cells + '</tr>';
        }).join('');
        tableHtml = '<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:12px;">' +
            '<thead><tr>' + thHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
    }

    const html = '<!DOCTYPE html><html dir="' + dir + '" lang="' + (isRTL ? 'ar' : 'en') + '">' +
        '<head><meta charset="UTF-8"><title>' + title + '</title>' +
        '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">' +
        '<style>' +
        '* { box-sizing: border-box; margin: 0; padding: 0; }' +
        'body { font-family: "Cairo", "Segoe UI", sans-serif; color: #1e293b; padding: 0; }' +
        '@media print { @page { margin: 10mm 12mm; size: A4; } .no-print { display: none !important; } }' +
        '.header { background: linear-gradient(135deg, #166f50 0%, #0d9488 100%); color: #fff; padding: 20px 24px; border-radius: 0 0 16px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }' +
        '.header .brand { display: flex; align-items: center; gap: 12px; }' +
        '.header img { width: 50px; height: 50px; object-fit: contain; filter: brightness(1.2); }' +
        '.header h1 { font-size: 22px; font-weight: 900; }' +
        '.header .tagline { font-size: 10px; opacity: 0.7; margin-top: 2px; }' +
        '.header .version { font-size: 9px; opacity: 0.5; }' +
        '.report-meta { padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; margin-bottom: 8px; }' +
        '.report-meta h2 { font-size: 18px; font-weight: 900; color: #1e293b; }' +
        '.report-meta .date { font-size: 10px; color: #94a3b8; }' +
        '.subtitle { font-size: 12px; color: #64748b; padding: 0 24px; margin-bottom: 4px; }' +
        '.content { padding: 0 24px; }' +
        '.footer { margin-top: 24px; padding: 12px 24px; border-top: 2px solid #10b981; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }' +
        '</style></head><body>' +
        '<div class="header"><div class="brand">' +
        '<img src="/logo.png" alt="Logo" onerror="this.style.display=\'none\'"/>' +
        '<div><h1>' + brand + '</h1><div class="tagline">' + tagline + '</div></div>' +
        '</div><div class="version">' + BRAND.version + '</div></div>' +
        '<div class="report-meta"><h2>' + title + '</h2><span class="date">' + dateStr + '</span></div>' +
        (subtitle ? '<div class="subtitle">' + subtitle + '</div>' : '') +
        '<div class="content">' + summaryHtml + tableHtml + '</div>' +
        '<div class="footer"><span>' + copyright + '</span><span>' + BRAND.website + '</span></div>' +
        '<script>window.onload = function() { window.print(); };</script>' +
        '</body></html>';

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
}

// ══════════════════════════════════════════
// TAX INVOICE (فاتورة ضريبية)
// ══════════════════════════════════════════

export async function generateTaxInvoice({
    invoiceNumber,
    date,
    customerName,
    customerPhone,
    customerAddress,
    items,
    subtotal,
    taxRate = 15,
    taxAmount,
    discount = 0,
    grandTotal,
    paymentMethod,
    isRTL = true,
}) {
    const doc = createPDFDoc();
    const logo = await getLogoBase64();
    const pageWidth = 210;
    const margin = 15;

    const calcSubtotal = subtotal || items.reduce(function (s, i) { return s + (i.total || i.price * i.qty); }, 0);
    const calcTax = taxAmount || (calcSubtotal * taxRate) / 100;
    const calcTotal = grandTotal || (calcSubtotal + calcTax - discount);

    // Header
    doc.setFillColor(...BRAND.headerGradient1);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(...BRAND.headerGradient2);
    doc.rect(0, 37, pageWidth, 3, 'F');

    if (logo) {
        try {
            doc.addImage(logo, 'PNG', isRTL ? pageWidth - margin - 25 : margin, 6, 25, 25);
        } catch (e) { /* skip */ }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    const invTitle = isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE';
    if (isRTL) {
        doc.text(invTitle, pageWidth - margin - 30, 18, { align: 'right' });
        doc.setFontSize(10);
        doc.text(BRAND.nameAr, pageWidth - margin - 30, 26, { align: 'right' });
    } else {
        doc.text(invTitle, margin + 30, 18);
        doc.setFontSize(10);
        doc.text(BRAND.nameEn, margin + 30, 26);
    }

    doc.setFontSize(9);
    doc.setTextColor(200, 230, 215);
    const invNum = isRTL ? 'رقم الفاتورة: #' + invoiceNumber : 'Invoice #: ' + invoiceNumber;
    const invDate = isRTL
        ? 'التاريخ: ' + (date || new Date().toLocaleDateString('ar-EG'))
        : 'Date: ' + (date || new Date().toLocaleDateString('en-US'));
    if (isRTL) {
        doc.text(invNum, margin + 5, 15);
        doc.text(invDate, margin + 5, 21);
    } else {
        doc.text(invNum, pageWidth - margin - 5, 15, { align: 'right' });
        doc.text(invDate, pageWidth - margin - 5, 21, { align: 'right' });
    }

    let y = 50;
    const boxW = (pageWidth - 3 * margin) / 2;

    // Customer info
    doc.setFillColor(248, 250, 252);
    const custBoxX = isRTL ? pageWidth - margin - boxW : margin;
    doc.roundedRect(custBoxX, y, boxW, 30, 3, 3, 'F');
    doc.setDrawColor(...BRAND.tableBorder);
    doc.roundedRect(custBoxX, y, boxW, 30, 3, 3, 'S');

    doc.setFontSize(9);
    doc.setTextColor(...BRAND.primaryColor);
    const custLabel = isRTL ? 'بيانات العميل' : 'Customer Info';
    const custX = isRTL ? pageWidth - margin - 5 : margin + 5;
    const custAlign = isRTL ? 'right' : 'left';
    doc.text(custLabel, custX, y + 8, { align: custAlign });

    doc.setFontSize(8);
    doc.setTextColor(...BRAND.textDark);
    doc.text(customerName || '-', custX, y + 15, { align: custAlign });
    doc.setTextColor(...BRAND.textMuted);
    doc.text(customerPhone || '-', custX, y + 21, { align: custAlign });
    if (customerAddress) {
        doc.text(customerAddress, custX, y + 27, { align: custAlign });
    }

    // Seller info
    const sellerBoxX = isRTL ? margin : pageWidth - margin - boxW;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(sellerBoxX, y, boxW, 30, 3, 3, 'F');
    doc.setDrawColor(...BRAND.tableBorder);
    doc.roundedRect(sellerBoxX, y, boxW, 30, 3, 3, 'S');

    const sellerLabel = isRTL ? 'بيانات البائع' : 'Seller Info';
    const sellerX = isRTL ? margin + 5 : pageWidth - margin - 5;
    const sellerAlign = isRTL ? 'left' : 'right';
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.primaryColor);
    doc.text(sellerLabel, sellerX, y + 8, { align: sellerAlign });

    doc.setFontSize(8);
    doc.setTextColor(...BRAND.textDark);
    doc.text(isRTL ? BRAND.nameAr : BRAND.nameEn, sellerX, y + 15, { align: sellerAlign });
    doc.setTextColor(...BRAND.textMuted);
    doc.text(BRAND.website, sellerX, y + 21, { align: sellerAlign });

    y += 40;

    // Items table
    const invHeaders = isRTL
        ? ['الإجمالي', 'السعر', 'الكمية', 'المنتج', '#']
        : ['#', 'Product', 'Qty', 'Price', 'Total'];

    const currency = isRTL ? 'ج.م' : 'EGP';
    const invData = items.map(function (item, idx) {
        const total = item.total || item.price * item.qty;
        const row = [
            idx + 1,
            item.name,
            item.qty,
            Number(item.price).toLocaleString() + ' ' + currency,
            Number(total).toLocaleString() + ' ' + currency,
        ];
        return isRTL ? row.reverse() : row;
    });

    y = addTableToPDF(doc, invHeaders, invData, y, isRTL);

    // Totals
    y += 3;
    const totalsW = 75;
    const totalsX = isRTL ? margin : pageWidth - margin - totalsW;

    const totals = [
        { label: isRTL ? 'المجموع الفرعي' : 'Subtotal', value: calcSubtotal.toLocaleString() + ' ' + currency, bold: false },
        { label: isRTL ? 'ضريبة القيمة المضافة (' + taxRate + '%)' : 'VAT (' + taxRate + '%)', value: calcTax.toLocaleString() + ' ' + currency, bold: false },
    ];
    if (discount > 0) {
        totals.push({ label: isRTL ? 'الخصم' : 'Discount', value: '- ' + discount.toLocaleString() + ' ' + currency, bold: false });
    }
    totals.push({ label: isRTL ? 'الإجمالي النهائي' : 'Grand Total', value: calcTotal.toLocaleString() + ' ' + currency, bold: true });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(totalsX, y, totalsW, totals.length * 9 + 6, 3, 3, 'F');
    doc.setDrawColor(...BRAND.accentColor);
    doc.roundedRect(totalsX, y, totalsW, totals.length * 9 + 6, 3, 3, 'S');

    totals.forEach(function (t, i) {
        const ty = y + 8 + i * 9;
        doc.setFontSize(t.bold ? 10 : 8);
        if (t.bold) {
            doc.setTextColor(...BRAND.primaryColor);
        } else {
            doc.setTextColor(...BRAND.textMuted);
        }
        doc.text(t.label, totalsX + 3, ty);
        if (t.bold) {
            doc.setTextColor(...BRAND.primaryColor);
        } else {
            doc.setTextColor(...BRAND.textDark);
        }
        doc.text(t.value, totalsX + totalsW - 3, ty, { align: 'right' });
    });

    y += totals.length * 9 + 14;

    if (paymentMethod) {
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.textMuted);
        const pmLabel = isRTL ? 'طريقة الدفع: ' + paymentMethod : 'Payment Method: ' + paymentMethod;
        doc.text(pmLabel, isRTL ? pageWidth - margin : margin, y, { align: isRTL ? 'right' : 'left' });
        y += 8;
    }

    // QR Code
    try {
        const qrData = JSON.stringify({
            seller: isRTL ? BRAND.nameAr : BRAND.nameEn,
            invoice: invoiceNumber,
            total: calcTotal,
            tax: calcTax,
            date: date || new Date().toISOString(),
        });
        const qrDataUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 1, color: { dark: '#166f50', light: '#ffffff' } });
        const qrSize = 30;
        const qrX = isRTL ? pageWidth - margin - qrSize : margin;
        doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);

        doc.setFontSize(7);
        doc.setTextColor(...BRAND.textMuted);
        const qrLabel = isRTL ? 'امسح الكود للتحقق من الفاتورة' : 'Scan QR to verify invoice';
        doc.text(qrLabel, qrX + qrSize / 2, y + qrSize + 4, { align: 'center' });
    } catch (e) { /* skip QR on error */ }

    addPDFFooter(doc, isRTL, pageWidth);

    const invoiceFileName = isRTL
        ? 'فاتورة_' + invoiceNumber + '_' + new Date().toISOString().split('T')[0]
        : 'invoice_' + invoiceNumber + '_' + new Date().toISOString().split('T')[0];
    doc.save(invoiceFileName + '.pdf');
}


// ══════════════════════════════════════════
// PRE-BUILT REPORT GENERATORS
// ══════════════════════════════════════════

export function exportOrdersReport(orders, format, isRTL) {
    if (format === undefined) format = 'pdf';
    if (isRTL === undefined) isRTL = true;

    const headers = isRTL
        ? ['التاريخ', 'الدفع', 'الحالة', 'المبلغ', 'العميل', 'رقم الطلب']
        : ['Order #', 'Customer', 'Amount', 'Status', 'Payment', 'Date'];

    const statusMap = isRTL
        ? { completed: 'مكتمل', pending: 'قيد الانتظار', processing: 'قيد التنفيذ', cancelled: 'ملغي' }
        : { completed: 'Completed', pending: 'Pending', processing: 'Processing', cancelled: 'Cancelled' };

    const paymentMap = isRTL
        ? { paid: 'مدفوع', unpaid: 'غير مدفوع' }
        : { paid: 'Paid', unpaid: 'Unpaid' };

    const currency = isRTL ? 'ج.م' : 'EGP';

    const data = orders.map(function (o) {
        const row = [
            '#' + (o.order_number ? o.order_number.slice(-6) : o.id),
            o.user_name || '-',
            (o.total_amount || 0).toLocaleString() + ' ' + currency,
            statusMap[o.status] || o.status,
            paymentMap[o.payment_status] || o.payment_status || '-',
            o.created_at ? new Date(o.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') : '-',
        ];
        return isRTL ? row.reverse() : row;
    });

    var totalRevenue = orders.reduce(function (s, o) { return s + (o.total_amount || 0); }, 0);
    var summaryItems = [
        { label: isRTL ? 'إجمالي الطلبات' : 'Total Orders', value: orders.length },
        { label: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue', value: totalRevenue.toLocaleString() + ' ' + currency },
        { label: isRTL ? 'المكتملة' : 'Completed', value: orders.filter(function (o) { return o.status === 'completed'; }).length },
        { label: isRTL ? 'قيد الانتظار' : 'Pending', value: orders.filter(function (o) { return o.status === 'pending'; }).length },
    ];

    var config = {
        title: isRTL ? 'تقرير الطلبات' : 'Orders Report',
        subtitle: isRTL ? 'تقرير شامل لجميع الطلبات - إجمالي ' + orders.length + ' طلب' : 'Comprehensive orders report - Total ' + orders.length + ' orders',
        headers: headers,
        data: data,
        summaryItems: summaryItems,
        isRTL: isRTL,
        fileName: isRTL ? 'تقرير_الطلبات' : 'orders_report',
        sheetName: isRTL ? 'الطلبات' : 'Orders',
    };

    if (format === 'pdf') exportToPDF(config);
    else if (format === 'excel') exportToExcel(config);
    else if (format === 'print') printReport(config);
}

export function exportUsersReport(users, format, isRTL) {
    if (format === undefined) format = 'pdf';
    if (isRTL === undefined) isRTL = true;

    const headers = isRTL
        ? ['التسجيل', 'الحالة', 'الدور', 'الهاتف', 'البريد', 'الاسم', '#']
        : ['#', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'];

    const roleMap = isRTL
        ? { admin: 'مشرف', seller: 'بائع', user: 'مستخدم', doctor: 'طبيب' }
        : { admin: 'Admin', seller: 'Seller', user: 'User', doctor: 'Doctor' };

    const data = users.map(function (u, i) {
        const row = [
            i + 1,
            u.name || '-',
            u.email || '-',
            u.phone || '-',
            roleMap[u.role] || u.role,
            u.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Inactive'),
            u.created_at ? new Date(u.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') : '-',
        ];
        return isRTL ? row.reverse() : row;
    });

    var summaryItems = [
        { label: isRTL ? 'إجمالي المستخدمين' : 'Total Users', value: users.length },
        { label: isRTL ? 'المستخدمين النشطين' : 'Active Users', value: users.filter(function (u) { return u.is_active; }).length },
        { label: isRTL ? 'المشرفين' : 'Admins', value: users.filter(function (u) { return u.role === 'admin'; }).length },
        { label: isRTL ? 'البائعين' : 'Sellers', value: users.filter(function (u) { return u.role === 'seller'; }).length },
    ];

    var config = {
        title: isRTL ? 'تقرير المستخدمين' : 'Users Report',
        subtitle: isRTL ? 'قائمة شاملة بجميع مستخدمي النظام - ' + users.length + ' مستخدم' : 'Complete user list - ' + users.length + ' users',
        headers: headers,
        data: data,
        summaryItems: summaryItems,
        isRTL: isRTL,
        fileName: isRTL ? 'تقرير_المستخدمين' : 'users_report',
        sheetName: isRTL ? 'المستخدمين' : 'Users',
    };

    if (format === 'pdf') exportToPDF(config);
    else if (format === 'excel') exportToExcel(config);
    else if (format === 'print') printReport(config);
}

export function exportProductsReport(products, format, isRTL) {
    if (format === undefined) format = 'pdf';
    if (isRTL === undefined) isRTL = true;

    const currency = isRTL ? 'ج.م' : 'EGP';
    const headers = isRTL
        ? ['الفئة', 'المخزون', 'السعر', 'المنتج', '#']
        : ['#', 'Product', 'Price', 'Stock', 'Category'];

    const catMap = isRTL
        ? { supplements: 'مكملات', devices: 'أجهزة', food: 'أغذية', care: 'عناية', accessories: 'إكسسوارات' }
        : {};

    const data = products.map(function (p, i) {
        const row = [
            i + 1,
            p.title || '-',
            (p.price || 0).toLocaleString() + ' ' + currency,
            p.stock || 0,
            (isRTL ? catMap[p.category] : null) || p.category || '-',
        ];
        return isRTL ? row.reverse() : row;
    });

    var totalValue = products.reduce(function (s, p) { return s + (p.price || 0) * (p.stock || 0); }, 0);
    var summaryItems = [
        { label: isRTL ? 'إجمالي المنتجات' : 'Total Products', value: products.length },
        { label: isRTL ? 'قيمة المخزون' : 'Stock Value', value: totalValue.toLocaleString() + ' ' + currency },
        { label: isRTL ? 'مخزون منخفض (< 10)' : 'Low Stock (< 10)', value: products.filter(function (p) { return (p.stock || 0) < 10; }).length },
        { label: isRTL ? 'نفذ من المخزون' : 'Out of Stock', value: products.filter(function (p) { return (p.stock || 0) === 0; }).length },
    ];

    var config = {
        title: isRTL ? 'تقرير المنتجات' : 'Products Report',
        subtitle: isRTL ? 'جرد شامل للمنتجات والمخزون - ' + products.length + ' منتج' : 'Complete inventory report - ' + products.length + ' products',
        headers: headers,
        data: data,
        summaryItems: summaryItems,
        isRTL: isRTL,
        fileName: isRTL ? 'تقرير_المنتجات' : 'products_report',
        sheetName: isRTL ? 'المنتجات' : 'Products',
    };

    if (format === 'pdf') exportToPDF(config);
    else if (format === 'excel') exportToExcel(config);
    else if (format === 'print') printReport(config);
}

export function exportDashboardReport(stats, reports, format, isRTL) {
    if (format === undefined) format = 'pdf';
    if (isRTL === undefined) isRTL = true;

    const currency = isRTL ? 'ج.م' : 'EGP';
    const headers = isRTL
        ? ['القيمة', 'المؤشر']
        : ['Indicator', 'Value'];

    const indicators = [
        { ar: 'إجمالي الإيرادات', en: 'Total Revenue', val: (stats && stats.total_revenue || 0).toLocaleString() + ' ' + currency },
        { ar: 'إجمالي الطلبات', en: 'Total Orders', val: stats && stats.total_orders || 0 },
        { ar: 'إجمالي المستخدمين', en: 'Total Users', val: stats && stats.total_users || 0 },
        { ar: 'المستخدمين النشطين', en: 'Active Users', val: stats && stats.active_users || 0 },
        { ar: 'إجمالي المنتجات', en: 'Total Products', val: stats && stats.total_products || 0 },
        { ar: 'الطلبات المكتملة', en: 'Completed Orders', val: stats && stats.completed_orders || 0 },
        { ar: 'الطلبات قيد الانتظار', en: 'Pending Orders', val: stats && stats.pending_orders || 0 },
        { ar: 'عدد البائعين', en: 'Sellers', val: stats && stats.sellers || 0 },
    ];

    const data = indicators.map(function (ind) {
        if (isRTL) return [String(ind.val), ind.ar];
        return [ind.en, String(ind.val)];
    });

    var summaryItems = [
        { label: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue', value: (stats && stats.total_revenue || 0).toLocaleString() + ' ' + currency },
        { label: isRTL ? 'إجمالي الطلبات' : 'Total Orders', value: stats && stats.total_orders || 0 },
        { label: isRTL ? 'المستخدمين' : 'Users', value: (stats && stats.active_users || 0) + ' / ' + (stats && stats.total_users || 0) },
        { label: isRTL ? 'المنتجات' : 'Products', value: stats && stats.total_products || 0 },
    ];

    var config = {
        title: isRTL ? 'تقرير لوحة التحكم الشامل' : 'Comprehensive Dashboard Report',
        subtitle: isRTL ? 'ملخص شامل لأداء النظام والإحصائيات الرئيسية' : 'Complete system performance overview and key metrics',
        headers: headers,
        data: data,
        summaryItems: summaryItems,
        isRTL: isRTL,
        fileName: isRTL ? 'تقرير_لوحة_التحكم' : 'dashboard_report',
        sheetName: isRTL ? 'لوحة التحكم' : 'Dashboard',
    };

    if (format === 'pdf') exportToPDF(config);
    else if (format === 'excel') exportToExcel(config);
    else if (format === 'print') printReport(config);
}

/**
 * ══════════════════════════════════════════
 * HEALTH REPORT - تقرير صحة المستخدم
 * Uses html2canvas for native Arabic support
 * ══════════════════════════════════════════
 */
export async function exportHealthReport(readings, period, insight) {
    const { default: html2canvas } = await import('html2canvas');

    // Period labels
    const periodLabel = period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : '3 أشهر';

    // Stats
    const avg = readings.length > 0 ? Math.round(readings.reduce((s, r) => s + r.reading, 0) / readings.length) : 0;
    const maxR = readings.length > 0 ? Math.max(...readings.map(r => r.reading)) : 0;
    const minR = readings.length > 0 ? Math.min(...readings.map(r => r.reading)) : 0;
    const normalCount = readings.filter(r => r.reading >= 70 && r.reading <= 140).length;
    const normalPct = readings.length > 0 ? Math.round((normalCount / readings.length) * 100) : 0;
    const highCount = readings.filter(r => r.reading > 140).length;
    const lowCount = readings.filter(r => r.reading < 70).length;

    const statusText = avg < 70 ? 'منخفض - يحتاج مراجعة' :
        avg <= 120 ? 'ممتاز - في المعدل الطبيعي' :
            avg <= 180 ? 'مرتفع قليلاً - يحتاج متابعة' :
                'مرتفع - يجب مراجعة الطبيب فوراً';
    const statusColor = avg < 70 ? '#f59e0b' : avg <= 120 ? '#10b981' : avg <= 180 ? '#f59e0b' : '#ef4444';

    const typeMap = { 'fasting': 'صائم', 'after_meal': 'بعد الأكل', 'random': 'عشوائي', 'before_meal': 'قبل الأكل' };
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG')}`;

    // Build HTML
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;padding:0;';
    container.innerHTML = `
        <div style="background:linear-gradient(135deg,#166f50,#0d9488);padding:28px 30px;color:#fff;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:24px;font-weight:900;">🩺 سُكّرك مظبوط</div>
                    <div style="font-size:11px;opacity:0.8;margin-top:4px;">نظام إدارة الصحة الذكي - v3.0</div>
                </div>
                <div style="text-align:left;font-size:10px;opacity:0.7;">
                    <div>تاريخ التصدير</div>
                    <div style="font-weight:700;">${dateStr}</div>
                </div>
            </div>
        </div>
        <div style="padding:24px 30px;">
            <h2 style="font-size:20px;font-weight:900;color:#1e293b;margin:0 0 4px 0;">📋 تقرير متابعة السكر</h2>
            <p style="font-size:12px;color:#94a3b8;margin:0 0 20px 0;">فترة التقرير: ${periodLabel} — ${readings.length} قراءة</p>
            
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px;text-align:center;">
                    <div style="font-size:28px;font-weight:900;color:#166f50;">${avg}</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">المتوسط (mg/dL)</div>
                </div>
                <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:14px;text-align:center;">
                    <div style="font-size:28px;font-weight:900;color:#d97706;">${maxR}</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">أعلى قراءة</div>
                </div>
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px;text-align:center;">
                    <div style="font-size:28px;font-weight:900;color:#2563eb;">${minR}</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">أقل قراءة</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;text-align:center;">
                    <div style="font-size:22px;font-weight:900;color:#10b981;">${normalPct}%</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">طبيعية (${normalCount})</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;text-align:center;">
                    <div style="font-size:22px;font-weight:900;color:#ef4444;">${highCount}</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">مرتفعة</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;text-align:center;">
                    <div style="font-size:22px;font-weight:900;color:#f59e0b;">${lowCount}</div>
                    <div style="font-size:10px;color:#6b7280;font-weight:700;">منخفضة</div>
                </div>
            </div>

            <div style="background:${statusColor};color:#fff;padding:12px 18px;border-radius:12px;font-weight:900;font-size:14px;margin-bottom:20px;text-align:center;">
                التقييم العام: ${statusText}
            </div>

            ${insight ? `
            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:14px;margin-bottom:20px;">
                <div style="font-size:13px;font-weight:900;color:#166f50;margin-bottom:6px;">🤖 تحليل الذكاء الاصطناعي</div>
                <div style="font-size:11px;color:#475569;line-height:1.7;">${insight}</div>
            </div>` : ''}

            <h3 style="font-size:14px;font-weight:900;color:#1e293b;margin:0 0 10px 0;">📊 سجل القراءات</h3>
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
                <thead>
                    <tr style="background:#166f50;color:#fff;">
                        <th style="padding:10px 8px;text-align:right;font-weight:700;border-radius:8px 0 0 0;">#</th>
                        <th style="padding:10px 8px;text-align:right;font-weight:700;">التاريخ والوقت</th>
                        <th style="padding:10px 8px;text-align:right;font-weight:700;">نوع الفحص</th>
                        <th style="padding:10px 8px;text-align:center;font-weight:700;">القراءة</th>
                        <th style="padding:10px 8px;text-align:center;font-weight:700;border-radius:0 8px 0 0;">الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    ${readings.map((r, i) => {
        const st = r.reading < 70 ? 'منخفض' : r.reading <= 140 ? 'طبيعي' : r.reading <= 200 ? 'مرتفع' : 'مرتفع جداً';
        const stBg = r.reading < 70 ? '#fef3c7' : r.reading <= 140 ? '#d1fae5' : r.reading <= 200 ? '#fee2e2' : '#fecaca';
        const stColor = r.reading < 70 ? '#d97706' : r.reading <= 140 ? '#059669' : '#ef4444';
        const dateS = r.created_at ? new Date(r.created_at).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--';
        const bg = i % 2 === 0 ? '#fff' : '#f8fafc';
        return `<tr style="background:${bg};border-bottom:1px solid #f1f5f9;">
                            <td style="padding:9px 8px;font-weight:700;color:#94a3b8;">${i + 1}</td>
                            <td style="padding:9px 8px;color:#475569;">${dateS}</td>
                            <td style="padding:9px 8px;color:#475569;">${typeMap[r.test_type] || r.test_type || '--'}</td>
                            <td style="padding:9px 8px;text-align:center;font-weight:900;color:#1e293b;font-size:13px;">${r.reading}</td>
                            <td style="padding:9px 8px;text-align:center;"><span style="background:${stBg};color:${stColor};padding:3px 10px;border-radius:20px;font-weight:700;font-size:10px;">${st}</span></td>
                        </tr>`;
    }).join('')}
                </tbody>
            </table>
        </div>
        <div style="border-top:2px solid #10b981;padding:12px 30px;display:flex;justify-content:space-between;color:#94a3b8;font-size:9px;">
            <span>sukarak-mazboot.com</span>
            <span>© ${now.getFullYear()} سُكّرك مظبوط - جميع الحقوق محفوظة</span>
            <span>صفحة 1</span>
        </div>
    `;
    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const doc = new jsPDF({
            orientation: imgHeight > 297 ? 'portrait' : 'portrait',
            unit: 'mm',
            format: imgHeight > 297 ? [imgWidth, imgHeight + 10] : 'a4',
        });

        doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        doc.save('تقرير_السكر_' + new Date().toISOString().split('T')[0] + '.pdf');
    } finally {
        document.body.removeChild(container);
    }
}
