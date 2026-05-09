'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Target, TrendingUp, AlertTriangle, CheckCircle2, Calendar, Users, Building2, Lightbulb } from 'lucide-react';
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
        <MasterDocumentView content={masterDoc.content as MasterDocContent} />
      )}

      {/* Analiza Profunda Content */}
      {activeDoc === 'the-square-analiza-profunda' && analizaDoc && (
        <AnalizaProfundaView content={analizaDoc.content as AnalizaProfundaContent} />
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
  design_team: Array<{
    name: string;
    role: string;
    contribution: string;
  }>;
  conclusion: string;
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

          <h3 className="text-lg font-semibold mt-6">Echipa de Design</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {content.design_team.map((member, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.contribution}</p>
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
