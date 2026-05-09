-- Insert Saint Louis Chess Club (STLCC)
INSERT INTO competitors (name, website, description, founded_year, key_mechanisms, acquisition_channels, strengths, weaknesses, locations, social_media) VALUES (
  'Saint Louis Chess Club (STLCC)',
  'saintlouischessclub.org',
  'Cel mai influent club de șah din lume - Chess Capital of the United States (2014), 2.000+ membri, 45.000+ elevi, 20+ GM relocați',
  2008,
  '[
    {"rank": 1, "name": "Patron unic: Rex Sinquefield ($50M+)", "description": "Co-fondator Dimensional Fund Advisors ($230B+ AUM), a investit $50M+ in sah pana in 2018 - face totul posibil, niciun alt club nu are capital comparabil", "year": "2007-2026"},
    {"rank": 2, "name": "Gazda U.S. Championship (din 2009)", "description": "Gazduieste anual U.S. Championship + U.S. Womens Championship + U.S. Junior - cicluri de presa gratuite, aliniere USCF, credibilitate pentru fundraising", "year": "2009-2026"},
    {"rank": 3, "name": "Sinquefield Cup - Grand Chess Tour", "description": "Singurul stop american pe Grand Chess Tour, top 8-10 GM mondial anual - editia 2014 cel mai puternic turneu din istorie (ELO mediu 2802)", "year": "2013-2026"},
    {"rank": 4, "name": "Chess Capital of the United States", "description": "Rezolutie Senat SUA 2014 - recunoastere guvernamentala imposibil de replicat, semnal permanent de calitate pentru sponsori si parteneri", "year": "2014"},
    {"rank": 5, "name": "Operatiune broadcast profesionista", "description": "YouTube + Twitch cu GM Yasser Seirawan, GM Maurice Ashley, GM Peter Svidler - acopera si evenimente non-STLCC (FIDE Candidates 2026)", "year": "2013-2026"},
    {"rank": 6, "name": "Scholastic Outreach Initiative", "description": "45.000+ elevi serviti din 2008, 100+ scoli anual, 1.000+ membership-uri USCF gratuite - pipeline viitori membri + legitimitate non-profit", "year": "2008-2026"},
    {"rank": 7, "name": "Magnetism talent - 20+ GM relocati", "description": "Nakamura, Caruana, Wesley So + altii s-au mutat in St. Louis - flywheel auto-intaritor: GM atrag GM, prestigiu se compune anual", "year": "2008-2026"}
  ]'::jsonb,
  '[
    {"channel": "Sinquefield seed capital", "segment": "Fundatie - face totul posibil", "cost": "Foarte mic"},
    {"channel": "U.S. Championship venue", "segment": "Presa + USCF + donatori", "cost": "Mediu"},
    {"channel": "Sinquefield Cup / Grand Chess Tour", "segment": "Audienta broadcast globala", "cost": "Mare"},
    {"channel": "YouTube + Twitch broadcast", "segment": "Vizualizatori globali -> membri", "cost": "Mic"},
    {"channel": "Scholastic Outreach (100+ scoli)", "segment": "Elevi + comunitate + donatori", "cost": "Mediu"},
    {"channel": "Resident Grandmaster program", "segment": "Membri avansati", "cost": "Mediu"},
    {"channel": "Ladies Knight weekly social", "segment": "Membre femei", "cost": "Mic"}
  ]'::jsonb,
  '["Patron unic Rex Sinquefield - $50M+ investiti, stabilitate pe 20 ani", "Chess Capital of the United States - rezolutie Senat 2014", "20+ GM relocati in St. Louis (Nakamura, Caruana, Wesley So)", "Broadcast profesionist - echipa GM comentatori fara egal mondial", "45.000+ elevi serviti + 100+ scoli partenere anual", "80+ turnee/an, 1.400+ turnee cumulate, 69.000+ partide cotate", "Expansiune 30.000 sq ft in curs - studio productie dedicat"]'::jsonb,
  '["Dependenta de patron unic - Rex Sinquefield are 81 ani in 2026", "Scandal Ramirez 2022-2023 - Lichess a reluat suportul abia in iunie 2025", "Concentrare geografica - totul in Central West End, fara diversificare", "Doar 2.000 membri vs audienta broadcast de milioane - conversie slaba", "80+ turnee/an - risc de oboseala staff si erori operationale", "Fara e-commerce/merchandise la scara audientei (vs Chess.com)"]'::jsonb,
  '[
    {"name": "Central West End, St. Louis", "sector": 0, "address": "4657 Maryland Avenue, St. Louis, MO 63108"}
  ]'::jsonb,
  '{"facebook": {"name": "Saint Louis Chess Club", "followers": 64706}}'::jsonb
);
