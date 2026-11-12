import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Building2,
  Check,
  Coins,
  FileText,
  Lightbulb,
  Users,
} from "lucide-react";
import { useLinkFormulario, type OrigemCta } from "@/lib/formulario";
import {
  REST_ARTIGOS,
  SITE_URL,
  restHeaders,
  articlePath,
  excerpt,
  formatDate,
  type Artigo,
} from "@/lib/blog";
import { SiteNavbar } from "@/components/SiteNavbar";

import logoWhite from "@/assets/almore-logo-white.png.asset.json";
import isotipo from "@/assets/almore-isotipo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almore Inteligência Contábil — Rápido. Consultivo. Sempre." },
      {
        name: "description",
        content:
          "Contabilidade 100% digital, consultiva e ágil. Atendimento rápido, orientação proativa e plano completo de contabilidade, com abertura de empresa e planejamento tributário.",
      },
      { property: "og:title", content: "Almore Inteligência Contábil" },
      {
        property: "og:description",
        content: "A contabilidade que responde quando você precisa e enxerga muito além da obrigação.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`, async: true },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}',${JSON.stringify(CONFIG_GTAG)});`,
      },
    ],
  }),
  component: LandingPage,
});

/**
 * ID da conta do Google Ads. Preenchido em 28/09/2026.
 *
 * Formato: AW- seguido dos dígitos da conta, ex. "AW-1234567890". Aparece no
 * Google Ads em Ferramentas > Gerenciador de tags, ou no topo do snippet que
 * ele manda instalar.
 *
 * O rótulo da conversão ainda não existe — e ele não é usado aqui: a
 * conversão é disparada no formulário, não na home.
 *
 * Isto instala só a tag global, que mede visitas e alimenta remarketing. A
 * conversão em si acontece no formulário, que está em outro domínio — então
 * o evento de conversão precisa ser disparado LÁ, e o Google Ads precisa ter
 * form.almorecontabilidade.com.br na lista de domínios da conta para o clique
 * atravessar. Ver src/lib/formulario.ts, que repassa gclid e utm_*.
 */
const GOOGLE_ADS_ID = "AW-18343127097";

/**
 * Precisa ser IDÊNTICO ao do formulário (src/lib/funil/google-ads.ts no repo
 * LP-video-almore) — é a igualdade entre as duas configurações que faz a
 * sessão ser uma só, em vez de o mesmo visitante virar duas.
 *
 * Os dois endereços são subdomínios do mesmo domínio registrável, e o gtag já
 * grava o cookie no domínio de cima por padrão, então a sessão atravessa mesmo
 * sem isto. Fica declarado para a intenção ficar explícita e para cobrir o dia
 * em que o formulário mudar de endereço.
 */
const CONFIG_GTAG = {
  linker: {
    domains: ["almorecontabilidade.com.br", "form.almorecontabilidade.com.br"],
    decorate_forms: true,
  },
};

const numeros = [
  { valor: "+50", legenda: "empresas na carteira de contabilidade", Icone: Building2 },
  { valor: "+1.300", legenda: "clientes atendidos em recuperação tributária pelo grupo", Icone: Users },
  { valor: "R$ 25 milhões", legenda: "restituídos aos nossos clientes", Icone: Coins },
];

// Formato internacional, só dígitos: 55 (Brasil) + 19 (DDD) + 991368837
const WHATSAPP_NUMERO = "5519991368837";
const WHATSAPP_EXIBICAO = "(19) 99136-8837";
const EMAIL_COMERCIAL = "comercial@almorecontabilidade.com.br";
const SITE_EXIBICAO = "almorecontabilidade.com.br";

const solucoes = [
  {
    titulo: "Abertura de Empresa",
    desc: "CNPJ no regime tributário certo desde o primeiro dia. Planejamento tributário, definição do melhor enquadramento e estruturação inicial completa.",
    itens: [
      "Abertura de CNPJ",
      "Definição do regime tributário",
      "Planejamento tributário inicial",
      "Acompanhamento personalizado",
      "Reunião de alinhamento",
    ],
    Icone: Building2,
    href: "#bloco-abertura",
    destaque: false,
  },
  {
    titulo: "Contabilidade Mensal",
    desc: "Gestão contábil completa e consultiva. Impostos, folha, obrigações e relatório mensal para você decidir com clareza.",
    itens: [
      "Apuração de impostos e obrigações",
      "Folha de pagamento e pró-labore",
      "DRE, balancete e conciliações",
      "Relatório consultivo mensal",
    ],
    Icone: FileText,
    href: "#bloco-mensal",
    destaque: true,
  },
  {
    titulo: "Planejamento Tributário",
    desc: "Reduza legalmente o quanto você paga de imposto. Auditoria fiscal e estratégia sob medida para o seu faturamento.",
    itens: [
      "Auditoria de classificação fiscal",
      "Acompanhamento de alíquota efetiva",
      "Planejamento tributário estratégico",
      "Consultoria em precificação",
    ],
    Icone: Lightbulb,
    href: "#bloco-plan",
    destaque: false,
  },
];

const diferenciais = [
  {
    t: "Atendimento Rápido",
    d: "Você fala com quem conhece a sua empresa e recebe resposta ágil. Sem fila, sem burocracia, sem ficar sem retorno. Não existe bot respondendo no lugar de contador.",
  },
  {
    t: "Atendimento Consultivo",
    d: "Não esperamos a pergunta. Antecipamos, alertamos e recomendamos em cada decisão que afeta o seu caixa.",
  },
  {
    t: "Onboarding Premium 360º",
    d: "Diagnóstico inicial, reunião de alinhamento, organização de acessos e a lista certa de documentos. Você sabe o que esperar desde o primeiro dia.",
  },
  {
    t: "À Frente da Reforma Tributária",
    d: "Acompanhamos cada mudança e orientamos a sua empresa antes do prazo apertar. Com a Almore, você não descobre de última hora.",
  },
];

const chipsOrbital = [
  "Resposta rápida",
  "Clareza nos números",
  "Menos imposto",
  "Zero burocracia",
  "Atendimento humano",
  "Tranquilidade fiscal",
];

