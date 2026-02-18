import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Check, X, AlertTriangle, ChevronDown, Leaf, Apple, Flame, Wheat, Droplets, Info, Cookie, Filter, Sparkles, Activity, TrendingUp, ArrowUpDown, ShoppingCart, Trash2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';

const API = `${API_BASE}/health`;

const FoodsView = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('classification');
    const [foodTypes, setFoodTypes] = useState([]);
    const [foodClasses, setFoodClasses] = useState([]);
    const [activeClass, setActiveClass] = useState('أطعمة مسموحة');
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [nutritionFoods, setNutritionFoods] = useState([]);
    const [nutritionCats, setNutritionCats] = useState([]);
    const [nutritionCat, setNutritionCat] = useState('all');
    const [nutritionSelected, setNutritionSelected] = useState(null);
    const [giSearchQuery, setGiSearchQuery] = useState('');
    const [selectedMeals, setSelectedMeals] = useState([]);

    const toggleMealSelection = (food) => {
        setSelectedMeals(prev => {
            const exists = prev.find(f => f.id === food.id);
            if (exists) return prev.filter(f => f.id !== food.id);
            return [...prev, { id: food.id, name: food.name, type: food.type, calories: food.calories || 0 }];
        });
    };

    const isSelected = (foodId) => selectedMeals.some(f => f.id === foodId);

    const sendToMealTracker = () => {
        const mealText = selectedMeals.map(f => f.name).join('، ');
        const totalCal = selectedMeals.reduce((sum, f) => sum + (f.calories || 0), 0);
        localStorage.setItem('selectedMeals', JSON.stringify({ contents: mealText, calories: totalCal }));
        setSelectedMeals([]);
        navigate('/health-tracking?tab=meals');
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`${API}/food-types`).then(r => r.json()).catch(() => []),
            fetch(`${API}/food-types/classes`).then(r => r.json()).catch(() => []),
            fetch(`${API}/foods`).then(r => r.json()).catch(() => []),
            fetch(`${API}/foods/categories`).then(r => r.json()).catch(() => []),
        ]).then(([types, classes, nutrition, cats]) => {
            setFoodTypes(types);
            setFoodClasses(classes);
            setNutritionFoods(nutrition);
            setNutritionCats(cats);
            if (classes.length > 0 && !classes.includes(activeClass)) {
                setActiveClass(classes[0]);
            }
            setLoading(false);
        });
    }, []);

    const classItems = foodTypes.filter(f => f.class === activeClass);
    const classCategories = [...new Set(classItems.map(f => f.type).filter(Boolean))];

    const filteredItems = classItems.filter(f => {
        const matchCat = activeCategory === 'all' || f.type === activeCategory;
        const matchSearch = !searchQuery || f.name.includes(searchQuery);
        return matchCat && matchSearch;
    });

    const grouped = {};
    filteredItems.forEach(f => {
        if (!grouped[f.type]) grouped[f.type] = [];
        grouped[f.type].push(f);
    });

    const classConfig = {
        'أطعمة مسموحة': { color: 'emerald', icon: Check, emoji: '✅', bg: 'from-emerald-500 to-green-600', lightBg: 'from-emerald-50 to-green-50', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200', dot: 'bg-emerald-400' },
        'أطعمة ممنوعة': { color: 'red', icon: X, emoji: '🚫', bg: 'from-red-500 to-rose-600', lightBg: 'from-red-50 to-rose-50', badge: 'bg-red-100 text-red-700', ring: 'ring-red-200', dot: 'bg-red-400' },
        'سناكات مسموحة': { color: 'teal', icon: Check, emoji: '🍿✅', bg: 'from-teal-500 to-cyan-600', lightBg: 'from-teal-50 to-cyan-50', badge: 'bg-teal-100 text-teal-700', ring: 'ring-teal-200', dot: 'bg-teal-400' },
        'سناكات ممنوعة': { color: 'rose', icon: X, emoji: '🍿🚫', bg: 'from-rose-500 to-pink-600', lightBg: 'from-rose-50 to-pink-50', badge: 'bg-rose-100 text-rose-700', ring: 'ring-rose-200', dot: 'bg-rose-400' },
        'أطعمة مسموحة بكميات قليلة': { color: 'amber', icon: AlertTriangle, emoji: '⚠️', bg: 'from-amber-500 to-orange-500', lightBg: 'from-amber-50 to-orange-50', badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200', dot: 'bg-amber-400' },
    };

    const categoryIcons = {
        'الفواكه': '🍎', 'الخضروات': '🥦', 'الحبوب والبذور': '🌾', 'البقوليات': '🫘',
        'اللحوم': '🥩', 'الأسماك': '🐟', 'أسماك': '🐟', 'منتجات البيض': '🥚', 'البيض': '🥚',
        'سناكس': '🍿', 'الإسناكات': '🍿', 'المشروبات والعصائر': '🥤',
        'المكسرات': '🥜', 'منتجات الالبان': '🥛', 'مشتقات الألبان': '🥛',
        'الاجبان': '🧀', 'الأجبان': '🧀', 'المقبلات': '🥗', 'الشوربات': '🍲',
        'المكرونات': '🍝', 'المخبوزات': '🥖', 'السكريات والحلويات': '🍰', 'السكريات': '🍰',
        'الزيوت والدهون': '🧈', 'الأعشاب والتوابل': '🌿', 'اخري': '📦',
    };

    const getGlycemicColor = (gi) => {
        const val = parseInt(gi);
        if (isNaN(val)) return { text: 'text-gray-400', bg: 'bg-gray-100', ring: 'ring-gray-200' };
        if (val <= 55) return { text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' };
        if (val <= 69) return { text: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' };
        return { text: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200' };
    };

    const getGlycemicLabel = (gi) => {
        const val = parseInt(gi);
        if (isNaN(val)) return 'غير محدد';
        if (val <= 55) return 'منخفض ✓';
        if (val <= 69) return 'متوسط ⚡';
        return 'مرتفع ⚠️';
    };

    const currentConfig = classConfig[activeClass] || classConfig['أطعمة مسموحة'];

    return (
        <div className="space-y-4 pb-32">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
                        <ArrowRight className={`w-5 h-5 text-gray-500`} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-primary-dark flex items-center gap-2">
                            <span className="text-2xl">🥗</span> دليل الأطعمة
                        </h2>
                        <p className="text-[10px] text-gray-400 mt-0.5">دليلك الشامل للتغذية الصحية</p>
                    </div>
                </div>
            </div>

            <div className="relative bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex relative">
                    <motion.div
                        className="absolute top-0 bottom-0 bg-gradient-to-l from-primary-dark to-primary-emerald rounded-xl shadow-lg"
                        animate={{ right: activeTab === 'classification' || activeTab === 'glycemic' ? '0%' : '50%' }}
                        style={{ width: '50%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <button onClick={() => setActiveTab('classification')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 flex items-center justify-center gap-2 ${activeTab === 'classification' || activeTab === 'glycemic' ? 'text-white' : 'text-gray-400'}`}>
                        <span className="text-base">🏷️</span> مسموح / ممنوع
                    </button>
                    <button onClick={() => setActiveTab('nutrition')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all relative z-10 flex items-center justify-center gap-2 ${activeTab === 'nutrition' ? 'text-white' : 'text-gray-400'}`}>
                        <span className="text-base">📊</span> القيم الغذائية
                    </button>
                </div>
            </div>

            {(activeTab === 'classification' || activeTab === 'glycemic') && (
                <>
                    {activeTab === 'classification' && (
                        <motion.div
                            key={activeClass}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-gradient-to-br ${currentConfig.bg} p-5 rounded-3xl text-white relative overflow-hidden`}>
                            <div className="absolute -top-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
                            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/5 rounded-full" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                                    <span className="text-4xl">{currentConfig.emoji}</span>
                                </div>
                                <div>
                                    <p className="font-black text-lg leading-tight">{activeClass}</p>
                                    <p className="text-white/70 text-xs mt-1">{filteredItems.length} صنف متاح</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4 relative z-10">
                                <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                    <Filter className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">{classCategories.length} فئة</span>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">{filteredItems.length} صنف</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        {foodClasses.map((cls, idx) => {
                            const cfg = classConfig[cls] || classConfig['أطعمة مسموحة'];
                            const isActive = activeClass === cls && activeTab === 'classification';
                            const buttons = [(
                                <motion.button key={cls}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setActiveClass(cls); setActiveCategory('all'); setActiveTab('classification'); }}
                                    className={`px-3 py-2.5 rounded-2xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 text-center
                                    ${isActive
                                            ? `bg-gradient-to-l ${cfg.bg} text-white shadow-lg`
                                            : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'}`}>
                                    <span>{cfg.emoji}</span>
                                    <span className="leading-tight">{cls}</span>
                                </motion.button>
                            )];
                            if (cls === 'أطعمة مسموحة') {
                                buttons.push(
                                    <motion.button key="gi-btn"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTab('glycemic')}
                                        className={`px-3 py-2.5 rounded-2xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 text-center
                                        ${activeTab === 'glycemic'
                                                ? 'bg-gradient-to-l from-violet-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                                                : 'bg-white text-gray-500 border border-gray-100'}`}>
                                        <span>📉</span>
                                        <span className="leading-tight">المؤشر الجلايسيمي</span>
                                    </motion.button>
                                );
                            }
                            return buttons;
                        })}
                    </div>

                    {activeTab === 'classification' && (
                        <>
                            <div className="bg-white flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-sm border border-gray-100">
                                <Search className="w-5 h-5 text-gray-300" />
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="🔍 بحث عن طعام..." className="bg-transparent outline-none text-sm w-full placeholder:text-gray-300" />
                            </div>



                            <div className="space-y-5">
                                {Object.entries(grouped).map(([cat, items]) => (
                                    <motion.div key={cat} className="space-y-2.5">
                                        <div className="flex items-center gap-2.5 px-1">
                                            <h3 className="font-black text-sm text-primary-dark flex-1">{cat}</h3>
                                            <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{items.length}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {items.map((food, i) => (
                                                <div key={food.id} onClick={() => toggleMealSelection(food)}
                                                    className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected(food.id) ? 'border-emerald-400 bg-emerald-50' : 'border-gray-50'}`}>
                                                    <p className="text-xs font-bold text-gray-700">{food.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'glycemic' && (
                        <div className="space-y-4">
                            <div className="bg-white flex items-center gap-3 px-4 py-3.5 rounded-2xl border">
                                <Search className="w-5 h-5 text-gray-300" />
                                <input type="text" value={giSearchQuery} onChange={e => setGiSearchQuery(e.target.value)}
                                    placeholder="🔍 بحث..." className="bg-transparent outline-none text-sm w-full" />
                            </div>
                            {nutritionFoods.filter(f => f.glycemic_index && f.name.includes(giSearchQuery)).sort((a, b) => a.glycemic_index - b.glycemic_index).map(food => {
                                const giColors = getGlycemicColor(food.glycemic_index);
                                return (
                                    <div key={food.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">{food.name}</p>
                                            <p className="text-[10px] text-gray-400">{food.serving}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-xl text-center ${giColors.bg} ${giColors.text}`}>
                                            <p className="text-xs font-black">{food.glycemic_index}</p>
                                            <p className="text-[8px] font-bold">{getGlycemicLabel(food.glycemic_index)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'nutrition' && (
                <div className="space-y-4">
                    <div className="bg-white flex items-center gap-3 px-4 py-3.5 rounded-2xl border">
                        <Search className="w-5 h-5 text-gray-300" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="🔍 بحث..." className="bg-transparent outline-none text-sm w-full" />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button onClick={() => setNutritionCat('all')}
                            className={`whitespace-nowrap px-4 py-2 rounded-2xl font-bold text-xs ${nutritionCat === 'all' ? 'bg-primary-dark text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                            🛍️ الكل
                        </button>
                        {nutritionCats.map(cat => (
                            <button key={cat} onClick={() => setNutritionCat(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-2xl font-bold text-xs ${nutritionCat === cat ? 'bg-primary-dark text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                {categoryIcons[cat] || '🍱'} {cat}
                            </button>
                        ))}
                    </div>

                    {nutritionFoods.filter(f => {
                        const matchCat = nutritionCat === 'all' || f.type === nutritionCat;
                        const matchSearch = !searchQuery || f.name.includes(searchQuery);
                        return matchCat && matchSearch;
                    }).map(food => (
                        <motion.div key={food.id}
                            onClick={() => setNutritionSelected(nutritionSelected?.id === food.id ? null : food)}
                            className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${nutritionSelected?.id === food.id ? 'border-emerald-300 shadow-lg shadow-emerald-100' : 'border-gray-100'}`}>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-primary-dark">{food.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{food.serving}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${nutritionSelected?.id === food.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            {/* Always show 4 values */}
                            <div className="grid grid-cols-4 gap-1 px-3 pb-3">
                                <div className="bg-orange-50 rounded-xl p-2 text-center">
                                    <Flame className="w-3.5 h-3.5 text-orange-500 mx-auto mb-0.5" />
                                    <p className="text-[10px] font-black text-orange-600">{food.calories || '—'}</p>
                                    <p className="text-[7px] text-orange-400 font-bold">سعرات</p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-2 text-center">
                                    <Wheat className="w-3.5 h-3.5 text-amber-500 mx-auto mb-0.5" />
                                    <p className="text-[10px] font-black text-amber-600">{food.carb || '—'}</p>
                                    <p className="text-[7px] text-amber-400 font-bold">كربوهيدرات</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-2 text-center">
                                    <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                                    <p className="text-[10px] font-black text-blue-600">{food.protein || '—'}</p>
                                    <p className="text-[7px] text-blue-400 font-bold">بروتين</p>
                                </div>
                                <div className="bg-rose-50 rounded-xl p-2 text-center">
                                    <Cookie className="w-3.5 h-3.5 text-rose-500 mx-auto mb-0.5" />
                                    <p className="text-[10px] font-black text-rose-600">{food.fats || '—'}</p>
                                    <p className="text-[7px] text-rose-400 font-bold">دهون</p>
                                </div>
                            </div>
                            {/* Expanded details */}
                            <AnimatePresence>
                                {nutritionSelected?.id === food.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100 overflow-hidden">
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{categoryIcons[food.type] || '🍱'}</span>
                                                <span className="text-xs font-bold text-gray-500">{food.type}</span>
                                            </div>
                                            {food.glycemic_index && (
                                                <div className={`flex items-center justify-between p-3 rounded-xl ${getGlycemicColor(food.glycemic_index).bg}`}>
                                                    <span className="text-xs font-bold">المؤشر الجلايسيمي</span>
                                                    <span className={`font-black text-sm ${getGlycemicColor(food.glycemic_index).text}`}>
                                                        {food.glycemic_index} - {getGlycemicLabel(food.glycemic_index)}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Nutrition Bars */}
                                            <div className="space-y-2">
                                                {[
                                                    { label: 'سعرات حرارية', val: food.calories, max: 500, color: 'bg-orange-400', unit: 'kcal' },
                                                    { label: 'كربوهيدرات', val: food.carb, max: 100, color: 'bg-amber-400', unit: 'g' },
                                                    { label: 'بروتين', val: food.protein, max: 50, color: 'bg-blue-400', unit: 'g' },
                                                    { label: 'دهون', val: food.fats, max: 50, color: 'bg-rose-400', unit: 'g' },
                                                ].map(item => (
                                                    <div key={item.label}>
                                                        <div className="flex justify-between text-[10px] mb-1">
                                                            <span className="text-gray-500 font-bold">{item.label}</span>
                                                            <span className="font-black text-gray-700">{item.val || 0} {item.unit}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${item.color} rounded-full transition-all`}
                                                                style={{ width: `${Math.min((parseFloat(item.val) || 0) / item.max * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); toggleMealSelection(food); }}
                                                className={`w-full py-3 rounded-xl font-black text-sm transition-all ${isSelected(food.id) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                {isSelected(food.id) ? '✓ تم الإضافة' : '+ أضف للوجبة'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedMeals.length > 0 && (
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-24 left-4 right-4 z-[1100]">
                        <div className="bg-primary-emerald p-4 rounded-3xl shadow-xl flex justify-between items-center text-white">
                            <p className="font-bold">تم اختيار {selectedMeals.length} أصناف</p>
                            <button onClick={sendToMealTracker} className="bg-white text-primary-emerald px-6 py-2 rounded-xl font-black">تأكيد</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FoodsView;
