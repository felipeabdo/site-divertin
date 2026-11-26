# Divertin

Site institucional da Divertin, desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## Tecnologias e serviços

- Next.js 16 com App Router.
- React 19 e TypeScript.
- Tailwind CSS 4.
- Upstash Redis REST para persistência de dados administrativos, autenticação e cache de avaliações.
- Nodemailer para envio de mensagens por SMTP.
- Integração com Google Business Profile para sincronização de avaliações.
- Rotas de upload de arquivos para o formulário de contato.

## Funcionalidades

### Site público

- Página inicial.
- Página Quem somos.
- Serviços e páginas individuais de serviços.
- Formulário de contato.
- Temas visuais sazonais.

### Autenticação e administração

- Acesso pela página `/login`.
- Configurações globais pela página `/configuracoes`.
- Perfis de acesso `admin` e `user`.
- Rotas para autenticação, consulta de sessão, perfil e gestão de usuários.
- Senhas armazenadas com hash `scrypt` e salt individual.
- Sessões assinadas com HMAC-SHA256.
- Cookie de sessão HttpOnly, com `SameSite=Lax` e atributo `Secure` em produção.
- Persistência dos dados de usuários no Upstash Redis.

O primeiro administrador é provisionado com `DIVERTIN_ADMIN_EMAIL` e `DIVERTIN_ADMIN_PASSWORD`. O e-mail é opcional; se não for definido, a aplicação utiliza o endereço padrão configurado internamente. A senha inicial deve ter pelo menos 10 caracteres.

`AUTH_SESSION_SECRET` deve ser um segredo aleatório com pelo menos 32 caracteres.

### Configurações globais do site

As configurações são armazenadas no Redis e incluem os temas `padrao`, `natal`, `carnaval` e `pascoa`, além de um aviso global com título, mensagem e controle de ativação. A leitura é disponibilizada pela API; a alteração exige uma sessão autenticada com perfil de administrador.

### Integrações

**Google Business Profile**

A rota `/api/google-reviews/sync` sincroniza avaliações usando credenciais OAuth 2.0 e os identificadores da conta e da localização. O projeto também utiliza Upstash Redis para armazenar o cache das avaliações. `CRON_SECRET` protege a rota de sincronização.

**Formulário de contato**

O envio de mensagens utiliza SMTP. Há rotas específicas para o envio de mensagens, criação de sessão de upload e upload de arquivos.

## Rotas de API

| Rota | Finalidade |
|---|---|
| `/api/auth/login` | Autenticação |
| `/api/auth/logout` | Encerramento da sessão |
| `/api/auth/me` | Consulta da sessão atual |
| `/api/auth/profile` | Operações do perfil |
| `/api/admin/users` | Gestão de usuários |
| `/api/admin/users/[id]` | Operações sobre um usuário |
| `/api/site-settings` | Leitura e atualização das configurações globais |
| `/api/contato` | Envio de mensagens |
| `/api/contato/upload-session` | Criação de sessão de upload |
| `/api/contato/upload` | Upload de arquivos |
| `/api/google-reviews/sync` | Sincronização de avaliações |
| `/api/health` | Verificação de disponibilidade |

## Configuração do ambiente

O arquivo `.env.example` lista as variáveis utilizadas pelas integrações. Para desenvolvimento local, crie `.env.local` a partir dele e preencha os valores necessários:

    cp .env.example .env.local

### Autenticação e Upstash Redis

- `UPSTASH_REDIS_REST_URL`: endereço REST do banco Upstash Redis.
- `UPSTASH_REDIS_REST_TOKEN`: token de acesso ao Redis.
- `AUTH_SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `DIVERTIN_ADMIN_EMAIL`: e-mail do primeiro administrador (opcional; há um padrão interno).
- `DIVERTIN_ADMIN_PASSWORD`: senha inicial do administrador, com pelo menos 10 caracteres.

Gere um segredo para `AUTH_SESSION_SECRET` com:

    openssl rand -base64 48

### Google Business Profile

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_BUSINESS_ACCOUNT_ID`
- `GOOGLE_BUSINESS_LOCATION_ID`
- `CRON_SECRET`

Configure as credenciais OAuth 2.0 e os identificadores correspondentes à conta e à localização do Google Business Profile. Use um segredo forte para `CRON_SECRET`.

### E-mail e formulário de contato

- `SMTP_HOST`: servidor SMTP.
- `SMTP_PORT`: porta SMTP; o padrão no código é `465`.
- `SMTP_USER`: usuário de autenticação.
- `SMTP_PASS`: senha de autenticação.
- `CONTACT_FROM`: remetente; quando não informado, utiliza `SMTP_USER`.
- `CONTACT_TO`: destinatário das mensagens do formulário.
- `SMTP_SECURE`: quando não informado, a conexão é considerada segura se a porta for `465`.

Nunca versione `.env.local`, senhas, tokens ou credenciais reais.

## Desenvolvimento local

Instale as dependências:

    npm install

Inicie o servidor de desenvolvimento:

    npm run dev

Por padrão, o Next.js disponibiliza o site em `http://localhost:3000`.

## Verificação e build

Os scripts definidos no `package.json` são:

    npm run lint
    npm run typecheck
    npm run build

Para iniciar a versão de produção localmente depois de gerar o build:

    npm run start

## Produção

Configure as variáveis necessárias na plataforma de hospedagem antes de publicar o projeto. Mantenha credenciais e segredos nos ambientes seguros da hospedagem e nunca em arquivos versionados.
