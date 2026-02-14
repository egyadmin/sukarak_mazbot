import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, FileBarChart, Calendar, User, MoreHorizontal } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Professional Bottom Navigation
 * Features:
 * - Solid white background (no transparency)
 * - Safe area support (for iPhone/Android gestures)
 * - Native-style animations
 * - Professional layout and spacing
 */
const BottomNav = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const location = useLocation();

    const navItems = [
        { icon: Home, label: lang === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
        { icon: FileBarChart, label: lang === 'ar' ? 'التقارير' : 'Reports', path: '/reports' },
        { icon: Calendar, label: lang === 'ar' ? 'المواعيد' : 'Appts', path: '/appointments' },
        { icon: User, label: lang === 'ar' ? 'حسابي' : 'Profile', path: '/profile' },
        { icon: MoreHorizontal, label: lang === 'ar' ? 'المزيد' : 'More', path: '/more' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
            {/* Inner container to handle safe area padding and alignment */}
            <div className="max-w-lg mx-auto flex items-center h-16 sm:h-20 px-4 pb-[env(safe-area-inset-bottom,12px)]">
                {navItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={idx}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 relative h-full transition-all duration-300 ${isActive ? 'text-primary-emerald' : 'text-gray-400'}`}
                        >
                            <div className="flex flex-col items-center relative py-1">
                                <motion.div
                                    animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`p-2 rounded-2xl transition-colors duration-300 ${isActive ? 'bg-primary-emerald/10' : 'bg-transparent'}`}
                                >
                                    <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                                </motion.div>
                                <span className={`text-[10px] font-black mt-1 tracking-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {item.label}
                                </span>
                            </div>

                            {/* Centered Active Bar Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute top-0 w-8 h-1 bg-primary-emerald rounded-b-full shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </NavLink>
                    );
                })}
            </div>
            {/* Solid background filler for the very bottom edge (Safe Area) */}
            <div className="h-[env(safe-area-inset-bottom,0px)] bg-white w-full" />
        </nav>
    );
};

export default BottomNav;
