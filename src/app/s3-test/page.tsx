'use client';

import { useState } from 'react';
import S3Image from '../components/S3Image';
import Image from 'next/image';
import { getS3ImageUrl } from '../utils/s3Utils';
import Navigation from '../components/Navigation';

export default function S3TestPage() {
    const [testUrl, setTestUrl] = useState<string>('https://idol-multimodal-output.s3.us-west-2.amazonaws.com/images/471b1b7d-d10a-4068-844f-dee0d15519d0.png');
    const [signedUrl, setSignedUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleGenerateSignedUrl = async () => {
        try {
            setLoading(true);
            const url = await getS3ImageUrl(testUrl);
            setSignedUrl(url);
            console.log("預簽名URL:", url);
        } catch (error) {
            console.error("生成預簽名URL出錯:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation title="S3 圖片測試" />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">S3 圖片測試</h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">輸入測試</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={testUrl}
                            onChange={(e) => setTestUrl(e.target.value)}
                            className="flex-1 p-2 border rounded"
                            placeholder="輸入S3圖片URL或key"
                        />
                        <button
                            onClick={handleGenerateSignedUrl}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? '生成中...' : '生成預簽名URL'}
                        </button>
                    </div>
                    {signedUrl && (
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mb-4 break-all">
                            <p className="font-mono text-xs">{signedUrl}</p>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-4">方法1: 直接使用Next.js Image</h2>
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                            <Image
                                src={testUrl}
                                alt="直接S3 URL測試"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500">使用Next.js Image直接載入S3 URL</p>
                    </div>

                    <div className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-4">方法2: S3Image元件 (直接URL)</h2>
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                            <S3Image
                                s3Key={testUrl}
                                alt="S3Image元件測試"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500">使用S3Image元件載入直接URL</p>
                    </div>

                    <div className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-4">方法3: S3Image元件 (預簽名URL)</h2>
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                            <S3Image
                                s3Key={testUrl}
                                alt="預簽名URL測試"
                                usePreSignedUrl={true}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500">使用S3Image元件載入預簽名URL</p>
                    </div>

                    <div className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-4">方法4: S3Image元件 (API代理)</h2>
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                            <S3Image
                                s3Key={testUrl}
                                alt="API代理測試"
                                useProxy={true}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500">使用API代理獲取S3圖片</p>
                    </div>

                    {signedUrl && (
                        <div className="p-4 border rounded">
                            <h2 className="text-lg font-semibold mb-4">方法5: 使用生成的預簽名URL</h2>
                            <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                                <Image
                                    src={signedUrl}
                                    alt="預簽名URL直接測試"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-sm text-gray-500">使用生成的預簽名URL直接載入</p>
                        </div>
                    )}

                    <div className="p-4 border rounded">
                        <h2 className="text-lg font-semibold mb-4">方法6: 直接使用API代理URL</h2>
                        <div className="aspect-square relative bg-gray-200 dark:bg-gray-700 mb-2">
                            <Image
                                src={`/api/s3-proxy?key=${encodeURIComponent(testUrl)}`}
                                alt="直接API代理URL測試"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500">直接使用API代理URL載入</p>
                    </div>
                </div>
            </main>
        </div>
    );
} 