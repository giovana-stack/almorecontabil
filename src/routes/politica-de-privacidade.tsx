import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteNavbar } from "@/components/SiteNavbar";
import { SITE_URL } from "@/lib/blog";
import logoWhite from "@/assets/almore-logo-white.png.asset.json";

/**
 * /politica-de-privacidade — Política de Privacidade (LGPD).
 *
 * Uma política só para os dois domínios da Almore: este site (home, blog,
 * contas e comentários) e o formulário em form.almorecontabilidade.com.br,
 * que linka para cá. Se o que um dos dois coleta mudar, esta página muda
 * junto.
 *
 * Indexável de propósito: é a página que o Google Ads e o Meta conferem ao
 * revisar anúncios de captação de lead.
 */

const EMPRESA = {
  razao: "Almore Inteligência Contábil",
  cnpj: "67.132.226/0001-17",
  endereco: "Rua Benedita Nogueira, 425 · Centro · Araras/SP",
};

const CONTATO_LGPD = "admin@almorecontabilidade.com.br";
const VERSAO = "Versão 1.0 · Última atualização: novembro/2026";

const SECOES = [
  ["objetivo", "Objetivo"],
  ["abrangencia", "A quem se aplica"],
  ["definicoes", "Definições"],
  ["dados", "Dados que coletamos"],
  ["finalidades", "Para que usamos e base legal"],
  ["cookies", "Cookies e rastreamento"],
  ["atendimento", "Atendimento automatizado"],
  ["compartilhamento", "Compartilhamento"],
  ["internacional", "Transferência internacional"],
  ["retencao", "Por quanto tempo guardamos"],
  ["direitos", "Seus direitos"],
  ["seguranca", "Segurança e incidentes"],
  ["contato", "Canal de contato"],
  ["gerais", "Disposições gerais"],
] as const;

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

