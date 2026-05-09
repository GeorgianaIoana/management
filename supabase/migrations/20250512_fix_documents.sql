-- Remove Saint Louis from strategic_documents (it's already in competitors)
DELETE FROM strategic_documents WHERE slug = 'saint-louis-chess-club-analysis';

-- Insert The Square Analiza Profunda
INSERT INTO strategic_documents (title, slug, description, category, content) VALUES (
  'THE SQUARE - Analiză Profundă',
  'the-square-analiza-profunda',
  'Cum surorile Stanciu au creat un club de sah cool urban cu 8.000 EUR - si unde poate ajunge',
  'internal',
  '{
    "positioning": {
      "tagline": "Locul cool unde si se joaca sah",
      "target_segment": "Adulti urbani 25-40 ani + copii cu parinti cool",
      "differentiator": "DESIGN + ESTETICA + SOCIAL (nu performanta, nu volum, nu sponsori)",
      "age_years": 2,
      "initial_investment_eur": 8000,
      "comparison_note": "Saint Louis: $50M+, CSU ASE: buget universitar"
    },
    "golden_reasons": [
      {"rank": 1, "title": "Fondatoare cu palmares incontestabil - Georgiana Stanciu (WNM)", "description": "4 titluri nationale (2006, 2011, 2016, 2018) + locul 8 Mondial 2016 Khanty-Mansiysk. Din 2017 instructor CSU Bucuresti.", "year": "2006-2018"},
      {"rank": 2, "title": "Echipa completa: sah + design + IT + comunicare", "description": "Georgiana (sport), Cristiana (Royal College of Art Londra Service Design + copywriter), Andrei Bitca (IT). Plus Maria Gindac (interior), Flavia Achim (brand), Maria Love (pictura murala).", "year": "2024"},
      {"rank": 3, "title": "Inspiratie premium - scoala ruseasca Khanty-Mansiysk", "description": "Vizita 2016: biblioteci imense, sali elegante, antrenori specializati pe subiecte (Sicilia, finaluri pioni). Standard international la scala mica in Bucuresti.", "year": "2016"},
      {"rank": 4, "title": "Investitia in DESIGN ca diferentiator competitiv", "description": "Din 8.000 EUR, parte semnificativa in interior design + brand + pictura murala Maria Love. Spatiu cosy fresh primitor vs sali de scoala anii 80.", "year": "2024"},
      {"rank": 5, "title": "Multi-segmente reale - copii + adulti, individual + grup", "description": "Cursuri copii 50min, adulti 1h20min, lectii individuale, Seri de sah pentru socializare. Adultii 25-45 = segment ENORM si subdeservit.", "year": "2024"},
      {"rank": 6, "title": "Distributie organica prin Instagram + media earned", "description": "Articol HotNews 21 aprilie 2024 (Gruia Dragomir) = media earned gratuit. Jurnalistul a descoperit clubul prin algoritm Instagram.", "year": "2024"},
      {"rank": 7, "title": "Open THE SQUARE 2026 - propriul turneu omologat FRSAH", "description": "24-26 aprilie 2026, Nod Makerspace. Sah rapid + blitz, sistem elvetian, omologat FRSAH. Tranzitie de la club nou la organizator oficial.", "year": "2026"}
    ],
    "comparison_table": {
      "headers": ["Indicator", "THE SQUARE", "CSU Bucuresti", "ACS Oxygen", "CSU ASE"],
      "rows": [
        {"indicator": "An fondare", "the_square": "2024", "csu": "2012", "acs": "~2010", "csu_ase": "2017"},
        {"indicator": "Investitie initiala", "the_square": "8.000 EUR", "csu": "n.d.", "acs": "n.d.", "csu_ase": "Buget ASE"},
        {"indicator": "Sedii", "the_square": "1", "csu": "5", "acs": "4-5", "csu_ase": "1"},
        {"indicator": "Segment principal", "the_square": "Adulti + copii urbani", "csu": "Copii performanta", "acs": "Copii performanta", "csu_ase": "Seniori elita"},
        {"indicator": "Diferentiator", "the_square": "DESIGN + SOCIAL", "csu": "Volum + traditie", "acs": "Performanta + scala", "csu_ase": "Anand + Olimpici"},
        {"indicator": "Vouchere primarii", "the_square": "NU inca", "csu": "DA (S1, S3)", "acs": "DA (S1, S2)", "csu_ase": "N/A"},
        {"indicator": "Componenta sociala adulti", "the_square": "CENTRALA (Seri de sah)", "csu": "Slaba", "acs": "Slaba", "csu_ase": "Inexistenta"}
      ]
    },
    "business_model": {
      "courses_kids": {"duration_min": 50, "taught_by": "Cristiana (studii pedagogice)", "format": "Grupe pe nivel, Google Classroom pentru teme"},
      "courses_adults": {"duration_min": 80, "taught_by": "Georgiana (WNM)", "format": "Strategii si deschideri avansate (ex: Apararea Siciliana)"},
      "individual_lessons": {"margin": "Maxima", "leverage": "Titlul WNM al Georgianei"},
      "chess_evenings": {"name": "Seri de sah", "description": "Socializare, networking, prelungire in gradina Random Space. LIFESTYLE community building.", "benefits": ["Retentie", "Achizitie prin recomandari", "Continut Instagram organic", "Diferentiere fata de cluburi traditionale"]},
      "tournament": {"name": "Open THE SQUARE", "first_edition": "24-26 aprilie 2026", "location": "Nod Makerspace", "format": "Rapid + Blitz, sistem elvetian", "accreditation": "FRSAH"}
    },
    "acquisition_channels": [
      {"channel": "Instagram", "type": "Organic", "description": "Algoritmul recomanda continut vizual (pictura murala, atmosfera) publicului relevant"},
      {"channel": "Media earned (HotNews)", "type": "Free PR", "value_equiv_eur": "3.000-5.000", "description": "Articol portret 21 aprilie 2024, Gruia Dragomir"},
      {"channel": "Word-of-mouth", "type": "Organic", "description": "Comunitatea cool genereaza retentie si recomandari"},
      {"channel": "Vecinatatea Random Space", "type": "Cross-traffic", "description": "Random Space atrage publicul corect (urbani, creativi, IT-isti)"},
      {"channel": "Site bilingv RO/EN", "type": "Segment expati", "description": "Adulti straini din Bucuresti, corporatii multinationale"},
      {"channel": "Open THE SQUARE", "type": "Funnel cross-cluburi", "description": "Jucatori de la alte cluburi descopera spatiul"}
    ],
    "strengths": [
      "Credibilitate sportiva (Georgiana WNM, 4 titluri nationale, loc 8 Mondial)",
      "Capital cultural (Cristiana - Royal College of Art Londra Service Design)",
      "Capital relational (comunitate + Random Space + experienta Georgiana la CSU)",
      "Alegere strategica de nisa (adulti urbani 25-40, evita lupta cu CSU/ACS Oxygen)"
    ],
    "vulnerabilities": [
      {"issue": "Capital limitat", "detail": "8.000 EUR vs 50-100k EUR per locatie ACS Oxygen sau buget universitar CSU ASE"},
      {"issue": "Echipa mica", "detail": "3 fondatori, 2 antrenori titrati. Limitare cursanti, risc burnout, dependenta de 2 persoane"},
      {"issue": "Lipsa vouchere primarii", "detail": "Diferenta 1.500 EUR/an pentru parinti. Pierdere segment buget conservator"},
      {"issue": "Dependenta sediu unic", "detail": "Probleme chirie/vecini = relocare costisitoare. Parinti Pipera/Otopeni prefera sedii multiple"},
      {"issue": "Brand neconsolidat in comunitatea serioasa", "detail": "Pentru jucatori cu rating FIDE, THE SQUARE e inca nou si neincercat"},
      {"issue": "Sezonalitate cool", "detail": "Model depinde de tendinte culturale (Queens Gambit). Daca valul se inverseaza, modelul fragil"},
      {"issue": "Concurenta Chess.com", "detail": "Adult ocupat are alternativa $5-15/luna online vs $100-300 EUR/luna THE SQUARE"}
    ],
    "opportunities": [
      {"opportunity": "Vouchere primarii 2027", "action": "Aplicare Sector 1 (Sport pentru fiecare) + Sector 2 (Daruim speranta)", "priority": "MAXIMA"},
      {"opportunity": "Corporate B2B", "action": "Pachete team building 2.000-5.000 EUR/eveniment pentru agentii, startup-uri, IT", "priority": "INALTA"},
      {"opportunity": "Al doilea antrenor titrat", "action": "Recrutare FM/IM/MM part-time, rating 2300+", "priority": "INALTA"},
      {"opportunity": "Workshop-uri premium", "action": "Masterclass cu MM invitati (Pavlov, Foisor), ticket 200-400 EUR", "priority": "MEDIE"},
      {"opportunity": "Open THE SQUARE recurent", "action": "2+ editii/an (rapid, clasic, femei, copii)", "priority": "MEDIE"},
      {"opportunity": "Al doilea spatiu", "action": "Sector 1 (Aviatorilor/Domenii) sau Sector 4, sau pop-up Squares in cafenele", "priority": "MEDIE"},
      {"opportunity": "Merchandising", "action": "Tricouri, mug-uri, table marcate THE SQUARE, postere pictura murala", "priority": "SCAZUTA"}
    ],
    "timeline": [
      {"year": 2006, "event": "Georgiana castiga CN fete sub 8 (Predeal) dupa 10 luni antrenamente"},
      {"year": 2009, "event": "Locul 9 CE clasic Muntenegru"},
      {"year": 2011, "event": "Locul I CN fete sub 12 (Voineasa)"},
      {"year": 2015, "event": "Locul 4 Mondialele scolare Thailanda"},
      {"year": 2016, "event": "MOMENT FONDATOR: Georgiana viziteaza scoala Khanty-Mansiysk la CM 2016. Locul 8 CM. CN fete sub 18 (Calimanesti)"},
      {"year": 2017, "event": "Georgiana devine instructor CSU Bucuresti"},
      {"year": 2018, "event": "CN fete sub 20 (Calimanesti) - al 4-lea titlu national"},
      {"year": "2021-2023", "event": "Boom sah Romania: FRSAH Vlad Ardeleanu, Superbet Chess Classic, efect Queens Gambit. Cristiana finalizeaza master RCA Londra"},
      {"year": "Inceputul 2024", "event": "LANSARE THE SQUARE. Investitie 8.000 EUR. Echipa: Georgiana, Cristiana, Andrei + design team"},
      {"year": "Aprilie 2024", "event": "Articol HotNews (Gruia Dragomir) - media earned"},
      {"year": "2024-2025", "event": "Consolidare: cursuri grupe, lectii individuale, Google Classroom, Seri de sah recurente"},
      {"year": "24-26 apr 2026", "event": "PRIMA EDITIE Open THE SQUARE - turneu omologat FRSAH"}
    ],
    "founders_detail": [
      {
        "name": "Georgiana Stanciu",
        "role": "Fondator principal, antrenor, WNM",
        "palmares_national": ["Locul I CN fete sub 8 (2006, Predeal)", "Locul I CN fete sub 12 (2011, Voineasa)", "Locul I CN fete sub 18 (2016, Calimanesti)", "Locul I CN fete sub 20 (2018, Calimanesti)"],
        "palmares_international": ["Locul 9 CE clasic Muntenegru 2009", "Locul 4 Mondialele scolare Thailanda 2015", "Locul 8 CM clasic Rusia 2016 (Khanty-Mansiysk)"],
        "experience": "Din 2017 instructor CSU Bucuresti - cunoaste ecosistemul din interior"
      },
      {
        "name": "Cristiana Stanciu",
        "role": "Co-fondator, manager operational",
        "background": ["Sportiva CSM Craiova (premii CN clasic, rapid, blitz)", "Master Royal College of Art Londra (Service Design)", "Studii pedagogice", "Profesie: copywriter"],
        "responsibilities": "Preda grupe copii, gestioneaza spatiul, comunicare, administrare documente, promovare"
      },
      {
        "name": "Andrei Bitca",
        "role": "Co-fondator, IT",
        "background": "Lucreaza in IT, recent pasionat de sah",
        "responsibilities": "Tehnologie, infrastructura digitala (Google Classroom, site, sisteme inscriere online)"
      }
    ],
    "design_team": [
      {"name": "Maria Gindac", "role": "Designer interior", "contribution": "A gandit spatiul cu pictura murala in centru ca punct de focus"},
      {"name": "Flavia Achim", "role": "Brand designer", "contribution": "Viziunea pe termen lung pentru comunicare online si offline coerenta"},
      {"name": "Maria Love", "role": "Artist", "contribution": "Pictura murala care a devenit reper Instagram"}
    ],
    "conclusion": "THE SQUARE este unul dintre cele mai inteligente proiecte antreprenoriale din sahul romanesc. Cu 8.000 EUR, fondatorii au construit produs cu pozitionare clara (urban tanar, cool, lifestyle), brand vizual iconic, si tranzitie spre organizator turnee oficiale. Avantajul real: alinierea echipei atipice (WNM + Royal College of Art + IT) cu nisa subdeservita (adulti 25-40) si filosofie premium Khanty-Mansiysk. Pe 5-10 ani, THE SQUARE poate deveni referinta pentru club de sah modern in Europa Centrala."
  }'::jsonb
);
