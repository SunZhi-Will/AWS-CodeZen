'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import Image from 'next/image';

export default function ReviewIdol() {
    const router = useRouter();
    const [idolData, setIdolData] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 從localStorage中取得暫存的偶像資料
        try {
            const savedData = localStorage.getItem('idolCreationData');
            if (savedData) {
                setIdolData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error('無法讀取偶像資料:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleGoBack = () => {
        router.back();
    };

    const handleConfirm = () => {
        // 此處可添加將偶像資料提交到後端的邏輯
        alert('成功創建偶像！');
        // 創建成功後導向儀表板
        router.push('/dashboard');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Navigation title="真人 AI 偶像平台" />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="ml-2 text-gray-700 dark:text-gray-300">載入中...</p>
                </div>
            </div>
        );
    }

    if (!idolData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Navigation title="真人 AI 偶像平台" />
                <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                    <div className="text-center py-10">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">無法找到偶像資料</h1>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">請返回並完成所有步驟</p>
                        <button
                            onClick={() => router.push('/dashboard/create')}
                            className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            返回創建流程
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation title="真人 AI 偶像平台" />
            <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">確認偶像資料</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">請確認以下設定無誤後提交</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 左側：基本資料與性格 */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">基本資訊</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">偶像名稱</p>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">{idolData.name || '未設定'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">類別</p>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">{idolData.category || '未設定'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">簡介</p>
                                        <p className="mt-1 text-base text-gray-900 dark:text-white">{idolData.description || '未設定'}</p>
                                    </div>
                                </div>

                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-8 mb-4">性格特質</h4>
                                <div className="flex flex-wrap gap-2">
                                    {idolData.personality?.traits?.map((trait: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                            {trait}
                                        </span>
                                    )) || <p className="text-gray-500 dark:text-gray-400">未設定性格特質</p>}
                                </div>
                            </div>

                            {/* 右側：外觀與聲音 */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">外觀設定</h4>
                                {idolData.appearance?.imageUrl ? (
                                    <div className="mb-4">
                                        <Image
                                            src={idolData.appearance.imageUrl}
                                            alt="偶像外觀"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500 dark:text-gray-400">未上傳外觀圖片</p>
                                    </div>
                                )}

                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-8 mb-4">聲音設定</h4>
                                {idolData.voice?.sample ? (
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <audio controls className="w-full">
                                            <source src={idolData.voice.sample} type="audio/mp3" />
                                            您的瀏覽器不支援音訊播放
                                        </audio>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">未設定聲音樣本</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                            返回編輯
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:from-blue-600 hover:to-purple-700"
                        >
                            確認創建
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
} 