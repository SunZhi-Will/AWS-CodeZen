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
            結合真人表演與AI技術的次世代偶像互動平台，創造前所未有的沉浸式粉絲體驗
          </p>
          <div className="mt-8 flex justify-center gap-4">

            <Link
              href="/idol-moments"
              className="px-6 py-3 rounded-md bg-purple-600 text-white text-base font-medium hover:bg-purple-700 transition-colors"
            >
              偶像動態
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-md bg-white text-blue-600 border border-blue-600 text-base font-medium hover:bg-blue-50 transition-colors"
            >
              粉絲空間
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🎵"
            title="原創音樂"
            description="欣賞偶像們的原創音樂作品，從數位單曲到完整專輯，展現獨特魅力。"
          />
          <FeatureCard
            icon="🌟"
            title="互動體驗"
            description="透過AI技術與您喜愛的偶像進行專屬互動，享受個人化的溝通體驗。"
          />
          <FeatureCard
            icon="🎬"
            title="虛實結合"
            description="觀看結合實體演出和虛擬技術的表演內容，感受前衛科技帶來的視聽盛宴。"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">平台特色與優勢</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>AI 互動技術</strong>：透過深度學習技術，提供超越想像的偶像互動體驗</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>跨界合作內容</strong>：結合音樂、舞蹈、時尚、遊戲等多元領域的創新作品</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>全球粉絲社群</strong>：連結世界各地粉絲，共同參與偶像成長與創作過程</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">✓</span>
              <span><strong>沉浸式體驗</strong>：運用最新XR技術，打造身臨其境的虛實整合演出</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            平台偶像陣容
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
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">平台里程碑</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">數位互動創新</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                首創AI語音互動技術，讓偶像能與粉絲進行近乎真實的對話，獲得科技創新大獎肯定。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">虛擬演唱會</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                舉辦首場結合實體與虛擬技術的混合演唱會，同時間吸引百萬粉絲線上參與互動。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">原創IP拓展</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                平台原創IP成功拓展至動畫、遊戲、周邊商品等多元領域，建立完整的偶像生態系統。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">全球粉絲社群</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                平台註冊用戶突破千萬，來自全球超過50個國家，形成多元文化交流的偶像社群。
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
