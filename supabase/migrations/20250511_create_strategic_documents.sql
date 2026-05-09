-- Create strategic_documents table
CREATE TABLE IF NOT EXISTS strategic_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'internal', 'competitor', 'research'
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE strategic_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read strategic_documents" ON strategic_documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert strategic_documents" ON strategic_documents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update strategic_documents" ON strategic_documents
  FOR UPDATE TO authenticated USING (true);

-- Insert The Square Master 2026
INSERT INTO strategic_documents (title, slug, description, category, content) VALUES (
  'THE SQUARE - Document Master 2026',
  'the-square-master-2026',
  'Analiza profunda a clubului + evaluarea site-urilor + recomandari strategice',
  'internal',
  '{
    "dashboard": {
      "years_operating": 2,
      "initial_investment_eur": 8000,
      "instagram_followers": 2302,
      "instagram_posts": 358,
      "titled_coaches": 2,
      "locations": 1,
      "websites": 2,
      "open_editions": 1
    },
    "critical_actions": [
      {"priority": "P0", "action": "Rezolvare SSR pe thesquare.ro", "description": "Site-ul principal e SPA fara rendering, Google nu indexeaza continutul. Pierdere potentiala: 50-80% trafic organic.", "deadline": "Iunie 2026"},
      {"priority": "P1", "action": "Aplicare vouchere primarii", "description": "Sectorul 1 (Sport pentru fiecare) si Sectorul 2 (Daruim speranta) - depunere dosar pana in septembrie 2026 pentru aprobare 2027.", "deadline": "Sept. 2026"},
      {"priority": "P1", "action": "Recrutare al treilea antrenor titrat", "description": "Echipa de 2 antrenori (Georgiana + Cristiana) e plafonul actual. Risc burnout in 2026.", "deadline": "Q3 2026"},
      {"priority": "P1", "action": "Lansare pachete corporate B2B", "description": "Segment B2B (team building 1.500-5.000 EUR/eveniment) e cel mai mare canal nedezvoltat. Pitch list 30 companii Q3 2026.", "deadline": "Q3 2026"},
      {"priority": "P2", "action": "Pregatire Open THE SQUARE Editia II", "description": "Q4 2026, format diferit (blitz only / editie feminina / editie iarna). Identificare 2-3 sponsori potentiali.", "deadline": "Q4 2026"}
    ],
    "swot": {
      "strengths": [
        "Fondatoare WNM cu palmares incontestabil",
        "Echipa completa (sport + design + IT)",
        "Brand vizual deja iconic",
        "Comunitate cool autentica (Serile de sah)",
        "Site bilingv RO/EN",
        "Open THE SQUARE 2026 - turneu omologat",
        "Pozitionare unica (urban tanar 25-40)"
      ],
      "weaknesses": [
        "Capital limitat (8.000 EUR initial)",
        "Echipa mica (2 antrenori titrati)",
        "Un singur sediu (centru Bucuresti)",
        "Lipsa voucherelor primarii",
        "Brand tanar in comunitatea sahista",
        "Site principal SPA - bug SEO critic",
        "Capacitate revenue limitata"
      ],
      "opportunities": [
        "Boom-ul sahului romanesc (Superbet, FRSAH)",
        "Adulti urbani 25-40 = segment subdeservit",
        "Corporate B2B (team building 2-5K EUR)",
        "Vouchere primarii 2027 (S1, S2)",
        "Open THE SQUARE - brand recurent",
        "Lectii online cu expati (site bilingv)",
        "Parteneriate spatii lifestyle"
      ],
      "threats": [
        "Chess.com / ChessKid - quasi-monopol global",
        "ACS Oxygen / CSU pot copia pozitionarea",
        "Plateauarea efectului Queen''s Gambit",
        "Inflatia preturilor centru Bucuresti",
        "Recesiune = primul abonament taiat",
        "Burnout fondatori (echipa mica)",
        "Risc spatiu unic (chirie, vecini)"
      ]
    },
    "kpis": [
      {"name": "Followers Instagram", "current": 2302, "target_dec_2026": 3500, "target_dec_2027": 6000},
      {"name": "Cursanti activi", "current": "60-90", "target_dec_2026": "120-150", "target_dec_2027": "250-350"},
      {"name": "Cursanti adulti", "current": "20-40", "target_dec_2026": "60+", "target_dec_2027": "120+"},
      {"name": "Revenue lunar EUR", "current": "5-8K", "target_dec_2026": "10-12K", "target_dec_2027": "20-25K"},
      {"name": "Evenimente B2B / luna", "current": "0-1", "target_dec_2026": "2-3", "target_dec_2027": "4-6"},
      {"name": "Antrenori titrati", "current": 2, "target_dec_2026": 3, "target_dec_2027": "4-5"},
      {"name": "Sedii", "current": 1, "target_dec_2026": 1, "target_dec_2027": "1-2"},
      {"name": "Editii Open", "current": 1, "target_dec_2026": 2, "target_dec_2027": "3-4"},
      {"name": "Vouchere primarii", "current": "Niciuna", "target_dec_2026": "Dosar depus", "target_dec_2027": "1-2 sectoare"},
      {"name": "Mentiuni media", "current": 2, "target_dec_2026": "4-5 cumulat", "target_dec_2027": "8-10 cumulat"}
    ],
    "scenarios": [
      {"name": "A. Boutique Premium", "philosophy": "Mici, preturi sus, calitate", "investment_eur": "0-5K", "risk": "Mic", "students_12mo": "80-120", "revenue_12mo": "8-15K", "margin": "40-50%"},
      {"name": "B. Scale Strategic", "philosophy": "Al doilea sediu, mai multi antrenori", "investment_eur": "30-50K", "risk": "Mediu", "students_12mo": "250-400", "revenue_12mo": "20-35K", "margin": "25-35%", "recommended": true},
      {"name": "C. Brand & Franchise", "philosophy": "Brand replicabil, fransiza", "investment_eur": "60-100K", "risk": "Mare", "students_12mo": "500+", "revenue_12mo": "40K+", "margin": "5-15%"}
    ],
    "roadmap": {
      "Q2_2026": [
        "Decizie + brief SSR pe thesquare.ro",
        "Pagina Despre antrenori + colectare 6-8 testimoniale",
        "Foto profesionale Georgiana + Cristiana",
        "Tarife afisate clar pe site",
        "Post-mortem Open THE SQUARE 2026"
      ],
      "Q3_2026": [
        "Implementare SSR LIVE",
        "Plata cu cardul (Stripe / Mobilpay)",
        "3 pachete corporate B2B + pitch list 30 companii",
        "Recrutare al treilea antrenor titrat",
        "Lansare blog (2 articole initiale)",
        "DEPUNERE DOSAR vouchere primarii",
        "Newsletter signup"
      ],
      "Q4_2026": [
        "Open THE SQUARE Editia II (format diferit)",
        "Workshop premium #1 cu MM invitat",
        "Versiune EN openthesquare.ro",
        "Tinta: 3.500 followers IG (+50% YoY)",
        "Pregatire decizie strategica Q1 2027"
      ],
      "Q1_2027": [
        "DECIZIE CRITICA scenariu A/B/C",
        "Raspuns voucher primarii",
        "Daca voucher aprobat: campanie agresiva parinti",
        "Daca scenariul B: identificare a doua locatie",
        "Daca scenariul C: pitch deck pentru investitori"
      ]
    },
    "golden_reasons": [
      {"rank": 1, "title": "Fondatoare cu palmares incontestabil", "description": "Georgiana Stanciu (WNM) - 4 titluri nationale (2006, 2011, 2016, 2018) + locul 8 Mondial 2016 Khanty-Mansiysk + locul 9 European 2009"},
      {"rank": 2, "title": "Echipa completa: sah + design + IT + comunicare", "description": "Georgiana (sport + pedagogie) + Cristiana (Royal College of Art Londra) + Andrei Bitca (IT) + echipa design"},
      {"rank": 3, "title": "Inspiratie premium - scoala ruseasca Khanty-Mansiysk", "description": "Modelul mental: bibliotecile imense, antrenori specializati pe subiecte. Standard international la scala mica in Bucuresti"},
      {"rank": 4, "title": "Investitia in DESIGN ca diferentiator competitiv", "description": "Pictura murala Maria Love + brand Flavia Achim + interior Maria Gindac. Niciun club traditional nu are calitatea estetica"},
      {"rank": 5, "title": "Multi-segmente reale - copii + adulti, individual + grup", "description": "Cursuri copii 50min, adulti 1h 20min + Seri de sah. Adultii urbani 25-40 = segment subdeservit unic in Bucuresti"},
      {"rank": 6, "title": "Distributie organica prin Instagram + media earned", "description": "2.302 followers + 358 postari fara promovare platita. Articol HotNews + Zile si Nopti. Comunitatea cool genereaza retentie"},
      {"rank": 7, "title": "Open THE SQUARE 2026 - propriul turneu omologat FRSAH", "description": "24-26 aprilie 2026, Nod Makerspace. Sistem elvetian, 7 runde rapid + 7 runde blitz. Tranzitia la organizator oficial"}
    ],
    "founders": [
      {"name": "Georgiana Stanciu", "role": "Fondator principal, antrenor, WNM", "achievements": ["Locul I CN fete sub 8 (2006)", "Locul I CN fete sub 12 (2011)", "Locul I CN fete sub 18 (2016)", "Locul I CN fete sub 20 (2018)", "Locul 9 CE clasic Muntenegru 2009", "Locul 8 CM clasic Khanty-Mansiysk 2016"], "background": "Din 2017 instructor CSU Bucuresti"},
      {"name": "Cristiana Stanciu", "role": "Co-fondator, manager operational", "achievements": ["Sportiva CSM Craiova", "Premii la CN clasic, rapid si blitz"], "background": "Master Royal College of Art Londra (Service Design), copywriter"},
      {"name": "Andrei Bitca", "role": "Co-fondator, IT", "background": "Lucreaza in IT, recent pasionat de sah. Tehnologie, infrastructura digitala"}
    ],
    "site_evaluation": {
      "thesquare_ro": {"seo_technical": "3/10", "ux_design": "8/10", "mobile": "8/10", "localization": "9/10", "critical_issue": "SPA fara SSR - continutul nu e indexabil"},
      "openthesquare_ro": {"seo_technical": "9/10", "ux_design": "9/10", "mobile": "9/10", "localization": "4/10", "note": "HTML static, server-rendered, excelent"}
    }
  }'::jsonb
);

