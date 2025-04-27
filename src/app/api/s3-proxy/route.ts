import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../../utils/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// 存儲桶名稱
const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'idol-multimodal-output';

export async function GET(request: NextRequest) {
    try {
        // 從查詢參數中獲取key
        const { searchParams } = new URL(request.url);
        let key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: '未提供圖片key參數' },
                { status: 400 }
            );
        }

        // 處理key格式
        // 移除開頭的斜線
        key = key.startsWith('/') ? key.substring(1) : key;

        // 處理完整URL作為key的情況
        if (key.startsWith('http')) {
            try {
                const url = new URL(key);
                key = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
            } catch {
                return NextResponse.json(
                    { error: 'URL格式無效' },
                    { status: 400 }
                );
            }
        }

        // 確保圖片在正確的資料夾下
        if (!key.includes('/')) {
            key = `images/${key}`;
        }

        // 選項1: 直接代理內容 (讀取S3對象並返回)
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        try {
            // 嘗試獲取對象
            const response = await s3Client.send(command);

            // 獲取內容類型
            const contentType = response.ContentType || 'application/octet-stream';

            // 獲取數據流
            const stream = response.Body as NodeJS.ReadableStream;

            if (!stream) {
                return NextResponse.json(
                    { error: '無法獲取圖片流' },
                    { status: 500 }
                );
            }

            // 讀取流數據
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk));
            }
            const buffer = Buffer.concat(chunks);

            // 返回圖片數據，設置適當的內容類型
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=86400',
                },
            });
        } catch (error) {
            console.error('獲取S3對象時出錯:', error);

            // 選項2: 回退到生成預簽名URL並重定向
            try {
                // 生成預簽名URL
                const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

                // 重定向到預簽名URL
                return NextResponse.redirect(signedUrl);
            } catch (redirectError) {
                console.error('生成預簽名URL時出錯:', redirectError);
                return NextResponse.json(
                    { error: '無法獲取或代理S3圖片' },
                    { status: 500 }
                );
            }
        }
    } catch (error) {
        console.error('處理代理請求時出錯:', error);
        return NextResponse.json(
            { error: '處理請求時出錯' },
            { status: 500 }
        );
    }
} 