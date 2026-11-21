#!/usr/bin/env bash
# ai-web-ui-refine installer (curl | bash)
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Ziad-Abaza/ai-web-ui-refine/main/install.sh | bash
#   ... | bash -s -- --project          # install into ./.agents/skills
#   ... | bash -s -- --claude           # install into ~/.claude/skills
#   ... | bash -s -- --antigravity      # install into ~/.gemini/antigravity-cli/skills
#   ... | bash -s -- --dir /custom/path
#
set -euo pipefail

REPO="https://github.com/Ziad-Abaza/ai-web-ui-refine"
SKILLS=("anti-ai-web-refine" "brand-first-web-build")
MODE="global"
CUSTOM_DIR=""

for arg in "$@"; do
    case "$arg" in
        --project)     MODE="project" ;;
        --claude)      MODE="claude" ;;
        --antigravity) MODE="antigravity" ;;
        --dir=*)       MODE="custom"; CUSTOM_DIR="${arg#--dir=}" ;;
        --dir)         MODE="custom-next" ;;
        *) if [ "${MODE:-}" = "custom-next" ]; then MODE="custom"; CUSTOM_DIR="$arg"; fi ;;
    esac
done

case "$MODE" in
    global)      TARGET="${HOME}/.agents/skills" ;;
    antigravity) TARGET="${HOME}/.gemini/antigravity-cli/skills" ;;
    project)     TARGET="$(pwd)/.agents/skills" ;;
    claude)      TARGET="${HOME}/.claude/skills" ;;
    custom)      TARGET="${CUSTOM_DIR%/}" ;;
    *) echo "error: could not resolve target directory" >&2; exit 1 ;;
esac

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if command -v git >/dev/null 2>&1; then
    git clone --depth 1 "$REPO.git" "$TMP/repo" --quiet
    SRC="$TMP/repo"
elif command -v curl >/dev/null 2>&1; then
    curl -fsSL "$REPO/archive/refs/heads/main.tar.gz" -o "$TMP/pkg.tar.gz"
    tar -xzf "$TMP/pkg.tar.gz" -C "$TMP"
    SRC="$TMP/ai-web-ui-refine-main"
else
    echo "error: need git or curl to download" >&2; exit 1
fi

mkdir -p "$TARGET"

for skill in "${SKILLS[@]}"; do
    if [ -d "$SRC/$skill" ]; then
        cp -rf "$SRC/$skill" "$TARGET/"
        echo "✔ Installed $skill -> $TARGET/$skill"
    fi
done

echo ""
echo "ai-web-ui-refine skills successfully installed to:"
echo "  $TARGET"
echo ""
echo "Try asking your AI agent: \"Audit this website and refine it to be brand-first.\""
