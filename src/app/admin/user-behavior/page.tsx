import UserBehaviorOverview from '../../../app/components/admin/UserBehaviorOverview';

export default function UserBehaviorPage() {
    return (
        <div className="text-gray-800">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">用戶行為總覽</h1>
                <p className="text-gray-600 mt-1">查看粉絲的在線趨勢、活躍熱區與行為偏好</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <UserBehaviorOverview />
            </div>
        </div>
    );
}