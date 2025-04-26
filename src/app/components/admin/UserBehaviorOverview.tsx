'use client';

import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    BarChart,
    Bar,
    Cell
} from 'recharts';

// 模擬資料


// 在線用戶數據
const onlineUsersData = [
    { time: '00:00', users: 42 },
    { time: '02:00', users: 30 },
    { time: '04:00', users: 20 },
    { time: '06:00', users: 27 },
    { time: '08:00', users: 90 },
    { time: '10:00', users: 170 },
    { time: '12:00', users: 220 },
    { time: '14:00', users: 200 },
    { time: '16:00', users: 190 },
    { time: '18:00', users: 240 },
    { time: '20:00', users: 180 },
    { time: '22:00', users: 120 },
];

// 活躍區域數據
const activeAreasData = [
    { name: '首頁', value: 400 },
    { name: '商品列表', value: 300 },
    { name: '購物車', value: 200 },
    { name: '個人資料', value: 100 },
];

// 用戶偏好數據
const preferencesData = [
    { category: '3C產品', visits: 800 },
    { category: '服飾', visits: 600 },
    { category: '美妝', visits: 400 },
    { category: '食品', visits: 300 },
];

// AI策略效果數據
const aiStrategyData = [
    { month: '1月', conversion: 65 },
    { month: '2月', conversion: 72 },
    { month: '3月', conversion: 85 },
    { month: '4月', conversion: 78 },
];

// 六角形狀態數據
const hexagonData = [
    { value: '2.5K', label: '活躍用戶', color: '#8B5CF6' },
    { value: '75%', label: '轉換率', color: '#D946EF' },
    { value: '14m', label: '停留時間', color: '#F97316' },
    { value: '45', label: '互動次數', color: '#0EA5E9' },
    { value: '89%', label: '滿意度', color: '#10B981' },
    { value: '32%', label: '回訪率', color: '#6366F1' }
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

export default function UserBehaviorOverview() {
    const [activeTab, setActiveTab] = useState('onlineUsers');

    // 在實際應用中，這裡會從API獲取資料
    useEffect(() => {
        // fetchData() 的實現將替換這個模擬資料
        // const fetchData = async () => {
        //   const response = await fetch('/api/admin/user-behavior');
        //   const data = await response.json();
        //   setData(data);
        // };
        // fetchData();
    }, []);

    // 六角形狀態顯示
    const HexagonStats = () => {
        return (
            <div className="w-full max-w-2xl mx-auto mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">核心數據指標</h3>
                <div className="grid grid-cols-3 gap-4">
                    {hexagonData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm"
                            style={{ borderLeft: `4px solid ${item.color}` }}
                        >
                            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                            <div className="text-sm text-gray-500">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <HexagonStats />
            </div>

            <h2 className="text-lg font-semibold mb-4">用戶行為總覽</h2>

            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'onlineUsers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('onlineUsers')}
                >
                    在線人數
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'activityHeat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('activityHeat')}
                >
                    活躍熱區
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'preferences' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('preferences')}
                >
                    偏好分析
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'aiEffectiveness' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('aiEffectiveness')}
                >
                    AI策略效果
                </button>
            </div>

            <div className="py-4">
                {activeTab === 'onlineUsers' && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-700 mb-2">24小時在線粉絲曲線</h3>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-2">250</span>
                                <span className="text-gray-500">人</span>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={onlineUsersData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                        domain={[0, 'dataMax + 10']}
                                        label={{ value: '人', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        formatter={(value: number) => [`${value} 人`, '在線人數']}
                                        labelFormatter={(label: string) => `時間: ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="url(#colorUsers)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'activityHeat' && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-700 mb-2">用戶活躍區域分布</h3>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-2">1,000</span>
                                <span className="text-gray-500">總訪問量</span>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activeAreasData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {activeAreasData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-700 mb-2">用戶類別偏好分析</h3>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-2">2,100</span>
                                <span className="text-gray-500">總瀏覽次數</span>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={preferencesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="category"
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="visits" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'aiEffectiveness' && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-md font-medium text-gray-700 mb-2">AI推薦轉換率趨勢</h3>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-2">75%</span>
                                <span className="text-gray-500">平均轉換率</span>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={aiStrategyData}>
                                    <defs>
                                        <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D946EF" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        axisLine={{ stroke: '#E5E7EB' }}
                                        tickLine={false}
                                        domain={[0, 100]}
                                        label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="conversion"
                                        stroke="#D946EF"
                                        strokeWidth={2}
                                        fill="url(#colorConversion)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 