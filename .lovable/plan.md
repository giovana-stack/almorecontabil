## Diagnóstico

A demora no aparecimento dos textos vem da combinação de três fatores no sistema de animação `reveal`:

1. **Transição longa** — `src/styles.css` define `transition: ... 0.7s ease-out` para `.reveal`. 700ms é perceptivelmente lento, especialmente somado ao delay do observer.
2. **Threshold alto** — `IntersectionObserver` em `src/routes/index.tsx` usa `threshold: 0.12`, ou seja, o elemento só anima quando 12% dele está visível. Em blocos grandes (hero, cards), isso atrasa o disparo.
3. **Atraso de hidratação** — Os elementos nascem com `opacity: 0` no HTML. Como o `useReveal` roda dentro de `useEffect` (só após hidratação do React), há um gap entre o paint inicial e o momento em que o observer começa a marcar elementos como `is-visible`. Em conexões/CPUs mais lentas isso é visível como “tela em branco de texto”.

## Correção proposta

1. Em `src/styles.css`: reduzir a duração da transição de `0.7s` para `0.4s` (ease-out continua).
2. Em `src/routes/index.tsx` (`useReveal`):
   - Baixar `threshold` para `0` e adicionar `rootMargin: "0px 0px -10% 0px"` para disparar antes.
   - Fazer uma primeira passada síncrona dentro do `useEffect` que marca como `is-visible` todos os elementos que já estão dentro do viewport no momento da hidratação (assim o hero e a primeira dobra revelam imediatamente, sem esperar o ciclo do IntersectionObserver).

Resultado esperado: hero e textos da primeira dobra aparecem praticamente instantâneos após o carregamento; os demais blocos continuam com fade suave ao entrar em tela, mas bem mais ágil (400ms).