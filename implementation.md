# Systematic Life — 實作架構文件

> 基於 Justin Sung 的 PERIO 學習系統與四維度恢復框架的學習與恢復追蹤應用程式

---

## 1. 架構決策與理由

### 1.1 跨平台策略：Tauri 2.0 + Next.js + Capacitor

| 平台 | 技術方案 | 理由 |
|------|----------|------|
| **Web（瀏覽器）** | Next.js 14 App Router | SSR/SSG、優秀 DX、TypeScript 生態完整 |
| **Windows MSI / Mac DMG** | Tauri 2.0 包裝 Web 建置產物 | 輕量（~5MB）、原生效能、共用 100% Web UI |
| **iOS IPA / Android APK** | Capacitor 包裝 Web 建置產物 | 與 Tauri 策略一致，避免 React Native 雙套 UI |
| **共用程式碼** | `app/src/` 單一 Next.js 專案 | 圖表、測驗、評分邏輯、習慣追蹤全部共用 |

**為何不選 React Native + Expo？**
- MVP 需快速交付與診斷儀表板（雷達圖、甜甜圈圖），Web 圖表庫（Recharts）成熟度高
- 教育內容 repo 以文件為主，Tauri + Capacitor 可將同一套 Web 產物部署到四端，維護成本最低

**為何不選 Go + Gin 獨立後端（MVP 階段）？**
- MVP 以單人本地使用為主，Next.js API Routes + Supabase 可滿足需求
- 評分邏輯在 `lib/scoring.ts` 可獨立測試，未來可抽成 Go microservice

### 1.2 離線優先（Offline-First）

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  React UI   │────▶│ Storage Layer│────▶│ localStorage│  (MVP 預設)
│  (Next.js)  │     │  (抽象層)     │     │ IndexedDB   │  (未來)
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                           ▼ (有網路 + 已登入)
                    ┌──────────────┐
                    │   Supabase   │
                    │  PostgreSQL  │
                    └──────────────┘
