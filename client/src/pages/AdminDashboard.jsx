import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, ShoppingBag, Users, Bell, Settings, Package,
    TrendingUp, DollarSign, MoreVertical, Plus, Search, LogOut,
    MessageCircle, Trash2, ToggleLeft, ToggleRight, Save, X,
    Send, Eye, EyeOff, Edit3, ChevronDown, Image, AlertCircle,
    Phone, Mail, Globe, MapPin, CreditCard, Truck, Palette,
    Video, PhoneOff, Mic, MicOff, VideoOff, PhoneCall,
    ClipboardList, BarChart3, Shield, UserPlus, Key, Monitor,
    Activity, FileText, PieChart, Calendar, Hash, UserCheck,
    Download, Printer, FileSpreadsheet, Crown, Headset, MessageSquare, RotateCcw, Check, Clock, CheckCircle, Loader2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../api/config';
import { exportOrdersReport, exportUsersReport, exportProductsReport, exportDashboardReport } from '../utils/ExportUtils';
import { CATEGORIES, getCategoryLabel, getSubcategoryLabel, getSubcategories } from '../data/categoryData';

const API = `${API_BASE}/admin`;

const AdminDashboard = () => {
    const [tab, setTab] = useState('overview');
    const [mobileMenu, setMobileMenu] = useState(false);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [orderFilter, setOrderFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reports, setReports] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [settings, setSettings] = useState({});
    const [settingsForm, setSettingsForm] = useState({});
    const [showProductModal, setShowProductModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', role: 'user', country: 'eg', admin_display_name: '', app_display_name: '', seller_department: '', seller_address: '' });
    const [newProduct, setNewProduct] = useState({ title: '', details: '', price: '', stock: '', category: '', sub_category: '', brand: '', sku: '', offer_price: '', offer_start_date: '', offer_end_date: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');
    const [newNotif, setNewNotif] = useState({ title: '', details: '', type: 'general', target: 'all' });
    const [productImage, setProductImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerTitle, setBannerTitle] = useState('');
    const [bannerLink, setBannerLink] = useState('');
    const [saving, setSaving] = useState(false);
    const [pendingLicenses, setPendingLicenses] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [packageRequests, setPackageRequests] = useState([]);
    const [selectedPackageReq, setSelectedPackageReq] = useState(null);
    const [selectedUserForMembership, setSelectedUserForMembership] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [showSubscribers, setShowSubscribers] = useState(null); // card_type or null
    const [editingCard, setEditingCard] = useState(null); // card being edited
    const [showCardForm, setShowCardForm] = useState(false); // show add/edit form
    const [cardForm, setCardForm] = useState({ card_type: '', name_ar: '', name_en: '', price_eg: 0, price_sa: 0, price_ae: 0, price_om: 0, price_other: 0, discount_percent: 0, icon: '⭐', features_ar: [], features_en: [], sort_order: 0 });
    const [newFeature, setNewFeature] = useState('');
    const [supportTickets, setSupportTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [adminReply, setAdminReply] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [chatWs, setChatWs] = useState(null);
    const chatEndRef = useRef(null);
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

    // Redirect doctors to their own dashboard
    useEffect(() => {
        if (adminUser?.role === 'doctor') {
            window.location.href = '/doctor';
            return;
        }
    }, []);

    // WebRTC Video Call
    const [inCall, setInCall] = useState(false);
    const [callType, setCallType] = useState('video');
    const [incomingCall, setIncomingCall] = useState(null);
    const [callSession, setCallSession] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const wsRef = useRef(null);

    const load = async () => {
        try {
            const [s, o, u, p, b, n, st] = await Promise.all([
                fetch(`${API}/stats`).then(r => r.json()),
                fetch(`${API}/recent-orders`).then(r => r.json()),
                fetch(`${API}/users`).then(r => r.json()),
                fetch(`${API}/products`).then(r => r.json()),
                fetch(`${API}/cms/banners`).then(r => r.json()),
                fetch(`${API}/cms/notifications`).then(r => r.json()),
                fetch(`${API}/settings`).then(r => r.json()),
            ]);
            setStats(s); setOrders(o); setUsers(u); setProducts(p);
            setBanners(b); setNotifications(n); setSettings(st);
            const flat = {};
            Object.values(st).flat().forEach(i => { flat[i.key] = i.value; });
            setSettingsForm(flat);
            // Load all orders and reports
            fetch(`${API}/orders`).then(r => r.json()).then(d => setAllOrders(d)).catch(() => { });
            fetch(`${API}/reports/summary`).then(r => r.json()).then(d => setReports(d)).catch(() => { });
            fetch(`${API}/activity-log`).then(r => r.json()).then(d => setActivityLog(d)).catch(() => { });
            fetch(`${API_BASE}/membership/cards`).then(r => r.json()).then(d => setMemberships(Array.isArray(d) ? d : [])).catch(() => { });
            fetch(`${API}/package-requests`).then(r => r.json()).then(d => setPackageRequests(Array.isArray(d) ? d : [])).catch(() => { });
            fetch(`${API_BASE}/support/admin/tickets`).then(r => r.json()).then(d => setSupportTickets(Array.isArray(d) ? d : [])).catch(() => { });
        } catch (e) { console.error(e); }
    };

    useEffect(() => { load(); }, []);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

    // === USER CRUD ===
    const toggleUser = async (id) => {
        await fetch(`${API}/users/${id}/toggle-active`, { method: 'PUT' });
        load();
    };
    const deleteUser = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        await fetch(`${API}/users/${id}`, { method: 'DELETE' });
        load();
    };
    const createUser = async () => {
        const res = await fetch(`${API}/users`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        if (res.ok) {
            const created = await res.json();
            const userId = created.id || created.user?.id;
            // Upload pending licenses if role is seller
            if (newUser.role === 'seller' && pendingLicenses.length > 0 && userId) {
                for (const lic of pendingLicenses) {
                    const fd = new FormData();
                    fd.append('file', lic.file);
                    fd.append('license_type', lic.license_type || 'other');
                    if (lic.license_number) fd.append('license_number', lic.license_number);
                    if (lic.expiry_date) fd.append('expiry_date', lic.expiry_date);
                    if (lic.notes) fd.append('notes', lic.notes);
                    await fetch(`${API}/users/${userId}/licenses`, { method: 'POST', body: fd });
                }
            }
            setPendingLicenses([]);
            setShowUserModal(false);
            setNewUser({ name: '', email: '', phone: '', password: '', role: 'user', country: 'eg', admin_display_name: '', app_display_name: '', seller_department: '', seller_address: '' });
            load();
        }
        else { const d = await res.json(); alert(d.detail || 'خطأ'); }
    };
    const saveUserEdit = async () => {
        if (!editingUser) return;
        await fetch(`${API}/users/${editingUser.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingUser)
        });
        setEditingUser(null); load();
    };
    const changeUserPassword = async (userId) => {
        const pw = prompt('أدخل كلمة المرور الجديدة:');
        if (!pw) return;
        await fetch(`${API}/users/${userId}/password`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw })
        });
        alert('تم تغيير كلمة المرور ✅');
    };
    const assignMembership = async (userId, cardType) => {
        const res = await fetch(`${API_BASE}/membership/cards/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, card_type: cardType, payment_method: 'admin_manual' })
        });
        if (res.ok) {
            alert('تم تفعيل الاشتراك بنجاح ✅');
            setSelectedUserForMembership(null);
            load();
        }
    };
    // === ORDER STATUS ===
    const updateOrderStatus = async (orderId, status) => {
        await fetch(`${API}/orders/${orderId}/status`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        load();
    };
    // === PRODUCTS ===
    const deleteProduct = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
        await fetch(`${API}/products/${id}`, { method: 'DELETE' });
        load();
    };
    const addProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.brand || !newProduct.sku) { alert('يرجى تعبئة اسم الشركة والسيريال'); return; }
        const fd = new FormData();
        Object.entries(newProduct).forEach(([k, v]) => { if (v) fd.append(k, v); });
        if (productImage) fd.append('image', productImage);
        await fetch(`${API}/products`, { method: 'POST', body: fd });
        setShowProductModal(false);
        setNewProduct({ title: '', details: '', price: '', stock: '', category: '', sub_category: '', brand: '', sku: '', offer_start_date: '', offer_end_date: '' });
        load();
    };
    const updateProduct = async (productId, data) => {
        await fetch(`${API}/products/${productId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        setEditingProduct(null);
        load();
    };
    const toggleBanner = async (id) => {
        await fetch(`${API}/cms/banners/${id}/toggle`, { method: 'PUT' });
        load();
    };
    const deleteBanner = async (id) => {
        if (!confirm('حذف هذا البانر؟')) return;
        await fetch(`${API}/cms/banners/${id}`, { method: 'DELETE' });
        load();
    };
    const addBanner = async () => {
        if (!bannerImage) return alert('اختر صورة البانر');
        const fd = new FormData();
        fd.append('image', bannerImage);
        fd.append('title', bannerTitle);
        fd.append('link', bannerLink);
        await fetch(`${API}/cms/banners`, { method: 'POST', body: fd });
        setBannerImage(null); setBannerTitle(''); setBannerLink('');
        load();
    };
    const addNotification = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(newNotif).forEach(([k, v]) => fd.append(k, v));
        await fetch(`${API}/cms/notifications`, { method: 'POST', body: fd });
        setShowNotifModal(false);
        setNewNotif({ title: '', details: '', type: 'general', target: 'all' });
        load();
    };
    const toggleNotif = async (id) => {
        await fetch(`${API}/cms/notifications/${id}/toggle`, { method: 'PUT' });
        load();
    };
    const deleteNotif = async (id) => {
        await fetch(`${API}/cms/notifications/${id}`, { method: 'DELETE' });
        load();
    };
    const saveSettings = async () => {
        setSaving(true);
        await fetch(`${API}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsForm),
        });
        setSaving(false);
        alert('تم حفظ الإعدادات بنجاح ✅');
        load();
    };
    // WebSocket connection for chat
    useEffect(() => {
        const uid = adminUser.id || 'admin';
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${API_BASE}/chat/ws/${uid}?name=${encodeURIComponent(adminUser.name || 'المدير')}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onopen = () => { ws.send(JSON.stringify({ type: 'join_room', room_id: 'general' })); };
        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.type === 'chat_message') setChatMessages(prev => [...prev, { from: msg.user_id == uid ? 'admin' : 'other', name: msg.name, text: msg.text, time: new Date(msg.timestamp).toLocaleTimeString('ar-EG') }]);
            if (msg.type === 'room_history') setChatMessages(msg.messages.map(m => ({ from: m.user_id == uid ? 'admin' : 'other', name: m.name, text: m.text, time: new Date(m.timestamp).toLocaleTimeString('ar-EG') })));
            if (msg.type === 'online_users') setOnlineUsers(msg.users);
            if (msg.type === 'incoming_call') setIncomingCall(msg);
            if (msg.type === 'call_accepted') startWebRTC(true, msg.session_id);
            if (msg.type === 'call_rejected') { setInCall(false); setCallSession(null); alert('تم رفض المكالمة'); }
            if (msg.type === 'call_ended') endCall(false);
            if (msg.type === 'offer') handleOffer(msg);
            if (msg.type === 'answer') handleAnswer(msg);
            if (msg.type === 'ice_candidate' && peerRef.current) peerRef.current.addIceCandidate(new RTCIceCandidate(msg.data));
        };
        return () => { ws.close(); };
    }, []);

    const sendChat = () => {
        if (!chatInput.trim() || !wsRef.current) return;
        wsRef.current.send(JSON.stringify({ type: 'chat_message', room_id: 'general', text: chatInput }));
        setChatInput('');
    };

    // WebRTC Functions
    const startCall = async (targetId, type = 'video') => {
        setCallType(type); setInCall(true);
        wsRef.current.send(JSON.stringify({ type: 'call_initiate', target_id: targetId, call_type: type }));
    };
    const acceptCall = async () => {
        if (!incomingCall) return;
        setCallType(incomingCall.call_type || 'video'); setInCall(true);
        setCallSession(incomingCall.session_id);
        wsRef.current.send(JSON.stringify({ type: 'call_accept', session_id: incomingCall.session_id }));
        setIncomingCall(null);
        await startWebRTC(false, incomingCall.session_id);
    };
    const rejectCall = () => {
        if (!incomingCall) return;
        wsRef.current.send(JSON.stringify({ type: 'call_reject', session_id: incomingCall.session_id }));
        setIncomingCall(null);
    };
    const endCall = (notify = true) => {
        if (notify && callSession) wsRef.current?.send(JSON.stringify({ type: 'call_end', session_id: callSession }));
        peerRef.current?.close(); peerRef.current = null;
        localStreamRef.current?.getTracks().forEach(t => t.stop()); localStreamRef.current = null;
        setInCall(false); setCallSession(null);
    };
    const startWebRTC = async (isCaller, sessionId) => {
        setCallSession(sessionId);
        const stream = await navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        peerRef.current = pc;
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        pc.ontrack = (e) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]; };
        pc.onicecandidate = (e) => { if (e.candidate) wsRef.current.send(JSON.stringify({ type: 'ice_candidate', target_id: isCaller ? 'callee' : 'caller', session_id: sessionId, data: e.candidate })); };
        if (isCaller) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            wsRef.current.send(JSON.stringify({ type: 'offer', target_id: 'callee', session_id: sessionId, data: offer }));
        }
    };
    const handleOffer = async (msg) => {
        if (!peerRef.current) await startWebRTC(false, msg.session_id);
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(msg.data));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        wsRef.current.send(JSON.stringify({ type: 'answer', target_id: msg.from_id, session_id: msg.session_id, data: answer }));
    };
    const handleAnswer = async (msg) => {
        await peerRef.current?.setRemoteDescription(new RTCSessionDescription(msg.data));
    };
    const toggleMic = () => { localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; }); setMicOn(p => !p); };
    const toggleCam = () => { localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; }); setCamOn(p => !p); };

    const sideItems = [
        { id: 'overview', label: 'لوحة التحكم', icon: LayoutDashboard },
        { id: 'orders', label: 'إدارة الطلبات', icon: ClipboardList },
        { id: 'products', label: 'المنتجات', icon: ShoppingBag },
        { id: 'users', label: 'المستخدمين', icon: Users },
        { id: 'wallets', label: 'الأرصدة والنقاط', icon: DollarSign },
        { id: 'notifications', label: 'الإشعارات والعروض', icon: Bell },
        { id: 'chat', label: 'المحادثات والاتصالات', icon: Video },
        { id: 'reports', label: 'التقارير', icon: BarChart3 },
        { id: 'memberships', label: 'العضويات والاشتراكات', icon: Crown },
        { id: 'packages', label: 'إدارة الباقات', icon: ClipboardList },
        { id: 'support', label: 'دعم العملاء', icon: Headset },
        { id: 'settings', label: 'الإعدادات', icon: Settings },
    ];

    const statCards = stats ? [
        { label: 'إجمالي المبيعات', value: `${stats.total_revenue.toLocaleString()} ج.م`, icon: DollarSign, gradient: 'from-emerald-500 to-teal-600' },
        { label: 'إجمالي الطلبات', value: stats.total_orders, icon: Package, gradient: 'from-blue-500 to-indigo-600' },
        { label: 'عدد المستخدمين', value: stats.total_users, icon: Users, gradient: 'from-purple-500 to-fuchsia-600' },
        { label: 'إجمالي المنتجات', value: stats.total_products, icon: ShoppingBag, gradient: 'from-orange-500 to-red-500' },
    ] : [];

    const roleMap = { admin_master: 'أدمن ماستر', admin: 'مدير', seller: 'تاجر', user: 'مستخدم', nurse: 'ممرض', doctor: 'طبيب' };
    const typeMap = { general: 'إعلان عام', promo: 'عرض ترويجي', health_tip: 'نصيحة صحية', update: 'تحديث' };

    const settingsGroups = [
        { key: 'general', label: 'إحصائيات عامة', icon: Globe, color: 'from-blue-500 to-cyan-500' },
        { key: 'contact', label: 'بيانات التواصل', icon: Phone, color: 'from-emerald-500 to-green-500' },
        { key: 'payment', label: 'إعدادات الدفع', icon: CreditCard, color: 'from-purple-500 to-violet-500' },
        { key: 'notifications', label: 'التنبيهات', icon: Bell, color: 'from-orange-500 to-amber-500' },
        { key: 'appearance', label: 'المظهر', icon: Palette, color: 'from-pink-500 to-rose-500' },
    ];

    // Glass card style
    const glass = 'bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/20';
    const inputStyle = 'w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-emerald-400/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20';
    const selectStyle = 'w-full bg-[#1e293b] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-emerald-400/50 transition-all [color-scheme:dark] [&>option]:bg-[#1e293b] [&>option]:text-white [&>option]:py-2';

    // Export buttons toolbar component
    const ExportToolbar = ({ onPDF, onExcel, onPrint, label }) => (
        <div className="flex items-center gap-2">
            <button onClick={onPDF} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20 transition-all" title="تصدير PDF">
                <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={onExcel} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20 transition-all" title="تصدير Excel">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button onClick={onPrint} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20 transition-all" title="طباعة">
                <Printer className="w-3.5 h-3.5" /> طباعة
            </button>
        </div>
    );

    return (
        <div className="min-h-screen font-cairo" dir="rtl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f172a 60%, #1a2332 100%)' }}>
            {/* Floating Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[5%] right-[10%] w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-[10%] left-[5%] w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(70px)' }} />
                <div className="absolute top-[50%] right-[50%] w-64 h-64 rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenu && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] lg:hidden" onClick={() => setMobileMenu(false)} />}

            {/* Mobile Slide-in Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[280px] bg-[#1e293b] z-[1200] lg:hidden transform transition-transform duration-300 ${mobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="" className="w-10 h-10 object-contain" />
                        <div>
                            <h2 className="font-black text-sm text-white">سكرك <span className="text-emerald-400">مظبوط</span></h2>
                            <p className="text-[10px] text-emerald-400/60 font-bold">نسخة الإدارة v3</p>
                        </div>
                    </div>
                    <button onClick={() => setMobileMenu(false)} className="p-2 bg-white/[0.05] rounded-xl"><X className="w-4 h-4 text-white/40" /></button>
                </div>
                <nav className="p-3 space-y-1 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {sideItems.map(item => (
                        <button key={item.id} onClick={() => { setTab(item.id); setMobileMenu(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                            ${tab === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'}`}>
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.06] bg-[#1e293b]">
                    <div className="flex items-center gap-3 mb-3 px-1">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black">
                            {(adminUser.name || 'A').charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">{adminUser.name || 'المدير'}</p>
                            <p className="text-[10px] text-white/30">{adminUser.email}</p>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); window.location.href = '/admin/login'; }}
                        className="w-full flex items-center justify-center gap-2 text-red-400 text-xs font-bold px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b]/95 backdrop-blur-xl border-t border-white/[0.08] z-50 lg:hidden safe-area-bottom">
                <div className="flex justify-around items-center px-1 py-1.5">
                    {[sideItems[0], sideItems[1], sideItems[2], sideItems[3]].map(item => (
                        <button key={item.id} onClick={() => setTab(item.id)}
                            className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all relative
                            ${tab === item.id ? 'text-emerald-400' : 'text-white/30'}`}>
                            {tab === item.id && <div className="absolute -top-1.5 w-8 h-1 bg-emerald-400 rounded-full" />}
                            <item.icon className="w-5 h-5" />
                            <span className="text-[9px] font-bold">{item.label.split(' ')[0]}</span>
                        </button>
                    ))}
                    <button onClick={() => setMobileMenu(true)}
                        className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl text-white/30">
                        <MoreVertical className="w-5 h-5" />
                        <span className="text-[9px] font-bold">المزيد</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Sidebar - Desktop only */}
                <aside className={`w-72 ${glass} hidden lg:flex flex-col border-l-0 border-t-0 border-b-0 rounded-none h-screen sticky top-0`}>
                    <div className="p-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} />
                            <div>
                                <h1 className="text-lg font-black text-white">سكرك <span className="text-emerald-400">مظبوط</span></h1>
                                <p className="text-[10px] text-white/30 font-bold">نسخة الإدارة v3.0</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {sideItems.map(item => (
                            <button key={item.id} onClick={() => setTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${tab === item.id
                                    ? 'bg-gradient-to-l from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/20'
                                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'}`}>
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black">
                                {(adminUser.name || 'A').charAt(0)}
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">{adminUser.name || 'المدير'}</p>
                                <p className="text-white/20 text-[10px]">{adminUser.email}</p>
                            </div>
                        </div>
                        <button onClick={() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); window.location.href = '/admin/login'; }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut className="w-4 h-4" /><span>تسجيل الخروج</span>
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                    {/* Header */}
                    <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/[0.05] px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                        <div className="hidden sm:flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] px-4 py-2.5 rounded-xl w-80">
                            <Search className="w-4 h-4 text-white/20" />
                            <input type="text" placeholder="ابحث عن شيء..." className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/15 font-bold" />
                        </div>
                        <div className="flex items-center gap-3 lg:hidden">
                            <img src="/logo.png" alt="" className="w-8 h-8" />
                            <div>
                                <span className="text-white font-black text-sm block">سكرك مظبوط</span>
                                <span className="text-emerald-400 text-[10px] font-bold">{sideItems.find(i => i.id === tab)?.label}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setMobileMenu(true)} className="lg:hidden p-2.5 bg-white/[0.05] rounded-xl">
                                <MoreVertical className="w-4 h-4 text-white/40" />
                            </button>
                        </div>
                    </header>

                    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                        {/* ===== OVERVIEW ===== */}
                        {tab === 'overview' && (<>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {statCards.map((s, i) => (
                                    <div key={i} className={`${glass} rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl`}>
                                        <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform" />
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
                                            <s.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-white/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">{s.label}</p>
                                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">{s.value}</h3>
                                        <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <s.icon className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className={`lg:col-span-2 ${glass} rounded-2xl overflow-hidden`}>
                                    <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
                                        <h3 className="text-base font-black text-white">آخر الطلبات</h3>
                                        <span className="text-emerald-400 text-xs font-bold">{orders.length} طلب</span>
                                    </div>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead><tr className="text-white/20 text-xs font-bold border-b border-white/[0.04]">
                                                <th className="px-6 py-3 text-right">رقم الطلب</th>
                                                <th className="px-6 py-3 text-right">العميل</th>
                                                <th className="px-6 py-3 text-right">العميل</th>
                                            </tr></thead>
                                            <tbody>{orders.map(o => (
                                                <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-3 text-sm font-bold text-white/70">#{o.order_number}</td>
                                                    <td className="px-6 py-3 text-sm font-black text-emerald-400">{o.total_amount} ج.م</td>
                                                    <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${o.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                                        {o.status === 'completed' ? 'مكتمل' : 'جاري المعالجة'}</span></td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3 p-4">
                                        {orders.map(o => (
                                            <div key={o.id} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.06] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        {o.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-xs">#{o.order_number?.slice(-6)}</p>
                                                        <p className="text-[10px] text-white/30 font-bold">{o.user_name || 'زائر'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-emerald-400 font-black text-sm">{o.total_amount?.toLocaleString()} ج.م</p>
                                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${o.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                        {o.status === 'completed' ? 'مكتمل' : 'جاري المعالجة'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-xl shadow-emerald-900/30 relative overflow-hidden">
                                        <div className="absolute top-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                        <h3 className="text-lg font-black text-white mb-1 relative z-10">إضافة منتج جديد</h3>
                                        <p className="text-white/50 text-xs mb-4 relative z-10">أضف منتجات جديدة للمتجر</p>
                                        <button onClick={() => setShowProductModal(true)} className="relative z-10 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                                            <Plus className="w-4 h-4" /> إضافة منتج
                                        </button>
                                    </div>
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h4 className="text-white/40 text-xs font-bold mb-3">نظرة سريعة</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-white/30 font-bold">التجار</span><span className="text-white font-black">{users.filter(u => u.role === 'seller').length}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-white/30 font-bold">التجار</span><span className="text-white font-black">{users.filter(u => u.role === 'admin').length}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-white/30 font-bold">الإعلانات النشطة</span><span className="text-emerald-400 font-black">{banners.filter(b => b.active).length}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>)}

                        {/* ===== ORDERS ===== */}
                        {tab === 'orders' && (<div>
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-emerald-400" /> إدارة الطلبات <span className="text-white/20 text-sm">({allOrders.length})</span></h2>
                                <div className="flex items-center gap-3">
                                    <ExportToolbar
                                        onPDF={() => exportOrdersReport(allOrders, 'pdf', true)}
                                        onExcel={() => exportOrdersReport(allOrders, 'excel', true)}
                                        onPrint={() => exportOrdersReport(allOrders, 'print', true)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['all', 'pending', 'processing', 'completed', 'cancelled'].map(s => (
                                    <button key={s} onClick={() => setOrderFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${orderFilter === s ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/30 hover:text-white/60 border border-white/[0.05]'}`}>
                                        {s === 'all' ? 'الكل' : s === 'pending' ? 'قيد الانتظار' : s === 'processing' ? 'جاري التجهيز' : s === 'completed' ? 'مكتمل' : 'ملغى'}
                                    </button>
                                ))}
                            </div>
                            <div className={`${glass} rounded-2xl overflow-hidden`}>
                                {/* Desktop Tablet Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full"><thead><tr className="text-white/20 text-xs font-bold border-b border-white/[0.04]">
                                        <th className="px-4 py-3 text-right">#</th><th className="px-4 py-3 text-right">العميل</th>
                                        <th className="px-4 py-3 text-right">مقدم الخدمة</th>
                                        <th className="px-4 py-3 text-right">المبلغ</th><th className="px-4 py-3 text-right">الحالة</th>
                                        <th className="px-4 py-3 text-right">الدفع</th><th className="px-4 py-3 text-right">إجراءات</th>
                                    </tr></thead>
                                        <tbody>{allOrders.filter(o => orderFilter === 'all' || o.status === orderFilter).map(o => (
                                            <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3 text-xs font-bold text-white/50">#{o.order_number?.slice(-6)}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-white">{o.user_name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-bold text-white/70">{o.provider_name || '-'}</span>
                                                        {o.provider_type && (
                                                            <span className={`inline-block w-fit px-2 py-0.5 rounded text-[9px] font-black ${o.provider_type === 'طبيب' ? 'bg-blue-500/15 text-blue-400' :
                                                                o.provider_type === 'تمريض' ? 'bg-purple-500/15 text-purple-400' :
                                                                    o.provider_type === 'بائع' ? 'bg-amber-500/15 text-amber-400' :
                                                                        'bg-white/10 text-white/40'
                                                                }`}>{o.provider_type}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-black text-emerald-400">{o.total_amount} ج.م</td>
                                                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-[10px] font-black ${o.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{o.status === 'completed' ? 'مكتمل' : 'جاري المعالجة'}</span></td>
                                                <td className="px-4 py-3 text-[10px] text-white/30">{o.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع'}</td>
                                                <td className="px-4 py-3"><button onClick={() => setSelectedOrder(o)} className="p-2 hover:bg-white/10 rounded-lg"><Eye className="w-4 h-4 text-white/40" /></button></td>
                                            </tr>
                                        ))}</tbody></table>
                                </div>
                                {/* Mobile Order List Card Mode */}
                                <div className="md:hidden space-y-4 p-4">
                                    {allOrders.filter(o => orderFilter === 'all' || o.status === orderFilter).map(o => (
                                        <div key={o.id} className={`${glass} rounded-3xl p-5 border-white/[0.05] shadow-lg group hover:border-emerald-500/20 transition-all`} onClick={() => setSelectedOrder(o)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-xl shadow-inner">
                                                        {o.payment_method === 'cash' ? '??' : '??'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-sm group-hover:text-emerald-400 transition">{o.user_name}</h4>
                                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">#{o.order_number?.slice(-8)}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter ${o.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                                    {o.status === 'completed' ? 'مكتمل' : 'جاري المعالجة'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-end pt-4 border-t border-white/[0.05]">
                                                <div>
                                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">المبلغ الإجمالي</p>
                                                    <p className="text-emerald-400 font-black text-lg">{o.total_amount?.toLocaleString()} <span className="text-[10px]">ج.م</span></p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">التاريخ</p>
                                                    <p className="text-white/50 font-bold text-xs">{new Date(o.created_at).toLocaleDateString('ar-EG')}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-[10px] font-black text-white/40 transition-all">عرض التفاصيل</button>
                                                <button className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl text-[10px] font-black transition-all">الفاتورة</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Order Detail Modal */}
                            {selectedOrder && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                                    <div className={`${glass} rounded-2xl p-6 w-full max-w-lg`} onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-black text-white">تفاصيل الطلب #{selectedOrder.order_number?.slice(-6)}</h3>
                                            <button onClick={() => setSelectedOrder(null)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between"><span className="text-white/40">العميل</span><span className="text-white font-bold">{selectedOrder.user_name}</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">الهاتف</span><span className="text-white font-bold" dir="ltr">{selectedOrder.user_phone}</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">الإجمالي</span><span className="text-emerald-400 font-black">{selectedOrder.total_amount?.toLocaleString()} ج.م</span></div>
                                            <div className="flex justify-between"><span className="text-white/40">الدفع</span><span className="text-white font-bold">{selectedOrder.payment_method}</span></div>
                                            <h4 className="text-white/50 font-bold pt-2 border-t border-white/10">المنتجات:</h4>
                                            {selectedOrder.items?.map((item, i) => (
                                                <div key={i} className="flex justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                                                    <span className="text-white/70">{item.product_name} × {item.quantity}</span>
                                                    <span className="text-emerald-400 font-bold">{item.total_price} ج.م</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>)}
                        {tab === 'products' && (
                            <div>
                                <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                                    <h2 className="text-xl font-black text-white">إدارة المنتجات <span className="text-white/20 text-sm">({products.length})</span></h2>
                                    <div className="flex items-center gap-3">
                                        <ExportToolbar
                                            onPDF={() => exportProductsReport(products, 'pdf', true)}
                                            onExcel={() => exportProductsReport(products, 'excel', true)}
                                            onPrint={() => exportProductsReport(products, 'print', true)}
                                        />
                                        <button onClick={() => setShowProductModal(true)} className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30">
                                            <Plus className="w-4 h-4" /> إضافة منتج
                                        </button>
                                    </div>
                                </div>
                                {/* Category Filter Tabs */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <button onClick={() => setProductCategoryFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${productCategoryFilter === 'all' ? 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg' : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}>
                                        الكل ({products.length})
                                    </button>
                                    {CATEGORIES.map(cat => {
                                        const count = products.filter(p => p.category === cat.id).length;
                                        return (
                                            <button key={cat.id} onClick={() => setProductCategoryFilter(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${productCategoryFilter === cat.id ? `bg-gradient-to-l ${cat.color} text-white shadow-lg` : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'}`}>
                                                {cat.emoji} {cat.label} ({count})
                                            </button>
                                        );
                                    })}
                                    {(() => {
                                        const uncatCount = products.filter(p => !p.category || !CATEGORIES.find(c => c.id === p.category)).length; return uncatCount > 0 ? (
                                            <button onClick={() => setProductCategoryFilter('uncategorized')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${productCategoryFilter === 'uncategorized' ? 'bg-gradient-to-l from-red-500 to-orange-500 text-white shadow-lg' : 'bg-white/[0.05] text-red-400/60 hover:bg-white/[0.08]'}`}>
                                                ⚠️ بدون تصنيف ({uncatCount})
                                            </button>
                                        ) : null;
                                    })()}
                                </div>
                                {(() => {
                                    let filteredProducts = products;
                                    if (productCategoryFilter === 'uncategorized') {
                                        filteredProducts = products.filter(p => !p.category || !CATEGORIES.find(c => c.id === p.category));
                                    } else if (productCategoryFilter !== 'all') {
                                        filteredProducts = products.filter(p => p.category === productCategoryFilter);
                                    }
                                    const grouped = {};
                                    filteredProducts.forEach(p => {
                                        const catId = p.category || 'uncategorized';
                                        if (!grouped[catId]) grouped[catId] = [];
                                        grouped[catId].push(p);
                                    });
                                    return Object.entries(grouped).map(([catId, catProducts]) => {
                                        const cat = CATEGORIES.find(c => c.id === catId);
                                        return (
                                            <div key={catId} className="mb-8">
                                                <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/[0.06]">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-lg shadow-lg`}>{cat?.emoji || '❓'}</div>
                                                    <div>
                                                        <h3 className="font-black text-white text-base">{cat?.label || 'بدون تصنيف'} <span className="text-white/20 text-sm">({catProducts.length} منتج)</span></h3>
                                                        {cat && <p className="text-[10px] text-white/20 font-bold">{getSubcategories(catId).map(s => s.label).join(' • ') || 'لا توجد أقسام فرعية'}</p>}
                                                    </div>
                                                </div>
                                                {/* Products Table for this category */}
                                                <div className={`${glass} rounded-2xl overflow-hidden`}>
                                                    {/* Desktop Table */}
                                                    <div className="hidden lg:block overflow-x-auto">
                                                        <table className="w-full">
                                                            <thead><tr className="text-white/20 text-[10px] font-black uppercase tracking-wider border-b border-white/[0.06]">
                                                                <th className="px-4 py-3 text-right">المنتج</th>
                                                                <th className="px-3 py-3 text-right">الشركة / SKU</th>
                                                                <th className="px-3 py-3 text-right">التصنيف</th>
                                                                <th className="px-3 py-3 text-right">البائع</th>
                                                                <th className="px-3 py-3 text-right">السعر</th>
                                                                <th className="px-3 py-3 text-right">المخزون</th>
                                                                <th className="px-3 py-3 text-right">فترة العرض</th>
                                                                <th className="px-3 py-3 text-right">الحالة</th>
                                                                <th className="px-3 py-3 text-center">إجراءات</th>
                                                            </tr></thead>
                                                            <tbody>
                                                                {catProducts.map(p => {
                                                                    const hasBrand = p.brand && p.brand !== '';
                                                                    const hasSku = p.sku && p.sku !== '';
                                                                    const hasValidCat = p.category && CATEGORIES.find(c => c.id === p.category);
                                                                    const hasSubCat = p.sub_category && p.sub_category !== '';
                                                                    const isComplete = hasBrand && hasSku && hasValidCat && hasSubCat;
                                                                    const hasOffer = p.offer_start_date && p.offer_end_date;
                                                                    return (
                                                                        <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                                                                            {/* Product */}
                                                                            <td className="px-4 py-3">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center overflow-hidden shrink-0">
                                                                                        {p.img_url ? <img src={p.img_url} className="w-full h-full object-cover rounded-xl" /> : <span className="text-xl">📦</span>}
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                        <p className="font-black text-white text-sm truncate max-w-[180px]">{p.title}</p>
                                                                                        <p className="text-[10px] text-white/20 truncate max-w-[180px]">{p.details?.substring(0, 50)}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            {/* Brand / SKU */}
                                                                            <td className="px-3 py-3">
                                                                                {hasBrand ? (
                                                                                    <div>
                                                                                        <p className="text-white font-bold text-xs flex items-center gap-1">🏭 {p.brand}</p>
                                                                                        <p className="text-[10px] text-cyan-400/60 font-mono mt-0.5">{hasSku ? `SKU: ${p.sku}` : <span className="text-red-400">⚠ بدون سيريال</span>}</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-red-400/60 text-[10px] font-bold bg-red-500/10 px-2 py-1 rounded-lg">⚠ بدون بيانات شركة</span>
                                                                                )}
                                                                            </td>
                                                                            {/* Category */}
                                                                            <td className="px-3 py-3">
                                                                                {hasValidCat ? (
                                                                                    <div>
                                                                                        <span className="text-[10px] font-black text-white/60">{getCategoryLabel(p.category)}</span>
                                                                                        {hasSubCat && <p className="text-[9px] text-emerald-400/50 mt-0.5">↳ {getSubcategoryLabel(p.category, p.sub_category)}</p>}
                                                                                        {!hasSubCat && <p className="text-[9px] text-amber-400/50 mt-0.5">⚠ بدون فرعي</p>}
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-red-400 text-[10px] font-bold bg-red-500/10 px-2 py-1 rounded-lg">❌ تصنيف خاطئ</span>
                                                                                )}
                                                                            </td>
                                                                            {/* Seller */}
                                                                            <td className="px-3 py-3">
                                                                                <span className="text-[11px] font-bold text-white/50 bg-white/[0.05] px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                                                                                    🏪 {p.seller || 'غير محدد'}
                                                                                </span>
                                                                            </td>
                                                                            {/* Price */}
                                                                            <td className="px-3 py-3">
                                                                                <p className="text-emerald-400 font-black text-sm">{p.price} <span className="text-[9px] text-white/20">ج.م</span></p>
                                                                                {p.offer_price && p.offer_price !== p.price && (
                                                                                    <p className="text-[10px] text-amber-400 font-bold">عرض: {p.offer_price} ج.م</p>
                                                                                )}
                                                                            </td>
                                                                            {/* Stock */}
                                                                            <td className="px-3 py-3">
                                                                                <span className={`text-xs font-black ${p.stock > 10 ? 'text-emerald-400' : p.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                                                                    {p.stock} <span className="text-[9px] text-white/20">قطعة</span>
                                                                                </span>
                                                                            </td>
                                                                            {/* Offer Period */}
                                                                            <td className="px-3 py-3">
                                                                                {hasOffer ? (
                                                                                    <div className="text-[10px]">
                                                                                        <p className="text-blue-400 font-bold">📅 {p.offer_start_date}</p>
                                                                                        <p className="text-blue-300/50">→ {p.offer_end_date}</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-white/15 text-[10px]">—</span>
                                                                                )}
                                                                            </td>
                                                                            {/* Status */}
                                                                            <td className="px-3 py-3">
                                                                                {isComplete ? (
                                                                                    <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-lg">✅ مكتمل</span>
                                                                                ) : (
                                                                                    <span className="bg-amber-500/15 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg">⚠ ناقص</span>
                                                                                )}
                                                                            </td>
                                                                            {/* Actions */}
                                                                            <td className="px-3 py-3 text-center">
                                                                                <div className="flex items-center justify-center gap-1">
                                                                                    <button onClick={() => setEditingProduct({ ...p })} className="p-2 rounded-lg text-white/20 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="تعديل"><Edit3 className="w-4 h-4" /></button>
                                                                                    <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all" title="حذف"><Trash2 className="w-4 h-4" /></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {/* Mobile Cards */}
                                                    <div className="lg:hidden space-y-3 p-3">
                                                        {catProducts.map(p => {
                                                            const hasBrand = p.brand && p.brand !== '';
                                                            const hasSku = p.sku && p.sku !== '';
                                                            const hasValidCat = p.category && CATEGORIES.find(c => c.id === p.category);
                                                            const isComplete = hasBrand && hasSku && hasValidCat;
                                                            return (
                                                                <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                                                                    <div className="flex gap-3">
                                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center overflow-hidden shrink-0">
                                                                            {p.img_url ? <img src={p.img_url} className="w-full h-full object-cover rounded-xl" /> : <span className="text-2xl">📦</span>}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between">
                                                                                <h4 className="font-black text-white text-sm truncate">{p.title}</h4>
                                                                                {isComplete ?
                                                                                    <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0">✅</span> :
                                                                                    <span className="bg-amber-500/15 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0">⚠</span>
                                                                                }
                                                                            </div>
                                                                            <p className="text-emerald-400 font-black text-sm mt-1">{p.price} ج.م</p>
                                                                            <p className="text-white/20 text-[10px]">المخزون: {p.stock}</p>
                                                                        </div>
                                                                    </div>
                                                                    {/* Details Grid */}
                                                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                                        <div className="bg-white/[0.03] rounded-lg p-2">
                                                                            <span className="text-white/20 block">🏭 الشركة</span>
                                                                            <span className={`font-bold ${hasBrand ? 'text-white/60' : 'text-red-400'}`}>{hasBrand ? p.brand : 'غير محدد'}</span>
                                                                        </div>
                                                                        <div className="bg-white/[0.03] rounded-lg p-2">
                                                                            <span className="text-white/20 block">🔖 SKU</span>
                                                                            <span className={`font-mono font-bold ${hasSku ? 'text-cyan-400/60' : 'text-red-400'}`}>{hasSku ? p.sku : 'غير محدد'}</span>
                                                                        </div>
                                                                        <div className="bg-white/[0.03] rounded-lg p-2">
                                                                            <span className="text-white/20 block">📂 التصنيف</span>
                                                                            <span className="font-bold text-white/60">{getCategoryLabel(p.category)}</span>
                                                                        </div>
                                                                        <div className="bg-white/[0.03] rounded-lg p-2">
                                                                            <span className="text-white/20 block">🏪 البائع</span>
                                                                            <span className="font-bold text-white/60">{p.seller || 'غير محدد'}</span>
                                                                        </div>
                                                                    </div>
                                                                    {p.offer_start_date && p.offer_end_date && (
                                                                        <div className="bg-blue-500/10 rounded-lg p-2 text-[10px] text-blue-400 font-bold">
                                                                            📅 فترة العرض: {p.offer_start_date} → {p.offer_end_date}
                                                                        </div>
                                                                    )}
                                                                    <div className="flex gap-2 pt-1">
                                                                        <button onClick={() => setEditingProduct({ ...p })} className="flex-1 text-center py-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-black">✏️ تعديل</button>
                                                                        <button onClick={() => deleteProduct(p.id)} className="py-2 px-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-black">🗑️</button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                                {/* Edit Product Modal */}
                                {editingProduct && (
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
                                        <div className={`${glass} rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                                            <h3 className="font-black text-white mb-4 flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-400" /> تعديل المنتج</h3>

                                            {/* Category Validation Alert */}
                                            {(() => {
                                                const validCat = editingProduct.category && CATEGORIES.find(c => c.id === editingProduct.category);
                                                const hasBrand = editingProduct.brand && editingProduct.brand !== '';
                                                const hasSku = editingProduct.sku && editingProduct.sku !== '';
                                                const issues = [];
                                                if (!validCat) issues.push('التصنيف الحالي غير صحيح');
                                                if (!hasBrand) issues.push('الشركة غير محددة');
                                                if (!hasSku) issues.push('السيريال غير محدد');
                                                if (!editingProduct.sub_category) issues.push('القسم الفرعي مفقود');
                                                return issues.length > 0 ? (
                                                    <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                                        <p className="text-amber-400 text-xs font-black mb-1">⚠ بيانات ناقصة تحتاج إصلاح:</p>
                                                        <ul className="space-y-0.5">
                                                            {issues.map((issue, i) => <li key={i} className="text-amber-400/60 text-[10px] font-bold">• {issue}</li>)}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                                                        <p className="text-emerald-400 text-xs font-black">✅ بيانات المنتج مكتملة وصحيحة</p>
                                                    </div>
                                                );
                                            })()}

                                            <div className="space-y-3">
                                                {/* Product Name */}
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم المنتج *</label>
                                                    <input className={inputStyle} value={editingProduct.title || ''} onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                                                </div>

                                                {/* Brand & SKU */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-white/30 text-[10px] font-black mb-1">🏭 اسم الشركة *</label>
                                                        <input className={inputStyle} placeholder="مثال: Accu-Chek" value={editingProduct.brand || ''} onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-white/30 text-[10px] font-black mb-1">🔖 السيريال (SKU) *</label>
                                                        <input className={inputStyle} placeholder="مثال: ACK-GLU-001" value={editingProduct.sku || ''} onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
                                                    </div>
                                                </div>

                                                {/* Price, Offer Price & Stock */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-white/30 text-[10px] font-black mb-1">💰 السعر</label>
                                                        <input type="number" className={inputStyle} value={editingProduct.price || ''} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-amber-400/60 text-[10px] font-black mb-1">🏷️ سعر العرض</label>
                                                        <input type="number" className={inputStyle} placeholder="0 = بدون عرض" value={editingProduct.offer_price || ''} onChange={e => setEditingProduct({ ...editingProduct, offer_price: parseFloat(e.target.value) || 0 })} style={{ borderColor: editingProduct.offer_price > 0 ? 'rgba(251,191,36,0.3)' : undefined }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-white/30 text-[10px] font-black mb-1">📦 المخزون</label>
                                                        <input type="number" className={inputStyle} value={editingProduct.stock || ''} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} />
                                                    </div>
                                                </div>
                                                {editingProduct.offer_price > 0 && editingProduct.price > 0 && (
                                                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-1.5 flex items-center justify-between">
                                                        <span className="text-amber-400 text-[10px] font-bold">🏷️ خصم {Math.round((1 - editingProduct.offer_price / editingProduct.price) * 100)}%</span>
                                                        <span className="text-white/30 text-[10px]"><s>{editingProduct.price}</s> → <span className="text-emerald-400 font-bold">{editingProduct.offer_price}</span></span>
                                                    </div>
                                                )}

                                                {/* Category & Sub-category */}
                                                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                                                    <p className="text-white/40 text-[10px] font-black mb-2">📂 التصنيف</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-white/30 text-[10px] font-black mb-1">القسم الرئيسي *</label>
                                                            <select className={`${selectStyle} [color-scheme:dark]`} value={editingProduct.category || ''} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value, sub_category: '' })}>
                                                                <option value="">اختر القسم</option>
                                                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-white/30 text-[10px] font-black mb-1">القسم الفرعي</label>
                                                            {editingProduct.category && getSubcategories(editingProduct.category).length > 0 ? (
                                                                <select className={`${selectStyle} [color-scheme:dark]`} value={editingProduct.sub_category || ''} onChange={e => setEditingProduct({ ...editingProduct, sub_category: e.target.value })}>
                                                                    <option value="">اختر القسم الفرعي</option>
                                                                    {getSubcategories(editingProduct.category).map(sub => <option key={sub.id} value={sub.id}>{sub.label}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input className={inputStyle} value="اختر القسم الرئيسي أولاً" disabled style={{ opacity: 0.3 }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Show current classification */}
                                                    {editingProduct.category && (
                                                        <div className="mt-2 text-[10px] text-emerald-400/50 bg-emerald-500/5 rounded-lg px-3 py-1.5">
                                                            📍 التصنيف: {getCategoryLabel(editingProduct.category)} {editingProduct.sub_category ? `← ${getSubcategoryLabel(editingProduct.category, editingProduct.sub_category)}` : ''}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Seller */}
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">🏪 البائع</label>
                                                    <input className={inputStyle} value={editingProduct.seller || ''} onChange={e => setEditingProduct({ ...editingProduct, seller: e.target.value })} />
                                                </div>

                                                {/* Offer Dates */}
                                                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                                                    <p className="text-white/40 text-[10px] font-black mb-2">📅 فترة العرض (اختياري)</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-white/30 text-[10px] font-black mb-1">تاريخ البداية</label>
                                                            <input type="date" className={`${inputStyle} [color-scheme:dark]`} value={editingProduct.offer_start_date || ''} onChange={e => setEditingProduct({ ...editingProduct, offer_start_date: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-white/30 text-[10px] font-black mb-1">تاريخ النهاية</label>
                                                            <input type="date" className={`${inputStyle} [color-scheme:dark]`} value={editingProduct.offer_end_date || ''} onChange={e => setEditingProduct({ ...editingProduct, offer_end_date: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    {editingProduct.offer_start_date && editingProduct.offer_end_date && (
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="text-blue-400 text-[10px] font-bold">📅 العرض: {editingProduct.offer_start_date} → {editingProduct.offer_end_date}</span>
                                                            <button onClick={() => setEditingProduct({ ...editingProduct, offer_start_date: '', offer_end_date: '' })} className="text-red-400/50 text-[10px] hover:text-red-400 transition-colors">مسح التواريخ</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                                                    <button onClick={() => updateProduct(editingProduct.id, editingProduct)} className="flex-1 bg-gradient-to-l from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all">💾 حفظ التعديلات</button>
                                                    <button onClick={() => setEditingProduct(null)} className="px-5 py-2.5 rounded-xl text-white/30 text-sm font-bold border border-white/10 hover:bg-white/[0.05] transition-all">إلغاء</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== USERS ===== */}
                        {tab === 'users' && (<div>
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><Users className="w-6 h-6 text-emerald-400" /> المستخدمين <span className="text-white/20 text-sm">({users.length})</span></h2>
                                <div className="flex items-center gap-3">
                                    <ExportToolbar
                                        onPDF={() => exportUsersReport(users, 'pdf', true)}
                                        onExcel={() => exportUsersReport(users, 'excel', true)}
                                        onPrint={() => exportUsersReport(users, 'print', true)}
                                    />
                                    <button onClick={() => setShowUserModal(true)} className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg"><UserPlus className="w-4 h-4" /> إضافة مستخدم</button>
                                </div>
                            </div>
                            <div className={`${glass} rounded-2xl overflow-hidden`}>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full"><thead><tr className="text-white/20 text-xs font-bold border-b border-white/[0.04]">
                                        <th className="px-4 py-3 text-right">المستخدم</th><th className="px-4 py-3 text-right">العميل</th>
                                        <th className="px-4 py-3 text-right">العميل</th><th className="px-4 py-3 text-right">الحالة</th>
                                        <th className="px-4 py-3 text-right">العميل</th><th className="px-4 py-3 text-right">إجراءات</th>
                                    </tr></thead>
                                        <tbody>{users.map(u => (
                                            <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center text-emerald-400 text-xs font-black">{(u.name || 'U')[0]}</div><span className="text-sm font-bold text-white">{u.name}</span></div></td>
                                                <td className="px-4 py-3 text-xs text-white/40" dir="ltr">{u.email}</td>
                                                <td className="px-4 py-3 text-xs text-white/40" dir="ltr">{u.phone || '-'}</td>
                                                <td className="px-4 py-3 text-xs text-white/60">{roleMap[u.role]}</td>
                                                <td className="px-4 py-3"><button onClick={() => toggleUser(u.id)} className="flex items-center gap-1 text-xs font-bold">{u.is_active ? <><ToggleRight className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400">نشط</span></> : <><ToggleLeft className="w-5 h-5 text-red-400/50" /><span className="text-red-400/50">معطل</span></>}</button></td>
                                                <td className="px-4 py-3"><div className="flex gap-1">
                                                    <button onClick={() => setEditingUser({ ...u })} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-blue-400" title="تعديل"><Edit3 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => changeUserPassword(u.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-yellow-400" title="تغيير كلمة المرور"><Key className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => setSelectedUserForMembership(u)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-amber-400" title="تعيين عضوية"><Crown className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-red-400" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div></td>
                                            </tr>))}</tbody></table>
                                </div>
                                {/* Mobile User List Card Mode */}
                                <div className="md:hidden space-y-4 p-4">
                                    {users.map(u => (
                                        <div key={u.id} className={`${glass} rounded-3xl p-5 border-white/[0.05] group hover:border-emerald-500/20 transition-all shadow-xl`}>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] flex items-center justify-center text-white font-black text-xl border border-white/[0.1] shadow-inner group-hover:scale-105 transition-transform">
                                                        {(u.name || 'U')[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-sm group-hover:text-emerald-400 transition">{u.name}</h4>
                                                        {u.role === 'seller' && u.admin_display_name && (
                                                            <p className="text-blue-400/60 text-[10px] font-bold">🏪 {u.admin_display_name}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">{roleMap[u.role]}</span>
                                                            <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                            {u.role === 'seller' && u.seller_department && (
                                                                <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[9px] font-bold border border-blue-500/10">
                                                                    {u.seller_department === 'diabetes_care' ? '💊 عناية بالسكري' : u.seller_department === 'medical_tests' ? '🔬 تحاليل طبية' : u.seller_department === 'home_nursing' ? '🏠 تمريض منزلي' : u.seller_department}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => toggleUser(u.id)} className="p-2.5 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] transition-colors shadow-lg">
                                                        {u.is_active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-red-500/40" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2 py-4 border-y border-white/[0.05]">
                                                <div className="flex items-center gap-2 text-white/30">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold truncate" dir="ltr">{u.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/30">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold" dir="ltr">{u.phone || 'بدون رقم'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <button onClick={async () => { if (u.role === 'seller') { const res = await fetch(`${API}/users/${u.id}`).then(r => r.json()); setEditingUser(res); } else { setEditingUser({ ...u }); } }} className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black hover:underline px-3 py-2 bg-blue-500/5 rounded-xl transition-all">تعديل <Edit3 className="w-3 h-3" /></button>
                                                <button onClick={() => changeUserPassword(u.id)} className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-black hover:underline px-3 py-2 bg-yellow-500/5 rounded-xl transition-all">كلمة السر <Key className="w-3 h-3" /></button>
                                                <button onClick={() => setSelectedUserForMembership(u)} className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black hover:underline px-3 py-2 bg-amber-500/5 rounded-xl transition-all">عضوية <Crown className="w-3 h-3" /></button>
                                                <button onClick={() => deleteUser(u.id)} className="flex items-center gap-1.5 text-red-400/50 text-[10px] font-black hover:text-red-400 px-3 py-2 bg-red-500/5 rounded-xl transition-all">حذف <Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {showUserModal && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUserModal(false)}><div className={`${glass} rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                                <h3 className="font-black text-white mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-400" /> إضافة مستخدم جديد</h3>
                                <div className="space-y-3">
                                    <input className={inputStyle} placeholder="الاسم" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                                    <input className={inputStyle} placeholder="البريد الإلكتروني" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={inputStyle} placeholder="رقم الهاتف" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                                        <input className={inputStyle} placeholder="كلمة المرور" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-white/30 text-[10px] font-black mb-1.5">الدور</label>
                                            <select className={selectStyle} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}><option value="user">مستخدم</option><option value="admin">مدير</option><option value="seller">تاجر</option><option value="doctor">طبيب</option><option value="nurse">ممرض</option></select>
                                        </div>
                                        <div>
                                            <label className="block text-white/30 text-[10px] font-black mb-1.5">البلد</label>
                                            <select className={selectStyle} value={newUser.country || 'eg'} onChange={e => setNewUser({ ...newUser, country: e.target.value })}><option value="eg">مصر 🇪🇬</option><option value="sa">السعودية 🇸🇦</option><option value="ae">الإمارات 🇦🇪</option><option value="kw">الكويت 🇰🇼</option><option value="bh">البحرين 🇧🇭</option><option value="qa">قطر 🇶🇦</option><option value="om">عُمان 🇴🇲</option></select>
                                        </div>
                                    </div>
                                    {/* === Seller-specific fields === */}
                                    {newUser.role === 'seller' && (
                                        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl p-4 border border-blue-400/10 space-y-3">
                                            <p className="text-blue-400 text-xs font-black flex items-center gap-1.5">🏪 بيانات التاجر الإضافية</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم مميز للبائع (خاص بالأدمن)</label>
                                                    <input className={inputStyle} placeholder="مثال: صيدلية النور" value={newUser.admin_display_name || ''} onChange={e => setNewUser({ ...newUser, admin_display_name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم البائع في التطبيق</label>
                                                    <input className={inputStyle} placeholder="يظهر للعملاء" value={newUser.app_display_name || ''} onChange={e => setNewUser({ ...newUser, app_display_name: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/30 text-[10px] font-black mb-1">القسم</label>
                                                <select className={selectStyle} value={newUser.seller_department || ''} onChange={e => setNewUser({ ...newUser, seller_department: e.target.value })}>
                                                    <option value="" style={{ background: '#1e293b' }}>اختر القسم</option>
                                                    <option value="diabetes_care" style={{ background: '#1e293b' }}>💊 منتجات العناية بالسكري</option>
                                                    <option value="medical_tests" style={{ background: '#1e293b' }}>🔬 التحاليل الطبية</option>
                                                    <option value="home_nursing" style={{ background: '#1e293b' }}>🏠 التمريض المنزلي</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-white/30 text-[10px] font-black mb-1">العنوان</label>
                                                <input className={inputStyle} placeholder="عنوان البائع" value={newUser.seller_address || ''} onChange={e => setNewUser({ ...newUser, seller_address: e.target.value })} />
                                            </div>
                                            {/* === التراخيص والمرفقات === */}
                                            <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                                <p className="text-amber-400 text-[11px] font-black mb-2 flex items-center gap-1">📋 التراخيص والمرفقات</p>
                                                {pendingLicenses.length > 0 && (
                                                    <div className="space-y-2 mb-3">
                                                        {pendingLicenses.map((lic, idx) => (
                                                            <div key={idx} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <span className="text-lg">{lic.file.name.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                                                                    <div className="min-w-0">
                                                                        <p className="text-white text-[10px] font-bold truncate">{lic.file.name}</p>
                                                                        <p className="text-white/20 text-[9px]">
                                                                            {lic.license_type === 'business_license' ? 'رخصة تجارية' : lic.license_type === 'health_permit' ? 'تصريح صحي' : lic.license_type === 'commerce_register' ? 'سجل تجاري' : 'أخرى'}
                                                                            {lic.license_number ? ` • رقم: ${lic.license_number}` : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setPendingLicenses(prev => prev.filter((_, i) => i !== idx))} className="text-red-400/50 hover:text-red-400 text-[10px] shrink-0">🗑</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select id="new-license-type" className={selectStyle} defaultValue="other">
                                                            <option value="business_license" style={{ background: '#1e293b' }}>📜 رخصة تجارية</option>
                                                            <option value="health_permit" style={{ background: '#1e293b' }}>🏥 تصريح صحي</option>
                                                            <option value="commerce_register" style={{ background: '#1e293b' }}>📋 سجل تجاري</option>
                                                            <option value="other" style={{ background: '#1e293b' }}>📎 أخرى</option>
                                                        </select>
                                                        <input id="new-license-number" className={inputStyle} placeholder="رقم الترخيص (اختياري)" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input id="new-license-expiry" type="date" className={inputStyle} />
                                                        <input id="new-license-notes" className={inputStyle} placeholder="ملاحظات (اختياري)" />
                                                    </div>
                                                    <input type="file" id="new-license-file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => {
                                                        if (!e.target.files[0]) return;
                                                        const licType = document.getElementById('new-license-type')?.value || 'other';
                                                        const licNum = document.getElementById('new-license-number')?.value || '';
                                                        const licExpiry = document.getElementById('new-license-expiry')?.value || '';
                                                        const licNotes = document.getElementById('new-license-notes')?.value || '';
                                                        setPendingLicenses(prev => [...prev, {
                                                            file: e.target.files[0],
                                                            license_type: licType,
                                                            license_number: licNum,
                                                            expiry_date: licExpiry,
                                                            notes: licNotes
                                                        }]);
                                                        e.target.value = '';
                                                        // Reset form fields
                                                        if (document.getElementById('new-license-number')) document.getElementById('new-license-number').value = '';
                                                        if (document.getElementById('new-license-expiry')) document.getElementById('new-license-expiry').value = '';
                                                        if (document.getElementById('new-license-notes')) document.getElementById('new-license-notes').value = '';
                                                    }} />
                                                    <button onClick={() => document.getElementById('new-license-file').click()} className="w-full bg-white/[0.04] border border-dashed border-white/10 rounded-lg py-2.5 text-[10px] text-white/30 font-bold hover:bg-white/[0.08] hover:text-white/50 transition flex items-center justify-center gap-2">
                                                        📎 اختر ملف ترخيص / مرفق
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2"><button onClick={createUser} className="flex-1 bg-gradient-to-l from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl font-black text-sm">إضافة</button><button onClick={() => setShowUserModal(false)} className="px-4 py-2.5 rounded-xl text-white/30 text-sm font-bold border border-white/10">إلغاء</button></div>
                                </div></div></div>)}
                            {editingUser && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}><div className={`${glass} rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                                <h3 className="font-black text-white mb-4 flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-400" /> تعديل المستخدم</h3>
                                <div className="space-y-3">
                                    <input className={inputStyle} placeholder="الاسم" value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={inputStyle} placeholder="البريد" type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} />
                                        <input className={inputStyle} placeholder="الهاتف" value={editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-white/30 text-[10px] font-black mb-1.5">الدور</label>
                                            <select className={inputStyle} value={editingUser.role || 'user'} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                                                <option value="admin_master">أدمن ماستر</option>
                                                <option value="admin">مدير</option>
                                                <option value="seller">تاجر</option>
                                                <option value="user">مستخدم</option>
                                                <option value="nurse">ممرض</option>
                                                <option value="doctor">طبيب</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-white/30 text-[10px] font-black mb-1.5">البلد</label>
                                            <select className={inputStyle} value={editingUser.country || 'eg'} onChange={e => setEditingUser({ ...editingUser, country: e.target.value })}>
                                                <option value="eg">مصر 🇪🇬</option><option value="sa">السعودية 🇸🇦</option><option value="ae">الإمارات 🇦🇪</option><option value="kw">الكويت 🇰🇼</option><option value="bh">البحرين 🇧🇭</option><option value="qa">قطر 🇶🇦</option><option value="om">عُمان 🇴🇲</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* === Seller-specific fields === */}
                                    {(editingUser.role === 'seller') && (
                                        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl p-4 border border-blue-400/10 space-y-3">
                                            <p className="text-blue-400 text-xs font-black flex items-center gap-1.5">🏪 بيانات التاجر</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم مميز (خاص بالأدمن)</label>
                                                    <input className={inputStyle} placeholder="يظهر في لوحة الأدمن فقط" value={editingUser.admin_display_name || ''} onChange={e => setEditingUser({ ...editingUser, admin_display_name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم البائع في التطبيق</label>
                                                    <input className={inputStyle} placeholder="يظهر في تفاصيل المنتج" value={editingUser.app_display_name || ''} onChange={e => setEditingUser({ ...editingUser, app_display_name: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">القسم</label>
                                                    <select className={selectStyle} value={editingUser.seller_department || ''} onChange={e => setEditingUser({ ...editingUser, seller_department: e.target.value })}>
                                                        <option value="" style={{ background: '#1e293b' }}>اختر القسم</option>
                                                        <option value="diabetes_care" style={{ background: '#1e293b' }}>💊 منتجات العناية بالسكري</option>
                                                        <option value="medical_tests" style={{ background: '#1e293b' }}>🔬 التحاليل الطبية</option>
                                                        <option value="home_nursing" style={{ background: '#1e293b' }}>🏠 التمريض المنزلي</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-white/30 text-[10px] font-black mb-1">العنوان</label>
                                                    <input className={inputStyle} placeholder="عنوان البائع" value={editingUser.seller_address || ''} onChange={e => setEditingUser({ ...editingUser, seller_address: e.target.value })} />
                                                </div>
                                            </div>
                                            {/* === التراخيص والمرفقات === */}
                                            <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                                <p className="text-amber-400 text-[11px] font-black mb-2 flex items-center gap-1">📋 التراخيص والمرفقات</p>
                                                {editingUser.licenses && editingUser.licenses.length > 0 && (
                                                    <div className="space-y-2 mb-3">
                                                        {editingUser.licenses.map(lic => (
                                                            <div key={lic.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <span className="text-lg">{lic.file_type === 'pdf' ? '📄' : '🖼️'}</span>
                                                                    <div className="min-w-0">
                                                                        <p className="text-white text-[10px] font-bold truncate">{lic.file_name}</p>
                                                                        <p className="text-white/20 text-[9px]">{lic.license_type === 'business_license' ? 'رخصة تجارية' : lic.license_type === 'health_permit' ? 'تصريح صحي' : lic.license_type === 'commerce_register' ? 'سجل تجاري' : 'أخرى'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lic.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : lic.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{lic.status === 'approved' ? 'مقبول' : lic.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}</span>
                                                                    <a href={`${lic.file_url}`} target="_blank" className="text-blue-400 text-[10px] hover:underline">تحميل</a>
                                                                    <button onClick={async () => { await fetch(`${API}/users/${editingUser.id}/licenses/${lic.id}`, { method: 'DELETE' }); const res = await fetch(`${API}/users/${editingUser.id}`).then(r => r.json()); setEditingUser(res); }} className="text-red-400/50 hover:text-red-400 text-[10px]">🗑</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <input type="file" id="license-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={async (e) => {
                                                        if (!e.target.files[0]) return;
                                                        const fd = new FormData();
                                                        fd.append('file', e.target.files[0]);
                                                        fd.append('license_type', 'other');
                                                        await fetch(`${API}/users/${editingUser.id}/licenses`, { method: 'POST', body: fd });
                                                        const res = await fetch(`${API}/users/${editingUser.id}`).then(r => r.json());
                                                        setEditingUser(res);
                                                        e.target.value = '';
                                                    }} />
                                                    <button onClick={() => document.getElementById('license-upload').click()} className="w-full bg-white/[0.04] border border-dashed border-white/10 rounded-lg py-2 text-[10px] text-white/30 font-bold hover:bg-white/[0.08] hover:text-white/50 transition">
                                                        📎 رفع ترخيص / مرفق جديد
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2"><button onClick={saveUserEdit} className="flex-1 bg-gradient-to-l from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl font-black text-sm">حفظ</button><button onClick={() => setEditingUser(null)} className="px-4 py-2.5 rounded-xl text-white/30 text-sm font-bold border border-white/10">إلغاء</button></div>
                                </div></div></div>)}
                        </div>)}
                        {/* ===== WALLETS & LOYALTY MANAGEMENT ===== */}
                        {tab === 'wallets' && (<div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-white flex items-center gap-2"><DollarSign className="w-6 h-6 text-amber-400" /> إدارة الأرصدة ونقاط الولاء</h2>
                                    <p className="text-white/30 text-xs font-bold mt-1">تحكم في رصيد المحفظة ونقاط الولاء لكل مستخدم • التعديلات تنعكس فوراً على حساب المستخدم</p>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input id="wallet-search" placeholder="بحث بالاسم أو الإيميل..." className={`${inputStyle} pr-10`} />
                                </div>
                            </div>
                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[{
                                    label: 'إجمالي المستخدمين', value: users.filter(u => u.role === 'user').length, icon: Users, color: 'from-blue-500 to-cyan-500'
                                }, {
                                    label: 'إجمالي الأرصدة', value: `${users.reduce((s, u) => s + (u.wallet_balance || 0), 0).toFixed(2)} SAR`, icon: DollarSign, color: 'from-emerald-500 to-teal-600'
                                }, {
                                    label: 'إجمالي النقاط', value: users.reduce((s, u) => s + (u.loyalty_points || 0), 0).toLocaleString(), icon: Crown, color: 'from-amber-500 to-orange-500'
                                }, {
                                    label: 'حسابات برصيد', value: users.filter(u => (u.wallet_balance || 0) > 0).length, icon: Activity, color: 'from-purple-500 to-fuchsia-600'
                                }].map((c, i) => (
                                    <div key={i} className={`${glass} rounded-2xl p-4`}>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                                            <c.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-white/40 text-[10px] font-bold">{c.label}</p>
                                        <p className="text-white text-lg font-black">{c.value}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Users Table */}
                            <div className={`${glass} rounded-2xl overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.06]">
                                                <th className="text-right text-white/30 text-[10px] font-black py-3 px-4 uppercase">#</th>
                                                <th className="text-right text-white/30 text-[10px] font-black py-3 px-4 uppercase">المستخدم</th>
                                                <th className="text-right text-white/30 text-[10px] font-black py-3 px-4 uppercase">البريد</th>
                                                <th className="text-right text-white/30 text-[10px] font-black py-3 px-4 uppercase">الدور</th>
                                                <th className="text-center text-white/30 text-[10px] font-black py-3 px-4 uppercase">رصيد المحفظة (SAR)</th>
                                                <th className="text-center text-white/30 text-[10px] font-black py-3 px-4 uppercase">نقاط الولاء</th>
                                                <th className="text-center text-white/30 text-[10px] font-black py-3 px-4 uppercase">إجراء</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => {
                                                const q = (document.getElementById('wallet-search')?.value || '').toLowerCase();
                                                if (!q) return true;
                                                return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                                            }).map((u, idx) => (
                                                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition">
                                                    <td className="py-3 px-4 text-white/30 text-xs font-bold">{idx + 1}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-black">
                                                                {(u.name || '?')[0]}
                                                            </div>
                                                            <span className="text-white font-bold text-xs">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-white/40 text-xs font-bold">{u.email}</td>
                                                    <td className="py-3 px-4"><span className={`text-[10px] font-black px-2 py-1 rounded-lg ${u.role === 'admin' ? 'bg-red-500/15 text-red-400' : u.role === 'seller' ? 'bg-blue-500/15 text-blue-400' : u.role === 'doctor' ? 'bg-purple-500/15 text-purple-400' : 'bg-white/5 text-white/40'}`}>{roleMap[u.role] || u.role}</span></td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            id={`wallet-${u.id}`}
                                                            defaultValue={u.wallet_balance || 0}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            className="w-24 mx-auto block bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs font-bold text-center outline-none focus:border-amber-400/50 transition"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            id={`loyalty-${u.id}`}
                                                            defaultValue={u.loyalty_points || 0}
                                                            type="number"
                                                            min="0"
                                                            className="w-20 mx-auto block bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs font-bold text-center outline-none focus:border-amber-400/50 transition"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            onClick={async () => {
                                                                const wallet = parseFloat(document.getElementById(`wallet-${u.id}`).value) || 0;
                                                                const points = parseInt(document.getElementById(`loyalty-${u.id}`).value) || 0;
                                                                try {
                                                                    const res = await fetch(`${API}/users/${u.id}/balance`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ wallet_balance: wallet, loyalty_points: points })
                                                                    });
                                                                    if (res.ok) {
                                                                        alert(`✅ تم تحديث رصيد ${u.name} بنجاح`);
                                                                        load();
                                                                    }
                                                                } catch { alert('❌ خطأ في الاتصال'); }
                                                            }}
                                                            className="bg-gradient-to-l from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
                                                        >
                                                            <Save className="w-3 h-3 inline ml-1" /> حفظ
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)}

                        {/* ===== NOTIFICATIONS & BANNERS ===== */}
                        {tab === 'notifications' && (
                            <div className="space-y-6">
                                {/* === Stats Cards === */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'إجمالي الإعلانات', value: banners.length, icon: Image, gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)' },
                                        { label: 'الإعلانات النشطة', value: banners.filter(b => b.active).length, icon: Eye, gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
                                        { label: 'إجمالي الإشعارات', value: notifications.length, icon: Bell, gradient: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.3)' },
                                        { label: 'الإشعارات النشطة', value: notifications.filter(n => n.active).length, icon: Send, gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.3)' },
                                    ].map((s, i) => (
                                        <div key={i} className={`${glass} rounded-2xl p-5 group hover:scale-[1.03] transition-all duration-300 relative overflow-hidden`}>
                                            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`, filter: 'blur(15px)' }} />
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg`} style={{ boxShadow: `0 8px 20px ${s.glow}` }}>
                                                <s.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-white/30 text-[11px] font-bold">{s.label}</p>
                                            <h3 className="text-2xl font-black text-white mt-1">{s.value}</h3>
                                        </div>
                                    ))}
                                </div>

                                {/* === Banners Section === */}
                                <div className={`${glass} rounded-2xl overflow-hidden`}>
                                    <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 20px rgba(139,92,246,0.3)' }}>
                                                <Image className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-white">إدارة الإعلانات</h3>
                                                <p className="text-[10px] text-white/20 font-bold">تحكم في الإعلانات المعروضة في التطبيق</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 text-[11px] font-black">{banners.length} بانر</span>
                                    </div>
                                    <div className="p-6">
                                        {/* Add Banner Form - Premium Design */}
                                        <div className="relative mb-8 rounded-2xl overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-l from-violet-600/10 via-purple-600/5 to-transparent" />
                                            <div className="relative bg-white/[0.03] rounded-2xl p-6 border border-white/[0.08]">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Plus className="w-5 h-5 text-violet-400" />
                                                    <h4 className="text-white font-black text-sm">إضافة بانر جديد</h4>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                                    {/* Image Upload Area */}
                                                    <div className="lg:col-span-4">
                                                        <label className="block w-full aspect-[16/9] rounded-xl border-2 border-dashed border-white/[0.1] hover:border-violet-400/40 bg-white/[0.02] hover:bg-violet-500/5 cursor-pointer transition-all duration-300 overflow-hidden group relative">
                                                            {bannerImage ? (
                                                                <>
                                                                    <img src={URL.createObjectURL(bannerImage)} className="w-full h-full object-cover" alt="معاينة" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <span className="text-white text-xs font-bold">تغيير الصورة</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                                                                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                        <Image className="w-6 h-6 text-violet-400/60" />
                                                                    </div>
                                                                    <p className="text-white/20 text-xs font-bold text-center">اسحب الصورة هنا أو انقر</p>
                                                                    <p className="text-white/10 text-[10px]">PNG, JPG, WebP</p>
                                                                </div>
                                                            )}
                                                            <input type="file" accept="image/*" className="hidden" onChange={e => setBannerImage(e.target.files?.[0] || null)} />
                                                        </label>
                                                    </div>
                                                    {/* Form Fields */}
                                                    <div className="lg:col-span-8 flex flex-col gap-3">
                                                        <div>
                                                            <label className="text-white/30 text-[11px] font-bold mb-1.5 block">عنوان الإعلان</label>
                                                            <input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} placeholder="مثال: خصم 50% على جميع أجهزة القياس" className={inputStyle} />
                                                        </div>
                                                        <div>
                                                            <label className="text-white/30 text-[11px] font-bold mb-1.5 block">رابط الإعلان (اختياري)</label>
                                                            <input value={bannerLink} onChange={e => setBannerLink(e.target.value)} placeholder="https://example.com/offer" dir="ltr" className={`${inputStyle} text-left`} />
                                                        </div>
                                                        <div className="flex-1" />
                                                        <button onClick={addBanner} className="w-full bg-gradient-to-l from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.01]">
                                                            <Plus className="w-5 h-5" /> رفع الإعلان
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Banners Grid - Premium Cards */}
                                        {banners.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                                                    <Image className="w-10 h-10 text-white/10" />
                                                </div>
                                                <h4 className="text-white/20 font-black text-lg mb-1">لا توجد إعلانات بعد</h4>
                                                <p className="text-white/10 text-sm">قم بإضافة أول بانر من الأعلى</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                                {banners.map((b, idx) => (
                                                    <div key={b.id} className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
                                                        {/* Banner Image */}
                                                        <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                                            <img
                                                                src={b.image_url}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                                alt={b.title || 'بانر'}
                                                            />
                                                            <div className="w-full h-full items-center justify-center hidden absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-slate-900">
                                                                <div className="text-center">
                                                                    <Image className="w-10 h-10 text-white/20 mx-auto mb-2" />
                                                                    <p className="text-white/20 text-xs font-bold">الصورة غير متاحة</p>
                                                                </div>
                                                            </div>
                                                            {/* Overlay gradient */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                                            {/* Status Badge */}
                                                            <div className="absolute top-3 right-3">
                                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black backdrop-blur-md ${b.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                                                    {b.active ? '✅ نشط' : '🔴 مخفى'}
                                                                </span>
                                                            </div>
                                                            {/* Order Badge */}
                                                            <div className="absolute top-3 left-3">
                                                                <span className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md text-white/50 text-[10px] font-black flex items-center justify-center border border-white/10">
                                                                    #{idx + 1}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Banner Info */}
                                                        <div className="p-4 bg-white/[0.02]">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-black text-white text-sm truncate">{b.title || 'بدون عنوان'}</h4>
                                                                    {b.link && <p className="text-white/20 text-[10px] mt-1 truncate" dir="ltr">{b.link}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.target_type === 'external' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/[0.06] text-white/30'}`}>
                                                                        {b.target_type === 'external' ? '🔗 خارجي' : '📱 داخلي'}
                                                                    </span>
                                                                    {b.created_at && <span className="text-[9px] text-white/15">{new Date(b.created_at).toLocaleDateString('ar-EG')}</span>}
                                                                </div>
                                                                <div className="flex gap-1.5">
                                                                    <button onClick={() => toggleBanner(b.id)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${b.active ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-white/[0.05] text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10'}`} title={b.active ? 'إخفاء' : 'إظهار'}>
                                                                        {b.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                    <button onClick={() => deleteBanner(b.id)} className="w-8 h-8 rounded-xl bg-white/[0.05] text-white/20 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center transition-all duration-200" title="حذف">
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* === Notifications Section === */}
                                <div className={`${glass} rounded-2xl overflow-hidden`}>
                                    <div className="px-6 py-5 border-b border-white/[0.06] flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 20px rgba(59,130,246,0.3)' }}>
                                                <Bell className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-white">الإشعارات والعروض</h3>
                                                <p className="text-[10px] text-white/20 font-bold">إدارة التنبيهات ونشر الإشعارات</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowNotifModal(true)} className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
                                            <Plus className="w-4 h-4" /> إضافة إشعار
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-3">
                                                    <Bell className="w-8 h-8 text-white/10" />
                                                </div>
                                                <h4 className="text-white/20 font-black mb-1">لا توجد إشعارات</h4>
                                                <p className="text-white/10 text-sm">أرسل تنبيهات جديدة للمستخدمين</p>
                                            </div>
                                        ) : notifications.map(n => {
                                            const typeConfig = {
                                                general: { color: 'blue', bg: 'bg-blue-500/15', text: 'text-blue-400', icon: '??', label: 'عام' },
                                                promo: { color: 'amber', bg: 'bg-amber-500/15', text: 'text-amber-400', icon: '??', label: 'عرض' },
                                                health_tip: { color: 'emerald', bg: 'bg-emerald-500/15', text: 'text-emerald-400', icon: '??', label: 'نصيحة صحية' },
                                                update: { color: 'violet', bg: 'bg-violet-500/15', text: 'text-violet-400', icon: '??', label: 'صحي' },
                                            };
                                            const tc = typeConfig[n.type] || typeConfig.general;
                                            return (
                                                <div key={n.id} className={`flex items-start gap-4 p-5 bg-white/[0.03] rounded-2xl border border-white/[0.06] group hover:border-white/[0.12] transition-all duration-300 ${!n.active ? 'opacity-50' : ''}`}>
                                                    <div className={`p-3 ${tc.bg} rounded-xl shrink-0`}>
                                                        <span className="text-lg">{tc.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <h4 className="font-black text-white text-sm">{n.title}</h4>
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${tc.bg} ${tc.text}`}>{tc.label}</span>
                                                            {n.target !== 'all' && <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/[0.05] text-white/30">?? {n.target}</span>}
                                                        </div>
                                                        <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{n.details}</p>
                                                        {n.created_at && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Calendar className="w-3 h-3 text-white/15" />
                                                                <p className="text-[10px] text-white/20">{new Date(n.created_at).toLocaleString('ar-EG')}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button onClick={() => toggleNotif(n.id)} className={`p-2 rounded-xl transition-all ${n.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-white/20 hover:bg-white/[0.05]'}`} title={n.active ? 'إخفاء' : 'إظهار'}>
                                                            {n.active ? <ToggleRight className="w-4.5 h-4.5" /> : <ToggleLeft className="w-4.5 h-4.5" />}
                                                        </button>
                                                        <button onClick={() => deleteNotif(n.id)} className="p-2 rounded-xl text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all" title="حذف">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== CHAT & VIDEO CALLS ===== */}
                        {tab === 'chat' && (
                            <div className="space-y-4">
                                {/* Video Call Active */}
                                {inCall && (
                                    <div className={`${glass} rounded-2xl overflow-hidden`}>
                                        <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-white font-black text-sm">{callType === 'video' ? '📹 مكالمة فيديو' : '📞 مكالمة صوتية'}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={toggleMic} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${micOn ? 'bg-white/10 text-white' : 'bg-red-500/30 text-red-400'}`}>
                                                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                                </button>
                                                {callType === 'video' && (
                                                    <button onClick={toggleCam} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${camOn ? 'bg-white/10 text-white' : 'bg-red-500/30 text-red-400'}`}>
                                                        {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                <button onClick={() => endCall()} className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all">
                                                    <PhoneOff className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative aspect-video bg-black/50">
                                            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                            <div className="absolute bottom-4 left-4 w-32 aspect-video rounded-xl overflow-hidden border-2 border-emerald-400/30 shadow-lg">
                                                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Incoming Call Alert */}
                                {incomingCall && (
                                    <div className="bg-gradient-to-l from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-between animate-pulse">
                                        <div className="flex items-center gap-3">
                                            <PhoneCall className="w-8 h-8 text-blue-400" />
                                            <div>
                                                <h4 className="text-white font-black">مكالمة واردة من {incomingCall.caller_name}</h4>
                                                <p className="text-white/30 text-xs">{incomingCall.call_type === 'video' ? 'مكالمة فيديو' : 'مكالمة صوتية'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={acceptCall} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-sm flex items-center gap-2"><Phone className="w-4 h-4" /> قبول</button>
                                            <button onClick={rejectCall} className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-black text-sm flex items-center gap-2"><PhoneOff className="w-4 h-4" /> رفض</button>
                                        </div>
                                    </div>
                                )}

                                {/* Online Users for calling */}
                                <div className={`${glass} rounded-2xl p-4`}>
                                    <h4 className="text-white/40 text-xs font-bold mb-3">🟢 المتصلون الآن ({onlineUsers.length})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {users.filter(u => u.id != adminUser.id).slice(0, 10).map(u => (
                                            <div key={u.id} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
                                                <div className={`w-2 h-2 rounded-full ${onlineUsers.some(ou => String(ou.user_id) === String(u.id)) ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-white/10'}`} />
                                                <span className="text-white/50 text-xs font-bold">{u.name}</span>
                                                <button onClick={() => startCall(String(u.id), 'audio')} className="p-1 rounded-lg text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10"><Phone className="w-3 h-3" /></button>
                                                <button onClick={() => startCall(String(u.id), 'video')} className="p-1 rounded-lg text-white/20 hover:text-blue-400 hover:bg-blue-500/10"><Video className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Chat Room */}
                                <div className={`${glass} rounded-2xl overflow-hidden flex flex-col`} style={{ height: inCall ? '40vh' : 'calc(100vh - 340px)' }}>
                                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                        <h3 className="text-base font-black text-white">💬 غرفة المحادثات</h3>
                                        <span className="text-white/20 text-xs font-bold">WebSocket • متصل</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {chatMessages.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <MessageCircle className="w-16 h-16 text-white/10 mb-4" />
                                                <h4 className="text-white/20 font-bold text-lg mb-2">مرحبا بالمحادثات</h4>
                                                <p className="text-white/10 text-sm max-w-md">الرسائل ستظهر هنا مباشرة</p>
                                            </div>
                                        )}
                                        {chatMessages.map((m, i) => (
                                            <div key={i} className={`flex ${m.from === 'admin' ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`max-w-[70%] ${m.from === 'admin' ? 'bg-emerald-500/15 border-emerald-500/20' : 'bg-blue-500/15 border-blue-500/20'} border rounded-2xl px-4 py-3`}>
                                                    <p className="text-[10px] text-white/30 font-bold mb-1">{m.name} • {m.time}</p>
                                                    <p className="text-white text-sm font-bold">{m.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-white/[0.06]">
                                        <div className="flex gap-3">
                                            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
                                                placeholder="اكتب رسالتك..." className={`${inputStyle} flex-1`} />
                                            <button onClick={sendChat} className="px-5 bg-gradient-to-l from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                                                <Send className="w-4 h-4" /> طباعة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== REPORTS ===== */}
                        {tab === 'reports' && (<div className="space-y-6">
                            <div className="flex flex-wrap justify-between items-center gap-3">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><BarChart3 className="w-6 h-6 text-emerald-400" /> التقارير والإحصائيات الشاملة</h2>
                                <ExportToolbar
                                    onPDF={() => exportDashboardReport(stats, reports, 'pdf', true)}
                                    onExcel={() => exportDashboardReport(stats, reports, 'excel', true)}
                                    onPrint={() => exportDashboardReport(stats, reports, 'print', true)}
                                />
                            </div>
                            {reports ? (<>
                                {/* Row 1: Key Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { l: 'إجمالي الإيرادات', v: `${reports.orders?.total_revenue?.toLocaleString() || 0}`, u: 'ج.م', g: 'from-emerald-500 to-teal-600', ic: DollarSign },
                                        { l: 'إجمالي الطلبات', v: reports.orders?.total || 0, u: 'طلب', g: 'from-blue-500 to-indigo-600', ic: Package },
                                        { l: 'المستخدمين', v: `${reports.users?.active || 0}/${reports.users?.total || 0}`, u: 'نشط', g: 'from-purple-500 to-fuchsia-600', ic: UserCheck },
                                        { l: 'متوسط الطلب', v: `${reports.orders?.avg_order_value || 0}`, u: 'ج.م', g: 'from-orange-500 to-red-500', ic: TrendingUp },
                                        { l: 'إجمالي المنتجات', v: reports.products?.total || 0, u: 'منتج', g: 'from-cyan-500 to-blue-600', ic: ShoppingBag },
                                        { l: 'قيمة المخزون', v: `${(reports.products?.total_stock_value || 0).toLocaleString()}`, u: 'ج.م', g: 'from-amber-500 to-orange-600', ic: Package },
                                        { l: 'منتج منخفض', v: reports.products?.low_stock || 0, u: 'منتج', g: 'from-red-500 to-rose-600', ic: AlertCircle },
                                        { l: 'قراءات السكر', v: reports.health?.sugar_readings || 0, u: 'قراءة', g: 'from-pink-500 to-rose-500', ic: Activity },
                                    ].map((c, i) => (
                                        <div key={i} className={`${glass} rounded-2xl p-4 hover:scale-[1.02] transition-transform`}>
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.g} flex items-center justify-center mb-2`}><c.ic className="w-4 h-4 text-white" /></div>
                                            <p className="text-white/30 text-[10px] font-bold">{c.l}</p>
                                            <div className="flex items-baseline gap-1 mt-0.5"><h3 className="text-xl font-black text-white">{c.v}</h3><span className="text-white/20 text-[10px]">{c.u}</span></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Row 2: Orders Analysis - 3 columns */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h3 className="text-sm font-black text-white mb-4">📊 حالة الطلبات</h3>
                                        <div className="space-y-3">{Object.entries(reports.orders?.by_status || {}).map(([k, v]) => {
                                            const colors = { completed: 'bg-emerald-500', pending: 'bg-amber-500', processing: 'bg-blue-500', cancelled: 'bg-red-500' };
                                            const labels = { completed: 'مكتمل', pending: 'معلّق', processing: 'جاري', cancelled: 'ملغى' };
                                            return (<div key={k} className="flex items-center gap-3">
                                                <span className="text-white/40 text-xs font-bold w-16">{labels[k] || k}</span>
                                                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${colors[k] || 'bg-white/20'}`} style={{ width: `${Math.min(100, (v / (reports.orders?.total || 1)) * 100)}%` }} /></div>
                                                <span className="text-white font-black text-xs w-6 text-left">{v}</span>
                                            </div>);
                                        })}</div>
                                    </div>
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h3 className="text-sm font-black text-white mb-4">📦 نوع الطلبات</h3>
                                        <div className="space-y-3">{Object.entries(reports.orders?.by_type || {}).map(([k, v]) => {
                                            const labels = { service: 'خدمات', market: 'متجر', giftcard: 'بطاقات هدايا' };
                                            const colors = { service: 'bg-violet-500', market: 'bg-cyan-500', giftcard: 'bg-pink-500' };
                                            return (<div key={k} className="flex items-center gap-3">
                                                <span className="text-white/40 text-xs font-bold w-20">{labels[k] || k}</span>
                                                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${colors[k] || 'bg-white/20'}`} style={{ width: `${Math.min(100, (v / (reports.orders?.total || 1)) * 100)}%` }} /></div>
                                                <span className="text-white font-black text-xs w-6 text-left">{v}</span>
                                            </div>);
                                        })}</div>
                                    </div>
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h3 className="text-sm font-black text-white mb-4">💳 طرق الدفع</h3>
                                        <div className="space-y-3">{Object.entries(reports.orders?.by_payment || {}).map(([k, v]) => {
                                            const labels = { card: 'بطاقة ائتمان', cash: 'نقداً', wallet: 'محفظة', cod: 'عند الاستلام' };
                                            const colors = { card: 'bg-blue-500', cash: 'bg-emerald-500', wallet: 'bg-purple-500', cod: 'bg-amber-500' };
                                            return (<div key={k} className="flex items-center gap-3">
                                                <span className="text-white/40 text-xs font-bold w-20">{labels[k] || k}</span>
                                                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${colors[k] || 'bg-white/20'}`} style={{ width: `${Math.min(100, (v / (reports.orders?.total || 1)) * 100)}%` }} /></div>
                                                <span className="text-white font-black text-xs w-6 text-left">{v}</span>
                                            </div>);
                                        })}</div>
                                    </div>
                                </div>

                                {/* Row 3: Products by Category + Users by Role */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h3 className="text-sm font-black text-white mb-4">🏷️ المنتجات حسب الفئة</h3>
                                        <div className="space-y-2">{Object.entries(reports.products?.by_category || {}).map(([k, v]) => {
                                            const catLabels = { supplements: 'مكملات', devices: 'أجهزة', food: 'أغذية', care: 'عناية', accessories: 'إكسسوار' };
                                            const catColors = { supplements: 'text-purple-400 bg-purple-500/15', devices: 'text-blue-400 bg-blue-500/15', food: 'text-amber-400 bg-amber-500/15', care: 'text-pink-400 bg-pink-500/15', accessories: 'text-cyan-400 bg-cyan-500/15' };
                                            return (<div key={k} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5">
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${catColors[k] || 'text-white/50 bg-white/5'}`}>{catLabels[k] || k}</span>
                                                <span className="text-white font-black text-sm">{v} <span className="text-white/20 text-[10px]">منتج</span></span>
                                            </div>);
                                        })}</div>
                                        <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                                            <div className="bg-red-500/10 rounded-lg px-3 py-2 text-center"><p className="text-red-400 text-lg font-black">{reports.products?.out_of_stock || 0}</p><p className="text-white/20 text-[10px]">نفذ من المخزون</p></div>
                                            <div className="bg-amber-500/10 rounded-lg px-3 py-2 text-center"><p className="text-amber-400 text-lg font-black">{reports.products?.low_stock || 0}</p><p className="text-white/20 text-[10px]">مخزون منخفض</p></div>
                                        </div>
                                    </div>
                                    <div className={`${glass} rounded-2xl p-5`}>
                                        <h3 className="text-sm font-black text-white mb-4">👥 المستخدمين حسب الدور</h3>
                                        <div className="space-y-2">{Object.entries(reports.users?.by_role || {}).map(([k, v]) => {
                                            const roleLabels = { admin: 'مدير', seller: 'تاجر', user: 'مستخدم', doctor: 'طبيب', moderator: 'مشرف' };
                                            const roleColors = { admin: 'text-purple-400 bg-purple-500/15', seller: 'text-blue-400 bg-blue-500/15', user: 'text-white/50 bg-white/5', doctor: 'text-emerald-400 bg-emerald-500/15', moderator: 'text-amber-400 bg-amber-500/15' };
                                            return (<div key={k} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5">
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${roleColors[k] || 'text-white/50 bg-white/5'}`}>{roleLabels[k] || k}</span>
                                                <span className="text-white font-black text-sm">{v} <span className="text-white/20 text-[10px]">المزيد</span></span>
                                            </div>);
                                        })}</div>
                                        <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3">
                                            <div className="bg-emerald-500/10 rounded-lg px-3 py-2 text-center"><p className="text-emerald-400 text-lg font-black">{reports.users?.active || 0}</p><p className="text-white/20 text-[10px]">مستخدم نشط</p></div>
                                            <div className="bg-red-500/10 rounded-lg px-3 py-2 text-center"><p className="text-red-400 text-lg font-black">{reports.users?.inactive || 0}</p><p className="text-white/20 text-[10px]">مستخدم معطل</p></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 4: Top Products */}
                                <div className={`${glass} rounded-2xl p-5`}>
                                    <h3 className="text-sm font-black text-white mb-4">🏆 أفضل المنتجات مبيعاً</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{(reports.top_products || []).map((p, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-4 py-3">
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${i < 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-white/5 text-white/30'}`}>{i + 1}</span>
                                            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white/70 truncate">{p.name}</p><p className="text-[10px] text-white/20">{p.qty} وحدة مباعة</p></div>
                                            <span className="text-emerald-400 font-black text-sm whitespace-nowrap">{p.revenue?.toLocaleString()} ج.م</span>
                                        </div>
                                    ))}</div>
                                </div>

                                {/* Row 5: Activity Log */}
                                <div className={`${glass} rounded-2xl p-5`}>
                                    <h3 className="text-sm font-black text-white mb-4">📋 سجل النشاطات الأخيرة</h3>
                                    {activityLog.length > 0 ? (
                                        <div className="space-y-2">{activityLog.slice(0, 15).map((a, i) => {
                                            const actionColors = { login: 'text-blue-400', create: 'text-emerald-400', update: 'text-amber-400', delete: 'text-red-400' };
                                            const actionLabels = { login: 'تسجيل دخول', create: 'إنشاء', update: 'تعديل', delete: 'حذف' };
                                            const entityLabels = { user: 'مستخدم', product: 'منتج', order: 'طلب', notification: 'إشعار', setting: 'إعداد' };
                                            return (<div key={i} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-2.5 hover:bg-white/[0.05] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${actionColors[a.action] ? actionColors[a.action].replace('text-', 'bg-') : 'bg-white/20'}`} />
                                                    <div>
                                                        <p className="text-sm font-bold"><span className={actionColors[a.action] || 'text-white/50'}>{actionLabels[a.action] || a.action}</span> <span className="text-white/30">- {entityLabels[a.entity_type] || a.entity_type}</span></p>
                                                        <p className="text-[10px] text-white/20">{a.user_name}{a.entity_name ? ` • ${a.entity_name}` : ''}{a.details ? ` • ${a.details}` : ''}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-white/15 whitespace-nowrap">{a.created_at ? new Date(a.created_at).toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                            </div>);
                                        })}</div>
                                    ) : <p className="text-white/20 text-center text-sm py-4">لا يوجد نشاط حالياً</p>}
                                </div>
                            </>) : <div className="flex flex-col items-center justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" /><p className="text-white/30 font-bold">جاري تحميل التقارير...</p></div>}
                        </div>)}

                        {/* ===== MEMBERSHIPS ===== */}
                        {/* ===== MEMBERSHIPS ===== */}
                        {tab === 'memberships' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black text-white flex items-center gap-2"><Crown className="w-6 h-6 text-amber-400" /> إدارة العضويات والباقات</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => fetch(`${API_BASE}/membership/cards`).then(r => r.json()).then(d => setMemberships(Array.isArray(d) ? d : []))}
                                            className="p-2 bg-white/[0.05] rounded-xl text-white/70 hover:bg-white/[0.1] transition"><RotateCcw className="w-5 h-5" /></button>
                                        <button onClick={() => {
                                            setEditingCard(null);
                                            setCardForm({ card_type: '', name_ar: '', name_en: '', price_eg: 0, price_sa: 0, price_ae: 0, price_om: 0, price_other: 0, discount_percent: 0, icon: '⭐', features_ar: [], features_en: [], sort_order: memberships.length + 1 });
                                            setShowCardForm(true);
                                        }} className="flex items-center gap-2 bg-gradient-to-l from-amber-500 to-yellow-600 text-white px-4 py-2 rounded-xl font-black text-sm shadow-lg hover:shadow-amber-900/40 transition active:scale-[0.98]">
                                            <Plus className="w-4 h-4" /> إضافة باقة جديدة
                                        </button>
                                    </div>
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memberships.map((card, i) => (
                                        <div key={i} className={`${glass} rounded-3xl p-6 relative overflow-hidden group border border-white/[0.05] hover:border-amber-500/30 transition-all`}>
                                            {/* Admin Controls */}
                                            <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button onClick={() => {
                                                    setEditingCard(card);
                                                    setCardForm({
                                                        card_type: card.card_type, name_ar: card.name_ar, name_en: card.name_en || '',
                                                        price_eg: card.prices?.EG || 0, price_sa: card.prices?.SA || 0, price_ae: card.prices?.AE || 0,
                                                        price_om: card.prices?.OM || 0, price_other: card.prices?.OTHER || 0,
                                                        discount_percent: card.discount_percent || 0, icon: card.icon || '⭐',
                                                        features_ar: card.features_ar || [], features_en: card.features_en || [],
                                                        sort_order: card.sort_order || i + 1,
                                                    });
                                                    setShowCardForm(true);
                                                }} className="p-1.5 bg-amber-500/20 rounded-lg hover:bg-amber-500/30 text-amber-400 transition" title="تعديل">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={async () => {
                                                    if (!confirm(`هل تريد حذف باقة "${card.name_ar}"؟`)) return;
                                                    const res = await fetch(`${API_BASE}/membership/cards/admin/${card.id}`, { method: 'DELETE' });
                                                    if (res.ok) {
                                                        alert('✅ تم الحذف');
                                                        fetch(`${API_BASE}/membership/cards`).then(r => r.json()).then(d => setMemberships(Array.isArray(d) ? d : []));
                                                    }
                                                }} className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/30 text-red-400 transition" title="حذف">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
                                                    <Crown className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="bg-white/5 text-white/30 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest">{card.card_type}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-white mb-2">{card.name_ar}</h3>
                                            <div className="flex items-end gap-1 mb-2">
                                                <span className="text-2xl font-black text-amber-400">{card.prices?.SA} SAR</span>
                                                <span className="text-[10px] text-white/20 font-bold pb-1">/ شهرياً</span>
                                            </div>
                                            {/* Show all country prices */}
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {card.prices?.EG > 0 && <span className="bg-white/5 text-white/30 text-[9px] px-1.5 py-0.5 rounded font-bold">🇪🇬 {card.prices.EG} EGP</span>}
                                                {card.prices?.AE > 0 && <span className="bg-white/5 text-white/30 text-[9px] px-1.5 py-0.5 rounded font-bold">🇦🇪 {card.prices.AE} AED</span>}
                                                {card.prices?.OM > 0 && <span className="bg-white/5 text-white/30 text-[9px] px-1.5 py-0.5 rounded font-bold">🇴🇲 {card.prices.OM} OMR</span>}
                                            </div>
                                            {card.discount_percent > 0 && (
                                                <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg mb-3 w-fit">خصم {card.discount_percent}%</div>
                                            )}
                                            <div className="space-y-2 mb-6">
                                                {card.features_ar?.slice(0, 4).map((f, fi) => (
                                                    <div key={fi} className="flex items-start gap-2 text-xs text-white/40">
                                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                        <span className="truncate">{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const res = await fetch(`${API}/memberships/subscribers?card_type=${card.card_type}`);
                                                    const data = await res.json();
                                                    setSubscribers(data);
                                                    setShowSubscribers(card.card_type);
                                                }}
                                                className="w-full bg-gradient-to-l from-amber-500/20 to-yellow-600/20 hover:from-amber-500/30 hover:to-yellow-600/30 text-amber-400 text-xs font-black py-3 rounded-xl transition-all border border-amber-500/20">
                                                👥 عرض المشتركين والتفاصيل
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* ========== Card Add/Edit Form Modal ========== */}
                                <AnimatePresence>
                                    {showCardForm && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4" onClick={() => setShowCardForm(false)}>
                                            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                                                className="bg-[#1a2332] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                                        <Crown className="w-5 h-5 text-amber-400" />
                                                        {editingCard ? `تعديل باقة: ${editingCard.name_ar}` : 'إضافة باقة جديدة'}
                                                    </h3>
                                                    <button onClick={() => setShowCardForm(false)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><X className="w-5 h-5 text-white/50" /></button>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Basic Info */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] text-white/30 font-bold mb-1 block">الاسم بالعربية *</label>
                                                            <input value={cardForm.name_ar} onChange={e => setCardForm(p => ({ ...p, name_ar: e.target.value }))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none focus:border-amber-500/50" placeholder="البطاقة الذهبية" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-white/30 font-bold mb-1 block">الاسم بالإنجليزية</label>
                                                            <input value={cardForm.name_en} onChange={e => setCardForm(p => ({ ...p, name_en: e.target.value }))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none focus:border-amber-500/50" placeholder="Gold Card" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="text-[10px] text-white/30 font-bold mb-1 block">نوع البطاقة (معرّف)</label>
                                                            <input value={cardForm.card_type} onChange={e => setCardForm(p => ({ ...p, card_type: e.target.value }))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none focus:border-amber-500/50" placeholder="gold" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-white/30 font-bold mb-1 block">الأيقونة</label>
                                                            <input value={cardForm.icon} onChange={e => setCardForm(p => ({ ...p, icon: e.target.value }))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none focus:border-amber-500/50 text-center text-lg" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-white/30 font-bold mb-1 block">نسبة الخصم %</label>
                                                            <input type="number" value={cardForm.discount_percent} onChange={e => setCardForm(p => ({ ...p, discount_percent: Number(e.target.value) }))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none focus:border-amber-500/50" />
                                                        </div>
                                                    </div>

                                                    {/* Prices */}
                                                    <div>
                                                        <label className="text-[10px] text-white/30 font-bold mb-2 block">💰 الأسعار حسب الدولة</label>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {[
                                                                { key: 'price_sa', label: '🇸🇦 SAR' },
                                                                { key: 'price_eg', label: '🇪🇬 EGP' },
                                                                { key: 'price_ae', label: '🇦🇪 AED' },
                                                                { key: 'price_om', label: '🇴🇲 OMR' },
                                                                { key: 'price_other', label: '🌍 أخرى' },
                                                            ].map(p => (
                                                                <div key={p.key}>
                                                                    <label className="text-[9px] text-white/20 font-bold mb-0.5 block">{p.label}</label>
                                                                    <input type="number" value={cardForm[p.key]} onChange={e => setCardForm(prev => ({ ...prev, [p.key]: Number(e.target.value) }))}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs font-bold outline-none focus:border-amber-500/50 text-center" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Features */}
                                                    <div>
                                                        <label className="text-[10px] text-white/30 font-bold mb-2 block">✨ المميزات (عربي)</label>
                                                        <div className="space-y-1.5 mb-2">
                                                            {cardForm.features_ar.map((f, fi) => (
                                                                <div key={fi} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                                                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                                                    <span className="flex-1 text-xs text-white/60">{f}</span>
                                                                    <button onClick={() => setCardForm(p => ({ ...p, features_ar: p.features_ar.filter((_, ii) => ii !== fi) }))}
                                                                        className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="أضف ميزة جديدة..."
                                                                onKeyDown={e => { if (e.key === 'Enter' && newFeature.trim()) { setCardForm(p => ({ ...p, features_ar: [...p.features_ar, newFeature.trim()] })); setNewFeature(''); } }}
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold outline-none focus:border-amber-500/50" />
                                                            <button onClick={() => { if (newFeature.trim()) { setCardForm(p => ({ ...p, features_ar: [...p.features_ar, newFeature.trim()] })); setNewFeature(''); } }}
                                                                className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-xs font-black">
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Save Button */}
                                                    <button onClick={async () => {
                                                        setSaving(true);
                                                        try {
                                                            const url = editingCard
                                                                ? `${API_BASE}/membership/cards/admin/${editingCard.id}`
                                                                : `${API_BASE}/membership/cards/admin/create`;
                                                            const method = editingCard ? 'PUT' : 'POST';
                                                            const res = await fetch(url, {
                                                                method, headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify(cardForm)
                                                            });
                                                            if (res.ok) {
                                                                alert(editingCard ? '✅ تم تحديث البطاقة' : '✅ تم إنشاء البطاقة');
                                                                setShowCardForm(false);
                                                                fetch(`${API_BASE}/membership/cards`).then(r => r.json()).then(d => setMemberships(Array.isArray(d) ? d : []));
                                                            } else {
                                                                const err = await res.json().catch(() => ({}));
                                                                alert(err.detail || 'حدث خطأ');
                                                            }
                                                        } catch (e) { alert('خطأ في الاتصال'); } finally { setSaving(false); }
                                                    }} disabled={saving || !cardForm.name_ar || !cardForm.card_type}
                                                        className="w-full bg-gradient-to-l from-amber-500 to-yellow-600 text-white py-3 rounded-xl font-black text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition">
                                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {editingCard ? 'حفظ التعديلات' : 'إنشاء البطاقة'}</>}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ========== Subscribers Modal ========== */}
                                {showSubscribers && (
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4" onClick={() => setShowSubscribers(null)}>
                                        <div className={`bg-[#1a2332] rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl`} onClick={e => e.stopPropagation()}>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-black text-white flex items-center gap-3">
                                                    <Crown className="w-5 h-5 text-amber-400" />
                                                    مشتركين {showSubscribers === 'silver' ? 'البطاقة الفضية' : showSubscribers === 'gold' ? 'البطاقة الذهبية' : 'البطاقة البلاتينية'}
                                                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">{subscribers.length}</span>
                                                </h3>
                                                <button onClick={() => setShowSubscribers(null)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition"><X className="w-5 h-5 text-white/50" /></button>
                                            </div>
                                            {subscribers.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <p className="text-white/20 text-sm font-bold">لا يوجد مشتركين في هذه البطاقة حالياً</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {subscribers.map(s => (
                                                        <div key={s.id} className="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.06] hover:border-amber-500/20 transition-all">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-600/20 flex items-center justify-center text-amber-400 font-black text-sm border border-amber-500/20">
                                                                        {(s.user_name || '?')[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white text-sm">{s.user_name}</p>
                                                                        <p className="text-white/30 text-[10px]">{s.user_email} • {s.user_phone || 'بدون رقم'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${s.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'expired' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                                        {s.status === 'active' ? '✅ نشط' : s.status === 'expired' ? '⏰ منتهي' : s.status === 'cancelled' ? '🚫 ملغي' : s.status}
                                                                    </span>
                                                                    {s.status === 'active' && (
                                                                        <button onClick={async () => {
                                                                            if (!confirm(`هل تريد إلغاء اشتراك ${s.user_name}؟`)) return;
                                                                            const res = await fetch(`${API_BASE}/membership/subscriptions/${s.id}/cancel`, { method: 'PUT' });
                                                                            if (res.ok) {
                                                                                alert('✅ تم إلغاء الاشتراك');
                                                                                // Refresh subscribers
                                                                                const res2 = await fetch(`${API}/memberships/subscribers?card_type=${showSubscribers}`);
                                                                                setSubscribers(await res2.json());
                                                                            }
                                                                        }} className="px-2 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-[10px] font-bold flex items-center gap-1 transition" title="إلغاء الاشتراك">
                                                                            <XCircle className="w-3 h-3" /> إلغاء
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/[0.05]">
                                                                <div>
                                                                    <p className="text-white/20 text-[9px] font-bold">المبلغ</p>
                                                                    <p className="text-emerald-400 text-xs font-black">{s.amount_paid} {s.currency}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-white/20 text-[9px] font-bold">من</p>
                                                                    <p className="text-white/60 text-xs font-bold">{s.start_date}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-white/20 text-[9px] font-bold">إلى</p>
                                                                    <p className="text-white/60 text-xs font-bold">{s.end_date}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-white/20 text-[9px] font-bold">طريقة الدفع</p>
                                                                    <p className="text-white/60 text-xs font-bold">{s.payment_method === 'card' ? '💳 بطاقة' : s.payment_method === 'bank_transfer' ? '🏦 تحويل' : s.payment_method || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ???????????????????????????????????????????????????????????? */}
                        {/* ???????? CONSULTATION PACKAGES REQUESTS ??????? */}
                        {/* ???????????????????????????????????????????????????????????? */}
                        {tab === 'packages' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white flex items-center gap-2"><Package className="w-6 h-6 text-emerald-400" /> طلبات حجز باقات الاستشارات</h3>
                                    <button onClick={() => fetch(`${API}/package-requests`).then(r => r.json()).then(d => setPackageRequests(d))}
                                        className="p-2 bg-white/[0.05] rounded-xl text-white/70 hover:bg-white/[0.1] transition-colors">
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className={`${glass} rounded-2xl overflow-hidden`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-right border-collapse">
                                            <thead>
                                                <tr className="bg-white/[0.05] border-b border-white/[0.08]">
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">المستخدم</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">الباقة</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">المبلغ</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">المدة</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">الحالة</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase">التاريخ</th>
                                                    <th className="px-6 py-4 text-xs font-black text-white/40 uppercase text-center">الإجراءات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {packageRequests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-12 text-center text-white/30 font-bold">لا توجد طلبات حالياً</td>
                                                    </tr>
                                                ) : (
                                                    packageRequests.map((req) => (
                                                        <tr key={req.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-white text-sm">{req.user_name}</span>
                                                                    <span className="text-[10px] text-white/30">ID: {req.user_id}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-bold text-white/70 text-sm">{req.package_name}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="font-black text-emerald-400 text-sm">{req.amount} {req.currency}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-white/50 text-xs font-bold">{req.period}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                                    req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                        req.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                                                                            req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                                'bg-white/10 text-white/50'
                                                                    }`}>
                                                                    {req.status === 'pending' ? '⏳ بانتظار الموافقة' :
                                                                        req.status === 'approved' ? '✅ تم الموافقة' :
                                                                            req.status === 'active' ? '🟢 مفعّل' :
                                                                                req.status === 'rejected' ? '❌ مرفوض' : req.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-white/30 text-xs">
                                                                {req.created_at ? new Date(req.created_at).toLocaleDateString('ar-EG') : '-'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex justify-center gap-2">
                                                                    {(req.status === 'pending' || req.status === 'active') && (
                                                                        <>
                                                                            <button
                                                                                onClick={async () => {
                                                                                    if (!confirm(`هل تريد الموافقة على طلب ${req.user_name} لباقة ${req.package_name}؟`)) return;
                                                                                    const res = await fetch(`${API}/package-requests/${req.id}/status`, {
                                                                                        method: 'PUT',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({ status: 'approved' })
                                                                                    });
                                                                                    if (res.ok) {
                                                                                        alert('✅ تم الموافقة وإرسال إشعار للمستخدم');
                                                                                        fetch(`${API}/package-requests`).then(r => r.json()).then(d => setPackageRequests(d));
                                                                                    }
                                                                                }}
                                                                                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition shadow-sm text-[10px] font-bold flex items-center gap-1"
                                                                                title="موافقة">
                                                                                <Check className="w-3.5 h-3.5" /> موافقة
                                                                            </button>
                                                                            <button
                                                                                onClick={async () => {
                                                                                    if (!confirm(`هل تريد رفض طلب ${req.user_name} لباقة ${req.package_name}؟`)) return;
                                                                                    const res = await fetch(`${API}/package-requests/${req.id}/status`, {
                                                                                        method: 'PUT',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({ status: 'rejected' })
                                                                                    });
                                                                                    if (res.ok) {
                                                                                        alert('❌ تم رفض الطلب وإرسال إشعار للمستخدم');
                                                                                        fetch(`${API}/package-requests`).then(r => r.json()).then(d => setPackageRequests(d));
                                                                                    }
                                                                                }}
                                                                                className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition shadow-sm text-[10px] font-bold flex items-center gap-1"
                                                                                title="رفض">
                                                                                <X className="w-3.5 h-3.5" /> رفض
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    <button
                                                                        onClick={() => setSelectedPackageReq(req)}
                                                                        className="p-1.5 bg-white/[0.05] text-white/50 rounded-lg hover:bg-white/[0.1] transition shadow-sm">
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Package Request Detail Modal */}
                        <AnimatePresence>
                            {selectedPackageReq && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                                    onClick={() => setSelectedPackageReq(null)}>
                                    <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                                        className="bg-[#1a2332] rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                                <Package className="w-5 h-5 text-emerald-400" /> تفاصيل طلب الباقة
                                            </h3>
                                            <button onClick={() => setSelectedPackageReq(null)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20"><X className="w-5 h-5 text-white/50" /></button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">المستخدم</p>
                                                    <p className="text-sm font-black text-white">{selectedPackageReq.user_name}</p>
                                                    <p className="text-[10px] text-white/30">ID: {selectedPackageReq.user_id}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">الباقة</p>
                                                    <p className="text-sm font-black text-emerald-400">{selectedPackageReq.package_name}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">المبلغ</p>
                                                    <p className="text-sm font-black text-amber-400">{selectedPackageReq.amount} {selectedPackageReq.currency}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">المدة</p>
                                                    <p className="text-sm font-bold text-white/70">{selectedPackageReq.period}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">الحالة</p>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${selectedPackageReq.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : selectedPackageReq.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : selectedPackageReq.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}>
                                                        {selectedPackageReq.status === 'pending' ? 'بانتظار الموافقة' : selectedPackageReq.status === 'active' ? 'مفعّل' : selectedPackageReq.status === 'rejected' ? 'مرفوض' : selectedPackageReq.status}
                                                    </span>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">التاريخ</p>
                                                    <p className="text-sm font-bold text-white/70">{selectedPackageReq.created_at ? new Date(selectedPackageReq.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                                                </div>
                                            </div>
                                            {selectedPackageReq.phone && (
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">رقم الهاتف</p>
                                                    <p className="text-sm font-bold text-white/70">{selectedPackageReq.phone}</p>
                                                </div>
                                            )}
                                            {selectedPackageReq.notes && (
                                                <div className="bg-white/5 p-3 rounded-xl">
                                                    <p className="text-[10px] text-white/30 mb-1">ملاحظات</p>
                                                    <p className="text-sm text-white/70">{selectedPackageReq.notes}</p>
                                                </div>
                                            )}
                                            {selectedPackageReq.status === 'pending' && (
                                                <div className="flex gap-3 pt-2">
                                                    <button onClick={async () => {
                                                        const res = await fetch(`${API}/package-requests/${selectedPackageReq.id}/status`, {
                                                            method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ status: 'approved' })
                                                        });
                                                        if (res.ok) { load(); setSelectedPackageReq(null); }
                                                    }} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-sm shadow-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                                                        <Check className="w-4 h-4" /> موافقة
                                                    </button>
                                                    <button onClick={async () => {
                                                        const res = await fetch(`${API}/package-requests/${selectedPackageReq.id}/status`, {
                                                            method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ status: 'rejected' })
                                                        });
                                                        if (res.ok) { load(); setSelectedPackageReq(null); }
                                                    }} className="flex-1 bg-red-500/20 text-red-400 py-3 rounded-xl font-black text-sm hover:bg-red-500/30 transition flex items-center justify-center gap-2">
                                                        <X className="w-4 h-4" /> رفض
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ===== SUPPORT TICKETS ===== */}
                        {tab === 'support' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black text-white flex items-center gap-2"><Headset className="w-6 h-6 text-emerald-400" /> تذاكر دعم العملاء</h2>
                                    <button onClick={() => fetch(`${API_BASE}/support/admin/tickets`).then(r => r.json()).then(d => setSupportTickets(d))}
                                        className="p-2 bg-white/[0.05] rounded-xl text-white/70 hover:bg-white/[0.1] transition-colors">
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {supportTickets.length === 0 ? (
                                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                            <p className="text-white/30 font-bold">لا توجد تذاكر دعم حالياً</p>
                                        </div>
                                    ) : (
                                        supportTickets.map(ticket => (
                                            <div key={ticket.id} className={`${glass} rounded-3xl p-5 border-white/[0.05] group hover:border-emerald-500/20 transition-all shadow-lg`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${ticket.priority === 'high' ? 'bg-red-500' : ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                                        <h4 className="font-black text-white text-sm truncate max-w-[120px]">{ticket.subject}</h4>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${ticket.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                                                        ticket.status === 'replied' ? 'bg-emerald-500/15 text-emerald-400' :
                                                            'bg-white/10 text-white/40'
                                                        }`}>
                                                        {ticket.status === 'pending' ? 'بانتظار الرد' : ticket.status === 'replied' ? 'تم الرد' : 'مغلق'}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-white/60 text-xs font-bold line-clamp-2 min-h-[32px]">{ticket.message}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
                                                    <div className="text-right">
                                                        <p className="text-white font-black text-[10px]">{ticket.user_name}</p>
                                                        <p className="text-white/20 text-[9px] font-bold">{new Date(ticket.created_at).toLocaleDateString('ar-EG')}</p>
                                                    </div>
                                                    <button onClick={() => setSelectedTicket(ticket)} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black transition-all">
                                                        {ticket.status === 'replied' ? 'عرض الرد' : 'رد الآن'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Ticket Modal */}
                                {selectedTicket && (
                                    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
                                        <div className={`${glass} rounded-3xl p-8 w-full max-w-lg border border-white/10`} onClick={e => e.stopPropagation()}>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-black text-white">تفاصيل تذكرة الدعم</h3>
                                                <button onClick={() => { setSelectedTicket(null); setAdminReply(''); }} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                            </div>

                                            <div className="space-y-4 mb-6">
                                                <div className="bg-white/5 p-4 rounded-2xl">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">المرسل: {selectedTicket.user_name}</span>
                                                        <span className="text-white/30 text-[10px] font-bold" dir="ltr">{selectedTicket.user_phone}</span>
                                                    </div>
                                                    <h4 className="text-white font-black text-sm mb-2">{selectedTicket.subject}</h4>
                                                    <p className="text-white/70 text-xs font-bold leading-relaxed">{selectedTicket.message}</p>
                                                </div>

                                                {selectedTicket.admin_reply && (
                                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                                        <p className="text-emerald-400 text-[10px] font-black uppercase mb-1">رد الإدارة:</p>
                                                        <p className="text-white/80 text-xs font-bold">{selectedTicket.admin_reply}</p>
                                                    </div>
                                                )}

                                                {selectedTicket.status === 'pending' && (
                                                    <div>
                                                        <label className="block text-white/30 text-[10px] font-black mb-2 uppercase">اكتب رد:</label>
                                                        <textarea value={adminReply} onChange={e => setAdminReply(e.target.value)}
                                                            placeholder="اكتب ردك هنا..."
                                                            className={`${inputStyle} min-h-[120px] resize-none`} />
                                                    </div>
                                                )}
                                            </div>

                                            {selectedTicket.status === 'pending' && (
                                                <button onClick={async () => {
                                                    if (!adminReply) return;
                                                    const res = await fetch(`${API_BASE}/support/admin/tickets/${selectedTicket.id}/reply`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ admin_reply: adminReply, status: 'replied' })
                                                    });
                                                    if (res.ok) {
                                                        setSelectedTicket(null);
                                                        setAdminReply('');
                                                        fetch(`${API_BASE}/support/admin/tickets`).then(r => r.json()).then(d => setSupportTickets(d));
                                                    }
                                                }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                                    <Send className="w-5 h-5" /> إرسال الرد للعميل
                                                </button>
                                            )}

                                            {/* Close Ticket Button - for replied tickets */}
                                            {selectedTicket.status === 'replied' && (
                                                <button onClick={async () => {
                                                    const res = await fetch(`${API_BASE}/support/admin/tickets/${selectedTicket.id}/close`, { method: 'PUT' });
                                                    if (res.ok) {
                                                        setSelectedTicket(null);
                                                        fetch(`${API_BASE}/support/admin/tickets`).then(r => r.json()).then(d => setSupportTickets(d));
                                                    }
                                                }} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                                                    <CheckCircle className="w-5 h-5" /> إغلاق التذكرة
                                                </button>
                                            )}

                                            {/* Show rating if exists */}
                                            {selectedTicket.rating && (
                                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                                                    <p className="text-amber-400 text-[10px] font-black uppercase mb-2">تقييم العميل:</p>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <span key={s} className={`text-lg ${s <= selectedTicket.rating ? '⭐' : ''}`}>{s <= selectedTicket.rating ? '⭐' : '☆'}</span>
                                                        ))}
                                                    </div>
                                                    {selectedTicket.rating_comment && (
                                                        <p className="text-white/60 text-xs font-bold mt-2">"{selectedTicket.rating_comment}"</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* ???????????????????????????????????????????????????????????? */}
                        {/* ???????? SETTINGS VIEW ??????? */}
                        {/* ???????????????????????????????????????????????????????????? */}
                        {tab === 'settings' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black text-white">⚙️ إعدادات التطبيق</h2>
                                    <button onClick={saveSettings} disabled={saving} className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50">
                                        <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                                    </button>
                                </div>
                                {settingsGroups.map(grp => (
                                    <div key={grp.key} className={`${glass} rounded-2xl overflow-hidden`}>
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grp.color} flex items-center justify-center`}>
                                                <grp.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <h3 className="text-sm font-black text-white">{grp.label}</h3>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(settings[grp.key] || []).map(s => (
                                                <div key={s.key}>
                                                    <label className="block text-xs font-bold text-white/30 mb-2">{s.label}</label>
                                                    {s.type === 'boolean' ? (
                                                        <button onClick={() => setSettingsForm(prev => ({ ...prev, [s.key]: prev[s.key] === 'true' ? 'false' : 'true' }))}
                                                            className="flex items-center gap-2 text-sm font-bold">
                                                            {settingsForm[s.key] === 'true'
                                                                ? <><ToggleRight className="w-6 h-6 text-emerald-400" /><span className="text-emerald-400">مفعّل</span></>
                                                                : <><ToggleLeft className="w-6 h-6 text-white/20" /><span className="text-white/20">مفعّل</span></>}
                                                        </button>
                                                    ) : s.type === 'textarea' ? (
                                                        <textarea value={settingsForm[s.key] || ''} onChange={e => setSettingsForm(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                            className={`${inputStyle} min-h-[80px] resize-none`} />
                                                    ) : s.type === 'color' ? (
                                                        <div className="flex items-center gap-3">
                                                            <input type="color" value={settingsForm[s.key] || '#000'} onChange={e => setSettingsForm(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                                className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer" />
                                                            <input value={settingsForm[s.key] || ''} onChange={e => setSettingsForm(prev => ({ ...prev, [s.key]: e.target.value }))} className={inputStyle} />
                                                        </div>
                                                    ) : (
                                                        <input type={s.type === 'number' ? 'number' : 'text'} value={settingsForm[s.key] || ''} onChange={e => setSettingsForm(prev => ({ ...prev, [s.key]: e.target.value }))}
                                                            className={inputStyle} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ===== MODALS ===== */}
            {showProductModal && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div onClick={() => setShowProductModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className={`relative ${glass} w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto`}>
                        <h2 className="text-lg font-black text-white mb-5">إضافة منتج جديد</h2>
                        <form onSubmit={addProduct} className="space-y-3">
                            <input required placeholder="عنوان المنتج" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} className={inputStyle} />
                            <input required placeholder="التفاصيل" value={newProduct.details} onChange={e => setNewProduct({ ...newProduct, details: e.target.value })} className={inputStyle} />

                            {/* اسم الشركة والسيريال - مطلوب */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1">اسم الشركة *</label>
                                    <input required placeholder="الشركة المصنعة" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1">السيريال (SKU) *</label>
                                    <input required placeholder="رقم المنتج" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className={inputStyle} />
                                </div>
                            </div>

                            {/* القسم الرئيسي */}
                            <div>
                                <label className="block text-white/30 text-[10px] font-black mb-1.5">القسم الرئيسي *</label>
                                <select required value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value, sub_category: '' })} className={selectStyle}>
                                    <option value="">اختر القسم</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* القسم الفرعي */}
                            {newProduct.category && (
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1.5">القسم الفرعي *</label>
                                    <select required value={newProduct.sub_category} onChange={e => setNewProduct({ ...newProduct, sub_category: e.target.value })} className={selectStyle}>
                                        <option value="">اختر القسم الفرعي</option>
                                        {getSubcategories(newProduct.category).map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <input required type="number" placeholder="💰 السعر" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className={inputStyle} />
                                <input type="number" placeholder="🏷️ سعر العرض" value={newProduct.offer_price} onChange={e => setNewProduct({ ...newProduct, offer_price: e.target.value })} className={inputStyle} style={{ borderColor: newProduct.offer_price ? 'rgba(251,191,36,0.3)' : undefined }} />
                                <input required type="number" placeholder="📦 المخزون" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className={inputStyle} />
                            </div>

                            {/* تواريخ العرض */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1">بداية العرض</label>
                                    <input type="date" className={`${inputStyle} [color-scheme:dark]`} value={newProduct.offer_start_date} onChange={e => setNewProduct({ ...newProduct, offer_start_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-white/30 text-[10px] font-black mb-1">نهاية العرض</label>
                                    <input type="date" className={`${inputStyle} [color-scheme:dark]`} value={newProduct.offer_end_date} onChange={e => setNewProduct({ ...newProduct, offer_end_date: e.target.value })} />
                                </div>
                            </div>

                            <label className={`flex items-center justify-center gap-2 ${inputStyle} cursor-pointer hover:border-emerald-400/30`}>
                                <Image className="w-4 h-4 text-white/30" />
                                <span className="text-white/30 text-xs">{productImage ? productImage.name : 'اختر صورة المنتج'}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={e => setProductImage(e.target.files[0])} />
                            </label>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 rounded-xl font-bold text-white/30 hover:bg-white/[0.05] transition-all">إلغاء</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-l from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-lg shadow-emerald-900/20">حفظ المنتج</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNotifModal && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div onClick={() => setShowNotifModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className={`relative ${glass} w-full max-w-lg rounded-2xl p-6`}>
                        <h2 className="text-lg font-black text-white mb-5">إضافة إشعار جديد</h2>
                        <form onSubmit={addNotification} className="space-y-3">
                            <input required placeholder="عنوان الإشعار" value={newNotif.title} onChange={e => setNewNotif({ ...newNotif, title: e.target.value })} className={inputStyle} />
                            <textarea required placeholder="تفاصيل الإشعار" value={newNotif.details} onChange={e => setNewNotif({ ...newNotif, details: e.target.value })} className={`${inputStyle} min-h-[100px] resize-none`} />
                            <div className="grid grid-cols-2 gap-3">
                                <select value={newNotif.type} onChange={e => setNewNotif({ ...newNotif, type: e.target.value })} className={selectStyle}>
                                    <option value="general">📢 عام</option>
                                    <option value="promo">🏷️ عرض</option>
                                    <option value="health_tip">💚 نصيحة صحية</option>
                                    <option value="update">🔄 تحديث</option>
                                </select>
                                <select value={newNotif.target} onChange={e => setNewNotif({ ...newNotif, target: e.target.value })} className={selectStyle}>
                                    <option value="all">الجميع</option>
                                    <option value="users">المستخدمين</option>
                                    <option value="sellers">التجار</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowNotifModal(false)} className="flex-1 py-3 rounded-xl font-bold text-white/30 hover:bg-white/[0.05]">إلغاء</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-l from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-lg shadow-emerald-900/20">إرسال الإشعار</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {selectedUserForMembership && (
                <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`${glass} rounded-3xl p-8 w-full max-w-md border border-white/10`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white">تعيين عضوية للمستخدم</h3>
                            <button onClick={() => setSelectedUserForMembership(null)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-white/40"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                                {(selectedUserForMembership.name || 'U')[0]}
                            </div>
                            <div>
                                <p className="text-white font-black">{selectedUserForMembership.name}</p>
                                <p className="text-white/30 text-xs">{selectedUserForMembership.phone || selectedUserForMembership.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {memberships.map(m => (
                                <button key={m.id} onClick={() => assignMembership(selectedUserForMembership.id, m.card_type)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/30 hover:bg-white/[0.08] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                            <Crown className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-black text-sm">{m.name_ar}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-white/20 rotate-[-90deg]" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

