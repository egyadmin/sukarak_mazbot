import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Printer, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { formatPrice, getCurrencySymbol, convertPrice } from '../utils/currencyUtils';

/**
 * InvoicePage - Professional Tax Invoice (Responsive + Print-Ready + QR)
 */
const InvoicePage = ({ order, items = [], buyer = {}, onClose, embedded = false }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const invoiceRef = useRef(null);
    const [qrUrl, setQrUrl] = useState('');

    const subtotal = items.reduce((s, i) => s + (Number(i.offer_price) > 0 ? Number(i.offer_price) : Number(i.price)) * i.qty, 0);
    const taxRate = 0.15;
    const taxAmount = order?.tax ?? subtotal * taxRate;
    const discount = order?.discount || 0;
    const grandTotal = order?.total || (subtotal + taxAmount - discount);

    // Platform as default seller
    const platformInfo = {
        name: 'سكرك مظبوط',
        company: 'منصة سكرك مظبوط لرعاية مرضى السكري',
        email: 'support@sukarak.com',
        phone: '+20 100 000 0000',
        address: 'مصر',
        tax_number: '',
        commercial_reg: '',
    };

    const seller = {
        name: items[0]?.seller_name || order?.seller_name || platformInfo.name,
        company: items[0]?.seller_company || order?.seller_company || platformInfo.company,
        email: items[0]?.seller_email || order?.seller_email || platformInfo.email,
        phone: items[0]?.seller_phone || order?.seller_phone || platformInfo.phone,
        address: items[0]?.seller_address || order?.seller_address || platformInfo.address,
        tax_number: items[0]?.seller_tax_number || order?.seller_tax_number || platformInfo.tax_number,
        commercial_reg: items[0]?.seller_commercial_reg || order?.seller_commercial_reg || platformInfo.commercial_reg,
    };

    const orderDate = order?.created_at ? new Date(order.created_at) : new Date();
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const formatDate = (d) => d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    // Generate QR Code with invoice data
    useEffect(() => {
        const qrData = JSON.stringify({
            invoice: order?.order_number || '',
            date: orderDate.toISOString().split('T')[0],
            seller: seller.name,
            buyer: buyer.name || '',
            total: grandTotal.toFixed(2),
            vat: taxAmount.toFixed(2),
            currency: 'EGP',
        });
        QRCode.toDataURL(qrData, {
            width: 140,
            margin: 1,
            color: { dark: '#1a2744', light: '#ffffff' },
            errorCorrectionLevel: 'M',
        }).then(url => setQrUrl(url)).catch(() => { });
    }, [order?.order_number]);

    const paymentLabel = (method) => {
        const map = { card: { ar: 'بطاقة بنكية', en: 'Credit Card', icon: '💳' }, cod: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery', icon: '💵' }, wallet: { ar: 'المحفظة', en: 'Wallet', icon: '👛' }, bank: { ar: 'تحويل بنكي', en: 'Bank Transfer', icon: '🏦' } };
        return map[method] || map.card;
    };

    const statusLabel = (status) => {
        const map = {
            pending: { ar: 'قيد المعالجة', en: 'Pending', color: '#e67e22', bg: '#fef3e2' },
            confirmed: { ar: 'تم التأكيد', en: 'Confirmed', color: '#2e7d5b', bg: '#e8f5ee' },
            paid: { ar: 'مدفوعة', en: 'Paid', color: '#2e7d5b', bg: '#e8f5ee' },
            shipped: { ar: 'تم الشحن', en: 'Shipped', color: '#2980b9', bg: '#eaf2f8' },
            delivered: { ar: 'تم التوصيل', en: 'Delivered', color: '#2e7d5b', bg: '#e8f5ee' },
            cancelled: { ar: 'ملغاة', en: 'Cancelled', color: '#c0392b', bg: '#fde8e8' },
        };
        return map[status] || map.confirmed;
    };

    const currentStatus = statusLabel(order?.status || 'paid');
    const pm = paymentLabel(order?.payment_method || order?.payment || 'card');

    const handlePrint = () => {
        const printContent = invoiceRef.current;
        const win = window.open('', '_blank', 'width=900,height=700');
        win.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة ${order?.order_number || ''}</title>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Cairo', sans-serif; direction: rtl; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    @media print {
                        body { padding: 0; margin: 0; }
                        .invoice-container { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
                        .no-print { display: none !important; }
                        .section { page-break-inside: avoid; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                    }
                    @page { size: A4; margin: 8mm; }
                </style>
            </head>
            <body>${printContent.innerHTML}</body>
            </html>
        `);
        win.document.close();
        setTimeout(() => { win.print(); }, 600);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `فاتورة ${order?.order_number || ''}`,
                text: `فاتورة ضريبية رقم ${order?.order_number} - المبلغ: ${formatPrice(grandTotal, lang)}`,
                url: window.location.href
            }).catch(() => { });
        }
    };

    return (
        <div style={{
            position: embedded ? 'relative' : 'fixed',
            inset: embedded ? 'auto' : 0,
            zIndex: 2000,
            background: embedded ? 'transparent' : 'rgba(0,0,0,0.5)',
            backdropFilter: embedded ? 'none' : 'blur(8px)',
            display: 'flex',
            alignItems: embedded ? 'stretch' : 'flex-start',
            justifyContent: 'center',
            padding: embedded ? 0 : '12px',
            overflowY: 'auto',
        }}>
            <div style={{ width: '100%', maxWidth: 680, position: 'relative', margin: embedded ? 0 : '20px auto' }}>
                {/* Action Buttons */}
                {!embedded && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }} className="no-print">
                        <button onClick={handlePrint} style={{ ...btnStyle, background: '#1a2744' }}>
                            <Printer size={15} /> {lang === 'ar' ? 'طباعة' : 'Print'}
                        </button>
                        <button onClick={handleShare} style={{ ...btnStyle, background: '#c8a45e', color: '#1a2744' }}>
                            <Share2 size={15} /> {lang === 'ar' ? 'مشاركة' : 'Share'}
                        </button>
                        {onClose && (
                            <button onClick={onClose} style={{ ...btnStyle, background: '#c0392b' }}>
                                <X size={15} /> {lang === 'ar' ? 'إغلاق' : 'Close'}
                            </button>
                        )}
                    </div>
                )}

                {/* ═══════ INVOICE BODY ═══════ */}
                <div ref={invoiceRef} className="invoice-container" style={{
                    background: '#fff',
                    borderRadius: embedded ? 12 : 16,
                    overflow: 'hidden',
                    boxShadow: embedded ? '0 4px 20px rgba(0,0,0,0.08)' : '0 12px 48px rgba(26,39,68,0.12)',
                    fontFamily: "'Cairo', 'Tajawal', sans-serif",
                    direction: 'rtl',
                    fontSize: 13,
                    lineHeight: 1.6,
                    position: 'relative',
                }}>
                    {/* Watermark */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-35deg)', fontSize: 90, fontWeight: 900, color: 'rgba(200,164,94,0.03)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0 }}>فاتورة</div>

                    {/* ══ HEADER ══ */}
                    <div className="section" style={{ background: 'linear-gradient(135deg, #1a2744 0%, #243b62 50%, #2d4a7a 100%)', color: 'white', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, background: 'rgba(200,164,94,0.06)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, background: 'rgba(200,164,94,0.04)', borderRadius: '50%' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 60, height: 60, borderRadius: 14, overflow: 'hidden', border: '2px solid rgba(200,164,94,0.4)', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', flexShrink: 0, background: '#fff' }}>
                                    <img src="/logo.png" alt="سكرك مظبوط" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: 19, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>فاتورة ضريبية</h1>
                                    <p style={{ fontSize: 10, opacity: 0.5, margin: '1px 0 0' }}>Tax Invoice</p>
                                    <p style={{ fontSize: 10, color: '#c8a45e', margin: '3px 0 0', fontWeight: 700 }}>سكرك مظبوط — منصة رعاية مرضى السكري</p>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(200,164,94,0.15)', border: '1px solid rgba(200,164,94,0.3)', color: '#e8d5a0', padding: '3px 12px', borderRadius: 100, fontSize: 10, fontWeight: 600 }}>
                                {currentStatus[lang]} ✓
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, position: 'relative', zIndex: 1 }}>
                            <MiniCard label={lang === 'ar' ? 'رقم الطلب' : 'Order'} value={order?.order_number || '—'} />
                            <MiniCard label={lang === 'ar' ? 'تاريخ الإصدار' : 'Date'} value={formatDate(orderDate)} />
                            <MiniCard label={lang === 'ar' ? 'الاستحقاق' : 'Due'} value={formatDate(dueDate)} />
                        </div>
                    </div>

                    {/* ══ PARTIES: Seller + Buyer ══ */}
                    <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #e8e4dc' }}>
                        {/* Seller */}
                        <div style={{ padding: '14px 18px', borderLeft: '1px solid #e8e4dc' }}>
                            <Tag label={lang === 'ar' ? 'البائع / مقدم الخدمة' : 'Seller / Provider'} />
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#1a2744', marginBottom: 2 }}>{seller.name}</div>
                            <div style={{ fontSize: 10, color: '#5a6a85', marginBottom: 6 }}>{seller.company}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <InfoLine icon="📧" text={seller.email} />
                                <InfoLine icon="📱" text={seller.phone} />
                                <InfoLine icon="📍" text={seller.address} />
                                {seller.commercial_reg && <InfoLine icon="🏢" text={`سجل تجاري: ${seller.commercial_reg}`} />}
                                {seller.tax_number && <InfoLine icon="🔢" text={`الرقم الضريبي: ${seller.tax_number}`} />}
                            </div>
                        </div>
                        {/* Buyer */}
                        <div style={{ padding: '14px 18px' }}>
                            <Tag label={lang === 'ar' ? 'المشتري / العميل' : 'Buyer / Customer'} />
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#1a2744', marginBottom: 6 }}>{buyer.name || (lang === 'ar' ? 'عميل' : 'Customer')}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {buyer.email && <InfoLine icon="📧" text={buyer.email} />}
                                {buyer.phone && <InfoLine icon="📱" text={buyer.phone} />}
                                {buyer.address && <InfoLine icon="📍" text={typeof buyer.address === 'object' ? JSON.stringify(buyer.address) : buyer.address} />}
                            </div>
                        </div>
                    </div>

                    {/* ══ PRODUCTS TABLE ══ */}
                    <div className="section" style={{ padding: '14px 18px' }}>
                        <SectionHead>{lang === 'ar' ? 'بيانات المنتجات والخدمات' : 'Products & Services'}</SectionHead>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e4dc', fontSize: 11 }}>
                                <thead>
                                    <tr style={{ background: '#1a2744', color: 'white' }}>
                                        <th style={th}>#</th>
                                        <th style={th}>{lang === 'ar' ? 'المنتج / الخدمة' : 'Product'}</th>
                                        <th style={th}>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                                        <th style={th}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                        <th style={th}>{lang === 'ar' ? 'الضريبة' : 'VAT'}</th>
                                        <th style={{ ...th, textAlign: 'left' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => {
                                        const unitPrice = Number(item.offer_price) > 0 ? Number(item.offer_price) : Number(item.price);
                                        const itemTotal = unitPrice * item.qty;
                                        const itemTax = itemTotal * taxRate;
                                        const hasOffer = Number(item.offer_price) > 0 && Number(item.offer_price) < Number(item.price);
                                        return (
                                            <tr key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #e8e4dc' : 'none', background: i % 2 === 0 ? '#fff' : '#faf9f7' }}>
                                                <td style={td}>{i + 1}</td>
                                                <td style={td}>
                                                    <div style={{ fontWeight: 700, color: '#1a2744', fontSize: 11 }}>{item.title}</div>
                                                    {item.sku && <div style={{ fontSize: 9, color: '#888' }}>SKU: {item.sku}</div>}
                                                </td>
                                                <td style={td}>
                                                    {unitPrice.toFixed(2)}
                                                    {hasOffer && (
                                                        <span style={{ display: 'block', background: '#fef3e2', color: '#b8860b', padding: '1px 4px', borderRadius: 3, fontSize: 8, fontWeight: 600, marginTop: 1 }}>🔥 عرض</span>
                                                    )}
                                                </td>
                                                <td style={td}>{item.qty}</td>
                                                <td style={td}>{itemTax.toFixed(2)}</td>
                                                <td style={{ ...td, textAlign: 'left', fontWeight: 700, color: '#1a2744' }}>{(itemTotal + itemTax).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ══ TOTALS + QR ══ */}
                    <div className="section" style={{ padding: '0 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                        {/* QR Code */}
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                            {qrUrl && (
                                <div style={{ background: '#f8f6f1', border: '1px solid #e8e4dc', borderRadius: 10, padding: 10 }}>
                                    <img src={qrUrl} alt="QR Code" style={{ width: 110, height: 110, borderRadius: 6 }} />
                                    <div style={{ fontSize: 8, color: '#5a6a85', marginTop: 4, fontWeight: 600 }}>{lang === 'ar' ? 'رمز الفاتورة الإلكتروني' : 'E-Invoice QR'}</div>
                                </div>
                            )}
                        </div>
                        {/* Totals */}
                        <div style={{ width: '100%', maxWidth: 280, background: '#f8f6f1', borderRadius: 10, padding: 14, border: '1px solid #e8e4dc' }}>
                            <TotalLine label={lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'} value={formatPrice(subtotal, lang)} />
                            <TotalLine label={lang === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'} value={formatPrice(taxAmount, lang)} />
                            {discount > 0 && <TotalLine label={lang === 'ar' ? 'الخصم' : 'Discount'} value={`- ${formatPrice(discount, lang)}`} valueColor="#c0392b" />}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '2px solid #1a2744', marginTop: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#1a2744' }}>{lang === 'ar' ? 'الإجمالي المستحق' : 'Grand Total'}</span>
                                <span style={{ fontSize: 16, fontWeight: 900, color: '#c8a45e' }}>{formatPrice(grandTotal, lang)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ══ PAYMENT ══ */}
                    <div className="section" style={{ padding: '0 18px 14px' }}>
                        <SectionHead>{lang === 'ar' ? 'بيانات الدفع' : 'Payment Details'}</SectionHead>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                            <PayBox icon={pm.icon} label={lang === 'ar' ? 'طريقة الدفع' : 'Method'} value={pm[lang]} />
                            <PayBox icon="📅" label={lang === 'ar' ? 'تاريخ الدفع' : 'Date'} value={formatDate(orderDate)} />
                            <PayBox icon="✅" label={lang === 'ar' ? 'حالة الدفع' : 'Status'} value={currentStatus[lang]} valueColor="#2e7d5b" />
                        </div>
                    </div>

                    {/* ══ STATUS BAR ══ */}
                    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px', background: currentStatus.bg, borderTop: `1px solid ${currentStatus.color}33`, flexWrap: 'wrap', gap: 4 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: currentStatus.color, color: 'white', padding: '3px 12px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>
                            ✓ {currentStatus[lang]}
                        </div>
                        <div style={{ fontSize: 9, color: currentStatus.color, fontWeight: 500 }}>
                            {lang === 'ar' ? 'تاريخ السداد:' : 'Paid:'} {formatDate(orderDate)}
                        </div>
                    </div>

                    {/* ══ FOOTER ══ */}
                    <div className="section" style={{ padding: '12px 18px', borderTop: '1px solid #e8e4dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ fontSize: 9, color: '#5a6a85', maxWidth: 360, lineHeight: 1.7 }}>
                            {lang === 'ar'
                                ? 'هذه الفاتورة صادرة إلكترونياً وفقاً لنظام هيئة الزكاة والضريبة والجمارك. لا تحتاج إلى توقيع أو ختم لاعتمادها.'
                                : 'This invoice is electronically generated in accordance with ZATCA regulations.'}
                        </div>
                        <div className="no-print" style={{ display: 'flex', gap: 6 }}>
                            <button onClick={handlePrint} style={footerBtn}>🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}</button>
                            <button onClick={handleShare} style={footerBtn}>📤 {lang === 'ar' ? 'مشاركة' : 'Share'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════ SUB-COMPONENTS ═══════ */

const MiniCard = ({ label, value }) => (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 8px' }}>
        <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.5, marginBottom: 1, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#e8d5a0', wordBreak: 'break-word' }}>{value}</div>
    </div>
);

const Tag = ({ label }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#c8a45e', marginBottom: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c8a45e', display: 'inline-block' }} />
        {label}
    </div>
);

const InfoLine = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#5a6a85' }}>
        <div style={{ width: 20, height: 20, background: '#f8f6f1', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{icon}</div>
        <span style={{ wordBreak: 'break-word' }}>{text}</span>
    </div>
);

const SectionHead = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>
        {children}
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #e8e4dc)' }} />
    </div>
);

const TotalLine = ({ label, value, valueColor }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #e8e4dc', fontSize: 11, color: '#5a6a85' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: valueColor || '#1a2744' }}>{value}</span>
    </div>
);

const PayBox = ({ icon, label, value, valueColor }) => (
    <div style={{ background: '#f8f6f1', border: '1px solid #e8e4dc', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
        <div style={{ width: 28, height: 28, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>{icon}</div>
        <div style={{ fontSize: 8, color: '#5a6a85', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: valueColor || '#1a2744', wordBreak: 'break-word' }}>{value}</div>
    </div>
);

/* ═══════ STYLES ═══════ */

const th = { padding: '7px 10px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right', whiteSpace: 'nowrap' };
const td = { padding: '8px 10px', fontSize: 11, verticalAlign: 'middle' };

const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    color: 'white', border: 'none', padding: '6px 14px',
    borderRadius: 8, fontSize: 11, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    fontFamily: "'Cairo', sans-serif",
};

const footerBtn = {
    fontSize: 10, color: '#c8a45e', background: 'transparent',
    border: '1px solid #c8a45e', borderRadius: 5,
    padding: '3px 8px', cursor: 'pointer', fontWeight: 600,
    fontFamily: "'Cairo', sans-serif",
};

export default InvoicePage;