const processo = [
  {
    t: "Diagnóstico",
    d: "Análise completa da sua situação atual. Identificamos erros, oportunidades e quanto você pode economizar.",
  },
  {
    t: "Reunião de Alinhamento",
    d: "Combinamos expectativas, prazos e a forma de atendimento. Você sabe o que esperar desde o primeiro dia.",
  },
  {
    t: "Migração Sem Estresse",
    d: "Cuidamos de toda a transição, do distrato à transferência de acessos. Você não precisa fazer nada — apenas aprovar.",
  },
  {
    t: "Onboarding Premium 360º",
    d: "Organizamos os acessos e entregamos a lista certa de documentos, sem burocracia.",
  },
  {
    t: "Acompanhamento Mensal",
    d: "Relatório consultivo, respostas rápidas e atendimento próximo. Você sempre sabe o que está acontecendo.",
  },
  {
    t: "Crescimento com Segurança",
    d: "Empresa organizada, impostos em dia e uma contabilidade que acompanha o seu crescimento e antecipa a reforma tributária.",
  },
];

const bronzeItems = [
  "Relatório consultivo mensal",
  "Diagnóstico inicial e reunião de alinhamento",
  "Apuração dos impostos",
  "Folha de pagamento e pró-labore",
  "Auditoria mensal de classificação fiscal",
  "Controle de férias e prazos de contratos de funcionários",
  "Demonstração do Resultado gerencial",
  "Acompanhamento de faturamento e alíquota efetiva",
  "Entrega das obrigações acessórias",
  "Atendimento consultivo",
  "Onboarding Premium 360º",
  "Admissão e rescisão de funcionários",
];

const prataItems = [
  "Planejamento tributário inicial",
  "Conciliação de extrato bancário",
  "Imposto de Renda de Pessoa Física (1 pessoa)",
  "Gestão de benefícios (vale-refeição, vale-alimentação e vale-transporte)",
  "Controle de negativas federais e trabalhistas",
];

const ouroItems = [
  "Planejamento tributário estratégico anual",
  "Consultoria revisional semestral",
  "Consultoria em precificação anual",
  "Imposto de Renda de Pessoa Física (2 pessoas)",
  "1 alteração de contrato social anual",
  "Demonstração do Resultado do Exercício",
  "Gestão de indicadores do Departamento Pessoal",
  "Fechamento do ponto",
  "Assistente de inteligência artificial personalizado",
];

const faqs = [
  {
    q: "Posso trocar de contador sem problema?",
    a: "Sim, e é mais simples do que parece. A Almore conduz toda a migração — do distrato com o escritório anterior à transferência de documentos e acessos. Você não precisa se preocupar com burocracia. O processo é feito sem interromper nenhuma obrigação da sua empresa.",
  },
  {
    q: "Durante a transição, fico sem emitir nota fiscal?",
    a: "Não. A migração é planejada justamente para que sua operação continue sem nenhuma interrupção. Emissão de notas, pagamento de guias e entrega de obrigações seguem normalmente desde o primeiro dia.",
  },
  {
    q: "Meu contador já me conhece há anos. Vale a pena mudar?",
    a: "Conhecer o histórico da empresa é importante — mas não é suficiente. A questão não é quanto tempo seu contador te conhece, é o que ele faz com esse conhecimento. Se você nunca recebeu uma orientação que não pediu, nunca teve um relatório que ajudasse a tomar decisão, talvez o problema não seja o tempo de relacionamento.",
  },
  {
    q: "A contabilidade digital tem atendimento humano de verdade?",
    a: "Na Almore, sim. Você fala com quem conhece a sua empresa — não com uma fila de suporte. O atendimento rápido e próximo é o nosso compromisso número um. Não existe bot respondendo no lugar de contador.",
  },
  {
    q: "Quando é o momento certo para trocar?",
    a: "Quando você se pergunta se deveria trocar, já é hora de pelo menos conversar. Mas se você já perdeu prazo por falta de aviso, se cresceu e a contabilidade não acompanhou, ou se nunca recebeu uma orientação proativa — o momento é agora.",
  },
];

/**
 * Garante que quem chega por /#planos, /#faq e afins pare na seção certa.
 *
 * O scroll nativo do navegador acerta quando a página já está montada, mas em
 * rede lenta ele tenta antes da hora: medido em 28/09/2026 com throttling, a
 * seção ainda estava a 1464px do topo três segundos depois da chegada, e só
 * então se ajustou sozinha. Isso é heurística do navegador, não garantia — e
 * é justamente por esse caminho que entra o tráfego pago dos sitelinks.
 *
 * Então reaplicamos a posição na montagem e de novo quando tudo termina de
 * carregar, que é quando uma imagem tardia poderia ter empurrado a página.
 *
 * `instant` de propósito: o CSS tem `scroll-behavior: smooth`, e uma animação
 * disparando sozinha na abertura parece travamento.
 *
 * Se a pessoa já rolou por conta própria, paramos — corrigir o scroll de
 * alguém que está lendo é pior do que a âncora ter falhado.
 */
