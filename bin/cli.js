#!/usr/bin/env node

/**
 * AI Web UI Refine CLI
 * Audit 28 AI design tells and install brand-first web skills.
 * Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PKG_ROOT = path.resolve(__dirname, '..');
const VERSION = '1.0.0';

const TELLS_CATALOGUE = {
  'V1-01': {
    title: 'Purple/Indigo/Violet Gradients',
    fix: 'Use solid brand color, or keep gradients strictly within a single hue.',
    v1: true
  },
  'V1-02': {
    title: 'Gradient-Filled Headlines',
    fix: 'Use solid colors. Rely on font weight, size scale, and contrast for emphasis.',
    v1: true
  },
  'V1-03': {
    title: 'Emoji in Headings or Features',
    fix: 'Remove emojis. Use authentic typography or a single bespoke SVG icon set.',
    v1: true
  },
  'V1-04': {
    title: 'Flat Typographic Scale',
    fix: 'h1 should be at least 2.5x body size with at least 1.25x ratio between levels.',
    v1: true
  },
  'V1-05': {
    title: 'Single-Side Colored Card Borders',
    fix: 'Use a subtle uniform border, or let whitespace and surface contrast define cards.',
    v1: true
  },
  'V1-06': {
    title: 'Glassmorphism & Heavy Backdrop Blur',
    fix: 'Use solid opaque surfaces with guaranteed contrast.',
    v1: true
  },
  'V1-07': {
    title: 'Weak Dark-Mode Contrast',
    fix: 'Maintain at least 4.5:1 contrast for normal text and 3:1 for large display headers.',
    v1: true
  },
  'V1-08': {
    title: 'Three Identical Cards in a Row',
    fix: 'Match layout to content: data tables for specs/pricing, numbered lists for steps.',
    v1: true
  },
  'V1-09': {
    title: 'Badge / Eyebrow Overuse',
    fix: 'Maximum one badge per page, only when communicating essential new data.',
    v1: true
  },
  'V1-10': {
    title: 'Reused Generic Icons',
    fix: 'Authentic photography, domain schematics, or no icons at all.',
    v1: true
  },
  'V1-11': {
    title: 'Stock UI Library Defaults',
    fix: 'Build a custom brand palette derived from product or brand history.',
    v1: true
  },
  'V1-12': {
    title: 'Excessive Entrance Animations',
    fix: 'Instant rendering or at most one subtle, purposeful moment.',
    v1: true
  },
  'V1-13': {
    title: 'Cursor-Following Glow',
    fix: 'Tactile, predictable interactions without artificial gimmicks.',
    v1: true
  },
  'V1-14': {
    title: 'Buttons Losing Contrast on Hover',
    fix: 'Hover states must preserve at least 4.5:1 contrast.',
    v1: true
  },
  'V1-15': {
    title: 'Arbitrary Spacing Off Scale',
    fix: 'Define a strict 4px token scale (4, 8, 12, 16, 24, 32, 48, 64px) via CSS variables.',
    v1: true
  },
  'V1-16': {
    title: 'Em Dash (—) Overuse in Copy',
    fix: 'Write complete sentences. Maximum one em dash on the entire page.',
    v1: true
  },
  'X-17': {
    title: 'Stock Font Stack (Inter / Poppins / Roboto)',
    fix: 'Pair an expressive display face with a disciplined body font matching brand tone.',
    v1: false
  },
  'X-18': {
    title: 'Lazy transition: all',
    fix: 'Animate only explicit properties (color, background-color, transform, opacity).',
    v1: false
  },
  'X-19': {
    title: 'Stock Marketing Buzzwords',
    fix: 'State concrete facts, specific processes, authentic numbers, and honest timelines.',
    v1: false
  },
  'X-20': {
    title: 'Vague / First-Name-Only Testimonials',
    fix: 'Provide full attribution (Full Name, Role, Organization, City) or show fewer.',
    v1: false
  },
  'X-21': {
    title: 'Floating Gradient Orbs / Neon Blobs',
    fix: 'Remove neon blobs. Use textured paper, authentic borders, or clean surfaces.',
    v1: false
  },
  'X-22': {
    title: 'Monotonous Centered Layout',
    fix: 'Start-align text by default. Reserve centering for a deliberate, singular statement.',
    v1: false
  },
  'X-23': {
    title: 'Repeated Section Skeletons',
    fix: 'Vary section rhythm: alternate dense tables, asymmetrical columns, and quiet text.',
    v1: false
  },
  'X-24': {
    title: 'Overly Heavy Diffuse Shadows',
    fix: 'Use crisp, shallow shadows (4px-16px) or solid 1px structural borders.',
    v1: false
  },
  'X-25': {
    title: 'Missing :focus-visible Styles',
    fix: 'Add high-contrast, visible focus rings for keyboard accessibility.',
    v1: false
  },
  'X-26': {
    title: 'Motion Without prefers-reduced-motion',
    fix: 'Wrap animations inside @media (prefers-reduced-motion: no-preference).',
    v1: false
  },
  'X-27': {
    title: 'Letter-Spacing on Arabic Text',
    fix: 'Never apply letter-spacing or italics to Arabic text. Set letter-spacing: normal.',
    v1: false
  },
  'X-28': {
    title: 'Generic Stock CTA Labels',
    fix: 'Name the specific outcome: "Order Roast Batch #42", "Reserve Tasting Seat".',
    v1: false
  }
};

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
const BUZZWORDS = ['unlock', 'seamless', 'seamlessly', 'game-changer', 'supercharge', 'next-gen', 'elevate', 'synergy', 'افتح قوة', 'لا مثيل لها', 'ارتقِ', 'سلسة', 'ثورة في عالم'];
const STOCK_CTAS = ['get started', 'learn more', 'sign up now', 'start free trial', 'ابدأ الآن', 'اعرف أكثر', 'سجل الآن', 'ابدأ مجانا'];

function auditHTML(content, v1Only = false) {
  const hits = [];
  const lines = content.split(/\r?\n/);

  function addHit(code, evidence, line = 1) {
    if (v1Only && !TELLS_CATALOGUE[code].v1) return;
    hits.push({
      code,
      title: TELLS_CATALOGUE[code].title,
      evidence: evidence.trim().substring(0, 140),
      line,
      fix: TELLS_CATALOGUE[code].fix
    });
  }

  // V1-01: Purple Gradients
  for (let i = 0; i < lines.length; i++) {
    if (/linear-gradient\([^)]*(indigo|purple|violet|#6366f1|#8b5cf6|#a855f7|#7c3aed|#ec4899)/i.test(lines[i])) {
      addHit('V1-01', lines[i], i + 1);
      break;
    }
  }

  // V1-02: Gradient Text
  for (let i = 0; i < lines.length; i++) {
    if (/-webkit-background-clip:\s*text|background-clip:\s*text/i.test(lines[i])) {
      addHit('V1-02', lines[i], i + 1);
      break;
    }
  }

  // V1-03: Emoji in Headings
  const headingMatches = content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
  for (const h of headingMatches) {
    if (EMOJI_REGEX.test(h)) {
      addHit('V1-03', `Heading contains emoji: ${h.replace(/\s+/g, ' ')}`);
      break;
    }
  }

  // V1-05: Single-side card borders
  for (let i = 0; i < lines.length; i++) {
    if (/border-(left|top):\s*[2-6]px\s+solid\s+(#8b5cf6|#a855f7|#ec4899|#6366f1|var\(--purple|indigo)/i.test(lines[i])) {
      addHit('V1-05', lines[i], i + 1);
      break;
    }
  }

  // V1-06: Glassmorphism blur
  for (let i = 0; i < lines.length; i++) {
    if (/backdrop-filter:\s*blur/i.test(lines[i])) {
      addHit('V1-06', lines[i], i + 1);
      break;
    }
  }

  // V1-07: Weak contrast
  for (let i = 0; i < lines.length; i++) {
    if (/color:\s*(#64748b|#475569|#94a3b8)/i.test(lines[i]) && content.includes('background') && (content.includes('#0') || content.includes('#1'))) {
      addHit('V1-07', lines[i], i + 1);
      break;
    }
  }

  // V1-08: 3 identical cards
  if ((content.match(/class="[^"]*card[^"]*"/gi) || []).length >= 3 || content.includes('repeat(3')) {
    addHit('V1-08', 'Found 3-card grid pattern without content differentiation');
  }

  // V1-09: Badge overuse
  const badges = content.match(/class="[^"]*badge[^"]*"/gi) || [];
  if (badges.length > 1) {
    addHit('V1-09', `Found ${badges.length} badge/eyebrow elements across sections (max recommended: 1)`);
  }

  // V1-13: Cursor glow
  if (content.includes('cursor-glow') || content.includes('pointer-glow')) {
    addHit('V1-13', 'Interactive mouse follower / cursor glow element found');
  }

  // V1-15: Off scale spacing
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/(padding|margin)[^:]*:\s*([^;]+);/);
    if (m && /\b(17|23|37|73|29|41|53)px\b/.test(m[2])) {
      addHit('V1-15', lines[i], i + 1);
      break;
    }
  }

  // V1-16: Em dash overuse
  const dashes = (content.match(/—|&mdash;/g) || []).length;
  if (dashes > 1) {
    addHit('V1-16', `Found ${dashes} em dashes (—) in copy (max recommended: 1)`);
  }

  // Extra tells (X)
  if (!v1Only) {
    // X-17: Stock font stack
    for (let i = 0; i < lines.length; i++) {
      if (/font-family:[^;]*\b(Inter|Poppins|Roboto)\b/i.test(lines[i])) {
        addHit('X-17', lines[i], i + 1);
        break;
      }
    }

    // X-18: transition: all
    for (let i = 0; i < lines.length; i++) {
      if (/transition:\s*all\b/i.test(lines[i])) {
        addHit('X-18', lines[i], i + 1);
        break;
      }
    }

    // X-19: Buzzwords
    const foundBuzz = BUZZWORDS.filter(bw => new RegExp(`\\b${bw}\\b`, 'i').test(content));
    if (foundBuzz.length > 0) {
      addHit('X-19', `Stock buzzwords detected: ${foundBuzz.slice(0, 4).join(', ')}`);
    }

    // X-20: Vague testimonials
    if (/—\s*(Michael|John|Sarah|Alex|David)\b(?!\s*,\s*[A-Z])/i.test(content)) {
      addHit('X-20', 'First-name-only testimonial without official role or company attribution');
    }

    // X-21: Gradient orbs / neon blobs
    if (/glow-orb|blur-orb|neon-blob|blob-1|orb-1/i.test(content)) {
      addHit('X-21', 'Decorative blurred neon gradient orb element found');
    }

    // X-22: Global centering
    if (/(header,\s*section|body)\s*\{[^}]*text-align:\s*center/i.test(content)) {
      addHit('X-22', 'Global centering applied across header and sections');
    }

    // X-24: Heavy diffuse shadows
    for (let i = 0; i < lines.length; i++) {
      if (/box-shadow:[^;]*\b([3-9]\d|\d{3,})px/i.test(lines[i])) {
        addHit('X-24', lines[i], i + 1);
        break;
      }
    }

    // X-25: Missing :focus-visible
    if (!content.includes(':focus-visible') && content.includes('<style')) {
      addHit('X-25', 'No :focus-visible rules declared for accessible keyboard navigation');
    }

    // X-26: Motion without reduced motion
    if (content.includes('@keyframes') && !content.includes('prefers-reduced-motion')) {
      addHit('X-26', '@keyframes animations found without prefers-reduced-motion fallback');
    }

    // X-27: Arabic letter spacing
    if (/dir="rtl"|lang="ar"|[ابتثجحخدذرزسشصضطظعغفقكلمنهوي]/.test(content)) {
      for (let i = 0; i < lines.length; i++) {
        if (/letter-spacing:\s*(?!0\b|normal\b)[0-9.]+(px|em|rem)/i.test(lines[i])) {
          addHit('X-27', lines[i], i + 1);
          break;
        }
      }
    }

    // X-28: Stock CTA labels
    for (const cta of STOCK_CTAS) {
      if (new RegExp(`<button[^>]*>\\s*${cta}[^<]*</button>`, 'i').test(content) ||
          new RegExp(`<a[^>]*>\\s*${cta}[^<]*</a>`, 'i').test(content)) {
        addHit('X-28', `Stock CTA button text found: "${cta}"`);
        break;
      }
    }
  }

  return hits;
}

function printReport(filePath, hits, v1Only) {
  const cRed = '\x1b[31m';
  const cGreen = '\x1b[32m';
  const cYellow = '\x1b[33m';
  const cCyan = '\x1b[36m';
  const cBold = '\x1b[1m';
  const cReset = '\x1b[0m';

  console.log('\n' + '='.repeat(68));
  console.log(`  ${cBold}${cCyan}AI WEB DESIGN AUDIT REPORT${cReset}`);
  console.log(`  Target: ${filePath}`);
  console.log(`  Scope:  ${v1Only ? 'Original 16 (V1)' : 'Full 28 Tells (V1 + Added)'}`);
  console.log('='.repeat(68));

  if (hits.length === 0) {
    console.log(`\n  ${cGreen}${cBold}[SUCCESS] 0 AI Tells detected!${cReset}`);
    console.log(`  The design looks authentic, grounded, and human-crafted.\n`);
    return;
  }

  console.log(`\n  ${cRed}${cBold}[ALERT] Found ${hits.length} AI Tells:${cReset}\n`);
  hits.forEach((hit, idx) => {
    console.log(`  ${idx + 1}. [${cYellow}${hit.code}${cReset}] ${cBold}${hit.title}${cReset}`);
    console.log(`     Evidence:    ${hit.evidence}`);
    console.log(`     Recommended: ${hit.fix}\n`);
  });

  console.log('-'.repeat(68));
  console.log(`  Summary: ${cRed}${cBold}${hits.length} tell(s) need review.${cReset}`);
  console.log('='.repeat(68) + '\n');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

async function installSkills(agent, customTarget) {
  const cGreen = '\x1b[32m';
  const cCyan = '\x1b[36m';
  const cBold = '\x1b[1m';
  const cReset = '\x1b[0m';

  console.log(`\n${cBold}${cCyan}Installing AI Web Refine Skills for: ${agent.toUpperCase()}${cReset}\n`);

  const userHome = process.env.HOME || process.env.USERPROFILE || '';

  if (agent === 'antigravity' || agent === 'all') {
    const dest = customTarget || path.join(userHome, '.gemini', 'antigravity-cli', 'skills');
    copyRecursive(path.join(PKG_ROOT, 'anti-ai-web-refine'), path.join(dest, 'anti-ai-web-refine'));
    copyRecursive(path.join(PKG_ROOT, 'brand-first-web-build'), path.join(dest, 'brand-first-web-build'));
    console.log(`  ${cGreen}✔${cReset} Antigravity skills installed into: ${dest}`);
  }

  if (agent === 'claude' || agent === 'all') {
    const dest = customTarget || path.join(process.cwd(), '.claude', 'skills');
    copyRecursive(path.join(PKG_ROOT, 'anti-ai-web-refine'), path.join(dest, 'anti-ai-web-refine'));
    copyRecursive(path.join(PKG_ROOT, 'brand-first-web-build'), path.join(dest, 'brand-first-web-build'));
    console.log(`  ${cGreen}✔${cReset} Claude Code skills installed into: ${dest}`);
  }

  if (agent === 'cursor' || agent === 'all') {
    const destDir = customTarget || path.join(process.cwd(), '.cursor', 'rules');
    fs.mkdirSync(destDir, { recursive: true });

    const cursorRuleContent = `---
description: Audit and refine websites so they look human-crafted and brand-first, not AI-generated
globs: ["**/*.html", "**/*.css", "**/*.jsx", "**/*.tsx"]
---
Always audit code against the 28 AI design tells.
Avoid purple gradients, gradient text, identical 3-card grids, 'transition: all', and generic buzzwords.
Never apply letter-spacing or italics to Arabic text. Use CSS logical properties.
`;
    fs.writeFileSync(path.join(destDir, 'anti-ai-web-refine.mdc'), cursorRuleContent, 'utf8');
    console.log(`  ${cGreen}✔${cReset} Cursor rules installed into: ${path.join(destDir, 'anti-ai-web-refine.mdc')}`);
  }

  if (agent === 'windsurf' || agent === 'all') {
    const dest = customTarget || path.join(process.cwd(), '.windsurfrules');
    const ruleContent = `# Anti-AI Web Refine Rules
- Avoid purple gradients, gradient-filled headlines, and 3-identical-card grids.
- Never apply letter-spacing or italics to Arabic text.
- Enforce 4px token scale, brand-derived palettes, and accessible focus styles.
`;
    fs.writeFileSync(dest, ruleContent, 'utf8');
    console.log(`  ${cGreen}✔${cReset} Windsurf rules written to: ${dest}`);
  }

  console.log(`\n${cGreen}${cBold}Installation complete!${cReset}`);
  console.log(`You can now ask your AI agent to audit and refine your websites.\n`);
}

async function promptInteractiveInstall() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\nWhere would you like to install the Anti-AI Web skills?');
  console.log('  1) Antigravity CLI / IDE (~/.gemini/antigravity-cli/skills/)');
  console.log('  2) Claude Code (.claude/skills/)');
  console.log('  3) Cursor (.cursor/rules/)');
  console.log('  4) Windsurf (.windsurfrules)');
  console.log('  5) All of the above (Recommended)');
  console.log('  0) Cancel\n');

  rl.question('Select an option (1-5): ', async (answer) => {
    rl.close();
    switch (answer.trim()) {
      case '1':
        await installSkills('antigravity');
        break;
      case '2':
        await installSkills('claude');
        break;
      case '3':
        await installSkills('cursor');
        break;
      case '4':
        await installSkills('windsurf');
        break;
      case '5':
      case '':
        await installSkills('all');
        break;
      default:
        console.log('Cancelled.');
        break;
    }
  });
}

function showHelp() {
  console.log(`
ai-web-ui-refine v${VERSION}
Audit 28 AI web design tells and build brand-first, human-crafted websites.

USAGE:
  $ npx ai-web-ui-refine <command> [options]
  $ ai-web-ui-refine <command> [options]

COMMANDS:
  lint <file.html>          Audit an HTML file against the 28 AI design tells
  init, install             Interactive installer for Antigravity, Claude, Cursor, and Windsurf
  worksheet                 Export brand direction worksheet to current directory
  version, -v               Print CLI version
  help, -h                  Display this help message

OPTIONS FOR 'lint':
  --json                    Output audit results as JSON
  --v1-only                 Audit only original 16 tells

OPTIONS FOR 'install':
  --agent <name>            Target: antigravity, claude, cursor, windsurf, or all
  --target <dir>            Custom destination directory

EXAMPLES:
  $ npx ai-web-ui-refine lint index.html
  $ npx ai-web-ui-refine lint dist/index.html --json
  $ npx ai-web-ui-refine init
  $ npx ai-web-ui-refine install --agent claude
  $ npx ai-web-ui-refine worksheet
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'help';

  if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    showHelp();
    return;
  }

  if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    console.log(`ai-web-ui-refine v${VERSION}`);
    return;
  }

  if (cmd === 'lint') {
    const targetFile = args[1];
    if (!targetFile) {
      console.error('Error: Please provide a target HTML file to lint.');
      console.error('Example: npx ai-web-ui-refine lint index.html');
      process.exit(1);
    }
    const absPath = path.resolve(process.cwd(), targetFile);
    if (!fs.existsSync(absPath)) {
      console.error(`Error: File "${targetFile}" not found.`);
      process.exit(1);
    }

    const v1Only = args.includes('--v1-only');
    const isJson = args.includes('--json');

    const content = fs.readFileSync(absPath, 'utf8');
    const hits = auditHTML(content, v1Only);

    if (isJson) {
      console.log(JSON.stringify({ file: targetFile, total_hits: hits.length, hits }, null, 2));
    } else {
      printReport(targetFile, hits, v1Only);
    }
    return;
  }

  if (cmd === 'init' || cmd === 'install') {
    let agent = null;
    let target = null;

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--agent' && args[i + 1]) {
        agent = args[i + 1].toLowerCase();
        i++;
      } else if (args[i] === '--target' && args[i + 1]) {
        target = path.resolve(process.cwd(), args[i + 1]);
        i++;
      }
    }

    if (agent) {
      await installSkills(agent, target);
    } else {
      await promptInteractiveInstall();
    }
    return;
  }

  if (cmd === 'worksheet' || cmd === 'template') {
    const src = path.join(PKG_ROOT, 'references', 'direction-worksheet.md');
    const dest = path.join(process.cwd(), 'direction-worksheet.md');
    fs.copyFileSync(src, dest);
    console.log(`\n✔ Direction worksheet exported to: ${dest}`);
    console.log('Fill out this worksheet before coding to anchor your brand identity.\n');
    return;
  }

  console.log(`Unknown command: "${cmd}". Run "ai-web-ui-refine help" for available commands.`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
