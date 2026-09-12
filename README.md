# Plataforma IBBF — Frontend

Frontend em Next.js da Plataforma IBBF, sistema de gestão para a comunidade da 1ª Igreja Batista Bíblica Fundamentalista de Canoas (cadastro de membros, famílias e ministérios).

Consome a [API do backend](https://github.com/samuel-cardoso/back-plataforma-ibbf) através de um padrão **BFF (Backend for Frontend)**: o browser nunca fala diretamente com o backend real, apenas com as próprias rotas do Next (`/api/*`), que fazem a ponte de forma autenticada.

## Arquitetura

- **UI (Client Components)** → chama `bffApi` (`infra/api/config/bff-api.config.ts`), um cliente Axios apontando para `/api/*`.
- **Rotas BFF** (`app/api/**/route.ts`) → recebem a chamada, usam `authenticatedBackendFetch`/`publicBackendFetch` (`infra/api/config/backend-client.ts`) pra chamar o backend real via `BACKEND_API_URL`, anexando o `accessToken` lido de um cookie `httpOnly`.
- **Sessão**: `accessToken`/`refreshToken` ficam em cookies `httpOnly` (nunca expostos ao JS do browser). Em um 401, o backend-client tenta renovar a sessão via `/auth/refresh` automaticamente antes de propagar o erro.
- **RBAC no cliente**: hoje é otimista (`stores/permissionStore.ts`) — assume acesso de staff até o backend recusar uma ação com `403 FORBIDDEN`, quando então esconde as ações administrativas pro resto da sessão. Isso é só uma otimização de UX; a autorização de verdade é sempre validada no backend.

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router + Route Handlers)
- React 19
- TypeScript
- Tailwind CSS 4 + shadcn/ui + Base UI
- TanStack Query (cache/estado servidor) + Zustand (estado de UI/sessão)
- React Hook Form + Zod
- next-intl (i18n)
- Jest + Testing Library

## Como rodar

```bash
npm install
cp .env.local.example .env.local
```

Preencha o `.env.local` com a URL do [backend](https://github.com/samuel-cardoso/back-plataforma-ibbf) local:

```
BACKEND_API_URL=http://localhost:3010
COOKIE_SECURE=false
```

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Outros scripts

```bash
npm run build       # build de produção
npm run typecheck   # checagem de tipos
npm run lint        # eslint
npm test            # testes (Jest)
```

## Estrutura

```
app/
  (public)/       # entrar, registro, esqueci/redefinir senha
  (account)/      # confirmação de email
  (app)/          # área autenticada: membros, famílias, ministérios
  (legal)/        # privacidade, termos
  api/            # rotas BFF (proxy autenticado para o backend real)
components/       # componentes de domínio (auth, members, families, ministries) + ui (shadcn)
config/auth.ts    # nomes dos cookies de sessão
hooks/
  api/            # hooks de dados (React Query) por domínio
  forms/          # hooks de formulário (React Hook Form + Zod)
  ui/             # hooks de UI (debounce, paginação, permissões)
infra/api/        # clientes HTTP (bff/backend), endpoints, mappers, services
lib/              # constantes, tipos, schemas Zod, utils, i18n
messages/pt-BR.json
stores/           # estado global (permissões, UI)
```

## Licença

Todos os direitos reservados. Veja [LICENSE](./LICENSE) — este projeto não pode ser usado, copiado, modificado ou redistribuído por terceiros sem autorização expressa do autor.
