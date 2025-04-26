"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import './styles.css';

interface BirthdayNotificationProps {
    idolName: string;
    fanName?: string;
    avatarUrl?: string;
    onClick?: () => void;
    message?: string;
    autoShowDuration?: number;
    onClose?: () => void;
}

const BirthdayNotification: React.FC<BirthdayNotificationProps> = ({
    idolName,
    fanName = '粉絲',
    avatarUrl = '/ai-1.jpg',
    onClick,
    message,
    autoShowDuration = 10,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleClose = useCallback(() => {
        setIsFading(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 500);
    }, [onClose]);

    useEffect(() => {
        // 自動顯示生日通知
        setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        // 自動關閉
        if (autoShowDuration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoShowDuration * 1000);

            return () => clearTimeout(timer);
        }
    }, [autoShowDuration, handleClose]);

    const defaultMessage = `${idolName}祝${fanName}生日快樂！希望你今天過得開心！`;
    const birthdayMessage = message || defaultMessage;

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-20 right-5 z-50 transform ${isFading ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'} transition-all duration-500 ease-in-out`}
        >
            <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-pink-200 dark:border-pink-900">
                {/* 頂部粉色條帶 */}
                <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 to-purple-500"></div>

                <div className="p-4 flex items-start">
                    {/* 禮物圖標 */}
                    <div className="text-xl mr-3 text-pink-500">🎁</div>

                    {/* 偶像圖片和內容 */}
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            {avatarUrl && (
                                <div className="relative w-10 h-10 mr-3 animate-birthday-pulse rounded-full overflow-hidden">
                                    <Image
                                        src={avatarUrl}
                                        alt={idolName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white flex items-center">
                                    <span className="birthday-text-gradient">{idolName}</span>
                                </h4>
                                <span className="text-xs bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200 px-1.5 py-0.5 rounded-full">
                                    專屬祝福
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{birthdayMessage}</p>

                        <button
                            className="w-full flex items-center justify-center text-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-1.5 px-3 rounded-md transition duration-200"
                            onClick={() => {
                                if (onClick) onClick();
                                handleClose();
                            }}
                        >
                            <span className="float-animation inline-block mr-2">🎁</span>
                            領取生日禮物
                        </button>
                    </div>

                    {/* 關閉按鈕 */}
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 底部進度條 */}
                <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
                    <div className="h-full bg-pink-400 birthday-progress-bar" style={{ animationDuration: `${autoShowDuration}s` }}></div>
                </div>
            </div>
        </div>
    );
};

export default BirthdayNotification; 