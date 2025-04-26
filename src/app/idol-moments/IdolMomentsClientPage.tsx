'use client';


import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import ContentPublisher from '../components/ContentPublisher';
import { saveMessagesToCookie, getMessagesFromCookie } from '../utils/cookieUtils';
import './post-highlight.css';
import BirthdayNotification from '../components/BirthdayNotification';
import RecommendationSection, { RecommendationSectionType } from '../components/RecommendationSection';

// 定義一個本地 Message 接口
interface CookieMessage {
    id: number;
    user: string;
    content: string;
    time: string;
    status: string;
    replies: CookieReply[];
    sourcePost?: { id: string };
}

interface CookieReply {
    id: number | string;
    content: string;
    time: string;
    mode?: string;
}

// 貼文類型定義
interface PostProps {
    id: string;
    idolName: string;
    idolAvatar?: string | null;
    avatarText?: string;
    content: string;
    imageUrl?: string;
    imageText?: string;
    videoUrl?: string;
    musicTitle?: string;
    musicArtist?: string;
    musicDuration?: string;
    embeddedUrl?: string;
    audioUrl?: string;
    audioCoverUrl?: string;
    postType: 'image' | 'video' | 'music';
    likes: number;
    comments: number;
    timestamp: string;
    isLiked?: boolean;
    onLike?: () => void;
    onDelete?: () => void;
    commentList?: CommentItem[];
}

// 評論項目接口
interface CommentItem {
    id: string;
    username: string;
    content: string;
    timestamp: string;
    replies?: Reply[];
}

// 回覆接口
interface Reply {
    id: number | string;
    content: string;
    time: string;
    username: string;
    mode?: string;
}

// 處理 cookie 中的貼文數據
// 下面兩個函數暫時保留但未使用，將來可能需要
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function savePosts(posts: PostProps[]): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('idol-posts', JSON.stringify(posts));
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPostsFromStorage(): PostProps[] {
    if (typeof window !== 'undefined') {
        const postsData = localStorage.getItem('idol-posts');
        if (postsData) {
            try {
                return JSON.parse(postsData);
            } catch (error) {
                console.error('解析貼文數據失敗:', error);
            }
        }
    }
    return defaultPosts;
}

// 默認貼文數據
const defaultPosts: PostProps[] = [
    {
        id: "post1",
        idolName: "RM (金南俊)",
        idolAvatar: null,
        avatarText: "RM",
        content: "今天在錄音室完成了新歌的創作，感謝所有支持的ARMY！你們的喜愛是我們繼續前進的動力 💜 #BTS #音樂創作",
        imageUrl: "/ai-1.jpg",
        embeddedUrl: "https://www.youtube.com/embed/qGjAWJ2zWWI",
        musicTitle: "Life Goes On",
        musicArtist: "BTS",
        musicDuration: "3:28",
        postType: "image",
        likes: 1200,
        comments: 87,
        timestamp: "2小時前"
    },
    {
        id: "post2",
        idolName: "Jin (金碩珍)",
        idolAvatar: null,
        avatarText: "Jin",
        content: "分享一段做飯的影片，希望能讓大家在忙碌的生活中找到一些樂趣。記得照顧好自己 🍳 #防彈少年團 #Jin的廚房",
        videoUrl: "https://www.youtube.com/watch?v=fpvvKROcQF8",
        embeddedUrl: "https://www.youtube.com/embed/fpvvKROcQF8",
        postType: "video",
        likes: 876,
        comments: 56,
        timestamp: "5小時前"
    },
    {
        id: "post3",
        idolName: "SUGA (閔玧其)",
        idolAvatar: null,
        avatarText: "SG",
        content: "今天在工作室完成了新曲的混音，音樂製作的過程總是充滿挑戰和樂趣。期待與ARMY分享這首新歌 🎹 #SUGA #Agust_D",
        imageText: "音樂製作",
        postType: "image",
        likes: 543,
        comments: 42,
        timestamp: "昨天"
    },
    {
        id: "post4",
        idolName: "J-Hope (鄭號錫)",
        idolAvatar: null,
        avatarText: "JH",
        content: "最新舞蹈創作的幕後花絮分享給大家！希望這支舞能給大家帶來正能量和希望 🕺 #J_Hope #舞蹈",
        imageText: "舞蹈練習",
        postType: "image",
        likes: 982,
        comments: 63,
        timestamp: "2天前"
    },
    {
        id: "post5",
        idolName: "Jimin (朴智旻)",
        idolAvatar: null,
        avatarText: "JM",
        content: "剛錄製完這首新歌的人聲！這首歌的靈感來自於與ARMY的回憶，希望大家會喜歡 🎵 #Jimin #Filter",
        musicTitle: "Filter",
        musicArtist: "Jimin",
        musicDuration: "2:57",
        embeddedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1234567890&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
        postType: "music",
        likes: 2300,
        comments: 142,
        timestamp: "3天前"
    }
];

