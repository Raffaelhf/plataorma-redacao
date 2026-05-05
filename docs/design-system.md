# Design System - Escreva Mais

Este documento define a base visual da plataforma Escreva Mais para manter consistencia entre landing page, area do aluno, professor e admin.

## Personalidade

A Escreva Mais deve parecer:

- organizada
- humana
- educacional
- energica sem ser infantil
- premium o bastante para uma plataforma paga
- focada em evolucao, acompanhamento e metodo

Evitar:

- paineis vazios apenas para preencher espaco
- mockups infantis ou muito decorativos
- excesso de cards competindo entre si
- textos espremidos dentro de componentes pequenos
- promessas exageradas como "nota 1000 garantida"
- professores, alunos ou numeros ficticios apresentados como reais

## Tokens Principais

Os tokens reais vivem em `src/components/mockups/escreva-mais/_group.css`, dentro de `.em-root`.

### Cores Base

| Token | Valor | Uso |
| --- | --- | --- |
| `--em-ink` | `#0E0F12` | texto principal, bordas fortes, fundos escuros |
| `--em-ink-soft` | `#1B1D22` | variacao escura secundaria |
| `--em-bg` | `#F4F4EE` | fundo quente da plataforma |
| `--em-cream` | `#FAF6EC` | paineis suaves e areas editoriais |
| `--em-surface` | `#FFFFFF` | cards e superficies principais |

### Acentos

| Token | Valor | Uso |
| --- | --- | --- |
| `--em-green` | `#2BD37B` | progresso, sucesso, energia primaria |
| `--em-green-deep` | `#16A35F` | icones, textos e detalhes de sucesso |
| `--em-green-soft` | `#C7F1DA` | chips e fundos suaves |
| `--em-yellow` | `#FFC93D` | CTA, premio, destaque forte |
| `--em-yellow-soft` | `#FFE9A8` | fundos de premiacao ou apoio |
| `--em-coral` | `#FF7A45` | calor humano, detalhe expressivo |
| `--em-peach` | `#FCE2C2` | mentoria, apoio, acolhimento |
| `--em-lavender` | `#E2D8FB` | recursos secundarios e variacao |
| `--em-rose` | `#FDD6E2` | alerta leve ou apoio visual |

## Tipografia

Fonte principal:

- `Plus Jakarta Sans`

Fonte secundaria:

- `Inter`

Uso:

- Titulos grandes: `em-display` ou `em-display-xl`
- UI, formularios e textos: `Inter` ou heranca da `.em-root`
- Evitar letter-spacing negativo
- Nao usar fonte escalando diretamente com viewport fora de clamps controlados
- Em cards compactos, usar titulos menores e mais densos

## Formas

| Token | Valor | Uso |
| --- | --- | --- |
| `--em-radius-card` | `22px` | cards principais |
| `--em-radius-card-lg` | `32px` | paineis grandes e hero |
| `--em-radius-btn` | `12px` | botoes |
| `--em-radius-pill` | `999px` | chips e badges |

Regra:

- Cards podem ser arredondados, mas o conteudo precisa respirar.
- Nao colocar cards dentro de cards sem necessidade.
- Componentes de UI pequenos devem ter dimensoes estaveis.

## Sombras e Bordas

Padrao visual:

- borda escura de `1.5px`
- sombra dura curta
- visual editorial e levemente impresso

Tokens:

- `--em-shadow-hard`: `6px 6px 0 0 #0E0F12`
- `--em-shadow-hard-sm`: `4px 4px 0 0 #0E0F12`
- `--em-shadow-soft`: sombra suave para profundidade discreta

Uso:

- Use sombra dura em cards, botoes e elementos importantes.
- Evite aplicar sombra dura em muitos elementos proximos.
- Se tudo tem borda e sombra, nada ganha destaque.

## Componentes Base

### Card Editorial

Classe existente:

```tsx
className="em-card-hard bg-white p-6"
```

Usar para:

- cards de curso
- blocos de criterio
- paineis administrativos
- secoes com informacao importante

Evitar:

- card gigante com pouca informacao
- card com texto quebrando palavra
- card apenas decorativo

### Botao Primario

Classe existente:

```tsx
className="em-btn-primary"
```

Uso:

- CTA principal
- cadastro
- assinatura
- acao de maior prioridade

Padrao:

- fundo amarelo
- borda escura
- sombra dura
- texto curto e direto

### Botao Inverso

Classe existente:

```tsx
className="em-btn-ghost-inverse"
```

Uso:

- CTA secundario em fundo escuro
- login
- alternativa de navegacao

### Chip

Classe existente:

```tsx
className="em-chip"
```

Uso:

- categoria
- selo
- status
- contexto de secao

Regra:

- chips devem ser curtos.
- Evitar mais de dois chips competindo no topo da mesma secao.

## Iconografia

Biblioteca padrao:

- `lucide-react`

