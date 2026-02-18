/**
 * بيانات الأقسام والأقسام الفرعية - سكرك مظبوط
 * يُستخدم في: المتجر - لوحة البائع - لوحة الأدمن
 */

export const CATEGORIES = [
    {
        id: 'supplements',
        label: 'المكملات الغذائية',
        labelEn: 'Supplements',
        emoji: '💊',
        color: 'from-blue-400 to-indigo-500',
        subcategories: [
            { id: 'vitamins', label: 'الفيتامينات والمعادن' },
            { id: 'eye_health', label: 'صحة العين والشبكية' },
            { id: 'weight_management', label: 'التخسيس وإدارة الوزن' },
            { id: 'energy_health', label: 'تعزيز الطاقة والصحة العامة' },
            { id: 'omega3', label: 'الأوميجا3 والأحماض الدهنية' },
            { id: 'heart_health', label: 'صحة القلب والأوعية الدموية' },
            { id: 'insulin_support', label: 'دعم الإنسولين وصحة الأعصاب' },
            { id: 'antioxidants', label: 'مضادات الأكسدة وتعزيز المناعة' },
            { id: 'digestive_health', label: 'صحة الجهاز الهضمي والقولون' },
            { id: 'mood_sleep', label: 'الأرق والتوتر وتحسين المزاج' },
            { id: 'bone_joints', label: 'صحة العظام والمفاصل' },
            { id: 'urinary_health', label: 'صحة المسالك البولية' },
        ]
    },
    {
        id: 'food',
        label: 'الأغذية الصحية',
        labelEn: 'Healthy Food',
        emoji: '🥗',
        color: 'from-green-400 to-emerald-500',
        subcategories: [
            { id: 'sweeteners', label: 'المحليات' },
            { id: 'healthy_snacks', label: 'سناكات صحية' },
            { id: 'dietary_fiber', label: 'الألياف الغذائية' },
            { id: 'hydration_drinks', label: 'مشروبات الجفاف' },
            { id: 'diabetes_food', label: 'أغذية أبطال السكري' },
            { id: 'muscle_sports', label: 'البناء العضلي والأداء الرياضي' },
            { id: 'misc_healthy', label: 'منتجات صحية متنوعة' },
        ]
    },
    {
        id: 'devices',
        label: 'الأجهزة الطبية',
        labelEn: 'Medical Devices',
        emoji: '🩺',
        color: 'from-cyan-400 to-blue-500',
        subcategories: [
            { id: 'insulin_pumps', label: 'مضخات الإنسولين' },
            { id: 'glucose_meters', label: 'أجهزة قياس السكر' },
            { id: 'blood_pressure', label: 'أجهزة قياس الضغط' },
            { id: 'nebulizers_oxygen', label: 'أجهزة البخار والأكسجين' },
        ]
    },
    {
        id: 'sports',
        label: 'الأدوات الرياضية',
        labelEn: 'Sports Equipment',
        emoji: '🏋️',
        color: 'from-orange-400 to-amber-500',
        subcategories: [
            { id: 'weight_scales', label: 'أجهزة قياس الوزن' },
            { id: 'massage_devices', label: 'أجهزة التدليك والمساج' },
            { id: 'home_exercise', label: 'أدوات التمارين المنزلية' },
        ]
    },
    {
        id: 'care',
        label: 'العناية الشخصية',
        labelEn: 'Personal Care',
        emoji: '🧴',
        color: 'from-pink-400 to-rose-500',
        subcategories: [
            { id: 'mens_care', label: 'العناية بالرجل' },
            { id: 'oral_health', label: 'صحة الفم واللثه' },
            { id: 'body_care', label: 'منتجات العناية بالجسم' },
            { id: 'foot_muscle', label: 'صحة القدمين والعضلات' },
            { id: 'elderly_care', label: 'العناية بكبار السن' },
        ]
    },
    {
        id: 'medical_supplies',
        label: 'المستلزمات الطبية',
        labelEn: 'Medical Supplies',
        emoji: '🏥',
        color: 'from-purple-400 to-violet-500',
        subcategories: [
            { id: 'medical_supports', label: 'الدعامات الطبية' },
            { id: 'wounds_burns', label: 'الجروح والحروق والكدمات' },
            { id: 'wheelchairs', label: 'الكراسي المتحركة والعكاكيز' },
            { id: 'misc_medical', label: 'مستلزمات طبية متنوعة' },
        ]
    }
];

/**
 * دالة لجلب اسم القسم بالعربي
 */
export const getCategoryLabel = (categoryId) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.label : categoryId || '-';
};

/**
 * دالة لجلب اسم القسم الفرعي بالعربي
 */
export const getSubcategoryLabel = (categoryId, subcategoryId) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    if (!cat) return subcategoryId || '-';
    const sub = cat.subcategories.find(s => s.id === subcategoryId);
    return sub ? sub.label : subcategoryId || '-';
};

/**
 * جلب الأقسام الفرعية لقسم معين
 */
export const getSubcategories = (categoryId) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.subcategories : [];
};

/**
 * جلب كل الأقسام الفرعية (flat)
 */
export const getAllSubcategories = () => {
    return CATEGORIES.flatMap(cat =>
        cat.subcategories.map(sub => ({
            ...sub,
            categoryId: cat.id,
            categoryLabel: cat.label,
        }))
    );
};
