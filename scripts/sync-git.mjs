import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const message = args.filter((arg) => !arg.startsWith("--")).join(" ").trim();

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !options.allowFailure) {
    process.exit(result.status ?? 1);
  }

  return {
    status: result.status ?? 0,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? "",
  };
}

function usage() {
  console.error('Use: npm run publish -- "sua mensagem de commit"');
  console.error('Opcoes: --skip-lint, --skip-build, --skip-checks');
  process.exit(1);
}

function getVercelProject() {
  const projectFile = ".vercel/project.json";
  if (!existsSync(projectFile)) return null;

  try {
    const raw = readFileSync(projectFile, "utf8");
    const parsed = JSON.parse(raw);
    return {
      projectId: parsed.projectId ?? null,
      projectName: parsed.projectName ?? "projeto-sem-nome",
      orgId: parsed.orgId ?? null,
    };
  } catch {
    return null;
  }
}

if (!message) {
  usage();
}

const status = run("git", ["status", "--porcelain"], { capture: true }).stdout;

if (!status) {
  console.log("Nenhuma alteracao para sincronizar.");
  process.exit(0);
}

const branch = run("git", ["branch", "--show-current"], { capture: true }).stdout || "main";
const originResult = run("git", ["remote", "get-url", "origin"], { capture: true, allowFailure: true });
const origin = originResult.status === 0 ? originResult.stdout : "";
const vercelProject = getVercelProject();
const skipChecks = flags.has("--skip-checks");
const shouldRunLint = !skipChecks && !flags.has("--skip-lint");
const shouldRunBuild = !skipChecks && !flags.has("--skip-build");

if (!origin) {
  console.error("Remote origin nao configurado. Conecte o repositorio ao GitHub antes de publicar.");
  process.exit(1);
}

if (shouldRunLint) {
  console.log("[publish] rodando lint...");
  run(npmCommand, ["run", "lint"]);
}

if (shouldRunBuild) {
  console.log("[publish] rodando build...");
  run(npmCommand, ["run", "build"]);
}

console.log("[publish] enviando alteracoes para o GitHub...");
run("git", ["add", "-A"]);
run("git", ["commit", "-m", message]);
run("git", ["push", "origin", branch]);

if (vercelProject) {
  const deployType = branch === "main" ? "producao" : "preview";
  console.log(
    `[publish] GitHub atualizado na branch ${branch}. Projeto Vercel vinculado: ${vercelProject.projectName}.`,
  );
  console.log(
    `[publish] Se a integracao Git da Vercel estiver ativa, um deploy de ${deployType} deve iniciar automaticamente.`,
  );
} else {
  console.log(
    `[publish] GitHub atualizado na branch ${branch}. Nenhum projeto Vercel local foi encontrado em .vercel/project.json.`,
  );
}
