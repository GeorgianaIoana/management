'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Target, TrendingUp, AlertTriangle, CheckCircle2, Calendar, Users, Building2, Lightbulb, Rocket, DollarSign, Briefcase, Crown, Monitor, Trophy, Zap, Handshake, Gift, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface StrategicDocument {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  content: Record<string, unknown>;
  created_at: string;
}

export default function DocumenteAsociatiePage() {
  const [documents, setDocuments] = useState<StrategicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('strategic_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDocuments(data);
        if (data.length > 0) {
          setActiveDoc(data[0].slug);
        }
      }
      setLoading(false);
    }
    fetchDocuments();
  }, []);

  const masterDoc = documents.find(d => d.slug === 'the-square-master-2026');
  const analizaDoc = documents.find(d => d.slug === 'the-square-analiza-profunda');
  const focusDoc = documents.find(d => d.slug === 'the-square-focus-strategic-2026');
  // Filter out competitor documents - they belong in the competitors page
  const internalDocs = documents.filter(d => d.category === 'internal');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Se încarcă documentele...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documente Strategice</h1>
        <p className="text-muted-foreground">
          Analize, strategii și documente de referință pentru The Square
        </p>
      </div>

      {/* Document Selector */}
      <div className="flex gap-4 flex-wrap">
        {internalDocs.map((doc) => (
          <Card
            key={doc.id}
            className={`cursor-pointer transition-all hover:border-primary ${activeDoc === doc.slug ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => setActiveDoc(doc.slug)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <Badge variant={doc.category === 'internal' ? 'default' : 'secondary'}>
                  {doc.category === 'internal' ? 'Intern' : 'Competitor'}
                </Badge>
              </div>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Master Document Content */}
      {activeDoc === 'the-square-master-2026' && masterDoc && (
        <MasterDocumentView content={masterDoc.content as unknown as MasterDocContent} />
      )}

      {/* Analiza Profunda Content */}
      {activeDoc === 'the-square-analiza-profunda' && analizaDoc && (
        <AnalizaProfundaView content={analizaDoc.content as unknown as AnalizaProfundaContent} />
      )}

      {/* Focus Strategic 2026 Content */}
      {activeDoc === 'the-square-focus-strategic-2026' && focusDoc && (
        <FocusStrategicView content={focusDoc.content as unknown as FocusStrategicContent} />
      )}

      {internalDocs.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nu există documente încărcate.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Types for document content
interface MasterDocContent {
  dashboard: {
    years_operating: number;
    initial_investment_eur: number;
    instagram_followers: number;
    instagram_posts: number;
    titled_coaches: number;
    locations: number;
    websites: number;
    open_editions: number;
  };
  critical_actions: Array<{
    priority: string;
    action: string;
    description: string;
    deadline: string;
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  kpis: Array<{
    name: string;
    current: string | number;
    target_dec_2026: string | number;
    target_dec_2027: string | number;
  }>;
  scenarios: Array<{
    name: string;
    philosophy: string;
    investment_eur: string;
    risk: string;
    students_12mo: string;
    revenue_12mo: string;
    margin: string;
    recommended?: boolean;
  }>;
  roadmap: Record<string, string[]>;
  golden_reasons: Array<{
    rank: number;
    title: string;
    description: string;
  }>;
  founders: Array<{
    name: string;
    role: string;
    achievements?: string[];
    background: string;
  }>;
}

interface AnalizaProfundaContent {
  positioning: {
    tagline: string;
    target_segment: string;
    differentiator: string;
    age_years: number;
    initial_investment_eur: number;
  };
  golden_reasons: Array<{
    rank: number;
    title: string;
    description: string;
    year: string;
  }>;
  comparison_table: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
  business_model: Record<string, unknown>;
  acquisition_channels: Array<{
    channel: string;
    type: string;
    description: string;
  }>;
  strengths: string[];
  vulnerabilities: Array<{
    issue: string;
    detail: string;
  }>;
  opportunities: Array<{
    opportunity: string;
    action: string;
    priority: string;
  }>;
  timeline: Array<{
    year: number | string;
    event: string;
  }>;
  founders_detail: Array<{
    name: string;
    role: string;
    palmares_national?: string[];
    palmares_international?: string[];
    background?: string | string[];
    experience?: string;
    responsibilities?: string;
  }>;
  contact_info?: {
    phone: string;
    hours_weekday: string;
    hours_weekend: string;
    languages: string[];
    rating: string;
    reviews_count: number;
    address: string;
  };
  services?: string[];
  conclusion: string;
}

interface FocusStrategicContent {
  current_situation: {
    revenue_monthly_eur: string;
    students_active: string;
    initial_investment_eur: number;
    team_size: number;
    team_members?: string[];
    locations: number;
    unique_differentiator: string;
    note: string;
  };
  competition: Array<{
    name: string;
    revenue_monthly_eur: string;
    focus: string;
    vulnerability: string;
  }>;
  unique_advantages: Array<{
    title: string;
    description: string;
  }>;
  focus_areas: Array<{
    id: number;
    title: string;
    revenue_potential: string;
    why_it_works: string[];
    products?: Array<{
      name: string;
      price_eur?: number | string;
      type?: string;
      duration?: string;
      target?: string;
      includes?: string[];
      features?: string[];
    }>;
    membership_tiers?: Array<{
      tier: number;
      name: string;
      price_eur: number;
      benefits: string[];
    }>;
    content_strategy?: string[];
    target_companies?: Record<string, string[]>;
    additional_benefits?: Array<{
      type: string;
      description?: string;
      examples?: string[];
    }>;
    skills_utilized: Record<string, string>;
    actions: Array<{
      action: string;
      deadline: string;
      status?: string;
    }>;
    platform?: string;
    platforms?: string[];
    target_audience?: Record<string, string>;
  }>;
  revenue_projection: {
    current: {
      period: string;
      traditional_courses: string;
      ai_academy: string;
      corporate_b2b: string;
      social_club: string;
      total: string;
    };
    dec_2026: {
      period: string;
      traditional_courses: string;
      ai_academy: string;
      corporate_b2b: string;
      social_club: string;
      total: string;
    };
    dec_2027: {
      period: string;
      traditional_courses: string;
      ai_academy: string;
      corporate_b2b: string;
      social_club: string;
      total: string;
    };
  };
  why_these_3_ideas: Array<{
    reason: string;
    explanation: string;
  }>;
  risks_and_mitigations: Array<{
    risk: string;
    mitigation: string;
  }>;
  immediate_next_steps: Array<{
    week?: number;
    month?: number;
    action: string;
    lead: string;
  }>;
  performance_acquisition?: {
    target: string;
    channels: Array<{
      name: string;
      cost: string;
      effort: string;
      effectiveness: string;
      actions: string[];
      note?: string;
    }>;
    priority_order: string[];
  };
  sponsorship_strategy?: {
    overview: string;
    what_you_offer: Array<{
      asset: string;
      value: string;
      sponsorship_type: string;
    }>;
    sponsor_tiers: Array<{
      tier: string;
      price_eur: string;
      benefits: string[];
      target: string;
      note?: string;
    }>;
    target_sponsors: Record<string, {
      companies: string[];
      why: string;
      approach: string;
    }>;
    outreach_strategy: Array<{
      step: number;
      action: string;
      details: string;
      deadline: string;
    }>;
    pitch_template: {
      subject: string;
      structure: string[];
    };
    mistakes_to_avoid: string[];
    quick_wins: Array<{
      action: string;
      reason: string;
    }>;
  };
}

function MasterDocumentView({ content }: { content: MasterDocContent }) {
  return (
    <Tabs defaultValue="dashboard" className="space-y-4">
      <TabsList className="flex-wrap h-auto gap-1">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="actions">Acțiuni Critice</TabsTrigger>
        <TabsTrigger value="swot">SWOT</TabsTrigger>
        <TabsTrigger value="kpis">KPI-uri</TabsTrigger>
        <TabsTrigger value="scenarios">Scenarii</TabsTrigger>
        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        <TabsTrigger value="golden">7 Motive de Aur</TabsTrigger>
        <TabsTrigger value="founders">Fondatori</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Calendar />} label="Ani operare" value={content.dashboard.years_operating} />
          <StatCard icon={<Target />} label="Investiție inițială" value={`${content.dashboard.initial_investment_eur.toLocaleString()}€`} />
          <StatCard icon={<Users />} label="Followers IG" value={content.dashboard.instagram_followers.toLocaleString()} />
          <StatCard icon={<FileText />} label="Postări IG" value={content.dashboard.instagram_posts} />
          <StatCard icon={<Users />} label="Antrenori titrați" value={content.dashboard.titled_coaches} />
          <StatCard icon={<Building2 />} label="Sedii" value={content.dashboard.locations} />
          <StatCard icon={<FileText />} label="Site-uri" value={content.dashboard.websites} />
          <StatCard icon={<Target />} label="Ediții Open" value={content.dashboard.open_editions} />
        </div>
      </TabsContent>

      <TabsContent value="actions">
        <div className="space-y-3">
          {content.critical_actions.map((action, i) => (
            <Card key={i} className={action.priority === 'P0' ? 'border-red-500' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Badge variant={action.priority === 'P0' ? 'destructive' : action.priority === 'P1' ? 'default' : 'secondary'}>
                    {action.priority}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold">{action.action}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    <p className="text-sm text-primary mt-2">Termen: {action.deadline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="swot">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.swot.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-green-600">✓</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" /> Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.swot.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-red-600">⚠</span> {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" /> Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.swot.opportunities.map((o, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-blue-600">→</span> {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-orange-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" /> Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.swot.threats.map((t, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-orange-600">⚡</span> {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="kpis">
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">KPI</th>
                    <th className="text-right py-2 px-3">Acum (Mai 2026)</th>
                    <th className="text-right py-2 px-3">Țintă Dec 2026</th>
                    <th className="text-right py-2 px-3">Țintă Dec 2027</th>
                  </tr>
                </thead>
                <tbody>
                  {content.kpis.map((kpi, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{kpi.name}</td>
                      <td className="text-right py-2 px-3 text-muted-foreground">{kpi.current}</td>
                      <td className="text-right py-2 px-3 text-primary">{kpi.target_dec_2026}</td>
                      <td className="text-right py-2 px-3 text-primary font-semibold">{kpi.target_dec_2027}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scenarios">
        <div className="grid gap-4 md:grid-cols-3">
          {content.scenarios.map((scenario, i) => (
            <Card key={i} className={scenario.recommended ? 'border-primary border-2' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  {scenario.recommended && <Badge>Recomandat</Badge>}
                </div>
                <CardDescription>{scenario.philosophy}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investiție:</span>
                  <span className="font-medium">{scenario.investment_eur} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risc:</span>
                  <Badge variant={scenario.risk === 'Mic' ? 'secondary' : scenario.risk === 'Mediu' ? 'default' : 'destructive'}>
                    {scenario.risk}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cursanți (12 luni):</span>
                  <span className="font-medium">{scenario.students_12mo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue (12 luni):</span>
                  <span className="font-medium">{scenario.revenue_12mo} EUR/lună</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marjă:</span>
                  <span className="font-medium">{scenario.margin}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="roadmap">
        <div className="space-y-4">
          {Object.entries(content.roadmap).map(([quarter, items]) => (
            <Card key={quarter}>
              <CardHeader>
                <CardTitle>{quarter.replace('_', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="golden">
        <div className="space-y-3">
          {content.golden_reasons.map((reason) => (
            <Card key={reason.rank}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {reason.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold">{reason.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{reason.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="founders">
        <div className="grid gap-4 md:grid-cols-3">
          {content.founders.map((founder, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{founder.name}</CardTitle>
                <CardDescription>{founder.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {founder.achievements && (
                  <div>
                    <p className="text-sm font-medium mb-1">Palmares:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {founder.achievements.map((a, j) => (
                        <li key={j}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{founder.background}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function AnalizaProfundaView({ content }: { content: AnalizaProfundaContent }) {
  return (
    <Tabs defaultValue="positioning" className="space-y-4">
      <TabsList className="flex-wrap h-auto gap-1">
        <TabsTrigger value="positioning">Poziționare</TabsTrigger>
        <TabsTrigger value="golden">7 Motive de Aur</TabsTrigger>
        <TabsTrigger value="comparison">Comparație</TabsTrigger>
        <TabsTrigger value="channels">Canale Achiziție</TabsTrigger>
        <TabsTrigger value="swot">Strengths & Vulnerabilități</TabsTrigger>
        <TabsTrigger value="opportunities">Oportunități</TabsTrigger>
        <TabsTrigger value="founders">Fondatori & Echipă</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="positioning">
        <Card>
          <CardHeader>
            <CardTitle>Poziționare THE SQUARE</CardTitle>
            <CardDescription>{content.positioning.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Segment țintă</p>
                <p className="font-semibold">{content.positioning.target_segment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diferențiator</p>
                <p className="font-semibold">{content.positioning.differentiator}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vechime</p>
                <p className="font-semibold">{content.positioning.age_years} ani</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investiție inițială</p>
                <p className="font-semibold">{content.positioning.initial_investment_eur.toLocaleString()} EUR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="golden">
        <div className="space-y-3">
          {content.golden_reasons.map((reason) => (
            <Card key={reason.rank}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {reason.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{reason.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{reason.description}</p>
                    <Badge variant="outline" className="mt-2">{reason.year}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="comparison">
        <Card>
          <CardHeader>
            <CardTitle>Comparație cu competitorii</CardTitle>
            <CardDescription>THE SQUARE vs cluburile tradiționale din București</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {content.comparison_table.headers.map((h, i) => (
                      <th key={i} className={`py-2 px-3 ${i === 0 ? 'text-left' : 'text-center'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.comparison_table.rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{row.indicator}</td>
                      <td className="py-2 px-3 text-center text-primary font-semibold">{row.the_square}</td>
                      <td className="py-2 px-3 text-center text-muted-foreground">{row.csu}</td>
                      <td className="py-2 px-3 text-center text-muted-foreground">{row.acs}</td>
                      <td className="py-2 px-3 text-center text-muted-foreground">{row.csu_ase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="channels">
        <Card>
          <CardHeader>
            <CardTitle>Canale de achiziție</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.acquisition_channels.map((ch, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant="outline">{ch.type}</Badge>
                  <div>
                    <p className="font-medium">{ch.channel}</p>
                    <p className="text-sm text-muted-foreground">{ch.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="swot">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-green-600">✓</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-orange-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" /> Vulnerabilități
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.vulnerabilities.map((v, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-orange-600">{v.issue}:</span>{' '}
                    <span className="text-muted-foreground">{v.detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="opportunities">
        <div className="space-y-3">
          {content.opportunities.map((opp, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{opp.opportunity}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{opp.action}</p>
                  </div>
                  <Badge variant={opp.priority === 'MAXIMA' || opp.priority === 'INALTA' ? 'default' : 'secondary'}>
                    {opp.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="founders">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fondatori</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {content.founders_detail.map((founder, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{founder.name}</CardTitle>
                  <CardDescription>{founder.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {founder.palmares_national && (
                    <div>
                      <p className="font-medium">Palmares național:</p>
                      <ul className="text-muted-foreground">
                        {founder.palmares_national.map((p, j) => <li key={j}>• {p}</li>)}
                      </ul>
                    </div>
                  )}
                  {founder.palmares_international && (
                    <div>
                      <p className="font-medium">Palmares internațional:</p>
                      <ul className="text-muted-foreground">
                        {founder.palmares_international.map((p, j) => <li key={j}>• {p}</li>)}
                      </ul>
                    </div>
                  )}
                  {founder.background && (
                    <div>
                      <p className="font-medium">Background:</p>
                      {Array.isArray(founder.background) ? (
                        <ul className="text-muted-foreground">
                          {founder.background.map((b, j) => <li key={j}>• {b}</li>)}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">{founder.background}</p>
                      )}
                    </div>
                  )}
                  {founder.experience && <p className="text-muted-foreground">{founder.experience}</p>}
                  {founder.responsibilities && <p className="text-muted-foreground">{founder.responsibilities}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </TabsContent>

      <TabsContent value="timeline">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {content.timeline.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex h-12 min-w-[4.5rem] items-center justify-center rounded bg-muted font-bold text-sm">
                    {item.year}
                  </div>
                  <p className="text-sm flex-1 pt-3">{item.event}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-primary">
          <CardHeader>
            <CardTitle>Concluzie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{content.conclusion}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function FocusStrategicView({ content }: { content: FocusStrategicContent }) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="flex-wrap h-auto gap-1">
        <TabsTrigger value="overview">Situație Curentă</TabsTrigger>
        <TabsTrigger value="idea1">Online Academy</TabsTrigger>
        <TabsTrigger value="idea2">Corporate B2B</TabsTrigger>
        <TabsTrigger value="idea3">Social Club</TabsTrigger>
        <TabsTrigger value="projection">Proiecție Venituri</TabsTrigger>
        <TabsTrigger value="risks">Riscuri & Mitigări</TabsTrigger>
        <TabsTrigger value="performance">Achiziție Performanță</TabsTrigger>
        <TabsTrigger value="sponsorship">Sponsorizări</TabsTrigger>
        <TabsTrigger value="next-steps">Pași Următori</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="space-y-6">
          {/* Current Situation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Situația Actuală The Square
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Venituri lunare</p>
                  <p className="text-2xl font-bold">{content.current_situation.revenue_monthly_eur} EUR</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Cursanți activi</p>
                  <p className="text-2xl font-bold">{content.current_situation.students_active}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Investiție inițială</p>
                  <p className="text-2xl font-bold">{content.current_situation.initial_investment_eur.toLocaleString()} EUR</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Echipă</p>
                  <p className="text-2xl font-bold">{content.current_situation.team_size} antrenori</p>
                  {content.current_situation.team_members && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {content.current_situation.team_members.slice(0, 3).join(', ')}
                      {content.current_situation.team_members.length > 3 && ` +${content.current_situation.team_members.length - 3} alții`}
                    </div>
                  )}
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Locații</p>
                  <p className="text-2xl font-bold">{content.current_situation.locations}</p>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5 border-primary">
                  <p className="text-sm text-muted-foreground">Diferențiator unic</p>
                  <p className="text-lg font-bold text-primary">{content.current_situation.unique_differentiator}</p>
                  <p className="text-xs text-muted-foreground mt-1">{content.current_situation.note}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Competiția în București
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Competitor</th>
                      <th className="text-right py-2 px-3">Venituri/lună</th>
                      <th className="text-center py-2 px-3">Focus</th>
                      <th className="text-left py-2 px-3">Vulnerabilitate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.competition.map((comp, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 font-medium">{comp.name}</td>
                        <td className="text-right py-2 px-3">{comp.revenue_monthly_eur}</td>
                        <td className="text-center py-2 px-3">
                          <Badge variant="outline">{comp.focus}</Badge>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{comp.vulnerability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Unique Advantages */}
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Trophy className="h-5 w-5" />
                Avantaje Unice The Square
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {content.unique_advantages.map((adv, i) => (
                  <div key={i} className="p-3 border rounded-lg border-green-500/30 bg-green-500/5">
                    <p className="font-semibold text-green-700">{adv.title}</p>
                    <p className="text-sm text-muted-foreground">{adv.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3 Focus Ideas Summary */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Cele 3 Idei Strategice de Focus
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {content.focus_areas.map((area) => (
                <Card key={area.id} className="border-primary/50 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {area.id}
                      </div>
                      <Badge variant="default" className="bg-green-600">{area.revenue_potential}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {area.why_it_works.slice(0, 2).map((reason, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="idea1">
        {content.focus_areas[0] && <FocusAreaCard area={content.focus_areas[0]} icon={<Monitor className="h-6 w-6" />} />}
      </TabsContent>

      <TabsContent value="idea2">
        {content.focus_areas[1] && <FocusAreaCard area={content.focus_areas[1]} icon={<Briefcase className="h-6 w-6" />} />}
      </TabsContent>

      <TabsContent value="idea3">
        {content.focus_areas[2] && <FocusAreaCard area={content.focus_areas[2]} icon={<Crown className="h-6 w-6" />} />}
      </TabsContent>

      <TabsContent value="projection">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Proiecție Venituri cu cele 3 Idei
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Sursă de Venit</th>
                      <th className="text-right py-2 px-3 text-muted-foreground">Acum (Mai 2026)</th>
                      <th className="text-right py-2 px-3 text-primary">Dec 2026</th>
                      <th className="text-right py-2 px-3 text-green-600 font-bold">Dec 2027</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-3">Cursuri tradiționale</td>
                      <td className="text-right py-2 px-3 text-muted-foreground">{content.revenue_projection.current.traditional_courses}</td>
                      <td className="text-right py-2 px-3">{content.revenue_projection.dec_2026.traditional_courses}</td>
                      <td className="text-right py-2 px-3">{content.revenue_projection.dec_2027.traditional_courses}</td>
                    </tr>
                    <tr className="border-b bg-purple-500/5">
                      <td className="py-2 px-3 font-medium text-purple-700">Online Academy</td>
                      <td className="text-right py-2 px-3 text-muted-foreground">{content.revenue_projection.current.ai_academy}</td>
                      <td className="text-right py-2 px-3">{content.revenue_projection.dec_2026.ai_academy}</td>
                      <td className="text-right py-2 px-3 font-medium">{content.revenue_projection.dec_2027.ai_academy}</td>
                    </tr>
                    <tr className="border-b bg-blue-500/5">
                      <td className="py-2 px-3 font-medium text-blue-700">Corporate B2B</td>
                      <td className="text-right py-2 px-3 text-muted-foreground">{content.revenue_projection.current.corporate_b2b}</td>
                      <td className="text-right py-2 px-3">{content.revenue_projection.dec_2026.corporate_b2b}</td>
                      <td className="text-right py-2 px-3 font-medium">{content.revenue_projection.dec_2027.corporate_b2b}</td>
                    </tr>
                    <tr className="border-b bg-amber-500/5">
                      <td className="py-2 px-3 font-medium text-amber-700">Social Club Membership</td>
                      <td className="text-right py-2 px-3 text-muted-foreground">{content.revenue_projection.current.social_club}</td>
                      <td className="text-right py-2 px-3">{content.revenue_projection.dec_2026.social_club}</td>
                      <td className="text-right py-2 px-3 font-medium">{content.revenue_projection.dec_2027.social_club}</td>
                    </tr>
                    <tr className="bg-primary/10 font-bold">
                      <td className="py-3 px-3">TOTAL</td>
                      <td className="text-right py-3 px-3">{content.revenue_projection.current.total}</td>
                      <td className="text-right py-3 px-3 text-primary">{content.revenue_projection.dec_2026.total}</td>
                      <td className="text-right py-3 px-3 text-green-600 text-lg">{content.revenue_projection.dec_2027.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                De ce aceste 3 idei și nu altele
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {content.why_these_3_ideas.map((item, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <p className="font-semibold text-primary">{item.reason}</p>
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="risks">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Riscuri și Mitigări
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.risks_and_mitigations.map((item, i) => (
                <div key={i} className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-red-600">Risc</p>
                      <p className="text-sm">{item.risk}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-green-600">Mitigare</p>
                      <p className="text-sm">{item.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance">
        {content.performance_acquisition && (
          <div className="space-y-6">
            <Card className="border-purple-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Trophy className="h-5 w-5" />
                  {content.performance_acquisition.target}
                </CardTitle>
                <CardDescription>
                  Canale de achiziție pentru copii talentați - alternativă la ads-uri
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {content.performance_acquisition.channels.map((channel, i) => (
                <Card key={i} className={channel.name === 'Ads plătite' ? 'border-orange-500/50 bg-orange-500/5' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={channel.cost === 'Gratuit' ? 'default' : channel.cost === 'Mic' ? 'secondary' : 'destructive'} className={channel.cost === 'Gratuit' ? 'bg-green-600' : ''}>
                          {channel.cost}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>Efort: <strong>{channel.effort}</strong></span>
                      <span>Eficacitate: <strong className={channel.effectiveness.includes('mare') ? 'text-green-600' : channel.effectiveness.includes('Mică') ? 'text-orange-600' : ''}>{channel.effectiveness}</strong></span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {channel.actions.map((action, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                    {channel.note && (
                      <p className="mt-3 text-xs text-orange-600 italic">{channel.note}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Ordinea Priorităților
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {content.performance_acquisition.priority_order.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {i + 1}
                      </div>
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>

      <TabsContent value="sponsorship">
        {content.sponsorship_strategy && (
          <div className="space-y-6">
            {/* Overview */}
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-center">{content.sponsorship_strategy.overview}</p>
              </CardContent>
            </Card>

            {/* What You Offer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Ce Oferi Sponsorilor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {content.sponsorship_strategy.what_you_offer.map((item, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <p className="font-semibold">{item.asset}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                      <Badge variant="outline" className="mt-2">{item.sponsorship_type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sponsor Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pachete de Sponsorizare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {content.sponsorship_strategy.sponsor_tiers.map((tier, i) => (
                    <div key={i} className={`p-4 border rounded-lg ${tier.tier === 'Title Sponsor' ? 'border-yellow-500 bg-yellow-500/5' : tier.tier === 'Gold Sponsor' ? 'border-amber-500 bg-amber-500/5' : tier.tier === 'Silver Sponsor' ? 'border-gray-400 bg-gray-100' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold">{tier.tier}</p>
                      </div>
                      <p className="text-lg font-semibold text-primary mb-3">{tier.price_eur}</p>
                      <ul className="space-y-1 text-sm mb-3">
                        {tier.benefits.map((benefit, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-green-600">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground">Target: {tier.target}</p>
                      {tier.note && <p className="text-xs text-orange-600 mt-1 italic">{tier.note}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Sponsors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Sponsori Țintă pe Industrie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(content.sponsorship_strategy.target_sponsors).map(([industry, data]) => (
                    <div key={industry} className="p-4 border rounded-lg">
                      <p className="font-bold text-primary mb-2">{industry}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {data.companies.map((company, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{company}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1"><strong>De ce:</strong> {data.why}</p>
                      <p className="text-sm text-muted-foreground"><strong>Abordare:</strong> {data.approach}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outreach Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Strategie de Outreach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content.sponsorship_strategy.outreach_strategy.map((step) => (
                    <div key={step.step} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.action}</p>
                        <p className="text-sm text-muted-foreground">{step.details}</p>
                      </div>
                      <Badge variant="outline">{step.deadline}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Wins & Mistakes */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-green-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Zap className="h-5 w-5" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.sponsorship_strategy.quick_wins.map((item, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium text-green-700">{item.action}</span>
                        <span className="text-muted-foreground"> — {item.reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Greșeli de Evitat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.sponsorship_strategy.mistakes_to_avoid.map((mistake, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-red-600">✗</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Pitch Template */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" />
                  Template Email Pitch
                </CardTitle>
                <CardDescription>Subject: {content.sponsorship_strategy.pitch_template.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {content.sponsorship_strategy.pitch_template.structure.map((item, i) => (
                    <li key={i} className="text-sm flex gap-3">
                      <span className="font-mono text-primary">{i + 1}.</span>
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>

      <TabsContent value="next-steps">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Următorii Pași Imediați
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.immediate_next_steps.map((step, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex h-12 min-w-[5rem] items-center justify-center rounded bg-primary/10 font-bold text-primary text-sm">
                    {step.week ? `Săpt. ${step.week}` : `Luna ${step.month}`}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.action}</p>
                  </div>
                  <Badge variant="outline">{step.lead} lead</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function FocusAreaCard({ area, icon }: { area: FocusStrategicContent['focus_areas'][0]; icon: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {icon}
            </div>
            <div>
              <Badge variant="default" className="bg-green-600 mb-2">{area.revenue_potential}</Badge>
              <CardTitle className="text-xl">{area.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Why it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            De ce funcționează
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {area.why_it_works.map((reason, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-green-600 font-bold">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Products */}
      {area.products && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Ce construiești / vinzi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {area.products.map((product, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{product.name}</p>
                    {product.price_eur && (
                      <Badge variant="default">{typeof product.price_eur === 'number' ? `${product.price_eur} EUR` : product.price_eur}</Badge>
                    )}
                  </div>
                  {product.type && <p className="text-sm text-muted-foreground mb-2">{product.type}</p>}
                  {product.duration && <p className="text-sm text-muted-foreground mb-2">Durată: {product.duration}</p>}
                  {product.target && <p className="text-sm text-muted-foreground mb-2">Target: {product.target}</p>}
                  {product.includes && (
                    <ul className="text-sm text-muted-foreground">
                      {product.includes.map((item, j) => (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  )}
                  {product.features && (
                    <ul className="text-sm text-muted-foreground">
                      {product.features.map((feature, j) => (
                        <li key={j}>• {feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Membership Tiers */}
      {area.membership_tiers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Membership Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {area.membership_tiers.map((tier) => (
                <div key={tier.tier} className={`p-4 border rounded-lg ${tier.tier === 3 ? 'border-yellow-500 bg-yellow-500/5' : tier.tier === 2 ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-lg">{tier.name}</p>
                    <Badge variant={tier.tier === 3 ? 'default' : tier.tier === 2 ? 'secondary' : 'outline'}>
                      {tier.price_eur} EUR/lună
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Target Companies */}
      {area.target_companies && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Target Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(area.target_companies).map(([category, companies]) => (
                <div key={category} className="p-3 border rounded-lg">
                  <p className="font-semibold text-primary mb-2">{category}</p>
                  <ul className="text-sm text-muted-foreground">
                    {companies.map((company, i) => (
                      <li key={i}>• {company}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Benefits */}
      {area.additional_benefits && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Beneficii Adiționale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {area.additional_benefits.map((benefit, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-semibold">{benefit.type}</p>
                  {benefit.description && <p className="text-sm text-muted-foreground">{benefit.description}</p>}
                  {benefit.examples && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {benefit.examples.map((ex, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{ex}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Utilized */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Skills Utilizate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(area.skills_utilized).map(([name, role]) => (
              <div key={name} className="p-3 border rounded-lg">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Acțiuni Concrete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {area.actions.map((action, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.action}</p>
                </div>
                <Badge variant={action.status === 'completed' ? 'default' : 'outline'} className={action.status === 'completed' ? 'bg-green-600' : ''}>
                  {action.deadline}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      {area.target_audience && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Audiență Țintă
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(area.target_audience).map(([segment, description]) => (
                <div key={segment} className="p-3 border rounded-lg">
                  <p className="font-semibold text-primary">{segment}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {area.platform && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Platformă recomandată: <span className="font-semibold text-primary">{area.platform}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {area.platforms && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Platforme: <span className="font-semibold text-primary">{area.platforms.join(' • ')}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
