import Link from 'next/link';

export default function AdminPage() {
    // 快速統計數據
    const quickStats = [
        { label: '總粉絲數', value: '15,342', change: '+5.2%', color: 'text-green-500' },
        { label: '昨日活躍用戶', value: '3,721', change: '+12.3%', color: 'text-green-500' },
        { label: '平均互動率', value: '24.8%', change: '-1.5%', color: 'text-red-500' },
        { label: '本週訊息排程', value: '28', change: '+8', color: 'text-green-500' },
    ];

    // 功能卡片
    const featureCards = [
        {
            title: '用戶行為總覽',
            description: '查看粉絲的在線趨勢、活躍熱區與行為偏好',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            link: '/admin/user-behavior'
        },
        {
            title: '記憶標籤檢視',
            description: '查看和編輯粉絲的關鍵標籤，如生日、喜好和近期情緒',
            icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
            link: '/admin/memory-tags'
        },
        {
            title: '訊息排程中心',
            description: '檢視和管理即將發送的生日、紀念日或活動推送',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            link: '/admin/message-schedule'
        },
        {
            title: '系統健康監控',
            description: '監控API請求量、錯誤率及伺服器延遲情況',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            link: '/admin/system-health'
        },
    ];

    // 最近提醒
    const recentAlerts = [
        { type: 'critical', message: '伺服器延遲出現峰值', time: '34分鐘前' },
        { type: 'warning', message: 'API請求量高於平均值', time: '1小時前' },
        { type: 'info', message: '粉絲互動率達到每日高峰', time: '3小時前' },
    ];

    // 即將觸發的重要事件
    const upcomingEvents = [
        { type: '生日祝福', name: '粉絲A', time: '明天 08:00' },
        { type: '紀念日', name: '粉絲B', time: '2天後 10:00' },
        { type: '專屬活動', name: '粉絲C', time: '3天後 12:00' },
    ];

    return (
        <div className="bg-gray-100 p-6 min-h-screen text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">儀表板總覽</h1>
                <div className="text-sm text-gray-500">最後更新: 2023/11/14 15:43</div>
            </div>

            {/* 快速統計 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                        <div className="flex items-end mt-2">
                            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                            <div className={`ml-2 text-sm ${stat.color}`}>{stat.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 功能卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {featureCards.map((card, index) => (
                    <Link href={card.link} key={index}>
                        <div className="bg-white rounded-lg shadow p-5 transition duration-200 hover:shadow-md border-l-4 border-blue-500">
                            <div className="flex items-start">
                                <div className="rounded-full bg-blue-100 p-2 mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{card.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 最近提醒 */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">最近提醒</h2>
                    <div className="space-y-3">
                        {recentAlerts.map((alert, index) => (
                            <div key={index} className="flex items-start border-b pb-3 last:border-b-0 last:pb-0">
                                <div
                                    className={`min-w-[8px] h-8 rounded-full mr-3 ${alert.type === 'critical' ? 'bg-red-500' :
                                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-gray-800">{alert.message}</div>
                                        <div className="text-xs text-gray-500">{alert.time}</div>
                                    </div>
                                    <div className="text-xs mt-1">
                                        <span
                                            className={`px-2 py-1 rounded-full ${alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                                                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            {alert.type === 'critical' ? '嚴重' :
                                                alert.type === 'warning' ? '警告' : '資訊'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 即將觸發的重要事件 */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">即將觸發的重要事件</h2>
                    <div className="space-y-3">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="flex items-center border-b pb-3 last:border-b-0 last:pb-0">
                                <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs mr-3">
                                    {event.type}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{event.name}</div>
                                    <div className="text-xs text-gray-500">{event.time}</div>
                                </div>
                                <Link href="/admin/message-schedule" className="text-blue-600 hover:text-blue-800 text-sm">
                                    查看
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/admin/message-schedule" className="text-blue-600 hover:text-blue-800 text-sm">
                            查看所有排程 →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 