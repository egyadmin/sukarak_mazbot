import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ShoppingCart, Search, Filter, Star, Heart, Plus, Minus,
    ChevronRight, ChevronLeft, X, Trash2, Package, CreditCard, Truck,
    Check, AlertCircle, ShoppingBag, Loader2, ArrowUpDown, SlidersHorizontal, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';
import InvoicePage from './InvoicePage';
import { CATEGORIES } from '../data/categoryData';
import { formatPrice, convertPrice, getCurrencySymbol } from '../utils/currencyUtils';

const MarketView = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeSubcategory, setActiveSubcategory] = useState('all');
    // Filter & Sort system
    const [showSortPanel, setShowSortPanel] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterStep, setFilterStep] = useState('main'); // main, categories, subcategories
    const [filterSelectedCat, setFilterSelectedCat] = useState(null);
    const [tempCategory, setTempCategory] = useState('all');
    const [tempSubcategories, setTempSubcategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [activeSeller, setActiveSeller] = useState('all');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({ name: 'عميل جديد', phone: '0551234567', address: '', city: 'الرياض', notes: '' });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [placing, setPlacing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponValid, setCouponValid] = useState(null);
    const [couponChecking, setCouponChecking] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailQty, setDetailQty] = useState(1);
    const bannerTimer = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/market/products`)
            .then(res => res.json())
            .then(data => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));

        fetch(`${API_BASE}/admin/cms/banners`)
            .then(res => res.json())
            .then(data => setBanners(data.filter(b => b.active)))
            .catch(() => { });

        const saved = localStorage.getItem('sukarak_cart');
        if (saved) setCart(JSON.parse(saved));
        const savedFavs = localStorage.getItem('sukarak_favs');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            bannerTimer.current = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 4000);
            return () => clearInterval(bannerTimer.current);
        }
    }, [banners]);

    useEffect(() => {
        localStorage.setItem('sukarak_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('sukarak_favs', JSON.stringify(favorites));
    }, [favorites]);

    const categories = CATEGORIES;

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            if (exists) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { id: product.id, title: product.title, price: Number(product.offer_price) > 0 ? Number(product.offer_price) : Number(product.price), img_url: product.img_url, qty: 1 }];
        });
    };

    const updateCartQty = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = i.qty + delta;
                return newQty > 0 ? { ...i, qty: newQty } : i;
            }
            return i;
        }).filter(i => i.qty > 0));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

    const toggleFav = (id) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponChecking(true);
        try {
            const res = await fetch(`${API_BASE}/market/coupons/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coupon_code: couponCode.trim(), user_id: 1 }),
            });
            if (res.ok) {
                const data = await res.json();
                setCouponDiscount(data.discount || 0);
                setCouponValid(true);
            } else {
                setCouponDiscount(0);
                setCouponValid(false);
            }
        } catch { setCouponValid(false); }
        setCouponChecking(false);
    };

    const discountAmount = couponValid ? cartTotal * couponDiscount / 100 : 0;
    const finalTotal = cartTotal - discountAmount;

    const placeOrder = async () => {
        setPlacing(true);
        try {
            const res = await fetch(`${API_BASE}/market/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
                    payment_method: paymentMethod,
                    shipping_name: shippingInfo.name,
                    shipping_phone: shippingInfo.phone,
                    shipping_address: `${shippingInfo.address}, ${shippingInfo.city}`,
                    notes: shippingInfo.notes,
                    coupon_code: couponValid ? couponCode.trim() : null,
                }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOrderSuccess({ ...data.order, cartSnapshot: [...cart], payment: paymentMethod, shipping: { ...shippingInfo } });
                setCart([]);
                setCheckoutStep(3); // Move to invoice
            }
        } catch (err) { console.error(err); }
        setPlacing(false);
    };

    const filteredProducts = products.filter(p => {
        const matchCat = activeCategory === 'all' || p.category === activeCategory;
        const matchSub = activeSubcategory === 'all' || tempSubcategories.length === 0 || tempSubcategories.includes(p.sub_category);
        const matchSearch = !searchQuery || (p.title && p.title.includes(searchQuery));
        const matchSeller = activeSeller === 'all' || p.seller === activeSeller;
        return matchCat && matchSub && matchSearch && matchSeller;
    }).sort((a, b) => {
        if (sortBy === 'price_high') return Number(b.price) - Number(a.price);
        if (sortBy === 'price_low') return Number(a.price) - Number(b.price);
        if (sortBy === 'offers') return (Number(b.offer_price) > 0 ? 1 : 0) - (Number(a.offer_price) > 0 ? 1 : 0);
        return (b.id || 0) - (a.id || 0); // newest
    });

    const uniqueSellers = [...new Set(products.map(p => p.seller).filter(Boolean))];

    const activeFilterCount = (activeCategory !== 'all' ? 1 : 0) + (tempSubcategories.length > 0 ? 1 : 0) + (activeSeller !== 'all' ? 1 : 0);

    const openFilter = () => {
        setFilterStep('main');
        setFilterSelectedCat(null);
        setShowFilterPanel(true);
    };

    const applyFilter = (catId, subs) => {
        setActiveCategory(catId || 'all');
        setActiveSubcategory('all');
        setTempSubcategories(subs || []);
        setShowFilterPanel(false);
    };

    const resetFilter = () => {
        setActiveCategory('all');
        setActiveSubcategory('all');
        setTempSubcategories([]);
        setFilterSelectedCat(null);
        setFilterStep('main');
        setSortBy('newest');
        setActiveSeller('all');
        setShowFilterPanel(false);
    };

    const getCartItemQty = (id) => {
        const item = cart.find(i => i.id === id);
        return item ? item.qty : 0;
    };

    return (
        <div className="space-y-5 pb-36">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowCart(true)} className="relative bg-white border border-gray-100 p-2.5 rounded-2xl shadow-sm active:scale-95 transition">
                        <ShoppingCart className="w-5 h-5 text-primary-dark" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">{cartCount}</span>
                        )}
                    </button>
                    <button className="bg-white border border-gray-100 p-2.5 rounded-2xl shadow-sm active:scale-95 transition">
                        <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                </div>
                <h2 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'المتجر' : 'Store'}</h2>
                <button className="bg-white border border-gray-100 p-2.5 rounded-2xl shadow-sm active:scale-95 transition">
                    <Search className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm outline-none focus:border-emerald-300 transition shadow-sm"
                />
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            if (activeCategory === cat.id) {
                                setActiveCategory('all');
                                setActiveSubcategory('all');
                                setTempSubcategories([]);
                            } else {
                                setActiveCategory(cat.id);
                                setActiveSubcategory('all');
                                setTempSubcategories([]);
                            }
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all ${activeCategory === cat.id
                            ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg scale-[1.02]'
                            : 'bg-white border border-gray-100 text-gray-600 shadow-sm hover:shadow-md'
                            }`}
                    >
                        <span className="text-3xl">{cat.emoji}</span>
                        <span className="font-black text-xs">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Active Filter Info */}
            <div className="flex items-center justify-between">
                <h3 className="font-black text-primary-dark text-sm flex items-center gap-2">
                    <span>🛍️</span>
                    {activeCategory === 'all'
                        ? (lang === 'ar' ? 'كل المنتجات' : 'All Products')
                        : categories.find(c => c.id === activeCategory)?.label
                    }
                    <span className="text-white/40 text-xs font-bold">({filteredProducts.length})</span>
                </h3>
                {activeCategory !== 'all' && (
                    <button onClick={() => { setActiveCategory('all'); setActiveSubcategory('all'); setTempSubcategories([]); }} className="text-[10px] text-primary-emerald font-black bg-emerald-50 px-3 py-1 rounded-full">
                        {lang === 'ar' ? 'عرض الكل' : 'Show All'}
                    </button>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-3 rounded-3xl animate-pulse h-60" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map(product => {
                        const inCart = getCartItemQty(product.id);
                        const hasOffer = Number(product.offer_price) > 0;
                        const displayPrice = hasOffer ? Number(product.offer_price) : Number(product.price);
                        return (
                            <div key={product.id}
                                onClick={() => { setSelectedProduct(product); setDetailQty(1); }}
                                className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50 flex flex-col gap-2 relative cursor-pointer active:scale-[0.97] transition-transform"
                            >
                                {/* Fav button */}
                                <button onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} className="absolute top-4 right-4 z-10">
                                    <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                                </button>
                                {hasOffer && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10">
                                        {Math.round((1 - Number(product.offer_price) / Number(product.price)) * 100)}% {lang === 'ar' ? 'خصم' : 'OFF'}
                                    </span>
                                )}
                                <img src={product.img_url || '/logo.png'} alt={product.title} className="w-full h-32 object-contain rounded-2xl bg-gray-50" />
                                <h4 className="font-bold text-sm text-primary-dark line-clamp-2 leading-tight">{product.title}</h4>
                                {product.seller && (
                                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 -mt-1">
                                        <span className="inline-block w-3.5 h-3.5 bg-primary-emerald/10 rounded text-center leading-[14px] text-[8px]">🏪</span>
                                        {product.seller}
                                    </p>
                                )}
                                <div className="flex justify-between items-center mt-auto">
                                    <div>
                                        <p className="text-primary-emerald font-black text-sm">{formatPrice(displayPrice, lang)}</p>
                                        {hasOffer && <p className="text-gray-400 text-[10px] line-through">{formatPrice(Number(product.price), lang)}</p>}
                                    </div>
                                    {inCart > 0 ? (
                                        <div className="flex items-center gap-1.5 bg-primary-emerald/10 rounded-xl px-2 py-1">
                                            <button onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, -1); }} className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm"><Minus className="w-3 h-3 text-primary-dark" /></button>
                                            <span className="font-black text-xs text-primary-dark min-w-[16px] text-center">{inCart}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, 1); }} className="w-6 h-6 rounded-lg bg-primary-emerald flex items-center justify-center shadow-sm"><Plus className="w-3 h-3 text-white" /></button>
                                        </div>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            className="bg-primary-dark text-white p-2.5 rounded-xl active:scale-90 transition-transform">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {showCart && (
                    <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowCart(false)}>
                        <div className="bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-primary-dark">{lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</h3>
                                <X onClick={() => setShowCart(false)} className="w-6 h-6 text-gray-400 cursor-pointer" />
                            </div>
                            {cart.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 font-bold">{lang === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <img src={item.img_url} alt="" className="w-12 h-12 object-cover rounded-xl" />
                                                <div>
                                                    <p className="font-bold text-xs">{item.title}</p>
                                                    <p className="text-[10px] text-primary-emerald font-black">{formatPrice(item.price, lang)} x {item.qty}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Minus onClick={() => updateCartQty(item.id, -1)} className="w-4 h-4 text-gray-400 cursor-pointer" />
                                                <span className="font-black text-sm">{item.qty}</span>
                                                <Plus onClick={() => updateCartQty(item.id, 1)} className="w-4 h-4 text-gray-400 cursor-pointer" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between font-black text-lg mb-4">
                                            <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                            <span>{cartTotal} SAR</span>
                                        </div>
                                        <button onClick={() => { setShowCart(false); setCheckoutStep(1); setShowCheckout(true); }} className="w-full bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg">
                                            {lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCheckout && (
                    <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => { if (checkoutStep < 3) setShowCheckout(false); }}>
                        <div className="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            {/* Step indicator */}
                            <div className="sticky top-0 bg-white z-10 p-5 border-b border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-black text-primary-dark">
                                        {checkoutStep === 1 && (lang === 'ar' ? '📦 بيانات الشحن' : '📦 Shipping')}
                                        {checkoutStep === 2 && (lang === 'ar' ? '💳 الدفع' : '💳 Payment')}
                                        {checkoutStep === 3 && (lang === 'ar' ? '🧾 الفاتورة' : '🧾 Invoice')}
                                    </h3>
                                    {checkoutStep < 3 && <X onClick={() => setShowCheckout(false)} className="w-6 h-6 text-gray-400 cursor-pointer" />}
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(s => (
                                        <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= checkoutStep ? 'bg-primary-emerald' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Step 1: Shipping */}
                                {checkoutStep === 1 && (
                                    <>
                                        <input placeholder={lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'} value={shippingInfo.name} onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-primary-emerald" />
                                        <input placeholder={lang === 'ar' ? 'رقم الجوال *' : 'Phone *'} value={shippingInfo.phone} onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-primary-emerald" />
                                        <input placeholder={lang === 'ar' ? 'العنوان *' : 'Address *'} value={shippingInfo.address} onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-primary-emerald" />
                                        <input placeholder={lang === 'ar' ? 'المدينة' : 'City'} value={shippingInfo.city} onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-primary-emerald" />
                                        <textarea placeholder={lang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'} value={shippingInfo.notes} onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                                            rows={2} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-primary-emerald resize-none" />
                                        <button onClick={() => setCheckoutStep(2)} disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address}
                                            className="w-full bg-primary-dark text-white py-4 rounded-2xl font-black shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                            {lang === 'ar' ? 'التالي → الدفع' : 'Next → Payment'}
                                        </button>
                                    </>
                                )}

                                {/* Step 2: Payment */}
                                {checkoutStep === 2 && (
                                    <>
                                        {/* Order Summary */}
                                        <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                                            <p className="font-black text-sm text-gray-600 mb-3">{lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</p>
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between text-xs">
                                                    <span className="text-gray-500">{item.title} × {item.qty}</span>
                                                    <span className="font-black text-gray-700">{formatPrice(item.price * item.qty, lang)}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-gray-200 pt-2 mt-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                                    <span className="font-bold">{formatPrice(cartTotal, lang)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">{lang === 'ar' ? 'ضريبة (15%)' : 'VAT (15%)'}</span>
                                                    <span className="font-bold">{formatPrice(cartTotal * 0.15, lang)}</span>
                                                </div>
                                                {couponValid && couponDiscount > 0 && (
                                                    <div className="flex justify-between text-xs text-emerald-600">
                                                        <span>{lang === 'ar' ? 'خصم الكوبون' : 'Coupon Discount'}</span>
                                                        <span className="font-bold">-{formatPrice(discountAmount, lang)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm font-black pt-2 text-primary-dark">
                                                    <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                                    <span>{formatPrice(finalTotal + cartTotal * 0.15, lang)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coupon */}
                                        <div className="flex gap-2">
                                            <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder={lang === 'ar' ? 'كود الخصم' : 'Coupon Code'}
                                                className="flex-1 bg-gray-50 p-3 rounded-xl outline-none text-sm font-bold" />
                                            <button onClick={applyCoupon} disabled={couponChecking || !couponCode.trim()}
                                                className="bg-primary-dark text-white px-5 rounded-xl font-bold text-xs disabled:opacity-50">
                                                {couponChecking ? '...' : (lang === 'ar' ? 'تطبيق' : 'Apply')}
                                            </button>
                                        </div>
                                        {couponValid === true && <p className="text-xs text-emerald-500 font-bold">✅ {lang === 'ar' ? `كوبون صالح! خصم ${couponDiscount}%` : `Valid! ${couponDiscount}% off`}</p>}
                                        {couponValid === false && <p className="text-xs text-red-500 font-bold">❌ {lang === 'ar' ? 'كوبون غير صالح' : 'Invalid coupon'}</p>}

                                        {/* Payment Method */}
                                        <p className="font-black text-sm text-gray-600">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'card', label: lang === 'ar' ? 'بطاقة بنكية' : 'Card', icon: '💳' },
                                                { id: 'cod', label: lang === 'ar' ? 'عند الاستلام' : 'COD', icon: '💵' },
                                                { id: 'wallet', label: lang === 'ar' ? 'المحفظة' : 'Wallet', icon: '👛' },
                                            ].map(pm => (
                                                <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                                                    className={`py-4 rounded-2xl text-center transition-all ${paymentMethod === pm.id ? 'bg-primary-dark text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-500'}`}>
                                                    <span className="text-2xl block mb-1">{pm.icon}</span>
                                                    <span className="text-[10px] font-black">{pm.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button onClick={() => setCheckoutStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">
                                                {lang === 'ar' ? '← رجوع' : '← Back'}
                                            </button>
                                            <button onClick={placeOrder} disabled={placing}
                                                className="flex-[2] bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg disabled:opacity-50 active:scale-[0.98] transition">
                                                {placing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (lang === 'ar' ? 'تأكيد الدفع' : 'Confirm Payment')}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Professional Invoice */}
                                {checkoutStep === 3 && orderSuccess && (
                                    <>
                                        <div className="text-center py-4">
                                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Check className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <h2 className="text-xl font-black text-primary-dark">{lang === 'ar' ? 'تم الطلب بنجاح!' : 'Order Placed!'}</h2>
                                            <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? 'فاتورتك جاهزة' : 'Your invoice is ready'}</p>
                                        </div>

                                        {/* Professional Invoice */}
                                        <InvoicePage
                                            embedded={true}
                                            order={{
                                                order_number: orderSuccess.order_number,
                                                created_at: new Date().toISOString(),
                                                status: 'confirmed',
                                                subtotal: orderSuccess.subtotal || orderSuccess.cartSnapshot?.reduce((s, i) => s + i.price * i.qty, 0),
                                                total: orderSuccess.total,
                                                discount: orderSuccess.discount || 0,
                                                payment_method: orderSuccess.payment,
                                            }}
                                            items={(orderSuccess.cartSnapshot || []).map(item => ({
                                                title: item.title,
                                                sku: '',
                                                price: item.price,
                                                offer_price: 0,
                                                qty: item.qty,
                                            }))}
                                            buyer={{
                                                name: orderSuccess.shipping?.name || '',
                                                phone: orderSuccess.shipping?.phone || '',
                                                address: orderSuccess.shipping?.address || '',
                                            }}
                                        />

                                        <div className="flex gap-3 pt-4">
                                            <button onClick={() => { setOrderSuccess(null); setShowCheckout(false); setCheckoutStep(1); navigate('/my-orders'); }}
                                                className="flex-1 bg-primary-emerald text-white py-4 rounded-2xl font-black shadow-lg active:scale-[0.98] transition">
                                                📋 {lang === 'ar' ? 'عرض طلباتي' : 'My Orders'}
                                            </button>
                                            <button onClick={() => { setOrderSuccess(null); setShowCheckout(false); setCheckoutStep(1); }}
                                                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black">
                                                {lang === 'ar' ? 'متابعة التسوق' : 'Continue'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════ FLOATING CART BUTTON ═══════ */}
            <AnimatePresence>
                {cartCount > 0 && !showCart && !showCheckout && !selectedProduct && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        onClick={() => setShowCart(true)}
                        className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-[950] bg-gradient-to-l from-primary-emerald to-teal-600 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-300/40 flex items-center gap-3 active:scale-95 transition-transform"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                        </div>
                        <span className="font-black text-sm">{lang === 'ar' ? 'عرض السلة' : 'View Cart'}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-black">{formatPrice(cartTotal, lang)}</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ═══════ FIXED BOTTOM FILTER BAR ═══════ */}
            <div className="fixed bottom-[70px] left-4 right-4 z-[900] flex gap-2">
                <button
                    onClick={() => setShowSortPanel(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-orange-200/50 active:scale-[0.97] transition-transform"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    {lang === 'ar' ? 'الترتيب' : 'Sort'}
                </button>
                <button
                    onClick={openFilter}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-primary-emerald to-teal-600 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200/50 active:scale-[0.97] transition-transform relative"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {lang === 'ar' ? 'التصنيف' : 'Filter'}
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
                    )}
                </button>
            </div>

            {/* ═══════ SORT PANEL ═══════ */}
            <AnimatePresence>
                {showSortPanel && (
                    <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowSortPanel(false)}>
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-t-3xl p-6 pb-8"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
                            <h3 className="font-black text-lg text-primary-dark mb-5 flex items-center gap-2">
                                <ArrowUpDown className="w-5 h-5 text-amber-500" />
                                {lang === 'ar' ? 'الترتيب' : 'Sort By'}
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { value: 'newest', label: lang === 'ar' ? 'الأحدث' : 'Newest', icon: '🆕' },
                                    { value: 'popular', label: lang === 'ar' ? 'الأكثر طلبًا' : 'Most Popular', icon: '🔥' },
                                    { value: 'price_high', label: lang === 'ar' ? 'السعر من الأعلى إلى الأقل' : 'Price: High to Low', icon: '💰' },
                                    { value: 'price_low', label: lang === 'ar' ? 'السعر من الأقل إلى الأعلى' : 'Price: Low to High', icon: '🏷️' },
                                    { value: 'offers', label: lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers', icon: '⭐' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSortBy(opt.value); setShowSortPanel(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${sortBy === opt.value
                                            ? 'bg-primary-emerald/10 border-2 border-primary-emerald'
                                            : 'bg-gray-50 border-2 border-transparent'
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortBy === opt.value ? 'border-primary-emerald bg-primary-emerald' : 'border-gray-300'
                                            }`}>
                                            {sortBy === opt.value && <span className="w-2 h-2 bg-white rounded-full" />}
                                        </span>
                                        <span className="text-lg">{opt.icon}</span>
                                        <span className={`font-bold text-sm ${sortBy === opt.value ? 'text-primary-emerald' : 'text-gray-600'}`}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════ FILTER PANEL (Multi-Step) ═══════ */}
            <AnimatePresence>
                {showFilterPanel && (
                    <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowFilterPanel(false)}>
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 pb-0">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        {filterStep !== 'main' && (
                                            <button onClick={() => {
                                                if (filterStep === 'subcategories') setFilterStep('categories');
                                                else if (filterStep === 'categories' || filterStep === 'sellers') setFilterStep('main');
                                                else setFilterStep('main');
                                            }} className="p-1.5 rounded-xl bg-gray-100">
                                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                            </button>
                                        )}
                                        <h3 className="font-black text-lg text-primary-dark flex items-center gap-2">
                                            <SlidersHorizontal className="w-5 h-5 text-primary-emerald" />
                                            {filterStep === 'main' ? (lang === 'ar' ? 'التصنيف' : 'Filter') :
                                                filterStep === 'categories' ? (lang === 'ar' ? 'تصنيف حسب الإستخدام' : 'By Usage') :
                                                    filterStep === 'sellers' ? (lang === 'ar' ? 'تصنيف حسب البائع' : 'By Seller') :
                                                        filterSelectedCat?.label || ''}
                                        </h3>
                                    </div>
                                    <button onClick={() => setShowFilterPanel(false)} className="p-2 rounded-xl bg-gray-100">
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6">
                                {/* STEP 1: Filter types */}
                                {filterStep === 'main' && (
                                    <div className="space-y-3 pb-4">
                                        {[
                                            { key: 'usage', label: lang === 'ar' ? 'تصنيف حسب الإستخدام' : 'Category by Usage', icon: '🏷️', desc: lang === 'ar' ? '6 أقسام رئيسية' : '6 main categories' },
                                            { key: 'brand', label: lang === 'ar' ? 'تصنيف حسب الشركة' : 'Category by Brand', icon: '🏢', desc: lang === 'ar' ? 'حسب الشركة المصنعة' : 'By manufacturer' },
                                            { key: 'seller', label: lang === 'ar' ? 'تصنيف حسب البائع' : 'Category by Seller', icon: '👤', desc: lang === 'ar' ? 'حسب المتجر أو البائع' : 'By store or seller' },
                                        ].map(item => (
                                            <button
                                                key={item.key}
                                                onClick={() => {
                                                    if (item.key === 'usage') setFilterStep('categories');
                                                    if (item.key === 'seller' || item.key === 'brand') setFilterStep('sellers');
                                                }}
                                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98] border border-gray-100"
                                            >
                                                <span className="text-2xl">{item.icon}</span>
                                                <div className="flex-1 text-right">
                                                    <p className="font-black text-sm text-primary-dark">{item.label}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{item.desc}</p>
                                                </div>
                                                <ChevronLeft className="w-4 h-4 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* STEP 2: 6 Categories */}
                                {filterStep === 'categories' && (
                                    <div className="space-y-2 pb-4">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setFilterSelectedCat(cat);
                                                    setFilterStep('subcategories');
                                                }}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] border ${activeCategory === cat.id
                                                    ? 'bg-primary-emerald/10 border-primary-emerald/30'
                                                    : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span className="text-2xl">{cat.emoji}</span>
                                                <div className="flex-1 text-right">
                                                    <p className="font-black text-sm text-primary-dark">{cat.label}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{cat.subcategories?.length || 0} {lang === 'ar' ? 'قسم فرعي' : 'subcategories'}</p>
                                                </div>
                                                {activeCategory === cat.id && <Check className="w-5 h-5 text-primary-emerald" />}
                                                <ChevronLeft className="w-4 h-4 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* STEP 3: Subcategories with checkboxes */}
                                {filterStep === 'subcategories' && filterSelectedCat && (
                                    <div className="space-y-2 pb-4">
                                        {/* Select All */}
                                        <button
                                            onClick={() => {
                                                if (tempSubcategories.length === filterSelectedCat.subcategories?.length) {
                                                    setTempSubcategories([]);
                                                } else {
                                                    setTempSubcategories(filterSelectedCat.subcategories?.map(s => s.id) || []);
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-primary-emerald/5 border border-primary-emerald/20"
                                        >
                                            <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${tempSubcategories.length === filterSelectedCat.subcategories?.length
                                                ? 'bg-primary-emerald border-primary-emerald' : 'border-gray-300'
                                                }`}>
                                                {tempSubcategories.length === filterSelectedCat.subcategories?.length && <Check className="w-3 h-3 text-white" />}
                                            </span>
                                            <span className="font-black text-sm text-primary-emerald">{lang === 'ar' ? 'تحديد الكل' : 'Select All'}</span>
                                        </button>

                                        {filterSelectedCat.subcategories?.map(sub => {
                                            const isChecked = tempSubcategories.includes(sub.id);
                                            return (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => {
                                                        setTempSubcategories(prev =>
                                                            isChecked ? prev.filter(s => s !== sub.id) : [...prev, sub.id]
                                                        );
                                                    }}
                                                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all border ${isChecked ? 'bg-primary-emerald/5 border-primary-emerald/20' : 'bg-gray-50 border-gray-100'
                                                        }`}
                                                >
                                                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-primary-emerald border-primary-emerald' : 'border-gray-300'
                                                        }`}>
                                                        {isChecked && <Check className="w-3 h-3 text-white" />}
                                                    </span>
                                                    <span className={`font-bold text-sm ${isChecked ? 'text-primary-dark' : 'text-gray-500'}`}>{sub.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* STEP: Sellers list */}
                                {filterStep === 'sellers' && (
                                    <div className="space-y-2 pb-4">
                                        {uniqueSellers.length === 0 ? (
                                            <p className="text-center text-gray-400 text-sm py-8">{lang === 'ar' ? 'لا يوجد بائعين' : 'No sellers found'}</p>
                                        ) : uniqueSellers.map(sellerName => {
                                            const isActive = activeSeller === sellerName;
                                            const count = products.filter(p => p.seller === sellerName).length;
                                            return (
                                                <button
                                                    key={sellerName}
                                                    onClick={() => setActiveSeller(isActive ? 'all' : sellerName)}
                                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] border ${isActive
                                                        ? 'bg-primary-emerald/10 border-primary-emerald/30'
                                                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-primary-emerald bg-primary-emerald' : 'border-gray-300'
                                                        }`}>
                                                        {isActive && <span className="w-2 h-2 bg-white rounded-full" />}
                                                    </span>
                                                    <div className="flex-1 text-right">
                                                        <p className="font-black text-sm text-primary-dark">{sellerName}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{count} {lang === 'ar' ? 'منتج' : 'products'}</p>
                                                    </div>
                                                    {isActive && <Check className="w-5 h-5 text-primary-emerald" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Bottom actions */}
                            <div className="p-6 pt-3 border-t border-gray-100 bg-white">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-gray-400 font-bold">{filteredProducts.length} {lang === 'ar' ? 'صنفاً' : 'items'}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetFilter}
                                        className="flex-1 py-3.5 rounded-2xl font-black text-sm border-2 border-gray-200 text-gray-500 active:scale-[0.97] transition-transform"
                                    >
                                        {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (filterSelectedCat) {
                                                applyFilter(filterSelectedCat.id, tempSubcategories);
                                            } else {
                                                setShowFilterPanel(false);
                                            }
                                        }}
                                        className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-primary-emerald text-white shadow-lg shadow-emerald-200/50 active:scale-[0.97] transition-transform"
                                    >
                                        {lang === 'ar' ? 'تطبيق' : 'Apply'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════ PRODUCT DETAIL MODAL ═══════ */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-sm flex flex-col justify-end" onClick={() => setSelectedProduct(null)}>
                        <motion.div
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-t-3xl max-h-[92vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Product Image */}
                            <div className="relative">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />
                                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                    <button onClick={() => toggleFav(selectedProduct.id)} className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow">
                                        <Heart className={`w-5 h-5 ${favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                    </button>
                                    <button onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: selectedProduct.title,
                                                text: `${selectedProduct.title} - ${formatPrice(Number(selectedProduct.offer_price) > 0 ? Number(selectedProduct.offer_price) : Number(selectedProduct.price), lang)}`,
                                                url: window.location.href
                                            }).catch(() => { });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert(lang === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!');
                                        }
                                    }} className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow">
                                        <Share2 className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                {Number(selectedProduct.offer_price) > 0 && (
                                    <span className="absolute top-14 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow">
                                        {Math.round((1 - Number(selectedProduct.offer_price) / Number(selectedProduct.price)) * 100)}% {lang === 'ar' ? 'خصم' : 'OFF'}
                                    </span>
                                )}
                                <img
                                    src={selectedProduct.img_url || '/logo.png'}
                                    alt={selectedProduct.title}
                                    className="w-full h-72 object-contain bg-gray-50 px-8 py-6"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-5 space-y-4">
                                {/* Title & Seller */}
                                <div>
                                    <h2 className="text-lg font-black text-primary-dark leading-tight">{selectedProduct.title}</h2>
                                    {selectedProduct.seller && (
                                        <div className="flex items-center gap-2 mt-2 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
                                            <span className="text-sm">🏪</span>
                                            <span className="text-xs font-bold text-emerald-700">{selectedProduct.seller}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price Section */}
                                <div className="flex items-end gap-3">
                                    <span className="text-2xl font-black text-primary-emerald">
                                        {formatPrice(Number(selectedProduct.offer_price) > 0 ? Number(selectedProduct.offer_price) : Number(selectedProduct.price), lang)}
                                    </span>
                                    {Number(selectedProduct.offer_price) > 0 && (
                                        <span className="text-sm text-gray-400 line-through font-bold">
                                            {formatPrice(Number(selectedProduct.price), lang)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {selectedProduct.details && (
                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <p className="text-xs font-bold text-gray-400 mb-1">{lang === 'ar' ? 'الوصف' : 'Description'}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedProduct.details}</p>
                                    </div>
                                )}

                                {/* Info Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedProduct.category && (
                                        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full">
                                            📂 {categories.find(c => c.id === selectedProduct.category)?.label || selectedProduct.category}
                                        </span>
                                    )}
                                    {selectedProduct.brand && (
                                        <span className="bg-purple-50 text-purple-600 text-[10px] font-black px-3 py-1.5 rounded-full">
                                            🏢 {selectedProduct.brand}
                                        </span>
                                    )}
                                    {selectedProduct.stock > 0 ? (
                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full">
                                            ✅ {lang === 'ar' ? 'متوفر' : 'In Stock'}
                                        </span>
                                    ) : (
                                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-full">
                                            ❌ {lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                                        </span>
                                    )}
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                                    <span className="text-sm font-black text-gray-600">{lang === 'ar' ? 'الكمية' : 'Quantity'}</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setDetailQty(q => Math.max(1, q - 1))}
                                            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-90 transition"
                                        >
                                            <Minus className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <span className="font-black text-lg text-primary-dark w-8 text-center">{detailQty}</span>
                                        <button
                                            onClick={() => setDetailQty(q => q + 1)}
                                            className="w-9 h-9 rounded-xl bg-primary-emerald flex items-center justify-center shadow-sm active:scale-90 transition"
                                        >
                                            <Plus className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pb-4">
                                    <button
                                        onClick={() => {
                                            for (let i = 0; i < detailQty; i++) addToCart(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        disabled={selectedProduct.stock <= 0}
                                        className="flex-1 bg-gray-100 text-primary-dark py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-40"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            for (let i = 0; i < detailQty; i++) addToCart(selectedProduct);
                                            setSelectedProduct(null);
                                            setCheckoutStep(1);
                                            setShowCheckout(true);
                                        }}
                                        disabled={selectedProduct.stock <= 0}
                                        className="flex-1 bg-gradient-to-l from-primary-emerald to-teal-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 active:scale-[0.97] transition-transform disabled:opacity-40"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        {lang === 'ar' ? 'اشتر الآن' : 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarketView;
