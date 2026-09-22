/**
 * Gravação dos leads do formulário da home.
 *
 * Projeto: "LP Almore Formulario" (ffdbojtidzmoklcpvnsz), o mesmo do funil da
 * LP do vídeo — um projeto da Almore, que a Giovana abre e exporta sozinha.
 *
 * Antes isto gravava no Lovable Cloud (rhmavthytnjuoqjafcid), um projeto sob a
 * organização do Lovable ao qual ela não tem acesso: os leads entravam e
 * ficavam inalcançáveis. Por isso a mudança.
 *
 * Tabela `site_leads`, separada da `leads` do funil de propósito — schemas e
 * modelos de escrita diferentes. Ver o comentário da migration.
 */

export const SUPABASE_URL = "https://ffdbojtidzmoklcpvnsz.supabase.co";

/** Chave pública: vai no bundle do site por definição, não é segredo. */
export const SUPABASE_PUBLISHABLE = "sb_publishable__LklhoT23NAzaPHjb5mZWQ_aE3DHG7F";

const REST_SITE_LEADS = `${SUPABASE_URL}/rest/v1/site_leads`;

const cabecalhos = {
  apikey: SUPABASE_PUBLISHABLE,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE}`,
  "Content-Type": "application/json",
};

export type SiteLead = {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  expectativas: string[];
};

/**
 * Insere o lead. Devolve `null` em caso de sucesso ou uma mensagem de erro.
 *
 * A tabela não tem policy de SELECT, então a resposta vem vazia mesmo quando
 * grava — o que importa é o status. Nada de `Prefer: return=representation`
 * aqui: pedir o registro de volta faria a chamada falhar por falta de leitura.
 */
export async function salvarSiteLead(lead: SiteLead): Promise<string | null> {
  try {
    const resposta = await fetch(REST_SITE_LEADS, {
      method: "POST",
      headers: cabecalhos,
      body: JSON.stringify(lead),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text().catch(() => "");
      return `HTTP ${resposta.status}${corpo ? ` — ${corpo.slice(0, 200)}` : ""}`;
    }

    return null;
  } catch (erro) {
    return erro instanceof Error ? erro.message : "falha de rede";
  }
}
