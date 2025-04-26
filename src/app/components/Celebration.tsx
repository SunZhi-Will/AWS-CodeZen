'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
    type: 'birthday' | 'festival' | 'achievement' | 'custom';
    message: string;
    description?: string;
    bgColor?: string;
    icon?: React.ReactNode;
    duration?: number; // 顯示持續時間（毫秒）
    onClose?: () => void;
    confettiEffect?: 'basic' | 'stars' | 'fireworks' | 'custom';
    customClass?: string;
}

const Celebration: React.FC<CelebrationProps> = ({
    type,
    message,
    description,
    bgColor,
    icon,
    duration = 5000,
    onClose,
    confettiEffect = 'basic',
    customClass,
}) => {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    // 設定背景和圖標
    let backgroundStyle = bgColor || '';
    let celebrationIcon = icon;

    // 根據類型設定預設樣式
    switch (type) {
        case 'birthday':
            backgroundStyle = backgroundStyle || 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
            celebrationIcon = celebrationIcon || (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                    <path d="M15 1.784l-.796.796a1.125 1.125 0 101.591 0L15 1.784zM12 1.784l-.796.796a1.125 1.125 0 101.591 0L12 1.784zM9 1.784l-.796.796a1.125 1.125 0 101.591 0L9 1.784zM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 011.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 011.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 00-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 011.5 0v.797zM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 012.585.364 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 012.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0012 12.75zM21.75 18.131a2.25 2.25 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.605 2.605 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.605 2.605 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.605 2.605 0 00-2.33 0 4.104 4.104 0 01-1.42.384 1.875 1.875 0 01-1.875-1.875v-1.5c0-1.302.941-2.429 2.227-2.684a49.255 49.255 0 0111.188 0A2.25 2.25 0 0121.75 14.62v1.5a1.875 1.875 0 01-1.875 1.875 4.104 4.104 0 01-1.42-.384 2.25 2.25 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.25 2.25 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.25 2.25 0 00-2.33 0 4.104 4.104 0 01-1.42.384 1.875 1.875 0 01-1.875-1.875v-1.5c0-1.302.941-2.429 2.227-2.684a49.255 49.255 0 0111.188 0A2.25 2.25 0 0121.75 14.62v1.5a1.875 1.875 0 01-1.875 1.875 4.104 4.104 0 01-1.42-.384z" />
                </svg>
            );
            break;
        case 'festival':
            backgroundStyle = backgroundStyle || 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500';
            celebrationIcon = celebrationIcon || (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            );
            break;
        case 'achievement':
            backgroundStyle = backgroundStyle || 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500';
            celebrationIcon = celebrationIcon || (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
            );
            break;
        default:
            backgroundStyle = backgroundStyle || 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500';
    }

    // 應用不同的紙屑效果
    useEffect(() => {
        if (visible) {
            switch (confettiEffect) {
                case 'stars':
                    const starColors = ['#FFD700', '#FFC0CB', '#87CEFA', '#98FB98'];
                    const starAnimation = () => {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: starColors,
                            shapes: ['star'],
                            scalar: 2,
                        });
                    };
                    starAnimation();
                    const starInterval = setInterval(starAnimation, 1200);
                    return () => clearInterval(starInterval);

                case 'fireworks':
                    const fireworksAnimation = () => {
                        const end = Date.now() + 1000;
                        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

                        (function frame() {
                            confetti({
                                particleCount: 30,
                                angle: Math.random() * 360,
                                spread: 70,
                                origin: {
                                    x: Math.random(),
                                    y: Math.random() * 0.5
                                },
                                colors: [colors[Math.floor(Math.random() * colors.length)]],
                            });

                            if (Date.now() < end) {
                                requestAnimationFrame(frame);
                            }
                        }());
                    };

                    fireworksAnimation();
                    const fireworksInterval = setInterval(fireworksAnimation, 2000);
                    return () => clearInterval(fireworksInterval);

                case 'basic':
                default:
                    confetti({
                        particleCount: 200,
                        spread: 100,
                        origin: { y: 0.2 },
                    });
                    break;
            }
        }
    }, [visible, confettiEffect]);

    // 設定自動關閉
    useEffect(() => {
        if (duration && visible) {
            const closeTimer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 1000);
            }, duration);

            return () => clearTimeout(closeTimer);
        }
    }, [duration, onClose, visible]);

    // 如果不可見則不渲染
    if (!visible) {
        return null;
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${fadeOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
                setFadeOut(true);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 1000);
            }}></div>

            <div className={`relative px-8 py-10 rounded-xl shadow-2xl ${backgroundStyle} ${customClass} animate-celebration-pop max-w-md w-full mx-4`}>
                <div className="absolute top-0 right-0 p-4">
                    <button
                        onClick={() => {
                            setFadeOut(true);
                            setTimeout(() => {
                                setVisible(false);
                                if (onClose) onClose();
                            }, 1000);
                        }}
                        className="text-white/80 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 text-white">
                        {celebrationIcon}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 animate-bounce-gentle">{message}</h2>
                    {description && (
                        <p className="text-white/90 max-w-xs">{description}</p>
                    )}

                    {/* 裝飾元素 */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="celebration-sparkle celebration-sparkle-1"></div>
                        <div className="celebration-sparkle celebration-sparkle-2"></div>
                        <div className="celebration-sparkle celebration-sparkle-3"></div>
                        <div className="celebration-sparkle celebration-sparkle-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Celebration;

// 需要在全局CSS中添加如下樣式
//
// @keyframes sparkle {
//   0% { transform: scale(0); opacity: 0; }
//   50% { transform: scale(1); opacity: 0.8; }
//   100% { transform: scale(0); opacity: 0; }
// }
//
// @keyframes float {
//   0% { transform: translateY(0px) rotate(0deg); }
//   50% { transform: translateY(-20px) rotate(10deg); }
//   100% { transform: translateY(0px) rotate(0deg); }
// }
//
// @keyframes fade-in {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
//
// @keyframes fade-out {
//   from { opacity: 1; }
//   to { opacity: 0; }
// }
//
// @keyframes celebration-pop {
//   0% { transform: scale(0.8); opacity: 0; }
//   50% { transform: scale(1.05); }
//   70% { transform: scale(0.95); }
//   100% { transform: scale(1); opacity: 1; }
// }
//
// @keyframes bounce-gentle {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-5px); }
// }
//
// .animate-fade-in {
//   animation: fade-in 0.5s ease forwards;
// }
//
// .animate-fade-out {
//   animation: fade-out 0.5s ease forwards;
// }
//
// .animate-celebration-pop {
//   animation: celebration-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
// }
//
// .animate-bounce-gentle {
//   animation: bounce-gentle 2s ease-in-out infinite;
// }
//
// .celebration-sparkle {
//   position: absolute;
//   background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
//   border-radius: 50%;
//   width: 100px;
//   height: 100px;
//   opacity: 0;
// }
//
// .celebration-sparkle-1 {
//   top: 10%;
//   left: 10%;
//   animation: sparkle 3s infinite 0.3s;
// }
//
// .celebration-sparkle-2 {
//   top: 15%;
//   right: 15%;
//   animation: sparkle 3s infinite 0.7s;
// }
//
// .celebration-sparkle-3 {
//   bottom: 15%;
//   left: 20%;
//   animation: sparkle 3s infinite 1.2s;
// }
//
// .celebration-sparkle-4 {
//   bottom: 20%;
//   right: 10%;
//   animation: sparkle 3s infinite 0.5s;
// } 