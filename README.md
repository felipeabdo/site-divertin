# Clínica Divertin — código-fonte revisado

Este pacote contém a pasta `src/` do site da Clínica Divertin, revisada para facilitar a manutenção e o estudo do código. A organização atual usa o **App Router do Next.js**, componentes React/TypeScript, Tailwind CSS e uma separação simples entre apresentação e dados.

> **Importante sobre este ZIP:** o arquivo original enviado continha apenas `src/`. Ele não incluía `package.json`, arquivo de lock, configuração TypeScript/Tailwind nem a pasta `public/`. Portanto, este pacote é o código-fonte revisado, não uma cópia autossuficiente do projeto inteiro. Para executar o site, mantenha os arquivos de configuração, dependências e imagens do projeto original.

## Como aplicar ao projeto original

1. Faça uma cópia de segurança do projeto que já funciona.
2. Extraia este ZIP e substitua a pasta `src/` do projeto original pela pasta `src/` deste pacote.
3. **Mantenha a pasta `public/` original.** As páginas referenciam imagens e GIFs que não estavam presentes no ZIP recebido.
4. Na raiz do projeto original, instale as dependências conforme o gerenciador e o arquivo de lock já usados pelo projeto.
5. Execute os comandos de verificação que já existirem nos scripts do `package.json` — normalmente desenvolvimento, lint, TypeScript e build de produção.

Não substitua o `package.json` nem crie configurações de versões arbitrárias: eles não fizeram parte do arquivo enviado e podem conter decisões importantes do projeto real.

## Estrutura do código

```text
src/
├── app/
│   ├── api/contato/route.ts     # Endpoint POST do formulário
│   ├── contato/page.tsx         # Página de contato
│   ├── quem-somos/page.tsx      # Página institucional
│   ├── servicos/
│   │   ├── page.tsx             # Catálogo de especialidades
│   │   └── [slug]/page.tsx      # Detalhe de cada especialidade
│   ├── globals.css              # Tailwind e tokens de cor/fontes
│   ├── layout.tsx               # Layout raiz, metadados, descanso e Analytics
│   └── page.tsx                 # Home
├── components/
│   ├── contato/                 # Seções e formulário de contato
│   ├── quem-somos/              # Equipe, galeria, modal e conteúdo institucional
│   ├── servicos/                # Cards e seções de especialidades
│   ├── Botao.tsx                # Botão/link visual reutilizável
│   ├── Cloud.tsx                # Divisor decorativo de nuvens
│   ├── NavBar.tsx               # Navegação responsiva e animada
│   ├── PageLoader.tsx            # Loading opcional, não ativado no layout atual
│   └── ScreenSaver.tsx          # Descanso de tela por inatividade
└── data/
    ├── contatoData.ts           # Telefone, WhatsApp, endereço e horários
    └── servicosData.ts          # Catálogo tipado de especialidades e áreas
```

## Decisões de manutenção desta revisão

- Remoção de imports que não eram usados (`Link`, `PageLoader` no layout e `Cloud` na seção de princípios).
- Remoção de `components/Cloud copy.tsx`: era uma cópia não referenciada de `Cloud.tsx`. A versão mantida também permite personalizar o caminho da imagem.
- Tipagem explícita do conteúdo do layout e das propriedades do botão reutilizável.
- Botões sem link agora têm `type="button"` por padrão, evitando envios acidentais caso o componente seja usado futuramente dentro de um formulário. É possível escolher `type="submit"` quando isso for desejado.
- Links abertos em nova aba recebem a proteção `noopener`.
- Limpeza de um valor de margem negativa inválido no rodapé (`mt-[-45px]`).
- Limpeza do listener de `load` e do temporizador de pré-carregamento do GIF no `ScreenSaver` quando o componente é desmontado.
- Tratamento separado para JSON malformado e para corpos de requisição que não sejam objetos no endpoint de contato.
- Campos de formulário com `name` e `autoComplete`, e feedback de erro anunciado como alerta para tecnologias assistivas.
- Comentários didáticos adicionados aos pontos em que o fluxo de dados e as decisões de implementação são menos óbvios.

As alterações foram intencionalmente conservadoras: não foi redesenhada nenhuma página nem reestruturado o fluxo de navegação.

## Comportamentos e limitações já existentes

### O formulário ainda não envia e-mail

A rota `POST /api/contato` valida os campos e retorna **HTTP 501** porque a integração com um serviço de e-mail ainda não foi configurada. Isso significa que o formulário não conclui o envio automático hoje. Esta revisão manteve esse comportamento para não fingir um envio que não existe.

Para habilitar o envio real, será necessário escolher e configurar um provedor (por exemplo, Resend ou SMTP/Nodemailer), usar variáveis de ambiente para credenciais e implementar o envio dentro de `src/app/api/contato/route.ts`. Nunca coloque senhas ou chaves privadas no código do navegador.

### Imagens e arquivos públicos

