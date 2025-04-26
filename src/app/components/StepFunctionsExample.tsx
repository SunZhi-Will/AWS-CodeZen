'use client';

import { useState, useEffect } from 'react';
import { runDataProcessingWorkflow, startIdolMultimodalWorkflow } from '../utils/stepFunctionsUtils';

// 執行狀態類型
type ExecutionStatus = 'idle' | 'starting' | 'running' | 'completed' | 'failed';

// 工作流程結果類型
type WorkflowResult = {
    status?: string;
    output?: any;
    execution?: any;
    error?: string;
};

// 媒體資料類型
type MediaData = {
    mediaId: string;
    mediaType: 'image' | 'video' | 'audio';
    contentData: {
        title: string;
        description: string;
        tags: string[];
    };
};

export default function StepFunctionsExample() {
    // 狀態管理
    const [workflowType, setWorkflowType] = useState<'ETL' | 'ANALYSIS' | 'MIGRATION' | 'IDOL_MULTIMODAL'>('IDOL_MULTIMODAL');
    const [inputData, setInputData] = useState<Record<string, any>>({
        source: 'sample_data',
        destination: 'processed_data',
        transformations: ['filter', 'sort', 'aggregate']
    });
    const [mediaData, setMediaData] = useState<MediaData>({
        mediaId: 'media-' + Date.now(),
        mediaType: 'image',
        contentData: {
            title: '偶像照片',
            description: '2023年演唱會照片',
            tags: ['偶像', '演唱會', '2023']
        }
    });
    const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('idle');
    const [result, setResult] = useState<WorkflowResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 處理執行工作流程
    const handleRunWorkflow = async () => {
        try {
            // 重置狀態
            setExecutionStatus('starting');
            setResult(null);
            setError(null);

            // 啟動工作流程
            setExecutionStatus('running');
            let workflowResult;

            if (workflowType === 'IDOL_MULTIMODAL') {
                workflowResult = await startIdolMultimodalWorkflow(
                    mediaData.mediaId,
                    mediaData.mediaType,
                    mediaData.contentData
                );
            } else {
                workflowResult = await runDataProcessingWorkflow(workflowType, inputData);
            }

            // 更新結果
            setResult(workflowResult);
            setExecutionStatus(workflowResult.status === 'SUCCEEDED' ? 'completed' : 'failed');
        } catch (err) {
            console.error('執行工作流程時發生錯誤:', err);
            setError(err instanceof Error ? err.message : '執行工作流程時發生未知錯誤');
            setExecutionStatus('failed');
        }
    };

    // 處理輸入數據變更
    const handleInputChange = (key: string, value: any) => {
        setInputData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // 處理媒體資料變更
    const handleMediaDataChange = (key: string, value: any) => {
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            if (parent === 'contentData') {
                setMediaData(prev => ({
                    ...prev,
                    contentData: {
                        ...prev.contentData,
                        [child]: value
                    }
                }));
            }
        } else {
            setMediaData(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    // 渲染狀態標籤
    const renderStatusBadge = () => {
        const statusStyles: Record<ExecutionStatus, string> = {
            idle: 'bg-gray-200 text-gray-800',
            starting: 'bg-blue-200 text-blue-800 animate-pulse',
            running: 'bg-yellow-200 text-yellow-800 animate-pulse',
            completed: 'bg-green-200 text-green-800',
            failed: 'bg-red-200 text-red-800'
        };

        const statusLabels: Record<ExecutionStatus, string> = {
            idle: '閒置',
            starting: '啟動中',
            running: '執行中',
            completed: '已完成',
            failed: '失敗'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[executionStatus]}`}>
                {statusLabels[executionStatus]}
            </span>
        );
    };

    // 根據工作流類型切換顯示不同的輸入表單
    const renderInputForm = () => {
        if (workflowType === 'IDOL_MULTIMODAL') {
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500">媒體 ID</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mediaData.mediaId}
                            onChange={(e) => handleMediaDataChange('mediaId', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">媒體類型</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mediaData.mediaType}
                            onChange={(e) => handleMediaDataChange('mediaType', e.target.value as 'image' | 'video' | 'audio')}
                        >
                            <option value="image">圖片</option>
                            <option value="video">視頻</option>
                            <option value="audio">音訊</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">標題</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mediaData.contentData.title}
                            onChange={(e) => handleMediaDataChange('contentData.title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">描述</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mediaData.contentData.description}
                            onChange={(e) => handleMediaDataChange('contentData.description', e.target.value)}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500">來源</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputData.source}
                            onChange={(e) => handleInputChange('source', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">目的地</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputData.destination}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">AWS Step Functions 示例</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    工作流程類型
                </label>
                <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={workflowType}
                    onChange={(e) => setWorkflowType(e.target.value as any)}
                >
                    <option value="IDOL_MULTIMODAL">偶像多模態處理</option>
                    <option value="ETL">ETL 資料處理</option>
                    <option value="ANALYSIS">資料分析</option>
                    <option value="MIGRATION">資料遷移</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {workflowType === 'IDOL_MULTIMODAL' ? '媒體資訊' : '輸入數據參數'}
                </label>
                {renderInputForm()}
            </div>

            <div className="mb-6">
                <button
                    className={`w-full py-3 px-4 rounded-md font-medium text-white ${executionStatus === 'running' || executionStatus === 'starting'
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    onClick={handleRunWorkflow}
                    disabled={executionStatus === 'running' || executionStatus === 'starting'}
                >
                    {executionStatus === 'running' ? '執行中...' : '執行工作流程'}
                </button>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">執行狀態</span>
                    {renderStatusBadge()}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        <strong>錯誤：</strong> {error}
                    </div>
                )}

                {result && (
                    <div className="mt-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">執行結果</h3>
                        <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-64">
                            <pre className="text-xs text-gray-800">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-500 mt-6">
                <p className="mb-1">提示：</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Step Functions 狀態機 ARN 需在環境變數中設定</li>
                    <li>執行前請確保 AWS 憑證已正確配置</li>
                    <li>此示例僅作為如何整合 Step Functions 的參考</li>
                </ul>
            </div>
        </div>
    );
} 