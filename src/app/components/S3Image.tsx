'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getDirectS3Url, getS3ImageUrl } from '../utils/s3Utils';

interface S3ImageProps extends Omit<ImageProps, 'src'> {
    s3Key: string;
    usePreSignedUrl?: boolean;
    useProxy?: boolean;
    fallbackSrc?: string;
}

export default function S3Image({
    s3Key,
    usePreSignedUrl = false,
    useProxy = false,
    fallbackSrc,
    alt,
    width,
    height,
    ...props
}: S3ImageProps) {
    const [imageUrl, setImageUrl] = useState<string>(fallbackSrc || '');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        async function loadImageUrl() {
            if (!s3Key) {
                setIsLoading(false);
                setError(true);
                return;
            }

            try {
                setIsLoading(true);
                setError(false);

                // 使用代理API獲取圖片
                if (useProxy) {
                    // 使用我們的API代理端點
                    const key = encodeURIComponent(s3Key);
                    setImageUrl(`/api/s3-proxy?key=${key}`);
                }
                // 使用預簽名URL
                else if (usePreSignedUrl) {
                    const url = await getS3ImageUrl(s3Key);
                    setImageUrl(url);
                }
                // 使用直接URL
                else {
                    setImageUrl(getDirectS3Url(s3Key));
                }
            } catch (err) {
                console.error('無法加載S3圖片:', err);
                setError(true);
                // 如果有fallback，使用fallback
                if (fallbackSrc) {
                    setImageUrl(fallbackSrc);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadImageUrl();
    }, [s3Key, usePreSignedUrl, useProxy, fallbackSrc]);

    if (isLoading) {
        return (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700"
                style={{ width: width || '100%', height: height || '100%' }}>
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"
                style={{ width: width || '100%', height: height || '100%' }}>
                {fallbackSrc ? (
                    <Image
                        src={fallbackSrc}
                        alt={alt || 'Image placeholder'}
                        width={typeof width === 'number' ? width : 100}
                        height={typeof height === 'number' ? height : 100}
                        {...props}
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                )}
            </div>
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt || ''}
            width={typeof width === 'number' ? width : undefined}
            height={typeof height === 'number' ? height : undefined}
            {...props}
        />
    );
} 