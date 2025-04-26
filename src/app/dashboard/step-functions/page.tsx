import StepFunctionsExample from "../../components/StepFunctionsExample";

export default function StepFunctionsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">AWS Step Functions 管理儀表板</h1>

            <div className="grid grid-cols-1 gap-8">
                <StepFunctionsExample />

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">什麼是 AWS Step Functions?</h2>
                    <p className="text-gray-600 mb-4">
                        AWS Step Functions 是一個無伺服器的工作流服務，可讓您協調多個 AWS 服務，使構建複雜應用程序變得簡單。
                        您可以設計和運行可視化的工作流程，將各種服務協調為端到端應用程序。
                    </p>

                    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">主要優勢</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>可視化工作流程設計</li>
                        <li>自動錯誤處理和重試機制</li>
                        <li>支持並行執行和條件分支</li>
                        <li>無需管理基礎架構</li>
                        <li>可與多種 AWS 服務集成</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">常見用例</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>數據處理和 ETL 工作流</li>
                        <li>微服務協調</li>
                        <li>IT 自動化和DevOps流程</li>
                        <li>人工審核流程</li>
                        <li>機器學習模型訓練和部署</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 