-- Insert Saint Louis Chess Club Analysis
INSERT INTO strategic_documents (title, slug, description, category, content) VALUES (
  'Saint Louis Chess Club - Analiza Model International',
  'saint-louis-chess-club-analysis',
  'Analiza celui mai influent club de sah din lume - model de referinta pentru The Square',
  'competitor',
  '{
    "overview": {
      "name": "Saint Louis Chess Club",
      "website": "saintlouischessclub.org",
      "address": "4657 Maryland Avenue, St. Louis, MO 63108",
      "founded": 2008,
      "founder": "Rex Sinquefield",
      "designation": "Chess Capital of the United States (2014 Senate resolution)"
    },
    "key_metrics": {
      "active_members": "2,000+",
      "membership_price": "$15/month",
      "tournaments_per_year": "80+",
      "total_tournaments": "1,400+",
      "rated_games": "69,000+",
      "players_hosted": "35,000+",
      "students_served": "45,000+",
      "schools_served_annually": "100+",
      "free_uscf_memberships": "1,000+",
      "grandmasters_relocated": "20+",
      "original_facility_sqft": 6000,
      "expansion_target_sqft": 30000,
      "facebook_followers": 64706,
      "sinquefield_investment": "$50,000,000+"
    },
    "golden_reasons": [
      {"rank": 1, "title": "Single-patron foundation: Rex & Jeanne Sinquefield ($50M+ committed)", "description": "Co-founder of Dimensional Fund Advisors ($230B+ AUM). This is the single most important variable - no other chess club has comparable patron capital."},
      {"rank": 2, "title": "Owning the U.S. Championships venue (since 2009)", "description": "De facto national championship venue - free annual press cycles, USCF alignment, fundraising credibility."},
      {"rank": 3, "title": "Sinquefield Cup as global PR engine (since 2013)", "description": "Only U.S. stop on Grand Chess Tour. 2014 edition was strongest tournament in history (avg ELO 2802)."},
      {"rank": 4, "title": "Congressional recognition: Chess Capital of the United States (2014)", "description": "U.S. Senate resolution - extraordinarily rare, impossible to replicate. Permanent quality signal."},
      {"rank": 5, "title": "World-class broadcast operation (YouTube + Twitch + GM commentators)", "description": "GM Yasser Seirawan, GM Maurice Ashley, GM Peter Svidler, GM Evgenij Miroshnichenko. Default English-language home of professional chess commentary."},
      {"rank": 6, "title": "Scholastic Outreach Initiative - 45,000+ students served since 2008", "description": "100+ schools annually, 1,000+ free USCF memberships. Pipeline for future members + community legitimacy + donor narrative."},
      {"rank": 7, "title": "Talent magnetism - 20+ grandmasters now live in St. Louis", "description": "Nakamura, Caruana, Wesley So. Self-reinforcing flywheel: GMs attract more GMs, prestige compounds annually."}
    ],
    "stakeholder_segments": [
      {"segment": "Paying members", "count": "2,000+", "price": "$15/month"},
      {"segment": "Scholastic students", "count": "45,000+", "price": "Free/subsidized"},
      {"segment": "Corporate/foundation donors", "examples": "U.S. Bank Foundation, Caperion, Explore St. Louis"},
      {"segment": "Broadcast audience", "count": "Millions/year", "channels": "YouTube, Twitch"},
      {"segment": "Elite chess talent", "count": "20+ GMs", "examples": "Nakamura, Caruana, Wesley So"}
    ],
    "acquisition_channels": [
      {"channel": "Sinquefield seed + ongoing patronage", "stakeholder": "Foundational funding", "cost": "Zero - donor pays"},
      {"channel": "U.S. Championship venue", "stakeholder": "Press, USCF, donors", "cost": "Medium - operational hosting"},
      {"channel": "Sinquefield Cup / Grand Chess Tour", "stakeholder": "Global broadcast audience", "cost": "High - donor funded"},
      {"channel": "Cairns Cup / womens chess", "stakeholder": "Female players + diversity donors", "cost": "Medium - donor funded"},
      {"channel": "YouTube + Twitch broadcast operation", "stakeholder": "Global viewers -> members + donors", "cost": "Low - production at club"},
      {"channel": "Scholastic Outreach Initiative", "stakeholder": "Students + community + donors", "cost": "Medium - staff and materials"},
      {"channel": "Free first visit + classes for members", "stakeholder": "Walk-in members", "cost": "Low"},
      {"channel": "Resident Grandmaster program", "stakeholder": "Members + advanced players", "cost": "Medium - GM stipends"},
      {"channel": "$100,000 womens GM award", "stakeholder": "Female GMs + media", "cost": "High - performance-based"},
      {"channel": "Webster + SLU university partnerships", "stakeholder": "Collegiate talent pipeline", "cost": "Low - institutional alignment"}
    ],
    "vulnerabilities": [
      "Single-patron dependency - Rex Sinquefield is 81 in 2026. Succession planning critical.",
      "Reputational risk from 2023 Ramirez scandal - Lichess only resumed support June 2025.",
      "Geographic concentration - all operations in Central West End, no diversification.",
      "Member base small relative to scale - 2,000 members vs millions in broadcast audience.",
      "Heavy event cycle creates fatigue risk - 80+ tournaments/year.",
      "Limited retail e-commerce monetization despite broadcast reach."
    ],
    "timeline": [
      {"year": 2007, "event": "Rex Sinquefield establishes Chess Club and Scholastic Center of Saint Louis"},
      {"year": 2008, "event": "Club opens at 4657 Maryland Avenue - 6,000 sq ft facility"},
      {"year": 2009, "event": "Begins hosting U.S. Championship and U.S. Womens Championship"},
      {"year": 2010, "event": "USCF names STLCC Chess Club of the Year. World Chess Hall of Fame moves to St. Louis"},
      {"year": 2013, "event": "Launch of Sinquefield Cup - only U.S. stop on Grand Chess Tour"},
      {"year": 2014, "event": "U.S. Senate designates St. Louis as Chess Capital of the United States"},
      {"year": 2017, "event": "Launch of Saint Louis Rapid & Blitz"},
      {"year": 2018, "event": "Rex Sinquefield estimates $50M total chess philanthropy"},
      {"year": 2019, "event": "Launch of Cairns Cup for top female players"},
      {"year": 2024, "event": "$100,000 award announced for next 5 women to become GMs"},
      {"year": 2025, "event": "Lichess resumes broadcast support. Clutch Chess Legends: Kasparov vs Anand"},
      {"year": 2026, "event": "30,000 sq ft expansion underway with state-of-the-art production studio"}
    ],
    "lessons_for_the_square": [
      "Scholastic outreach creates future members + community legitimacy + donor narrative",
      "Broadcast operation globalizes reach beyond local membership",
      "Recurring signature events (like Sinquefield Cup) build brand recognition",
      "Professional commentary team differentiates from competition",
      "University partnerships create talent pipeline",
      "Corporate donor diversification reduces single-source dependency"
    ]
  }'::jsonb
);
