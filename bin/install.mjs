#!/usr/bin/env node
/**
 * ai-web-ui-refine installer & CLI
 *
 * Copies the skills into standard agent skill locations (Antigravity, Claude Code, Cursor, .agents).
 * Also runs the 28-tell linter and exports the brand worksheet.
 *
 * Usage:
 *   npx -y github:Ziad-Abaza/ai-web-ui-refine                 # global: ~/.agents/skills and ~/.gemini/antigravity-cli/skills
 *   npx ... --project                                       # project: <cwd>/.agents/skills
 *   npx ... --antigravity                                   # Antigravity CLI/IDE: ~/.gemini/antigravity-cli/skills
 *   npx ... --claude                                        # Claude Code: ~/.claude/skills
 *   npx ... --cursor                                        # Cursor: ./.cursor/skills
 *   npx ... --dir /custom/path                              # explicit target dir
 *   npx ... --force                                         # overwrite existing install
 *   npx ... --uninstall                                     # remove installed skills
 *   npx ... lint <file.html>                                # audit static HTML for 28 AI tells
 *   npx ... worksheet                                       # export brand brief worksheet
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const SKILLS = ['anti-ai-web-refine', 'brand-first-web-build'];
const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const argAfter = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null;
};

// Help command
if (has('--help') || has('-h') || args[0] === 'help') {
  console.log(`
ai-web-ui-refine v1.0.0
Audit 28 AI web design tells and build brand-first, human-crafted websites.

INSTALLATION USAGE:
  $ npx -y github:Ziad-Abaza/ai-web-ui-refine [options]
  $ npx ai-web-ui-refine [options]

INSTALLATION TARGETS:
  --project [path]    Install into project (.agents/skills)
  --antigravity       Install into ~/.gemini/antigravity-cli/skills
  --claude            Install into ~/.claude/skills
  --cursor            Install into .cursor/skills and .cursor/rules
  --dir <path>        Install into explicit custom directory
  --force             Overwrite existing installation
  --uninstall         Remove installed skills

CLI COMMANDS:
  lint <file.html>    Audit an HTML file against the 28 AI design tells
  worksheet           Export brand direction worksheet to current directory
  version, -v         Display version
`);
  process.exit(0);
}

// Worksheet command
if (args[0] === 'worksheet' || args[0] === 'template') {
  const src = path.join(pkgRoot, 'references', 'direction-worksheet.md');
  const dest = path.join(process.cwd(), 'direction-worksheet.md');
  fs.copyFileSync(src, dest);
  console.log(`\n✔ Direction worksheet exported to: ${dest}`);
  console.log('Fill out this worksheet before coding to anchor your brand identity.\n');
  process.exit(0);
}

// Lint command
if (args[0] === 'lint') {
  const targetFile = args[1];
  if (!targetFile) {
    console.error('Error: Please provide an HTML file to lint. Example: npx ... lint index.html');
    process.exit(1);
  }
  const absPath = path.resolve(process.cwd(), targetFile);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: File "${targetFile}" not found.`);
    process.exit(1);
  }

  const content = fs.readFileSync(absPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const hits = [];

  const add = (code, title, evidence, fix) => {
    hits.push({ code, title, evidence: evidence.trim().substring(0, 140), fix });
  };

  for (let i = 0; i < lines.length; i++) {
    if (/linear-gradient\([^)]*(indigo|purple|violet|#6366f1|#8b5cf6|#a855f7|#7c3aed|#ec4899)/i.test(lines[i])) {
      add('V1-01', 'Purple/Indigo Gradients', lines[i], 'Use solid brand color, or monochromatic gradients.');
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (/-webkit-background-clip:\s*text|background-clip:\s*text/i.test(lines[i])) {
      add('V1-02', 'Gradient-Filled Headlines', lines[i], 'Solid colors. Let font weight/scale carry emphasis.');
      break;
    }
  }

  const headings = content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
  const EMOJI_RE = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  for (const h of headings) {
    if (EMOJI_RE.test(h)) {
      add('V1-03', 'Emoji in Headings', h.replace(/\s+/g, ' '), 'Remove emojis; use authentic typography.');
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (/border-(left|top):\s*[2-6]px\s+solid\s+(#8b5cf6|#a855f7|#ec4899|#6366f1)/i.test(lines[i])) {
      add('V1-05', 'Single-Side Card Borders', lines[i], 'Use uniform subtle 1px border or surface separation.');
      break;
    }
  }

  if (content.includes('backdrop-filter: blur') || content.includes('-webkit-backdrop-filter: blur')) {
    add('V1-06', 'Glassmorphism Backdrop Blur', 'backdrop-filter: blur detected', 'Use solid opaque surfaces.');
  }

  if ((content.match(/class="[^"]*card[^"]*"/gi) || []).length >= 3 || content.includes('repeat(3')) {
    add('V1-08', 'Three Identical Cards in a Row', 'Found 3-card grid pattern', 'Choose layout by content: tables, lists, ledgers.');
  }

  if ((content.match(/class="[^"]*badge[^"]*"/gi) || []).length > 1) {
    add('V1-09', 'Badge / Eyebrow Overuse', 'Multiple badges found', 'Maximum 1 badge per page.');
  }

  if ((content.match(/—|&mdash;/g) || []).length > 1) {
    add('V1-16', 'Em Dash Overuse in Copy', 'Multiple em dashes found', 'Write complete sentences. Max 1 em dash.');
  }

  if (/transition:\s*all\b/.test(content)) {
    add('X-18', 'transition: all', 'transition: all found', 'Animate only explicit properties.');
  }

  if (/dir="rtl"|lang="ar"|[ابتثجحخدذرزسشصضطظعغفقكلمنهوي]/.test(content)) {
    for (let i = 0; i < lines.length; i++) {
      if (/letter-spacing:\s*(?!0\b|normal\b)[0-9.]+(px|em|rem)/i.test(lines[i])) {
        add('X-27', 'Arabic Letter-Spacing', lines[i], 'Never apply letter-spacing to Arabic text. Set normal.');
        break;
      }
    }
  }

  for (const cta of ['get started', 'learn more', 'ابدأ الآن', 'اعرف أكثر']) {
    if (new RegExp(`>\\s*${cta}[^<]*<`, 'i').test(content)) {
      add('X-28', 'Stock CTA Label', `Found "${cta}"`, 'Name specific outcome: "Reserve Batch #42".');
      break;
    }
  }

  console.log('\n====================================================================');
  console.log(`  AI WEB DESIGN AUDIT REPORT`);
  console.log(`  Target: ${targetFile}`);
  console.log('====================================================================');

  if (hits.length === 0) {
    console.log('\n  [SUCCESS] 0 AI Tells detected! Design is authentic and human-crafted.\n');
  } else {
    console.log(`\n  [ALERT] Found ${hits.length} AI Tells:\n`);
    hits.forEach((h, idx) => {
      console.log(`  ${idx + 1}. [${h.code}] ${h.title}`);
      console.log(`     Evidence:    ${h.evidence}`);
      console.log(`     Recommended: ${h.fix}\n`);
    });
    console.log('--------------------------------------------------------------------');
    console.log(`  Summary: ${hits.length} tell(s) need review.`);
    console.log('====================================================================\n');
  }
  process.exit(0);
}

// Installation Logic
function resolveTargets() {
  if (has('--claude')) {
    return [path.join(os.homedir(), '.claude', 'skills')];
  }
  if (has('--antigravity')) {
    return [path.join(os.homedir(), '.gemini', 'antigravity-cli', 'skills')];
  }
  if (has('--cursor')) {
    return [path.join(process.cwd(), '.cursor', 'skills')];
  }
  if (has('--project')) {
    const root = argAfter('--project') ?? process.cwd();
    return [path.join(path.resolve(root), '.agents', 'skills')];
  }
  if (has('--dir')) {
    const custom = argAfter('--dir');
    if (!custom) {
      console.error('error: --dir requires a path argument');
      process.exit(1);
    }
    return [path.resolve(custom)];
  }

  // Default: install into both standard agents directory and Antigravity directory
  return [
    path.join(os.homedir(), '.agents', 'skills'),
    path.join(os.homedir(), '.gemini', 'antigravity-cli', 'skills')
  ];
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const targets = resolveTargets();

if (has('--uninstall')) {
  for (const baseDir of targets) {
    for (const skill of SKILLS) {
      const p = path.join(baseDir, skill);
      if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log(`Removed ${p}`);
      }
    }
  }
  process.exit(0);
}

for (const baseDir of targets) {
  fs.mkdirSync(baseDir, { recursive: true });
  for (const skill of SKILLS) {
    const src = path.join(pkgRoot, skill);
    const dest = path.join(baseDir, skill);

    if (fs.existsSync(dest) && !has('--force')) {
      console.log(`Skill already exists at: ${dest} (use --force to overwrite)`);
      continue;
    }

    copyRecursive(src, dest);
    console.log(`✔ Installed ${skill} -> ${dest}`);
  }
}

// Extra: If cursor is flagged, create rule file too
if (has('--cursor')) {
  const rulesDir = path.join(process.cwd(), '.cursor', 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });
  const ruleContent = `---
description: Audit and refine websites so they look human-crafted and brand-first, not AI-generated
globs: ["**/*.html", "**/*.css", "**/*.jsx", "**/*.tsx"]
---
Always audit code against the 28 AI design tells.
Avoid purple gradients, gradient text, identical 3-card grids, 'transition: all', and generic buzzwords.
Never apply letter-spacing or italics to Arabic text. Use CSS logical properties.
`;
  fs.writeFileSync(path.join(rulesDir, 'anti-ai-web-refine.mdc'), ruleContent, 'utf8');
  console.log(`✔ Created Cursor rule at: ${path.join(rulesDir, 'anti-ai-web-refine.mdc')}`);
}

console.log('\nInstallation complete!');
console.log('You can now ask your AI agent:');
console.log('  "Audit this website and refine it to be brand-first."');
console.log('  "حسّن تصميم هذا الموقع وتخلص من كليشيهات الـ AI."\n');
