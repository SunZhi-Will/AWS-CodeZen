'use client';

import { useState } from 'react';

// 模擬資料
const mockTags = [
    {
        id: '1',
        category: '個人資料',
        tags: [
            { id: 't1', name: '生日', value: '4月15日', editable: true },
            { id: 't2', name: '星座', value: '白羊座', editable: true },
            { id: 't3', name: '喜歡顏色', value: '藍色', editable: true },
        ]
    },
    {
        id: '2',
        category: '興趣喜好',
        tags: [
            { id: 't4', name: '音樂風格', value: '流行、搖滾', editable: true },
            { id: 't5', name: '喜歡電影', value: '科幻、冒險', editable: true },
            { id: 't6', name: '喜歡活動', value: '旅行、攝影', editable: true },
        ]
    },
    {
        id: '3',
        category: '互動習慣',
        tags: [
            { id: 't7', name: '活躍時間', value: '晚上9-11點', editable: true },
            { id: 't8', name: '回覆速度', value: '快速', editable: false },
            { id: 't9', name: '互動頻率', value: '每日', editable: false },
        ]
    },
    {
        id: '4',
        category: '情緒記憶',
        tags: [
            { id: 't10', name: '最近情緒', value: '愉快', editable: true },
            { id: 't11', name: '負面觸發', value: '工作壓力', editable: true },
            { id: 't12', name: '喜歡話題', value: '旅行計劃', editable: true },
        ]
    },
];

export default function MemoryTagsView() {
    const [tags, setTags] = useState(mockTags);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState<{ id: string, value: string } | null>(null);

    // 篩選標籤
    const filteredTags = tags.map(category => ({
        ...category,
        tags: category.tags.filter(tag =>
            tag.name.toLowerCase().includes(search.toLowerCase()) ||
            tag.value.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(category => category.tags.length > 0);

    // 開始編輯標籤
    const startEditing = (id: string, value: string) => {
        setEditing({ id, value });
    };

    // 儲存編輯後的標籤
    const saveEdit = (tagId: string) => {
        if (!editing) return;

        setTags(prevTags =>
            prevTags.map(category => ({
                ...category,
                tags: category.tags.map(tag =>
                    tag.id === tagId
                        ? { ...tag, value: editing.value }
                        : tag
                )
            }))
        );

        setEditing(null);

        // 在實際應用中，這裡會發送API請求來更新標籤
        // saveTagToAPI(tagId, editing.value);
    };

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-4">記憶標籤檢視</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="搜尋標籤..."
                    className="w-full p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-6">
                {filteredTags.map(category => (
                    <div key={category.id} className="border rounded p-3">
                        <h3 className="text-md font-medium mb-2">{category.category}</h3>
                        <div className="space-y-2">
                            {category.tags.map(tag => (
                                <div key={tag.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <div className="text-sm font-medium text-gray-700">{tag.name}</div>

                                    {editing && editing.id === tag.id ? (
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                className="border border-gray-300 rounded p-1 text-sm w-40"
                                                value={editing.value}
                                                onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                                                autoFocus
                                            />
                                            <button
                                                className="ml-2 text-green-600 hover:text-green-800"
                                                onClick={() => saveEdit(tag.id)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <button
                                                className="ml-1 text-red-600 hover:text-red-800"
                                                onClick={() => setEditing(null)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                                {tag.value}
                                            </span>
                                            {tag.editable && (
                                                <button
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    onClick={() => startEditing(tag.id, tag.value)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTags.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        沒有找到符合的標籤
                    </div>
                )}
            </div>
        </div>
    );
} 