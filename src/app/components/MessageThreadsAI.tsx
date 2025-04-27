'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAiReplyRecommendations, MessageContent, AiReplyRecommendation } from '../utils/stepFunctionsMessageFlow';

// 音頻檔案URL
const AUDIO_FILE_URL = '/audio/2025-04-26T23_05_21.162118.m4a';

interface AiSuggestionProps {
    message: MessageContent;
    onSelectReply: (replyContent: string, replyMode: string) => void;
    onClose: () => void;
}

export default function AiReplySuggestion({ message, onSelectReply, onClose }: AiSuggestionProps) {
    const [suggestions, setSuggestions] = useState<AiReplyRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEmotion, setShowEmotion] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showMixed, setShowMixed] = useState(false);

    // 語音播放相關狀態
    const [isPlayingAudio, setIsPlayingAudio] = useState<{ [key: string]: boolean }>({
        emotion: false,
        brand: false,
        mixed: false
    });
    const audioRefs = React.useMemo(() => ({
        emotion: useRef<HTMLAudioElement | null>(null),
        brand: useRef<HTMLAudioElement | null>(null),
        mixed: useRef<HTMLAudioElement | null>(null)
    }), []);

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                setLoading(true);
                const result = await getAiReplyRecommendations(message);
                setSuggestions(result);

                setShowEmotion(true);

                setTimeout(() => {
                    setShowBrand(true);
                }, 1000);

                setTimeout(() => {
                    setShowMixed(true);
                }, 2000);

            } catch (err) {
                console.error('獲取 AI 回覆建議時發生錯誤:', err);
                setError('無法載入 AI 回覆建議，請稍後再試。');
            } finally {
                setLoading(false);
            }
        }

        fetchSuggestions();
    }, [message]);

    // 處理語音播放
    const toggleAudioPlay = (type: 'emotion' | 'brand' | 'mixed') => {
        // 停止其他正在播放的音頻
        Object.keys(audioRefs).forEach((key) => {
            if (key !== type && audioRefs[key as keyof typeof audioRefs].current) {
                audioRefs[key as keyof typeof audioRefs].current?.pause();
                setIsPlayingAudio(prev => ({ ...prev, [key]: false }));
            }
        });

        const audioElement = audioRefs[type].current;
        if (audioElement) {
            if (isPlayingAudio[type]) {
                audioElement.pause();
            } else {
                audioElement.play().catch(error => {
                    console.error('播放音頻時出錯:', error);
                });
            }
            setIsPlayingAudio(prev => ({ ...prev, [type]: !prev[type] }));
        }
    };

    // 監聽音頻播放結束
    useEffect(() => {
        const addAudioEndedListeners = () => {
            Object.keys(audioRefs).forEach((type) => {
                const audioElement = audioRefs[type as keyof typeof audioRefs].current;
                if (audioElement) {
                    audioElement.addEventListener('ended', () => {
                        setIsPlayingAudio(prev => ({ ...prev, [type]: false }));
                    });
                }
            });
        };

        addAudioEndedListeners();

        // 清理函數
        return () => {
            Object.keys(audioRefs).forEach((type) => {
                const audioElement = audioRefs[type as keyof typeof audioRefs].current;
                if (audioElement) {
                    audioElement.pause();
                    audioElement.removeEventListener('ended', () => { });
                }
            });
        };
    }, [audioRefs]);

    if (loading) {
        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 回覆建議</h5>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">正在生成回覆建議...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 回覆建議</h5>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (!suggestions) {
        return null;
    }

    // 準備音頻元素
    const audioElements = (
        <>
            <audio ref={audioRefs.emotion} src={AUDIO_FILE_URL} />
            <audio ref={audioRefs.brand} src={AUDIO_FILE_URL} />
            <audio ref={audioRefs.mixed} src={AUDIO_FILE_URL} />
        </>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 回覆建議</h5>
                <div className="flex space-x-2">
                    <div className="flex space-x-1">
                        <button className="px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800/50 transition-colors">
                            情感向
                        </button>
                        <button className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                            品牌向
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {/* 隱藏的音頻元素 */}
                {audioElements}

                {/* 原始偶像回覆（如果存在） */}
                {suggestions.originalIdolReply && showEmotion && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800/30 mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-500">原始偶像回覆</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.originalIdolReply}</p>
                    </div>
                )}

                {/* 情感向回覆 */}
                {showEmotion && (
                    <div
                        className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                        onClick={() => onSelectReply(suggestions.emotionReply, '情感向')}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-pink-500 dark:text-pink-400">情感向</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAudioPlay('emotion');
                                    }}
                                >
                                    {isPlayingAudio.emotion ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0a9 9 0 010 12.728M3 10l.471.242a7 7 0 014.065 1.899l.5.5a7 7 0 004.242 1.859h.686a7 7 0 004.242-1.859l.5-.5a7 7 0 014.065-1.899L22 10" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectReply(suggestions.emotionReply, '情感向');
                                    }}
                                >
                                    使用此回覆
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.emotionReply}</p>
                    </div>
                )}

                {/* 品牌向回覆 */}
                {showBrand && (
                    <div
                        className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                        onClick={() => onSelectReply(suggestions.brandReply, '品牌向')}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-blue-500 dark:text-blue-400">品牌向</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAudioPlay('brand');
                                    }}
                                >
                                    {isPlayingAudio.brand ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0a9 9 0 010 12.728M3 10l.471.242a7 7 0 014.065 1.899l.5.5a7 7 0 004.242 1.859h.686a7 7 0 004.242-1.859l.5-.5a7 7 0 014.065-1.899L22 10" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectReply(suggestions.brandReply, '品牌向');
                                    }}
                                >
                                    使用此回覆
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.brandReply}</p>
                    </div>
                )}

                {/* 混合風格回覆 */}
                {showMixed && (
                    <div
                        className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                        onClick={() => onSelectReply(suggestions.mixedReply, '混合風格')}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-purple-500 dark:text-purple-400">混合風格</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAudioPlay('mixed');
                                    }}
                                >
                                    {isPlayingAudio.mixed ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0a9 9 0 010 12.728M3 10l.471.242a7 7 0 014.065 1.899l.5.5a7 7 0 004.242 1.859h.686a7 7 0 004.242-1.859l.5-.5a7 7 0 014.065-1.899L22 10" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectReply(suggestions.mixedReply, '混合風格');
                                    }}
                                >
                                    使用此回覆
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.mixedReply}</p>
                    </div>
                )}
            </div>
        </div>
    );
} 