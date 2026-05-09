export interface Mechanism {
  rank: number;
  name: string;
  description: string;
  year: string;
}

export interface AcquisitionChannel {
  channel: string;
  segment: string;
  cost: 'Foarte mic' | 'Mic' | 'Mediu' | 'Mare';
}

export interface Location {
  name: string;
  sector: number;
  address?: string;
}

export interface RevenueEstimate {
  monthly_min_ron?: number;
  monthly_max_ron?: number;
  monthly_min_eur?: number;
  monthly_max_eur?: number;
  annual_min_ron?: number;
  annual_max_ron?: number;
  annual_min_eur?: number;
  annual_max_eur?: number;
  growth_rate_percent?: number;
  note?: string;
  model?: string;
}

export interface Financials {
  pricing?: {
    currency?: string;
    model?: string;
    monthly_plans?: Array<{ name: string; in_person?: number; online?: number }>;
    adults?: { in_person?: number; online?: number };
    estimated_monthly_range?: { min: number; max: number };
    membership_monthly?: Record<string, number>;
    membership_annual?: Record<string, number>;
    discounts?: string[];
    vouchers_eligible?: string[];
    note?: string;
  };
  operations?: {
    locations?: number;
    instructors?: number;
    active_members?: number;
    facebook_followers?: number;
    beneficiaries_2025?: number;
    teachers_trained?: number;
  };
  estimates?: {
    active_students?: { min: number; max: number };
    avg_monthly_fee_ron?: number;
    model?: string;
    note?: string;
  };
  revenue_2025?: RevenueEstimate;
  revenue_2026?: RevenueEstimate;
  sponsors?: string[];
  additional_revenue?: string[];
  data_source?: string;
  confidence?: 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high';
}

export interface Competitor {
  id: string;
  name: string;
  website: string;
  description: string;
  foundedYear: number;
  keyMechanisms: Mechanism[];
  acquisitionChannels: AcquisitionChannel[];
  strengths: string[];
  weaknesses: string[];
  locations: Location[];
  socialMedia: {
    facebook?: { name: string; likes?: number; followers?: number; activeUsers?: number; rating?: string; reviews?: number };
    instagram?: { handle: string; followers: number; posts: number };
    twitter?: { handle: string; posts: number };
  };
  financials?: Financials;
}

