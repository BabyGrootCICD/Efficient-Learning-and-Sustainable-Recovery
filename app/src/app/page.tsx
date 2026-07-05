import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-8">
        <p className="text-sl-accent text-sm font-medium tracking-widest uppercase mb-4">
          PERIO Learning System + 4 Dimensions of Recovery
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          system for life<span className="text-sl-accent">.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          量化你的學習系統完整度，追蹤 PERIO 六階段與四維度恢復習慣，
          打造高效學習與可持續恢復的整合系統。
        </p>
      </div>

      <Link
        href="/diagnostic/"
        className="inline-flex items-center gap-2 bg-sl-accent hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-500/20"
      >
        START NOW
        <span aria-hidden>→</span>
      </Link>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          {
            title: '學習系統診斷',
            desc: '26 題 Likert 量表，評估 PERIO 與恢復維度',
            href: '/diagnostic/',
          },
          {
            title: '每日習慣追蹤',
            desc: '勾選今日完成的學習與恢復行為',
            href: '/habits/',
          },
          {
            title: '每週行動清單',
            desc: '藍圖中的五項可執行步驟',
            href: '/checklist/',
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-sl-card border border-sl-border rounded-xl p-6 text-left hover:border-sl-accent/40 transition-colors"
          >
            <h2 className="text-white font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-400 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
