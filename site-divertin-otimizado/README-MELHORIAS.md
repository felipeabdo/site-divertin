# Divertin — otimizações de desempenho

## O que foi alterado

- Fundos dos cabeçalhos que usam `/bg-hero.png` passaram de `background-image` CSS para `next/image`, com carregamento prioritário e tamanho responsivo. Isso permite que o Next.js entregue variantes menores para telas menores.
- Imagens de cartões de especialidades, galeria da clínica e cartões da equipe passaram para `next/image`, com `sizes` para o navegador selecionar uma variante adequada ao espaço exibido.
- Imagens abaixo da primeira dobra e o mascote decorativo usam carregamento adiado e decodificação assíncrona quando continuam sendo imagens HTML comuns.
- O pré-carregamento do GIF de descanso foi adiado de 2 para 12 segundos após o `load`, reduzindo a concorrência com os recursos iniciais. O recurso de descanso e o tempo de inatividade de 30 segundos foram mantidos.
- As descrições de metadados gerais foram ajustadas para representar melhor os serviços da clínica.
- Removido um caractere `?` solto no componente da página “Quem Somos”.
- Texto alternativo das setas decorativas dos botões foi removido para evitar que leitores de tela anunciem ícones redundantes.

## Como aplicar

O ZIP contém a pasta `src/` revisada. Faça uma cópia de segurança do projeto e substitua a pasta `src/` existente pela pasta `src/` deste arquivo. Mantenha as demais pastas e arquivos do seu projeto original.

## Limites do material recebido

O ZIP original continha somente `src/`. Não vieram `package.json`, arquivo de lock, configuração do Next.js, `public/` ou os arquivos de imagem originais. Por isso:

- não foi possível executar `next build`, testar no navegador local ou medir uma nova pontuação do Lighthouse;
- não foi possível reduzir fisicamente o tamanho dos arquivos originais da pasta `public/`;
- as otimizações que usam `next/image` pressupõem que as imagens citadas existam na pasta `public/` do projeto real e que a configuração atual do Next.js permita a otimização de imagens.

O arquivo de relatório visual recebido tinha apenas 140 px de largura; os números e mensagens individuais não ficaram legíveis. Não foram presumidas pontuações ou ganhos numéricos.

## Verificação realizada

Os 44 arquivos TypeScript/TSX da pasta `src/` foram transpilados individualmente para detectar erros sintáticos. Essa verificação passou, mas não substitui a compilação completa do projeto.

## Após aplicar

Na pasta principal do projeto, execute `npm run build`. Depois teste as rotas `/`, `/quem-somos`, `/servicos`, `/servicos/fonoaudiologia-infantil`, `/servicos/pediatria` e `/contato`, tanto em celular como em desktop. Por fim, rode novamente o mesmo teste de desempenho usado originalmente para comparar os resultados sob as mesmas condições.