export default function IdolMomentsClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const targetPostId = searchParams.get('post');

    // 狀態管理
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
    const [highlightedPost, setHighlightedPost] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 生日通知狀態
    const [showBirthdayNotification, setShowBirthdayNotification] = useState(false);
    const [birthdayIdol, setBirthdayIdol] = useState({
        name: 'Jimin (朴智旻)',
        message: '今天是我的生日！感謝ARMY一直以來的支持和喜愛 💜'
    });

    // 從 API 獲取帖子
    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('獲取貼文失敗');
            }
            const data = await response.json();
            setPosts(data);

            // 獲取用戶點讚狀態 (假設用戶ID為 'user1')
            const userId = 'user1'; // 實際應用中應該從身份驗證系統獲取

            // 為每個帖子檢查點讚狀態
            const likedStatus: { [key: string]: boolean } = {};
            for (const post of data) {
                const likeResponse = await fetch(`/api/likes?postId=${post.id}&userId=${userId}`);
                if (likeResponse.ok) {
                    const { isLiked } = await likeResponse.json();
                    likedStatus[post.id] = isLiked;
                }
            }
            setLikedPosts(likedStatus);
        } catch (error) {
            console.error('獲取貼文時出錯:', error);
            setError('獲取貼文失敗，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 新增的函數：處理新發布的貼文
    const handleNewPost = useCallback((event: Event) => {
        const customEvent = event as CustomEvent<PostProps>;
        const newPost = customEvent.detail;
        if (newPost) {
            // 將新貼文添加到貼文列表的頂部
            setPosts(prevPosts => [newPost, ...prevPosts]);

            // 新貼文預設為未點讚狀態
            setLikedPosts(prev => ({
                ...prev,
                [newPost.id]: false
            }));
        }
    }, []);

    // 新增的函數：處理留言更新
    const handleCommentUpdate = useCallback((event: Event) => {
        const customEvent = event as CustomEvent<{ postId: string, newCount: number }>;
        const { postId, newCount } = customEvent.detail;
        if (postId) {
            // 更新貼文列表中的留言數
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, comments: newCount }
                        : post
                )
            );
        }
    }, []);

    // 初始載入
    useEffect(() => {
        fetchPosts();

        // 在頁面載入後延遲顯示生日通知
        setTimeout(() => {
            setShowBirthdayNotification(true);
        }, 1500);

        // 添加自定義事件監聽器
        window.addEventListener('newPostPublished', handleNewPost);
        window.addEventListener('commentUpdated', handleCommentUpdate);

        // 清理函數
        return () => {
            window.removeEventListener('newPostPublished', handleNewPost);
            window.removeEventListener('commentUpdated', handleCommentUpdate);
        };
    }, [fetchPosts, handleNewPost, handleCommentUpdate]);

    // 處理高亮顯示
    useEffect(() => {
        if (targetPostId && posts.length > 0) {
            setHighlightedPost(targetPostId);

            // 自動滾動到指定貼文
            setTimeout(() => {
                const element = document.getElementById(`post-${targetPostId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlighted-post');
                    setTimeout(() => {
                        element.classList.remove('highlighted-post');
                    }, 3000);
                }
            }, 500);
        }
    }, [targetPostId, posts]);

    // 處理點讚操作
    const handleLike = async (postId: string) => {
        try {
            const userId = 'user1'; // 實際應用中應該從身份驗證系統獲取

            // 呼叫 API 切換點讚狀態
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId }),
            });

            if (!response.ok) {
                throw new Error('點讚操作失敗');
            }

            const result = await response.json();

            // 更新本地狀態
            setLikedPosts(prev => ({
                ...prev,
                [postId]: result.action === 'liked'
            }));

            // 更新帖子列表中的點讚數
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, likes: result.likes }
                        : post
                )
            );
        } catch (error) {
            console.error('點讚操作時出錯:', error);
        }
    };

    // 處理刪除貼文
    const handleDeletePost = async (postId: string) => {
        if (!confirm('確定要刪除這則貼文嗎？此操作無法復原。')) {
            return;
        }

        try {
            // 使用正確的 API 路徑
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '刪除貼文失敗');
            }

            // 從列表中移除貼文
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

            // 觸發自定義事件通知系統更新
            window.dispatchEvent(new CustomEvent('postDeleted', {
                detail: { postId }
            }));
        } catch (error) {
            console.error('刪除貼文時出錯:', error);
            alert('刪除貼文失敗，請稍後再試');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation title="真人 AI 偶像平台" />

            <main className="max-w-md mx-auto px-2 py-4">
                {/* 內容發布區塊 */}
                <div className="mb-4">
                    <ContentPublisher />
                </div>

                {/* 頭像列 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 mb-4">
                    <div className="flex overflow-x-auto space-x-3 pb-1">
                        {['RM (金南俊)', 'Jin (金碩珍)', 'SUGA (閔玧其)', 'J-Hope (鄭號錫)'].map((name, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex flex-col items-center space-y-1"
                                onClick={() => {
                                    if (name === 'Jimin (朴智旻)') {
                                        setBirthdayIdol({
                                            name: name,
                                            message: '今天是我的生日！感謝ARMY一直以來的支持和喜愛 💜'
                                        });
                                        setShowBirthdayNotification(true);
                                    }
                                }}
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-lg font-medium overflow-hidden">
                                        {name.includes('(') ? name.split(' ')[0].charAt(0) : name.charAt(0)}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300">{name.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 貼文列表 */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-400"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                id={`post-${post.id}`}
                                className={`transition-all duration-300 ${highlightedPost === post.id.toString() ? 'ring-2 ring-blue-400' : ''}`}
                            >
                                <SimplifiedPost
                                    {...post}
                                    isLiked={!!likedPosts[post.id]}
                                    onLike={() => handleLike(post.id)}
                                    onDelete={() => handleDeletePost(post.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* 生日通知 */}
                {showBirthdayNotification && (
                    <BirthdayNotification
                        idolName={birthdayIdol.name}
                        fanName="粉絲"
                        avatarUrl="/ai-1.jpg"
                        message={`我是${birthdayIdol.name}，祝你生日快樂！🎂✨`}
                        onClose={() => setShowBirthdayNotification(false)}
                        onClick={() => {
                            router.push('/gifts');
                        }}
                    />
                )}
            </main>
        </div>
    );
}

// 簡化後的貼文組件
function SimplifiedPost({
    id,
    idolName,
    avatarText,
    content,
    imageUrl,
    imageText,
    musicTitle,
    musicArtist,
    musicDuration,
    postType,
    likes,
    comments,
    timestamp,
    isLiked,
    onLike,
    onDelete
}: PostProps) {
    const [commentInput, setCommentInput] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentsCount, setCommentsCount] = useState(comments);
    const [showOptions, setShowOptions] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyInput, setReplyInput] = useState('');

    // 推薦內容區塊相關狀態
    const [recommendationSections, setRecommendationSections] = useState<RecommendationSectionType[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(true); // 預設展開
    const [showCustomizeRecommendations, setShowCustomizeRecommendations] = useState(false);
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

    // 從 API 獲取評論
    const fetchComments = useCallback(async () => {
        setIsLoadingComments(true);
        setCommentError(null);

        try {
            // 從 cookie 獲取留言數據
            const messagesData = getMessagesFromCookie() || [];

            // 過濾與當前貼文相關的留言
            const relevantComments = (messagesData as CookieMessage[])
                .filter(msg => msg.sourcePost && msg.sourcePost.id === id)
                .map(msg => ({
                    id: msg.id.toString(),
                    username: msg.user,
                    content: msg.content,
                    timestamp: msg.time,
                    replies: msg.replies.map((reply: CookieReply) => ({
                        id: reply.id.toString(),
                        username: idolName,
                        content: reply.content,
                        time: reply.time,
                        mode: reply.mode
                    }))
                }));

            setCommentsList(relevantComments);
        } catch (error) {
            console.error('獲取評論時出錯:', error);
            setCommentError('無法載入評論');
        } finally {
            setIsLoadingComments(false);
        }
    }, [id, idolName]);

    // 生成推薦內容
    const generateRecommendations = useCallback(() => {
        // 預設推薦內容區塊 - 完整版
        const defaultSections: RecommendationSectionType[] = [
            // 相關音樂區塊
            {
                id: 'music',
                type: 'music',
                title: '相關音樂',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                    </svg>
                ),
                content: {
                    title: musicTitle || `${idolName}的熱門歌曲`,
                    artist: musicArtist || `${idolName}`,
                    duration: musicDuration || '3:45',
                },
                enabled: postType === 'music' || Math.random() > 0.5
            },
            // 相關影片區塊
            {
                id: 'video',
                type: 'video',
                title: '相關影片',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500 dark:text-red-400 mr-1">
                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                ),
                content: {
                    url: 'https://www.youtube.com/embed/vviKLFa4WvA',
                    title: `${idolName}的${postType === 'video' ? '影片' : postType === 'music' ? '音樂' : '內容'}`
                },
                enabled: postType === 'video' || Math.random() > 0.6
            } as RecommendationSectionType,
            // 相關主題區塊
            {
                id: 'topic',
                type: 'topic',
                title: '相關主題',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                ),
                content: [
                    { tag: `#${idolName}`, url: '#' },
                    { tag: '#AI偶像', url: '#' },
                    { tag: '相關活動', url: '#' },
                    { tag: '#虛擬偶像', url: '#' },
                    { tag: '#創作者', url: '#' }
                ],
                enabled: true
            },
            // 你可能也喜歡區塊
            {
                id: 'similar',
                type: 'similar',
                title: '你可能也喜歡',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500 dark:text-green-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                ),
                content: [
                    { title: `更多${idolName}的作品`, subtitle: '探索更多', imageText: '其他作品' },
                    { title: '發掘相似偶像', subtitle: '查看更多', imageText: '相似偶像' }
                ],
                enabled: Math.random() > 0.4
            },
            // 最新活動區塊
            {
                id: 'event',
                type: 'event',
                title: '最新活動',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                ),
                content: {
                    title: '虛擬偶像演唱會',
                    date: '2023年12月25日',
                    location: '線上直播',
                    description: '與你喜愛的AI偶像共度佳節！'
                },
                enabled: Math.random() > 0.4
            } as RecommendationSectionType,
            // 相關文章區塊
            {
                id: 'article',
                type: 'article',
                title: '相關文章',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-500 dark:text-amber-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                ),
                content: [
                    { title: 'AI偶像如何改變娛樂產業', date: '3天前', url: '#' },
                    { title: '虛擬偶像背後的技術揭秘', date: '1週前', url: '#' }
                ],
                enabled: Math.random() > 0.5
            } as RecommendationSectionType,
            // 周邊商品區塊
            {
                id: 'product',
                type: 'product',
                title: '周邊商品',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-pink-500 dark:text-pink-400 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                ),
                content: [
                    { title: `${idolName}限定周邊`, price: 'NT$590' },
                    { title: 'AI偶像聯名T恤', price: 'NT$790' }
                ],
                enabled: Math.random() > 0.5
            } as RecommendationSectionType
        ];

        // 根據當前貼文類型調整優先顯示某些區塊
        if (postType === 'music') {
            // 音樂貼文時確保顯示音樂推薦
            const musicSection = defaultSections.find(s => s.id === 'music');
            if (musicSection) musicSection.enabled = true;
        } else if (postType === 'video') {
            // 影片貼文時確保顯示影片推薦
            const videoSection = defaultSections.find(s => s.id === 'video');
            if (videoSection) videoSection.enabled = true;
        }

        // 隨機保持 3-5 個區塊啟用，避免過多
        const enabledSections = defaultSections.filter(s => s.enabled);
        if (enabledSections.length > 5) {
            // 保留必要區塊，隨機禁用其他區塊
            const necessarySectionIds = ['topic']; // 主題標籤始終保留
            if (postType === 'music') necessarySectionIds.push('music');
            if (postType === 'video') necessarySectionIds.push('video');

            const optionalSections = defaultSections.filter(s => !necessarySectionIds.includes(s.id));
            // 打亂順序
            for (let i = optionalSections.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionalSections[i], optionalSections[j]] = [optionalSections[j], optionalSections[i]];
            }

            // 隨機選擇 1-3 個可選區塊啟用
            const numToEnable = Math.floor(Math.random() * 3) + 1;
            optionalSections.forEach((section, index) => {
                section.enabled = index < numToEnable;
            });
        } else if (enabledSections.length < 3) {
            // 確保至少有 3 個區塊啟用
            const disabledSections = defaultSections.filter(s => !s.enabled);
            // 打亂順序
            for (let i = disabledSections.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [disabledSections[i], disabledSections[j]] = [disabledSections[j], disabledSections[i]];
            }

            // 啟用一些區塊
            const numToEnable = 3 - enabledSections.length;
            disabledSections.slice(0, numToEnable).forEach(section => {
                section.enabled = true;
            });
        }

        setRecommendationSections(defaultSections);
        setSelectedRecommendations(defaultSections.filter(s => s.enabled).map(s => s.id));
    }, [idolName, postType, musicTitle, musicArtist, musicDuration]);

    // 初始化推薦內容
    useEffect(() => {
        generateRecommendations();
    }, [generateRecommendations]);

    // 當顯示評論時加載數據
    useEffect(() => {
        if (showComments && commentsList.length === 0) {
            fetchComments();
        }
    }, [showComments, commentsList.length, fetchComments]);

    // 重置為隨機推薦
    const randomizeRecommendations = () => {
        generateRecommendations();
        setShowCustomizeRecommendations(false);
    };

    // 切換推薦區塊的選擇狀態
    const toggleRecommendationSelection = (id: string) => {
        setSelectedRecommendations(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    // 應用自訂推薦設定
    const applyCustomRecommendations = () => {
        const updatedSections = recommendationSections.map(section => ({
            ...section,
            enabled: selectedRecommendations.includes(section.id)
        }));

        setRecommendationSections(updatedSections);
        setShowCustomizeRecommendations(false);
    };

    // 處理留言提交
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            // 從 cookie 中獲取留言
            const messagesData = getMessagesFromCookie() || [];

            // 創建新留言
            const newMessage = {
                id: Date.now(),
                user: '你',
                content: commentInput,
                time: '剛剛',
                status: '待回覆',
                replies: [],
                sourcePost: {
                    id: id,
                    idolName: idolName,
                    postType: postType,
                    content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
                }
            };

            // 添加新留言到列表
            messagesData.unshift(newMessage);

            // 保存到 cookie
            saveMessagesToCookie(messagesData);

            // 轉換為 CommentItem 格式
            const newComment: CommentItem = {
                id: newMessage.id.toString(),
                username: newMessage.user,
                content: newMessage.content,
                timestamp: newMessage.time,
                replies: []
            };

            // 新增評論到列表頂部
            setCommentsList(prev => [newComment, ...prev]);

            // 更新評論計數
            const newCount = commentsCount + 1;
            setCommentsCount(newCount);

            // 通知更新評論計數
            window.dispatchEvent(new CustomEvent('commentUpdated', {
                detail: {
                    postId: id,
                    newCount: newCount
                }
            }));

            // 清空輸入框
            setCommentInput('');
        } catch (error) {
            console.error('發送評論時出錯:', error);
        }
    };

    // 處理留言回覆
    const handleReplySubmit = (commentId: string) => {
        if (!replyInput.trim()) return;

        try {
            // 從 cookie 中獲取留言
            const messagesData = getMessagesFromCookie() || [];

            // 創建新回覆
            const newReply = {
                id: Date.now(),
                content: replyInput,
                time: '剛剛',
                mode: '回覆'
            };

            // 更新 cookie 中的留言數據
            const updatedMessages = messagesData.map(msg => {
                if (msg.id.toString() === commentId) {
                    return {
                        ...msg,
                        status: '已回覆',
                        replies: [...msg.replies, newReply]
                    };
                }
                return msg;
            });

            // 保存到 cookie
            saveMessagesToCookie(updatedMessages);

            // 更新本地留言列表狀態
            const newReplyItem: Reply = {
                id: newReply.id.toString(),
                username: idolName,
                content: newReply.content,
                time: newReply.time,
                mode: newReply.mode
            };

            const updatedComments = commentsList.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReplyItem]
                    };
                }
                return comment;
            });

            setCommentsList(updatedComments);
            setReplyInput('');
            setReplyingTo(null);
        } catch (error) {
            console.error('發送回覆時出錯:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {/* 貼文頭部 */}
            <div className="flex items-center p-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300">
                    {avatarText || idolName.charAt(0)}
                </div>
                <div className="ml-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{idolName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</p>
                </div>
                <div className="ml-auto relative">
                    <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </button>

                    {/* 選項菜單 */}
                    {showOptions && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 text-xs">
                            <ul className="py-1">
                                <li>
                                    <button
                                        className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/idol-moments?post=${id}`);
                                            setShowOptions(false);
                                        }}
                                    >
                                        複製連結
                                    </button>
                                </li>
                                {onDelete && (
                                    <li>
                                        <button
                                            className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                            onClick={() => {
                                                setShowOptions(false);
                                                onDelete();
                                            }}
                                        >
                                            刪除
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* 貼文內容（圖片/影片/音樂） */}
            {postType === 'image' && imageUrl && (
                <Image
                    src={imageUrl}
                    alt={imageText || '貼文圖片'}
                    className="w-full h-auto"
                    width={500}
                    height={300}
                />
            )}

            {postType === 'video' && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                </div>
            )}

            {postType === 'music' && (
                <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{musicTitle}</h3>
                            <p className="text-xs opacity-80">{musicArtist}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 貼文內容 */}
            <div className="px-3 py-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{idolName}</span> {content}
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
                    {showRecommendations && (
                        <RecommendationSection recommendationSections={recommendationSections} />
                    )}
                </div>
            </div>
        </div>
    );
} 