-- Formulário da home passou a coletar apenas nome, empresa, e-mail, telefone
-- e expectativas. Os campos abaixo continuam na tabela (nada é apagado),
-- apenas deixam de ser obrigatórios para os novos leads.
ALTER TABLE public.leads ALTER COLUMN regime_tributario DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN tipo_servico DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN mensagem DROP NOT NULL;
