import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { salvarSiteLead } from "@/lib/site-leads";
import { useAuth } from "@/lib/auth-context";
import { SiteNavbar } from "@/components/SiteNavbar";

import logoBordeaux from "@/assets/almore-logo.png.asset.json";
import logoWhite from "@/assets/almore-logo-white.png.asset.json";
import isotipo from "@/assets/almore-isotipo.png.asset.json";
import businessmanOffice from "@/assets/businessman-office.jpg.asset.json";
import heroNew from "@/assets/hero-new.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almore Inteligência Contábil — Rápido. Consultivo. Sempre." },
      {
        name: "description",
        content:
          "Contabilidade 100% digital, consultiva e ágil. Atendimento rápido, orientação proativa e planos Bronze, Prata e Ouro.",
      },
      { property: "og:title", content: "Almore Inteligência Contábil" },
      {
        property: "og:description",
        content: "A contabilidade que responde quando você precisa e enxerga muito além da obrigação.",
      },
    ],
  }),
  component: LandingPage,
});

const expectations = [
  "Resposta rápida quando precisar",
  "Me avisar antes dos prazos, sem surpresas",
  "Relatórios que eu realmente entenda",
  "Pagar menos imposto dentro da lei",
  "Orientação proativa, sem eu precisar perguntar",
  "Um contador que conheça meu negócio de verdade",
  "Apoio na Reforma Tributária",
  "Migrar de contabilidade sem dor de cabeça",
  "Tomar decisões melhores com base nos números",
  "Ter tempo de volta para focar no meu negócio",
];

const numeros = [
  { valor: "+50", legenda: "empresas na carteira de contabilidade" },
  { valor: "+1.300", legenda: "clientes atendidos em recuperação tributária pelo grupo" },
  { valor: "R$ 25 milhões", legenda: "restituídos aos nossos clientes" },
];

// Formato internacional, só dígitos: 55 (Brasil) + 19 (DDD) + 991368837
const WHATSAPP_NUMERO = "5519991368837";

const pains = [
  "Mandou mensagem para o contador e esperou dias para ter uma resposta.",
  "Ficou sabendo da multa ou do prazo perdido depois que já aconteceu.",
  "Recebe guias todos os meses, mas não entende nada do que está acontecendo com os números da empresa.",
  "Sua empresa cresceu — e a contabilidade ficou no mesmo lugar de sempre.",
  "Nunca recebeu uma orientação que você não pediu. Só responde quando você pergunta.",
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

function scrollToContato() {
  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function LandingPage() {
  useReveal();
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Dor />
        <QuemSomos />
        <Diferencial />
        <Numeros />
        <ComoTrabalhamos />
        <Entregamos />
        <Planos />
        <FAQ />
        <MudaParaVoce />
        <Reforma />
        <Formulario />
      </main>
      <Footer />
      <WhatsAppFlutuante />
    </div>
  );
}

function Navbar() {
  return <SiteNavbar />;
}



function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden min-h-[92vh] flex items-center px-5 sm:px-10 py-24"
      style={{ backgroundColor: "#7C1638" }}
    >
      {/* Background Image - Absolute, now positioned to the LEFT */}
      <div aria-hidden className="absolute left-0 top-0 w-full md:w-[75%] h-full pointer-events-none">
        <img
          src={heroNew.url}
          alt=""
          /* A foto é retrato (720x1280) num container largo, então o cover
             precisa ampliá-la muito e só cabe uma faixa horizontal dela. Com
             o padrão vertical de 50% essa faixa caía no meio da imagem — ou
             seja, na camisa, com o rosto cortado fora. 18% sobe o recorte
             para a altura do rosto. O ideal mesmo é uma foto deitada. */
          className="absolute inset-0 w-full h-full object-cover object-[35%_20%] md:object-[50%_18%]"
          style={{
            filter: "grayscale(100%) brightness(0.6)",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.1) 10%, black 50%)",
            maskImage:
              "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.1) 10%, black 50%)",
          }}
        />
        {/* Bordeaux tone match overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "#7C1638", opacity: 0.6, mixBlendMode: "multiply" }}
        />
        {/* Horizontal fade from bordeaux into photo (Text area is now on the right) */}
        <div
          className="absolute right-0 top-0 h-full w-[60%]"
          style={{
            background:
              "linear-gradient(to left, #7C1638 0%, rgba(124,22,56,0.95) 40%, rgba(124,22,56,0) 100%)",
          }}
        />
        {/* Bottom fade for transition to next section */}
        <div
          className="absolute bottom-0 left-0 h-[180px] w-full"
          style={{
            background: "linear-gradient(to top, #7C1638 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl w-full flex justify-end">
        <div className="max-w-[650px] text-white reveal text-right flex flex-col items-end">
          <div className="eyebrow text-white/60 mb-8">ALMORE · INTELIGÊNCIA CONTÁBIL</div>
          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[44px] sm:text-6xl md:text-[80px]">
            Rápido.
            <br />
            Consultivo.
            <br />
            Sempre.
          </h1>
          <p className="mt-8 max-w-[520px] text-white/80 text-lg sm:text-xl leading-relaxed">
            A contabilidade que responde quando você precisa e enxerga muito além da obrigação.
          </p>
          <div className="mt-8 h-px w-[60px] bg-white/20" />
          <p className="mt-6 max-w-[520px] text-white/60 text-[18px] italic leading-relaxed">
            Empresas sem orientação contábil pagam, em média, 12% mais imposto do que deveriam.
          </p>
          <button
            onClick={scrollToContato}
            className="btn-on-dark mt-10 font-display font-bold text-base px-8 py-4 rounded-md"
          >
            Quero um diagnóstico gratuito
          </button>
        </div>
      </div>
    </section>
  );
}

