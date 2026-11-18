# Integração do formulário de contato — Clínica Divertin

## Variáveis de ambiente

Configure estas variáveis no projeto `site-divertin` da Vercel, nos ambientes Production, Preview e Development:

```dotenv
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=secretaria@clinicadivertin.com.br
SMTP_PASS=COLOQUE_A_SENHA_DA_CAIXA_TITAN
CONTACT_FROM=secretaria@clinicadivertin.com.br
CONTACT_TO=secretaria.divertin@gmail.com
```

O armazenamento Vercel Blob privado precisa estar conectado ao projeto e criar a variável `BLOB_READ_WRITE_TOKEN`. O fluxo de upload direto no navegador usa esse token exclusivamente no servidor, nunca no bundle do cliente.

A proteção do formulário usa as variáveis existentes da aplicação:

- `AUTH_SESSION_SECRET` (mínimo de 32 caracteres)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Não inclua valores reais dessas variáveis no repositório, no ZIP ou em mensagens.

## Desenvolvimento local

Depois de conectar o Blob ao ambiente Development, baixe as variáveis com a Vercel CLI (`vercel env pull .env.local`). Confira que `.env.local` contém as variáveis acima, sem compartilhar o arquivo. SMTP e Redis também precisam estar configurados para testar um envio real.

## Instalação e validação

Execute na pasta do projeto:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

O ambiente em que preparei este ZIP não conseguiu acessar o registry do npm; por isso, o `package-lock.json` incluído é o original do projeto. O comando `npm install` resolverá as duas dependências novas e atualizará o lockfile localmente. Depois, faça commit dos dois arquivos (`package.json` e `package-lock.json`).

## Comportamento implementado

- Até 10 anexos PDF, DOC ou DOCX.
- Limite individual e total de 17 MiB por formulário.
- Upload direto do navegador para o Blob privado, sem passar os arquivos pelo limite de 4,5 MB da Function.
- Tokens de upload com validade curta, tipos permitidos e limite de tamanho individual, com reserva atômica do limite total de 17 MiB por lote e endereço IP.
- Sessão temporária assinada e validação de origem para a autorização de upload.
- Limitação de frequência por IP usando o Upstash Redis já utilizado pelo projeto.
- Anexos recebidos pelo SMTP como anexos de e-mail; os documentos não são disponibilizados por URL pública.
- Exclusão dos anexos depois da tentativa de envio e expiração automática em um dia para uploads abandonados.
- O remetente usa `secretaria@clinicadivertin.com.br`; as respostas devem usar o endereço do remetente do formulário (`Reply-To`).
- A fila offline continua guardando os arquivos no IndexedDB e enviando quando a conexão volta. Registros antigos com o campo `curriculo` continuam compatíveis.
