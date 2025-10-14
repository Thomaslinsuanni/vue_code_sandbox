# 建置與執行環境說明（適用於完全乾淨環境）

此文件說明如何從全新（clean）開發/編譯環境，建立能執行、建置並測試本專案的流程。
預設使用 Visual Studio Code（VS Code）作為開發環境；若不使用 VS Code，文件也提供對應的 CLI / 其他編輯器步驟。

---

## 1. 準備（此階段使用的是該作業系統的 cmd）

建議使用與專案相容的 Node.js 版本（本專案有 `.node-version` 時請參照該檔）。

- 系統需求
  - Git
  - Node.js（建議 v18+, 或依 `.node-version`）
  - pnpm（或使用 npm/yarn，但本文件以 pnpm 為範例）

- 如果尚未安裝 pnpm：

```powershell
# Windows PowerShell
npm i -g pnpm
```

或 Linux/macOS：

```bash
npm i -g pnpm
```

### 1.1 安裝必要工具（範例指令）

下面補充常見套件與擴充的安裝指令範例，方便在完全乾淨的系統上快速準備開發環境。

Windows PowerShell（範例）

```powershell
# 使用 nvm-windows 管理 Node（先安裝 nvm-windows）
# 安裝 Node.js LTS（在 nvm-windows 中）
nvm install 18.17.0
nvm use 18.17.0

# 安裝 pnpm
npm i -g pnpm

# （可選）使用 Chocolatey 安裝 Node / Git
# choco install nodejs-lts git -y

# 安裝 VS Code CLI （若尚未在 PATH 中）：在 VS Code 中按 Ctrl+Shift+P，輸入 'Shell Command: Install 'code' command in PATH'

# 若已可使用 code CLI，可安裝常用擴充
# 請先在終端確認 'code' 可用：
code --version

# 安裝常用擴充（以 extension id 為例，請視 marketplace 排名/名稱確認）
code --install-extension johnsoncodehk.volar
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

macOS / Linux（範例）

```bash
# 使用 nvm 安裝 node
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \ . "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# 安裝 pnpm
npm i -g pnpm

# 若使用 VS Code，可使用 code CLI 安裝擴充
code --install-extension johnsoncodehk.volar
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

註：擴充 ID 如有異動，請在 VS Code Marketplace 中搜尋擴充名稱並使用 `code --install-extension <extension-id>` 安裝。

- （可選）若要管理 Node 版本，建議使用 nvm / nvm-windows：

Linux / macOS（nvm）:

```bash
# 安裝 nvm，形如:
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# 安裝 node
nvm install 18
nvm use 18
```

Windows（nvm-windows）: 請參考 https://github.com/coreybutler/nvm-windows

---

## 2. 取得原始碼

```powershell
# PS / Windows
git clone https://github.com/Thomaslinsuanni/vue_code_sandbox.git
cd vue_code_sandbox
```

或 bash (macOS / Linux)：

```bash
git clone https://github.com/Thomaslinsuanni/vue_code_sandbox.git
cd vue_code_sandbox
```

---

## 3. VS Code（預設）開發環境設定

推薦在 VS Code 中安裝下列擴充與設定：

- 必裝擴充：
  - Volar（Vue 3 的語言伺服器）
  - ESLint
  - Prettier 或其他格式化工具
  - (選用) GitLens

- 建議安裝套件若是在 clone 時有包含道 .vscode/ 此資料夾，只需要重啟 vscode 就會自動建議安裝組件

