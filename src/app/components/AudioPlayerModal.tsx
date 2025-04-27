import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerModalProps {
    audioUrl: string;
    onClose: () => void;
    onConfirm: () => void;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ audioUrl, onClose, onConfirm }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 創建音訊元素
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // 設置事件監聽器
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
        });

        // 處理錯誤
        audio.addEventListener('error', () => {
            console.error('音訊檔案載入失敗:', audioUrl);
            setError('無法載入音訊檔案。示範功能中使用預設聲音。');
        });

        // 組件卸載時清理
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('timeupdate', updateProgress);
                audioRef.current.removeEventListener('ended', () => {
                    setIsPlaying(false);
                    setProgress(0);
                });
                audioRef.current.removeEventListener('error', () => {
                    setError('無法載入音訊檔案。示範功能中使用預設聲音。');
                });
            }
        };
    }, [audioUrl]);

    // 更新進度條
    const updateProgress = () => {
        if (audioRef.current) {
            const value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(value);
        }
    };

    // 播放或暫停
    const togglePlayback = () => {
        if (error) {
            // 如果有錯誤，模擬播放
            setIsPlaying(!isPlaying);
            return;
        }

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // 使用 Promise 處理可能的播放錯誤
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error('播放失敗:', e);
                        setError('播放失敗。這可能是因為瀏覽器限制或音訊檔案問題。');
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    // 設置音訊位置
    const setAudioPosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) return; // 如果有錯誤，不做任何事

        if (audioRef.current) {
            const position = parseInt(e.target.value);
            audioRef.current.currentTime = (position / 100) * audioRef.current.duration;
            setProgress(position);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI 聲音回應</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        試聽 AI 生成的聲音回應，確認後可直接回覆給粉絲
                    </p>

                    {error && (
                        <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-400">{error}</p>
                        </div>
                    )}

                    {/* 音訊控制區 */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                            <button
                                onClick={togglePlayback}
                                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* 進度條 */}
                        <div className="w-full">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={setAudioPosition}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        使用此音訊回覆
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayerModal; 