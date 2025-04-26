import React from 'react';
import FanTags from '@/app/components/admin/FanTags';

export default function MemoryTagsPage() {
    return (
        <div className="text-gray-800">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">記憶標籤管理</h1>
                <p className="text-gray-600 mt-1">查看和編輯粉絲的關鍵標籤，包括生日、喜好以及近期情緒</p>
            </div>

            <div className="bg-white p-6 rounded-md shadow-sm">
                <FanTags />
            </div>
        </div>
    );
} 