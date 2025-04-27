'use client';

import { useState } from 'react';
import RecommendationSection, { RecommendationSectionType } from './RecommendationSection';

// 回覆類型
interface Reply {
    id: number | string;
    content: string;
    time: string;
    username: string;
    mode?: string;
}

// 評論類型
interface Comment {
    id: string;
    username: string;
    content: string;
    timestamp: string;
    replies?: Reply[];
}

// TextContent 元件 props 介面
interface TextContentProps {
    idolName: string;
    content: string;
    likes?: number;
    commentsCount?: number;
    isLiked?: boolean;
    showComments?: boolean;
    commentsList?: Comment[];
    commentInput?: string;
    replyInput?: string;
    replyingTo?: string | null;
    isLoadingComments?: boolean;
    commentError?: string | null;
    id?: string;
    showRecommendations?: boolean;
    showCustomizeRecommendations?: boolean;
    recommendationSections?: RecommendationSectionType[];
    selectedRecommendations?: string[];
    onLike?: () => void;
    setShowComments?: (show: boolean) => void;
    setReplyingTo?: (id: string | null) => void;
    setReplyInput?: (input: string) => void;
    handleReplySubmit?: (commentId: string) => void;
    setCommentInput?: (input: string) => void;
    handleCommentSubmit?: (e: React.FormEvent) => void;
    setShowRecommendations?: (show: boolean) => void;
    setShowCustomizeRecommendations?: (show: boolean) => void;
    randomizeRecommendations?: () => void;
    toggleRecommendationSelection?: (id: string) => void;
    applyCustomRecommendations?: () => void;
}

