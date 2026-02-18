import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE } from '../api/config';
import {
    ChevronLeft, BookOpen, ExternalLink, Loader2, GraduationCap,
    Globe, Share2
} from 'lucide-react';

const BlogView = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const [courses, setCourses] = useState([]);
    const [books, setBooks] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [coursesRes, booksRes, socialRes] = await Promise.all([
                    fetch(`${API_BASE}/membership/courses`),
                    fetch(`${API_BASE}/membership/books`),
                    fetch(`${API_BASE}/membership/social-links`),
                ]);
                if (coursesRes.ok) setCourses(await coursesRes.json());
                if (booksRes.ok) setBooks(await booksRes.json());
                if (socialRes.ok) setSocialLinks(await socialRes.json());
            } catch (err) { console.error('Blog data error:', err); }
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-emerald" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24 font-cairo" dir="rtl">
            <h2 className="text-2xl font-black text-primary-dark">{lang === 'ar' ? 'سكرك التعليمي' : 'Diabetes Education'}</h2>

            <div className="bg-gradient-to-br from-primary-dark to-primary-emerald p-6 rounded-[32px] text-white">
                <h3 className="text-lg font-black mb-1">{lang === 'ar' ? 'دليلك الشامل للتثقيف الصحي' : 'Your Comprehensive Guide'}</h3>
                <p className="text-xs text-white/70">{lang === 'ar' ? 'كورسات، كتب، ومحتوى تعليمي حياة أفضل' : 'Courses, books, and educational content'}</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                    <h4 className="font-black text-gray-700">{lang === 'ar' ? 'الكورسات والدورات' : 'Courses'}</h4>
                </div>
                <div className="space-y-3">
                    {courses.map((course, i) => (
                        <a key={i} href={course.url} target="_blank" rel="noreferrer"
                            className="bg-white p-4 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 flex-1">
                                <span className="text-xl">{course.icon || '🎓'}</span>
                                <div>
                                    <p className="font-bold text-sm text-gray-700">{lang === 'ar' ? course.title_ar : course.title_en}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{lang === 'ar' ? course.description_ar : course.description_en}</p>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-primary-emerald flex-shrink-0" />
                        </a>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h4 className="font-black text-gray-700">{lang === 'ar' ? 'الكتب والمطبوعات' : 'Books'}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {books.map((book, i) => (
                        <a key={i} href={book.url} target="_blank" rel="noreferrer"
                            className="bg-white p-5 rounded-[32px] border border-gray-100 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-md transition-all">
                            <BookOpen className="w-10 h-10 text-amber-200" />
                            <span className="font-black text-xs text-gray-700">{lang === 'ar' ? book.book_title_ar : book.book_title_en}</span>
                            {book.country_name_ar && <span className="text-[9px] text-gray-400">{book.flag_emoji} {lang === 'ar' ? book.country_name_ar : book.country_name_en}</span>}
                            <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full">{lang === 'ar' ? 'تحميل الكتاب' : 'Download'}</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BlogView;
