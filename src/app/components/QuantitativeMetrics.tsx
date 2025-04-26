import React from 'react';

// 定義指標類型
interface Metric {
    id: number;
    name: string;
    value: string;
    target: string;
    description: string;
    status: 'success' | 'warning';
    trend: string;
    color: 'blue' | 'purple' | 'green';
    icon: React.ReactNode;
}

// 量化指標組件
export default function QuantitativeMetrics() {
    // 指標數據
    const metrics: Metric[] = [
        {
            id: 1,
            name: '回覆觸及率',
            value: '67%',
            target: '≥ 60%',
            description: '回覆訊息被開啟/點讚的比率',
            status: 'success',
            trend: '+7%',
            color: 'blue',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            )
        },
        {
            id: 2,
            name: '月互動量',
            value: '2,438',
            target: '≥ 2,000',
            description: '每月互動數（首月追蹤基準）',
            status: 'success',
            trend: '+438',
            color: 'purple',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            )
        },
        {
            id: 3,
            name: '系統穩定度',
            value: '137 小時',
            target: 'TBF ≥ 100 小時',
            description: '無重大故障時間',
            status: 'success',
            trend: '+37小時',
            color: 'green',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    const getColorClasses = (color: 'blue' | 'purple' | 'green', status: 'success' | 'warning') => {
        const colorMap = {
            blue: {
                bg: status === 'success' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-blue-700 dark:text-blue-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-blue-200 dark:border-blue-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-blue-600 dark:bg-blue-500' : 'bg-yellow-600 dark:bg-yellow-500'
            },
            purple: {
                bg: status === 'success' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-purple-700 dark:text-purple-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-purple-200 dark:border-purple-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-yellow-600 dark:bg-yellow-500'
            },
            green: {
                bg: status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-green-200 dark:border-green-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-green-600 dark:bg-green-500' : 'bg-yellow-600 dark:bg-yellow-500'
            }
        };

        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">量化指標</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center mr-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>達標</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                        <span>未達標</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                    const colorClasses = getColorClasses(metric.color, metric.status);
                    return (
                        <div
                            key={metric.id}
                            className="relative overflow-hidden border rounded-lg p-5 transition-all duration-300 hover:shadow-md group hover:translate-y-[-2px]"
                        >
                            {/* Progress bar indicator */}
                            <div className="absolute bottom-0 left-0 w-full h-1">
                                <div className={`${colorClasses.accent} h-full`} style={{ width: metric.status === 'success' ? '100%' : '70%' }}></div>
                            </div>

                            <div className="flex items-start">
                                <div className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
                                    {metric.icon}
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{metric.name}</h3>
                                        <span className={`ml-2 text-xs ${colorClasses.text}`}>({metric.target})</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                                    <div className="mt-3">
                                        <span className={`px-3 py-1 text-xs rounded-full ${colorClasses.bg} ${colorClasses.text} inline-flex items-center`}>
                                            {metric.status === 'success' ?
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg> :
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v4a1 1 0 102 0V8z" clipRule="evenodd" />
                                                </svg>
                                            }
                                            {metric.status === 'success' ? '已達標' : '未達標'} {metric.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-gray-900/5 dark:bg-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 