export default function TextContent({
    idolName,
    content,
    likes = 0,
    commentsCount = 0,
    isLiked = false,
    showComments = false,
    commentsList = [],
    commentInput = '',
    replyInput = '',
    replyingTo = null,
    isLoadingComments = false,
    commentError = null,
    id = '',
    showRecommendations = true,
    showCustomizeRecommendations = false,
    recommendationSections = [],
    selectedRecommendations = [],
    onLike = () => { },
    setShowComments = () => { },
    setReplyingTo = () => { },
    setReplyInput = () => { },
    handleReplySubmit = () => { },
    setCommentInput = () => { },
    handleCommentSubmit = (e: React.FormEvent) => { e.preventDefault(); },
    setShowRecommendations = () => { },
    setShowCustomizeRecommendations = () => { },
    randomizeRecommendations = () => { },
    toggleRecommendationSelection = () => { },
    applyCustomRecommendations = () => { }
}: TextContentProps) {
    // 產生隨機口頭禪的函數
    const getRandomCatchphrase = () => {
        const catchphrases = [
            "💫 這就是我的風格~",
            "✨ 潮流由我來定義！",
            "🌟 我說的都對吧？",
            "💭 你們覺得如何呢？",
            "🎵 這是我的獨家想法~",
            "💝 喜歡的話請給我點讚喔！",
            "🎤 這是只屬於我的表達方式！",
            "⚡ 沒錯，就是這樣！",
            "🔥 熱門話題來了！",
            "💯 實話實說~",
            "🌈 獨家觀點，不容錯過！",
            "🦄 別人不敢說，我來說！",
            "🎯 這就是我的真心話~",
            "✌️ 就這麼簡單，就這麼厲害！",
            "👑 誰說我不是領導潮流的王者？",
            "💎 價值連城的建議，只在這裡！",
            "🧠 獨到見解，只此一家！",
            "🚀 腦洞大開，飛向宇宙！",
            "🌊 掀起討論浪潮吧！",
            "🔮 未來趨勢，我最懂！",
            "❤️‍🔥 熱辣觀點，只給懂的人！",
            "🍭 甜蜜真相，就是這個味道~",
            "🤘 反骨精神，就是要與眾不同！",
            "💅 高級感，我說了算~"
        ];
        return catchphrases[Math.floor(Math.random() * catchphrases.length)];
    };

    // 使用useState來存儲隨機生成的口頭禪，這樣它只會在元件首次渲染時生成一次
    const [catchphrase] = useState(() => {
        // 90%的概率顯示口頭禪
        return Math.random() < 0.9 ? getRandomCatchphrase() : '';
    });

    return (
        <div className="px-3 py-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{idolName}</span> {content}
                {catchphrase && <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium ml-1">{catchphrase}</span>}
            </p>

            {/* 計數與操作 */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{typeof likes === 'number' && likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes} 讚</span>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="hover:underline"
                >
                    {commentsCount} 則留言
                </button>
            </div>

            {/* 貼文操作按鈕 - 移到此處 */}
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                <button
                    className={`text-sm flex items-center ${isLiked ? 'text-pink-500 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={onLike}
                >
                    {isLiked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    )}
                    讚
                </button>
                <button
                    className="text-sm flex items-center text-gray-700 dark:text-gray-300"
                    onClick={() => setShowComments(!showComments)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    留言
                </button>
                <button className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    分享
                </button>

            </div>

            {/* 留言區 */}
            {showComments && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {/* 留言列表 */}
                    {isLoadingComments ? (
                        <div className="flex justify-center py-2">
                            <div className="animate-spin h-4 w-4 border-t-2 border-blue-400 rounded-full"></div>
                        </div>
                    ) : commentError ? (
                        <div className="text-xs text-red-500 py-1">{commentError}</div>
                    ) : commentsList.length > 0 ? (
                        <div className="space-y-2 mb-2 max-h-48 overflow-y-auto">
                            {commentsList.map(comment => (
                                <div key={comment.id} className="flex items-start space-x-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                                        {comment.username.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
                                            <p className="text-xs font-medium">{comment.username}</p>
                                            <p className="text-xs">{comment.content}</p>
                                        </div>

                                        {/* 顯示回覆 */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-1 ml-4 space-y-1">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="flex items-start space-x-1">
                                                        <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xxs">
                                                            {reply.username ? reply.username.charAt(0) : idolName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1">
                                                                <div className="flex items-center">
                                                                    <p className="text-xxs font-medium text-blue-600 dark:text-blue-400">
                                                                        {reply.username || idolName}
                                                                    </p>
                                                                    {reply.mode && (
                                                                        <span className="ml-1 text-xxs bg-blue-100 dark:bg-blue-800/30 text-blue-500 dark:text-blue-300 px-1 rounded">
                                                                            {reply.mode}
                                                                        </span>
                                                                    )}
                                                                    <span className="ml-1 text-xxs text-gray-400">{reply.time}</span>
                                                                </div>
                                                                <p className="text-xxs">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 回覆按鈕與輸入框 */}
                                        {replyingTo === comment.id ? (
                                            <div className="mt-1 ml-4 flex">
                                                <input
                                                    type="text"
                                                    value={replyInput}
                                                    onChange={(e) => setReplyInput(e.target.value)}
                                                    placeholder="輸入回覆..."
                                                    className="flex-1 text-xxs p-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                />
                                                <div className="flex ml-1">
                                                    <button
                                                        onClick={() => handleReplySubmit(comment.id)}
                                                        className="text-xxs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        disabled={!replyInput.trim()}
                                                    >
                                                        發送
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyInput('');
                                                        }}
                                                        className="text-xxs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded ml-1 hover:bg-gray-300 dark:hover:bg-gray-500"
                                                    >
                                                        取消
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                className="text-xxs text-blue-500 mt-0.5 ml-1 hover:underline"
                                                onClick={() => setReplyingTo(comment.id)}
                                            >
                                                回覆
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 py-1">還沒有留言</p>
                    )}

                    {/* 留言輸入框 */}
                    <form onSubmit={handleCommentSubmit} className="flex mt-1">
                        <input
                            type="text"
                            placeholder="添加留言..."
                            className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-gray-300"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-blue-500 text-xs font-medium"
                            disabled={!commentInput.trim()}
                        >
                            發佈
                        </button>
                    </form>
                </div>
            )}

            {/* 推薦內容區塊 */}
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs text-gray-500 dark:text-gray-400 font-medium">推薦內容</h4>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowCustomizeRecommendations(!showCustomizeRecommendations)}
                            className="text-xs text-blue-500 dark:text-blue-400 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            自訂
                        </button>
                        <button
                            onClick={randomizeRecommendations}
                            className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                            </svg>
                            隨機
                        </button>
                        <button
                            onClick={() => setShowRecommendations(!showRecommendations)}
                            className="text-xs text-gray-500 dark:text-gray-400"
                        >
                            {showRecommendations ? '收起' : '展開'}
                        </button>
                    </div>
                </div>

                {/* 自訂推薦區塊介面 */}
                {showCustomizeRecommendations && (
                    <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">選擇要顯示的內容</h5>
                        <div className="space-y-1.5">
                            {recommendationSections.map(section => (
                                <div key={section.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`rec-${id}-${section.id}`}
                                        checked={selectedRecommendations.includes(section.id)}
                                        onChange={() => toggleRecommendationSelection(section.id)}
                                        className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor={`rec-${id}-${section.id}`} className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {section.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={applyCustomRecommendations}
                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                套用
                            </button>
                        </div>
                    </div>
                )}

                {/* 顯示推薦區塊內容 */}
                {showRecommendations && recommendationSections && (
                    <RecommendationSection recommendationSections={recommendationSections} />
                )}
            </div>
        </div>
    );
} 