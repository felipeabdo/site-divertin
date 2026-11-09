# Experiência offline — Clínica Divertin

## Arquivos incluídos

- `src/components/offline/OfflineExperience.tsx`: detecção de conexão, telas de offline/reconexão com vidro translúcido sobre a página atual, indicador persistente entre navegações da mesma aba e fila de formulários.
- `src/app/globals.css`: composição responsiva em tela inteira das experiências de offline e reconexão, sem cartões, com ajustes para telas estreitas, retrato e paisagem.
- `src/lib/offlineQueue.ts`: armazenamento por sessão da aba via IndexedDB, incluindo anexos, e rotina de reenvio.
- `src/lib/offlineConfig.ts`: tempos ajustáveis da experiência.
- `src/app/api/health/route.ts`: verificação real de comunicação com o servidor.
- `public/sw.js`: service worker que armazena páginas e recursos para navegação offline.
- `public/mascote-offline-glass.webp` e `public/mascote-online-glass.webp`: ilustrações recortadas com fundo transparente para compor as duas telas sem formar cartões. Os arquivos originais do mascote também foram mantidos no pacote.
- `public/offline-fallback.html`: alternativa simples caso uma rota ainda não esteja em cache.

## Como aplicar ao projeto completo

1. Copie a pasta `src` deste pacote para a raiz do projeto, mesclando/substituindo os arquivos correspondentes.
2. Copie o conteúdo da pasta `public` deste pacote para a pasta `public` do projeto (sem apagar os demais assets que já existem no site).
3. Publique o site em HTTPS. O service worker é registrado automaticamente e começa a armazenar as rotas principais quando o navegador está online.
4. Faça uma primeira visita online às páginas e especialidades para que o navegador também armazene os arquivos estáticos e o conteúdo de navegação correspondente.

O pacote enviado para esta alteração continha somente `src/`; por isso, o `package.json`, `tsconfig.json`, configurações de deploy e os demais arquivos/recursos `public` originais não foram modificados nem puderam ser usados em um build completo.

## Ajustes

Edite `src/lib/offlineConfig.ts`:

- `reconnectionScreenDurationMs`: duração da tela de reconexão (padrão: `2800`, ou 2,8 segundos).
- `connectivityCheckIntervalMs`: intervalo entre verificações complementares de conexão (padrão: 15 segundos). O evento nativo `offline` é tratado imediatamente.
- `connectivityTimeoutMs`: tempo máximo de espera pela verificação (padrão: 5 segundos).

Ao adicionar ou remover páginas, atualize a lista `CORE_URLS` em `public/sw.js`. As páginas principais e as duas especialidades atuais já estão listadas.

## Limites importantes do envio de formulários

A fila guarda os campos e o arquivo anexado no IndexedDB, vinculados à sessão daquela aba. Assim, ela sobrevive à navegação interna e a recarregamentos da mesma aba, mas não é recuperada em uma nova sessão/aba. O aviso orienta a pessoa a manter a aba aberta.

**O endpoint de contato deste projeto ainda não envia e-mails.** Antes desta alteração, `src/app/api/contato/route.ts` já terminava com HTTP `501` e não havia integração com provedor de e-mail. O código agora recebe `FormData` corretamente, valida os campos/anexo e mantém os envios pendentes na fila quando o servidor responde que o envio não está implementado. Quando um provedor de e-mail for configurado nesse endpoint, o reenvio automático poderá concluir os envios. Até lá, o site não afirma falsamente que uma mensagem foi entregue.

## Navegação offline

As rotas principais e as páginas de Fonoaudiologia Infantil e Pediatria são pré-armazenadas durante a instalação do service worker. Outras páginas e recursos são armazenados conforme são visitados/carregados online. Recursos externos (WhatsApp, e-mail, mapas e outros sites) continuam dependendo de internet.

## Aparência da experiência de conexão

As telas de offline e de reconexão usam um vidro translúcido aplicado diretamente sobre a página atual. O desfoque é intencionalmente moderado (9px em telas maiores e 7px em telas menores), com baixa opacidade para que a estrutura e as cores da página continuem perceptíveis. As composições ocupam o viewport inteiro e reorganizam arte e texto conforme orientação e proporção da tela, sem cartões centrais. Ao fechar o aviso inicial de offline, a escolha fica registrada em `sessionStorage` até a conexão ser restabelecida; durante a navegação offline, permanece apenas o indicador compacto no canto inferior esquerdo.
