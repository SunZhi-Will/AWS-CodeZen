import React from 'react';

// 各種內容的類型定義
interface MusicContent {
    title: string;
    artist: string;
    duration: string;
}

interface VideoContent {
    url: string;
    title: string;
}

interface TopicItem {
    tag: string;
    url: string;
    show?: boolean;
}

interface SimilarItem {
    imageText: string;
    title: string;
    subtitle: string;
}

interface EventContent {
    title: string;
    date: string;
    location: string;
    description: string;
}

interface ArticleItem {
    title: string;
    date: string;
    url: string;
}

interface ProductItem {
    title: string;
    price: string;
}

// 推薦內容類型聯合
type RecommendationContent =
    | MusicContent
    | VideoContent
    | TopicItem[]
    | SimilarItem[]
    | EventContent
    | ArticleItem[]
    | ProductItem[];

// 推薦內容區塊類型
export interface RecommendationSectionType {
    id: string;
    type: 'music' | 'video' | 'topic' | 'similar' | 'event' | 'article' | 'product';
    title: string;
    icon: React.ReactNode;
    content: RecommendationContent;
    enabled: boolean;
}

interface RecommendationSectionProps {
    recommendationSections: RecommendationSectionType[];
}

// 定義指標類型
interface Metric {
    id: number;
    name: string;
    value: string;
    target: string;
    description: string;
    status: 'success' | 'warning';
    trend: string;
    color: 'blue' | 'purple' | 'green';
    icon: React.ReactNode;
}

// 量化指標組件
export default function RecommendationSection({ recommendationSections }: RecommendationSectionProps) {
    // 指標數據
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const metrics: Metric[] = [
        {
            id: 1,
            name: '回覆觸及率',
            value: '67%',
            target: '≥ 60%',
            description: '回覆訊息被開啟/點讚的比率',
            status: 'success',
            trend: '+7%',
            color: 'blue',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            )
        },
        {
            id: 2,
            name: '月互動量',
            value: '2,438',
            target: '≥ 2,000',
            description: '每月互動數（首月追蹤基準）',
            status: 'success',
            trend: '+438',
            color: 'purple',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            )
        },
        {
            id: 3,
            name: '系統穩定度',
            value: '137 小時',
            target: 'TBF ≥ 100 小時',
            description: '無重大故障時間',
            status: 'success',
            trend: '+37小時',
            color: 'green',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getColorClasses = (color: 'blue' | 'purple' | 'green', status: 'success' | 'warning') => {
        const colorMap = {
            blue: {
                bg: status === 'success' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-blue-700 dark:text-blue-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-blue-200 dark:border-blue-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-blue-600 dark:bg-blue-500' : 'bg-yellow-600 dark:bg-yellow-500'
            },
            purple: {
                bg: status === 'success' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-purple-700 dark:text-purple-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-purple-200 dark:border-purple-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-yellow-600 dark:bg-yellow-500'
            },
            green: {
                bg: status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                text: status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400',
                border: status === 'success' ? 'border-green-200 dark:border-green-800' : 'border-yellow-200 dark:border-yellow-800',
                accent: status === 'success' ? 'bg-green-600 dark:bg-green-500' : 'bg-yellow-600 dark:bg-yellow-500'
            }
        };

        return colorMap[color] || colorMap.blue;
    };

    return (
        <div className="space-y-4">
            {recommendationSections.filter(section => section.enabled).map(section => {
                switch (section.type) {
                    case 'music':
                        const musicContent = section.content as MusicContent;
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="p-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                                            </svg>
                                        </div>
                                        <div className="mr-auto">
                                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{musicContent.title}</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{musicContent.artist}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button className="text-gray-700 dark:text-gray-300 hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                                </svg>
                                            </button>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{musicContent.duration}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full w-1/4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'video':
                        const videoContent = section.content as VideoContent;
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                                        <iframe
                                            src={videoContent.url}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={videoContent.title}
                                        ></iframe>
                                    </div>
                                    <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                        <span>推薦觀看</span>
                                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            查看完整影片
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'topic':
                        const topicContent = section.content as TopicItem[];
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {topicContent.filter((topic) => topic.show !== false).map((topic, idx) => (
                                        <a
                                            key={idx}
                                            href={topic.url}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {topic.tag}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );

                    case 'similar':
                        const similarContent = section.content as SimilarItem[];
                        return (
                            <div key={section.id}>
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {similarContent.map((item, idx) => (
                                        <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    {item.imageText}
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                    case 'event':
                        const eventContent = section.content as EventContent;
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                    <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300">{eventContent.title}</h3>
                                    <div className="mt-1 flex items-center text-xs text-purple-600 dark:text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        {eventContent.date}
                                    </div>
                                    <div className="mt-0.5 flex items-center text-xs text-purple-600 dark:text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {eventContent.location}
                                    </div>
                                    <p className="mt-2 text-xs text-purple-700 dark:text-purple-300">{eventContent.description}</p>
                                    <div className="mt-2 flex justify-end">
                                        <button className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                                            了解更多
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'article':
                        const articleContent = section.content as ArticleItem[];
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="space-y-2">
                                    {articleContent.map((article, idx) => (
                                        <a
                                            key={idx}
                                            href={article.url}
                                            className="block p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors"
                                        >
                                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">{article.title}</h3>
                                            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{article.date}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );

                    case 'product':
                        const productContent = section.content as ProductItem[];
                        return (
                            <div key={section.id} className="mb-4">
                                <div className="flex items-center mb-2">
                                    {section.icon}
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{section.title}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {productContent.map((product, idx) => (
                                        <div key={idx} className="flex items-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30">
                                            <div className="w-10 h-10 bg-pink-200 dark:bg-pink-800/50 rounded-md flex items-center justify-center mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-600 dark:text-pink-300">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-medium text-pink-800 dark:text-pink-300">{product.title}</h3>
                                                <p className="text-xs text-pink-600 dark:text-pink-400">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
} 