import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(onFinish, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-primary-emerald/10 blur-3xl rounded-full scale-150" />
                <img
                    src="/logo.png"
                    alt="Sukarak Mazboot"
                    className="w-48 h-auto relative z-10"
                />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col items-center"
            >
                <h1 className="text-2xl font-black text-primary-dark">سكرك مضبوط</h1>
                <p className="text-gray-400 text-sm mt-2 font-bold tracking-widest uppercase">Version 3.0</p>

                <div className="mt-8 flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-primary-emerald rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
