-- Painel — etapa 2: o site passa a ler categorias, textos e imagens do banco.
-- Categorias ganham a imagem do topo da página delas; os textos/fotos que estavam fixos no código
-- viram o ponto de partida (o painel edita a partir daqui).
alter table public.categories add column if not exists banner_image text;
comment on column public.categories.banner_image is 'Foto do topo da página da categoria (paisagem). Vazio = foto padrão da loja.';
comment on column public.categories.home_image  is 'Foto redonda do atalho da categoria na página inicial.';

update public.categories c set
  banner_image   = v.banner_image,
  banner_eyebrow = v.eyebrow,
  banner_title   = v.title,
  banner_text    = v.text,
  home_card      = v.home_card,
  home_card_order= v.home_order,
  home_image     = v.home_image
from (values
  ('nossa-senhora',   '/img/banners/colecao-nossa-senhora.webp', 'Coleção Nossa Senhora', E'Maria, Mãe\ne Rainha do lar.', 'Diversas representações de Nossa Senhora para a sua devoção — Aparecida, Fátima, Guadalupe e muito mais.', true, 1, '/img/produtos/06-02-480.webp'),
  ('santos',          '/img/banners/santos.webp',               'Santos',                E'Amigos de Deus,\nexemplos de fé.', 'Imagens dos santos que intercedem por nós, com acabamentos ricos em detalhes.', true, 2, '/img/produtos/03-02-480.webp'),
  ('sagrada-familia', '/img/banners/sagrada-familia.webp',      'Sagrada Família',       E'Jesus, Maria\ne José.', 'A família de Nazaré para abençoar o seu lar — linda o ano inteiro e especial no Natal.', true, 3, '/img/produtos/08-02-480.webp'),
  ('jesus-cristo',    '/img/banners/jesus-cristo.webp',         'Jesus Cristo',          E'O Caminho,\na Verdade e a Vida.', 'Imagens para meditar a vida e a Paixão de Cristo e renovar a fé todos os dias.', true, 4, '/img/produtos/07-02-480.webp'),
  ('quadros',         '/img/banners/presentes-de-fe.webp',      'Quadros e placas',      E'A fé em destaque\nna sua parede.', 'Quadros e placas em relevo para abençoar a casa, o escritório ou presentear.', false, 0, null)
) as v(slug, banner_image, eyebrow, title, text, home_card, home_order, home_image)
where c.slug = v.slug;
