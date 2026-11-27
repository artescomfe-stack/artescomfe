-- Todos os preços em R$ 0,00: a administração vai cadastrar os valores reais pelo painel.
-- O banco passa a aceitar preço 0 (o painel continua pedindo um preço maior que zero ao salvar).
alter table public.products drop constraint if exists products_price_check;
alter table public.products add constraint products_price_check check (price >= 0);

update public.products set price = 0, old_price = null, installment_value = null;