Icones recomendados:

- `Trophy`: premiacao e desafio
- `Gift`: premio ou beneficio
- `Smartphone`: celular como premio
- `LineChart`: desempenho e evolucao
- `CalendarCheck`: prazo e pontualidade
- `FileText`: redacao, estrutura, atividade
- `BookOpen`: repertorio
- `MessageSquareText`: argumentacao e feedback
- `BrainCircuit`: clareza, inteligencia, metodo
- `GraduationCap`: educacao e formacao

Regra:

- Icone precisa explicar a informacao, nao enfeitar.
- Nao deixar icones soltos em grandes areas vazias.

## Layout

### Containers

Classes existentes:

```css
.em-landing-container
.em-landing-container-wide
```

Medidas:

- `em-landing-container`: ate `1120px`
- `em-landing-container-wide`: ate `1180px`

Regra:

- Landing deve usar largura controlada.
- Evitar cards muito altos so para equilibrar coluna.
- Em mobile, componentes devem virar fluxo vertical com respiro.

### Ritmo de Secao

Padrao recomendado:

```tsx
<section className="px-4 py-16 sm:px-6 md:py-24">
```

Uso:

- `py-14` para secoes compactas
- `py-16 md:py-24` para secoes principais
- `gap-6` a `gap-10` entre blocos

## Padroes de Secao

### Hero

Objetivo:

- explicar rapidamente a promessa da plataforma
- levar para cadastro ou login
- mostrar prova visual real

Regras:

- H1 forte e direto
- CTA visivel
- prova social dinamica, sem numeros ficticios
- imagem ou mockup com funcao clara

### Premiação

Objetivo:

- comunicar que constancia pode gerar premio
- explicar criterio sem promessa exagerada
- mostrar celular/premio de forma clara

Conteudo minimo:

- titulo conectando constancia e premio
- texto com "conforme regulamento"
- premio visivel
- criterios: desempenho, pontualidade, atividades no prazo

Evitar:

- pódio/celular/cartoes disputando atencao
- criterios sem texto
- painel "alem da gramatica" vazio
- texto quebrado em colunas estreitas

### Além da Gramática

Objetivo:

- mostrar que o curso vai alem de correcao gramatical

Dimensoes:

- repertorio sociocultural
- organizacao de ideias
- estrutura dissertativa
- argumentacao
- clareza

Padrao recomendado:

- bloco escuro ou claro com titulo curto
- 4 chips/cards com icones
- texto de apoio com no maximo 2 linhas

### Cursos

Cada card deve ter:

- imagem coerente
- titulo objetivo
- descricao curta
- preco vindo do sistema
- professor real

Regra importante:

- Nao criar professores genericos.
- Professor atual: `Prof. Luiz Fernando`.

### Professor

Como no momento existe apenas um professor:

- usar singular: "Professor"
- nao usar "equipe", "mentores" ou "top mentores"
- nome correto: `Prof. Luiz Fernando`

## Dados Reais

Sempre que uma informacao parecer estatistica ou prova social, ela deve vir do sistema.

Exemplos:

- alunos ativos
- matriculas aprovadas
- usuarios recentes
- valores de planos

Evitar:

- `+15.000 alunos aprovados`
- nomes ficticios como prova real
- depoimentos apresentados como reais sem origem

## Copywriting

Tom:

- claro
- brasileiro
- confiante
- sem exagero
- focado em evolucao e acompanhamento

Preferir:

- "Evolucao com pratica, repertorio e feedback"
- "Redacao para todas as fases escolares"
- "Pontualidade, atividades no prazo e desempenho"
- "Premiacao conforme regulamento"
- "Acompanhamento com Prof. Luiz Fernando"

Evitar:

- "nota 1000 garantida"
- "melhor plataforma"
- "top mentores" se nao houver time real
- promessas sem condicao

## Regras de Qualidade Visual

Antes de publicar uma tela, verificar:

- A mensagem principal aparece em ate 3 segundos?
- Existe algum card vazio ou decorativo demais?
- Alguma palavra quebra de forma feia?
- O CTA principal esta claro?
- O conteudo cabe bem em mobile?
- O bloco parece parte da Escreva Mais?
- Os nomes, numeros e precos sao reais?
- O visual tem respiro suficiente?

## Checklist Tecnico

Para mudancas visuais relevantes:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Observacao:

- O build local pode imprimir erro do Prisma se `DATABASE_URL` nao estiver carregado, mas deve finalizar com sucesso quando o fallback/ambiente estiver correto.

## Arquivos de Referencia

- Tokens e classes: `src/components/mockups/escreva-mais/_group.css`
- Landing principal: `src/components/mockups/escreva-mais/Landing.tsx`
- Layout compartilhado: `src/components/mockups/escreva-mais/_shared`
- Skill de direcao visual: `C:\Users\UMTI_Suporte\.codex\skills\site-design-art-direction`
