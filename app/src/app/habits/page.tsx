import { HabitGrid } from '@/components/HabitGrid';

export default function HabitsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">每日習慣追蹤</h1>
        <p className="text-gray-400">
          勾選今日完成的 PERIO 學習行為與恢復維度實踐。
        </p>
      </div>
      <HabitGrid />
    </div>
  );
}