function Secao({ id, n, titulo, children }: { id: string; n: number; titulo: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[#e8e4df] pt-10 mt-10">
      <h2 className="font-display font-bold text-ink text-[24px] sm:text-[28px] leading-tight tracking-tight mb-5">
        <span className="text-[#7C1638]">{n}.</span> {titulo}
      </h2>
      <div className="space-y-4 text-[17px] leading-[1.75] text-gray-deep [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-[#7C1638] [&_a]:underline">
        {children}
      </div>
    </section>
  );
}

function Lista({ itens }: { itens: ReactNode[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 marker:text-[#7C1638]">
      {itens.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Tabela({ cabecalho, linhas }: { cabecalho?: [string, string]; linhas: [ReactNode, ReactNode][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e8e4df]">
      <table className="w-full text-[15px] leading-[1.55] text-left">
        {cabecalho ? (
          <thead>
            <tr className="text-white" style={{ backgroundColor: "#7C1638" }}>
              <th scope="col" className="px-4 py-3 font-display font-semibold">{cabecalho[0]}</th>
              <th scope="col" className="px-4 py-3 font-display font-semibold">{cabecalho[1]}</th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {linhas.map(([a, b], i) => (
            <tr key={i} className="border-t border-[#e8e4df] first:border-t-0 even:bg-surface align-top">
              <th scope="row" className="px-4 py-3 font-semibold text-ink w-[34%]">{a}</th>
              <td className="px-4 py-3 text-gray-deep">{b}</td>
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

      <main className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[800px]">
          <header>
            <div className="eyebrow text-gray-deep mb-6">LGPD · LEI Nº 13.709/2018</div>
            <h1 className="font-display font-bold text-ink text-[34px] sm:text-[46px] leading-[1.1] tracking-tight">
              Política de Privacidade e{" "}
              <span className="text-[#7C1638]">Proteção de Dados Pessoais</span>
            </h1>
            <p className="mt-6 text-sm text-gray-mid">{VERSAO}</p>
            <p className="mt-1 text-sm text-gray-mid">
              {EMPRESA.razao} · CNPJ {EMPRESA.cnpj} · {EMPRESA.endereco}
            </p>
          </header>

          <nav aria-label="Sumário" className="mt-10 bg-surface rounded-lg border-l-4 border-[#7C1638] px-6 py-5">
            <div className="eyebrow text-gray-mid mb-3">SUMÁRIO</div>
            <ol className="list-decimal pl-5 sm:columns-2 gap-8 text-[15px] text-ink marker:text-[#7C1638]">
              {SECOES.map(([id, titulo]) => (
                <li key={id} className="py-0.5 break-inside-avoid">
                  <a href={`#${id}`} className="hover:text-[#7C1638] hover:underline">
                    {titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <Secao id="objetivo" n={1} titulo="Objetivo">
            <p>
              Contabilidade é feita de dados — muitos deles pessoais e financeiros. Por isso tratamos
              privacidade como parte do serviço, não como formalidade. Esta Política explica, de forma
              direta:
            </p>
            <Lista
              itens={[
                "quais dados pessoais a Almore coleta e por quê;",
                "com quem eles são compartilhados e por quanto tempo ficam guardados;",
                "quais são os seus direitos e como exercê-los.",
              ]}
            />
          </Secao>

          <Secao id="abrangencia" n={2} titulo="A quem se aplica">
            <p>
              Esta Política vale para quem visita <strong>almorecontabilidade.com.br</strong> (incluindo
              o blog), cria conta ou comenta no blog, preenche nosso formulário de diagnóstico em{" "}
              <strong>form.almorecontabilidade.com.br</strong> ou agenda uma conversa, para clientes e
              seus representantes, e para quem fala com a gente pelo WhatsApp, por ligação, por e-mail
              ou pelas redes sociais oficiais.
            </p>
            <p>
              Nessas situações a Almore é a <strong>Controladora</strong> dos dados. Quando processamos
              dados de funcionários, sócios ou terceiros <em>em nome de um cliente</em> (por exemplo, na
              folha de pagamento), atuamos como <strong>Operadora</strong>, seguindo as instruções do
              cliente e o contrato de prestação de serviços.
            </p>
          </Secao>

          <Secao id="definicoes" n={3} titulo="Definições">
            <Tabela
              cabecalho={["Termo", "O que significa"]}
              linhas={[
                ["Dado pessoal", "Informação que identifica ou pode identificar uma pessoa física."],
                [
                  "Dado pessoal sensível",
                  "Origem racial ou étnica, religião, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico.",
                ],
                ["Titular", "A pessoa física a quem os dados se referem."],
                ["Controlador", "Quem decide como e por que os dados são tratados."],
                ["Operador", "Quem trata os dados em nome do controlador."],
                [
                  "Tratamento",
                  "Qualquer operação com dados: coletar, usar, armazenar, compartilhar, eliminar etc.",
                ],
                ["ANPD", "Autoridade Nacional de Proteção de Dados."],
              ]}
            />
          </Secao>

          <Secao id="dados" n={4} titulo="Dados que coletamos">
            <Tabela
              cabecalho={["Quem", "Quais dados"]}
              linhas={[
                [
                  "Visitantes do site",
                  "Endereço IP, navegador e dispositivo, páginas visitadas, origem da visita (parâmetros de campanha, como UTM e identificadores de clique de anúncios) e cookies.",
                ],
                [
                  "Contas e comentários do blog",
                  "Nome, e-mail, senha (guardada de forma criptografada pelo provedor de autenticação, nunca em texto aberto) e os comentários que você publica.",
                ],
                [
                  "Quem preenche o formulário ou agenda conversa",
                  "Nome, WhatsApp, e-mail e as respostas do diagnóstico: se já tem CNPJ, regime tributário, faixa de faturamento, número de funcionários, contador atual, principal dificuldade, tipo de atividade, urgência, melhor horário e canal de contato preferido.",
                ],
                [
                  "Clientes e representantes",
                  "Dados cadastrais (nome, CPF, RG, endereço, contato), dados dos sócios, documentos societários, informações fiscais, bancárias e contábeis da empresa, certificados e acessos a portais governamentais necessários ao serviço.",
                ],
                [
                  "Funcionários e terceiros dos clientes",
                  "Dados exigidos pela legislação trabalhista e previdenciária para folha, eSocial e obrigações acessórias — o que pode incluir dados sensíveis, como atestados de saúde ou filiação sindical, sempre no limite que a lei exige.",
                ],
              ]}
            />
            <p>
              Não coletamos intencionalmente dados de menores de 18 anos pelo site. Dados de
              dependentes só são tratados quando a lei exige (por exemplo, para dedução de IR ou
              salário-família).
            </p>
          </Secao>

          <Secao id="finalidades" n={5} titulo="Para que usamos e base legal">
            <Tabela
              cabecalho={["Finalidade", "Base legal (LGPD)"]}
              linhas={[
                [
                  "Responder ao seu pedido, fazer o diagnóstico, apresentar proposta e agendar a conversa",
                  "Procedimentos preliminares a contrato (art. 7º, V)",
                ],
                [
                  "Entrar em contato por WhatsApp e ligação",
                  "Consentimento (art. 7º, I), dado na caixa do formulário",
                ],
                ["Criar e manter sua conta no blog e publicar seus comentários", "Execução de contrato (art. 7º, V)"],
                [
                  "Prestar os serviços contratados (contabilidade, fiscal, folha, societário, consultoria)",
                  "Execução de contrato (art. 7º, V)",
                ],
                [
                  "Entregar obrigações fiscais, trabalhistas e previdenciárias e guardar a escrituração",
                  "Obrigação legal ou regulatória (art. 7º, II; art. 11, II, a, para dados sensíveis)",
                ],
                [
                  "Medir campanhas, entender de onde vêm os contatos e melhorar o site",
                  "Legítimo interesse (art. 7º, IX)",
                ],
                [
                  "Defender a Almore ou o cliente em processos e fiscalizações",
                  "Exercício regular de direitos (art. 7º, VI)",
                ],
              ]}
            />
            <p>
              <strong>A Almore não vende dados pessoais</strong> e não usa seus dados para finalidade
              diferente das listadas aqui sem avisar antes.
            </p>
          </Secao>

          <Secao id="cookies" n={6} titulo="Cookies e rastreamento">
            <p>Usamos poucas tecnologias, cada uma com um motivo:</p>
            <Lista
              itens={[
                <>
                  <strong>Essenciais:</strong> manter você conectado à sua conta do blog, guardar a
                  origem da visita e manter o agendamento se você recarregar a página.
                </>,
                <>
                  <strong>Medição de anúncios:</strong> Google Ads e Pixel do Meta, para saber se um
                  anúncio gerou contato e não pagar por clique que não converteu.
                </>,
              ]}
            />
            <p>
              Você pode bloquear ou apagar cookies nas configurações do seu navegador. O site continua
              funcionando — só deixamos de saber de qual anúncio você veio, e você pode precisar entrar
              na conta de novo.
            </p>
          </Secao>

          <Secao id="atendimento" n={7} titulo="Atendimento automatizado">
            <p>
              Depois do formulário, o primeiro contato pode ser feito pelo{" "}
              <strong>Adriano, nosso atendente virtual</strong>, que usa automação para confirmar dados e
              agendar a conversa. As mensagens automatizadas são identificadas como tal, e você pode
              pedir para falar com uma pessoa a qualquer momento.
            </p>
            <p>
              Nenhuma decisão sobre contratação é tomada apenas por automação. Se você entender que
              alguma decisão automatizada afetou seus interesses, pode pedir revisão (art. 20 da LGPD).
            </p>
          </Secao>

          <Secao id="compartilhamento" n={8} titulo="Compartilhamento">
            <p>
              Compartilhamos só o mínimo necessário e com quem tem obrigação contratual de proteger os
              dados:
            </p>
            <Lista
              itens={[
                <>
                  <strong>Fornecedores de tecnologia:</strong> hospedagem e banco de dados, CRM e
                  agenda, WhatsApp, e-mail e sistemas contábeis.
                </>,
                <>
                  <strong>Plataformas de anúncio:</strong> Google e Meta, para medição de campanhas.
                </>,
                <>
                  <strong>Órgãos públicos:</strong> Receita Federal, Secretarias da Fazenda,
                  prefeituras, eSocial, Caixa (FGTS), Juntas Comerciais e demais entes, quando o serviço
                  contratado ou a lei exigir.
                </>,
                <>
                  <strong>Autoridades:</strong> por ordem judicial ou requisição legal, inclusive da
                  ANPD.
                </>,
              ]}
            />
            <p>
              Comentários publicados no blog ficam visíveis para qualquer visitante, junto com o nome
              da conta.
            </p>
          </Secao>

          <Secao id="internacional" n={9} titulo="Transferência internacional">
            <p>
              Alguns fornecedores (como Google, Meta/WhatsApp e serviços de nuvem) podem armazenar ou
              processar dados fora do Brasil. Nesses casos seguimos o art. 33 da LGPD, usando
              fornecedores que oferecem nível de proteção adequado e cláusulas contratuais compatíveis
              com a lei brasileira.
            </p>
          </Secao>

          <Secao id="retencao" n={10} titulo="Por quanto tempo guardamos">
            <Tabela
              cabecalho={["Dado", "Prazo"]}
              linhas={[
                [
                  "Contatos e respostas do formulário (sem contrato)",
                  "Até 24 meses após o último contato, ou antes, se você pedir",
                ],
                ["Conta e comentários do blog", "Enquanto a conta existir, ou até você pedir a exclusão"],
                [
                  "Documentos contábeis, fiscais e societários de clientes",
                  "Pelo prazo legal — em regra, no mínimo 5 anos",
                ],
                [
                  "Documentos trabalhistas e previdenciários",
                  "Pelo prazo exigido pela legislação de cada documento",
                ],
                ["Dados de navegação", "Conforme a política de cada plataforma de medição"],
              ]}
            />
            <p>Terminado o prazo, os dados são eliminados ou anonimizados.</p>
          </Secao>

          <Secao id="direitos" n={11} titulo="Seus direitos">
            <p>Pelo art. 18 da LGPD, você pode, a qualquer momento e sem custo:</p>
            <Lista
              itens={[
                "confirmar se tratamos seus dados e acessá-los;",
                "corrigir dados incompletos, errados ou desatualizados;",
                "pedir anonimização, bloqueio ou eliminação de dados desnecessários;",
                "pedir a portabilidade para outro fornecedor;",
                "saber com quem compartilhamos seus dados;",
                "revogar o consentimento — por exemplo, parar de receber contato pelo WhatsApp.",
              ]}
            />
            <p>
              Basta escrever para {email}. Para proteger você, podemos pedir confirmação de identidade
              antes de atender. Dados que a lei nos obriga a guardar (como a escrituração contábil) não
              podem ser apagados antes do prazo legal. Se não ficar satisfeito com a resposta, você
              também pode procurar a ANPD.
            </p>
          </Secao>

          <Secao id="seguranca" n={12} titulo="Segurança e incidentes">
            <p>
              Adotamos medidas técnicas e administrativas para proteger os dados (art. 46 da LGPD):
              conexão criptografada, senhas guardadas com criptografia, controle de acesso por pessoa e
              por função, acesso apenas ao que cada colaborador precisa e compromisso de sigilo de toda
              a equipe.
            </p>
            <p>
              Se acontecer um incidente que possa trazer risco ou dano relevante, comunicaremos a ANPD e
              os titulares afetados nos prazos da regulamentação, informando o que aconteceu e o que foi
              feito.
            </p>
          </Secao>

          <Secao id="contato" n={13} titulo="Canal de contato">
            <p>
              Para qualquer assunto sobre seus dados pessoais — dúvidas, pedidos ou reclamações — fale
              com o canal de privacidade da Almore:
            </p>
            <Tabela
              linhas={[
                ["E-mail", email],
                ["Endereço", EMPRESA.endereco],
              ]}
            />
          </Secao>

          <Secao id="gerais" n={14} titulo="Disposições gerais">
            <p>
              Esta Política pode ser atualizada a qualquer momento. A versão vigente fica sempre nesta
              página, com a data da última atualização no topo. Ela é regida pela legislação brasileira,
              com foro na Comarca de Araras/SP.
            </p>
          </Secao>
        </div>
      </main>

      <footer className="px-5 py-14" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="mx-auto max-w-6xl text-center">
          <img src={logoWhite.url} alt="Almore Inteligência Contábil" className="h-10 w-auto mx-auto opacity-90" />
          <p className="mt-5 text-[#8a8a8a] text-sm">CNPJ: {EMPRESA.cnpj}</p>
          <div className="mt-8 mx-auto max-w-md h-px bg-white/15" />
          <p className="mt-6 text-[#7a7a7a] text-sm">
            © 2026 Almore Inteligência Contábil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
