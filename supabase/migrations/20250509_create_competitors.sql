-- Create competitors table for storing competitor analysis data
CREATE TABLE IF NOT EXISTS competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  founded_year INTEGER,
  key_mechanisms JSONB,
  acquisition_channels JSONB,
  strengths JSONB,
  weaknesses JSONB,
  locations JSONB,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read competitors" ON competitors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert competitors" ON competitors
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update competitors" ON competitors
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete competitors" ON competitors
  FOR DELETE TO authenticated USING (true);

-- Insert Școala de Șah București (CSU)
INSERT INTO competitors (name, website, description, founded_year, key_mechanisms, acquisition_channels, strengths, weaknesses, locations, social_media) VALUES (
  'Școala de Șah București (CSU)',
  'scoaladesah.ro',
  'Clubul Sportiv Universitar de Șah București - fondat în 2012, top club național de juniori din 2019',
  2012,
  '[
    {"rank": 1, "name": "Vouchere Primării 250 RON/lună", "description": "Programele Sport pentru fiecare (S1) și Oferim constanță (S3) - aproape gratuit pentru părinți eligibili", "year": "2022-2023"},
    {"rank": 2, "name": "Lecția Gratuită de Probă", "description": "Barieră zero - părintele evaluează fit-ul copil-instructor fără cost", "year": "2012"},
    {"rank": 3, "name": "Ecosistem Turnee pe Vârstă", "description": "Funnel 12+ ani: Cupa Prichindel → Cupa Școlii → Annual Chess Contest → Divizii Naționale", "year": "2012-2025"},
    {"rank": 4, "name": "Lock-in FRȘAH", "description": "Legitimarea creează cost de switching similar telecom", "year": "2022+"},
    {"rank": 5, "name": "Cursuri în Grădinițe/Școli", "description": "B2B2C - instituția aduce volumul, copilul descoperă șahul în mediul zilnic", "year": "2015-2026"},
    {"rank": 6, "name": "Recomandare 10% + Frați 25%", "description": "Monetizare word-of-mouth cu discount marginal", "year": "2020+"},
    {"rank": 7, "name": "Multi-locație + Online + Tabere", "description": "5 sedii + Zoom + tabere vară/iarnă - format pentru orice profil client", "year": "2020-2025"}
  ]'::jsonb,
  '[
    {"channel": "Lecție gratuită", "segment": "Copii 5-14 ani", "cost": "Mediu"},
    {"channel": "Vouchere primării", "segment": "Părinți cost-conscious", "cost": "Foarte mic"},
    {"channel": "Cursuri grădinițe/școli", "segment": "Copii 3-10 ani", "cost": "Mic"},
    {"channel": "Tabere vară/iarnă", "segment": "Entry point copii", "cost": "Mediu"},
    {"channel": "Turnee interne", "segment": "Copii performanță + adulți", "cost": "Mic"},
    {"channel": "Recomandări", "segment": "Familii existente", "cost": "Foarte mic"},
    {"channel": "Online Zoom", "segment": "Copii + adulți țară", "cost": "Mic"},
    {"channel": "Corporate workshops", "segment": "Adulți B2B", "cost": "Mediu"}
  ]'::jsonb,
  '["5 sedii în Sectoarele 1, 2, 3, 4, 6", "Summer Chess Camp - 10 ediții, 700+ copii", "Cupa CSU Online - ediția 50 în feb 2025", "Podcast Șah la Dublu pentru adulți", "Alexandru Sachilaru - Maestru FIDE 2024"]'::jsonb,
  '["Instagram subutilizat (2.526 vs 23.572 Facebook)", "Lipsă paid ads (Google/Meta)", "Poziționare performanță lasă teren pentru șah recreativ", "Segment adulți insuficient developat", "Dependență de programele primăriilor"]'::jsonb,
  '[
    {"name": "Tineretului", "sector": 4},
    {"name": "Grigorescu", "sector": 1},
    {"name": "1 Mai", "sector": 1, "address": "str. Arad nr. 10"},
    {"name": "Iancului", "sector": 2},
    {"name": "Gorjului", "sector": 6}
  ]'::jsonb,
  '{"facebook": {"name": "Scoala De Sah", "likes": 23572, "active_users": 1587}, "instagram": {"handle": "@scoaladesah.ro", "followers": 2526, "posts": 1820}}'::jsonb
);

