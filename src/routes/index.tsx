import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almore Inteligência Contábil — Rápido. Consultivo. Sempre." },
      {
        name: "description",
        content:
          "Contabilidade 100% digital, consultiva e ágil. Conheça os planos Bronze, Prata e Ouro da Almore Inteligência Contábil.",
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

const regimes = ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Ainda não tenho"];
const tipos = ["MEI", "ME — Microempresa", "EPP — Empresa de Pequeno Porte", "Ltda.", "S/A", "Ainda não tenho"];

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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function LandingPage() {
  useReveal();
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <QuemSomos />
        <Diferencial />
        <ComoTrabalhamos />
        <Entregamos />
        <Planos />
        <MudaParaVoce />
        <Reforma />
        <Formulario />
      </main>
      <Footer />
    </div>
  );
}

function scrollToContato() {
  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex flex-col leading-tight">
          <span className="font-display font-bold text-[#7C1638] text-lg tracking-tight">ALMORE</span>
          <span className="font-display font-medium text-[10px] text-gray-mid tracking-[0.18em]">
            INTELIGÊNCIA CONTÁBIL
          </span>
        </a>
        <button
          onClick={scrollToContato}
          className="btn-primary font-display font-semibold text-sm px-5 py-2.5 rounded-md"
        >
          Falar com a Almore
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[90vh] flex items-center justify-center px-5 py-24"
      style={{
        background: "linear-gradient(160deg, #7C1638 0%, #7C1638 55%, #68112F 100%)",
      }}
    >
      <div className="max-w-3xl text-center text-white reveal">
        <div className="eyebrow text-white/70 mb-8">ALMORE · INTELIGÊNCIA CONTÁBIL</div>
        <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[44px] sm:text-6xl md:text-[78px]">
          Rápido.
          <br />
          Consultivo.
          <br />
          Sempre.
        </h1>
        <p className="mt-8 mx-auto max-w-[560px] text-white/85 text-lg sm:text-xl leading-relaxed">
          A contabilidade que responde quando você precisa e enxerga muito além da obrigação.
        </p>
        <button
          onClick={scrollToContato}
          className="btn-on-dark mt-10 font-display font-semibold text-base px-8 py-4 rounded-md"
        >
          Quero conhecer a Almore
        </button>
      </div>
    </section>
  );
}

