## PostgreSQL com Docker

O projeto usa PostgreSQL rodando em Docker para desenvolvimento local.

## Subir o banco

```bash
npm run db:up
npm run db:generate
npm run db:push
npm run db:seed
```

## Usuarios de teste

- Aluno: `adminaluno` / `123`
- Professor: `adminprof` / `1234`
- Administrador: `Raffaeladmin` / `Raffael1@`

## Rodar o projeto

```bash
npm run dev
```

## Publicar GitHub e Vercel

Depois de alterar o codigo, use:

```bash
npm run publish -- "sua mensagem de commit"
```

Esse comando agora:

- roda `lint`
- roda `build`
- faz `git add`, `git commit` e `git push`
- confirma se o projeto esta vinculado a Vercel

Como o repositorio ja esta conectado a Vercel, cada push na branch `main` deve disparar um deploy de producao automaticamente. Em outras branches, o normal e a Vercel gerar um deploy de preview.

Se quiser manter o nome antigo, este alias continua funcionando:

```bash
npm run sync -- "sua mensagem de commit"
```

Se precisar pular as validacoes em um envio rapido:

```bash
npm run publish -- "sua mensagem de commit" -- --skip-checks
```

Se quiser testar o fluxo sem enviar nada:

```bash
npm run publish -- "sua mensagem de commit" -- --dry-run --skip-checks
```

## Sincronizacao automatica

Se voce quiser subir automaticamente sempre que salvar alteracoes no projeto, rode:

```bash
npm run autosync
```

O watcher observa os arquivos do projeto, ignora pastas como `.git`, `.next`, `.vercel` e `node_modules`, e faz `git add`, `git commit` e `git push` automaticamente apos alguns segundos sem novas mudancas. O tempo padrao de espera e `12` segundos e pode ser ajustado com `AUTO_SYNC_DEBOUNCE_MS`.

## Encerrar o banco

```bash
npm run db:down
```
