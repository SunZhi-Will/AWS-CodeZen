'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout, User } from '../utils/authUtils';
import Image from 'next/image';

const sidebarItems = [
    { name: '總覽', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: '用戶行為', path: '/admin/user-behavior', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: '記憶標籤', path: '/admin/memory-tags', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { name: '訊息排程', path: '/admin/message-schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: '系統健康', path: '/admin/system-health', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                // 如果不是管理員則導回首頁
                if (!user || user.role !== 'admin') {
                    router.push('/');
                }
            } catch (error) {
                console.error('獲取用戶信息出錯', error);
                router.push('/');
            }
        }

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        router.push('/');
    };

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 側邊導航 */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">服務端管理介面</h2>
                    {currentUser && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                                {currentUser.avatar ? (
                                    <Image src={currentUser.avatar} alt={currentUser.displayName} width={32} height={32} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{currentUser.displayName.charAt(0)}</span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                登出
                            </button>
                        </div>
                    )}
                </div>
                <nav className="mt-4">
                    <ul>
                        {sidebarItems.map((item) => (
                            <li key={item.path} className="mb-2">
                                <Link
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 text-sm ${isActive(item.path)
                                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg
                                        className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* 主要內容 */}
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}