function QuemSomos() {
  return (
    <section className="bg-surface px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-[800px] reveal">
        <div className="eyebrow text-gray-deep mb-6">QUEM SOMOS</div>
        <h2 className="font-display font-bold text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
          <span className="text-ink">Cumprir a obrigação é o mínimo.</span>
          <br />
          <span className="text-[#7C1638]">Nosso trabalho começa depois dela.</span>
        </h2>
        <p className="mt-8 text-[17px] leading-[1.7] text-gray-deep">
          Mais do que apurar impostos e entregar obrigações, a Almore traduz os números em direção:
          mostra onde dá para melhorar, antecipa o que vem pela frente e está perto quando você
          precisa decidir.
        </p>
        <div className="mt-10 bg-white rounded-lg border-l-4 border-[#7C1638] px-6 py-5 shadow-card">
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
          <div className="eyebrow text-white/70 mb-6">O NOSSO DIFERENCIAL</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
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
            <div
              key={c.n}
              className="rounded-xl p-8 reveal"
              style={{ backgroundColor: "#68112F" }}
            >
              <div className="font-display font-extrabold text-[60px] leading-none text-white/25">
                {c.n}
              </div>
              <h3 className="mt-4 font-display font-bold text-white text-[22px]">{c.t}</h3>
              <p className="mt-3 text-white/80 text-base leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoTrabalhamos() {
  return (
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl reveal">
          <div className="eyebrow text-gray-deep mb-6">COMO TRABALHAMOS</div>
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
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
            <div key={c.t} className="rounded-xl p-8 bg-surface card-hover reveal">
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
    <section className="bg-surface px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl reveal">
          <div className="eyebrow text-gray-deep mb-6">O QUE ENTREGAMOS</div>
          <h2 className="font-display font-bold text-ink text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
            Fiscal, pessoal e consultivo. <span className="text-[#7C1638]">Tudo sob o mesmo cuidado.</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cols.map((c) => (
            <div key={c.t} className="rounded-xl p-7 bg-white shadow-card card-hover reveal">
              <h3 className="font-display font-bold text-[#7C1638] text-[22px]">{c.t}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((it) => (
                  <li key={it} className="flex gap-3 text-gray-deep text-[15px] leading-relaxed">
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

function PlanCard({
  name,
  subtitle,
  items,
  featured,
  prefix,
}: {
  name: string;
  subtitle: string;
  items: string[];
  featured?: boolean;
  prefix?: string;
}) {
  return (
    <div
      className={`rounded-xl p-8 bg-surface flex flex-col card-hover reveal ${
        featured ? "border-t-[3px] border-[#7C1638] shadow-card-hover" : "shadow-card"
      }`}
    >
      <h3 className="font-display font-bold text-ink text-[28px]">{name}</h3>
      <p className="mt-2 italic text-gray-mid text-[15px]">{subtitle}</p>
      {prefix && (
        <p className="mt-5 font-display font-semibold text-[#7C1638] text-xs uppercase tracking-wider">
          {prefix}
        </p>
      )}
      <ul className="mt-5 space-y-3 flex-1">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-gray-deep text-[15px] leading-relaxed">
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
    <section className="bg-white px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl reveal">
          <div className="eyebrow text-gray-deep mb-6">PLANOS</div>
          <h2 className="font-display font-bold text-ink text-[28px] sm:text-[38px] leading-[1.15] tracking-tight">
            Escolha o plano certo para o seu negócio.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 items-stretch">
          <PlanCard
            name="Bronze"
            subtitle="Nosso atendimento essencial e completo."
            items={bronzeItems}
          />
          <PlanCard
            name="Prata"
            subtitle="Inclui tudo do Bronze, e acrescenta:"
            items={prataItems}
            featured
            prefix="Tudo do Bronze, mais:"
          />
          <PlanCard
            name="Ouro"
            subtitle="Inclui tudo do Prata, e acrescenta:"
            items={ouroItems}
            prefix="Tudo do Prata, mais:"
          />
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
          <div className="eyebrow text-white/70 mb-6">O QUE MUDA PARA VOCÊ</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
            No fim, você ganha o que <span className="text-white/70">+</span> importa.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((t) => (
            <div
              key={t}
              className="rounded-xl p-8 reveal"
              style={{ backgroundColor: "#68112F" }}
            >
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
      <div className="mx-auto max-w-[720px] reveal">
        <div className="eyebrow text-gray-deep mb-6">À FRENTE</div>
        <h2 className="font-display font-bold text-ink text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
          A maior reforma tributária em décadas{" "}
          <span className="text-[#7C1638]">já começou.</span>
        </h2>
        <p className="mt-8 text-[17px] leading-[1.7] text-gray-deep">
          Os novos tributos sobre o consumo e as novas obrigações digitais já estão a caminho.
        </p>
        <p className="mt-5 text-[17px] leading-[1.7] text-gray-deep">
          Nós acompanhamos cada mudança e orientamos a sua empresa antes do prazo apertar.
        </p>
        <p className="mt-8 font-display font-semibold text-[#7C1638] text-xl leading-snug">
          Com a Almore, você não descobre de última hora.
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-white/80 text-sm font-medium mb-2">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-white text-ink rounded-md px-4 py-3.5 text-[15px] border border-transparent focus:outline-none focus:ring-2 focus:ring-white/60 placeholder:text-gray-mid";

function Formulario() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [checks, setChecks] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  function toggle(item: string) {
    setChecks((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const required = ["nome", "email", "telefone", "regime", "tipo"];
    const errs: Record<string, boolean> = {};
    required.forEach((k) => {
      if (!String(data.get(k) || "").trim()) errs[k] = true;
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(true);
  }

  return (
    <section id="contato" className="px-5 py-24 sm:py-32" style={{ backgroundColor: "#7C1638" }}>
      <div className="mx-auto max-w-[560px]">
        <div className="text-center reveal">
          <div className="eyebrow text-white/70 mb-6">FALE COM A ALMORE</div>
          <h2 className="font-display font-bold text-white text-[32px] sm:text-[44px] leading-[1.15] tracking-tight">
            Estamos à disposição.
          </h2>
          <p className="mt-5 text-white/80 text-[17px]">
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
            <Field label="Nome da empresa">
              <input name="empresa" className={inputClass} placeholder="Sua empresa" />
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
                O que você espera de uma contabilidade?{" "}
                <span className="text-white/60">(opcional)</span>
              </span>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 bg-white rounded-md p-4">
                {expectations.map((opt) => {
                  const active = checks.includes(opt);
                  return (
                    <label
                      key={opt}
                      className="flex items-start gap-3 cursor-pointer"
                    >
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
                      <span className="text-ink text-[14px] font-medium leading-snug">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Field label="Regime tributário *">
              <select name="regime" className={inputClass} defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {regimes.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.regime && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
            </Field>

            <Field label="Tipo de empresa *">
              <select name="tipo" className={inputClass} defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {tipos.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.tipo && <span className="text-white/90 text-xs mt-1 block">Campo obrigatório</span>}
            </Field>

            <Field label="Mensagem">
              <textarea
                name="mensagem"
                rows={4}
                className={inputClass}
                placeholder="Conta um pouco sobre o que você precisa..."
              />
            </Field>

            <button
              type="submit"
              className="btn-on-dark w-full font-display font-bold text-base px-8 py-4 rounded-md"
            >
              Enviar mensagem
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 py-14" style={{ backgroundColor: "#1A1A1A" }}>
      <div className="mx-auto max-w-6xl text-center">
        <div className="font-display font-bold text-white tracking-[0.15em] text-sm">
          ALMORE · INTELIGÊNCIA CONTÁBIL
        </div>
        <p className="mt-3 text-[#8a8a8a] text-sm">CNPJ: 67.132.226/0001-17</p>
        <div className="mt-8 mx-auto max-w-md h-px bg-white/15" />
        <p className="mt-6 text-[#7a7a7a] text-[13px]">
          © 2025 Almore Inteligência Contábil. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