```

- MVP：所有資料存於 `localStorage`，無需後端即可完整運作
- Phase 2：Supabase Auth + RLS 同步雲端

### 1.3 後端與資料庫

- **MVP**：Next.js API Routes（`/api/*`）+ `localStorage` 客戶端持久化
- **Production**：Supabase PostgreSQL + Row Level Security
- **Migration**：`database/migrations/` 使用標準 SQL，相容 Supabase

---

## 2. 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | Next.js 14+、React 18、TypeScript |
| 樣式 | Tailwind CSS |
| 圖表 | Recharts（雷達圖、甜甜圈圖） |
| 狀態/儲存 | localStorage（MVP）、@supabase/supabase-js（可選） |
| 測試 | Vitest + @testing-library/react |
| 桌面打包 | Tauri 2.0 |
| 行動打包 | Capacitor 6 |
| 資料庫（Production） | Supabase PostgreSQL 16 |
| 後端 API（Future） | Go + Gin + GORM |

---

## 3. 資料庫 Schema（ERD 描述）

```
users
├── id (uuid, PK)
├── email (text, unique)
├── display_name (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

diagnostic_results
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── overall_score (decimal)
├── category_scores (jsonb)  -- { priming, encoding, retrieval, interleaving, overlearning, recovery }
├── answers (jsonb)
├── completed_at (timestamptz)
└── created_at (timestamptz)

habit_entries
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── category (enum: priming|encoding|reference|retrieval|interleaving|overlearning|relaxation|detachment|mastery|control)
├── completed (boolean)
├── entry_date (date)
├── notes (text, nullable)
└── created_at (timestamptz)
    UNIQUE(user_id, category, entry_date)

weekly_checklist
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── week_start (date)
├── items (jsonb)  -- { diagnostic: bool, relaxation_list: bool, anchors: bool, friction: bool, nature: bool }
└── updated_at (timestamptz)
```

**關聯：**
- `users` 1:N `diagnostic_results`
- `users` 1:N `habit_entries`
- `users` 1:N `weekly_checklist`

---

## 4. API 設計

### MVP（客戶端 localStorage，無需網路）

| 操作 | 實作 |
|------|------|
| 儲存測驗結果 | `storage.saveDiagnostic(result)` |
| 讀取最新結果 | `storage.getLatestDiagnostic()` |
| 記錄習慣 | `storage.toggleHabit(category, date)` |
| 更新週檢查清單 | `storage.updateChecklist(week, items)` |

### Production REST API（Go/Gin 或 Next.js API）

```
POST   /api/v1/diagnostic          提交測驗答案，回傳評分
GET    /api/v1/diagnostic/latest   取得最新診斷結果
GET    /api/v1/diagnostic/history  歷史趨勢

GET    /api/v1/habits?date=YYYY-MM-DD
POST   /api/v1/habits              { category, date, completed, notes }
GET    /api/v1/habits/streak       各類別連續天數

GET    /api/v1/checklist?week=YYYY-MM-DD
PUT    /api/v1/checklist           更新週檢查清單項目
```

---

## 5. 測驗評分邏輯

### 5.1 問題結構

每題 5 點 Likert 量表（0–4）：
- 0 = 完全沒有 / 從不
- 1 = 很少
- 2 = 有時
- 3 = 經常
- 4 = 總是 / 已建立系統

### 5.2 類別分數

```
categoryScore = (sum(questionScores) / (questionCount × 4)) × 100
```

### 5.3 雷達圖五軸（對應診斷儀表板）

| 軸 | 對應 PERIO | 計算方式 |
|----|-----------|----------|
| Priming | Phase 1 | priming 類別題目平均 |
| Learning | Phase 2 Encoding | encoding 類別題目平均 |
| Retrieval | Phase 4 | retrieval 類別題目平均 |
| Retrieval & Interleaving | Phase 4 + 5 | `(retrieval + interleaving) / 2` |
| Overlearning | Phase 6 | overlearning 類別題目平均 |

### 5.4 整體分數

```
overallScore = average(所有學習類別分數, recovery 分數)
```

學習類別：priming, encoding, reference, retrieval, interleaving, overlearning（6 項）  
恢復維度：relaxation, detachment, mastery, control（4 項）  
共 10 類別平均。

### 5.5 狀態顏色

| 分數範圍 | 狀態 | 顏色 |
|----------|------|------|
| ≥ 70% | 已實踐 (Implemented) | 綠色 `#22c55e` |
| 40–69% | 需改進 (Needs improvement) | 橘色 `#f97316` |
| < 40% | 尚未實踐 (Not yet implemented) | 紅色 `#ef4444` |

---

## 6. 平台打包策略

### 6.1 Web

```bash
cd app && npm run build && npm start
# 或靜態匯出（Capacitor/Tauri 用）
npm run build:static
```

### 6.2 Windows MSI / Mac DMG（Tauri）

```bash
cd app
npm run build:static
npm run tauri build
# 產物：src-tauri/target/release/bundle/
```

需求：Rust toolchain、各平台 SDK

### 6.3 iOS IPA / Android APK（Capacitor）

```bash
cd app
npm run build:static
npx cap sync
npx cap open ios    # Xcode Archive
npx cap open android # Android Studio Build APK
```

MVP 階段僅提供 scaffold 設定檔，完整簽章需 Apple Developer / Google Play 帳號。

---

## 7. 分階段推出計畫

| 階段 | 內容 | 時間估計 |
|------|------|----------|
| **Phase 1 — MVP（本專案）** | 診斷測驗、結果儀表板、習慣追蹤、週檢查清單、localStorage、單元測試 | 完成 |
| **Phase 2 — 雲端同步** | Supabase Auth、migration、RLS、跨裝置同步 | 2 週 |
| **Phase 3 — 桌面/行動** | Tauri MSI/DMG 正式簽章、Capacitor 商店上架 | 2 週 |
| **Phase 4 — 進階功能** | 歷史趨勢圖、推播提醒、Nature Break 計時器、Go API | 4 週 |

---

## 8. 檔案/資料夾結構

```
Efficient Learning and Sustainable Recovery/   # repository 根目錄
├── Blueprint for Efficient Learning and Sustainable Recovery.md
├── implementation.md                    # 本文件
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
└── app/
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── vitest.config.ts
    ├── capacitor.config.json
    ├── src-tauri/                       # Tauri 桌面設定
    │   ├── tauri.conf.json
    │   └── src/main.rs
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx                 # 首頁 CTA
        │   ├── diagnostic/page.tsx      # 測驗流程
        │   ├── results/page.tsx         # 儀表板
        │   ├── habits/page.tsx          # 習慣追蹤
        │   └── checklist/page.tsx       # 週檢查清單
        ├── components/
        │   ├── charts/
        │   │   ├── DoughnutChart.tsx
        │   │   └── RadarChart.tsx
        │   ├── CategoryCard.tsx
        │   ├── QuizFlow.tsx
        │   ├── HabitGrid.tsx
        │   └── WeeklyChecklist.tsx
        ├── lib/
        │   ├── types.ts
        │   ├── quiz-data.ts
        │   ├── scoring.ts
        │   ├── storage.ts
        │   └── constants.ts
        └── __tests__/
            └── scoring.test.ts
```

---

## 9. 功能對照藍圖

| 藍圖要求 | MVP 實作 |
|----------|----------|
| Learning System Diagnostic | `/diagnostic` 多題 Likert 測驗 |
| 整體 % + 甜甜圈圖 | `/results` Recharts PieChart |
| 五軸雷達圖 | `/results` Recharts RadarChart |
| 類別分解卡片 + 狀態色 | `CategoryCard` 元件 |
| PERIO 六階段習慣 | `/habits` 每日勾選 |
| 四維度恢復習慣 | `/habits` 恢復區塊 |
| 每週行動清單 | `/checklist` 五項勾選 |
| START NOW CTA | 首頁按鈕導向診斷 |

---

## 10. 安全與隱私

- MVP 資料僅存於本機 `localStorage`，不上傳
- Production：Supabase RLS 確保 `user_id = auth.uid()`
- 日誌不記錄個人測驗答案內容
- 環境變數：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`（可選）

---

*文件版本：1.0 | 建立日期：2026-07-05*
