'use client';

import { useState } from 'react';

// 模擬資料
const mockSchedules = [
    {
        id: 's1',
        type: '生日祝福',
        recipient: '粉絲A',
        content: '生日快樂！希望今天是個特別的日子，充滿喜悅和驚喜 🎂🎉',
        scheduleDate: '2023-11-15T08:00:00',
        status: 'pending',
    },
    {
        id: 's2',
        type: '紀念日',
        recipient: '粉絲B',
        content: '今天是我們認識的兩週年！謝謝你一直以來的支持 ❤️',
        scheduleDate: '2023-11-16T10:00:00',
        status: 'pending',
    },
    {
        id: 's3',
        type: '專屬活動',
        recipient: '粉絲C',
        content: '邀請你參加我們的專屬線上聚會，時間是本週六晚上8點，不見不散！',
        scheduleDate: '2023-11-17T12:00:00',
        status: 'pending',
    },
    {
        id: 's4',
        type: '回饋調查',
        recipient: '全體粉絲',
        content: '希望你能抽空填寫這份調查，幫助我了解如何提供更好的內容 📝',
        scheduleDate: '2023-11-18T09:00:00',
        status: 'pending',
    },
    {
        id: 's5',
        type: '主題互動',
        recipient: '粉絲D',
        content: '看到你對旅行很有興趣，我想分享一些我最近去的地方，希望能給你一些靈感！',
        scheduleDate: '2023-11-19T15:00:00',
        status: 'pending',
    },
];

export default function MessageScheduleCenter() {
    const [schedules, setSchedules] = useState(mockSchedules);
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    // 篩選訊息
    const filteredSchedules = filter === 'all'
        ? schedules
        : schedules.filter(s => s.type === filter);

    // 編輯訊息
    const startEditing = (id: string, content: string) => {
        setEditingId(id);
        setEditContent(content);
    };

    // 儲存編輯
    const saveEdit = (id: string) => {
        setSchedules(prevSchedules =>
            prevSchedules.map(schedule =>
                schedule.id === id
                    ? { ...schedule, content: editContent }
                    : schedule
            )
        );

        setEditingId(null);

        // 在實際應用中，這裡會發送API請求來更新排程訊息
        // updateScheduleAPI(id, editContent);
    };

    // 取消排程
    const cancelSchedule = (id: string) => {
        setSchedules(prevSchedules =>
            prevSchedules.filter(schedule => schedule.id !== id)
        );

        // 在實際應用中，這裡會發送API請求來刪除排程訊息
        // deleteScheduleAPI(id);
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 計算剩餘時間
    const getRemainingTime = (dateString: string) => {
        const targetDate = new Date(dateString);
        const now = new Date();
        const diffMs = targetDate.getTime() - now.getTime();

        if (diffMs <= 0) return '即將發送';

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) {
            return `${diffDays}天${diffHours}小時後`;
        } else {
            return `${diffHours}小時後`;
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-4">訊息排程中心</h2>

            <div className="mb-4 flex space-x-2">
                <button
                    className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('all')}
                >
                    全部
                </button>
                <button
                    className={`px-3 py-1 rounded ${filter === '生日祝福' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('生日祝福')}
                >
                    生日祝福
                </button>
                <button
                    className={`px-3 py-1 rounded ${filter === '紀念日' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('紀念日')}
                >
                    紀念日
                </button>
                <button
                    className={`px-3 py-1 rounded ${filter === '主題互動' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('主題互動')}
                >
                    主題互動
                </button>
            </div>

            <div className="space-y-4">
                {filteredSchedules.map(schedule => (
                    <div key={schedule.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {schedule.type}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                    {formatDate(schedule.scheduleDate)}
                                </span>
                                <span className="ml-2 text-xs font-medium text-orange-500">
                                    {getRemainingTime(schedule.scheduleDate)}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => startEditing(schedule.id, schedule.content)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => cancelSchedule(schedule.id)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mb-2">
                            <span className="text-sm font-medium">收件人:</span>
                            <span className="ml-1 text-sm">{schedule.recipient}</span>
                        </div>

                        {editingId === schedule.id ? (
                            <div>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows={3}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                                        onClick={() => setEditingId(null)}
                                    >
                                        取消
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                                        onClick={() => saveEdit(schedule.id)}
                                    >
                                        儲存
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-3 rounded text-sm">
                                {schedule.content}
                            </div>
                        )}
                    </div>
                ))}

                {filteredSchedules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        沒有找到排程訊息
                    </div>
                )}
            </div>
        </div>
    );
} 