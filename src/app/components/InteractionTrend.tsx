import React from 'react';

// 互動趨勢圖表組件
export default function InteractionTrend() {
    // 互動趨勢數據
    const trendData = [
        { day: '週一', engagement: 62, satisfaction: 86 },
        { day: '週二', engagement: 65, satisfaction: 89 },
        { day: '週三', engagement: 70, satisfaction: 90 },
        { day: '週四', engagement: 75, satisfaction: 91 },
        { day: '週五', engagement: 72, satisfaction: 92 },
        { day: '週六', engagement: 76, satisfaction: 94 },
        { day: '週日', engagement: 73, satisfaction: 92 },
    ];

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">互動趨勢</h3>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
                        <select className="bg-transparent text-sm text-gray-300 border-none outline-none focus:ring-0">
                            <option>過去 7 天</option>
                            <option>過去 30 天</option>
                            <option>過去 90 天</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-sm text-gray-300">互動率</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-purple-400 mr-2"></span>
                        <span className="text-sm text-gray-300">滿意度</span>
                    </div>
                </div>
            </div>

            {/* 圖表部分 */}
            <div className="relative h-64 px-4 py-3">
                {/* Y軸標籤與參考線 */}
                <div className="absolute inset-y-3 left-0 w-12 flex flex-col justify-between">
                    {[100, 80, 60, 40, 20, 0].map((value, index) => (
                        <div key={index} className="flex items-center h-0">
                            <span className="text-xs text-gray-400 w-7 text-right">{value}%</span>
                            <div className="flex-grow border-t border-dashed border-gray-800 ml-1"></div>
                        </div>
                    ))}
                </div>

                {/* 圖表繪製區域 */}
                <div className="absolute inset-y-3 right-0 left-12 pr-3">
                    {/* X軸標籤 */}
                    <div className="absolute left-0 right-0 bottom-0 flex justify-between px-3">
                        {trendData.map((data, index) => (
                            <span key={index} className="text-xs text-gray-400">{data.day}</span>
                        ))}
                    </div>

                    {/* 曲線繪製 */}
                    <svg
                        className="absolute inset-0 h-[calc(100%-20px)] w-full"
                        viewBox="-1 -1 102 102"
                        preserveAspectRatio="none"
                    >
                        {/* 滿意度曲線 */}
                        <path
                            d={`M 0 ${100 - trendData[0].satisfaction} 
                               C ${100 / 14} ${100 - (trendData[0].satisfaction + trendData[1].satisfaction) / 2} 
                               ${100 / 7} ${100 - (trendData[1].satisfaction + trendData[2].satisfaction) / 2} 
                               ${200 / 7} ${100 - trendData[2].satisfaction} 
                               S ${300 / 7} ${100 - trendData[3].satisfaction} 
                               ${400 / 7} ${100 - trendData[4].satisfaction} 
                               S ${500 / 7} ${100 - trendData[5].satisfaction} 
                               100 ${100 - trendData[6].satisfaction}`}
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* 互動率曲線 */}
                        <path
                            d={`M 0 ${100 - trendData[0].engagement} 
                               C ${100 / 14} ${100 - (trendData[0].engagement + trendData[1].engagement) / 2} 
                               ${100 / 7} ${100 - (trendData[1].engagement + trendData[2].engagement) / 2} 
                               ${200 / 7} ${100 - trendData[2].engagement} 
                               S ${300 / 7} ${100 - trendData[3].engagement} 
                               ${400 / 7} ${100 - trendData[4].engagement} 
                               S ${500 / 7} ${100 - trendData[5].engagement} 
                               100 ${100 - trendData[6].engagement}`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* 互動率區域填充 */}
                        <path
                            d={`M 0 ${100 - trendData[0].engagement} 
                               C ${100 / 14} ${100 - (trendData[0].engagement + trendData[1].engagement) / 2} 
                               ${100 / 7} ${100 - (trendData[1].engagement + trendData[2].engagement) / 2} 
                               ${200 / 7} ${100 - trendData[2].engagement} 
                               S ${300 / 7} ${100 - trendData[3].engagement} 
                               ${400 / 7} ${100 - trendData[4].engagement} 
                               S ${500 / 7} ${100 - trendData[5].engagement} 
                               100 ${100 - trendData[6].engagement}
                               V 100 H 0 Z`}
                            fill="url(#blueGradient)"
                        />

                        {/* 定義漸層 */}
                        <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* 水平參考線 */}
                    <svg className="absolute inset-0 h-[calc(100%-20px)] w-full pointer-events-none">
                        {[0, 1, 2, 3, 4, 5].map((_, index) => (
                            <line
                                key={index}
                                x1="0"
                                y1={index * 20 + '%'}
                                x2="100%"
                                y2={index * 20 + '%'}
                                stroke="#313439"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                            />
                        ))}
                    </svg>
                </div>
            </div>


        </div>
    );
} 