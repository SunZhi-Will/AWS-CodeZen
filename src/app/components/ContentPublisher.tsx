'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';



export default function ContentPublisher() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const [contentType, setContentType] = useState('text');
    const [content, setContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 自訂欄位
    const [customMode] = useState(false);
    const [idolName] = useState('RM (金南俊)');
    const [musicArtist] = useState('');
    const [customEmbeddedUrl] = useState('');

    // 推薦內容整合區塊設定
    const [customRecommendations, setCustomRecommendations] = useState(false);
    const [selectedRecommendationTypes, setSelectedRecommendationTypes] = useState<string[]>([
        'music', 'video', 'topic', 'similar'
    ]);
    const [randomRecommendations, setRandomRecommendations] = useState(false);

    // 處理媒體檔案上傳
    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 建立預覽
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 使用 AI 生成內容
    const generateContent = async () => {
        setIsGenerating(true);

        // 模擬 AI 生成過程
        setTimeout(() => {
            setGeneratedVariants([
                '今天的練習很充實，每天都在進步！#BTS #練習日常',
                '這首歌的靈感來自於海邊的日落，希望 ARMY 會喜歡 🌊 #防彈少年團 #新歌創作',
                '想聽聽 ARMY 的意見，這個旋律如何？期待你們的回饋！#BTS #與粉絲互動',
                '新歌預告！下週即將發布，敬請期待 🎵 #防彈少年團 #新歌'
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    // 處理發布內容
    const handlePublish = async () => {
        const contentToPublish = selectedVariant !== null ? generatedVariants[selectedVariant] : content;

        if (!contentToPublish.trim()) {
            setError('請輸入內容或選擇生成的內容');
            return;
        }

        setIsPublishing(true);
        setError(null);

        try {
            // 處理媒體文件 (這裡只是設置假的 URL，真實情況下應上傳到伺服器或 CDN)
            let imageUrl = null;
            let embeddedUrl = null;

            // 在實際應用中，這裡應該上傳媒體文件到伺服器或 CDN
            if (contentType === 'image' && mediaPreview) {
                imageUrl = mediaPreview;
            } else if (contentType === 'video' && mediaPreview) {
                embeddedUrl = customMode && customEmbeddedUrl ? customEmbeddedUrl : "https://www.youtube.com/embed/gdZLi9oWNZg";
            }

            // 準備發布數據
            const publishData = {
                idolName: idolName,
                content: contentToPublish,
                postType: contentType,
                imageUrl,
                embeddedUrl: customMode && customEmbeddedUrl && contentType !== 'video' ? customEmbeddedUrl : embeddedUrl,
                ...(contentType === 'music' && {
                    musicArtist: musicArtist || `${idolName}`,
                    embeddedUrl: customMode && customEmbeddedUrl ? customEmbeddedUrl : "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1234567890&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                }),
                // 推薦內容設置
                recommendations: {
                    custom: customRecommendations,
                    random: randomRecommendations,
                    selectedTypes: selectedRecommendationTypes
                }
            };

            // 發送到 API 端點
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(publishData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '發布失敗');
            }

            // 重置表單
            setContent('');
            setGeneratedVariants([]);
            setSelectedVariant(null);
            setMediaPreview(null);
            setIsOpen(false);

            // 直接將新發布的內容添加到目前顯示的貼文列表中，而不使用完全刷新
            // 使用自定義事件通知父組件更新
            const newPostEvent = new CustomEvent('newPostPublished', {
                detail: result.post
            });
            window.dispatchEvent(newPostEvent);

            // 額外的頁面更新
            router.refresh();
        } catch (error) {
            console.error('發布失敗:', error);
            setError(error instanceof Error ? error.message : '發布失敗，請稍後再試');
        } finally {
            setIsPublishing(false);
        }
    };



    return (
        <div>
            {/* 浮動按鈕 */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>

            {/* 彈跳視窗 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">發布核心內容</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                                <button
                                    className={`pb-2 px-4 text-sm font-medium ${activeTab === 'create' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                    onClick={() => setActiveTab('create')}
                                >
                                    立即發布
                                </button>
                                <button
                                    className={`pb-2 px-4 text-sm font-medium ${activeTab === 'schedule' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                    onClick={() => setActiveTab('schedule')}
                                >
                                    排程發布
                                </button>
                            </div>

                            {/* 內容類型選擇 */}
                            <div className="flex space-x-2 mb-4">
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${contentType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => setContentType('text')}
                                >
                                    文字
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${contentType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => setContentType('image')}
                                >
                                    圖片
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${contentType === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => setContentType('video')}
                                >
                                    短影片
                                </button>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md ${contentType === 'music' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                    onClick={() => setContentType('music')}
                                >
                                    音樂
                                </button>
                            </div>

                            {/* 內容輸入區域 */}
                            <div className="mb-5 space-y-4">
                                <motion.div
                                    className="relative rounded-lg overflow-hidden"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <textarea
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        rows={4}
                                        placeholder="輸入內容或使用 AI 生成..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    ></textarea>
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                        {content.length}/280
                                    </div>
                                </motion.div>

                                {(contentType === 'image' || contentType === 'video') && (
                                    <motion.div
                                        className="mt-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            上傳{contentType === 'image' ? '圖片' : '影片'}
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            {mediaPreview ? (
                                                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                                    {contentType === 'image' ? (
                                                        <div className="relative h-48 w-full group">
                                                            <Image
                                                                src={mediaPreview}
                                                                alt="上傳預覽"
                                                                fill
                                                                style={{ objectFit: 'cover' }}
                                                                className="rounded-lg transition-all group-hover:brightness-75"
                                                            />
                                                            <motion.button
                                                                onClick={() => {
                                                                    setMediaPreview(null);
                                                                }}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </motion.button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                                                            <div className="flex flex-col items-center text-white">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">影片已上傳</span>
                                                            </div>
                                                            <motion.button
                                                                onClick={() => {
                                                                    setMediaPreview(null);
                                                                }}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </motion.button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                        </svg>
                                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">點擊上傳</span> 或拖放檔案
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {contentType === 'image' ? 'PNG, JPG 或 GIF' : 'MP4, MOV 或 AVI'}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept={contentType === 'image' ? 'image/*' : 'video/*'}
                                                        onChange={handleMediaUpload}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.button
                                    className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${isGenerating
                                        ? 'bg-purple-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                        } text-white shadow-md`}
                                    onClick={generateContent}
                                    disabled={isGenerating}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            內容生成中...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            生成內容建議
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* 排程設定 */}
                            <AnimatePresence>
                                {activeTab === 'schedule' && (
                                    <motion.div
                                        className="grid grid-cols-2 gap-4 mb-5"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">發布日期</label>
                                            <input
                                                type="date"
                                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">發布時間</label>
                                            <input
                                                type="time"
                                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* AI 生成的變體選項 */}
                            <AnimatePresence>
                                {generatedVariants.length > 0 && (
                                    <motion.div
                                        className="mt-5 mb-5"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: "spring", damping: 25 }}
                                    >
                                        <h3 className="text-sm font-medium mb-3 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            核心內容確認
                                        </h3>
                                        <div className="space-y-2.5">
                                            {generatedVariants.map((variant, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${selectedVariant === idx
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                        }`}
                                                    onClick={() => setSelectedVariant(idx)}
                                                    whileHover={{ y: -2, x: 0 }}
                                                    whileTap={{ y: 0 }}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: { delay: 0.1 * idx }
                                                    }}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-4 h-4 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${selectedVariant === idx ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
                                                            }`}>
                                                            {selectedVariant === idx && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-sm">{variant}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 四大發散方向 */}
                            <motion.div
                                className="mt-5"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-sm font-medium mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    四大發散方向
                                </h3>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <motion.button
                                        className="p-2.5 text-xs text-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors flex items-center justify-center"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        趣味回應
                                    </motion.button>
                                    <motion.button
                                        className="p-2.5 text-xs text-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/40 transition-colors flex items-center justify-center"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        情感連結
                                    </motion.button>
                                    <motion.button
                                        className="p-2.5 text-xs text-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors flex items-center justify-center"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        品牌宣傳
                                    </motion.button>
                                    <motion.button
                                        className="p-2.5 text-xs text-center bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-100 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors flex items-center justify-center"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        專業分享
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* 推薦內容整合區塊設置 */}
                            <motion.div
                                className="mt-5 border-t border-gray-100 dark:border-gray-700 pt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <h3 className="text-sm font-medium mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    推薦內容整合區塊
                                </h3>

                                <div className="flex items-center mb-3">
                                    <div className="flex items-center mr-4">
                                        <input
                                            id="recommendation-custom"
                                            type="checkbox"
                                            checked={customRecommendations}
                                            onChange={() => setCustomRecommendations(!customRecommendations)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                        />
                                        <label htmlFor="recommendation-custom" className="ml-2 text-xs text-gray-700 dark:text-gray-300">自訂推薦</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="recommendation-random"
                                            type="checkbox"
                                            checked={randomRecommendations}
                                            onChange={() => setRandomRecommendations(!randomRecommendations)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                        />
                                        <label htmlFor="recommendation-random" className="ml-2 text-xs text-gray-700 dark:text-gray-300">隨機推薦</label>
                                    </div>
                                </div>

                                {customRecommendations && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">選擇要顯示的推薦內容類型：</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'music', label: '相關音樂' },
                                                { id: 'video', label: '相關影片' },
                                                { id: 'topic', label: '相關主題' },
                                                { id: 'similar', label: '你可能也喜歡' },
                                                { id: 'event', label: '最新活動' },
                                                { id: 'article', label: '相關文章' },
                                                { id: 'product', label: '周邊商品' }
                                            ].map(item => (
                                                <div key={item.id} className="flex items-center">
                                                    <input
                                                        id={`rec-${item.id}`}
                                                        type="checkbox"
                                                        checked={selectedRecommendationTypes.includes(item.id)}
                                                        onChange={() => {
                                                            if (selectedRecommendationTypes.includes(item.id)) {
                                                                setSelectedRecommendationTypes(prev =>
                                                                    prev.filter(type => type !== item.id)
                                                                );
                                                            } else {
                                                                setSelectedRecommendationTypes(prev => [...prev, item.id]);
                                                            }
                                                        }}
                                                        className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`rec-${item.id}`} className="ml-1.5 text-xs text-gray-700 dark:text-gray-300">
                                                        {item.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* 發佈按鈕 */}
                            <motion.div
                                className="mt-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    className={`w-full py-3 rounded-lg transition-all flex items-center justify-center ${isPublishing
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : generatedVariants.length > 0 && selectedVariant === null
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                        } text-white font-medium`}
                                    onClick={handlePublish}
                                    disabled={isPublishing || (generatedVariants.length > 0 && selectedVariant === null)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    {isPublishing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            發布中...
                                        </>
                                    ) : activeTab === 'schedule' ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            排程發布
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                            立即發布
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}