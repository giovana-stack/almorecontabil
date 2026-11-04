import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteNavbar } from "@/components/SiteNavbar";
import { SITE_URL } from "@/lib/blog";
import logoWhite from "@/assets/almore-logo-white.png.asset.json";

/**
 * /politica-de-privacidade — Política de Privacidade (LGPD).
 *
 * Formato de documento, no padrão da política da V4 Company: título, linha de
 * versão, timbre da empresa, seções numeradas curtas e tabelas discretas.
 *
 * Vale para os dois domínios da Almore: este site (home, blog, contas e
 * comentários) e o formulário em form.almorecontabilidade.com.br, que linka
 * para cá. Se o que um dos dois coleta mudar, esta página muda junto.
 */

const CONTATO_LGPD = "admin@almorecontabilidade.com.br";
const VERSAO = "Versão 1.1 · Novembro/2026";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Almore Inteligência Contábil" },
      {
        name: "description",
        content:
          "Como a Almore Inteligência Contábil coleta, usa, guarda e protege dados pessoais, conforme a LGPD (Lei nº 13.709/2018).",
      },
      { property: "og:title", content: "Política de Privacidade — Almore Inteligência Contábil" },
      { property: "og:url", content: `${SITE_URL}/politica-de-privacidade` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/politica-de-privacidade` }],
  }),
  component: PoliticaPrivacidade,
});

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display font-extrabold text-ink text-base">{titulo}</h2>
      <div className="flex flex-col gap-3 text-base leading-8 text-gray-deep [&_strong]:font-bold [&_strong]:text-ink [&_a]:text-[#7C1638] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:marker:text-gray-mid">
        {children}
      </div>
    </section>
  );
}

function Tabela({ colunas, linhas }: { colunas: [string, string]; linhas: [ReactNode, ReactNode][] }) {
  return (
    <div className="mt-1 overflow-x-auto">
      <table className="w-full border-collapse border border-[#ebebeb] text-[15px] leading-6 text-left">
        <thead>
          <tr className="bg-[#f5f5f5]">
            {colunas.map((c) => (
              <th key={c} scope="col" className="border border-[#ebebeb] px-3.5 py-2.5 font-bold text-ink">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map(([a, b], i) => (
            <tr key={i} className="align-top">
              <td className="border border-[#ebebeb] px-3.5 py-2.5 font-semibold text-ink w-[38%]">{a}</td>
              <td className="border border-[#ebebeb] px-3.5 py-2.5 text-gray-deep">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PoliticaPrivacidade() {
  const email = <a href={`mailto:${CONTATO_LGPD}`}>{CONTATO_LGPD}</a>;

  return (
    <div className="bg-background text-foreground">
      <SiteNavbar />

      <main className="bg-white px-5 sm:px-7 pt-12 pb-20 sm:pt-16">
        <article className="mx-auto max-w-[900px] flex flex-col gap-12">
          <header className="flex flex-col gap-2">
            <h1 className="font-display font-bold text-ink text-[28px] sm:text-[36px] leading-tight">
              Política de Privacidade e Proteção de Dados Pessoais
            </h1>
            <p className="text-gray-mid text-sm sm:text-base uppercase tracking-[2px] leading-8">{VERSAO}</p>
            <p className="text-gray-deep text-base leading-7">
              <strong className="text-ink">ALMORE INTELIGÊNCIA CONTÁBIL</strong> · CNPJ 67.132.226/0001-17
              <br />
              Rua Benedita Nogueira, 425 — Centro — Araras/SP
            </p>
          </header>

          <Secao titulo="1. Objetivo">
            <p>
              Esta Política explica, de forma clara, quais dados pessoais a <strong>Almore</strong> trata,
              para quê, com quem compartilha e como você exerce seus direitos, conforme a Lei Geral de
              Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </Secao>

          <Secao titulo="2. Abrangência">
            <p>
              Vale para quem usa o site <a href={SITE_URL}>almorecontabilidade.com.br</a> (incluindo o
              blog), o formulário em <strong>form.almorecontabilidade.com.br</strong>, nossos canais de
              atendimento (WhatsApp, telefone e e-mail) e para nossos clientes. Nesses casos a Almore é a{" "}
              <strong>Controladora</strong>. Quando tratamos dados de funcionários ou sócios em nome de um
              cliente (como na folha de pagamento), somos <strong>Operadora</strong> e seguimos as
              instruções dele.
            </p>
          </Secao>

          <Secao titulo="3. Dados coletados e finalidades">
            <p>
              <strong>3.1 Categorias de dados</strong>
            </p>
            <Tabela
              colunas={["Titular", "Exemplos de dados"]}
              linhas={[
                ["Visitantes do site", "IP, dispositivo, páginas visitadas, origem da visita (UTM) e cookies."],
                ["Usuários do blog", "Nome, e-mail, senha (criptografada) e comentários publicados."],
                [
                  "Interessados (formulário)",
                  "Nome, WhatsApp, e-mail e respostas do diagnóstico (regime, faturamento, funcionários etc.).",
                ],
                [
                  "Clientes e representantes",
                  "Dados cadastrais, CPF, dados dos sócios, documentos societários, fiscais e bancários.",
                ],
                [
                  "Funcionários dos clientes",
                  "Dados exigidos pela legislação trabalhista e previdenciária (folha e eSocial).",
                ],
              ]}
            />
            <p className="mt-3">
              <strong>3.2 Finalidades e bases legais</strong>
            </p>
            <Tabela
              colunas={["Finalidade", "Base legal (LGPD)"]}
              linhas={[
                ["Atender seu pedido, fazer o diagnóstico e enviar proposta", "Procedimentos preliminares a contrato (art. 7º, V)"],
                ["Contato por WhatsApp e ligação", "Consentimento (art. 7º, I)"],
                ["Prestar os serviços contratados e manter a conta do blog", "Execução de contrato (art. 7º, V)"],
                ["Entregar obrigações fiscais, trabalhistas e contábeis", "Obrigação legal ou regulatória (art. 7º, II)"],
                ["Medir anúncios e melhorar o site", "Legítimo interesse (art. 7º, IX)"],
                ["Defesa em processos e fiscalizações", "Exercício regular de direitos (art. 7º, VI)"],
              ]}
            />
            <p className="mt-3">
              Usamos cookies essenciais (login e origem da visita) e de medição (Google Ads e Pixel do
              Meta). Você pode bloqueá-los no navegador.
            </p>
          </Secao>

          <Secao titulo="4. Compartilhamento">
            <p>
              <strong>A Almore não vende dados pessoais.</strong> Compartilhamos só o necessário com:
            </p>
            <ul>
              <li>fornecedores de tecnologia (hospedagem, CRM, WhatsApp, e-mail e sistemas contábeis);</li>
              <li>Google e Meta, para medição de anúncios;</li>
              <li>órgãos públicos (Receita, eSocial, prefeituras, Juntas Comerciais) quando o serviço ou a lei exigir;</li>
              <li>autoridades, por ordem judicial ou requisição legal.</li>
            </ul>
          </Secao>

          <Secao titulo="5. Transferência internacional">
            <p>
              Alguns fornecedores (Google, Meta/WhatsApp e serviços de nuvem) processam dados fora do
              Brasil. Nesses casos seguimos o art. 33 da LGPD, com fornecedores que garantem proteção
              adequada.
            </p>
          </Secao>

          <Secao titulo="6. Atendimento automatizado">
            <p>
              O primeiro contato após o formulário pode ser feito pelo <strong>Adriano</strong>, nosso
              atendente virtual. As mensagens automáticas são identificadas, você pode pedir atendimento
              humano a qualquer momento e pode solicitar revisão de decisões automatizadas (art. 20).
            </p>
          </Secao>

          <Secao titulo="7. Retenção">
            <p>
              Dados de interessados sem contrato ficam guardados por até <strong>24 meses</strong>.
              Documentos contábeis, fiscais e trabalhistas seguem o <strong>prazo legal</strong> (em regra,
              no mínimo 5 anos). Depois disso, são eliminados ou anonimizados.
            </p>
          </Secao>

          <Secao titulo="8. Direitos dos titulares">
            <p>Pelo art. 18 da LGPD, você pode, a qualquer momento:</p>
            <ul>
              <li>confirmar se tratamos seus dados e acessá-los;</li>
              <li>corrigir dados incompletos ou desatualizados;</li>
              <li>pedir anonimização, bloqueio, eliminação ou portabilidade;</li>
              <li>saber com quem compartilhamos seus dados;</li>
              <li>revogar o consentimento.</li>
            </ul>
            <p>
              As solicitações são atendidas pelo e-mail {email}. Dados que a lei obriga a guardar só são
              eliminados após o prazo legal.
            </p>
          </Secao>

          <Secao titulo="9. Segurança e incidentes">
            <p>
              Adotamos medidas técnicas e administrativas de segurança (art. 46), como conexão
              criptografada, senhas criptografadas e controle de acesso. Em caso de incidente com risco
              relevante, comunicaremos a ANPD e os titulares afetados.
            </p>
          </Secao>

          <Secao titulo="10. Canal de contato">
            <Tabela
              colunas={["Canal", "Contato"]}
              linhas={[
                ["E-mail", email],
                ["Endereço", "Rua Benedita Nogueira, 425 — Centro — Araras/SP"],
              ]}
            />
          </Secao>

          <Secao titulo="11. Disposições gerais">
            <p>
              Esta Política pode ser atualizada a qualquer momento; a versão vigente fica sempre nesta
              página. É regida pela legislação brasileira, com foro na Comarca de Araras/SP.
            </p>
          </Secao>

          <div className="border-t border-[#ebebeb] pt-6 text-center text-sm text-gray-mid leading-7">
            <p className="font-semibold text-ink">Almore Inteligência Contábil · Política de Privacidade</p>
            <p>{VERSAO}</p>
          </div>
        </article>
      </main>

      <footer className="px-5 py-14" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="mx-auto max-w-6xl text-center">
          <img src={logoWhite.url} alt="Almore Inteligência Contábil" className="h-10 w-auto mx-auto opacity-90" />
          <p className="mt-5 text-[#8a8a8a] text-sm">CNPJ: 67.132.226/0001-17</p>
          <div className="mt-8 mx-auto max-w-md h-px bg-white/15" />
          <p className="mt-6 text-[#7a7a7a] text-sm">
            © 2026 Almore Inteligência Contábil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
