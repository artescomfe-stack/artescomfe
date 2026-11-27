-- Seed: configurações da loja + catálogo inicial da Artes com Fé (gerado de src/products.js)
-- ATENÇÃO: preços provisórios — confirmar com a loja.
insert into public.store_settings (id) values (1) on conflict (id) do nothing;

insert into public.products (code, slug, name, type, line, category_label, finish, swatch, material, dimensions, price, old_price, available, is_new, photo_align, sort_order, description) values
  ('01', 'sao-padre-pio', 'São Padre Pio', 'santo', 'imagens', 'Santos', 'Bronze', 'linear-gradient(135deg,#6b4a2b,#a57a4c)', null, null, 159.9, null, true, false, null, 10, 'Fé, oração e confiança em Deus. 🙏

São Padre Pio de Pietrelcina, com o hábito capuchinho e a mão erguida em bênção. O acabamento em bronze envelhecido realça cada dobra do hábito e o terço preso à cintura.

Uma presença serena para o seu oratório, que lembra todos os dias: "Reze, espere e não se preocupe."

Leve para casa a sua e deixe a fé morar em cada detalhe. ✨'),
  ('02', 'nossa-senhora-aparecida', 'Nossa Senhora Aparecida', 'maria', 'imagens', 'Nossa Senhora', 'Ouro velho', 'linear-gradient(135deg,#5c4422,#b08d4f)', null, null, 169.9, null, true, true, null, 20, 'A Padroeira do Brasil, com toda a beleza que ela merece. 💛

Imagem de Nossa Senhora Aparecida com manto ricamente trabalhado em relevo, coroa e acabamento ouro velho. As mãos postas e o semblante sereno trazem paz para qualquer ambiente.

Perfeita para o oratório, para a sala ou para presentear quem é devoto da Mãe Aparecida.

Que ela cubra o seu lar com o seu manto. 🙏'),
  ('03', 'sao-miguel-arcanjo', 'São Miguel Arcanjo', 'santo', 'imagens', 'Santos', 'Cobre', 'linear-gradient(135deg,#7a3f22,#c27a4b)', null, null, 169.9, null, true, true, null, 30, 'O príncipe da milícia celeste, defensor nas batalhas. ⚔️

São Miguel Arcanjo com espada erguida e asas abertas, em acabamento cobre envelhecido que valoriza os detalhes da armadura e do manto.

Uma imagem forte e cheia de movimento, para quem busca proteção e coragem na caminhada da fé.

São Miguel Arcanjo, defendei-nos no combate. 🙏'),
  ('04', 'nossa-senhora-de-fatima-perolas', 'Nossa Senhora de Fátima (Pérolas)', 'maria', 'imagens', 'Nossa Senhora', 'Branco perolado', 'linear-gradient(135deg,#f7f2ea,#d9c9a8)', null, null, 179.9, null, true, true, null, 40, 'Delicadeza e devoção em cada pérola. 🤍

Nossa Senhora de Fátima em branco perolado, com manto bordado de pérolas e strass, detalhes dourados e o terço entre as mãos. Uma peça que ilumina o ambiente.

Linda no oratório, na cabeceira ou como presente para uma pessoa especial.

Rezai o terço todos os dias. ✨'),
  ('05', 'santa-teresinha-do-menino-jesus', 'Santa Teresinha do Menino Jesus', 'santo', 'imagens', 'Santos', 'Marfim e dourado', 'linear-gradient(135deg,#efe6d2 55%,#c9a24a 55%)', null, null, 149.9, null, true, false, null, 50, 'A santa das rosas e do pequeno caminho. 🌹

Santa Teresinha do Menino Jesus segurando o crucifixo e um buquê de rosas vermelhas, com hábito em marfim e acabamento dourado.

Uma imagem doce e cheia de significado, que lembra que o amor está nas pequenas coisas.

"Quero passar o meu céu fazendo o bem sobre a terra." 🙏'),
  ('06', 'nossa-senhora-de-guadalupe', 'Nossa Senhora de Guadalupe', 'maria', 'imagens', 'Nossa Senhora', 'Colorida', 'conic-gradient(#b32c35 0 33%,#2f6b4f 0 66%,#d8b14a 0)', null, null, 159.9, null, true, false, null, 60, 'A Mãe das Américas, cheia de cor e ternura. 🌹

Nossa Senhora de Guadalupe com o manto verde estrelado, vestido vermelho e o resplendor dourado ao redor, pintada à mão com riqueza de detalhes.

Uma imagem vibrante, que traz alegria e proteção para o seu lar.

"Não estou eu aqui, que sou tua Mãe?" 💛'),
  ('07', 'senhor-dos-passos', 'Senhor dos Passos', 'jesus', 'imagens', 'Jesus Cristo', 'Cobre', 'linear-gradient(135deg,#7a3f22,#c27a4b)', null, null, 189.9, null, true, false, null, 70, 'O amor que carrega a cruz por nós. ✝️

Imagem do Senhor dos Passos, Jesus carregando a cruz a caminho do Calvário, com coroa de espinhos e acabamento cobre que realça a expressão e o movimento da cena.

Uma peça marcante para meditar a Paixão de Cristo e renovar a fé.

Por Sua dolorosa Paixão, tende misericórdia de nós. 🙏'),
  ('08', 'sagrada-familia', 'Sagrada Família', 'familia', 'imagens', 'Sagrada Família', 'Marfim e dourado', 'linear-gradient(135deg,#efe6d2 55%,#c9a24a 55%)', null, null, 189.9, null, true, true, null, 80, 'Jesus, Maria e José, a família que inspira a sua. 🤍

A Sagrada Família em acabamento marfim com detalhes dourados: São José, Nossa Senhora em oração e o Menino Jesus na manjedoura.

Linda o ano inteiro e especial no Natal — um presente perfeito para abençoar um novo lar.

Sagrada Família, protegei as nossas famílias. ✨'),
  ('09', 'sao-jorge', 'São Jorge', 'santo', 'imagens', 'Santos', 'Dourado', 'linear-gradient(135deg,#a8842f,#e6c56a)', null, null, 199.9, null, true, false, null, 90, 'O santo guerreiro, firme na fé. 🐎

São Jorge montado em seu cavalo, vencendo o dragão, em acabamento dourado que destaca a armadura, a capa e cada detalhe da cena.

Uma imagem imponente para quem pede força, proteção e coragem no dia a dia.

Salve Jorge! 🙏'),
  ('10', 'nossa-senhora-de-fatima-azul-e-dourado', 'Nossa Senhora de Fátima (Azul e Dourado)', 'maria', 'imagens', 'Nossa Senhora', 'Azul e dourado', 'linear-gradient(135deg,#a9c6dd 55%,#c9a24a 55%)', null, null, 189.9, null, true, false, null, 100, 'Um céu de ternura para o seu oratório. 💙

Nossa Senhora de Fátima com vestido azul-claro, manto dourado cravejado de strass, mãos em oração e base dourada trabalhada sobre as nuvens.

Uma peça de acabamento sofisticado, daquelas que viram o centro do ambiente.

O meu Imaculado Coração triunfará. ✨'),
  ('11', 'sagrada-familia-cobre', 'Sagrada Família (Cobre)', 'familia', 'imagens', 'Sagrada Família', 'Cobre', 'linear-gradient(135deg,#7a3f22,#c27a4b)', null, null, 179.9, null, true, false, null, 110, 'O aconchego do lar de Nazaré. 🤎

Sagrada Família em acabamento cobre: Maria e José juntinhos, envolvendo o Menino Jesus com carinho. Uma cena delicada, cheia de afeto.

Ideal para a sala, para o oratório ou para presentear um casal que está começando uma família.

Onde há amor, Deus está. 🙏'),
  ('12', 'pieta-nossa-senhora-da-piedade', 'Pietà — Nossa Senhora da Piedade', 'maria', 'imagens', 'Nossa Senhora', 'Dourado', 'linear-gradient(135deg,#a8842f,#e6c56a)', null, null, 219.9, null, true, false, null, 120, 'O amor de Mãe aos pés da cruz. 💛

A Pietà, Nossa Senhora da Piedade com Jesus nos braços, em acabamento dourado sobre base escura. Uma cena de profunda emoção e beleza.

Uma peça de arte sacra para contemplar, rezar e lembrar que a dor também é caminho de redenção.

Mãe dolorosa, rogai por nós. 🙏')
on conflict (code) do nothing;

insert into public.product_images (product_id, path, thumb_path, alt, position)
select p.id, v.path, v.thumb, p.name || ' — foto ' || (v.pos + 1), v.pos
from (values
  ('01', '/img/produtos/01-01.webp', '/img/produtos/01-01-480.webp', 0),
  ('01', '/img/produtos/01-02.webp', '/img/produtos/01-02-480.webp', 1),
  ('01', '/img/produtos/01-03.webp', '/img/produtos/01-03-480.webp', 2),
  ('02', '/img/produtos/02-01.webp', '/img/produtos/02-01-480.webp', 0),
  ('02', '/img/produtos/02-02.webp', '/img/produtos/02-02-480.webp', 1),
  ('02', '/img/produtos/02-03.webp', '/img/produtos/02-03-480.webp', 2),
  ('03', '/img/produtos/03-01.webp', '/img/produtos/03-01-480.webp', 0),
  ('03', '/img/produtos/03-02.webp', '/img/produtos/03-02-480.webp', 1),
  ('04', '/img/produtos/04-01.webp', '/img/produtos/04-01-480.webp', 0),
  ('04', '/img/produtos/04-02.webp', '/img/produtos/04-02-480.webp', 1),
  ('04', '/img/produtos/04-03.webp', '/img/produtos/04-03-480.webp', 2),
  ('05', '/img/produtos/05-01.webp', '/img/produtos/05-01-480.webp', 0),
  ('05', '/img/produtos/05-02.webp', '/img/produtos/05-02-480.webp', 1),
  ('06', '/img/produtos/06-01.webp', '/img/produtos/06-01-480.webp', 0),
  ('06', '/img/produtos/06-02.webp', '/img/produtos/06-02-480.webp', 1),
  ('07', '/img/produtos/07-01.webp', '/img/produtos/07-01-480.webp', 0),
  ('07', '/img/produtos/07-02.webp', '/img/produtos/07-02-480.webp', 1),
  ('08', '/img/produtos/08-01.webp', '/img/produtos/08-01-480.webp', 0),
  ('08', '/img/produtos/08-02.webp', '/img/produtos/08-02-480.webp', 1),
  ('09', '/img/produtos/09-01.webp', '/img/produtos/09-01-480.webp', 0),
  ('09', '/img/produtos/09-02.webp', '/img/produtos/09-02-480.webp', 1),
  ('10', '/img/produtos/10-01.webp', '/img/produtos/10-01-480.webp', 0),
  ('10', '/img/produtos/10-02.webp', '/img/produtos/10-02-480.webp', 1),
  ('10', '/img/produtos/10-03.webp', '/img/produtos/10-03-480.webp', 2),
  ('11', '/img/produtos/11-01.webp', '/img/produtos/11-01-480.webp', 0),
  ('11', '/img/produtos/11-02.webp', '/img/produtos/11-02-480.webp', 1),
  ('12', '/img/produtos/12-01.webp', '/img/produtos/12-01-480.webp', 0),
  ('12', '/img/produtos/12-02.webp', '/img/produtos/12-02-480.webp', 1)
) as v(code, path, thumb, pos)
join public.products p on p.code = v.code
on conflict (product_id, position) do nothing;
