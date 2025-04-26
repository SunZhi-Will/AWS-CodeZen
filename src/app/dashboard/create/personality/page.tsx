import Link from 'next/link';
import Navigation from '../../../components/Navigation';

export default function IdolPersonality() {
    // 預設個性特質選項
    const personalityTraits = [
        { id: 'extrovert', name: '外向', description: '喜歡社交互動，精力充沛，樂於表達' },
        { id: 'introvert', name: '內向', description: '安靜沉思，獨處自在，深度思考者' },
        { id: 'confident', name: '自信', description: '相信自己能力，不怕挑戰，展現領導力' },
        { id: 'humble', name: '謙遜', description: '不張揚，欣賞他人，樂於學習' },
        { id: 'cheerful', name: '開朗', description: '總是積極樂觀，能帶動氣氛，笑容滿面' },
        { id: 'serious', name: '嚴肅', description: '專注認真，處事謹慎，注重細節' },
        { id: 'empathetic', name: '善解人意', description: '能理解他人感受，富有同情心' },
        { id: 'logical', name: '理性', description: '分析思考，重視邏輯，決策客觀' },
        { id: 'creative', name: '創意', description: '富有想像力，思維開放，喜歡創新' },
        { id: 'traditional', name: '傳統', description: '重視經驗，尊重價值觀，穩定可靠' },
    ];

    // 互動風格選項
    const interactionStyles = [
        { id: 'caring', name: '關懷型', description: '總是關心粉絲，富有同理心，溫暖親切' },
        { id: 'playful', name: '調皮型', description: '喜歡開玩笑，互動有趣，充滿活力' },
        { id: 'professional', name: '專業型', description: '保持適當距離，專注於工作內容，穩重可靠' },
        { id: 'mysterious', name: '神秘型', description: '不完全袒露自己，保持一定神秘感，吸引好奇心' },
        { id: 'inspirational', name: '激勵型', description: '經常鼓勵粉絲，分享正能量，追求進步' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation title="真人 AI 偶像平台" />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 頁面標題 */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link href="/dashboard/create/voice" className="text-blue-600 dark:text-blue-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">偶像個性設定</h1>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">第 4 步，共 4 步</p>
                </div>

                {/* 主要表單內容 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* 個性特質選擇 */}
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">選擇主要個性特質</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                選擇最能代表您偶像的3-5個個性特質，這將決定偶像與粉絲互動的方式和內容風格。
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {personalityTraits.map((trait) => (
                                    <div key={trait.id} className="relative flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={`trait-${trait.id}`}
                                                name="personality-traits"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`trait-${trait.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                                                {trait.name}
                                            </label>
                                            <p className="text-gray-500 dark:text-gray-400">{trait.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 粉絲互動風格 */}
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">選擇粉絲互動風格</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                選擇您偶像與粉絲互動時的主要風格，這將影響偶像在社交媒體和直播中的表現方式。
                            </p>

                            <div className="space-y-3">
                                {interactionStyles.map((style) => (
                                    <div key={style.id} className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={`style-${style.id}`}
                                                name="interaction-style"
                                                type="radio"
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`style-${style.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                                                {style.name}
                                            </label>
                                            <p className="text-gray-500 dark:text-gray-400">{style.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 興趣和專長 */}
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">興趣與專長</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                設定您偶像的興趣和專長，這些內容將成為偶像創作和交流的主要話題。
                            </p>

                            <div className="mb-4">
                                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    興趣愛好
                                </label>
                                <input
                                    type="text"
                                    id="interests"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                    placeholder="例如：繪畫、遊戲、烹飪、旅行..."
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    使用逗號分隔多個興趣
                                </p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    專長領域
                                </label>
                                <input
                                    type="text"
                                    id="specialties"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                    placeholder="例如：唱歌、舞蹈、作詞作曲、編程..."
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    輸入您希望偶像擁有的專業技能和專長
                                </p>
                            </div>

                            <div>
                                <label htmlFor="content-topics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    常談論的話題
                                </label>
                                <textarea
                                    id="content-topics"
                                    rows={3}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                    placeholder="例如：最新科技動態、音樂創作心得、生活小技巧..."
                                ></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    描述偶像經常分享和討論的內容主題
                                </p>
                            </div>
                        </div>

                        {/* 背景故事 */}
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">背景故事</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                為您的偶像創建一個簡短的背景故事，以增加角色的深度和真實感。
                            </p>

                            <div className="mb-4">
                                <label htmlFor="background-story" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    簡短背景故事
                                </label>
                                <textarea
                                    id="background-story"
                                    rows={5}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md"
                                    placeholder="描述偶像的成長經歷、重要人生事件、夢想目標等..."
                                ></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    這將幫助AI理解您偶像的價值觀和動機
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 按鈕區 */}
                    <div className="mt-8 flex justify-between">
                        <Link href="/dashboard/create/voice" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            上一步
                        </Link>
                        <Link href="/dashboard/create/review" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            完成並預覽
                        </Link>
                    </div>
                </div>

                {/* 提示區域 */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">設計小提示</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                        創建一個多維度的角色會讓您的偶像更加真實可信。考慮設計一些不完美之處或小缺點，這些特質常常會讓角色更加真實和具有吸引力。還要考慮偶像的成長空間和發展方向，讓粉絲能夠見證角色的成長。
                    </p>
                </div>
            </main>
        </div>
    );
}