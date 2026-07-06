## Objetivo
Ativar a Lovable Cloud e salvar os dados enviados pelo formulário de contato numa tabela do banco, sem notificações.

## Passos

1. **Ativar a Lovable Cloud**
   - Provisiona banco de dados, autenticação e funções server-side.

2. **Criar tabela `leads`** (via migration)
   Colunas:
   - `id` (uuid, PK, default gen_random_uuid())
   - `created_at` (timestamptz, default now())
   - `nome` (text, obrigatório)
   - `email` (text, obrigatório)
   - `telefone` (text, obrigatório)
   - `empresa` (text, obrigatório)
   - `regime_tributario` (text, obrigatório)
   - `tipo_servico` (text, obrigatório)
   - `expectativas` (text, obrigatório)
   - `mensagem` (text, obrigatório)

   RLS + GRANTs:
   - RLS ativado.
   - `GRANT INSERT ON public.leads TO anon, authenticated` (para o formulário público inserir).
   - Policy: `INSERT` permitido para `anon` e `authenticated`.
   - Sem policy de SELECT — ninguém lê pelo Data API (dados ficam protegidos; você consulta pelo painel da Cloud).

3. **Server function `submitLead`** (`src/lib/leads.functions.ts`)
   - Valida todos os campos com Zod (todos obrigatórios, com limites de tamanho, email válido).
   - Insere no banco usando o client publishable server-side.
   - Retorna `{ ok: true }` ou erro tratado.

4. **Integrar no formulário** (`src/routes/index.tsx`)
   - Marcar todos os campos como `required` no HTML.
   - Substituir o "envio simulado" por chamada real via `useServerFn(submitLead)`.
   - Manter o toast "Mensagem recebida!" após sucesso.
   - Exibir erro amigável em caso de falha.

## O que NÃO faz
- Sem envio de email de notificação.
- Sem painel de leitura interno (leads consultados diretamente na Cloud → Tabela `leads`).