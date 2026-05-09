-- Add financials column to competitors table
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS financials JSONB;

-- Update CSU București (Școala de Șah) with financial data
UPDATE competitors SET financials = '{
  "pricing": {
    "currency": "RON",
    "monthly_plans": [
      {"name": "1x/săpt (Rege)", "in_person": 200, "online": 190},
      {"name": "2x/săpt (Pion)", "in_person": 295, "online": 250},
      {"name": "3x/săpt (Călut)", "in_person": 395, "online": 350},
      {"name": "4x/săpt (Turn)", "in_person": 465, "online": 420}
    ],
    "adults": {"in_person": 280, "online": 250},
    "discounts": ["25% frați", "10% recomandare"],
    "vouchers_eligible": ["Sector 1", "Sector 3"]
  },
  "operations": {
    "locations": 5,
    "instructors": 17,
    "gm_collaborators": 2,
    "facebook_followers": 23572,
    "lichess_members": 1587
  },
  "estimates": {
    "active_students": {"min": 400, "max": 600},
    "avg_monthly_fee_ron": 300
  },
  "revenue_2025": {
    "monthly_min_ron": 100000,
    "monthly_max_ron": 180000,
    "monthly_min_eur": 20000,
    "monthly_max_eur": 36000,
    "annual_min_ron": 1200000,
    "annual_max_ron": 2160000,
    "annual_min_eur": 240000,
    "annual_max_eur": 432000
  },
  "revenue_2026": {
    "monthly_min_ron": 120000,
    "monthly_max_ron": 200000,
    "monthly_min_eur": 24000,
    "monthly_max_eur": 40000,
    "annual_min_ron": 1440000,
    "annual_max_ron": 2400000,
    "annual_min_eur": 288000,
    "annual_max_eur": 480000,
    "growth_rate_percent": 15
  },
  "additional_revenue": ["Vouchere primării 250 RON/lună/copil", "Summer Chess Camp", "Turnee interne"],
  "data_source": "scoaladesah.ro, cercetare mai 2026",
  "confidence": "medium"
}'::jsonb
WHERE name LIKE '%CSU%' AND name LIKE '%București%' AND name NOT LIKE '%ASE%';

-- Update ACS Oxygen (Academia de Șah) with financial data
UPDATE competitors SET financials = '{
  "pricing": {
    "currency": "RON",
    "note": "Prețuri nedivulgate public",
    "estimated_monthly_range": {"min": 250, "max": 400},
    "vouchers_eligible": ["Sector 1", "Sector 2"]
  },
  "operations": {
    "locations": 5,
    "facebook_followers": 37000,
    "medals_nationals_2024": 23,
    "gold_medals_2024": 12
  },
  "estimates": {
    "active_students": {"min": 400, "max": 700},
    "avg_monthly_fee_ron": 300,
    "note": "Cel mai mare număr de cursanți din București bazat pe palmares"
  },
  "revenue_2025": {
    "monthly_min_ron": 120000,
    "monthly_max_ron": 210000,
    "monthly_min_eur": 24000,
    "monthly_max_eur": 42000,
    "annual_min_ron": 1440000,
    "annual_max_ron": 2520000,
    "annual_min_eur": 288000,
    "annual_max_eur": 504000
  },
  "revenue_2026": {
    "monthly_min_ron": 140000,
    "monthly_max_ron": 245000,
    "monthly_min_eur": 28000,
    "monthly_max_eur": 49000,
    "annual_min_ron": 1680000,
    "annual_max_ron": 2940000,
    "annual_min_eur": 336000,
    "annual_max_eur": 588000,
    "growth_rate_percent": 17
  },
  "additional_revenue": ["Grand Prix MegaChess (taxe participare)", "Tabere vară/iarnă (600-1500 RON/săpt)", "ChessCraft Arena online"],
  "data_source": "academiadesah.ro, cercetare mai 2026",
  "confidence": "medium"
}'::jsonb
WHERE name LIKE '%Oxygen%' OR name LIKE '%Academia de Șah%';

