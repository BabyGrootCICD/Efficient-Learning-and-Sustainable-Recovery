# Systematic Life App

PERIO 學習系統與四維度恢復追蹤 MVP。

## 快速開始

```bash
cd app
npm install
npm run dev
```

開啟 http://localhost:3000

## 測試

```bash
npm test
```

## 建置

```bash
npm run build
npm start
```

## 桌面版（Tauri — Windows MSI / Mac DMG）

前置：安裝 [Rust](https://rustup.rs/) 與 Tauri 系統依賴。

```bash
npm install
npm run build:static
npm run tauri:build
```

產物位於 `src-tauri/target/release/bundle/`

## 行動版（Capacitor — iOS / Android）

```bash
npm run build:static
npx cap add ios      # 首次
npx cap add android  # 首次
npm run cap:sync
npm run cap:ios      # 或 cap:android
```

## GitHub Actions 發佈

Workflow 位於 [`.github/workflows/release.yml`](../.github/workflows/release.yml)。

### 觸發方式

| 方式 | 說明 |
|------|------|
| `release: published` | 建立 GitHub Release 後自動建置四平台產物並附加至 Release |
| `workflow_dispatch` | 於 Actions 手動執行，需提供 `version` 輸入（如 `0.1.0`） |

建置流程會先執行 `npm run build:static`（跨平台靜態匯出）產生 `out/`，再分別：

- **Tauri**（`macos-latest` / `windows-latest`）：`npm run tauri:build:dmg` 或 `tauri:build:msi`
- **Capacitor Android**（`ubuntu-latest`）：`cap add android` → `cap sync` → `setup-java`（Gradle cache）→ APK
- **Capacitor iOS**（`macos-latest`）：`cap add ios` → `cap sync` → `xcodebuild` IPA

### 預期產物檔名

- `systematic-life-{version}-macos.dmg`
- `systematic-life-{version}-windows.msi`
- `systematic-life-{version}-android-release.apk`（有 keystore）或 `-android-debug.apk`（無 keystore）
- `systematic-life-{version}-ios-release.ipa`（有 Apple 簽章）或 `-ios-unsigned.ipa`（無簽章）

### 簽章 Secrets（選用，MVP 可不設定）

在 repository **Settings → Secrets and variables → Actions** 新增。

Workflow 會先執行偵測步驟：Android 檢查 `ANDROID_KEYSTORE_BASE64` 是否存在；iOS 需同時具備 `APPLE_CERTIFICATE_BASE64` 與 `IOS_PROVISIONING_PROFILE_BASE64` 才會走簽章建置。偵測結果以 step output 控制後續步驟，避免在 `if:` 條件中直接引用 secrets。

**Android（正式 release APK）**

- `ANDROID_KEYSTORE_BASE64` — keystore 檔案的 base64 編碼
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

```bash
# 產生 keystore 範例
keytool -genkey -v -keystore release.keystore -alias systematic-life -keyalg RSA -keysize 2048 -validity 10000
base64 -i release.keystore | pbcopy   # 貼至 ANDROID_KEYSTORE_BASE64
```

**iOS（可安裝 / App Store 用 IPA）**

需要 [Apple Developer Program](https://developer.apple.com/programs/) 帳號：

- `APPLE_CERTIFICATE_BASE64` — Distribution 憑證 `.p12` 的 base64
- `APPLE_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64` — App Store 或 Ad Hoc profile
- `IOS_TEAM_ID` — 10 字元 Team ID

未設定上述 secrets 時，CI 仍會產出 **unsigned IPA**，僅供驗證建置流程，**無法安裝至實機或上架 App Store**。

**桌面（Tauri）**

DMG / MSI 預設為未 notarize / 未 code sign 的 release 建置。macOS notarization 與 Windows Authenticode 簽章需另行設定 Apple / Microsoft 憑證（Phase 3）。

### 本地 npm scripts（CI 對應）

```bash
npm run build:static      # 跨平台靜態匯出（Windows / macOS / Linux）
npm run build:ci          # CI 別名，等同 build:static
npm run tauri:build:dmg   # macOS DMG
npm run tauri:build:msi   # Windows MSI
npm run android:build:debug    # 無簽章 debug APK
npm run android:build:release  # 需本地 keystore 設定
```

## 功能

- `/diagnostic` — 26 題 Likert 診斷測驗
- `/results` — 甜甜圈圖 + 雷達圖 + 類別分解
- `/habits` — PERIO + 恢復每日習慣勾選
- `/checklist` — 藍圖每週五項行動清單

資料存於瀏覽器 `localStorage`（離線優先 MVP）。
