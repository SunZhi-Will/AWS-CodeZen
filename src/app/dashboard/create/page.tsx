import Link from 'next/link';
import Navigation from '../../components/Navigation';

export default function CreateIdol() {
    // 偶像特質選項
    const personalityTraits = [
        '開朗活潑', '溫柔體貼', '聰明睿智', '堅強勇敢', '神祕冷酷',
        '浪漫多情', '幽默風趣', '認真負責', '天真可愛', '成熟穩重'
    ];

    // 偶像類型選項
    const idolTypes = [
        { id: 'singer', name: '歌手', icon: '🎤' },
        { id: 'actor', name: '演員', icon: '🎭' },
        { id: 'teacher', name: '教師', icon: '📚' },
        { id: 'companion', name: '心靈伴侶', icon: '💖' },
        { id: 'gamer', name: '遊戲玩家', icon: '🎮' },
        { id: 'custom', name: '自定義', icon: '✨' }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation title="真人 AI 偶像平台" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">創建新偶像</h1>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">第 1 步，共 4 步</p>
                </div>

                {/* 主要表單內容 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* 第一步：基本信息 */}
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">基本信息</h2>

                            <div className="mb-4">
                                <label htmlFor="idol-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">偶像名稱</label>
                                <input
                                    type="text"
                                    id="idol-name"
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2"
                                    placeholder="請輸入偶像名稱"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">名稱將用於展示和粉絲互動，建議簡潔且易記</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">偶像類型</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {idolTypes.map((type) => (
                                        <div key={type.id} className="relative">
                                            <input type="radio" id={type.id} name="idol-type" value={type.id} className="sr-only peer" />
                                            <label htmlFor={type.id} className="flex items-center p-3 bg-white dark:bg-gray-700 border rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 hover:text-gray-600 dark:peer-checked:text-blue-400">
                                                <span className="mr-2 text-xl">{type.icon}</span>
                                                <span>{type.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">選擇性格特質（最多選3個）</label>
                                <div className="flex flex-wrap gap-2">
                                    {personalityTraits.map((trait, index) => (
                                        <div key={index} className="relative">
                                            <input type="checkbox" id={`trait-${index}`} name="personality-traits" value={trait} className="sr-only peer" />
                                            <label htmlFor={`trait-${index}`} className="px-3 py-1 border rounded-full text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 dark:peer-checked:text-blue-400">
                                                {trait}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="idol-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">偶像介紹</label>
                                <textarea
                                    id="idol-description"
                                    rows={4}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2"
                                    placeholder="請描述您的偶像背景故事、興趣和專長..."
                                ></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">介紹將幫助AI塑造更符合您期望的偶像個性</p>
                            </div>
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="mt-8 flex justify-between">
                        <Link href="/dashboard" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            取消
                        </Link>
                        <Link href="/dashboard/create/appearance" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            繼續：外觀設計
                        </Link>
                    </div>
                </div>

                {/* 提示區域 */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">創建小提示</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                        您創建的偶像將擁有獨特的個性和專長。使偶像的特質更具體和特別，可以讓粉絲更容易被吸引並建立情感連結。
                    </p>
                </div>
            </main>
        </div>
    );
}