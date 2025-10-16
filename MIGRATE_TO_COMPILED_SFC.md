# MIGRATE TO PRE-COMPILED SFC (方案 A)

## 目的

這份文件描述將專案從 runtime SFC loader / 未編譯狀態，遷移到「預編譯所有 .vue 為 JS module」的流程與注意事項。目標是提供一個簡單、可重複、可回滾的遷移計畫，讓開發者與編輯器能在不需要打包/部署的情況下，取得一致的「編譯輸出」供 Editor/預覽使用。

## 適用情境

- 你只需要編譯 .vue 為 JS 供編輯器或 preview 使用（非最終打包/部署）。
- 不需要改變現有部署流程（可在未來再把預編譯結果整合進 build）。

## 總覽

1. 新增一支 Node 腳本 `scripts/compile-sfc.js`，將 `src/**/*.vue` 轉為 `compiled/**/*.js`（或你指定的資料夾）。
2. 在 `package.json` 新增 script：`compile:sfc`（與可選的 watch script）。
3. 安裝必要 devDependencies（`@vue/compiler-sfc`, `@vue/compiler-dom`, `glob`, `fs-extra` 等）。
4. 測試：執行 `pnpm run compile:sfc`，檢查 `compiled/` 檔案與 Editor 預覽能否讀取。
5. 若通過，將變更 commit 到新分支，開 PR 並合併。

## 詳細改動清單

- 新增 `scripts/compile-sfc.js`：核心編譯腳本，將 .vue 解析並匯出成 JS module。
- 新增（或更新）`package.json` scripts：
  - `compile:sfc` -> 執行編譯腳本
  - （可選）`compile:sfc:watch` -> watch 模式，檔案變動時增量編譯
- 安裝 devDependencies（若尚未）：
  - `@vue/compiler-sfc`、`@vue/compiler-dom`、`glob`、`fs-extra`、`chokidar`（watch 選用）
- 新增 `compiled/`（或自訂輸出資料夾）：編譯輸出目錄（不應加入到 git 的追蹤，建議加入 `.gitignore`，但若要同步給其他人，可選擇 commit 輸出或在 CI 產生）。

## 編譯腳本

- 對每個 `src/**/*.vue` 做：
  1. `parse()` 取得 descriptor
  2. `compileScript()` 處理 `<script>` / `<script setup>` 取得 JS 主體
  3. `compileTemplate()` 產生 `render` 函式（若有 template）
  4. 合成輸出內容：主體 + render + `export default`（或 `export { ... }`）
  5. 寫入 `compiled/<...>.js`

- 注意：若檔案使用 TypeScript，需要視需求再用 `esbuild` 或 `tsc` 轉成純 JS（視 Editor 能力而定）。

## 變更範例

- `index.html` 或使用 loader 的 bootstrap：
  - 如果現行是動態載入 `.vue`（如 `loadModule('./App.vue')`），可先改為指向編譯後的 module（例如 `compiled/App.js`）作為暫時方案，或讓 editor preview 用 compiled 檔而不是載入原始 .vue。
- 編輯器或 preview 的 loader：
  - 調整讓它優先讀取 `compiled/`，當找不到時 fallback 回原始 `src/`（方便逐步遷移）。

## 增量遷移策略

1. 先在本地建立並驗證 `compile:sfc`，確認編譯輸出正確。
2. 在 Editor 設定中，加一個優先載入 `compiled/` 的路徑（或更新 preview 的 module loader），讓開發者在 local 可切換使用預編譯檔。
3. 逐步移除 runtime loader 的依賴（若確定不需要），或保留作為 fallback。
4. 當所有元件經過預編譯且預覽穩定，可以考慮把 compiled 檔集成到正式 build pipeline（選項）。