-- Update Șah în Școală with financial data
UPDATE competitors SET financials = '{
  "pricing": {
    "model": "Non-profit - gratuit pentru beneficiari",
    "note": "Copiii și profesorii beneficiază gratuit, sponsorii plătesc"
  },
  "operations": {
    "beneficiaries_2025": 125000,
    "teachers_trained": 2500,
    "counties_covered": 37,
    "events_per_year": 270,
    "materials_distributed": {
      "manuals": 80000,
      "chess_sets": 17000
    }
  },
  "estimates": {
    "model": "sponsorship_based",
    "note": "Nu vinde cursuri - model complet diferit"
  },
  "revenue_2025": {
    "model": "Sponsorizări corporate",
    "annual_min_ron": 500000,
    "annual_max_ron": 1000000,
    "annual_min_eur": 100000,
    "annual_max_eur": 200000,
    "main_sponsor": "AQUA Carpatica (10+ ani)"
  },
  "revenue_2026": {
    "annual_min_ron": 600000,
    "annual_max_ron": 1200000,
    "annual_min_eur": 120000,
    "annual_max_eur": 240000,
    "growth_rate_percent": 20,
    "note": "Creștere estimată după premiul Gala Societății Civile 2024"
  },
  "sponsors": ["AQUA Carpatica", "Rompetrol", "UniCredit", "Egger", "Leier", "Toyota Iași Est", "Adservio"],
  "data_source": "sahinscoala.org, cercetare mai 2026",
  "confidence": "low-medium"
}'::jsonb
WHERE name LIKE '%Șah în Școală%' OR name LIKE '%Gambitul Damei%';

-- Update CSU ASE Superbet with financial data
UPDATE competitors SET financials = '{
  "pricing": {
    "model": "Club elită sponsorizat - nu vinde cursuri retail",
    "note": "Revenue 100% din sponsori corporate"
  },
  "operations": {
    "olympic_team_members_male": 4,
    "olympic_team_members_female": 3,
    "top_player": "Viswanathan Anand (5x campion mondial)",
    "coach": "Ivan Sokolov",
    "facebook_followers": 4890
  },
  "estimates": {
    "model": "corporate_sponsorship",
    "note": "Nu vinde cursuri - model complet diferit de școlile de șah"
  },
  "revenue_2025": {
    "model": "Sponsorizări corporate",
    "annual_min_ron": 1000000,
    "annual_max_ron": 2000000,
    "annual_min_eur": 200000,
    "annual_max_eur": 400000,
    "naming_sponsor": "Superbet"
  },
  "revenue_2026": {
    "annual_min_ron": 1200000,
    "annual_max_ron": 2500000,
    "annual_min_eur": 240000,
    "annual_max_eur": 500000,
    "growth_rate_percent": 20,
    "note": "Potențial creștere cu rezultate olimpice"
  },
  "sponsors": ["Superbet (naming)", "ONE United Properties", "Mastercard", "World Class"],
  "costs": ["Salarii jucători internaționali", "Deplasări europene", "Legitimare Anand"],
  "data_source": "csu.ase.ro, cercetare mai 2026",
  "confidence": "low"
}'::jsonb
WHERE name LIKE '%CSU ASE%' OR name LIKE '%Superbet%';

-- Update Saint Louis Chess Club with financial data
UPDATE competitors SET financials = '{
  "pricing": {
    "currency": "USD",
    "membership_monthly": {"student": 10, "adult": 15},
    "membership_annual": {"student": 50, "adult": 100, "family": 150},
    "non_local_annual": {"student": 20, "adult": 50, "family": 75},
    "includes": ["Free private lesson", "GM lectures", "Open play", "Library access", "15% shop discount"]
  },
  "operations": {
    "active_members": 2000,
    "students_served_total": 45000,
    "schools_annually": 100,
    "tournaments_per_year": 80,
    "total_tournaments_hosted": 1400,
    "rated_games_played": 69000,
    "grandmasters_relocated": 20,
    "facebook_followers": 64706,
    "facility_sqft_current": 6000,
    "facility_sqft_expansion": 30000
  },
  "estimates": {
    "model": "patron_funded_nonprofit",
    "patron": "Rex Sinquefield",
    "patron_investment_total_usd": 50000000,
    "note": "Membership revenue e doar o fracțiune din buget"
  },
  "revenue_2025": {
    "membership_annual_min_usd": 240000,
    "membership_annual_max_usd": 360000,
    "total_budget_min_usd": 3000000,
    "total_budget_max_usd": 5000000,
    "note": "Include turnee, broadcast, salarii GM, operațiuni"
  },
  "revenue_2026": {
    "membership_annual_min_usd": 280000,
    "membership_annual_max_usd": 400000,
    "total_budget_min_usd": 4000000,
    "total_budget_max_usd": 6000000,
    "growth_rate_percent": 15,
    "note": "Creștere estimată cu expansiunea 30,000 sq ft"
  },
  "funding_sources": ["Rex Sinquefield Foundation", "Membership fees", "Tournament fees", "Corporate donors", "Foundation grants"],
  "major_expenses": ["Staff salaries", "GM stipends", "Tournament operations", "Broadcast production", "Scholastic programs", "Facility expansion"],
  "data_source": "saintlouischessclub.org, Wikipedia, cercetare mai 2026",
  "confidence": "medium-high"
}'::jsonb
WHERE name LIKE '%Saint Louis%';
