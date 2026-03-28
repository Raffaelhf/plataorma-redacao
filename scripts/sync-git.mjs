import { execSync } from "node:child_process";

function run(command, options = {}) {
  return execSync(command, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  }).trim();
}

const message = process.argv.slice(2).join(" ").trim();

if (!message) {
  console.error('Use: npm run sync -- "sua mensagem de commit"');
  process.exit(1);
}

const status = run("git status --porcelain");

if (!status) {
  console.log("Nenhuma alteracao para sincronizar.");
  process.exit(0);
}

const branch = run("git branch --show-current") || "main";

execSync("git add -A", { stdio: "inherit" });
execSync(`git commit -m "${message.replaceAll('"', '\\"')}"`, { stdio: "inherit" });
execSync(`git push origin ${branch}`, { stdio: "inherit" });

console.log(
  `Codigo enviado para o GitHub na branch ${branch}. A Vercel fara o deploy automatico.`
);
