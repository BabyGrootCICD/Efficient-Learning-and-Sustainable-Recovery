# Efficient Learning and Sustainable Recovery

Systematic Life（PERIO 學習系統與四維度恢復追蹤）專案存放於此 repository，與 academy-central 分離維護。

## 內容

| 路徑 | 說明 |
|------|------|
| `Blueprint for Efficient Learning and Sustainable Recovery.md` | 產品與方法論藍圖 |
| `implementation.md` | 技術實作與架構說明 |
| `database/migrations/` | PostgreSQL / Supabase schema（Phase 2） |
| `app/` | Next.js 14 MVP（診斷、儀表板、習慣、週檢查清單） |

## 快速開始（Web）

從 repository 根目錄：

```bash
cd app
npm install
npm run dev
```

瀏覽 http://localhost:3000

## 測試與建置

```bash
cd app
npm test
npm run build
```

## 桌面（Tauri）與行動（Capacitor）

詳見 [`app/README.md`](app/README.md)。

## GitHub Actions 發佈

推送 tag 並建立 GitHub Release 後，`.github/workflows/release.yml` 會自動建置並上傳：

| 產物 | 平台 | 檔名範例 |
|------|------|----------|
| DMG | macOS (Tauri) | `systematic-life-{version}-macos.dmg` |
| MSI | Windows (Tauri) | `systematic-life-{version}-windows.msi` |
| APK | Android (Capacitor) | `systematic-life-{version}-android-release.apk` 或 `-android-debug.apk` |
| IPA | iOS (Capacitor) | `systematic-life-{version}-ios-release.ipa` 或 `-ios-unsigned.ipa` |

### 觸發方式

1. **正式發佈**：在 GitHub 建立 Release 並 publish（workflow 會將產物附加至該 Release）
2. **手動測試**：Actions → Release → Run workflow，輸入版本號（如 `0.1.0` 或 `v0.1.0`）

```bash
# 本地建立 tag 並推送（範例）
git tag v0.1.0
git push origin v0.1.0
# 再到 GitHub Releases 頁面建立並 publish release
```

### 簽章 Secrets（選用）

未設定時，Android 產生 **debug APK**、iOS 產生 **unsigned IPA**（無法上架或安裝至實機）。

CI 會在 `build-apk` / `build-ipa` job 開頭以偵測步驟檢查 secrets 是否已設定，再決定走簽章或 fallback 建置路徑（GitHub Actions 不允許在 `if:` 條件中直接引用 `secrets`）。

| Secret | 用途 |
|--------|------|
| `ANDROID_KEYSTORE_BASE64` | Android keystore（base64） |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore 密碼 |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key 密碼 |
| `APPLE_CERTIFICATE_BASE64` | Apple 發佈憑證 `.p12`（base64） |
| `APPLE_CERTIFICATE_PASSWORD` | 憑證密碼 |
| `IOS_PROVISIONING_PROFILE_BASE64` | Provisioning profile（base64） |
| `IOS_TEAM_ID` | Apple Developer Team ID |

完整說明見 [`app/README.md`](app/README.md#github-actions-發佈)。

## 授權

見根目錄 `LICENSE`。
