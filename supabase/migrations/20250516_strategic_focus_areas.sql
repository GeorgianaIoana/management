-- Strategic Focus Areas 2026-2027 - 3 Ideas for Revenue Maximization
-- This document contains the strategic plan with 3 focus ideas for The Square

INSERT INTO strategic_documents (title, slug, description, category, content) VALUES (
  'THE SQUARE - Plan Strategic 2026-2027',
  'the-square-focus-strategic-2026',
  '3 Idei de Focus pentru Maximizarea Veniturilor',
  'internal',
  '{
    "current_situation": {
      "revenue_monthly_eur": "5-8K",
      "students_active": "60-90",
      "initial_investment_eur": 8000,
      "team_size": 7,
      "team_members": ["Georgiana Stanciu (WNM)", "Cristiana Stanciu", "Vlad Ghita", "Vajda Levente", "Adriana Stanciu", "Mustafa Hamdan", "Calin Ghiorghiu"],
      "locations": 1,
      "unique_differentiator": "DESIGN + SOCIAL",
      "note": "Niciun competitor nu are acest focus"
    },
    "competition": [
      {
        "name": "CSU București",
        "revenue_monthly_eur": "20-36K",
        "focus": "Copii + Volume",
        "vulnerability": "Instagram slab, adulți neglijați"
      },
      {
        "name": "ACS Oxygen",
        "revenue_monthly_eur": "24-42K",
        "focus": "Performanță",
        "vulnerability": "Zero prezență adulți"
      },
      {
        "name": "CSU ASE",
        "revenue_monthly_eur": "Sponsorizări",
        "focus": "Elită",
        "vulnerability": "Nu vând cursuri retail"
      },
      {
        "name": "Șah în Școală",
        "revenue_monthly_eur": "Non-profit",
        "focus": "Educație",
        "vulnerability": "Dependent de sponsori"
      }
    ],
    "unique_advantages": [
      {"title": "Georgiana Stanciu (WNM)", "description": "4 titluri naționale, loc 8 la Mondialul 2016"},
      {"title": "Cristiana Stanciu", "description": "Master RCA London Service Design + Copywriter"},
      {"title": "Andrei Bitca", "description": "Specialist IT"},
      {"title": "Poziționare", "description": "Singura școală care targetează adulții urban 25-40"},
      {"title": "Design & Estetică", "description": "Diferențiator imposibil de copiat rapid"}
    ],
    "focus_areas": [
      {
        "id": 1,
        "title": "The Square Online - Academie Digitală cu Antrenori Reali",
        "revenue_potential": "+10-25K EUR/lună (scalabil)",
        "why_it_works": [
          "Elimină limita geografică: Cursanți din toată România și diaspora",
          "Antrenorii voștri sunt diferențiatorul: WNM + echipă de 7 antrenori experimentați",
          "Credențiale unice: Georgiana loc 8 mondial + stil pedagogic dovedit",
          "Flexibilitate: Părinții preferă online pentru copii ocupați",
          "Overhead mic: Nu ai nevoie de spațiu fizic suplimentar"
        ],
        "products": [
          {"name": "Lecții individuale online", "price_eur": "40-80/oră", "type": "live 1-on-1", "target": "Copii și adulți din afara Bucureștiului"},
          {"name": "Grupe online (4-6 elevi)", "price_eur": "100-150/lună", "type": "live grup", "target": "Nivel începător-intermediar"},
          {"name": "Grup de performanță online", "price_eur": "200-300/lună", "type": "live grup intensiv", "target": "Copii talentați din țară", "includes": ["2-3 sesiuni/săptămână", "Analiză partide", "Pregătire turnee"]},
          {"name": "Cursuri video înregistrate", "price_eur": "49-199", "type": "on-demand", "target": "Venit pasiv", "includes": ["Deschideri pentru Adulți", "Finale esențiale", "Tactică nivel X"]}
        ],
        "target_audience": {
          "Diaspora": "Români în străinătate care vor antrenor român pentru copii",
          "România non-București": "Orașe fără cluburi bune de șah",
          "Părinți ocupați": "Preferă online vs deplasare",
          "Adulți profesioniști": "Nu au timp de deplasare, vor flexibilitate"
        },
        "skills_utilized": {
          "Georgiana": "Antrenor principal, cursuri premium, fața brandului",
          "Echipa de 7": "Lecții individuale și grupe, acoperire program extins",
          "Cristiana": "Landing page, funnel conversie, comunicare",
          "Andrei": "Platformă booking, plăți, integrare Zoom/Meet"
        },
        "actions": [
          {"action": "Creează landing page dedicat online.thesquare.ro", "deadline": "Iunie 2026"},
          {"action": "Setup sistem booking online (Calendly/Cal.com)", "deadline": "Iunie 2026"},
          {"action": "Testează cu 10 elevi din afara Bucureștiului", "deadline": "Iulie 2026"},
          {"action": "Lansare campanie diaspora (Facebook groups românești)", "deadline": "August 2026"},
          {"action": "Primul curs video înregistrat", "deadline": "Q4 2026"},
          {"action": "Țintă: 50 elevi online recurenți", "deadline": "Decembrie 2026"}
        ],
        "platforms": ["Zoom/Google Meet pentru live", "Lichess/Chess.com pentru table interactive", "Teachable/Gumroad pentru cursuri înregistrate"]
      },
      {
        "id": 2,
        "title": "Corporate B2B - \"Chess as Strategy\" pentru Companii",
        "revenue_potential": "+10-20K EUR/lună",
        "why_it_works": [
          "Marjă uriașă: 2-5K EUR/eveniment vs 200-400 RON/cursant/lună",
          "Zero competiție: CSU/ACS se concentrează pe copii, nu corporate",
          "Service Design expertise: Cristiana poate crea experiențe premium",
          "Șahul = metaforă business: Perfect pentru team building & strategy workshops"
        ],
        "products": [
          {"name": "Workshop \"Chess Thinking\"", "duration": "2-3 ore", "price_eur": "1.500-2.500", "target": "Echipe de management, 10-20 persoane", "includes": ["Lecție de strategie", "Simultane cu WNM", "Networking"]},
          {"name": "Eveniment Corporate Premium", "duration": "zi întreagă", "price_eur": "3.000-5.000", "target": "Bănci, tech companies, agenții creative", "includes": ["Training", "Turneu intern", "Premii", "Catering"]},
          {"name": "Abonament Corporate", "price_eur": "500-1.000/lună", "includes": ["Cursuri săptămânale pentru angajați", "Acces la Chess Evenings", "Branding opportunity"]}
        ],
        "target_companies": {
          "Tech": ["UiPath", "Bitdefender", "Adobe", "startups din Sector 1"],
          "Finance": ["BCR", "BRD", "ING"],
          "Creative": ["Agenții de publicitate"],
          "Expats": ["Companii internaționale cu angajați străini"]
        },
        "skills_utilized": {
          "Georgiana": "Facilitare, WNM credibilitate",
          "Cristiana": "Service design pentru experiență memorabilă, propuneri scrise",
          "Andrei": "Sistem booking, CRM"
        },
        "actions": [
          {"action": "Creează pachet de prezentare corporate", "deadline": "Iunie 2026"},
          {"action": "Identifică 50 companii target în București", "deadline": "Iunie 2026"},
          {"action": "Organizează 1-2 evenimente pilot gratuite pentru studii de caz", "deadline": "Iulie 2026"},
          {"action": "Outreach LinkedIn + email la HR directors", "deadline": "Q3 2026"},
          {"action": "Țintă: 4-6 evenimente/lună", "deadline": "Q1 2027"}
        ]
      },
      {
        "id": 3,
        "title": "The Square Social Club - Membership Premium pentru Adulți",
        "revenue_potential": "+7-15K EUR/lună (recurent)",
        "why_it_works": [
          "Venit recurent: Subscripții lunare vs plăți one-time",
          "Diferențiator unic: NIMENI în București nu are club social de șah pentru adulți",
          "Trend global: Chess bars/clubs explodează în SUA și Europa de Vest",
          "Comunitate existentă: Chess Evenings au deja tracțiune organică"
        ],
        "membership_tiers": [
          {
            "tier": 1,
            "name": "Social Member",
            "price_eur": 50,
            "benefits": [
              "Acces nelimitat la Chess Evenings (2x/săptămână)",
              "Spațiu de joc în timpul programului",
              "10% discount la cursuri și evenimente",
              "Comunitate WhatsApp/Discord exclusivă"
            ]
          },
          {
            "tier": 2,
            "name": "Premium Member",
            "price_eur": 100,
            "benefits": [
              "Tot din Social +",
              "1 lecție individuală/lună cu Georgiana",
              "Acces la turneele interne",
              "Invitații la evenimente exclusive (lansări, degustări)",
              "Badge \"Founding Member\""
            ]
          },
          {
            "tier": 3,
            "name": "Patron Member",
            "price_eur": 250,
            "benefits": [
              "Tot din Premium +",
              "2 lecții individuale/lună",
              "Locuri rezervate la toate evenimentele",
              "Nume pe \"Wall of Patrons\"",
              "Acces la cursurile online gratuit"
            ]
          }
        ],
        "additional_benefits": [
          {"type": "Parteneriate lifestyle", "description": "Cafenele, vinării, librării (cross-promotion)"},
          {"type": "Evenimente tematice", "examples": ["Wine & Chess", "Jazz & Șah", "Book Club"]},
          {"type": "Networking", "description": "Comunitatea devine valoare în sine"}
        ],
        "skills_utilized": {
          "Georgiana": "Host principal, atracția pentru membri",
          "Cristiana": "Design experiență, branding club",
          "Andrei": "Sistem membership, plăți recurente"
        },
        "actions": [
          {"action": "Definește tier-urile și prețurile", "deadline": "Mai 2026", "status": "completed"},
          {"action": "Creează landing page pentru membership", "deadline": "Iunie 2026"},
          {"action": "Convertește primii 20 membri din comunitatea existentă", "deadline": "Iunie-Iulie 2026"},
          {"action": "Lansare oficială cu eveniment \"Founding Members\"", "deadline": "Septembrie 2026"},
          {"action": "Țintă: 100 membri = 7.5K EUR/lună recurent", "deadline": "Decembrie 2026"}
        ]
      }
    ],
    "revenue_projection": {
      "current": {
        "period": "Mai 2026",
        "traditional_courses": "5-8K EUR",
        "ai_academy": "0",
        "corporate_b2b": "0-1K EUR",
        "social_club": "0",
        "total": "5-9K EUR"
      },
      "dec_2026": {
        "period": "Dec 2026",
        "traditional_courses": "8-10K EUR",
        "ai_academy": "3-6K EUR",
        "corporate_b2b": "5-10K EUR",
        "social_club": "5-7K EUR",
        "total": "21-33K EUR"
      },
      "dec_2027": {
        "period": "Dec 2027",
        "traditional_courses": "12-15K EUR",
        "ai_academy": "10-20K EUR",
        "corporate_b2b": "15-20K EUR",
        "social_club": "10-15K EUR",
        "total": "47-70K EUR"
      }
    },
    "why_these_3_ideas": [
      {"reason": "Scalabilitate", "explanation": "AI Academy nu are plafon fizic"},
      {"reason": "Marjă", "explanation": "Corporate B2B = 60-70% marjă vs 30-40% cursuri"},
      {"reason": "Recurență", "explanation": "Membership = predictabilitate financiară"},
      {"reason": "Sinergie", "explanation": "Toate folosesc aceleași assets (brand, spațiu, fondatori)"},
      {"reason": "Competiție slabă", "explanation": "Niciun competitor din București atacă aceste segmente"}
    ],
    "risks_and_mitigations": [
      {"risk": "Burnout fondatori (2 persoane fac tot)", "mitigation": "Prioritizare strictă: B2B primul (cash rapid), apoi membership, apoi AI"},
      {"risk": "AI Academy necesită mult conținut", "mitigation": "Înregistrare incrementală: 1 curs la 2 luni"},
      {"risk": "Corporate sales cycle lung", "mitigation": "Pilot-uri gratuite pentru case studies"},
      {"risk": "Membership retention scăzută", "mitigation": "Comunitate puternică + evenimente exclusive"}
    ],
    "immediate_next_steps": [
      {"week": 1, "action": "Creează pachetul de prezentare Corporate", "lead": "Cristiana"},
      {"week": 2, "action": "Definește membership tiers și landing page", "lead": "Andrei"},
      {"week": 3, "action": "Înregistrează primul curs video pilot", "lead": "Georgiana"},
      {"month": 1, "action": "5 întâlniri corporate, 20 membri social club, 1 curs online draft", "lead": "Echipa"}
    ],
    "performance_acquisition": {
      "target": "Copii talentați pentru grup de performanță",
      "channels": [
        {
          "name": "Prezență la turnee",
          "cost": "Gratuit",
          "effort": "Mediu",
          "effectiveness": "Foarte mare",
          "actions": [
            "Participare la CN pe categorii de vârstă",
            "Antrenorul oferă analize gratuite între runde",
            "Networking cu părinții ambițioși",
            "Distribuie flyere The Square la turnee"
          ]
        },
        {
          "name": "Scouting intern",
          "cost": "Gratuit",
          "effort": "Mic",
          "effectiveness": "Mare",
          "actions": [
            "Identifică copiii talentați din grupele existente",
            "Evaluare gratuită pentru nivel de performanță",
            "Discuție cu părinții despre potențial",
            "Upgrade path clar către grupa de performanță"
          ]
        },
        {
          "name": "Parteneriate școli",
          "cost": "Mic",
          "effort": "Mare",
          "effectiveness": "Mare",
          "actions": [
            "Cercuri de șah în școli cu talent spotting",
            "După-amieze gratuite de evaluare",
            "Competiții inter-școli organizate de The Square",
            "Premii/burse pentru copiii talentați"
          ]
        },
        {
          "name": "Rezultate ca marketing",
          "cost": "Gratuit",
          "effort": "Mic",
          "effectiveness": "Mare",
          "actions": [
            "Postări Instagram când elevii câștigă",
            "Tag-uri FRSAH, turnee, părinți",
            "Statistici: +X ELO în Y luni",
            "Wall of Fame pe site și în sediu"
          ]
        },
        {
          "name": "Parteneriate FRSAH / cluburi mici",
          "cost": "Gratuit",
          "effort": "Mediu",
          "effectiveness": "Medie",
          "actions": [
            "Cluburi fără antrenor de performanță trimit copii",
            "Colaborare cu FRSAH pentru identificare talente",
            "Tabere de vară comune",
            "Sparring sessions cu alte cluburi"
          ]
        },
        {
          "name": "Testimoniale părinți",
          "cost": "Gratuit",
          "effort": "Mic",
          "effectiveness": "Foarte mare",
          "actions": [
            "Video scurt: progres copil în X luni",
            "Review-uri Google cu rezultate concrete",
            "Părinții conving alți părinți",
            "Stories Instagram cu momente de mândrie"
          ]
        },
        {
          "name": "Ads plătite",
          "cost": "Mare",
          "effort": "Mic",
          "effectiveness": "Mică pentru performanță",
          "actions": [
            "Target: părinți copii 6-14 ani, interes șah",
            "Funcționează mai bine pentru începători",
            "Cost per achiziție mare pentru performanță",
            "Folosește doar după ce ai rezultate de arătat"
          ],
          "note": "Ultimul resort - părinții copiilor talentați nu caută pe Facebook"
        }
      ],
      "priority_order": [
        "1. Scouting intern (cel mai rapid ROI)",
        "2. Prezență la turnee (cel mai bun pentru credibilitate)",
        "3. Rezultate ca marketing (efect compus în timp)",
        "4. Testimoniale părinți (conversie mare)",
        "5. Parteneriate școli (pipeline pe termen lung)",
        "6. Ads (doar cu buget și rezultate dovedite)"
      ]
    }
  }'::jsonb
);
