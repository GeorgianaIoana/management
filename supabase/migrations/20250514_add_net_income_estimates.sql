-- Add net income estimates to competitor financials

-- Update CSU București with net income estimates
UPDATE competitors SET financials = financials || '{
  "cost_structure": {
    "instructors": {"count": 17, "avg_monthly_ron": 4000, "annual_ron": 816000},
    "rent": {"locations": 5, "avg_monthly_per_location_ron": 5000, "annual_ron": 300000},
    "utilities_materials": {"monthly_ron": 15000, "annual_ron": 180000},
    "admin_marketing_percent": 10,
    "total_estimated_annual_ron": 1450000
  },
  "net_income_2025": {
    "min_ron": -50000,
    "max_ron": 700000,
    "min_eur": -10000,
    "max_eur": 140000,
    "margin_percent_min": 0,
    "margin_percent_max": 35,
    "note": "Marje variabile in functie de ocupare si sezonalitate"
  },
  "net_income_2026": {
    "min_ron": 50000,
    "max_ron": 950000,
    "min_eur": 10000,
    "max_eur": 190000,
    "margin_percent_min": 5,
    "margin_percent_max": 40,
    "note": "Crestere estimata prin vouchere primarii si optimizare costuri"
  }
}'::jsonb
WHERE name LIKE '%CSU%' AND name LIKE '%București%' AND name NOT LIKE '%ASE%';

-- Update ACS Oxygen with net income estimates
UPDATE competitors SET financials = financials || '{
  "cost_structure": {
    "instructors": {"count": 15, "avg_monthly_ron": 4500, "annual_ron": 810000},
    "rent": {"locations": 5, "avg_monthly_per_location_ron": 6000, "annual_ron": 360000},
    "utilities_materials": {"monthly_ron": 18000, "annual_ron": 216000},
    "admin_marketing_percent": 12,
    "total_estimated_annual_ron": 1550000
  },
  "net_income_2025": {
    "min_ron": -100000,
    "max_ron": 970000,
    "min_eur": -20000,
    "max_eur": 194000,
    "margin_percent_min": 0,
    "margin_percent_max": 38,
    "note": "Marje mai mari datorita turneelor si taberelor cu margine ridicata"
  },
  "net_income_2026": {
    "min_ron": 130000,
    "max_ron": 1390000,
    "min_eur": 26000,
    "max_eur": 278000,
    "margin_percent_min": 8,
    "margin_percent_max": 47,
    "note": "Potențial cel mai profitabil club din București daca mentine palmaresul"
  }
}'::jsonb
WHERE name LIKE '%Oxygen%' OR name LIKE '%Academia de Șah%';

-- Update Șah în Școală with net income (non-profit)
UPDATE competitors SET financials = financials || '{
  "cost_structure": {
    "model": "Non-profit - toate fondurile reinvestite in program",
    "coordinators": {"count": 3, "annual_ron": 180000},
    "materials_distribution": {"annual_ron": 200000},
    "events_logistics": {"annual_ron": 150000},
    "admin": {"annual_ron": 70000},
    "total_estimated_annual_ron": 600000
  },
  "net_income_2025": {
    "min_ron": 0,
    "max_ron": 0,
    "min_eur": 0,
    "max_eur": 0,
    "margin_percent_min": 0,
    "margin_percent_max": 0,
    "note": "Non-profit - surplus reinvestit in extindere program"
  },
  "net_income_2026": {
    "min_ron": 0,
    "max_ron": 0,
    "min_eur": 0,
    "max_eur": 0,
    "margin_percent_min": 0,
    "margin_percent_max": 0,
    "note": "Model non-profit - nu genereaza profit distribuit"
  }
}'::jsonb
WHERE name LIKE '%Șah în Școală%' OR name LIKE '%Gambitul Damei%';

-- Update CSU ASE Superbet with net income (sponsored club)
UPDATE competitors SET financials = financials || '{
  "cost_structure": {
    "model": "Club sponsorizat - costuri acoperite de sponsori",
    "player_contracts": {"annual_ron": 800000, "note": "Salarii jucatori internationali"},
    "coach_salaries": {"annual_ron": 200000, "note": "Ivan Sokolov + staff"},
    "travel_competitions": {"annual_ron": 300000, "note": "Deplasari Europa"},
    "operations": {"annual_ron": 100000},
    "total_estimated_annual_ron": 1400000
  },
  "net_income_2025": {
    "min_ron": -200000,
    "max_ron": 600000,
    "min_eur": -40000,
    "max_eur": 120000,
    "margin_percent_min": -10,
    "margin_percent_max": 30,
    "note": "Variabil - depinde de performante si bonusuri sponsori"
  },
  "net_income_2026": {
    "min_ron": -100000,
    "max_ron": 1100000,
    "min_eur": -20000,
    "max_eur": 220000,
    "margin_percent_min": -5,
    "margin_percent_max": 44,
    "note": "Potential surplus mare cu rezultate olimpice bune"
  }
}'::jsonb
WHERE name LIKE '%CSU ASE%' OR name LIKE '%Superbet%';

-- Update Saint Louis with actual net income data from Form 990
UPDATE competitors SET financials = financials || '{
  "cost_structure": {
    "source": "IRS Form 990 (2020 filing)",
    "total_revenue_usd": 15096458,
    "total_expenses_usd": 13934202,
    "breakdown": {
      "salaries_benefits": {"annual_usd": 3500000, "note": "Staff + GM stipends"},
      "tournament_operations": {"annual_usd": 4000000, "note": "Sinquefield Cup, US Championship"},
      "broadcast_production": {"annual_usd": 1500000},
      "scholastic_programs": {"annual_usd": 2000000},
      "facility_operations": {"annual_usd": 1500000},
      "grants_given": {"annual_usd": 1751080, "note": "2023 data"},
      "other": {"annual_usd": 683122}
    }
  },
  "net_income_2025": {
    "min_usd": 800000,
    "max_usd": 1500000,
    "min_eur": 740000,
    "max_eur": 1400000,
    "margin_percent_min": 5,
    "margin_percent_max": 10,
    "note": "Bazat pe Form 990 istoric - net income $1.16M in 2020"
  },
  "net_income_2026": {
    "min_usd": 1000000,
    "max_usd": 2000000,
    "min_eur": 920000,
    "max_eur": 1850000,
    "margin_percent_min": 6,
    "margin_percent_max": 12,
    "note": "Crestere estimata cu expansiunea 30,000 sq ft si evenimente noi"
  }
}'::jsonb
WHERE name LIKE '%Saint Louis%';