- 建議設定（可放在 `.vscode/settings.json`）：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.packageManager": "pnpm",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "volar.takeOverMode": true
}
```

> 注意：若你曾安裝 Vetur，請停用或移除，以免與 Volar 衝突。

---

## 4. 非 VS Code（僅 CLI 或其它編輯器）

若不使用 VS Code，請確保：

- 你有 Node 與 pnpm（如前述）
- 在你選的編輯器中安裝對 TypeScript / Vue 有良好支援的插件（例如 JetBrains 的 Vue 支援、Vim 的 coc.nvim + volar plugin 等）

主要步驟與指令與 VS Code 相同（見下）。

---

## 5. 安裝專案依賴（必須）

請在專案根目錄執行：

```powershell
# Windows PowerShell
pnpm install --frozen-lockfile
```

或 bash：

```bash
pnpm install --frozen-lockfile
```

> 使用 `--frozen-lockfile` 可確保安裝的套件版本與 lockfile 一致（與 CI 行為一致）。

---

## 6. 常用命令（一覽）

這些指令以 `pnpm run <script>` 為主，均可從 `package.json` 的 `scripts` 執行：

- 開發（熱重載）

```powershell
pnpm dev
```

- Production build

```powershell
pnpm build
```

- Workflow / preview build（專案 workflow 使用的命令，會使用 `vite.preview.config.ts`）

```powershell
pnpm build-preview
# 等同: vite build -c vite.preview.config.ts
```

- 本地 preview

```powershell
pnpm preview
# 或: vite preview
```

- 靜態檢查與格式化

```powershell
pnpm lint
pnpm typecheck
pnpm format
```

- 檢查輸出目錄

```powershell
# Windows
dir dist
# bash
ls -la dist
```

---

## 7. 建議開發流程

1. 建立分支：`git checkout -b feat/your-feature`
2. 開發：`pnpm dev`
3. 本地檢查：`pnpm lint && pnpm typecheck`
4. 產生 preview build（相同於 CI 要產生的 artifact）：`pnpm build-preview`，檢查 `dist/`
5. Commit / Push / 開 PR

---

## 8. CI 與 GitHub Actions（快速說明）

- CI workflow 通常會：
  1. Checkout
  2. Install pnpm（actions/pnpm/action-setup）並 `pnpm install --frozen-lockfile`
  3. Run lint/typecheck
  4. Run `pnpm build` / `pnpm build-preview`
  5. Upload artifact（例如 `actions/upload-pages-artifact@v3` 會上傳 `./dist`）
  6. Deploy（例如 `actions/deploy-pages@v4`）

- 要點：請確保 `build-preview` 的輸出路徑與 workflow 裡上傳的 `path` 一致（預設 `./dist`）。

---

## 9. 常見問題與排查建議

1. 404 或靜態資源載入失敗
   - 檢查 `vite.config.ts` 的 `base` 設定。若部署到 `https://<user>.github.io/<repo>/`，請把 `base` 設為 `'/<repo>/'`；若為 user/org page，`base` 應為 `'/'`。
   - 確認 `pnpm build-preview` 有在 `dist/` 產出 `index.html` 與資源。

2. `__VLS_placeholder` 類型錯誤（Volar）：
   - 若在 VS Code 中看到 Volar 產生的 placeholder 型別錯誤，可先重啟 TypeScript server 或 VS Code；若持續，可採用以下方法臨時移除錯誤：
     - 在 `src/env.d.ts`（或專案任何 global d.ts）新增：

     ```ts
     declare const __VLS_placeholder: any
     export {}
     ```

     - 或把 template ref 的用法改為官方 `ref` + `const el = ref<HTMLElement|null>(null)` 的方式（推薦）。

3. CI 無法安裝套件或 node 版本錯誤
   - Workflow 需呼叫正確的 `actions/setup-node` 並配合 `.node-version` 或在 workflow 明確設定 `node-version`。

4. `dist` 為空或缺少 index
   - 檢查 build log（在 Actions run 的 log），確認 `pnpm build-preview` 執行沒有錯誤，並列出 `dist/` 的內容。

---

## 10. 非 VS Code 使用者（CLI / 其他編輯器）

流程基本相同，僅把 IDE 特定步驟略過：

1. 安裝 Node 與 pnpm
2. Clone repo
3. `pnpm install --frozen-lockfile`
4. `pnpm dev` 或 `pnpm build-preview` 等

在 CLI 環境下，若遇 TypeScript 或 Volar 導致的 editor-only 錯誤，CI/`pnpm typecheck` 才是標準檢查方式；若 `pnpm typecheck` 通過，代表實際型別安全沒問題。

---

## 11. 可選：Docker 化建置

若想在完全隔離的容器中建置，可使用如下 Dockerfile 範例（簡易）：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build-preview
# 最終 artifact 位於 /app/dist
```

---

## 12. 想要我幫忙的項目（可選）

- 我可以把此檔加入 repo（`BUILD.md`）並開一個 branch、commit、push，或把說明加入 `README.md`。
- 我可以在本地替你執行 `pnpm build-preview` 並回傳 `dist/` 列表（請允許我執行命令）。
- 我可以檢查你的 workflow logs 或幫你修正 `vite.config.ts` 的 `base` 與 workflow 的上傳設定。

---

如果要我直接把此文件新增到 repo，我可以現在就提交（新分支）並 push，你希望分支命名為什麼？（例如 `docs/build-guides`）
