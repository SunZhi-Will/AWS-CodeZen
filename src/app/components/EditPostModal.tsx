'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 貼文類型定義
interface PostProps {
    id: string;
    idolName: string;
    idolAvatar?: string | null;
    avatarText?: string;
    content: string;
    imageUrl?: string;
    imageText?: string;
    videoUrl?: string;
    musicTitle?: string;
    musicArtist?: string;
    musicDuration?: string;
    embeddedUrl?: string;
    audioUrl?: string;
    audioCoverUrl?: string;
    postType: string;
    likes: number;
    comments: number;
    timestamp: string;
    isLiked?: boolean;
}

interface EditPostModalProps {
    post: PostProps | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedPost: PostProps) => void;
}

export default function EditPostModal({ post, isOpen, onClose, onSave }: EditPostModalProps) {
    const router = useRouter();
    const [contentType, setContentType] = useState('text');
    const [content, setContent] = useState('');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 自訂欄位
    const [customEmbeddedUrl, setCustomEmbeddedUrl] = useState('');
    const [musicTitle, setMusicTitle] = useState('');
    const [musicArtist, setMusicArtist] = useState('');

    // 初始化表單
    useEffect(() => {
        if (post) {
            setContentType(post.postType);
            setContent(post.content);
            setMediaPreview(post.imageUrl || post.videoUrl || post.audioUrl || null);
            setCustomEmbeddedUrl(post.embeddedUrl || '');
            setMusicTitle(post.musicTitle || '');
            setMusicArtist(post.musicArtist || '');
        }
    }, [post]);

    // 處理媒體檔案上傳
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 設置本地預覽
            const reader = new FileReader();
            reader.onloadend = () => {
                // 暫存 DataURL 用於預覽
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 處理表單提交
    const handleSave = async () => {
        if (!post) return;

        if (!content.trim()) {
            setError('請輸入內容');
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            // 處理內容和媒體文件
            let imageUrl = null;
            let videoUrl = null;
            let audioUrl = null;
            const embeddedUrl = customEmbeddedUrl;

            // 檢查 mediaPreview 是否為 Data URL (本地暫存圖片)
            if (mediaPreview && mediaPreview.startsWith('data:')) {
                // 這是暫存的檔案，需要上傳到 S3
                try {
                    // 將 Data URL 轉回 Blob 進行上傳
                    const response = await fetch(mediaPreview);
                    const blob = await response.blob();
                    const file = new File([blob],
                        `upload-${Date.now()}.${contentType === 'image' ? 'png' : 'mp4'}`,
                        { type: blob.type });

                    // 準備 FormData 進行上傳
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', contentType === 'image' ? 'images' : 'videos');

                    // 發送上傳請求到 S3
                    const uploadResponse = await fetch('/api/aws/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!uploadResponse.ok) {
                        const errorData = await uploadResponse.json();
                        throw new Error(errorData.error || '上傳失敗');
                    }

                    const data = await uploadResponse.json();
                    console.log('文件已成功上傳至 S3:', data.url);

                    // 設置媒體 URL
                    if (contentType === 'image') {
                        imageUrl = data.url;
                    } else if (contentType === 'video') {
                        videoUrl = data.url;
                    } else if (contentType === 'music') {
                        audioUrl = data.url;
                    }

                } catch (uploadError) {
                    console.error('上傳失敗:', uploadError);
                    throw new Error(uploadError instanceof Error ? uploadError.message : '檔案上傳失敗');
                }
            } else if (mediaPreview && mediaPreview.startsWith('http')) {
                // 已經是 S3 URL，直接使用
                if (contentType === 'image') {
                    imageUrl = mediaPreview;
                } else if (contentType === 'video') {
                    videoUrl = mediaPreview;
                } else if (contentType === 'music') {
                    audioUrl = mediaPreview;
                }
            }

            // 準備更新數據
            const updateData = {
                content,
                postType: contentType,
                ...(imageUrl && { imageUrl }),
                ...(videoUrl && { videoUrl }),
                ...(audioUrl && { audioUrl }),
                ...(embeddedUrl && { embeddedUrl }),
                ...(contentType === 'music' && {
                    musicTitle: musicTitle || `${post.idolName} 的音樂`,
                    musicArtist: musicArtist || post.idolName,
                    musicDuration: post.musicDuration || "3:45" // 保留原始時長或使用預設值
                }),
            };

            // 發送到 API 端點
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '更新失敗');
            }

            // 關閉模態窗口並通知父組件更新
            onSave(result.post);
            onClose();

            // 頁面更新
            router.refresh();
        } catch (error) {
            console.error('更新貼文失敗:', error);
            setError(error instanceof Error ? error.message : '更新失敗，請稍後再試');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!post) return null;

    return (
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
                            <h2 className="text-lg font-medium">編輯貼文</h2>
                            <button
                                onClick={onClose}
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
                                    placeholder="輸入內容..."
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
                                                            className="rounded-lg transition-all group-hover:brightness-75 h-full w-full object-cover"
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

                            {contentType === 'music' && (
                                <motion.div
                                    className="mt-4 space-y-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            歌曲標題
                                        </label>
                                        <input
                                            type="text"
                                            value={musicTitle}
                                            onChange={(e) => setMusicTitle(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="輸入歌曲標題"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            音樂創作者
                                        </label>
                                        <input
                                            type="text"
                                            value={musicArtist}
                                            onChange={(e) => setMusicArtist(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="輸入創作者"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            嵌入 URL (YouTube, SoundCloud)
                                        </label>
                                        <input
                                            type="text"
                                            value={customEmbeddedUrl}
                                            onChange={(e) => setCustomEmbeddedUrl(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="輸入嵌入URL (選填)"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 儲存按鈕 */}
                        <motion.div
                            className="mt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                className={`w-full py-3 rounded-lg transition-all flex items-center justify-center ${isUpdating
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                    } text-white font-medium`}
                                onClick={handleSave}
                                disabled={isUpdating}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                {isUpdating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        更新中...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        儲存變更
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 