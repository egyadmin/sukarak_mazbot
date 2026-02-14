import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './i18n/config';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeView from './pages/HomeView';
import SplashScreen from './components/common/SplashScreen';
import LoginPage from './pages/LoginPage';
import HealthTrackingView from './pages/HealthTrackingView';
import MarketView from './pages/MarketView';
import ReportsView from './pages/ReportsView';
import AppointmentsView from './pages/AppointmentsView';
import ProfileView from './pages/ProfileView';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import FoodsView from './pages/FoodsView';
import SportsView from './pages/SportsView';
import MedicationsView from './pages/MedicationsView';
import NotificationsView from './pages/NotificationsView';
import InsulinCalculatorView from './pages/InsulinCalculatorView';
import MedicalTestsView from './pages/MedicalTestsView';
import NursingView from './pages/NursingView';
import NursingDashboard from './pages/NursingDashboard';
import MyOrdersView from './pages/MyOrdersView';
import SellerDashboard from './pages/SellerDashboard';
import BlogView from './pages/BlogView';
import MembershipCardsView from './pages/MembershipCardsView';
import MedicineReminderView from './pages/MedicineReminderView';
import PersonalAssistantView from './pages/PersonalAssistantView';
import MedicalServicesView from './pages/MedicalServicesView';
import HealthRecordView from './pages/HealthRecordView';
import DiabetesEducationView from './pages/DiabetesEducationView';
import SupportView from './pages/SupportView';
import MoreView from './pages/MoreView';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import AboutUsPage from './pages/AboutUsPage';

function AppContent() {
    const { i18n } = useTranslation();
    const location = useLocation();
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('sukarak_token'));

    const isAdmin = location.pathname.startsWith('/admin');
    const isDoctor = location.pathname.startsWith('/doctor');
    const isSeller = location.pathname.startsWith('/seller');
    const isNursingAdmin = location.pathname.startsWith('/nursing-admin');
    const isPanel = isAdmin || isDoctor || isSeller || isNursingAdmin;

    // Public routes that don't require login
    const publicPaths = ['/privacy-policy', '/terms', '/refund-policy', '/about-us', '/admin/login'];
    const isPublicPage = publicPaths.includes(location.pathname);

    const toggleLanguage = () => {
        const newLng = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLng);
        document.documentElement.dir = newLng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLng;
    };

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    // Listen for logout events from other components
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('sukarak_token');
            if (!token && isLoggedIn) {
                setIsLoggedIn(false);
            }
        };
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [isLoggedIn]);

    return (
        <AnimatePresence mode="wait">
            {showSplash ? (
                <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
            ) : !isLoggedIn && !isPublicPage && !isPanel ? (
                <LoginPage key="login" onLogin={handleLogin} />
            ) : (
                <motion.div
                    key="main-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`min-h-screen flex flex-col ${isPanel ? 'bg-gray-50' : 'bg-white'} overflow-x-hidden font-cairo`}
                >
                    {!isPanel && <Navbar toggleLanguage={toggleLanguage} />}

                    <main className={`flex-1 ${isPanel ? '' : 'pt-24 px-4 pb-24 max-w-lg mx-auto w-full'}`}>
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/health-tracking" element={<HealthTrackingView />} />
                            <Route path="/market" element={<MarketView />} />
                            <Route path="/reports" element={<ReportsView />} />
                            <Route path="/appointments" element={<AppointmentsView />} />
                            <Route path="/profile" element={<ProfileView />} />
                            <Route path="/foods" element={<FoodsView />} />
                            <Route path="/sports" element={<SportsView />} />
                            <Route path="/medications" element={<MedicationsView />} />
                            <Route path="/notifications" element={<NotificationsView />} />
                            <Route path="/insulin-calculator" element={<InsulinCalculatorView />} />
                            <Route path="/medical-tests" element={<MedicalTestsView />} />
                            <Route path="/nursing" element={<NursingView />} />
                            <Route path="/my-orders" element={<MyOrdersView />} />
                            <Route path="/blog" element={<BlogView />} />
                            <Route path="/membership" element={<MembershipCardsView />} />
                            <Route path="/medicine-reminder" element={<MedicineReminderView />} />
                            <Route path="/personal-assistant" element={<PersonalAssistantView />} />
                            <Route path="/medical-services" element={<MedicalServicesView />} />
                            <Route path="/health-record" element={<HealthRecordView />} />
                            <Route path="/diabetes-education" element={<DiabetesEducationView />} />
                            <Route path="/support" element={<SupportView />} />
                            <Route path="/more" element={<MoreView />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/refund-policy" element={<RefundPolicyPage />} />
                            <Route path="/about-us" element={<AboutUsPage />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/login" element={<AdminLogin onLogin={() => window.location.href = '/admin'} />} />
                            <Route path="/doctor" element={<DoctorDashboard />} />
                            <Route path="/seller" element={<SellerDashboard />} />
                            <Route path="/nursing-admin" element={<NursingDashboard />} />
                        </Routes>
                    </main>

                    {!isPanel && <BottomNav />}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
