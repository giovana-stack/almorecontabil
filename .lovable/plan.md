## Objetivo
Eliminar a linha visível de corte entre o fundo Bordeaux e a foto do executivo no hero, tornando a transição realmente imperceptível.

## Diagnóstico
Hoje a foto ocupa metade direita exata (`w-1/2`) e o blend é feito apenas por um único gradiente de 220px na borda esquerda. Isso ainda deixa uma "costura" visível porque:
1. O gradiente é curto demais para a escala da tela.
2. Só existe fade horizontal — topo e base da foto continuam com borda dura quando há diferença de luminância.
3. A foto começa em um ponto fixo, sem sangrar para dentro da área de texto.

## Mudanças propostas no `<Hero>` (src/routes/index.tsx)

1. **Expandir a área da foto para criar sangria**
   - Trocar `w-1/2` por algo como `w-[62%]` para que a foto comece bem antes, dando mais espaço para o gradiente dissolver sem encostar no texto.

2. **Gradiente horizontal muito mais largo e em múltiplas paradas**
   - Substituir o div de 220px por um gradiente que cobre ~55% da largura da foto:
     ```
     width: 55%
     background: linear-gradient(to right,
       #7C1638 0%,
       rgba(124,22,56,0.95) 25%,
       rgba(124,22,56,0.6) 60%,
       rgba(124,22,56,0) 100%)
     ```
   - Paradas intermediárias suavizam a curva e evitam a "linha" que aparece quando o alpha cai linearmente.

3. **Vinheta sutil no topo e na base**
   - Adicionar um segundo overlay com gradiente vertical leve (`linear-gradient(to bottom, rgba(124,22,56,0.35) 0%, transparent 20%, transparent 80%, rgba(124,22,56,0.35) 100%)`) para que as bordas superior/inferior da foto também se fundam ao fundo.

4. **Reforço do tom da foto**
   - Aumentar o overlay multiply existente de `opacity: 0.55` para `0.7` e reduzir `brightness` de `0.55` para `0.45`, igualando melhor o tom da imagem ao Bordeaux base — quando os tons coincidem, o olho não detecta a borda.

5. **Leve blur na borda esquerda da foto** (opcional, refinamento)
   - Aplicar `mask-image: linear-gradient(to right, transparent 0%, black 35%)` na própria `<img>` para que o pixel da foto desapareça gradualmente — assim o blend não depende só de overlays coloridos por cima.

## Resultado esperado
A foto "emerge" do Bordeaux ao longo de aproximadamente um terço da largura do hero, sem nenhuma borda perceptível nem em x, nem em y. O lado direito mantém a foto nítida; o lado esquerdo se funde completamente ao fundo.

## Fora de escopo
Mobile (foto continua oculta abaixo de `md`), copy, tipografia, demais seções.