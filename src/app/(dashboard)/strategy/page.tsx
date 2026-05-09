'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  TrendingUp,
  Lightbulb,
  Flag,
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Ticket,
  GraduationCap,
  MapPin,
  Trophy,
  Users,
  Share2,
  Globe,
  Rocket,
  Monitor,
  Briefcase,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
}

interface FocusArea {
  id: number;
  title: string;
  revenue_potential: string;
  why_it_works: string[];
  actions: Array<{
    action: string;
    deadline: string;
    status?: string;
  }>;
}

interface RevenueProjection {
  current: { total: string };
  dec_2026: { total: string };
  dec_2027: { total: string };
}

export default function StrategyPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('growth');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('not_started');

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Expand to 500 members',
      description: 'Grow club membership to 500 active members',
      category: 'growth',
      deadline: '2025-12-31',
      status: 'in_progress',
    },
    {
      id: '2',
      title: 'Launch YouTube Channel',
      description: 'Create educational chess content for wider reach',
      category: 'marketing',
      deadline: '2025-05-16',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Partner with 10 schools',
      description: 'Establish chess programs in local schools',
      category: 'partnerships',
      deadline: '2025-09-01',
      status: 'not_started',
    },
    {
      id: '4',
      title: 'Host international tournament',
      description: 'Organize a major chess tournament with international players',
      category: 'events',
      deadline: '2025-08-15',
      status: 'not_started',
    },
  ]);

  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [revenueProjection, setRevenueProjection] = useState<RevenueProjection | null>(null);
  const [loadingFocus, setLoadingFocus] = useState(true);

  useEffect(() => {
    async function fetchFocusAreas() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('strategic_documents')
        .select('content')
        .eq('slug', 'the-square-focus-strategic-2026')
        .single();

      if (!error && data?.content) {
        const content = data.content as { focus_areas?: FocusArea[]; revenue_projection?: RevenueProjection };
        if (content.focus_areas) {
          setFocusAreas(content.focus_areas);
        }
        if (content.revenue_projection) {
          setRevenueProjection(content.revenue_projection);
        }
      }
      setLoadingFocus(false);
    }
    fetchFocusAreas();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      category,
      deadline,
      status,
    };
    setGoals([...goals, newGoal]);
    toast.success('Goal added!', {
      description: `"${title}" has been added to your strategy.`,
    });
    setOpen(false);
    setTitle('');
    setDescription('');
    setCategory('growth');
    setDeadline('');
    setStatus('not_started');
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, typeof Target> = {
      growth: TrendingUp,
      marketing: Lightbulb,
      partnerships: Flag,
      events: Calendar,
    };
    const Icon = icons[cat] || Target;
    return <Icon className="h-5 w-5" />;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      growth: 'Growth',
      marketing: 'Marketing',
      partnerships: 'Partnerships',
      events: 'Events',
    };
    return labels[cat] || cat;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    }
    if (status === 'in_progress') {
      return (
        <Badge variant="default" className="bg-blue-600">
          <Circle className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Circle className="mr-1 h-3 w-3" />
        Not Started
      </Badge>
    );
  };

  const completedCount = goals.filter((g) => g.status === 'completed').length;
  const inProgressCount = goals.filter((g) => g.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Strategy</h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Define and track your long-term goals and objectives
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Strategic Goal</DialogTitle>
              <DialogDescription>
                Define a new goal to track in your strategy.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the goal..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="partnerships">Partnerships</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(val) => val && setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">strategic objectives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">goals achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* 3 Strategic Focus Areas */}
      {!loadingFocus && focusAreas.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Rocket className="h-6 w-6 text-primary" />
                  Cele 3 Idei Strategice de Focus 2026-2027
                </CardTitle>
                <CardDescription className="mt-1">
                  Plan de maximizare a veniturilor
                </CardDescription>
              </div>
              {revenueProjection && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Proiecție Dec 2027</p>
                  <p className="text-2xl font-bold text-green-600">{revenueProjection.dec_2027.total}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {focusAreas.map((area) => {
                const icons = [Monitor, Briefcase, Crown];
                const colors = ['text-purple-600 bg-purple-500/10', 'text-blue-600 bg-blue-500/10', 'text-amber-600 bg-amber-500/10'];
                const Icon = icons[area.id - 1] || Rocket;
                const colorClass = colors[area.id - 1] || 'text-primary bg-primary/10';

                return (
                  <div key={area.id} className="rounded-lg border p-4 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <Badge className="bg-green-600 mb-2">{area.revenue_potential}</Badge>
                        <h3 className="font-semibold leading-tight">{area.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase">De ce funcționează:</p>
                      <ul className="space-y-1">
                        {area.why_it_works.slice(0, 3).map((reason, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Următorii pași:</p>
                      {area.actions.slice(0, 2).map((action, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3 text-primary" />
                            {action.action.length > 35 ? action.action.substring(0, 35) + '...' : action.action}
                          </span>
                          <Badge variant="outline" className="text-xs">{action.deadline}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {revenueProjection && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-3">Proiecție Venituri Totale</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Acum (Mai 2026)</p>
                    <p className="text-lg font-semibold">{revenueProjection.current.total}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Dec 2026</p>
                    <p className="text-lg font-semibold text-primary">{revenueProjection.dec_2026.total}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Dec 2027</p>
                    <p className="text-xl font-bold text-green-600">{revenueProjection.dec_2027.total}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5 text-primary" />
            Strategic Goals
          </CardTitle>
          <CardDescription>Your long-term objectives and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No goals defined. Click &quot;Add Goal&quot; to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        {getStatusBadge(goal.status)}
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {goal.deadline ? format(new Date(goal.deadline), 'MMM d, yyyy') : 'No deadline'}
                        </span>
                        <Badge variant="secondary">{getCategoryLabel(goal.category)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Acquisition Mechanisms - from Scoala de Sah analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Customer Acquisition Mechanisms
          </CardTitle>
          <CardDescription>
            7 proven strategies from Școala de Șah București analysis (2012-2026)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mechanism 1 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">1. Vouchere Primării (250 RON/lună)</h3>
                  <Badge className="bg-yellow-500">Top Priority</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cel mai puternic avantaj competitiv. Programele „Sport pentru fiecare" acoperă aproape integral abonamentul,
                  transformând serviciul în „aproape gratuit" pentru părinții eligibili.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Activ din ~2022-2023</p>
              </div>
            </div>

            {/* Mechanism 2 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">2. Lecția Gratuită de Probă</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bariera de intrare la zero. Părintele evaluează fit-ul copil-instructor fără calcul economic.
                  Copilul este încadrat la o grupă compatibilă, crescând masiv retenția post-conversie.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Politică din 2012, în toate CTA-urile</p>
              </div>
            </div>

            {/* Mechanism 3 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">3. Ecosistem Turnee pe Vârstă</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Funnel de retenție pe 12+ ani: Cupa Prichindel (5-6 ani) → Cupa Școlii (U6-U16) →
                  Annual Chess Contest (FRȘAH/FIDE) → Divizii Naționale. Nu există moment în care copilul „termină".
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Cupa CSU Online - ediția 50 în feb. 2025</p>
              </div>
            </div>

            {/* Mechanism 4 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                <Flag className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">4. Lock-in Administrativ via FRȘAH</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Odată legitimat la Federația Română de Șah prin club, voucherul de la primărie este alocat pentru o
                  singură ramură sportivă. Schimbarea către alt club implică reluarea procesului birocratic.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Cost de switching real, similar cu telecom</p>
              </div>
            </div>

            {/* Mechanism 5 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">5. Cursuri în Grădinițe, Școli și Afterschool-uri</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  B2B2C la sursă. Instituția aduce volumul de copii, iar clubul îi convertește treptat.
                  Nu trebuie să câștigi atenția părintelui - copilul descoperă șahul în mediul lui zilnic.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Canal extins constant 2015-2026</p>
              </div>
            </div>

            {/* Mechanism 6 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">6. Recomandare 10% + Frați 25%</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monetizarea explicită a word-of-mouth. Decizia părintelui se ia preponderent prin alți părinți.
                  10% reducere pentru recomandare, 25% pentru frați. Foarte ieftin, foarte eficient.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Politică de prețuri afișată din 2020+</p>
              </div>
            </div>

            {/* Mechanism 7 */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">7. Multi-locație + Online + Tabere</h3>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acoperire geografică superioară: sedii multiple + Zoom + tabere de vară (10 ediții, 700+ copii)
                  și de iarnă (6 ediții). Indiferent de profilul clientului, există un format compatibil.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Consolidat 2020-2025, online accelerat în 2020</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acquisition Channels Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Canale de Achiziție - Sumar
          </CardTitle>
          <CardDescription>Costuri și segmente țintă pentru fiecare canal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-semibold">Canal</th>
                  <th className="pb-3 text-left font-semibold">Segment</th>
                  <th className="pb-3 text-left font-semibold">Cost Achiziție</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3">Lecție gratuită de probă</td>
                  <td className="py-3">Copii (5-14 ani)</td>
                  <td className="py-3"><Badge variant="secondary">Mediu</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Vouchere primării 250 RON</td>
                  <td className="py-3">Copii - părinți cost-conscious</td>
                  <td className="py-3"><Badge className="bg-green-600">Foarte mic</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Cursuri grădinițe/școli</td>
                  <td className="py-3">Copii (3-10 ani)</td>
                  <td className="py-3"><Badge className="bg-green-600">Mic</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Tabere vară/iarnă</td>
                  <td className="py-3">Copii - entry point</td>
                  <td className="py-3"><Badge variant="secondary">Mediu</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Turnee interne</td>
                  <td className="py-3">Copii performanță + adulți</td>
                  <td className="py-3"><Badge className="bg-green-600">Mic</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Recomandări 10% + frați 25%</td>
                  <td className="py-3">Familii existente</td>
                  <td className="py-3"><Badge className="bg-green-600">Foarte mic</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Cursuri online Zoom</td>
                  <td className="py-3">Copii + adulți din toată țara</td>
                  <td className="py-3"><Badge className="bg-green-600">Mic</Badge></td>
                </tr>
                <tr>
                  <td className="py-3">Workshopuri corporate</td>
                  <td className="py-3">Adulți (B2B)</td>
                  <td className="py-3"><Badge variant="secondary">Mediu</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-primary" />
            Concluzie Strategică
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <strong>Bariera zero</strong> (mecanismele 1-2) atrage prospectul, <strong>mecanismele de lock-in și distribuție</strong> (3-5)
            mențin și extind, iar <strong>amplificatorii</strong> (6-7) accelerează creșterea organică.
            Avantajul real nu este nici prețul, nici antrenorii, nici sediul, ci faptul că toate aceste mecanisme
            sunt integrate într-un funnel unitar pe care un competitor mai mic l-ar putea replica doar parțial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