function useAncoraDaUrl() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let cancelado = false;
    const aoRolar = () => {
      cancelado = true;
    };

    const irAteLa = () => {
      if (cancelado) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    irAteLa();
    // Depois do primeiro paint, com o layout já resolvido.
    const quadro = requestAnimationFrame(irAteLa);
    window.addEventListener("load", irAteLa);
    // `wheel` e `touchstart` são gesto da pessoa. `scroll` não serve: ele
    // dispara com o nosso próprio scrollIntoView e cancelaria a correção
    // seguinte antes de ela acontecer.
    window.addEventListener("wheel", aoRolar, { passive: true, once: true });
    window.addEventListener("touchstart", aoRolar, { passive: true, once: true });

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("load", irAteLa);
      window.removeEventListener("wheel", aoRolar);
      window.removeEventListener("touchstart", aoRolar);
    };
  }, []);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vh = window.innerHeight;
    // Revela imediatamente o que já está no viewport na hidratação
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add("is-visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

/**
 * Botão que leva ao formulário, em outro domínio.
 *
 * É um <a> de verdade, e não um botão com onClick, para o link poder ser
 * aberto em nova aba, copiado e lido por leitor de tela como link.
 */
function CtaFormulario({
  origem,
  className,
  children,
}: {
  origem: OrigemCta;
  className: string;
  children: React.ReactNode;
}) {
  const href = useLinkFormulario(origem);
  return (
    <a href={href} className={`${className} inline-block text-center`}>
      {children}
    </a>
  );
}

/**
 * Cabeçalho padrão das seções.
 *
 * O título fica numa linha só a partir de lg (whitespace-nowrap) e o tamanho
 * acompanha a largura da tela, para o maior deles caber sem estourar. Abaixo de
 * lg a linha pode quebrar normalmente.
 */
function CabecalhoSecao({
  eyebrow,
  children,
  sub,
  escuro = false,
}: {
  eyebrow: string;
  children: React.ReactNode;
  sub?: string;
  escuro?: boolean;
}) {
  return (
    <div className="reveal mx-auto mb-14 text-center">
      <div className={`eyebrow mb-4 ${escuro ? "text-gold" : "text-[#7C1638]"}`}>{eyebrow}</div>
      <h2
        className={`font-display font-extrabold text-[clamp(26px,3.2vw,36px)] leading-[1.15] tracking-tight lg:whitespace-nowrap ${
          escuro ? "text-white" : "text-wine-900"
        }`}
      >
        {children}
      </h2>
      {sub && (
        <p
          className={`mx-auto mt-4 max-w-[720px] text-[18px] leading-relaxed ${
            escuro ? "text-white/75" : "text-gray-deep"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function LandingPage() {
  useReveal();
  useAncoraDaUrl();
  return (
    <div className="bg-background text-foreground">
      <SiteNavbar />
      <main>
        <Hero />
        <OQueFazemos />
        <Confianca />
        <Diferenciais />
        <Blocos />
        <Processo />
        <Planos />
        <Numeros />
        <FAQ />
        <Reforma />
        <BlogRecente />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFlutuante />
    </div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden min-h-[92vh] flex items-start lg:items-center px-5 sm:px-10 py-24 max-lg:pt-[330px] sm:max-lg:pt-[430px]"
      style={{ backgroundColor: "#7C1638" }}
    >
      {/* Background Image - Absolute, now positioned to the LEFT */}
      <div aria-hidden className="absolute left-0 top-0 w-full h-[380px] sm:h-[480px] lg:h-full lg:w-[62%] pointer-events-none">
        <img
          src="/hero-almore.webp"
          alt=""
          /* Foto retrato (922x1152) da dupla, em public/hero-almore.webp.
             De lg para cima o container tem 62% da largura, então o cover mostra quase a foto
             inteira e a dupla fica na faixa esquerda, longe do texto. O
             recorte vertical (35%) mantém rostos e tronco no quadro. Se a
             foto for trocada, ajuste o object-position. Abaixo de lg a foto vai para o
             topo (380/480px de altura), com degradê vertical para o bordô, e o
             texto fica embaixo; a máscara lateral está em .hero-foto (styles.css). */
          className="absolute inset-0 w-full h-full object-cover hero-foto object-[50%_40%] lg:object-[50%_35%] lg:origin-[50%_55%] lg:[transform:translateX(-12%)_scale(1.25)]"
          style={{
            filter: "grayscale(100%) brightness(1.2) contrast(1.05)",
          }}
        />
        {/* Bordeaux tone match overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "#7C1638", opacity: 0.5, mixBlendMode: "multiply" }}
        />
        {/* Horizontal fade from bordeaux into photo (Text area is on the right) */}
        <div
          className="absolute right-0 top-0 h-full w-[40%] max-lg:hidden"
          style={{
            background:
              "linear-gradient(to left, #7C1638 0%, rgba(124,22,56,0.9) 30%, rgba(124,22,56,0) 100%)",
          }}
        />
        {/* Bottom fade for transition to next section */}
        <div
          className="absolute bottom-0 left-0 h-[180px] max-lg:h-[65%] w-full"
          style={{
            background: "linear-gradient(to top, #7C1638 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl w-full flex lg:justify-end">
        {/* 700px: a 520 o título quebrava em quatro linhas e sobrava vazio ao
            lado; o text-balance reparte as palavras entre as linhas. */}
        <div className="w-full max-w-[700px] text-white reveal">
          <div className="eyebrow text-gold mb-6">RÁPIDO. CONSULTIVO. SEMPRE.</div>
          <h1 className="font-display font-extrabold leading-[1.08] tracking-tight text-balance text-[clamp(34px,4.6vw,56px)]">
            A contabilidade que <span className="text-gold">responde</span> quando você precisa
          </h1>
          <p className="mt-6 max-w-[600px] text-white/85 text-lg sm:text-xl leading-relaxed">
            Pare de pagar mais imposto do que deveria: empresas sem orientação contábil pagam, em
            média, 12% a mais. A Almore é consultiva, rápida e enxerga muito além da obrigação.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <CtaFormulario
              origem="hero"
              className="btn-gold font-display font-bold text-base px-8 py-4 rounded-full"
            >
              Quero Pagar Menos Imposto
            </CtaFormulario>
            <a
              href="#solucoes"
              className="btn-ghost-light font-display font-bold text-base px-8 py-4 rounded-full"
            >
              Conhecer as Soluções
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/20 pt-7">
            {[
              ["+50", "Empresas na carteira"],
              ["+1.300", "Clientes em recuperação"],
              ["R$ 25 mi", "Restituídos"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display font-extrabold text-[26px] leading-none text-gold whitespace-nowrap">
                  {v}
                </div>
                <div className="eyebrow mt-2 text-white/65 !text-[11px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Carrossel 3D do bloco "O que fazemos" — só no celular (< 768px).
 *
 * Os cards ficam numa faixa com scroll horizontal e snap. A cada rolagem, cada
 * slide recebe um rotateY proporcional à distância até o centro da tela, como
 * se estivessem num cilindro: o card central fica de frente e os vizinhos
 * giram para trás, menores e mais apagados. De md para cima nada disso roda e
 * os cards ficam na grade de três colunas (os estilos ficam em styles.css,
 * dentro de @media, e aqui só limpamos o inline se a tela crescer).
 *
 * O efeito vai num elemento INTERNO ([data-slide] > div), e não no próprio
 * [data-slide]. Motivo: o scroll-snap calcula o ponto de parada com a caixa já
 * transformada; se o alvo do snap girar, a rotação (que depende da posição) muda
 * a caixa e o card nunca centraliza — parava 70-90px fora do centro. Com o
 * [data-slide] parado, o snap é exato. A perspectiva vai dentro do transform de
 * cada card (perspective(900px)) porque perspective no container só vale para
 * filhos diretos.
 */
function useCarrossel3D(
  ref: React.RefObject<HTMLDivElement | null>,
  aoMudarAtivo: (indice: number) => void,
) {
  useEffect(() => {
    const faixa = ref.current;
    if (!faixa) return;
    const celular = window.matchMedia("(max-width: 767px)");
    const slides = Array.from(faixa.querySelectorAll<HTMLElement>("[data-slide]"));
    let quadro = 0;

    const limpar = () =>
      slides.forEach((s) => {
        const alvo = s.firstElementChild as HTMLElement | null;
        if (alvo) {
          alvo.style.transform = "";
          alvo.style.opacity = "";
        }
      });

    const atualizar = () => {
      quadro = 0;
      if (!celular.matches) return;
      const caixa = faixa.getBoundingClientRect();
      const centro = caixa.left + caixa.width / 2;
      let ativo = 0;
      let menor = Infinity;
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        // 0 = centralizado; ±1 = a um card de distância.
        const d = (r.left + r.width / 2 - centro) / r.width;
        const a = Math.min(Math.abs(d), 1);
        const giro = Math.max(-1, Math.min(1, d)) * 38;
        const alvo = s.firstElementChild as HTMLElement | null;
        if (alvo) {
          alvo.style.transform = `perspective(900px) rotateY(${giro}deg) translateZ(${-a * 80}px) scale(${1 - a * 0.08})`;
          alvo.style.opacity = String(1 - a * 0.45);
        }
        if (Math.abs(d) < menor) {
          menor = Math.abs(d);
          ativo = i;
        }
      });
      aoMudarAtivo(ativo);
    };

    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    const aoTrocarTela = () => {
      if (celular.matches) agendar();
      else limpar();
    };

    faixa.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    celular.addEventListener("change", aoTrocarTela);
    atualizar();

    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      faixa.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      celular.removeEventListener("change", aoTrocarTela);
      limpar();
    };
  }, [ref, aoMudarAtivo]);
}

function OQueFazemos() {
  const faixa = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  useCarrossel3D(faixa, setAtivo);

  const irPara = (i: number) => {
    const slide = faixa.current?.querySelectorAll<HTMLElement>("[data-slide]")[i];
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section id="solucoes" className="ancora bg-white px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <CabecalhoSecao
          eyebrow="O QUE FAZEMOS"
          sub="Muito além de apurar imposto. A Almore cuida de toda a estrutura fiscal, pessoal, contábil e de gestão do seu negócio."
        >
          Soluções completas para a sua empresa
        </CabecalhoSecao>
        {/* No celular a faixa sangra até as bordas da tela (-mx-5) para o card
            central ter mais largura. */}
        <div className="reveal -mx-5 md:mx-0">
          <div ref={faixa} className="carrossel-3d md:grid md:grid-cols-3 md:items-stretch md:gap-6">
            {solucoes.map(({ titulo, desc, itens, Icone, href, destaque }) => (
              <div key={titulo} data-slide className="slide flex">
                <div className="flex w-full will-change-transform">
                <article
                  className={`group relative flex w-full flex-col rounded-2xl border p-6 transition-all duration-300 ease-out hover:-translate-y-2.5 md:p-8 ${
                    destaque
                      ? "border-gold bg-linear-to-br from-wine-900 to-wine-800 text-white hover:shadow-[0_26px_50px_rgba(74,13,34,0.35)]"
                      : "border-border bg-white hover:border-gold hover:bg-linear-to-br hover:from-wine-900 hover:to-[#7C1638] hover:shadow-[0_26px_50px_rgba(74,13,34,0.35)]"
                  }`}
                >
                  {destaque && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 font-display text-[11px] font-extrabold uppercase tracking-wider text-wine-950">
                      Essencial
                    </span>
                  )}
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                      destaque
                        ? "bg-white/12 text-gold"
                        : "bg-[#F6E6EB] text-[#7C1638] transition-colors duration-300 group-hover:bg-white/12 group-hover:text-gold"
                    }`}
                  >
                    <Icone size={22} aria-hidden />
                  </div>
                  <h3
                    className={`font-display text-[22px] font-extrabold ${
                      destaque ? "text-white" : "text-wine-900 transition-colors duration-300 group-hover:text-white"
                    }`}
                  >
                    {titulo}
                  </h3>
                  <p
                    className={`mt-3 text-[16px] leading-relaxed md:text-[17px] ${
                      destaque ? "text-white/80" : "text-gray-deep transition-colors duration-300 group-hover:text-white/80"
                    }`}
                  >
                    {desc}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {itens.map((it) => (
                      <li
                        key={it}
                        className={`flex gap-2.5 text-[16px] md:text-[17px] ${
                          destaque ? "text-white/90" : "text-[#4D3B44] transition-colors duration-300 group-hover:text-white/90"
                        }`}
                      >
                        <span className="font-bold text-gold-dark" aria-hidden>
                          →
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={href}
                    className={`mt-6 font-display text-[15px] font-bold ${
                      destaque
                        ? "text-gold hover:text-white"
                        : "text-[#7C1638] transition-colors duration-300 group-hover:text-gold hover:text-gold-dark"
                    }`}
                  >
                    Saiba mais →
                  </a>
                </article>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2.5 pt-1 md:hidden" role="tablist" aria-label="Escolher serviço">
            {solucoes.map((s, i) => (
              <button
                key={s.titulo}
                type="button"
                role="tab"
                aria-selected={ativo === i}
                aria-label={s.titulo}
                onClick={() => irPara(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  ativo === i ? "w-7 bg-[#7C1638]" : "w-2.5 bg-[#7C1638]/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Confianca() {
  return (
    <section id="sobre" className="ancora bg-surface px-5 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-wine-900 to-[#7C1638] px-8 py-14 text-white shadow-card sm:px-11">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 left-5 font-display text-[200px] font-extrabold leading-none text-gold/20"
            >
              “
            </span>
            <div className="eyebrow relative mb-4 text-gold">NOTA CONSULTIVA</div>
            <p className="relative font-display text-[26px] font-bold leading-[1.3] sm:text-[30px]">
              Contabilidade que serve para decidir, não só para arquivar.
            </p>
          </div>
          <div className="absolute -bottom-4 right-3 flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-display text-[14px] font-bold text-wine-900 shadow-card-hover sm:-right-3">
            <span className="text-gold-dark">★</span> +50 empresas confiam na Almore
          </div>
        </div>
        <div className="reveal">
          <div className="eyebrow mb-4 text-[#7C1638]">TRANSPARÊNCIA E CONFIANÇA</div>
          <h2 className="font-display text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.15] tracking-tight text-wine-900">
            Uma contabilidade que <span className="text-[#7C1638]">pensa junto</span> com você
          </h2>
          <p className="mt-5 text-[19px] leading-[1.7] text-gray-deep">
            A Almore existe para ser a contabilidade consultiva que o empresário precisa para
            decidir com segurança e pagar menos imposto de forma legal.
          </p>
          <p className="mt-3 text-[17px] leading-[1.7] text-gray-deep">
            Não somos uma contabilidade tradicional que só entrega guias e responde quando você
            pergunta. Traduzimos os números em direção: mostramos onde dá para melhorar,
            antecipamos o que vem pela frente e estamos perto quando você precisa decidir.
          </p>
          <ul className="my-7 grid gap-3 sm:grid-cols-2">
            {[
              "Clareza em cada informação",
              "Atendimento rápido e humano",
              "Foco em decisão com segurança",
              "Orientação antes de você pedir",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5 font-display text-[16px] font-semibold text-wine-900">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FBF0DC] text-gold-dark">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <a href="#diferenciais" className="btn-primary inline-block rounded-full px-8 py-4 font-display text-base font-bold">
            Conhecer a Almore
          </a>
        </div>
      </div>
    </section>
  );
}

function Diferenciais() {
  const [aberto, setAberto] = useState<number | null>(0);
  return (
    <section
      id="diferenciais"
      className="ancora relative overflow-hidden px-5 py-24 text-white sm:py-28 bg-linear-to-br from-wine-950 to-wine-900"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="reveal">
          <div className="eyebrow mb-4 text-gold">NOSSOS DIFERENCIAIS</div>
          <h2 className="font-display text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.15] tracking-tight">
            Por que a Almore é diferente?
          </h2>
          <p className="mb-7 mt-3 text-[18px] leading-relaxed text-white/75">
            Enquanto a maioria dos escritórios contábeis foca apenas em cumprir obrigações, a Almore
            atua como parceira de decisão do seu negócio.
          </p>
          <div className="space-y-3">
            {diferenciais.map((d, i) => {
              const isOpen = aberto === i;
              return (
                <div
                  key={d.t}
                  className={`overflow-hidden rounded-[14px] border transition-colors ${
                    isOpen ? "border-gold/55 bg-white/10" : "border-white/12 bg-white/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setAberto(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[11px] font-extrabold text-wine-950">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[17px] font-bold">{d.t}</span>
                    <span className="ml-auto text-2xl leading-none text-gold">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div
                    className="grid transition-all duration-[250ms] ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[62px] text-[17px] leading-relaxed text-white/80">{d.d}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="orbit reveal" aria-hidden>
          <div className="orbit-ring" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />
          <div className="orbit-spin">
            {chipsOrbital.map((c, i) => (
              <div key={c} className="orbit-chip" style={{ "--a": `${i * 60}deg` } as CSSProperties}>
                <span>{c}</span>
              </div>
            ))}
          </div>
          <div className="orbit-core">
            <img src={isotipo.url} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ListaCheck({ itens }: { itens: string[] }) {
  return (
    <ul className="mb-8 space-y-2.5">
      {itens.map((t) => (
        <li key={t} className="flex gap-3 text-[17px] leading-snug text-[#43303A]">
          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#FBF0DC] text-gold-dark">
            <Check size={12} strokeWidth={3} aria-hidden />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Mock({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-[340px] gap-3 rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
      <b className="font-display text-[15px] font-bold text-gold">{titulo}</b>
      {children}
    </div>
  );
}

function Barra({ w }: { w: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
      <i className="block h-full rounded-full bg-linear-to-r from-gold-dark to-gold" style={{ width: `${w}%` }} />
    </div>
  );
}

function Passo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[16px]">
      <i className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gold text-wine-950 not-italic">
        <Check size={13} strokeWidth={3} aria-hidden />
      </i>
      {children}
    </div>
  );
}

function Bloco({
  id,
  numero,
  invertido,
  titulo,
  texto,
  itens,
  cta,
  origem,
  visual,
}: {
  id: string;
  numero: string;
  invertido?: boolean;
  titulo: string;
  texto: string;
  itens: string[];
  cta: string;
  origem: OrigemCta;
  visual: React.ReactNode;
}) {
  return (
    <div id={id} className="ancora reveal grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div
        className={`relative grid min-h-[320px] place-items-center overflow-hidden rounded-3xl bg-linear-to-br from-wine-900 to-[#7C1638] px-6 py-12 shadow-card sm:px-9 ${
          invertido ? "lg:order-2" : ""
        }`}
      >
        <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-[13px] font-extrabold text-wine-950">
          {numero}
        </span>
        {visual}
      </div>
      <div>
        <h3 className="mb-4 font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-tight text-wine-900">
          {titulo}
        </h3>
        <p className="mb-6 text-[18px] leading-relaxed text-gray-deep">{texto}</p>
        <ListaCheck itens={itens} />
        <CtaFormulario origem={origem} className="btn-primary rounded-full px-8 py-4 font-display text-base font-bold">
          {cta}
        </CtaFormulario>
      </div>
    </div>
  );
}

function Blocos() {
  return (
    <section className="bg-white px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <CabecalhoSecao eyebrow="SOLUÇÕES">Encontre a solução certa para você</CabecalhoSecao>
        <div className="space-y-20 sm:space-y-24">
          <Bloco
            id="bloco-abertura"
            numero="01"
            titulo="Abra sua empresa do jeito certo"
            texto="Muitos empreendedores abrem o CNPJ no regime errado e pagam muito mais imposto do que precisam. A Almore faz todo o processo: análise do seu modelo de negócio, escolha do regime tributário ideal e abertura completa."
            itens={[
              "Abertura de CNPJ sem burocracia",
              "Definição do melhor regime tributário",
              "Planejamento tributário desde o início",
              "Acompanhamento personalizado e reunião de alinhamento",
            ]}
            cta="Abrir minha empresa"
            origem="solucao-abertura"
            visual={
              <Mock titulo="Abertura de empresa">
                <Passo>Análise do seu modelo de negócio</Passo>
                <Passo>Regime tributário ideal definido</Passo>
                <Passo>Abertura do CNPJ</Passo>
                <Passo>Reunião de alinhamento</Passo>
              </Mock>
            }
          />
          <Bloco
            id="bloco-mensal"
            numero="02"
            invertido
            titulo="Uma contabilidade que te acompanha todo mês"
            texto="Muitos empresários recebem guias todo mês e não entendem nada do que acontece com os números. A Almore cuida de toda a rotina fiscal, pessoal e contábil — e traduz tudo em um relatório consultivo mensal."
            itens={[
              "Apuração de impostos e obrigações acessórias",
              "Folha de pagamento, pró-labore e controle de férias",
              "DRE, balancete e conciliações bancárias",
              "Relatório consultivo mensal",
            ]}
            cta="Quero uma contabilidade consultiva"
            origem="solucao-mensal"
            visual={
              <Mock titulo="Relatório consultivo">
                <Barra w={82} />
                <Barra w={64} />
                <Barra w={90} />
                <Barra w={48} />
              </Mock>
            }
          />
          <Bloco
            id="bloco-troca"
            numero="03"
            titulo="Troque de contador sem complicações"
            texto="Seu contador atual só responde quando você pergunta? A migração para a Almore é simples, rápida e sem riscos. Cuidamos de toda a transição, sem interromper nenhuma obrigação da sua empresa."
            itens={[
              "Migração segura e sem burocracia",
              "Emissão de notas e pagamento de guias sem interrupção",
              "Transferência de documentos e acessos",
              "Diagnóstico da sua situação atual",
            ]}
            cta="Trocar de contador"
            origem="solucao-troca"
            visual={
              <Mock titulo="Migração sem estresse">
                <Passo>Distrato com o escritório anterior</Passo>
                <Passo>Documentos e acessos transferidos</Passo>
                <Passo>Notas e guias sem interrupção</Passo>
                <Passo>Reunião de alinhamento</Passo>
              </Mock>
            }
          />
          <Bloco
            id="bloco-plan"
            numero="04"
            invertido
            titulo="Pague menos imposto, dentro da lei"
            texto="Empresas sem orientação contábil pagam, em média, 12% mais imposto do que deveriam. A Almore audita a classificação fiscal, acompanha o faturamento e a alíquota efetiva e aponta o caminho legal mais leve para a sua empresa."
            itens={[
              "Auditoria mensal de classificação fiscal",
              "Acompanhamento de faturamento e alíquota efetiva",
              "Planejamento tributário inicial e estratégico",
              "Consultoria revisional e de precificação",
            ]}
            cta="Quero pagar menos imposto"
            origem="solucao-planejamento"
            visual={
              <Mock titulo="Alíquota efetiva">
                <Barra w={70} />
                <Barra w={55} />
                <Barra w={40} />
                <small className="text-[14px] text-white/75">Auditoria fiscal + planejamento tributário</small>
              </Mock>
            }
          />
        </div>
      </div>
    </section>
  );
}

function Processo() {
  return (
    <section id="processo" className="ancora px-5 py-24 sm:py-28 bg-linear-to-br from-wine-950 to-wine-900">
      <div className="mx-auto max-w-6xl">
        <CabecalhoSecao eyebrow="NOSSO PROCESSO" escuro>
          O que acontece quando você vira cliente <span className="text-gold">Almore</span>
        </CabecalhoSecao>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {processo.map((p, i) => (
            <div
              key={p.t}
              className="reveal rounded-2xl border border-white/14 bg-white/6 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/10"
            >
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-[13px] font-extrabold text-wine-950">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[20px] font-extrabold text-white">{p.t}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-white/78">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Cor do metal de cada plano, usada na faixa do topo do card.
 * Escolhidas dessaturadas de propósito: metal vivo brigaria com o bordô
 * da marca, que continua sendo a cor dos ✓ e do botão.
 */
const coresPlano: Record<string, string> = {
  Bronze: "#A9673B",
  Prata: "#9AA3A9",
  Ouro: "#C4A02C",
};

/**
 * O plano nasce em destaque (bordô, borda e botão dourados) e sem animação: com
 * um plano só não há o que comparar. Se MOSTRAR_TODOS_OS_PLANOS voltar a ser
 * true, os três cards aparecem todos assim — nesse caso vale rever o destaque.
 */
function PlanCard({
  name,
  subtitle,
  items,
  origem,
  cta,
  largo = false,
}: {
  name: string;
  subtitle: string;
  items: string[];
  origem: OrigemCta;
  cta: string;
  /** Plano único: lista em duas colunas para o card largo não ficar comprido. */
  largo?: boolean;
}) {
  const cor = coresPlano[name] ?? "#7C1638";
  return (
    <div
      className="plan-card reveal flex flex-col rounded-[22px] border border-gold border-t-[4px] bg-linear-to-br from-wine-900 to-[#7C1638] p-8 text-white shadow-[0_26px_50px_rgba(74,13,34,0.35)]"
      style={{ borderTopColor: cor }}
    >
      <h3 className="flex items-center gap-3 font-display text-[28px] font-bold text-white">
        <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
        {name}
      </h3>
      <p className="mt-2 text-[18px] italic text-white/78">
        {subtitle}
      </p>
      <ul className={`mt-6 flex-1 ${largo ? "grid gap-x-10 gap-y-3 sm:grid-cols-2" : "space-y-3"}`}>
        {items.map((it) => (
          <li
            key={it}
            className="flex gap-3 text-[18px] leading-relaxed text-white/92"
          >
            <span className="shrink-0 font-bold text-gold">✓</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <CtaFormulario
        origem={origem}
        className="mt-8 w-full rounded-full border-2 border-gold bg-gold px-6 py-3 font-display text-[15px] font-bold text-wine-950 transition-colors hover:border-gold-dark hover:bg-gold-dark"
      >
        {cta}
      </CtaFormulario>
    </div>
  );
}

/**
 * Decisão do comercial (12/11/2026): a Almore passa a oferecer um único plano,
 * o Bronze, como padrão.
 *
 * Prata e Ouro NÃO foram apagados: seguem definidos acima (prataItems,
 * ouroItems) e voltam à página trocando esta constante para `true` — a grade
 * volta a três colunas sozinha.
 */
const MOSTRAR_TODOS_OS_PLANOS = false;

function Planos() {
  return (
    <section id="planos" className="ancora bg-surface px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <CabecalhoSecao
          eyebrow={MOSTRAR_TODOS_OS_PLANOS ? "PLANOS" : "NOSSO PLANO"}
          sub={
            MOSTRAR_TODOS_OS_PLANOS
              ? "Planos para cada etapa da sua empresa. Cada um inclui tudo do anterior — e acrescenta mais."
              : "Atendimento essencial e completo, do diagnóstico inicial ao relatório consultivo mensal."
          }
        >
          {MOSTRAR_TODOS_OS_PLANOS ? "Escolha o plano ideal para você" : "Um plano completo para a sua empresa"}
        </CabecalhoSecao>
        {MOSTRAR_TODOS_OS_PLANOS ? (
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            <PlanCard name="Bronze" subtitle="Nosso atendimento essencial e completo." items={bronzeItems} origem="plano-bronze" cta="Começar agora" />
            <PlanCard name="Prata" subtitle="Inclui tudo do Bronze, e acrescenta:" items={prataItems} origem="plano-prata" cta="Começar agora" />
            <PlanCard name="Ouro" subtitle="Inclui tudo do Prata, e acrescenta:" items={ouroItems} origem="plano-ouro" cta="Falar com especialista" />
          </div>
        ) : (
          <div className="mx-auto max-w-[820px]">
            <PlanCard
              name="Bronze"
              subtitle="Nosso atendimento essencial e completo."
              items={bronzeItems}
              origem="plano-bronze"
              cta="Começar agora"
              largo
            />
          </div>
        )}
        <p className="reveal mt-8 text-center text-[16px] text-gray-deep">
          * Valores sujeitos a ajuste conforme complexidade e regime tributário. Solicite uma proposta personalizada.
        </p>
      </div>
    </section>
  );
}

function Numeros() {
  return (
    <section className="px-5 py-20 text-white bg-linear-to-br from-[#7C1638] to-wine-900">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-10 text-center text-white/65">
          NÚMEROS QUE SUSTENTAM · NÃO É PROMESSA. É HISTÓRICO.
        </p>
        {/* Três colunas só a partir de lg. Entre md e lg cada card ficaria com
            ~162px úteis, e "R$ 25 milhões" não cabe em nenhum tamanho legível
            — era daí que vinha a quebra de linha que desalinhava a faixa. */}
        <div className="grid gap-10 text-center lg:grid-cols-3 lg:gap-6">
          {numeros.map(({ valor, legenda, Icone }) => (
            <div key={valor} className="reveal">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-gold">
                <Icone size={26} aria-hidden />
              </div>
              {/* O tamanho acompanha a largura da tela em vez de ser fixo: é o
                  que garante que o maior dos três números caiba numa linha em
                  qualquer viewport. Com todos numa linha só, as legendas se
                  alinham sozinhas, sem precisar reservar altura. */}
              <div className="font-display font-extrabold text-gold text-[clamp(34px,4vw,48px)] leading-none tracking-tight whitespace-nowrap">
                {valor}
              </div>
              <p className="mx-auto mt-3 max-w-[260px] text-[17px] leading-relaxed text-white/80">{legenda}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="ancora bg-white px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-[820px]">
        <CabecalhoSecao eyebrow="DÚVIDAS FREQUENTES">Respostas para as suas principais dúvidas</CabecalhoSecao>
        <div className="reveal space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-[14px] border bg-white transition-all ${
                  isOpen ? "border-[#7C1638] shadow-card" : "border-border"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-[19px] font-bold leading-snug text-wine-900">{f.q}</span>
                  <span className="w-6 shrink-0 text-center text-2xl font-light leading-none text-[#7C1638]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-[250ms] ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[18px] leading-[1.7] text-gray-deep">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="reveal mt-10 rounded-2xl bg-surface px-6 py-9 text-center">
          <h3 className="font-display text-[24px] font-extrabold text-wine-900">Ainda tem dúvidas?</h3>
          <p className="mb-5 mt-2 text-[18px] text-gray-deep">
            Fale com um especialista da Almore agora mesmo. Diagnóstico gratuito, sem compromisso.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block rounded-full px-8 py-4 font-display text-base font-bold"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Reforma() {
  return (
    <section className="bg-surface px-5 pb-24 pt-4 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal relative grid items-center gap-10 overflow-hidden rounded-[28px] bg-linear-to-br from-wine-900 to-[#7C1638] p-8 text-white sm:p-14 lg:grid-cols-[1.2fr_1fr]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(227,176,91,0.35), transparent 70%)" }}
          />
          <div className="relative">
            <div className="eyebrow mb-4 text-gold">À FRENTE</div>
            {/* text-balance distribui as palavras entre as linhas em vez de
                encher a primeira e jogar o resto na segunda. */}
            <h2 className="mb-4 font-display text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.15] tracking-tight text-balance">
              A maior reforma tributária da história já começou.
            </h2>
            <p className="mb-3 text-[19px] leading-[1.7] text-white/85">
              Os novos tributos sobre o consumo e as novas obrigações digitais já estão a caminho.
            </p>
            <p className="text-[19px] leading-[1.7] text-white/85">
              Nós acompanhamos cada mudança e orientamos a sua empresa{" "}
              <strong className="text-gold">antes do prazo apertar</strong>.
            </p>
          </div>
          <div className="relative rounded-[20px] border border-white/18 bg-white/8 p-7">
            <p className="mb-5 font-display text-[22px] font-bold leading-snug">
              Com a Almore, você não descobre de última hora.
            </p>
            <CtaFormulario origem="reforma" className="btn-gold rounded-full px-8 py-4 font-display text-base font-bold">
              Quero me preparar
            </CtaFormulario>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Os três artigos mais recentes do blog.
 *
 * Busca no mesmo endpoint da listagem (/blog), só com limit=3. Sem a classe
 * `reveal` nos cartões de propósito: eles aparecem depois da hidratação, e o
 * useReveal só observa o que já existia quando rodou — ficariam invisíveis.
 *
 * Se a busca falhar, a seção continua com o chamamento para o blog; não vale
 * quebrar a home por causa de uma lista de artigos.
 */
function BlogRecente() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await fetch(
          `${REST_ARTIGOS}?status=eq.publicado&order=publicado_em.desc&limit=3&select=id,artigo_titulo,artigo_corpo,publicado_em`,
          { headers: restHeaders },
        );
        if (!res.ok) return;
        const dados = (await res.json()) as Artigo[];
        if (vivo) setArtigos(dados);
      } catch {
        /* sem artigos na home; o link para /blog segue disponível */
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <section id="blog" className="ancora bg-white px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <CabecalhoSecao
          eyebrow="BLOG"
          sub="Notícias e análises sobre contabilidade, impostos, reforma tributária e gestão empresarial — do MEI ao Lucro Real."
        >
          Conteúdo que ajuda você a decidir melhor
        </CabecalhoSecao>
        {artigos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {artigos.map((a) => (
              <Link
                key={a.id}
                to="/blog/$slug"
                params={{ slug: articlePath(a).replace("/blog/", "") }}
                className="card-hover flex flex-col rounded-2xl border border-border bg-white p-7 hover:border-[#7C1638]"
              >
                <span className="eyebrow mb-3 !text-[11px] text-[#7C1638]">{formatDate(a.publicado_em)}</span>
                <h3 className="mb-3 font-display text-[20px] font-extrabold leading-snug text-wine-900">
                  {a.artigo_titulo}
                </h3>
                <p className="flex-1 text-[17px] leading-relaxed text-gray-deep">{excerpt(a.artigo_corpo, 170)}</p>
                <span className="mt-5 font-display text-[15px] font-bold text-[#7C1638]">Ler artigo →</span>
              </Link>
            ))}
          </div>
        )}
        <p className="mt-10 text-center">
          <Link to="/blog" className="btn-primary inline-block rounded-full px-8 py-4 font-display text-base font-bold">
            Ver todos os artigos
          </Link>
        </p>
      </div>
    </section>
  );
}

/**
 * Bloco de fechamento da home.
 *
 * O formulario que ficava aqui foi removido: a captacao passou a acontecer
 * em form.almorecontabilidade.com.br. A secao mantem o id "contato" porque o
 * botao do menu e os links /#contato continuam apontando para ca.
 */
function Contato() {
  return (
    <section
      id="contato"
      className="ancora px-5 py-24 text-white sm:py-28 bg-linear-to-br from-wine-950 to-wine-800"
    >
      <div className="reveal mx-auto max-w-[820px] text-center">
        <div className="eyebrow mb-4 text-gold">VAMOS CONVERSAR?</div>
        <h2 className="font-display text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.15] tracking-tight text-balance">
          Comece agora e pare de pagar imposto a mais
        </h2>
        <p className="mx-auto mt-5 max-w-[600px] text-[19px] leading-relaxed text-white/82">
          Diagnóstico gratuito, sem compromisso. Nossa equipe entende a sua situação e apresenta as
          melhores oportunidades. É só falar com a gente: é rápido, como tudo por aqui.
        </p>
        <ul className="my-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {["Diagnóstico gratuito", "Sem burocracia", "Resposta rápida", "Atendimento consultivo"].map((t) => (
            <li key={t} className="flex items-center gap-2 font-display text-[16px] font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/25 text-gold">
                <Check size={13} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-4">
          <CtaFormulario origem="contato" className="btn-gold rounded-full px-9 py-4 font-display text-base font-bold">
            Quero meu diagnóstico gratuito
          </CtaFormulario>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-light rounded-full px-9 py-4 font-display text-base font-bold"
          >
            Falar no WhatsApp
          </a>
        </div>
        <p className="mt-8 text-[17px] text-white/70">
          Prefere escrever?{" "}
          <a className="font-semibold text-gold hover:underline" href={`mailto:${EMAIL_COMERCIAL}`}>
            {EMAIL_COMERCIAL}
          </a>{" "}
          · WhatsApp{" "}
          <a
            className="font-semibold text-gold hover:underline"
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {WHATSAPP_EXIBICAO}
          </a>
        </p>
      </div>
    </section>
  );
}

function WhatsAppFlutuante() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMERO}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Almore no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-card-hover transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 sm:bottom-6 sm:right-6"
      style={{ backgroundColor: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="#FFFFFF" aria-hidden focusable="false">
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.73 6.41L3.2 28.8l6.56-1.7a12.74 12.74 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.71 12.71 0 0 0-9.05-3.67Zm0 23.02h-.01a10.63 10.63 0 0 1-5.42-1.48l-.39-.23-4.03 1.05 1.08-3.93-.25-.4a10.6 10.6 0 0 1-1.63-5.68c0-5.87 4.78-10.64 10.65-10.64 2.85 0 5.52 1.11 7.53 3.12a10.57 10.57 0 0 1 3.12 7.53c0 5.87-4.78 10.66-10.65 10.66Zm5.84-7.98c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.73-.98-2.36-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.25 3.43 5.45 4.81.76.33 1.35.52 1.82.67.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-wine-950 px-5 py-16 text-white/75">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-white/12 pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src={logoWhite.url} alt="Almore Inteligência Contábil" className="mb-4 h-10 w-auto" />
            <p className="max-w-[320px] text-[16px] leading-relaxed">
              Contabilidade consultiva, rápida e próxima — para empresas que querem decidir com clareza
              e crescer com segurança.
            </p>
          </div>
          <div>
            <h4 className="eyebrow mb-4 text-gold">ESPECIALIDADES</h4>
            <ul className="space-y-2.5 text-[16px]">
              <li><a className="hover:text-gold" href="#bloco-abertura">Abertura de Empresa</a></li>
              <li><a className="hover:text-gold" href="#bloco-mensal">Contabilidade Mensal</a></li>
              <li><a className="hover:text-gold" href="#bloco-plan">Planejamento Tributário</a></li>
              <li><a className="hover:text-gold" href="#bloco-troca">Troca de Contador</a></li>
              <li><a className="hover:text-gold" href="#planos">Departamento Pessoal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="eyebrow mb-4 text-gold">ATENDIMENTO</h4>
            <ul className="space-y-2.5 text-[16px]">
              <li>
                <a className="hover:text-gold" href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {WHATSAPP_EXIBICAO}
                </a>
              </li>
              <li>
                <a className="hover:text-gold break-all" href={`mailto:${EMAIL_COMERCIAL}`}>
                  {EMAIL_COMERCIAL}
                </a>
              </li>
              <li>
                <a className="hover:text-gold" href={SITE_URL}>
                  {SITE_EXIBICAO}
                </a>
              </li>
              <li><Link className="hover:text-gold" to="/blog">Blog</Link></li>
              <li><a className="hover:text-gold" href="#contato">Diagnóstico gratuito</a></li>
              <li><a className="hover:text-gold" href="/politica-de-privacidade">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[15px] text-white/55">
          <span>© {new Date().getFullYear()} Almore Inteligência Contábil. Todos os direitos reservados.</span>
          <span>CNPJ: 67.132.226/0001-17</span>
        </div>
      </div>
    </footer>
  );
}
