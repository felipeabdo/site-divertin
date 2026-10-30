# Avaliações do Google na Home da Divertin

A implementação adiciona uma seção de avaliações antes do footer da Home, com dez avaliações em destaque, nota média, total de avaliações e um modal com a lista completa. O layout usa duas colunas no desktop e uma coluna no celular; o modal ocupa 80% da largura e 80% da altura da tela.

## Como a atualização funciona

A Home **não consulta o Google durante a visita**. Ela lê um snapshot já preparado em um banco Redis, o que evita depender da velocidade ou disponibilidade do Google para abrir a página. Um Cron Job da Vercel chama a rota de sincronização diariamente, programado para a janela das 06h de Brasília (09h UTC), e atualiza o snapshot em segundo plano. No plano Hobby, a Vercel pode executar em qualquer minuto dentro dessa hora. A sincronização pode ser executada manualmente pela mesma rota.

As avaliações são solicitadas ao Google Business Profile API com `orderBy=rating desc`; as dez primeiras retornadas são as que aparecem na Home. O modal recebe a lista completa obtida pela paginação da API. A nota geral e a quantidade total vêm da resposta do próprio Google.

**Não há avaliações fictícias ou textos fixos no código.** Até a integração ser autorizada e o primeiro snapshot ser criado, a seção exibe uma mensagem de configuração e um link para a página do Google.

## O que é necessário configurar

A integração usa o Google Business Profile API, não a API pública Places. O Places API público retorna no máximo cinco avaliações por estabelecimento, enquanto o endpoint de reviews do Business Profile permite paginação (até 50 por página) e fornece a nota média e a contagem total.

Para usar o Business Profile API:

1. A conta Google usada precisa ser proprietária ou administradora do Perfil da Empresa da Clínica Divertin, e o perfil precisa estar verificado.
2. Crie um projeto no Google Cloud e solicite acesso às APIs do Business Profile. O Google informa como pré-requisitos um perfil verificado e ativo há mais de 60 dias e um site associado ao perfil. A liberação é feita pelo Google; ter uma chave de API, por si só, não libera esse acesso.
3. Depois da aprovação, habilite a **Google My Business API** e as APIs de gerenciamento de conta e informações da empresa necessárias no projeto.
4. Crie credenciais OAuth 2.0 e obtenha um `refresh_token` com o escopo `https://www.googleapis.com/auth/business.manage`, autorizando a conta que administra a clínica.
5. Obtenha o ID da conta e o ID da localização do Business Profile. **Eles não são o Place ID do Google Maps** (`ChIJ...`) e não devem ser substituídos por ele.
6. Crie um banco Redis no Upstash e configure as variáveis abaixo na Vercel, em todas as instâncias/ambientes que serão usados.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` no desenvolvimento local e preencha os valores. Na Vercel, cadastre os mesmos nomes em **Project → Settings → Environment Variables**.

- `GOOGLE_CLIENT_ID`: ID do cliente OAuth 2.0.
- `GOOGLE_CLIENT_SECRET`: segredo do cliente OAuth 2.0.
- `GOOGLE_REFRESH_TOKEN`: token de atualização OAuth da conta autorizada.
- `GOOGLE_BUSINESS_ACCOUNT_ID`: ID da conta do Business Profile.
- `GOOGLE_BUSINESS_LOCATION_ID`: ID da localização da Clínica Divertin dentro dessa conta.
- `UPSTASH_REDIS_REST_URL`: URL REST do banco Upstash Redis.
- `UPSTASH_REDIS_REST_TOKEN`: token REST do banco Upstash Redis.
- `CRON_SECRET`: segredo aleatório forte usado para proteger a rota de sincronização.

Não coloque esses segredos em variáveis `NEXT_PUBLIC_*`, no Git ou no código do navegador.

## Primeira sincronização

Depois de preencher as variáveis e fazer o deploy, execute uma vez a rota protegida para criar o primeiro snapshot:

```bash
curl -H "Authorization: Bearer SEU_CRON_SECRET" \
  https://SEU-DOMINIO/api/google-reviews/sync
```

A resposta informa quantas avaliações foram obtidas. Depois disso, a Home já poderá renderizar os dados do cache. A Vercel executará as próximas atualizações automaticamente pelo `vercel.json`.

## Cache e política do Google

O snapshot fica no Upstash Redis com expiração de 30 dias e é substituído a cada sincronização. O código mantém a ordem fornecida pela API e não cria uma nota própria nem altera o conteúdo dos depoimentos. O cache é usado somente para acelerar a exibição no site.

As políticas do Business Profile API limitam o armazenamento de conteúdo: ele deve ser seguro, temporário (no máximo 30 dias) e restrito ao necessário para melhorar o desempenho. Confira as políticas oficiais antes de colocar a integração em produção e mantenha as credenciais sob controle da clínica.

## Frequência

O `vercel.json` incluído agenda uma sincronização diária, compatível com o limite do plano Hobby da Vercel. No Hobby, a Vercel limita a execução a uma vez por dia e pode variar o minuto dentro da hora programada. Em um plano que aceite execuções mais frequentes, a expressão cron pode ser alterada para `0 */6 * * *` (a cada seis horas), mantendo a leitura da Home independente da sincronização.

## Arquivos adicionados/alterados

- `src/app/page.tsx`: inclui a nova seção antes do footer.
- `src/components/home/ReviewsSection.tsx`: seção visual e leitura do snapshot no servidor.
- `src/components/home/ReviewsInteractive.tsx`: cards, link do Google e modal acessível.
- `src/lib/googleReviews.ts`: leitura e gravação do cache.
- `src/app/api/google-reviews/sync/route.ts`: sincronização autenticada com o Google Business Profile API.
- `vercel.json`: agendamento diário da sincronização.
