import Link from 'next/link';
import Navigation from '../../../components/Navigation';

export default function IdolAppearance() {
    // 示例預設造型
    const presetStyles = [
        { id: 'casual', name: '休閒風格', image: '/images/idol-casual.jpg' },
        { id: 'elegant', name: '優雅風格', image: '/images/idol-elegant.jpg' },
        { id: 'sporty', name: '運動風格', image: '/images/idol-sporty.jpg' },
        { id: 'gothic', name: '哥特風格', image: '/images/idol-gothic.jpg' },
        { id: 'streetwear', name: '街頭風格', image: '/images/idol-street.jpg' },
        { id: 'custom', name: '自定義風格', image: '/images/idol-custom.jpg' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation title="真人 AI 偶像平台" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link href="/dashboard/create" className="text-blue-600 dark:text-blue-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">偶像外觀設計</h1>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">第 2 步，共 4 步</p>
                </div>

                {/* 主要表單內容 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* 外觀設計步驟 */}
                        <div>
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">選擇偶像外觀</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">選擇預設風格（可稍後自定義）</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {presetStyles.map((style) => (
                                        <div key={style.id} className="relative">
                                            <input type="radio" id={style.id} name="appearance-style" value={style.id} className="sr-only peer" />
                                            <label htmlFor={style.id} className="cursor-pointer block overflow-hidden rounded-lg border-2 peer-checked:border-blue-500 dark:peer-checked:border-blue-400">
                                                <div className="bg-gray-200 dark:bg-gray-700 w-full aspect-square flex items-center justify-center">
                                                    <span className="text-4xl">{style.id === 'custom' ? '✨' : '👤'}</span>
                                                </div>
                                                <div className="p-2 text-center">
                                                    <span className="text-sm font-medium">{style.name}</span>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">選擇偶像的基本風格，將影響其衣著、髮型和整體形象</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">身體類型</label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input id="body-slim" name="body-type" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                                        <label htmlFor="body-slim" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">纖細</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="body-average" name="body-type" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <label htmlFor="body-average" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">適中</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="body-athletic" name="body-type" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <label htmlFor="body-athletic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">健壯</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="body-curvy" name="body-type" type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                        <label htmlFor="body-curvy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">曲線</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">髮型與髮色</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="hair-style" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">髮型</label>
                                        <select id="hair-style" className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                            <option value="short">短髮</option>
                                            <option value="medium">中長髮</option>
                                            <option value="long">長髮</option>
                                            <option value="wavy">波浪捲髮</option>
                                            <option value="curly">捲髮</option>
                                            <option value="ponytail">馬尾</option>
                                            <option value="braids">辮子</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="hair-color" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">髮色</label>
                                        <div className="flex space-x-2">
                                            {['#000000', '#6B3E2E', '#F5DEB3', '#D3B091', '#FF6347', '#800080', '#4169E1'].map((color) => (
                                                <div key={color} className="relative">
                                                    <input type="radio" id={`color-${color}`} name="hair-color" value={color} className="sr-only peer" />
                                                    <label
                                                        htmlFor={`color-${color}`}
                                                        className="block w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-blue-500"
                                                        style={{ backgroundColor: color }}
                                                    ></label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">身高</label>
                                <div className="flex items-center">
                                    <input
                                        type="range"
                                        id="height"
                                        min="150"
                                        max="190"
                                        defaultValue="165"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 w-16" id="height-value">165 cm</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="appearance-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">其他外觀描述</label>
                                <textarea
                                    id="appearance-description"
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2"
                                    placeholder="請描述其他您希望的外觀特徵..."
                                ></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">描述您偶像的獨特外貌特徵，例如：膚色、眼睛顏色、特殊標記等</p>
                            </div>
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="mt-8 flex justify-between">
                        <Link href="/dashboard/create" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            上一步
                        </Link>
                        <Link href="/dashboard/create/voice" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            繼續：聲音設定
                        </Link>
                    </div>
                </div>

                {/* 提示區域 */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">設計小提示</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                        偶像的外觀是建立第一印象的關鍵。選擇符合偶像個性的外觀風格，將幫助建立一致且有說服力的形象。您可以在後續步驟中進一步自定義細節。
                    </p>
                </div>
            </main>
        </div>
    );
} 