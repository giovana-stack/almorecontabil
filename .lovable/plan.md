Plano para suavizar o canto inferior esquerdo da foto no hero:

1. Ajustar somente o bloco da imagem do hero em `src/routes/index.tsx`.
2. Manter a foto atual do executivo e todo o layout/textos intactos.
3. Reforçar o fade no canto inferior esquerdo adicionando uma máscara combinada no próprio container/imagem:
   - fade horizontal mais longo a partir da esquerda;
   - fade vertical mais forte a partir da base;
   - sobreposição radial/linear bordeaux no canto inferior esquerdo para dissolver a quina da foto no fundo.
4. Expandir levemente a área de transição para que a imagem não tenha uma borda perceptível no rodapé.
5. Preservar cores, espaçamentos gerais e hierarquia do hero; alterar apenas a composição visual da transição imagem/fundo.