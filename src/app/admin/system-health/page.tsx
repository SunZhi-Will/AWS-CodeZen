'use client';

import { useState } from 'react';

export default function SystemHealthPage() {
    const [timeRange, setTimeRange] = useState('24小時內');

    // 模擬數據
    const healthData = {
        apiRequests: {
            count: 15342,
            change: 8.5,
            chartData: [25, 50, 75, 100, 75, 50, 25]
        },
        errorRate: {
            rate: 0.8,
            change: 0.3,
            chartData: [16, 20, 25, 33, 50, 33, 25]
        },
        serverLatency: {
            latency: 124,
            change: 15,
            chartData: [33, 50, 67, 75, 100, 67, 50]
        },
        alerts: [
            { severity: 'critical', message: '伺服器延遲出現峰值', time: '34分鐘前' },
            { severity: 'warning', message: 'API請求量高於平均值', time: '1小時前' },
            { severity: 'info', message: '系統自動修復完成', time: '3小時前' }
        ],
        resources: {
            cpu: 45,
            memory: 68,
            disk: 32,
            network: 78
        }
    };

    return (
        <div className="text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">系統健康監控</h1>
                    <p className="text-gray-600 mt-1">監測API請求量、錯誤率及伺服器延遲，及時發現系統問題</p>
                </div>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option>24小時內</option>
                    <option>7天內</option>
                    <option>30天內</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">API請求量</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-800">{healthData.apiRequests.count.toLocaleString()}</span>
                        <span className="ml-2 text-sm font-medium text-green-500">+{healthData.apiRequests.change}%</span>
                    </div>
                    <div className="h-32 mt-4 flex items-end">
                        {healthData.apiRequests.chartData.map((height, index) => (
                            <div key={index} className={`flex-1 bg-blue-${Math.floor(height / 25 + 1) * 100}`} style={{ height: `${height}%` }}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">錯誤率</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-800">{healthData.errorRate.rate}%</span>
                        <span className="ml-2 text-sm font-medium text-red-500">+{healthData.errorRate.change}%</span>
                    </div>
                    <div className="h-32 mt-4 flex items-end">
                        {healthData.errorRate.chartData.map((height, index) => (
                            <div key={index} className={`flex-1 bg-red-${Math.floor(height / 25 + 1) * 100}`} style={{ height: `${height}%` }}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">伺服器延遲</h3>
                    <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-800">{healthData.serverLatency.latency}ms</span>
                        <span className="ml-2 text-sm font-medium text-red-500">+{healthData.serverLatency.change}ms</span>
                    </div>
                    <div className="h-32 mt-4 flex items-end">
                        {healthData.serverLatency.chartData.map((height, index) => (
                            <div key={index} className={`flex-1 ${height >= 100 ? 'bg-red-500' : `bg-yellow-${Math.floor(height / 25 + 1) * 100}`}`} style={{ height: `${height}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">系統警報</h3>
                    <div className="overflow-y-auto max-h-80">
                        {healthData.alerts.map((alert, index) => (
                            <div key={index} className="flex items-center py-4 border-b border-gray-100">
                                <div className={`h-full w-1 rounded-full mr-4 ${alert.severity === 'critical' ? 'bg-red-500' :
                                    alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">{alert.message}</p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                            alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {alert.severity === 'critical' ? '嚴重' :
                                                alert.severity === 'warning' ? '警告' : '信息'}
                                        </span>
                                        <span className="text-xs text-gray-400">{alert.time}</span>
                                    </div>
                                </div>
                                <button className="text-blue-500 hover:text-blue-700 text-sm">
                                    {alert.severity === 'info' ? '查看' : '處理'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">系統資源使用率</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700">CPU</span>
                                <span className="text-sm text-gray-700">{healthData.resources.cpu}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${healthData.resources.cpu}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700">記憶體</span>
                                <span className="text-sm text-gray-700">{healthData.resources.memory}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${healthData.resources.memory}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700">硬碟空間</span>
                                <span className="text-sm text-gray-700">{healthData.resources.disk}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${healthData.resources.disk}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700">網路帶寬</span>
                                <span className="text-sm text-gray-700">{healthData.resources.network}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${healthData.resources.network}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
} 