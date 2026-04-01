#!/bin/bash
#!/bin/bash
set -euo pipefail

# --- Python tools ---
pip install --upgrade pip
pip install uv modal fastapi uvicorn

# --- Node global tools ---
npm install -g pnpm
# bun
curl -fsSL https://bun.sh/install | bash

# --- Rust tools ---
cargo install tauri-cli --version "^2"