import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '../../../utils/s3Utils';

// 允許的文件類型
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
];

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        // 檢查請求是否為 multipart/form-data
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json(
                { error: '請求必須是 multipart/form-data 格式' },
                { status: 400 }
            );
        }

        // 獲取請求 formData
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const contentFolder = (formData.get('folder') as string) || 'uploads';

        // 檢查文件是否存在
        if (!file) {
            return NextResponse.json(
                { error: '未提供文件' },
                { status: 400 }
            );
        }

        // 檢查文件類型
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: '不支援的文件類型' },
                { status: 400 }
            );
        }

        // 檢查文件大小
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: '文件大小超過限制 (10MB)' },
                { status: 400 }
            );
        }

        // 將文件轉為 buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 上傳到 S3
        const uploadResult = await uploadFileToS3(fileBuffer, file.type, contentFolder);

        if (!uploadResult.success) {
            return NextResponse.json(
                { error: uploadResult.error || '上傳失敗' },
                { status: 500 }
            );
        }

        // 返回上傳成功的響應
        return NextResponse.json({
            message: '上傳成功',
            url: uploadResult.url,
            contentType: file.type,
            fileName: file.name
        });
    } catch (error) {
        console.error('文件上傳處理錯誤:', error);
        return NextResponse.json(
            { error: '處理文件上傳時發生錯誤' },
            { status: 500 }
        );
    }
} 