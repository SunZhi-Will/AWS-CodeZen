'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import InteractionTrend from '../components/InteractionTrend';
import QuantitativeMetrics from '../components/QuantitativeMetrics';
import MessageThreads from '../components/MessageThreads';
import ContentPublisher from '../components/ContentPublisher';
import { saveMessagesToCookie, getMessagesFromCookie } from '../utils/cookieUtils';

// 定義留言和回覆的界面
interface Reply {
    id: number;
    content: string;
    time: string;
    mode?: string;
}

interface Message {
    id: number;
    user: string;
    content: string;
    time: string;
    status: string;
    replies: Reply[];
}

// 偶像空間頁面
export default function IdolSpace() {
    // 模擬單一AI偶像數據
    const idol = {
        name: '星光夢想家',
        category: '歌手',
        fans: 856,
        active: true,
        progress: 75,
        description: '專注於音樂創作與表演的AI虛擬偶像，擅長流行樂和抒情歌曲，聲音溫暖動人。',
        skills: ['歌唱', '作曲', '演奏', '互動', '主持'],
        trainSteps: [
            { name: '音樂素材', progress: 100 },
            { name: '歌曲風格', progress: 90 },
            { name: '語音訓練', progress: 85 },
            { name: '表演動作', progress: 70 },
            { name: '互動能力', progress: 60 }
        ]
    };

    // 品牌訊息數據
    const messageStats = [
        { category: '產品更新', impressions: '4,572', clickRate: '18.3%', conversion: '5.2%' },
        { category: '限時優惠', impressions: '3,841', clickRate: '24.7%', conversion: '8.9%' },
        { category: '粉絲活動', impressions: '2,935', clickRate: '31.2%', conversion: '12.4%' },
        { category: '新聞公告', impressions: '2,123', clickRate: '14.5%', conversion: '3.8%' },
    ];

    // 留言列表 - 從 cookie 中初始化
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 初始化時從 cookie 獲取留言記錄
    useEffect(() => {
        try {
            setIsLoading(true);
            // 從 cookie 獲取留言記錄
            const cookieMessages = getMessagesFromCookie();

            // 同時檢查是否有來自偶像動態頁面的留言
            const dynMessagesStr = localStorage.getItem('idol-messages');
            let dynamicMessages: Message[] = [];

            if (dynMessagesStr) {
                try {
                    const parsed = JSON.parse(dynMessagesStr);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        dynamicMessages = parsed as Message[];
                    }
                } catch (error) {
                    console.error('解析動態留言失敗:', error);
                    setError('無法讀取動態留言數據');
                }
            }

            // 合併來自 cookie 和動態頁面的留言
            if (cookieMessages && cookieMessages.length > 0) {
                // 如果有動態留言，合併並按時間排序
                if (dynamicMessages.length > 0) {
                    const allMessages = [...cookieMessages, ...dynamicMessages]
                        .sort((a, b) => {
                            // 使用 id 近似排序（假設 id 是時間戳或遞增的）
                            return (typeof b.id === 'number' && typeof a.id === 'number')
                                ? b.id - a.id
                                : 0;
                        });

                    setMessages(allMessages);

                    // 保存合併後的留言到 cookie
                    saveMessagesToCookie(allMessages);

                    // 清除localStorage中的動態留言，避免重複
                    localStorage.removeItem('idol-messages');
                } else {
                    // 僅使用 cookie 中的留言
                    setMessages(cookieMessages);
                }
            } else if (dynamicMessages.length > 0) {
                // 只有動態留言，沒有 cookie 留言
                setMessages(dynamicMessages);

                // 保存到 cookie
                saveMessagesToCookie(dynamicMessages);

                // 清除localStorage中的留言
                localStorage.removeItem('idol-messages');
            } else {
                // 使用默認數據 - 空數組或者可以設置一些初始訊息
                const defaultMessages = [
                    {
                        id: 1000,
                        user: "粉絲小明",
                        content: "你的最新歌曲真的很棒！旋律好聽又洗腦，我已經聽了一整天了！",
                        time: "今天 09:23",
                        status: "待回覆",
                        replies: []
                    },
                    {
                        id: 1001,
                        user: "音樂愛好者",
                        content: "下次直播可以演唱《星空下的約定》嗎？是我最喜歡的一首歌！",
                        time: "昨天 18:45",
                        status: "待回覆",
                        replies: []
                    }
                ];

                setMessages(defaultMessages);
                // 保存默認數據到 cookie
                saveMessagesToCookie(defaultMessages);
            }
        } catch (err) {
            console.error('初始化留言數據時發生錯誤:', err);
            setError('讀取留言數據時發生錯誤');
            // 設置一個空數組以避免進一步的錯誤
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 回覆輸入框狀態
    const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});

    // 控制每個訊息是否顯示 AI 建議
    const [showAISuggestions, setShowAISuggestions] = useState<{ [key: number]: boolean }>({});

    // 分頁相關狀態
    const [currentPage, setCurrentPage] = useState<number>(1);
    const messagesPerPage = 5;
    const totalPages = Math.ceil(messages.length / messagesPerPage);

    // 獲取當前頁的消息
    const getCurrentPageMessages = () => {
        const startIndex = (currentPage - 1) * messagesPerPage;
        return messages.slice(startIndex, startIndex + messagesPerPage);
    };

    // 處理頁碼變更
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 顯示/隱藏 AI 建議
    const toggleAISuggestion = (messageId: number): void => {
        setShowAISuggestions(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    // 處理回覆輸入變更
    const handleReplyInputChange = (messageId: number, value: string): void => {
        setReplyInputs(prev => ({
            ...prev,
            [messageId]: value
        }));
    };

    // 處理發送回覆 - 更新後保存到 cookie
    const handleSendReply = (messageId: number, replyContent: string, mode: string = "情感向"): void => {
        if (!replyContent.trim()) return;

        try {
            // 創建新回覆
            const newReply = {
                id: Date.now(),
                content: replyContent,
                time: "剛剛",
                mode
            };

            // 更新留言狀態
            const updatedMessages = messages.map(message => {
                if (message.id === messageId) {
                    return {
                        ...message,
                        status: "已回覆",
                        replies: [...message.replies, newReply]
                    };
                }
                return message;
            });

            // 更新狀態
            setMessages(updatedMessages);

            // 保存到 cookie
            saveMessagesToCookie(updatedMessages);

            // 清空輸入框
            setReplyInputs(prev => ({
                ...prev,
                [messageId]: ""
            }));

            // 關閉 AI 建議面板（如果有開啟）
            if (showAISuggestions[messageId]) {
                setShowAISuggestions(prev => ({
                    ...prev,
                    [messageId]: false
                }));
            }
        } catch (err) {
            console.error('發送回覆時發生錯誤:', err);
            setError('發送回覆失敗，請稍後再試');
        }
    };

    // 使用預設回覆
    const useRecommendedReply = (messageId: number, replyContent: string): void => {
        setReplyInputs(prev => ({
            ...prev,
            [messageId]: replyContent
        }));
    };

    // 新增留言處理
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddMessage = (content: string): void => {
        try {
            const newMessage = {
                id: Date.now(),
                user: "測試用戶", // 在實際應用中這應該是從用戶資料中獲取
                content,
                time: "剛剛",
                status: "待回覆",
                replies: []
            };

            const updatedMessages = [newMessage, ...messages];
            setMessages(updatedMessages);
            saveMessagesToCookie(updatedMessages);
        } catch (err) {
            console.error('新增留言時發生錯誤:', err);
            setError('新增留言失敗，請稍後再試');
        }
    };

    // 刪除留言處理
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDeleteMessage = (messageId: number): void => {
        try {
            const updatedMessages = messages.filter(message => message.id !== messageId);
            setMessages(updatedMessages);
            saveMessagesToCookie(updatedMessages);
        } catch (err) {
            console.error('刪除留言時發生錯誤:', err);
            setError('刪除留言失敗，請稍後再試');
        }
    };

    // 處理錯誤消息關閉
    const handleDismissError = () => {
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation title="真人 AI 偶像平台" />

            {/* 錯誤通知 */}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                    <button onClick={handleDismissError} className="ml-4 p-1 hover:bg-red-600 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* 載入指示器 */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-gray-700 dark:text-gray-300">載入中...</p>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題與導航 - 增強設計 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">偶像空間</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">管理您的 AI 虛擬偶像及其數據分析</p>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0 space-x-3">

                        <button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
                            onClick={() => window.location.href = '/dashboard/create'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            編輯偶像
                        </button>
                    </div>
                </div>

                {/* 概覽數據 - 更現代化的卡片設計 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mr-4 text-white shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">總粉絲數</h3>
                                    <span className="ml-3 px-2.5 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full flex items-center shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        +12.4%
                                    </span>
                                </div>
                                <div className="mt-2 flex items-end">
                                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{idol.fans}</span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 mb-1">忠實粉絲</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">較上月增加 106 位新粉絲</p>
                            </div>
                        </div>

                        {/* 粉絲成長趨勢小圖表 */}
                        <div className="mt-4 h-12 flex items-end space-x-1">
                            {[35, 42, 38, 45, 40, 52, 58, 55, 60, 65, 63, 68].map((value, i) => (
                                <div
                                    key={i}
                                    className="h-full flex-1 bg-gradient-to-t from-blue-500 to-purple-500 opacity-80 rounded-t"
                                    style={{ height: `${value}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl mr-4 text-white shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">互動次數</h3>
                                    <span className="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full flex items-center shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        月增長
                                    </span>
                                </div>
                                <div className="mt-2 flex items-end">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">8,724</span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 mb-1">次/月</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">平均每日 291 次互動</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl mr-4 text-white shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">互動滿意度</h3>
                                    <span className="ml-3 px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full flex items-center shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        +3.2%
                                    </span>
                                </div>
                                <div className="mt-2 flex items-end">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">92%</span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 mb-1">正面評價</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">較上月提升 3.2 個百分點</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 量化指標區塊 */}
                <div className="mb-8">
                    <QuantitativeMetrics />
                </div>

                {/* 粉絲互動數據與品牌訊息分析 - 左右並排 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    {/* 粉絲互動數據 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                粉絲互動數據
                            </h2>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <select className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option>本週</option>
                                        <option>本月</option>
                                        <option>過去三個月</option>
                                        <option>本年度</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                <button className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg hover:shadow-sm transition-shadow border border-blue-100 dark:border-blue-800/40">
                                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">平均互動率</h3>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">27.3%</span>
                                    <span className="ml-2 text-sm text-green-500 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        4.5%
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-blue-600/70 dark:text-blue-400/70">相較上月</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg hover:shadow-sm transition-shadow border border-purple-100 dark:border-purple-800/40">
                                <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">回覆滿意度</h3>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</span>
                                    <span className="ml-2 text-sm text-green-500 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        3%
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-purple-600/70 dark:text-purple-400/70">相較上月</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg hover:shadow-sm transition-shadow border border-green-100 dark:border-green-800/40">
                                <h3 className="text-sm font-medium text-green-700 dark:text-green-300">粉絲留存率</h3>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">85.7%</span>
                                    <span className="ml-2 text-sm text-green-500 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        2.3%
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-green-600/70 dark:text-green-400/70">相較上月</p>
                            </div>
                        </div>

                        <div className="mt-6 p-1">
                            <InteractionTrend />
                        </div>
                    </div>

                    {/* 品牌訊息點閱分析 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                品牌訊息點閱分析
                            </h2>
                            <div className="flex items-center">
                                <div className="relative">
                                    <select className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>本月</option>
                                        <option>上月</option>
                                        <option>過去 3 個月</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                <button className="ml-2 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-l-lg bg-gray-50 dark:bg-gray-700">訊息類別</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">曝光次數</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">點閱率</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-r-lg bg-gray-50 dark:bg-gray-700">轉換率</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {messageStats.map((stat, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stat.category}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stat.impressions}</td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full" style={{ width: stat.clickRate }}></div>
                                                    </div>
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">{stat.clickRate}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" style={{ width: stat.conversion }}></div>
                                                    </div>
                                                    <span className="text-green-600 dark:text-green-400 font-medium">{stat.conversion}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <div className="flex text-sm text-gray-500 dark:text-gray-400">
                                <span>顯示 1 至 4 筆，共 4 筆</span>
                            </div>
                            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center group px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                查看完整報告
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 內容發布元件 - 更新樣式包裝 */}
                <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        內容排程與發布
                    </h2>
                    <ContentPublisher />
                </div>
            </main>

            {/* 粉絲留言串檢視 - 更新設計 */}



            <MessageThreads
                messages={getCurrentPageMessages()}
                replyInputs={replyInputs}
                showAISuggestions={showAISuggestions}
                handleReplyInputChange={handleReplyInputChange}
                handleSendReply={handleSendReply}
                toggleAISuggestion={toggleAISuggestion}
                useRecommendedReply={useRecommendedReply}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* 添加動態數據統計 - 增加更多可視化信息 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                            <h3 className="text-sm font-medium opacity-90">今日新增粉絲</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold">24</span>
                                <span className="ml-2 text-sm opacity-75">位</span>
                            </div>
                            <div className="mt-2 flex items-center text-xs">
                                <span className="flex items-center bg-green-500/20 px-1.5 py-0.5 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                    +16%
                                </span>
                                <span className="ml-2 opacity-75">較昨日</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                            <h3 className="text-sm font-medium opacity-90">待回覆訊息</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold">12</span>
                                <span className="ml-2 text-sm opacity-75">則</span>
                            </div>
                            <div className="mt-2 flex items-center text-xs">
                                <span className="flex items-center bg-yellow-500/20 px-1.5 py-0.5 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    優先處理
                                </span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                            <h3 className="text-sm font-medium opacity-90">本週互動數量</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold">1,872</span>
                                <span className="ml-2 text-sm opacity-75">次</span>
                            </div>
                            <div className="mt-2 flex items-center text-xs">
                                <span className="flex items-center bg-green-500/20 px-1.5 py-0.5 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                    +8.2%
                                </span>
                                <span className="ml-2 opacity-75">較上週</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                            <h3 className="text-sm font-medium opacity-90">下個預定活動</h3>
                            <div className="mt-2">
                                <span className="text-xl font-bold">音樂直播</span>
                            </div>
                            <div className="mt-2 flex items-center text-xs">
                                <span className="flex items-center bg-blue-500/20 px-1.5 py-0.5 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    3天後
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 頁腳 */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-1 mb-4 md:mb-0">
                            <span className="text-sm text-gray-500 dark:text-gray-400">© 2025 真人 AI 偶像平台</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">使用條款</a>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">隱私政策</a>
                        </div>
                        <div className="flex space-x-4">
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 