O código referencia imagens e GIFs como `/bg-hero.png`, `/logo (1).png`, `/Jessica.png`, `/cloud (1).png`, `/descanso.gif` e outras. Esses arquivos devem existir no diretório `public/` do projeto original. Como não vieram no ZIP, não foram inventados nem substituídos. A varredura encontrou estas referências a assets:

`/arrow_forward.svg`, `/bg-hero.png`, `/card_ana.png`, `/Fernanda.png`, `/card_rafaela.png`, `/cloud (1).png`, `/cloud (6).png`, `/cloud bottom.png`, `/descanso.gif`, `/Group 1.svg`, `/Group 1 (1).svg`, `/Group 1 (2).svg`, `/img1.webp` a `/img5.png`, `/Jessica.jpeg`, `/jessica-full.png`, `/loading.gif`, `/logo (1).png`, `/logo-compartilhamento.png` e `/mascote-divertin-contato.png`. O caminho `/equipe/ana.jpg` aparece em uma instrução de comentário para cadastrar fotos da equipe, não como imagem ativa nesta configuração.

### Google Analytics

O layout conserva o identificador `G-14VEB6PD4R` que já existia no fonte recebido. Antes de publicar em outro domínio/propriedade, confira se esse identificador é o correto.

## Verificações possíveis nesta cópia

- Análise sintática dos arquivos TypeScript/TSX.
- Verificação de resolução dos imports locais.
- Inspeção de imports sem uso e de dependências/arquivos duplicados.

Não foi possível executar um build real do Next.js nem testar o site visualmente porque faltam os arquivos de dependências/configuração e `public/`. Consulte `RELATORIO_DE_REVISAO.md` para os resultados objetivos e os próximos passos. =
x   
## Login, painel de configurações e temas

O projeto agora inclui autenticação de usuários e administradores, painel em `/configuracoes` e tela de acesso em `/login`. A persistência usa o **mesmo Upstash Redis REST** já utilizado pelo cache das avaliações do Google; não foi criado armazenamento local de servidor, que seria volátil em ambientes serverless.

### Variáveis obrigatórias para ativar o login

Configure no ambiente de produção (por exemplo, em Vercel → Settings → Environment Variables) e também no `.env.local` durante desenvolvimento:

- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`: credenciais do Redis Upstash já usado pelo projeto.
- `AUTH_SESSION_SECRET`: segredo aleatório com pelo menos 32 caracteres. Gere um novo segredo, não use o texto de exemplo (por exemplo: `openssl rand -base64 48`).
- `DIVERTIN_ADMIN_EMAIL`: e-mail do primeiro administrador. O padrão já está definido como `jehdelcorso@gmail.com`.
- `DIVERTIN_ADMIN_PASSWORD`: senha inicial do administrador definida pelo responsável do projeto. Cadastre-a diretamente nas variáveis de ambiente, nunca no código nem em um repositório Git.

Ao primeiro acesso ao endpoint de login, o sistema cria automaticamente o administrador inicial no Redis caso ele ainda não exista. Se o e-mail já estiver cadastrado, a conta é garantida como administradora sem redefinir sua senha. Depois de fazer o primeiro acesso, altere a senha na seção **Minha conta**.

**Atenção:** sem as variáveis de ambiente acima, o site público continua navegável, mas o login não será ativado. O ZIP não contém credenciais privadas nem arquivos `.env` de produção. Para não expor a senha de administrador, ela precisa ser inserida no ambiente de hospedagem pelo proprietário do projeto.

### Recursos incluídos

- Login/logout com cookie de sessão HttpOnly, assinatura HMAC, validade de sete dias e proteção contra excesso de tentativas.
- Senhas armazenadas como hash `scrypt` com salt individual; a senha nunca é enviada de volta à interface.
- Perfis `admin` e `user`; apenas administradores podem criar contas, promover outros administradores, alterar o status de acesso ou gerenciar o tema global.
- Proteção para que o último administrador ativo não seja removido/suspenso e para que um administrador não suspenda o próprio acesso pela interface.
- Usuários podem atualizar nome e senha; administradores podem gerenciar contas em `/configuracoes`.
- Tema **Padrão** e tema **Natal**. O tema Padrão continua selecionado por padrão; Natal só entra em vigor quando um administrador o aplica. A configuração é global e armazenada no Redis, sendo exibida também a visitantes não autenticados.
- A estrutura do site e os assets originais foram preservados. O tema Natal usa decoração CSS sazonal e mantém os mesmos textos, imagens de conteúdo e organização de páginas; não substitui fotos institucionais ou logotipos.

### Rotas novas

- `/login` — acesso à conta.
- `/configuracoes` — perfil pessoal e, para administradores, usuários e temas.
- `/api/auth/*` — autenticação e perfil.
- `/api/admin/users` — gestão de usuários, restrita a administradores.
- `/api/site-settings` — leitura pública e alteração administrativa das configurações visuais.
