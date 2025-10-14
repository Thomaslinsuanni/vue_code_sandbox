#!/usr/bin/env node
const { spawnSync } = require('child_process')
const exts = [
  'MS-CEINTL.vscode-language-pack-zh-hant',
  'vue.volar',
  'vue.vscode-typescript-vue-plugin',
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint',
  'ms-vscode.vscode-typescript-next',
  'oderwat.indent-rainbow',
  'PKief.material-icon-theme',
  'vscode-icons-team.vscode-icons',
  'eamodio.gitlens',
  'mhutchie.git-graph',
  'GitHub.vscode-pull-request-github',
]

function hasCodeCLI() {
  try {
    const res = spawnSync('code', ['--version'], { stdio: 'ignore' })
    return res.status === 0
  } catch (e) {
    return false
  }
}

if (!hasCodeCLI()) {
  console.log(
    'VS Code CLI (code) not found in PATH. Skipping extension install.',
  )
  console.log(
    "If you want to install extensions, ensure `code` is available (VS Code → Command Palette → 'Shell Command: Install 'code' command in PATH').",
  )
  process.exit(0)
}

for (const ext of exts) {
  console.log('Installing', ext)
  const res = spawnSync('code', ['--install-extension', ext], {
    stdio: 'inherit',
  })
  if (res.status !== 0) {
    console.warn(`Failed to install ${ext} (exit ${res.status}). Continue...`)
  }
}
