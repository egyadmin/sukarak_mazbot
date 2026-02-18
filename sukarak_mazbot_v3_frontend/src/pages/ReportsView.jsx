import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Download, TrendingUp, TrendingDown, Activity, FileText, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { exportHealthReport } from '../utils/ExportUtils';
import DataService from '../services/DataService';

// Translation map for test types
const typeLabels = {
    ar: { fasting: 'صائم', after_meal: 'بعد الأكل', random: 'عشوائي', before_meal: 'قبل الأكل' },
    en: { fasting: 'Fasting', after_meal: 'After Meal', random: 'Random', before_meal: 'Before Meal' },
};

const ReportsView = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const getTypeLabel = (key) => typeLabels[lang]?.[key] || typeLabels['ar']?.[key] || key;

    const [readings, setReadings] = useState([]);
    const [period, setPeriod] = useState('week');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data } = await DataService.getSugarReadings();
            setReadings(Array.isArray(data) ? data : []);
        } catch { }
        setLoading(false);
    };

    // Filter by period
    const now = new Date();
    const filteredReadings = readings.filter(r => {
        const date = new Date(r.created_at);
        const diff = (now - date) / (1000 * 60 * 60 * 24);
        if (period === 'week') return diff <= 7;
        if (period === 'month') return diff <= 30;
        return diff <= 90;
    });

    // Chart data
    const chartData = [...filteredReadings].reverse().map(r => ({
        name: new Date(r.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' }),
        sugar: r.reading,
        type: getTypeLabel(r.test_type),
    }));

    // Stats
    const avg = filteredReadings.length > 0 ? Math.round(filteredReadings.reduce((s, r) => s + r.reading, 0) / filteredReadings.length) : 0;
    const max = filteredReadings.length > 0 ? Math.max(...filteredReadings.map(r => r.reading)) : 0;
    const min = filteredReadings.length > 0 ? Math.min(...filteredReadings.map(r => r.reading)) : 0;
    const normalCount = filteredReadings.filter(r => r.reading >= 70 && r.reading <= 140).length;
    const normalPercent = filteredReadings.length > 0 ? Math.round((normalCount / filteredReadings.length) * 100) : 0;

    // AI insight
    const insight = avg < 70
        ? 'نلاحظ انخفاض متكرر في مستويات السكر. يُنصح بمراجعة الطبيب وتناول وجبات خفيفة بين الوجبات الرئيسية.'
        : avg <= 120
            ? 'ممتاز! مستويات السكر لديك في المعدل الطبيعي. استمر في نظامك الغذائي الحالي والتمارين الرياضية.'
            : avg <= 180
                ? 'مستويات السكر مرتفعة قليلاً. حاول تقليل الكربوهيدرات وزيادة النشاط البدني.'
                : 'مستوى السكر مرتفع بشكل ملحوظ. يجب مراجعة الطبيب فوراً وتعديل الجرعات الدوائية.';

    const stats = [
        { label: lang === 'ar' ? 'المتوسط' : 'Average', value: avg, icon: Activity, color: 'text-primary-emerald', gradient: 'from-emerald-500/10 to-teal-500/5' },
        { label: lang === 'ar' ? 'أعلى قراءة' : 'Highest', value: max, icon: TrendingUp, color: 'text-red-500', gradient: 'from-red-500/10 to-rose-500/5' },
        { label: lang === 'ar' ? 'أقل قراءة' : 'Lowest', value: min, icon: TrendingDown, color: 'text-blue-500', gradient: 'from-blue-500/10 to-cyan-500/5' },
    ];

    const periods = [
        { key: 'week', label: lang === 'ar' ? 'أسبوع' : 'Week' },
        { key: 'month', label: lang === 'ar' ? 'شهر' : 'Month' },
        { key: '3months', label: lang === 'ar' ? '3 أشهر' : '3 Months' },
    ];

    // PDF Export handler
    const handleExportPDF = async () => {
        if (filteredReadings.length === 0) return;
        setExporting(true);
        try {
            await exportHealthReport(filteredReadings, period, insight);
        } catch (err) {
            console.error('Export error:', err);
            alert(lang === 'ar' ? 'حدث خطأ أثناء التصدير' : 'Export error occurred');
        }
        setExporting(false);
    };

    return (
        <div className="space-y-5 pb-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-primary-dark">{t('reports') || 'التقارير'}</h2>
                <button
                    onClick={handleExportPDF}
                    disabled={exporting || filteredReadings.length === 0}
                    className="bg-primary-emerald/10 text-primary-emerald px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-primary-emerald/20 active:scale-95 transition disabled:opacity-40"
                >
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF
                </button>
            </div>

            {/* Period Selector */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                {periods.map(p => (
                    <button key={p.key} onClick={() => setPeriod(p.key)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${period === p.key ? 'bg-primary-dark text-white shadow-lg' : 'text-gray-400'}`}>
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Normal Percentage */}
            {filteredReadings.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-500">{lang === 'ar' ? 'نسبة القراءات الطبيعية' : 'Normal Readings %'}</span>
                        <span className={`text-sm font-black ${normalPercent >= 70 ? 'text-emerald-500' : normalPercent >= 40 ? 'text-amber-500' : 'text-red-500'}`}>{normalPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${normalPercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${normalPercent >= 70 ? 'bg-gradient-to-l from-emerald-500 to-teal-400' : normalPercent >= 40 ? 'bg-gradient-to-l from-amber-500 to-yellow-400' : 'bg-gradient-to-l from-red-500 to-rose-400'}`} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                        <span>{normalCount} {lang === 'ar' ? 'طبيعية' : 'normal'}</span>
                        <span>{filteredReadings.length} {lang === 'ar' ? 'إجمالي القراءات' : 'total readings'}</span>
                    </div>
                </div>
            )}

            {/* Main Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-primary-emerald" />
                    <span className="text-sm font-bold text-gray-600">{lang === 'ar' ? 'مستوى السكر (mg/dL)' : 'Sugar Level (mg/dL)'}</span>
                    <span className="text-[10px] text-gray-300 mr-auto">{filteredReadings.length} {lang === 'ar' ? 'قراءة' : 'readings'}</span>
                </div>
                {loading ? (
                    <div className="h-56 flex items-center justify-center">
                        <div className="animate-pulse text-gray-300 text-sm">{lang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}</div>
                    </div>
                ) : chartData.length > 0 ? (
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#166f50" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#166f50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Cairo' }}
                                    formatter={(value, name) => [`${value} mg/dL`, lang === 'ar' ? 'السكر' : 'Sugar']}
                                    labelFormatter={(label) => label}
                                />
                                <Area type="monotone" dataKey="sugar" stroke="#166f50" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" dot={{ r: 4, fill: '#166f50', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-56 flex flex-col items-center justify-center text-gray-300">
                        <FileText className="w-10 h-10 mb-2" />
                        <p className="text-sm">{lang === 'ar' ? 'لا توجد بيانات في هذه الفترة' : 'No data for this period'}</p>
                    </div>
                )}
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        className={`bg-gradient-to-br ${stat.gradient} bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center`}>
                        <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                        <span className="text-[10px] text-gray-400 font-bold">{stat.label}</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className={`text-xl font-black ${stat.color}`}>{stat.value || '--'}</span>
                        </div>
                        <span className="text-[8px] text-gray-300">mg/dL</span>
                    </motion.div>
                ))}
            </div>

            {/* AI Insight */}
            {filteredReadings.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-primary-dark to-primary-emerald p-5 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-white/20 p-2 rounded-xl"><Activity className="w-5 h-5" /></div>
                            <h4 className="font-black">{lang === 'ar' ? 'تحليل الذكاء الاصطناعي' : 'AI Analysis'}</h4>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">{insight}</p>
                    </div>
                </motion.div>
            )}

            {/* Distribution by Type */}
            {filteredReadings.length > 2 && (() => {
                const fasting = filteredReadings.filter(r => r.test_type === 'fasting');
                const afterMeal = filteredReadings.filter(r => r.test_type === 'after_meal');
                const random = filteredReadings.filter(r => r.test_type === 'random');
                const barData = [];
                if (fasting.length > 0) barData.push({ name: getTypeLabel('fasting'), avg: Math.round(fasting.reduce((s, r) => s + r.reading, 0) / fasting.length), count: fasting.length });
                if (afterMeal.length > 0) barData.push({ name: getTypeLabel('after_meal'), avg: Math.round(afterMeal.reduce((s, r) => s + r.reading, 0) / afterMeal.length), count: afterMeal.length });
                if (random.length > 0) barData.push({ name: getTypeLabel('random'), avg: Math.round(random.reduce((s, r) => s + r.reading, 0) / random.length), count: random.length });
                if (barData.length === 0) return null;
                return (
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                        <h4 className="text-sm font-black text-gray-600 mb-4 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" /> {lang === 'ar' ? 'المتوسط حسب نوع القياس' : 'Average by Test Type'}
                        </h4>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666', fontWeight: 'bold' }} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`${value} mg/dL`, lang === 'ar' ? 'المتوسط' : 'Average']}
                                    />
                                    <Bar dataKey="avg" fill="#166f50" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })()}

            {/* Readings List */}
            {filteredReadings.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-50">
                        <h4 className="text-sm font-black text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-emerald" /> {lang === 'ar' ? 'سجل القراءات' : 'Readings Log'}
                        </h4>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                        {filteredReadings.map((r, i) => {
                            const isNormal = r.reading >= 70 && r.reading <= 140;
                            const isHigh = r.reading > 140;
                            return (
                                <div key={r.id || i} className="px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-red-400' : isNormal ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <div>
                                            <span className="text-sm font-bold text-gray-700">{getTypeLabel(r.test_type)}</span>
                                            <p className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <span className={`font-black text-base ${isHigh ? 'text-red-500' : isNormal ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {r.reading}
                                        </span>
                                        <span className="text-[9px] text-gray-300 block">mg/dL</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsView;
