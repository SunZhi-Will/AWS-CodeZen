import MessageScheduleCenter from '../../../app/components/admin/MessageScheduleCenter';

export default function MessageSchedulePage() {
    return (
        <div className="text-gray-800">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">訊息排程中心</h1>
                <p className="text-gray-600 mt-1">查看與管理即將發送的生日祝福、紀念日或主題互動訊息</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <MessageScheduleCenter />
            </div>
        </div>
    );
} 