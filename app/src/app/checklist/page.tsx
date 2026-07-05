import { WeeklyChecklist } from '@/components/WeeklyChecklist';

export default function ChecklistPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">每週行動清單</h1>
        <p className="text-gray-400">
          將 PERIO 與恢復原則轉化為可持續的生活方式。每週一自動重置。
        </p>
      </div>
      <WeeklyChecklist />
    </div>
  );
}
