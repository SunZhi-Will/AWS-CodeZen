import Link from 'next/link';
import Navigation from './components/Navigation';

// 功能卡片組件的類型定義
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

// 成員卡片組件的類型定義
interface MemberCardProps {
  name: string;
  position: string;
  birthday: string;
  imageText: string;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation title="真人 AI 偶像平台" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            真人 AI 偶像平台
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            為 ARMY 打造的專屬平台，傳遞防彈少年團的音樂與故事
          </p>
          <div className="mt-8 flex justify-center gap-4">

            <Link
              href="/idol-moments"
              className="px-6 py-3 rounded-md bg-purple-600 text-white text-base font-medium hover:bg-purple-700 transition-colors"
            >
              成員動態
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-md bg-white text-blue-600 border border-blue-600 text-base font-medium hover:bg-blue-50 transition-colors"
            >
              ARMY 空間
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🎵"
            title="音樂作品"
            description="探索防彈少年團完整的音樂目錄，從出道曲到最新作品。"
          />
          <FeatureCard
            icon="🌟"
            title="社群連結"
            description="與全球 ARMY 建立連結，分享對防彈少年團的熱愛與支持。"
          />
          <FeatureCard
            icon="🎬"
            title="影像內容"
            description="觀看 MV、表演、綜藝及紀錄片等豐富的影像內容。"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">為何支持防彈少年團</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>真誠的音樂創作</strong>：傳達真實生活經驗和社會議題的音樂作品</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>積極正面的訊息</strong>：鼓勵年輕人愛自己、追尋夢想的「Love Yourself」系列</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>慈善與社會貢獻</strong>：積極參與聯合國青年計劃和各種慈善活動</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>文化影響力</strong>：將韓國文化推向全球，打破語言與文化的藩籬</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            防彈少年團成員
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MemberCard
              name="金南俊 (RM)"
              position="隊長、主Rapper"
              birthday="1994.09.12"
              imageText="RM"
            />
            <MemberCard
              name="金碩珍 (Jin)"
              position="大哥、主唱"
              birthday="1992.12.04"
              imageText="Jin"
            />
            <MemberCard
              name="閔玧其 (SUGA)"
              position="Rapper、製作人"
              birthday="1993.03.09"
              imageText="SG"
            />
            <MemberCard
              name="鄭號錫 (J-Hope)"
              position="主舞、Rapper"
              birthday="1994.02.18"
              imageText="JH"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <MemberCard
              name="朴智旻 (Jimin)"
              position="主唱、主舞"
              birthday="1995.10.13"
              imageText="JM"
            />
            <MemberCard
              name="金泰亨 (V)"
              position="主唱、視覺"
              birthday="1995.12.30"
              imageText="V"
            />
            <MemberCard
              name="田柾國 (Jungkook)"
              position="主唱、忙內"
              birthday="1997.09.01"
              imageText="JK"
            />
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">BTS 里程碑</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Billboard 成就</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                多次登上 Billboard Hot 100 和 Billboard 200 榜首，成為首支多次獲得此殊榮的韓國樂團。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">格萊美提名</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                多次獲得格萊美獎提名，並在全球音樂頒獎典禮上表演，展現K-pop的國際影響力。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">聯合國演講</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                在聯合國大會上發表演講，傳遞「Love Yourself」的訊息，鼓勵年輕人勇於表達自我。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">全球巡演</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                舉辦多次全球巡迴演唱會，場場爆滿，在世界各地的體育場創下票房紀錄。
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold">真人 AI 偶像平台</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 版權所有</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                關於我們
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                聯繫方式
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                隱私政策
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                服務條款
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 功能卡片組件
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

// 成員卡片組件
function MemberCard({ name, position, birthday, imageText }: MemberCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="h-40 bg-purple-200 dark:bg-purple-900 relative">
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-purple-600 dark:text-purple-300">
          {imageText}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white">{name}</h3>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>{position}</span>
          <span>{birthday}</span>
        </div>
        <button className="mt-3 w-full py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors">
          查看詳情
        </button>
      </div>
    </div>
  );
}
