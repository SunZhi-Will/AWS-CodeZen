import React from 'react';

// 定義指標類型


// 定義留言和回覆的界面
interface Reply {
    id: number;
    content: string;
    time: string;
    mode?: string;
}

// 定義貼文來源接口
interface PostSource {
    id: string | number;
    idolName: string;
    postType: string;
    content: string;
}

interface Message {
    id: number;
    user: string;
    content: string;
    time: string;
    status: string;
    replies: Reply[];
    sourcePost?: PostSource;
}

interface MessageThreadsProps {
    messages: Message[];
    replyInputs: { [key: number]: string };
    showAISuggestions: { [key: number]: boolean };
    handleReplyInputChange: (messageId: number, value: string) => void;
    handleSendReply: (messageId: number, replyContent: string, mode?: string) => void;
    toggleAISuggestion: (messageId: number) => void;
    useRecommendedReply: (messageId: number, replyContent: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// 量化指標組件
export default function MessageThreads({
    messages,
    replyInputs,
    showAISuggestions,
    handleReplyInputChange,
    handleSendReply,
    toggleAISuggestion,
    currentPage,
    totalPages,
    onPageChange
}: MessageThreadsProps) {




    // 渲染分頁按鈕
    const renderPaginationButtons = () => {
        const buttons = [];

        // 前一頁按鈕
        buttons.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
            >
                上一頁
            </button>
        );

        // 數字分頁按鈕
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 rounded text-sm ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
                >
                    {i}
                </button>
            );
        }

        // 下一頁按鈕
        buttons.push(
            <button
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
            >
                下一頁
            </button>
        );

