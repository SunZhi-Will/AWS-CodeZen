"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { login, getAllUsers, UserRole } from '../../utils/authUtils';
import type { User } from '../../utils/authUtils';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        // 獲取所有用戶
        async function fetchUsers() {
            try {
                setLoadingUsers(true);
                const allUsers = await getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error('獲取用戶列表失敗', error);
                setError('無法加載用戶列表，請稍後再試');
            } finally {
                setLoadingUsers(false);
            }
        }

        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUser) {
            setError('請選擇一個用戶進行登入');
            return;
        }

        try {
            setLoading(true);
            const user = await login(selectedUser);

            if (user) {
                // 根據不同角色導向不同頁面
                switch (user.role) {
                    case UserRole.ADMIN:
                        router.push('/admin');
                        break;
                    case UserRole.IDOL:
                        router.push('/dashboard');
                        break;
                    case UserRole.FAN:
                        router.push('/idol-moments');
                        break;
                    default:
                        router.push('/');
                }
            } else {
                setError('登入失敗，請稍後再試');
            }
        } catch (error) {
            console.error('登入過程出錯', error);
            setError('登入時發生錯誤');
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation title="登入系統" />

            <main className="max-w-md mx-auto mt-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">登入系統</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            使用 SQLite 本地資料庫，提供三個預設角色
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                選擇角色
                            </label>

                            {loadingUsers ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md animate-pulse">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {users.map(user => (
                                        <div
                                            key={user.id}
                                            className={`p-3 border rounded-md cursor-pointer flex items-center ${selectedUser === user.username
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                                : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                            onClick={() => setSelectedUser(user.username)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                {user.avatar ? (
                                                    <Image src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full" />
                                                ) : (
                                                    user.displayName.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.displayName}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    角色: {getRoleName(user.role)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }`}
                        >
                            {loading ? '登入中...' : '登入'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                            返回首頁
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
} 