export const competitors: Competitor[] = [
  {
    id: '1',
    name: 'Școala de Șah București (CSU)',
    website: 'scoaladesah.ro',
    description: 'Clubul Sportiv Universitar de Șah București - fondat în 2012, top club național de juniori din 2019',
    foundedYear: 2012,
    keyMechanisms: [
      { rank: 1, name: 'Vouchere Primării 250 RON/lună', description: 'Programele Sport pentru fiecare (S1) și Oferim constanță (S3) - aproape gratuit pentru părinți eligibili', year: '2022-2023' },
      { rank: 2, name: 'Lecția Gratuită de Probă', description: 'Barieră zero - părintele evaluează fit-ul copil-instructor fără cost', year: '2012' },
      { rank: 3, name: 'Ecosistem Turnee pe Vârstă', description: 'Funnel 12+ ani: Cupa Prichindel → Cupa Școlii → Annual Chess Contest → Divizii Naționale', year: '2012-2025' },
      { rank: 4, name: 'Lock-in FRȘAH', description: 'Legitimarea creează cost de switching similar telecom', year: '2022+' },
      { rank: 5, name: 'Cursuri în Grădinițe/Școli', description: 'B2B2C - instituția aduce volumul, copilul descoperă șahul în mediul zilnic', year: '2015-2026' },
      { rank: 6, name: 'Recomandare 10% + Frați 25%', description: 'Monetizare word-of-mouth cu discount marginal', year: '2020+' },
      { rank: 7, name: 'Multi-locație + Online + Tabere', description: '5 sedii + Zoom + tabere vară/iarnă - format pentru orice profil client', year: '2020-2025' },
    ],
    acquisitionChannels: [
      { channel: 'Lecție gratuită', segment: 'Copii 5-14 ani', cost: 'Mediu' },
      { channel: 'Vouchere primării', segment: 'Părinți cost-conscious', cost: 'Foarte mic' },
      { channel: 'Cursuri grădinițe/școli', segment: 'Copii 3-10 ani', cost: 'Mic' },
      { channel: 'Tabere vară/iarnă', segment: 'Entry point copii', cost: 'Mediu' },
      { channel: 'Turnee interne', segment: 'Copii performanță + adulți', cost: 'Mic' },
      { channel: 'Recomandări', segment: 'Familii existente', cost: 'Foarte mic' },
      { channel: 'Online Zoom', segment: 'Copii + adulți țară', cost: 'Mic' },
      { channel: 'Corporate workshops', segment: 'Adulți B2B', cost: 'Mediu' },
    ],
    strengths: [
      '5 sedii în Sectoarele 1, 2, 3, 4, 6',
      'Summer Chess Camp - 10 ediții, 700+ copii',
      'Cupa CSU Online - ediția 50 în feb 2025',
      'Podcast Șah la Dublu pentru adulți',
      'Alexandru Sachilaru - Maestru FIDE 2024',
    ],
    weaknesses: [
      'Instagram subutilizat (2.526 vs 23.572 Facebook)',
      'Lipsă paid ads (Google/Meta)',
      'Poziționare performanță lasă teren pentru șah recreativ',
      'Segment adulți insuficient developat',
      'Dependență de programele primăriilor',
    ],
    locations: [
      { name: 'Tineretului', sector: 4 },
      { name: 'Grigorescu', sector: 1 },
      { name: '1 Mai', sector: 1, address: 'str. Arad nr. 10' },
      { name: 'Iancului', sector: 2 },
      { name: 'Gorjului', sector: 6 },
    ],
    socialMedia: {
      facebook: { name: 'Scoala De Sah', likes: 23572, activeUsers: 1587 },
      instagram: { handle: '@scoaladesah.ro', followers: 2526, posts: 1820 },
    },
    financials: {
      pricing: {
        currency: 'RON',
        monthly_plans: [
          { name: '1x/săpt (Rege)', in_person: 200, online: 190 },
          { name: '2x/săpt (Pion)', in_person: 295, online: 250 },
          { name: '3x/săpt (Călut)', in_person: 395, online: 350 },
          { name: '4x/săpt (Turn)', in_person: 465, online: 420 },
        ],
        adults: { in_person: 280, online: 250 },
        discounts: ['25% frați', '10% recomandare'],
        vouchers_eligible: ['Sector 1', 'Sector 3'],
      },
      operations: { locations: 5, instructors: 17, facebook_followers: 23572 },
      estimates: { active_students: { min: 400, max: 600 }, avg_monthly_fee_ron: 300 },
      revenue_2025: {
        monthly_min_ron: 100000, monthly_max_ron: 180000,
        monthly_min_eur: 20000, monthly_max_eur: 36000,
        annual_min_ron: 1200000, annual_max_ron: 2160000,
        annual_min_eur: 240000, annual_max_eur: 432000,
      },
      revenue_2026: {
        monthly_min_ron: 120000, monthly_max_ron: 200000,
        monthly_min_eur: 24000, monthly_max_eur: 40000,
        annual_min_ron: 1440000, annual_max_ron: 2400000,
        annual_min_eur: 288000, annual_max_eur: 480000,
        growth_rate_percent: 15,
      },
      additional_revenue: ['Vouchere primării 250 RON/lună/copil', 'Summer Chess Camp', 'Turnee interne'],
      data_source: 'scoaladesah.ro, cercetare mai 2026',
      confidence: 'medium',
    },
  },
  {
    id: '2',
    name: 'Academia de Șah București (ACS Oxygen)',
    website: 'academiadesah.ro',
    description: 'Auto-poziționat ca cel mai puternic club sportiv de șah din România - 23 medalii la Naționale 2024',
    foundedYear: 2013,
    keyMechanisms: [
      { rank: 1, name: 'Palmares Campioni Naționali', description: '23 medalii 2024 (12 AUR + 4 ARGINT + 7 BRONZ), 17 podiumuri echipe - cel mai puternic argument de vânzare', year: '2024' },
      { rank: 2, name: 'Antrenori MI/CM/IS afișați explicit', description: 'MI Gabriel Mateuța, MI Cătălin Cărmăciu, CM Tudor Ristea - credibilitate instant', year: '2018-2025' },
      { rank: 3, name: 'Vouchere 3 Primării (incl. S2 exclusiv)', description: 'Sector 1, 2 (exclusiv!), 3 (suspendat) - 250 RON/lună, bază largă subvenționată', year: '2022-2026' },
      { rank: 4, name: 'Parteneriat Mega Mall', description: 'Grand Prix MegaChess lunar - vizibilitate masivă, spațiu subvenționat, ediția VIII în 2025', year: '2018' },
      { rank: 5, name: 'Catalog Online + Plată Card', description: 'WooCommerce + Meta Ads remarketing - friction zero pentru părinți tehnici', year: '2023' },
      { rank: 6, name: 'Ecosistem Dual Turnee', description: 'MegaChess (fizic) + ChessCraft Arena (tornelo.com online) - Grand Prix-uri cumulative', year: '2023-2024' },
      { rank: 7, name: 'Centre 4 Sectoare + Grădinițe', description: 'S1, S2, S3, S5 (S5 exclusiv!) + Șah în grădinițe - acoperire complementară CSU', year: '2020' },
    ],
    acquisitionChannels: [
      { channel: 'Palmares național', segment: 'Părinți ambițioși', cost: 'Foarte mic' },
      { channel: 'Vouchere primării S1+S2', segment: 'Părinți cost-conscious', cost: 'Foarte mic' },
      { channel: 'Grand Prix MegaChess', segment: 'Copii + descoperire publică', cost: 'Mic' },
      { channel: 'ChessCraft Arena online', segment: 'Copii din toată țara', cost: 'Foarte mic' },
      { channel: 'Cupa Academiei', segment: 'Copii cursanți - retenție', cost: 'Mic' },
      { channel: 'Grădinițe + afterschool', segment: 'Copii 3-10 ani', cost: 'Mic' },
      { channel: 'Tabere multi-locație', segment: 'Copii 6-14 ani', cost: 'Mediu' },
      { channel: 'Catalog online + card', segment: 'Părinți tehnici', cost: 'Foarte mic' },
    ],
    strengths: [
      '23 medalii Campionatele Naționale 2024',
      'Antrenori cu titluri internaționale (2x MI, CM, IS)',
      'Sector 2 exclusiv (CSU nu e prezent)',
      'Parteneriat unic Mega Mall - vizibilitate lunară',
      'Infrastructură digitală matură (WooCommerce + Meta Ads)',
      '37.000 followers Facebook (cel mai mare din București)',
    ],
    weaknesses: [
      'Instagram subdezvoltat (394 vs 37.000 Facebook)',
      'Sectoarele 4 și 6 lipsă',
      'Comunicare adulți aproape inexistentă',
      'Dependență de palmaresul anual',
      'Sector 3 suspendat din 2024-2025',
      'Fără podcast/conținut educațional propriu',
    ],
    locations: [
      { name: 'Pța. Domenii', sector: 1 },
      { name: 'Educației (sediu principal)', sector: 2, address: 'str. Educației nr. 32B' },
      { name: 'Ozana', sector: 3 },
      { name: 'Drumul Sării', sector: 5 },
    ],
    socialMedia: {
      facebook: { name: 'Academia de Sah', followers: 37000, rating: '100% recommend', reviews: 46 },
      instagram: { handle: '@academiadesah', followers: 394, posts: 74 },
      twitter: { handle: '@AcademiadeSah', posts: 126 },
    },
    financials: {
      pricing: {
        currency: 'RON',
        note: 'Prețuri nedivulgate public',
        estimated_monthly_range: { min: 250, max: 400 },
        vouchers_eligible: ['Sector 1', 'Sector 2'],
      },
      operations: { locations: 5, facebook_followers: 37000 },
      estimates: { active_students: { min: 400, max: 700 }, avg_monthly_fee_ron: 300, note: 'Cel mai mare număr de cursanți din București bazat pe palmares' },
      revenue_2025: {
        monthly_min_ron: 120000, monthly_max_ron: 210000,
        monthly_min_eur: 24000, monthly_max_eur: 42000,
        annual_min_ron: 1440000, annual_max_ron: 2520000,
        annual_min_eur: 288000, annual_max_eur: 504000,
      },
      revenue_2026: {
        monthly_min_ron: 140000, monthly_max_ron: 245000,
        monthly_min_eur: 28000, monthly_max_eur: 49000,
        annual_min_ron: 1680000, annual_max_ron: 2940000,
        annual_min_eur: 336000, annual_max_eur: 588000,
        growth_rate_percent: 17,
      },
      additional_revenue: ['Grand Prix MegaChess (taxe participare)', 'Tabere vară/iarnă (600-1500 RON/săpt)', 'ChessCraft Arena online'],
      data_source: 'academiadesah.ro, cercetare mai 2026',
      confidence: 'medium',
    },
  },
  {
    id: '3',
    name: 'Șah în Școală (CS Gambitul Damei)',
    website: 'sahinscoala.org',
    description: 'Program național non-profit de educație prin șah - 125.000 copii beneficiari în 2025, locul I la Gala Societății Civile 2024',
    foundedYear: 2015,
    keyMechanisms: [
      { rank: 1, name: 'Sponsorul ancoră AQUA Carpatica', description: 'Partener principal de peste un deceniu (din ~2014-2015), oferind finanțare și hidratare gratuită la toate evenimentele - face proiectul economic posibil', year: '2014-2026' },
      { rank: 2, name: 'Distribuție gratuită materiale', description: '80.000 manuale + 17.000 seturi de șah distribuite gratuit în 37 de județe - elimină bariera materială pentru orice școală', year: '2015-2025' },
      { rank: 3, name: 'Formare gratuită profesori CCD Iași', description: 'Curs 27 ore (24h + 3h evaluare) online ZOOM, gratuit, acreditat - 2.500 profesori formați care devin multiplicatori (30-60 elevi/an)', year: '2015-2025' },
      { rank: 4, name: 'Premiul Gala Societății Civile 2024', description: 'Locul I la cea mai importantă recunoaștere pentru proiecte civice - deschide automat ușile la Ministerul Educației, primării și sponsori noi', year: '2024' },
      { rank: 5, name: 'Evenimentul Romania 6000', description: '6.000 copii joacă șah simultan în 60 de localități pe Ziua Mondială a Educației (5 octombrie) - format viral pentru presă națională', year: '2024' },
      { rank: 6, name: 'Parteneriate mall-uri', description: 'Concursuri gratuite la Iulius Mall, Shopping City (100-300 copii/eveniment) - mall oferă spațiu, proiectul aduce trafic și conținut', year: '2024-2025' },
      { rank: 7, name: 'Coaliție corporate diversificată', description: 'AQUA Carpatica, Rompetrol, UniCredit, Egger, Leier, Toyota Iași Est, Adservio - diversitate sectorială reduce riscul de colaps', year: '2018-2025' },
    ],
    acquisitionChannels: [
      { channel: 'Cursuri prin profesori formați', segment: 'Copii în școli publice', cost: 'Foarte mic' },
      { channel: 'România 6000 (60 orașe simultan)', segment: 'Copii + presă națională', cost: 'Mic' },
      { channel: 'Concursuri gratuite mall-uri', segment: 'Copii + familii shopping', cost: 'Foarte mic' },
      { channel: 'Festivalul Margareta Perevoznic', segment: 'Comunitate șah Iași', cost: 'Mic' },
      { channel: 'Distribuție materiale gratuite', segment: 'Școli rurale + urbane', cost: 'Mediu' },
      { channel: 'Parteneriate ISJ + Primării', segment: 'Instituții educaționale', cost: 'Foarte mic' },
      { channel: 'Circuitul Național', segment: 'Profesori formați - retenție', cost: 'Mic' },
    ],
    strengths: [
      '125.000 copii beneficiari în 2025 (creștere 316% din 2022)',
      'Acoperire națională: 37 județe, 270 evenimente/an',
      '2.500 profesori formați gratuit - multiplicatori în sistem',
      'Locul I Gala Societății Civile 2024 - credibilitate maximă',
      'AQUA Carpatica partener 10+ ani - stabilitate financiară',
      'Model non-profit unic: sponsori plătesc, copii/profesori beneficiază gratuit',
      'Acreditare CCD Iași - credite formare profesională obligatorii',
    ],
    weaknesses: [
      'Instagram aproape inexistent (44 followers vs 125.000 beneficiari)',
      'Dependență ridicată de sponsorul ancoră AQUA Carpatica',
      'Concentrare geografică pe Iași/Moldova - Vest subdezvolvat',
      'Confuzie de brand cu "șah în școală" generic (CSU folosește același termen)',
      'Lipsa platformei tehnologice (fără LMS, fără joc online între școli)',
      'Vulnerabil la schimbări politice la Ministerul Educației',
    ],
    locations: [
      { name: 'Sediu Iași (origine)', sector: 0 },
      { name: 'Acoperire națională - 37 județe', sector: 0 },
    ],
    socialMedia: {
      facebook: { name: 'Șah în Școală', followers: 5000 },
      instagram: { handle: '@sahinscoala', followers: 44, posts: 33 },
    },
    financials: {
      pricing: {
        model: 'Non-profit - gratuit pentru beneficiari',
        note: 'Copiii și profesorii beneficiază gratuit, sponsorii plătesc',
      },
      operations: { beneficiaries_2025: 125000, teachers_trained: 2500 },
      estimates: { model: 'sponsorship_based', note: 'Nu vinde cursuri - model complet diferit' },
      revenue_2025: {
        model: 'Sponsorizări corporate',
        annual_min_ron: 500000, annual_max_ron: 1000000,
        annual_min_eur: 100000, annual_max_eur: 200000,
      },
      revenue_2026: {
        annual_min_ron: 600000, annual_max_ron: 1200000,
        annual_min_eur: 120000, annual_max_eur: 240000,
        growth_rate_percent: 20,
        note: 'Creștere estimată după premiul Gala Societății Civile 2024',
      },
      sponsors: ['AQUA Carpatica', 'Rompetrol', 'UniCredit', 'Egger', 'Leier', 'Toyota Iași Est', 'Adservio'],
      data_source: 'sahinscoala.org, cercetare mai 2026',
      confidence: 'low-medium',
    },
  },
  {
    id: '4',
    name: 'CSU ASE Superbet',
    website: 'csu.ase.ro',
    description: 'Club universitar de elită - cel mai puternic club de șah din România, 4/5 membri echipă olimpică masculină, Anand pe board 1',
    foundedYear: 2017,
    keyMechanisms: [
      { rank: 1, name: 'Brand-ul ASE - credibilitate instituțională', description: 'Universitate de 100+ ani, 60.680 followers Facebook - asocierea cu ASE = asociere cu elita academică românească, deschide automat ușa CSR', year: '2017' },
      { rank: 2, name: 'Echipa olimpică națională ca active', description: '4/5 membri echipă olimpică masculină (Lupulescu, Pârligras, Gavrilescu, Jianu) + 3/5 feminină - sponsorul investește în echipa națională prin vehicul', year: '2022' },
      { rank: 3, name: 'Deal-ul transformator Superbet', description: 'Parteneriat cu Grupul și Fundația Superbet (toamna 2022) - rebranding în CSU ASE Superbet, finanțare deplasări europene, buget legitimare Anand', year: '2022' },
      { rank: 4, name: 'Performanță instantanee măsurabilă', description: 'Aur Superliga masculin+feminin (sept 2022), Argint Cupa Europeană feminin (oct 2022) - ROI imediat pentru sponsor', year: '2022' },
      { rank: 5, name: 'Asseturi globale - Anand, Sokolov', description: 'Viswanathan Anand (5x campion mondial, >2.800 ELO) + Ivan Sokolov antrenor - acoperire presă internațională, nu doar românească', year: '2022' },
      { rank: 6, name: 'Club multi-sport - vânzare segmentată', description: '10+ secțiuni (șah, baschet, volei, e-sports, fitness etc.) - fiecare sponsor își alege secțiunea (Mastercard la șah, World Class la fitness)', year: '2021' },
      { rank: 7, name: 'Tiberiu Georgescu - vector relații', description: 'MI + Lect. univ. dr. - manager, antrenor, căpitan simultan - vorbește limbaj academic, sportiv și corporate, închide deal-urile', year: '2017-2026' },
    ],
    acquisitionChannels: [
      { channel: 'Brand instituțional ASE', segment: 'Corporații cu CSR', cost: 'Foarte mic' },
      { channel: 'Performanță echipă olimpică', segment: 'Sponsori patriotici', cost: 'Mare' },
      { channel: 'Acoperire media (Agerpres, Newsweek)', segment: 'Sponsori care vor PR', cost: 'Mic' },
      { channel: 'Formular B2B pe site', segment: 'Sponsori inbound', cost: 'Foarte mic' },
      { channel: 'Networking Tiberiu Georgescu', segment: 'Toți sponsorii - relație directă', cost: 'Foarte mic' },
      { channel: 'Aula Magna ASE pentru semnări', segment: 'Sponsori care vor PR formal', cost: 'Foarte mic' },
      { channel: 'Ecosistem Superbet ca signaling', segment: 'Sponsori conservatori', cost: 'Foarte mic' },
    ],
    strengths: [
      '4/5 membri echipă olimpică masculină + 3/5 feminină',
      'Viswanathan Anand (5x campion mondial) pe board 1 - primul >2.800 ELO la club românesc',
      'Campioni Superliga Națională din 2022 (masculin + feminin)',
      'Argint Cupa Cluburilor Europene 2022 - prima medalie RO în 24 ani',
      'Coaliție sponsori: Superbet, ONE United Properties, Mastercard, World Class',
      'Brand ASE 100+ ani - credibilitate instituțională imposibil de replicat',
      'Ivan Sokolov - cel mai pe val antrenor al momentului',
    ],
    weaknesses: [
      'Dependență ridicată de Superbet - numele clubului depinde de sponsor',
      'Concentrare pe seniori - nu construiește pipeline juniori propriu',
      'Facebook doar 4.890 likes (vs 37.000 ACS Oxygen, 23.572 CSU București)',
      'Asseturi non-românești (Anand, Saduakassova) - risc reputațional',
      'Dependență de un singur om - Tiberiu Georgescu',
      'Nu vinde cursuri retail - model incompatibil cu achiziție părinți',
    ],
    locations: [
      { name: 'Sediu Occidentului', sector: 1, address: 'str. Occidentului nr. 7' },
    ],
    socialMedia: {
      facebook: { name: 'CSU ASE București', likes: 4890 },
    },
    financials: {
      pricing: {
        model: 'Club elită sponsorizat - nu vinde cursuri retail',
        note: 'Revenue 100% din sponsori corporate',
      },
      operations: { facebook_followers: 4890 },
      estimates: { model: 'corporate_sponsorship', note: 'Nu vinde cursuri - model complet diferit de școlile de șah' },
      revenue_2025: {
        model: 'Sponsorizări corporate',
        annual_min_ron: 1000000, annual_max_ron: 2000000,
        annual_min_eur: 200000, annual_max_eur: 400000,
      },
      revenue_2026: {
        annual_min_ron: 1200000, annual_max_ron: 2500000,
        annual_min_eur: 240000, annual_max_eur: 500000,
        growth_rate_percent: 20,
        note: 'Potențial creștere cu rezultate olimpice',
      },
      sponsors: ['Superbet (naming)', 'ONE United Properties', 'Mastercard', 'World Class'],
      data_source: 'csu.ase.ro, cercetare mai 2026',
      confidence: 'low',
    },
  },
  {
    id: '5',
    name: 'Saint Louis Chess Club (STLCC)',
    website: 'saintlouischessclub.org',
    description: 'Cel mai influent club de șah din lume - Chess Capital of the United States (2014), 2.000+ membri, 45.000+ elevi, 20+ GM relocați',
    foundedYear: 2008,
    keyMechanisms: [
      { rank: 1, name: 'Patron unic: Rex Sinquefield ($50M+)', description: 'Co-fondator Dimensional Fund Advisors ($230B+ AUM), a investit $50M+ în șah până în 2018 - face totul posibil, niciun alt club nu are capital comparabil', year: '2007-2026' },
      { rank: 2, name: 'Gazda U.S. Championship (din 2009)', description: 'Găzduiește anual U.S. Championship + U.S. Women\'s Championship + U.S. Junior - cicluri de presă gratuite, aliniere USCF, credibilitate pentru fundraising', year: '2009-2026' },
      { rank: 3, name: 'Sinquefield Cup - Grand Chess Tour', description: 'Singurul stop american pe Grand Chess Tour, top 8-10 GM mondial anual - ediția 2014 cel mai puternic turneu din istorie (ELO mediu 2802)', year: '2013-2026' },
      { rank: 4, name: 'Chess Capital of the United States', description: 'Rezoluție Senat SUA 2014 - recunoaștere guvernamentală imposibil de replicat, semnal permanent de calitate pentru sponsori și parteneri', year: '2014' },
      { rank: 5, name: 'Operațiune broadcast profesionistă', description: 'YouTube + Twitch cu GM Yasser Seirawan, GM Maurice Ashley, GM Peter Svidler - acoperă și evenimente non-STLCC (FIDE Candidates 2026)', year: '2013-2026' },
      { rank: 6, name: 'Scholastic Outreach Initiative', description: '45.000+ elevi serviți din 2008, 100+ școli anual, 1.000+ membership-uri USCF gratuite - pipeline viitori membri + legitimitate non-profit', year: '2008-2026' },
      { rank: 7, name: 'Magnetism talent - 20+ GM relocați', description: 'Nakamura, Caruana, Wesley So + alții s-au mutat în St. Louis - flywheel auto-întăritor: GM atrag GM, prestigiu se compune anual', year: '2008-2026' },
    ],
    acquisitionChannels: [
      { channel: 'Sinquefield seed capital', segment: 'Fundație - face totul posibil', cost: 'Foarte mic' },
      { channel: 'U.S. Championship venue', segment: 'Presă + USCF + donatori', cost: 'Mediu' },
      { channel: 'Sinquefield Cup / Grand Chess Tour', segment: 'Audiență broadcast globală', cost: 'Mare' },
      { channel: 'YouTube + Twitch broadcast', segment: 'Vizualizatori globali → membri', cost: 'Mic' },
      { channel: 'Scholastic Outreach (100+ școli)', segment: 'Elevi + comunitate + donatori', cost: 'Mediu' },
      { channel: 'Resident Grandmaster program', segment: 'Membri avansați', cost: 'Mediu' },
      { channel: 'Ladies Knight weekly social', segment: 'Membre femei', cost: 'Mic' },
    ],
    strengths: [
      'Patron unic Rex Sinquefield - $50M+ investiți, stabilitate pe 20 ani',
      'Chess Capital of the United States - rezoluție Senat 2014',
      '20+ GM relocați în St. Louis (Nakamura, Caruana, Wesley So)',
      'Broadcast profesionist - echipă GM comentatori fără egal mondial',
      '45.000+ elevi serviți + 100+ școli partenere anual',
      '80+ turnee/an, 1.400+ turnee cumulate, 69.000+ partide cotate',
      'Expansiune 30.000 sq ft în curs - studio producție dedicat',
    ],
    weaknesses: [
      'Dependență de patron unic - Rex Sinquefield are 81 ani în 2026',
      'Scandal Ramirez 2022-2023 - Lichess a reluat suportul abia în iunie 2025',
      'Concentrare geografică - totul în Central West End, fără diversificare',
      'Doar 2.000 membri vs audiență broadcast de milioane - conversie slabă',
      '80+ turnee/an - risc de oboseală staff și erori operaționale',
      'Fără e-commerce/merchandise la scara audienței (vs Chess.com)',
    ],
    locations: [
      { name: 'Central West End, St. Louis', sector: 0, address: '4657 Maryland Avenue, St. Louis, MO 63108' },
    ],
    socialMedia: {
      facebook: { name: 'Saint Louis Chess Club', followers: 64706 },
    },
    financials: {
      pricing: {
        currency: 'USD',
        membership_monthly: { student: 10, adult: 15 },
        membership_annual: { student: 50, adult: 100, family: 150 },
        note: 'Include: free private lesson, GM lectures, open play, library access, 15% shop discount',
      },
      operations: { active_members: 2000, facebook_followers: 64706 },
      estimates: { model: 'patron_funded_nonprofit', note: 'Membership revenue e doar o fracțiune din buget - Rex Sinquefield $50M+ total' },
      revenue_2025: {
        annual_min_eur: 200000, annual_max_eur: 300000,
        note: 'Membership only. Total budget estimat $3-5M (include turnee, broadcast, salarii GM)',
      },
      revenue_2026: {
        annual_min_eur: 230000, annual_max_eur: 350000,
        growth_rate_percent: 15,
        note: 'Creștere estimată cu expansiunea 30,000 sq ft. Total budget $4-6M',
      },
      sponsors: ['Rex Sinquefield Foundation', 'Corporate donors', 'Foundation grants'],
      additional_revenue: ['Tournament fees', 'Gift shop', 'Private lessons', 'Scholastic programs'],
      data_source: 'saintlouischessclub.org, Wikipedia, cercetare mai 2026',
      confidence: 'medium-high',
    },
  },
];
