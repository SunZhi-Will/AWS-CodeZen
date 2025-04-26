'use client';

import React, { useState, useEffect } from 'react';
import { getAiReplyRecommendations, MessageContent, AiReplyRecommendation } from '../utils/stepFunctionsMessageFlow';

interface AiSuggestionProps {
    message: MessageContent;
    onSelectReply: (replyContent: string, replyMode: string) => void;
    onClose: () => void;
}

export default function AiReplySuggestion({ message, onSelectReply, onClose }: AiSuggestionProps) {
    const [suggestions, setSuggestions] = useState<AiReplyRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                setLoading(true);
                const result = await getAiReplyRecommendations(message);
                setSuggestions(result);
            } catch (err) {
                console.error('獲取 AI 回覆建議時發生錯誤:', err);
                setError('無法載入 AI 回覆建議，請稍後再試。');
            } finally {
                setLoading(false);
            }
        }

        fetchSuggestions();
    }, [message]);

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
                {/* 情感向回覆 */}
                <div
                    className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                    onClick={() => onSelectReply(suggestions.emotionReply, '情感向')}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-pink-500 dark:text-pink-400">情感向</span>
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
                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.emotionReply}</p>
                </div>

                {/* 品牌向回覆 */}
                <div
                    className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                    onClick={() => onSelectReply(suggestions.brandReply, '品牌向')}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-blue-500 dark:text-blue-400">品牌向</span>
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
                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.brandReply}</p>
                </div>

                {/* 混合風格回覆 */}
                <div
                    className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                    onClick={() => onSelectReply(suggestions.mixedReply, '混合風格')}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-purple-500 dark:text-purple-400">混合風格</span>
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
                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestions.mixedReply}</p>
                </div>
            </div>
        </div>
    );
} 