-- Insert Academia de Șah București (ACS Oxygen)
INSERT INTO competitors (name, website, description, founded_year, key_mechanisms, acquisition_channels, strengths, weaknesses, locations, social_media) VALUES (
  'Academia de Șah București (ACS Oxygen)',
  'academiadesah.ro',
  'Auto-poziționat ca cel mai puternic club sportiv de șah din România - 23 medalii la Naționale 2024',
  2013,
  '[
    {"rank": 1, "name": "Palmares Campioni Naționali", "description": "23 medalii 2024 (12 AUR + 4 ARGINT + 7 BRONZ), 17 podiumuri echipe - cel mai puternic argument de vânzare", "year": "2024"},
    {"rank": 2, "name": "Antrenori MI/CM/IS afișați explicit", "description": "MI Gabriel Mateuța, MI Cătălin Cărmăciu, CM Tudor Ristea - credibilitate instant", "year": "2018-2025"},
    {"rank": 3, "name": "Vouchere 3 Primării (incl. S2 exclusiv)", "description": "Sector 1, 2 (exclusiv!), 3 (suspendat) - 250 RON/lună, bază largă subvenționată", "year": "2022-2026"},
    {"rank": 4, "name": "Parteneriat Mega Mall", "description": "Grand Prix MegaChess lunar - vizibilitate masivă, spațiu subvenționat, ediția VIII în 2025", "year": "2018"},
    {"rank": 5, "name": "Catalog Online + Plată Card", "description": "WooCommerce + Meta Ads remarketing - friction zero pentru părinți tehnici", "year": "2023"},
    {"rank": 6, "name": "Ecosistem Dual Turnee", "description": "MegaChess (fizic) + ChessCraft Arena (tornelo.com online) - Grand Prix-uri cumulative", "year": "2023-2024"},
    {"rank": 7, "name": "Centre 4 Sectoare + Grădinițe", "description": "S1, S2, S3, S5 (S5 exclusiv!) + Șah în grădinițe - acoperire complementară CSU", "year": "2020"}
  ]'::jsonb,
  '[
    {"channel": "Palmares național", "segment": "Părinți ambițioși", "cost": "Foarte mic"},
    {"channel": "Vouchere primării S1+S2", "segment": "Părinți cost-conscious", "cost": "Foarte mic"},
    {"channel": "Grand Prix MegaChess", "segment": "Copii + descoperire publică", "cost": "Mic"},
    {"channel": "ChessCraft Arena online", "segment": "Copii din toată țara", "cost": "Foarte mic"},
    {"channel": "Cupa Academiei", "segment": "Copii cursanți - retenție", "cost": "Mic"},
    {"channel": "Grădinițe + afterschool", "segment": "Copii 3-10 ani", "cost": "Mic"},
    {"channel": "Tabere multi-locație", "segment": "Copii 6-14 ani", "cost": "Mediu"},
    {"channel": "Catalog online + card", "segment": "Părinți tehnici", "cost": "Foarte mic"}
  ]'::jsonb,
  '["23 medalii Campionatele Naționale 2024", "Antrenori cu titluri internaționale (2x MI, CM, IS)", "Sector 2 exclusiv (CSU nu e prezent)", "Parteneriat unic Mega Mall - vizibilitate lunară", "Infrastructură digitală matură (WooCommerce + Meta Ads)", "37.000 followers Facebook (cel mai mare din București)"]'::jsonb,
  '["Instagram subdezvoltat (394 vs 37.000 Facebook)", "Sectoarele 4 și 6 lipsă", "Comunicare adulți aproape inexistentă", "Dependență de palmaresul anual", "Sector 3 suspendat din 2024-2025", "Fără podcast/conținut educațional propriu"]'::jsonb,
  '[
    {"name": "Pța. Domenii", "sector": 1},
    {"name": "Educației (sediu principal)", "sector": 2, "address": "str. Educației nr. 32B"},
    {"name": "Ozana", "sector": 3},
    {"name": "Drumul Sării", "sector": 5}
  ]'::jsonb,
  '{"facebook": {"name": "Academia de Sah", "followers": 37000, "rating": "100% recommend", "reviews": 46}, "instagram": {"handle": "@academiadesah", "followers": 394, "posts": 74}, "twitter": {"handle": "@AcademiadeSah", "posts": 126}}'::jsonb
);
