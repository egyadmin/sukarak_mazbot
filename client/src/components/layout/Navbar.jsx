import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, Headset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataService from '../../services/DataService';

const Navbar = ({ toggleLanguage }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
        setIsAdmin(!!user.id);

        loadNotificationCount();
        const interval = setInterval(loadNotificationCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotificationCount = async () => {
        try {
            const { data } = await DataService.getNotifications();
            const count = DataService.getUnreadCount(data);
            let smartCount = 0;
            try {
                const { data: drugs } = await DataService.getDrugs();
                if (drugs?.length > 0) smartCount += drugs.filter(d => d.frequency?.includes('يومياً')).length;
            } catch { }
            try {
                const { data: readings } = await DataService.getSugarReadings();
                if (readings?.length > 0) {
                    const h = (Date.now() - new Date(readings[0].created_at).getTime()) / 3600000;
                    if (h > 12) smartCount++;
                    if (readings[0].reading > 180 || readings[0].reading < 70) smartCount++;
                }
            } catch { }
            setUnreadCount(count + smartCount);
        } catch { }
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-4 py-3" style={{ background: 'rgba(245, 255, 252, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}>
            <div className="max-w-lg mx-auto flex items-center justify-between">
                {/* Logo + Title */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-md shadow-emerald-200/50">
                        <img src="/logo.png" alt="سُكّرك مظبوط" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-primary-dark leading-tight">
                            {lang === 'ar' ? 'سُكّرك مظبوط' : 'Sukarak'}
                        </h1>
                        <p className="text-[9px] text-gray-400 font-bold -mt-0.5">v3.0</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/support')}
                        className="p-2 bg-white/80 border border-gray-100 rounded-xl relative active:scale-95 transition shadow-sm hover:bg-white"
                        title={lang === 'ar' ? 'الدعم الفني' : 'Support'}>
                        <Headset className="w-5 h-5 text-primary-emerald" />
                    </button>

                    <button onClick={toggleLanguage}
                        className="flex items-center gap-1.5 bg-white/80 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-white transition-all text-xs font-bold shadow-sm">
                        <Globe className="w-3.5 h-3.5 text-primary-emerald" />
                        <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
                    </button>

                    <button onClick={() => navigate('/notifications')}
                        className="p-2 bg-white/80 border border-gray-100 rounded-xl relative active:scale-95 transition shadow-sm hover:bg-white">
                        <Bell className="w-5 h-5 text-primary-dark" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-[9px] text-white font-black flex items-center justify-center px-1 shadow-lg badge-bounce">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
