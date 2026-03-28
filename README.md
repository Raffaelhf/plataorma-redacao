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

## Sincronizar GitHub e Vercel

Depois de alterar o codigo, use:

```bash
npm run sync -- "sua mensagem de commit"
```

Esse comando faz `git add`, `git commit` e `git push`. Como o repositorio ja esta conectado a Vercel, cada push na branch `main` dispara um novo deploy automaticamente.

## Encerrar o banco

```bash
npm run db:down
```