function Dor() {
  return (
    <section className="bg-surface px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-[960px]">
        <div className="max-w-[760px] reveal">
          <div className="eyebrow text-gray-deep mb-6">ISSO TE PARECE FAMILIAR?</div>
          <h2 className="font-display font-bold text-ink text-[30px] sm:text-[40px] leading-[1.15] tracking-tight">
            Se você já viveu alguma dessas situações,{" "}
            <span className="text-[#7C1638]">a Almore foi feita para você.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {pains.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl p-7 bg-white shadow-card card-hover reveal border-l-[3px] border-[#7C1638] ${
                i === 4 ? "md:col-span-2" : ""
              }`}
            >
              <p className="text-ink text-[18px] font-medium leading-[1.6]">{p}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 mx-auto max-w-[640px] text-center text-gray-deep text-[18px] leading-relaxed reveal">
          Se você se reconheceu em algum desses pontos, não é coincidência. São as queixas mais comuns
          de empresários que ainda não encontraram uma contabilidade consultiva de verdade.
        </p>
      </div>
    </section>
  );
}

function QuemSomos() {
  return (
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-[800px] reveal">
        <div className="eyebrow text-gray-deep mb-6">QUEM SOMOS</div>
        <h2 className="font-display font-bold text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
          <span className="text-ink">Cumprir a obrigação é o mínimo.</span>
          <br />
          <span className="text-[#7C1638]">Nosso trabalho começa depois dela.</span>
        </h2>
        <p className="mt-8 text-[19px] leading-[1.75] text-gray-deep">
          Mais do que apurar impostos e entregar obrigações, a Almore traduz os números em direção:
          mostra onde dá para melhorar, antecipa o que vem pela frente e está perto quando você
          precisa decidir.
        </p>
        <div className="mt-10 bg-surface rounded-lg border-l-4 border-[#7C1638] px-6 py-5">
          <div className="eyebrow text-gray-mid mb-2">NOTA CONSULTIVA</div>
          <p className="font-display font-semibold text-[#7C1638] text-lg sm:text-xl leading-snug">
            Contabilidade que serve para decidir, não só para arquivar.
          </p>
        </div>
      </div>
    </section>
  );
}

function Diferencial() {
  return (
    <section className="px-5 py-24 sm:py-32" style={{ backgroundColor: "#7C1638" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl reveal">
          <div className="eyebrow text-white/60 mb-6">O NOSSO DIFERENCIAL</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Dois compromissos que sustentam tudo.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            {
              n: "01",
              t: "Atendimento rápido",
              d: "Você fala com quem conhece a sua empresa e recebe resposta ágil. Sem fila, sem burocracia, sem ficar sem retorno.",
            },
            {
              n: "02",
              t: "Sempre consultivo",
              d: "Não esperamos a pergunta. Antecipamos, alertamos e recomendamos em cada decisão que afeta o seu caixa.",
            },
          ].map((c) => (
            <div key={c.n} className="rounded-xl p-8 reveal" style={{ backgroundColor: "#68112F" }}>
              <div className="font-display font-extrabold text-[72px] leading-none text-white/15">{c.n}</div>
              <h3 className="mt-4 font-display font-bold text-white text-[22px]">{c.t}</h3>
              <p className="mt-3 text-white/80 text-base leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Numeros() {
  return (
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl reveal">
          <div className="eyebrow text-gray-deep mb-6">NÚMEROS QUE SUSTENTAM</div>
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Não é promessa. <span className="text-[#7C1638]">É histórico.</span>
          </h2>
        </div>
        {/* Três colunas só a partir de lg. Entre md e lg cada card ficaria com
            ~162px úteis, e "R$ 25 milhões" não cabe em nenhum tamanho legível
            — era daí que vinha a quebra de linha que desalinhava a faixa. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {numeros.map((n) => (
            <div
              key={n.valor}
              className="rounded-xl p-8 bg-surface shadow-card card-hover reveal"
            >
              {/* O tamanho acompanha a largura da tela em vez de ser fixo: é o
                  que garante que o maior dos três números caiba numa linha em
                  qualquer viewport. Com todos numa linha só, as legendas se
                  alinham sozinhas, sem precisar reservar altura. */}
              <div className="font-display font-extrabold text-[#7C1638] text-[clamp(30px,3vw,40px)] leading-none tracking-tight whitespace-nowrap">
                {n.valor}
              </div>
              <p className="mt-5 text-gray-deep text-base leading-relaxed">{n.legenda}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoTrabalhamos() {
  return (
    <section className="bg-surface px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl reveal">
          <div className="eyebrow text-gray-deep mb-6">COMO TRABALHAMOS</div>
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Estrutura no início, <span className="text-[#7C1638]">proximidade no dia a dia.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            {
              t: "Onboarding Premium 360º",
              d: "Diagnóstico inicial, reunião de alinhamento, organização de acessos e a lista certa de documentos. Você sabe o que esperar desde o primeiro dia.",
            },
            {
              t: "Atendimento consultivo",
              d: "Relatório consultivo mensal e atendimento próximo e personalizado, que acompanha o seu negócio e te responde rápido sempre que você precisa.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl p-8 bg-white shadow-card card-hover reveal">
              <h3 className="font-display font-bold text-[#7C1638] text-[22px]">{c.t}</h3>
              <p className="mt-3 text-gray-deep text-base leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Entregamos() {
  const cols = [
    {
      t: "Fiscal",
      items: [
        "Apuração de impostos",
        "Auditoria de classificação fiscal",
        "Entrega das obrigações acessórias",
        "Faturamento e alíquota efetiva",
      ],
    },
    {
      t: "Pessoal",
      items: [
        "Folha de pagamento e pró-labore",
        "Admissão e rescisão de funcionários",
        "Controle de férias e prazos",
      ],
    },
    {
      t: "Contábil",
      items: [
        "DRE",
        "Balancete",
        "Conciliações bancárias",
        "Escriturações",
        "Controle de mobilizado e depreciações",
      ],
    },
    {
      t: "Consultivo & gestão",
      items: [
        "Diagnóstico e reunião de alinhamento",
        "Relatório consultivo mensal",
        "Demonstração do Resultado gerencial",
        "Atendimento consultivo",
      ],
    },
  ];
  return (
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl reveal">
          <div className="eyebrow text-gray-deep mb-6">O QUE ENTREGAMOS</div>
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Fiscal, pessoal, contábil e consultivo. <span className="text-[#7C1638]">Tudo sob o mesmo cuidado.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((c) => (
            <div key={c.t} className="rounded-xl p-7 bg-surface card-hover reveal">
              <h3 className="font-display font-bold text-[#7C1638] text-[22px]">{c.t}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((it) => (
                  <li key={it} className="flex gap-3 text-gray-deep text-[19px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#7C1638]" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
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

function PlanCard({
  name,
  subtitle,
  items,
}: {
  name: string;
  subtitle: string;
  items: string[];
}) {
  const cor = coresPlano[name] ?? "#7C1638";
  return (
    <div
      className="plan-card rounded-xl p-8 bg-white flex flex-col reveal shadow-card border-t-[4px] transition-all duration-200 ease-out hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)]"
      style={{ borderTopColor: cor }}
    >
      <h3 className="flex items-center gap-3 font-display font-bold text-ink text-[28px]">
        <span
          aria-hidden
          className="h-3 w-3 rounded-full shrink-0"
          style={{ backgroundColor: cor }}
        />
        {name}
      </h3>
      <p className="mt-2 italic text-gray-mid text-[19px]">{subtitle}</p>
      <ul className="mt-6 space-y-3 flex-1">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-gray-deep text-[19px] leading-relaxed">
            <span className="text-[#7C1638] font-bold shrink-0">✓</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={scrollToContato}
        className="btn-primary mt-8 font-display font-semibold text-sm px-6 py-3 rounded-md w-full"
      >
        Quero este plano
      </button>
    </div>
  );
}

function Planos() {
  return (
    <section className="bg-surface px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl reveal">
          <div className="eyebrow text-gray-deep mb-6">PLANOS</div>
          <h2 className="font-display font-bold text-ink text-[28px] sm:text-[36px] leading-[1.15] tracking-tight">
            Escolha o plano certo para o seu negócio.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 items-stretch">
          <PlanCard name="Bronze" subtitle="Nosso atendimento essencial e completo." items={bronzeItems} />
          <PlanCard name="Prata" subtitle="Inclui tudo do Bronze, e acrescenta:" items={prataItems} />
          <PlanCard name="Ouro" subtitle="Inclui tudo do Prata, e acrescenta:" items={ouroItems} />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-[720px]">
        <div className="reveal">
          <div className="eyebrow text-gray-deep mb-6">DÚVIDAS FREQUENTES</div>
          <h2 className="font-display font-bold text-ink text-[30px] sm:text-[36px] leading-[1.15] tracking-tight">
            Perguntas que a gente recebe antes de começar.
          </h2>
        </div>
        <div className="mt-12 space-y-3 reveal">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="bg-surface rounded-[10px] overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 text-left px-6 py-5"
                >
                  <span className="font-display font-semibold text-ink text-[19px] leading-snug">
                    {f.q}
                  </span>
                  <span className="text-[#7C1638] text-2xl font-light shrink-0 leading-none w-6 text-center">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-[250ms] ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-gray-deep text-[18px] leading-[1.7]">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MudaParaVoce() {
  const items = [
    "Clareza nos números",
    "Decisão com base real",
    "Tranquilidade fiscal",
    "Tempo de volta para o seu negócio",
  ];
  return (
    <section className="px-5 py-24 sm:py-32" style={{ backgroundColor: "#7C1638" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl reveal">
          <div className="eyebrow text-white/60 mb-6">O QUE MUDA PARA VOCÊ</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            No fim, você ganha o que importa.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t} className="rounded-xl p-8 reveal" style={{ backgroundColor: "#68112F" }}>
              <p className="font-display font-semibold text-white text-xl leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reforma() {
  return (
    <section className="bg-surface px-5 py-24 sm:py-32">
      {/* Bloco centralizado, como as outras seções de texto corrido. A 720px a
          linha quebrava cedo demais e o conjunto ficava apertado; 900px é a
          mesma largura do formulário e dá respiro sem esticar a leitura. */}
      <div className="mx-auto max-w-[900px]">
        <div className="reveal">
          <div className="eyebrow text-gray-deep mb-6">À FRENTE</div>
          {/* text-balance distribui as palavras entre as linhas em vez de
              encher a primeira e jogar o resto na segunda — sem ele, "já"
              ficava órfão no fim da primeira linha. */}
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[40px] leading-[1.15] tracking-tight text-balance">
            A maior reforma tributária em décadas <span className="text-[#7C1638]">já começou.</span>
          </h2>
          <p className="mt-8 text-[19px] leading-[1.7] text-gray-deep">
            Os novos tributos sobre o consumo e as novas obrigações digitais já estão a caminho.
          </p>
          <p className="mt-5 text-[19px] leading-[1.7] text-gray-deep">
            Nós acompanhamos cada mudança e orientamos a sua empresa antes do prazo apertar.
          </p>
          <p className="mt-8 font-display font-semibold text-[#7C1638] text-xl leading-snug">
            Com a Almore, você não descobre de última hora.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-white/80 text-sm font-medium mb-2">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-white text-ink rounded-md px-4 py-3.5 text-[19px] border border-transparent focus:outline-none focus:ring-2 focus:ring-white/60 placeholder:text-gray-mid";

function Formulario() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [checks, setChecks] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  function toggle(item: string) {
    setChecks((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const data = new FormData(e.currentTarget);
    const required = ["nome", "empresa", "email", "telefone"];
    const errs: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!String(data.get(k) || "").trim()) errs[k] = true;
    });
    if (checks.length === 0) errs.expectativas = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const erro = await salvarSiteLead({
      nome: String(data.get("nome") || "").trim(),
      empresa: String(data.get("empresa") || "").trim(),
      email: String(data.get("email") || "").trim(),
      telefone: String(data.get("telefone") || "").trim(),
      expectativas: checks,
    });
    setSubmitting(false);

    if (erro) {
      console.error("[site_leads] falha ao gravar lead:", erro);
      toast.error("Não foi possível enviar sua mensagem. Tente novamente.");
      return;
    }
    setSent(true);
  }

  return (
    <section id="contato" className="px-5 py-24 sm:py-32" style={{ backgroundColor: "#7C1638" }}>
      <div className="mx-auto max-w-[900px]">
        <div className="text-center reveal">
          <div className="eyebrow text-white/60 mb-6">FALE COM A ALMORE</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Estamos à disposição.
          </h2>
          <p className="mt-5 text-white/80 text-[19px]">
            É só falar com a gente: é rápido, como tudo por aqui.
          </p>
        </div>

        {sent ? (
          <div className="mt-12 bg-white rounded-xl p-10 text-center shadow-card-hover reveal">
            <div className="eyebrow text-[#7C1638] mb-3">RECEBIDO</div>
            <p className="font-display font-bold text-ink text-2xl leading-snug">
              Mensagem recebida!
              <br />
              Em breve entraremos em contato.
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="mt-12 space-y-5 reveal" noValidate>
            <Field label="Nome completo *">
              <input name="nome" className={inputClass} placeholder="Seu nome" />
              {errors.nome && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
            </Field>
            <Field label="Nome da empresa *">
              <input name="empresa" className={inputClass} placeholder="Sua empresa" />
              {errors.empresa && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="E-mail *">
                <input name="email" type="email" className={inputClass} placeholder="voce@email.com" />
                {errors.email && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
              </Field>
              <Field label="Telefone / WhatsApp *">
                <input name="telefone" className={inputClass} placeholder="(00) 00000-0000" />
                {errors.telefone && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
              </Field>
            </div>

            <div>
              <span className="block text-white/80 text-sm font-medium mb-3">
                O que você espera de uma contabilidade? *
              </span>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 bg-white rounded-lg p-4">
                {expectations.map((opt) => {
                  const active = checks.includes(opt);
                  return (
                    <label key={opt} className="flex items-start gap-3 cursor-pointer">
                      <span
                        className={`mt-0.5 h-[18px] w-[18px] shrink-0 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${
                          active ? "bg-[#7C1638] border-[#7C1638]" : "bg-white border-[#d4d0cb]"
                        }`}
                      >
                        {active && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6.5L4.8 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={active}
                        onChange={() => toggle(opt)}
                      />
                      <span className="text-ink text-[18px] font-medium leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>
              {errors.expectativas && (
                <span className="text-white/90 text-xs mt-2 block">Selecione ao menos uma opção</span>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-on-dark w-full font-display font-bold text-base px-8 py-4 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Enviar mensagem"}
            </button>
          </form>
        )}
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
    <footer className="px-5 py-14" style={{ backgroundColor: "#1A1A1A" }}>
      <div className="mx-auto max-w-6xl text-center">
        <img
          src={logoWhite.url}
          alt="Almore Inteligência Contábil"
          className="h-10 w-auto mx-auto opacity-90"
        />
        <p className="mt-5 text-[#8a8a8a] text-sm">CNPJ: 67.132.226/0001-17</p>
        <div className="mt-8 mx-auto max-w-md h-px bg-white/15" />
        <p className="mt-6 text-[#7a7a7a] text-[19px]">
          © 2025 Almore Inteligência Contábil. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
