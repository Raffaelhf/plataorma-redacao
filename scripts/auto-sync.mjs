import { execSync } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const branch = run("git branch --show-current") || "main";
const debounceMs = Number(process.env.AUTO_SYNC_DEBOUNCE_MS || 12000);

const ignoredPrefixes = [
  ".git/",
  ".next/",
  ".vercel/",
  "node_modules/",
  "coverage/",
  "build/",
  "out/",
];

const ignoredExact = new Set([
  ".env",
  ".env.local",
  ".env.example",
  ".env.vercel.preview",
  ".env.vercel.production",
  ".env.vercel.runtime",
  "npm-debug.log",
  "yarn-debug.log",
  "yarn-error.log",
  "pnpm-debug.log",
]);

let timer = null;
let syncing = false;
let pendingSync = false;

function run(command, options = {}) {
  return execSync(command, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  }).trim();
}

function hasTrackedChanges() {
  return run("git status --porcelain").length > 0;
}

function shouldIgnore(relativePath) {
  if (!relativePath) return true;

  const normalized = relativePath.replaceAll("\\", "/");

  if (ignoredExact.has(normalized)) return true;
  if (normalized.endsWith(".log")) return true;

  return ignoredPrefixes.some((prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix));
}

function scheduleSync(relativePath) {
  if (shouldIgnore(relativePath)) return;

  pendingSync = true;

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    timer = null;
    void syncChanges();
  }, debounceMs);
}

async function syncChanges() {
  if (syncing) {
    pendingSync = true;
    return;
  }

  if (!pendingSync || !hasTrackedChanges()) {
    pendingSync = false;
    return;
  }

  syncing = true;
  pendingSync = false;

  const timestamp = new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
  const message = `chore: auto-sync ${timestamp}`;

  try {
    console.log(`[autosync] sincronizando alteracoes para ${branch}...`);
    execSync("git add -A", { stdio: "inherit" });
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync(`git push origin ${branch}`, { stdio: "inherit" });
    console.log("[autosync] alteracoes enviadas. A Vercel deve iniciar um novo deploy.");
  } catch (error) {
    console.error("[autosync] nao foi possivel sincronizar automaticamente.");
    if (error instanceof Error && error.message) {
      console.error(error.message);
    }
  } finally {
    syncing = false;
    if (pendingSync) {
      scheduleSync("pending");
    }
  }
}

console.log(`[autosync] observando ${projectRoot}`);
console.log(`[autosync] branch atual: ${branch}`);
console.log(`[autosync] sincronizacao automatica apos ${debounceMs / 1000}s sem novas alteracoes`);

watch(
  projectRoot,
  { recursive: true },
  (_, filename) => {
    if (!filename) return;
    const relativePath = path.relative(projectRoot, path.resolve(projectRoot, filename.toString()));
    scheduleSync(relativePath);
  },
);

process.stdin.resume();
