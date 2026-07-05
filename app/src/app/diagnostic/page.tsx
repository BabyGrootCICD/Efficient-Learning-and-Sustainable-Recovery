import { QuizFlow } from '@/components/QuizFlow';

export default function DiagnosticPage() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          學習系統診斷
        </h1>
        <p className="text-gray-400">
          誠實回答以下問題，量化你目前的 PERIO 學習系統與恢復實踐程度。
        </p>
      </div>
      <QuizFlow />
    </div>
  );
}
