## Diagnóstico

O flash de Montserrat acontece porque:

1. Em `src/styles.css`, cada `@font-face` está com `font-display: swap`. Isso instrui o navegador a renderizar **imediatamente** o texto usando o próximo fallback da pilha (`"Manual", "Montserrat", sans-serif` e `"Volte", "Inter", sans-serif`) enquanto a fonte real ainda está carregando, e depois trocar (FOUT — Flash of Unstyled Text).
2. As fontes Manual e Volte são `.ttf/.otf` servidas via CDN externa, então levam algumas centenas de ms para chegar — tempo suficiente para o usuário ver Montserrat.
3. Não existe `<link rel="preload">` para essas fontes no `__root.tsx`, então o navegador só descobre os arquivos depois de baixar e processar o CSS.

## Correção

1. **`src/routes/__root.tsx`** — Adicionar `<link rel="preload" as="font" type="font/...">` para os arquivos críticos (Manual Regular, Volte Medium 500 e Volte Bold 700) com `crossorigin="anonymous"`, dentro do `head()` do `__root`. Isso faz o navegador baixar essas fontes em paralelo com o CSS.
2. **`src/styles.css`** — Trocar `font-display: swap` por `font-display: block` nas declarações `@font-face` de Manual e dos pesos principais de Volte (400/500/700). `block` mantém o texto invisível por até ~3s aguardando a fonte real, eliminando o flash da Montserrat. Como o preload faz a fonte chegar em <300ms na maioria dos casos, o usuário não percebe atraso — apenas vê o texto já renderizado na fonte correta.
3. Remover `"Montserrat"` e `"Inter"` da pilha de fallback das variáveis `--font-display` e `--font-sans` (deixando apenas `sans-serif`), para garantir que, em qualquer cenário de fallback extremo, não apareça Montserrat — apenas a sans-serif do sistema, que é visualmente mais neutra.