        return buttons;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">粉絲留言串檢視</h2>
                    <div className="flex items-center space-x-2">
                        <select className="text-sm bg-gray-100 dark:bg-gray-700 border-none rounded-md text-gray-500 dark:text-gray-400 px-3 py-1.5 focus:ring-1 focus:ring-blue-500">
                            <option>全部留言</option>
                            <option>待回覆</option>
                            <option>已回覆</option>
                            <option>高優先</option>
                        </select>
                        <button className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                        <button className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-750 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium">{message.user[0]}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{message.user}</h4>
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                                            {message.status === '高優先' && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded">高優先</span>
                                            )}
                                            {/* 顯示來源貼文信息 */}
                                            {message.sourcePost && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded flex-shrink-0">
                                                    來自貼文
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{message.content}</p>

                                    {/* 顯示來源貼文詳情 */}
                                    {message.sourcePost && (
                                        <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-purple-800 dark:text-purple-400">留言來源：{message.sourcePost.idolName} 的貼文</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{message.sourcePost.postType === 'image' ? '圖片' : message.sourcePost.postType === 'video' ? '影片' : '音樂'}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{message.sourcePost.content}</p>
                                            <a href={`/idol-moments?post=${message.sourcePost.id}`} className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                                                查看原貼文
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}

                                    {/* 已有的回覆列表 */}
                                    {message.replies && message.replies.length > 0 && (
                                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">已回覆內容</h5>
                                            <div className="space-y-3">
                                                {message.replies.map((reply) => (
                                                    <div key={reply.id} className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-blue-500 dark:text-blue-400">{reply.mode || '回覆'}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{reply.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 回覆建議區 */}
                                    {message.status === '待回覆' && (
                                        <>
                                            {!showAISuggestions[message.id] ? (
                                                <button
                                                    onClick={() => toggleAISuggestion(message.id)}
                                                    className="mb-4 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded text-xs flex items-center hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    顯示 AI 回覆建議
                                                </button>
                                            ) : (
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 回覆建議</h5>
                                                        <div className="flex space-x-2">
                                                            <div className="flex space-x-1">
                                                                <button className="px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800/50 transition-colors">
                                                                    情感向
                                                                </button>
                                                                <button className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                                                                    品牌向
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleAISuggestion(message.id)}
                                                                className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                                                            onClick={() => handleSendReply(message.id, '謝謝你的期待與支持！💕 新歌正在緊鑼密鼓製作中，預計下個月就會發布喔！關於演唱會，我們正在規劃年底的小型見面會，請持續關注我的官方公告～', '情感向')}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-pink-500 dark:text-pink-400">情感向</span>
                                                                <button
                                                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSendReply(message.id, '謝謝你的期待與支持！💕 新歌正在緊鑼密鼓製作中，預計下個月就會發布喔！關於演唱會，我們正在規劃年底的小型見面會，請持續關注我的官方公告～', '情感向');
                                                                    }}
                                                                >
                                                                    使用此回覆
                                                                </button>
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">謝謝你的期待與支持！💕 新歌正在緊鑼密鼓製作中，預計下個月就會發布喔！關於演唱會，我們正在規劃年底的小型見面會，請持續關注我的官方公告～</p>
                                                        </div>

                                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                                                            onClick={() => handleSendReply(message.id, '感謝您的關注！星光夢想家將於下個月發布全新單曲，並計劃在年底舉辦粉絲見面會。詳細資訊將透過官方管道公告，建議您訂閱官方通知以獲取最新消息。', '品牌向')}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-blue-500 dark:text-blue-400">品牌向</span>
                                                                <button
                                                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSendReply(message.id, '感謝您的關注！星光夢想家將於下個月發布全新單曲，並計劃在年底舉辦粉絲見面會。詳細資訊將透過官方管道公告，建議您訂閱官方通知以獲取最新消息。', '品牌向');
                                                                    }}
                                                                >
                                                                    使用此回覆
                                                                </button>
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">感謝您的關注！星光夢想家將於下個月發布全新單曲，並計劃在年底舉辦粉絲見面會。詳細資訊將透過官方管道公告，建議您訂閱官方通知以獲取最新消息。</p>
                                                        </div>

                                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer group"
                                                            onClick={() => handleSendReply(message.id, '你好，感謝支持！✨ 新歌預計下個月發布，我們也在籌備年底的演唱會活動。所有最新消息都會在官方社群平台優先公布，記得追蹤我們不錯過任何重要消息哦！', '混合風格')}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-purple-500 dark:text-purple-400">混合風格</span>
                                                                <button
                                                                    className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSendReply(message.id, '你好，感謝支持！✨ 新歌預計下個月發布，我們也在籌備年底的演唱會活動。所有最新消息都會在官方社群平台優先公布，記得追蹤我們不錯過任何重要消息哦！', '混合風格');
                                                                    }}
                                                                >
                                                                    使用此回覆
                                                                </button>
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">你好，感謝支持！✨ 新歌預計下個月發布，我們也在籌備年底的演唱會活動。所有最新消息都會在官方社群平台優先公布，記得追蹤我們不錯過任何重要消息哦！</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* 回覆輸入框區域 */}
                                    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="p-2">
                                            <textarea
                                                id={`replyInput${message.id}`}
                                                className="w-full border-0 focus:ring-0 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 resize-none min-h-[100px] text-sm"
                                                placeholder="在此輸入回覆內容，或從上方選擇 AI 推薦回覆..."
                                                value={replyInputs[message.id] || ''}
                                                onChange={(e) => handleReplyInputChange(message.id, e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="flex items-center justify-between px-2 py-2 bg-gray-50 dark:bg-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                                <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div>
                                                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center" onClick={() => handleSendReply(message.id, replyInputs[message.id] || '', '')}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    發送回覆
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button className="inline-flex items-center px-2.5 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            回覆
                                        </button>
                                        <button className="inline-flex items-center px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            高優先
                                        </button>
                                        <button className="inline-flex items-center px-2.5 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            待回覆
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 分頁控制 */}
                <div className="mt-6 flex justify-between items-center">
                    <div className="flex text-sm text-gray-500 dark:text-gray-400">
                        <span>顯示 {(currentPage - 1) * Math.min(messages.length, 5) + 1} 至 {Math.min(currentPage * 5, messages.length)} 筆，共 {messages.length} 筆</span>
                    </div>
                    <div className="flex space-x-2">
                        {renderPaginationButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
} 