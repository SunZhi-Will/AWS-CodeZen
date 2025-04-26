'use client';

import { useState, useEffect } from 'react';

// 模擬資料
const mockHealthData = {
    apiRequests: [
        { time: '00:00', count: 120 },
        { time: '04:00', count: 85 },
        { time: '08:00', count: 210 },
        { time: '12:00', count: 350 },
        { time: '16:00', count: 280 },
        { time: '20:00', count: 175 }
    ],
    errorRates: [
        { time: '00:00', rate: 0.5 },
        { time: '04:00', rate: 0.3 },
        { time: '08:00', rate: 1.2 },
        { time: '12:00', rate: 0.8 },
        { time: '16:00', rate: 0.4 },
        { time: '20:00', rate: 0.6 }
    ],
    serverLatency: [
        { time: '00:00', latency: 120 },
        { time: '04:00', latency: 110 },
        { time: '08:00', latency: 180 },
        { time: '12:00', latency: 210 },
        { time: '16:00', latency: 160 },
        { time: '20:00', latency: 130 }
    ],
    currentStatus: {
        apiRequestsPerMinute: 42,
        errorRate: 0.7,
        averageLatency: 145,
        lastUpdated: '2023-11-14T15:43:00',
        alerts: [
            {
                id: 'a1',
                severity: 'warning',
                message: 'API 請求量高於平均值',
                timestamp: '2023-11-14T15:30:00'
            },
            {
                id: 'a2',
                severity: 'critical',
                message: '伺服器延遲出現峰值',
                timestamp: '2023-11-14T14:45:00'
            }
        ]
    }
};

export default function SystemHealthMonitor() {
    const [healthData] = useState(mockHealthData);
    const [activeTab, setActiveTab] = useState('overview');
    const [alertsExpanded, setAlertsExpanded] = useState(false);

    // 在實際應用中，這裡會定期從API獲取健康狀態資料
    useEffect(() => {
        // 模擬每60秒更新一次資料
        const intervalId = setInterval(() => {
            // fetchHealthData() 的實現將替換這個模擬資料
            // const fetchHealthData = async () => {
            //   const response = await fetch('/api/admin/system-health');
            //   const data = await response.json();
            //   setHealthData(data);
            // };
            // fetchHealthData();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    // 格式化時間
    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 取得狀態樣式
    const getStatusStyle = (value: number, type: 'errorRate' | 'latency') => {
        if (type === 'errorRate') {
            if (value < 0.5) return 'text-green-500';
            if (value < 1) return 'text-yellow-500';
            return 'text-red-500';
        } else {
            if (value < 150) return 'text-green-500';
            if (value < 200) return 'text-yellow-500';
            return 'text-red-500';
        }
    };

    // 取得警示樣式
    const getAlertStyle = (severity: string) => {
        switch (severity) {
            case 'info':
                return 'bg-blue-100 text-blue-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-4">系統健康監控</h2>

            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    總覽
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'apiRequests' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('apiRequests')}
                >
                    API請求
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'errorRates' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('errorRates')}
                >
                    錯誤率
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'latency' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('latency')}
                >
                    伺服器延遲
                </button>
            </div>

            {activeTab === 'overview' && (
                <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">API請求 (每分鐘)</div>
                            <div className="text-xl font-bold">
                                {healthData.currentStatus.apiRequestsPerMinute}
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">錯誤率 (%)</div>
                            <div className={`text-xl font-bold ${getStatusStyle(healthData.currentStatus.errorRate, 'errorRate')}`}>
                                {healthData.currentStatus.errorRate.toFixed(1)}%
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">平均延遲 (ms)</div>
                            <div className={`text-xl font-bold ${getStatusStyle(healthData.currentStatus.averageLatency, 'latency')}`}>
                                {healthData.currentStatus.averageLatency}ms
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium">異常警示</h3>
                            <div className="text-xs text-gray-500">
                                最後更新: {formatTime(healthData.currentStatus.lastUpdated)}
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            {healthData.currentStatus.alerts.slice(0, alertsExpanded ? undefined : 2).map(alert => (
                                <div key={alert.id} className="border-b last:border-b-0 p-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${alert.severity === 'critical' ? 'bg-red-500' :
                                                alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}></span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getAlertStyle(alert.severity)}`}>
                                                {alert.severity === 'critical' ? '嚴重' :
                                                    alert.severity === 'warning' ? '警告' : '資訊'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(alert.timestamp)}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm">
                                        {alert.message}
                                    </div>
                                </div>
                            ))}

                            {healthData.currentStatus.alerts.length > 2 && (
                                <div className="text-center p-2">
                                    <button
                                        className="text-blue-500 text-sm hover:underline"
                                        onClick={() => setAlertsExpanded(!alertsExpanded)}
                                    >
                                        {alertsExpanded ? '收起' : `顯示更多 (${healthData.currentStatus.alerts.length - 2})`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'apiRequests' && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">API 請求量 (24小時趨勢)</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-end">
                        {healthData.apiRequests.map((point, index) => (
                            <div key={index} className="flex flex-col items-center flex-1" title={`${point.time}: ${point.count} 請求`}>
                                <div
                                    className="w-full bg-blue-500 hover:bg-blue-600 transition-all"
                                    style={{ height: `${(point.count / 400) * 100}%` }}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">{point.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'errorRates' && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">錯誤率 (24小時趨勢)</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-end">
                        {healthData.errorRates.map((point, index) => (
                            <div key={index} className="flex flex-col items-center flex-1" title={`${point.time}: ${point.rate.toFixed(1)}% 錯誤率`}>
                                <div
                                    className={`w-full transition-all ${point.rate < 0.5 ? 'bg-green-500 hover:bg-green-600' :
                                        point.rate < 1 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                            'bg-red-500 hover:bg-red-600'
                                        }`}
                                    style={{ height: `${(point.rate / 2) * 100}%` }}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">{point.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'latency' && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">伺服器延遲 (24小時趨勢)</h3>
                    <div className="h-64 bg-gray-100 rounded flex items-end">
                        {healthData.serverLatency.map((point, index) => (
                            <div key={index} className="flex flex-col items-center flex-1" title={`${point.time}: ${point.latency}ms`}>
                                <div
                                    className={`w-full transition-all ${point.latency < 150 ? 'bg-green-500 hover:bg-green-600' :
                                        point.latency < 200 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                            'bg-red-500 hover:bg-red-600'
                                        }`}
                                    style={{ height: `${(point.latency / 250) * 100}%` }}
                                ></div>
                                <span className="text-xs mt-1 text-gray-600">{point.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 