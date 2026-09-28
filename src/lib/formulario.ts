/**
 * Destino dos CTAs da home.
 *
 * O formulário vive em outro domínio, então o rastreamento não atravessa
 * sozinho: o que liga uma coisa à outra são os parâmetros na URL.
 *
 * Por isso este módulo não devolve uma URL fixa. Ele REPASSA o que veio na
 * URL da home — gclid, utm_source, utm_campaign e afins — para o formulário.
 * Sem isso, quem chega por um anúncio e clica no botão aparece no formulário
 * como se tivesse vindo do site, e a campanha perde a conversão.
 *
 * Quando não há nada de anúncio na URL (tráfego direto, orgânico, indicação),
 * marca como origem o próprio site, para esse tráfego não se misturar com o
 * pago.
 */

import { useEffect, useState } from "react";

export const URL_FORMULARIO = "https://form.almorecontabilidade.com.br/formulario";

/**
 * Identificadores de clique dos anúncios. Não são UTM, mas são o que as
 * plataformas realmente usam para casar clique com conversão, então precisam
 * atravessar junto.
 */
const IDS_DE_CLIQUE = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"];

/** Qual botão da home originou o clique. Vira utm_content. */
export type OrigemCta = "hero" | "plano-bronze" | "plano-prata" | "plano-ouro" | "contato";

/**
 * Monta a URL do formulário a partir dos parâmetros da página atual.
 * `busca` é o location.search — recebido como argumento para a função poder
 * ser testada e para não quebrar na renderização no servidor.
 */
export function linkFormulario(origem: OrigemCta, busca: string): string {
  const atual = new URLSearchParams(busca);
  const destino = new URL(URL_FORMULARIO);

  let veioDeAnuncio = false;

  for (const [chave, valor] of atual.entries()) {
    const k = chave.toLowerCase();
    if (k.startsWith("utm_") || IDS_DE_CLIQUE.includes(k)) {
      destino.searchParams.set(chave, valor);
      veioDeAnuncio = true;
    }
  }

  if (!veioDeAnuncio) {
    destino.searchParams.set("utm_source", "site");
    destino.searchParams.set("utm_medium", "cta");
    destino.searchParams.set("utm_campaign", "home");
  }

  // Sempre por último: diz QUAL botão foi clicado, mesmo quando os demais
  // parâmetros vieram do anúncio.
  destino.searchParams.set("utm_content", origem);

  return destino.toString();
}

/**
 * Versão para usar nos componentes.
 *
 * No servidor não existe `location`, então a primeira renderização usa a URL
 * sem parâmetros e a hidratação a substitui pela versão completa. O botão
 * funciona nos dois momentos: o que muda é só o rastreamento.
 */
export function useLinkFormulario(origem: OrigemCta): string {
  const [href, setHref] = useState(() => linkFormulario(origem, ""));

  useEffect(() => {
    setHref(linkFormulario(origem, window.location.search));
  }, [origem]);

  return href;
}
