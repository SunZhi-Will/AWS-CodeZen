import Link from 'next/link';
import Navigation from '../../../components/Navigation';

export default function IdolVoice() {
    // 示例聲音風格
    const voiceStyles = [
        { id: 'sweet', name: '甜美', description: '溫柔甜美的聲線，適合可愛形象的偶像' },
        { id: 'mature', name: '成熟', description: '低沉成熟的聲線，散發自信魅力' },
        { id: 'energetic', name: '活力', description: '充滿活力的聲音，適合陽光開朗的偶像' },
        { id: 'soft', name: '輕柔', description: '輕柔細膩的聲線，給人安心的感覺' },
        { id: 'powerful', name: '強勁', description: '強勁有力的聲線，適合舞台表現' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation title="真人 AI 偶像平台" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link href="/dashboard/create/appearance" className="text-blue-600 dark:text-blue-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">偶像聲音設定</h1>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">第 3 步，共 4 步</p>
                </div>

                {/* 主要表單內容 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* 聲音設計步驟 */}
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">設計偶像的聲音</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">選擇聲音風格</label>
                                <div className="space-y-3">
                                    {voiceStyles.map((style) => (
                                        <div key={style.id} className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`voice-${style.id}`}
                                                    name="voice-style"
                                                    type="radio"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={`voice-${style.id}`} className="font-medium text-gray-700 dark:text-gray-300">{style.name}</label>
                                                <p className="text-gray-500 dark:text-gray-400">{style.description}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>
                                                    試聽
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">聲音特性調整</label>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label htmlFor="pitch" className="text-sm text-gray-600 dark:text-gray-400">音調</label>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">中等</span>
                                        </div>
                                        <input
                                            type="range"
                                            id="pitch"
                                            min="1"
                                            max="10"
                                            defaultValue="5"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                        <div className="flex justify-between text-xs mt-1">
                                            <span>低沉</span>
                                            <span>高亢</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label htmlFor="speed" className="text-sm text-gray-600 dark:text-gray-400">語速</label>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">中等</span>
                                        </div>
                                        <input
                                            type="range"
                                            id="speed"
                                            min="1"
                                            max="10"
                                            defaultValue="5"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                        <div className="flex justify-between text-xs mt-1">
                                            <span>緩慢</span>
                                            <span>快速</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label htmlFor="clarity" className="text-sm text-gray-600 dark:text-gray-400">清晰度</label>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">高</span>
                                        </div>
                                        <input
                                            type="range"
                                            id="clarity"
                                            min="1"
                                            max="10"
                                            defaultValue="8"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                        <div className="flex justify-between text-xs mt-1">
                                            <span>模糊</span>
                                            <span>清晰</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="voice-sample" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">測試您的偶像聲音</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        id="voice-sample"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                        placeholder="輸入文字以試聽偶像聲音..."
                                        defaultValue="大家好，很高興認識你們！"
                                    />
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                        </svg>
                                        試聽
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    試聽您的偶像聲音來確保它符合您的期望
                                </p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="voice-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">其他聲音描述</label>
                                <textarea
                                    id="voice-description"
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2"
                                    placeholder="請描述其他您希望的聲音特徵..."
                                ></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">描述您希望偶像聲音的特殊要求，例如：音域變化、語尾習慣、特定口頭禪等</p>
                            </div>
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="mt-8 flex justify-between">
                        <Link href="/dashboard/create/appearance" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            上一步
                        </Link>
                        <Link href="/dashboard/create/personality" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            繼續：進階個性設定
                        </Link>
                    </div>
                </div>

                {/* 提示區域 */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">設計小提示</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                        偶像的聲音是其個性的重要組成部分，它決定了偶像與粉絲互動的感受。考慮您偶像的整體形象，選擇能夠增強其個性特點和魅力的聲音風格。
                    </p>
                </div>
            </main>
        </div>
    );
} 