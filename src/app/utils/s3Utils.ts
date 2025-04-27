import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from './s3Client';
import { v4 as uuidv4 } from 'uuid';

// S3 存儲桶名稱，應放在環境變數
const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'idol-multimodal-output';
const REGION = process.env.NEXT_PUBLIC_REGION || 'us-west-2';

// 將文件緩衝區上傳到 S3
export async function uploadFileToS3(
    fileBuffer: Buffer,
    contentType: string,
    folderName: string = 'uploads'
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // 生成唯一的文件名
        const fileName = `${folderName}/${uuidv4()}${getFileExtension(contentType)}`;

        // 設置上傳參數
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,
        };

        // 執行上傳
        await s3Client.send(new PutObjectCommand(params));

        // 返回文件的 URL
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_REGION || 'us-west-2'}.amazonaws.com/${fileName}`;
        return {
            success: true,
            url: fileUrl,
        };
    } catch (error) {
        console.error('上傳到 S3 時出錯:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '上傳失敗',
        };
    }
}

// 根據 MIME 類型獲取文件擴展名
function getFileExtension(mimeType: string): string {
    const mimeMap: { [key: string]: string } = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg',
        'video/mp4': '.mp4',
        'video/quicktime': '.mov',
        'video/x-msvideo': '.avi',
        'video/webm': '.webm',
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
    };

    return mimeMap[mimeType] || '';
}

/**
 * 從S3獲取圖片的預簽名URL
 * @param key - S3中的圖片鍵值(路徑)
 * @param expiresIn - URL的有效期(秒)，預設為1小時
 * @returns 預簽名的URL
 */
export async function getS3ImageUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
        if (!key) return '';

        // 處理不同的輸入格式
        let imageKey = key;

        // 如果是完整URL，提取路徑部分
        if (key.startsWith('http')) {
            const url = new URL(key);
            // 從URL路徑提取key
            imageKey = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
        } else {
            // 移除開頭的斜線
            imageKey = key.startsWith('/') ? key.substring(1) : key;

            // 確保圖片在正確的資料夾下
            if (!imageKey.includes('/')) {
                imageKey = `images/${imageKey}`;
            }
        }

        // 建立獲取物件的命令
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageKey,
        });

        // 產生預簽名URL
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('產生S3圖片URL時出錯:', error);
        // 如果發生錯誤，返回直接存取的URL
        return getDirectS3Url(key);
    }
}

/**
 * 獲取直接訪問S3的URL（非預簽名）
 * @param key - 圖片的鍵值或路徑
 * @returns S3 URL
 */
export function getDirectS3Url(key: string): string {
    if (!key) return '';

    // 已經是完整URL則直接返回
    if (key.startsWith('http')) {
        return key;
    }

    // 移除開頭的斜線
    const cleanKey = key.startsWith('/') ? key.substring(1) : key;

    // 確保圖片在正確的資料夾下
    const imageKey = cleanKey.includes('/') ? cleanKey : `images/${cleanKey}`;

    // 返回直接訪問的URL
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${imageKey}`;
} 