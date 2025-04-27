"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout, User, UserRole } from '../utils/authUtils';
import Image from 'next/image';

// 隨機顏色陣列
const avatarColors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
];

interface NavigationProps {
    title?: string;
}

export default function Navigation({ title = "真人 AI 偶像" }: NavigationProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 為用戶分配一個固定的隨機顏色
    const avatarColor = useMemo(() => {
        if (!currentUser) return avatarColors[0];
        // 根據用戶名生成一個固定的索引
        const colorIndex = currentUser.username.charCodeAt(0) % avatarColors.length;
        return avatarColors[colorIndex];
    }, [currentUser]);

    // 在客戶端初始化檢查用戶登入狀態
    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error('獲取用戶信息出錯', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setIsDropdownOpen(false);
        router.push('/');
    };

    const navigateToLogin = () => {
        router.push('/auth/login');
    };

    const getRoleBadgeClass = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case UserRole.IDOL:
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case UserRole.FAN:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getRoleName = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return '管理員';
            case UserRole.IDOL:
                return '偶像';
            case UserRole.FAN:
                return '粉絲';
            default:
                return '未知';
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold">{title}</h1>
                        </div>
                        <nav className="ml-6 flex space-x-4 items-center">
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')
                                    ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                首頁
                            </Link>
                            <Link
                                href="/idol-moments"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/idol-moments')
                                    ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                偶像動態
                            </Link>
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')
                                    ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                偶像空間
                            </Link>
                            {currentUser?.role === UserRole.ADMIN && (
                                <Link
                                    href="/admin"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')
                                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    管理介面
                                </Link>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center overflow-hidden`}>
                                        {currentUser.avatar ? (
                                            <Image src={currentUser.avatar} alt={currentUser.displayName} width={32} height={32} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white font-medium">{currentUser.displayName.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="font-medium text-sm">{currentUser.displayName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeClass(currentUser.role)}`}>
                                        {getRoleName(currentUser.role)}
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                                        <Link
                                            href={currentUser.role === UserRole.IDOL ? "/dashboard" : "/fan-portal"}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            個人資料
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            登出
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={navigateToLogin}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                            >
                                登入/註冊
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 