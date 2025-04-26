'use client';

import React, { useState } from 'react';

interface Fan {
    id: string;
    name: string;
    birthday: string;
    interests: string;
    mood: string;
}

// 模擬資料
const mockFans: Fan[] = [
    {
        id: '1',
        name: '粉絲 A',
        birthday: '1990/05/15',
        interests: '旅行, 攝影',
        mood: '開心'
    },
    {
        id: '2',
        name: '粉絲 B',
        birthday: '1985/11/22',
        interests: '音樂, 美食',
        mood: '平靜'
    },
    {
        id: '3',
        name: '粉絲 C',
        birthday: '1992/03/08',
        interests: '運動, 電影',
        mood: '興奮'
    },
    {
        id: '4',
        name: '粉絲 D',
        birthday: '1988/07/30',
        interests: '閱讀, 繪畫',
        mood: '思考'
    },
    {
        id: '5',
        name: '粉絲 E',
        birthday: '1995/12/10',
        interests: '遊戲, 科技',
        mood: '享受'
    }
];

const FanTags: React.FC = () => {
    const [fans] = useState<Fan[]>(mockFans);
    const [searchTerm, setSearchTerm] = useState('');

    // 篩選粉絲
    const filteredFans = fans.filter(fan =>
        fan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fan.interests.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fan.mood.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 處理編輯
    const handleEdit = (id: string) => {
        // 這裡可以實現編輯功能
        console.log('編輯粉絲:', id);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">粉絲標籤總覽</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="搜尋粉絲..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">粉絲</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">生日</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">喜好</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">近期情緒</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFans.length > 0 ? (
                            filteredFans.map(fan => (
                                <tr key={fan.id} className="border-b border-gray-100">
                                    <td className="px-4 py-3 text-sm text-gray-700">{fan.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{fan.birthday}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{fan.interests}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{fan.mood}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => handleEdit(fan.id)}
                                        >
                                            編輯
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-3 text-sm text-gray-500 text-center">
                                    沒有找到符合的粉絲
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FanTags; 