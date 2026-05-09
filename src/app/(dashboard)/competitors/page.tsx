'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Trophy,
  TrendingUp,
  TrendingDown,
  MapPin,
  Globe,
  ExternalLink,
  Users,
  Ticket,
  GraduationCap,
  Award,
  Calendar,
  DollarSign,
  Banknote,
} from 'lucide-react';
import { competitors, type Competitor } from '@/data/competitors';

const mechanismIcons: Record<number, typeof Trophy> = {
  1: Ticket,
  2: Award,
  3: Trophy,
  4: Building2,
  5: GraduationCap,
  6: Users,
  7: MapPin,
};

const mechanismColors: Record<number, string> = {
  1: 'bg-yellow-500/10 text-yellow-600',
  2: 'bg-green-500/10 text-green-600',
  3: 'bg-blue-500/10 text-blue-600',
  4: 'bg-red-500/10 text-red-600',
  5: 'bg-purple-500/10 text-purple-600',
  6: 'bg-orange-500/10 text-orange-600',
  7: 'bg-cyan-500/10 text-cyan-600',
};

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{competitor.name}</CardTitle>
              <CardDescription className="mt-1">{competitor.description}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                {competitor.website}
              </a>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">Founded {competitor.foundedYear}</Badge>
            {competitor.locations.map((loc) => (
              <Badge key={loc.name} variant="secondary">
                <MapPin className="mr-1 h-3 w-3" />
                S{loc.sector} - {loc.name}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {competitor.socialMedia.facebook && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">f</span>
                {competitor.socialMedia.facebook.followers?.toLocaleString() || competitor.socialMedia.facebook.likes?.toLocaleString()} followers
              </div>
            )}
            {competitor.socialMedia.instagram && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-purple-600 to-pink-500 text-[10px] font-bold text-white">ig</span>
                {competitor.socialMedia.instagram.followers.toLocaleString()} followers
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Mechanisms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-primary" />
            7 Key Acquisition Mechanisms
          </CardTitle>
          <CardDescription>Ranked by impact on customer acquisition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitor.keyMechanisms.map((mech) => {
              const Icon = mechanismIcons[mech.rank] || Trophy;
              const colorClass = mechanismColors[mech.rank] || 'bg-gray-500/10 text-gray-600';
              return (
                <div key={mech.rank} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">#{mech.rank}</Badge>
                      <h3 className="font-semibold">{mech.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{mech.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Active: {mech.year}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acquisition Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Acquisition Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-semibold">Channel</th>
                  <th className="pb-3 text-left font-semibold">Target Segment</th>
                  <th className="pb-3 text-left font-semibold">Acquisition Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {competitor.acquisitionChannels.map((ch, i) => (
                  <tr key={i}>
                    <td className="py-3">{ch.channel}</td>
                    <td className="py-3">{ch.segment}</td>
                    <td className="py-3">
                      <Badge
                        variant={ch.cost === 'Foarte mic' ? 'default' : 'secondary'}
                        className={ch.cost === 'Foarte mic' ? 'bg-green-600' : ''}
                      >
                        {ch.cost}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-green-600">
              <TrendingUp className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {competitor.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-600">
              <TrendingDown className="h-5 w-5" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {competitor.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Financials */}
      {competitor.financials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Banknote className="h-5 w-5 text-primary" />
              Estimare Încasări 2025-2026
            </CardTitle>
            <CardDescription>
              {competitor.financials.data_source} • Confidence: {competitor.financials.confidence}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Pricing */}
              {competitor.financials.pricing && (
                <div>
                  <h4 className="font-semibold mb-2">Prețuri</h4>
                  {competitor.financials.pricing.monthly_plans ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-2 text-left">Abonament</th>
                            <th className="pb-2 text-right">La sediu</th>
                            <th className="pb-2 text-right">Online</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitor.financials.pricing.monthly_plans.map((plan, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2">{plan.name}</td>
                              <td className="py-2 text-right">{plan.in_person} RON</td>
                              <td className="py-2 text-right">{plan.online} RON</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : competitor.financials.pricing.membership_monthly ? (
                    <div className="grid gap-2 sm:grid-cols-3">
                      {Object.entries(competitor.financials.pricing.membership_monthly).map(([tier, price]) => (
                        <div key={tier} className="border rounded p-3">
                          <p className="text-sm text-muted-foreground capitalize">{tier}</p>
                          <p className="font-semibold">${price}/lună</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {competitor.financials.pricing.model || competitor.financials.pricing.note}
                    </p>
                  )}
                  {competitor.financials.pricing.vouchers_eligible && (
                    <p className="mt-2 text-sm">
                      <span className="text-green-600">✓ Vouchere:</span> {competitor.financials.pricing.vouchers_eligible.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Revenue Estimates */}
              <div className="grid gap-4 sm:grid-cols-2">
                {competitor.financials.revenue_2025 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> 2025
                    </h4>
                    {competitor.financials.revenue_2025.model ? (
                      <p className="text-sm text-muted-foreground mb-2">{competitor.financials.revenue_2025.model}</p>
                    ) : null}
                    <div className="space-y-2 text-sm">
                      {competitor.financials.revenue_2025.monthly_min_eur && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lunar:</span>
                          <span className="font-medium">
                            {competitor.financials.revenue_2025.monthly_min_eur?.toLocaleString()}-{competitor.financials.revenue_2025.monthly_max_eur?.toLocaleString()}€
                          </span>
                        </div>
                      )}
                      {competitor.financials.revenue_2025.annual_min_eur && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Anual:</span>
                          <span className="font-semibold text-primary">
                            {competitor.financials.revenue_2025.annual_min_eur?.toLocaleString()}-{competitor.financials.revenue_2025.annual_max_eur?.toLocaleString()}€
                          </span>
                        </div>
                      )}
                    </div>
                    {competitor.financials.revenue_2025.note && (
                      <p className="mt-2 text-xs text-muted-foreground">{competitor.financials.revenue_2025.note}</p>
                    )}
                  </div>
                )}
                {competitor.financials.revenue_2026 && (
                  <div className="border rounded-lg p-4 border-primary/50 bg-primary/5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> 2026
                      {competitor.financials.revenue_2026.growth_rate_percent && (
                        <Badge variant="outline" className="text-green-600">
                          +{competitor.financials.revenue_2026.growth_rate_percent}%
                        </Badge>
                      )}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {competitor.financials.revenue_2026.monthly_min_eur && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lunar:</span>
                          <span className="font-medium">
                            {competitor.financials.revenue_2026.monthly_min_eur?.toLocaleString()}-{competitor.financials.revenue_2026.monthly_max_eur?.toLocaleString()}€
                          </span>
                        </div>
                      )}
                      {competitor.financials.revenue_2026.annual_min_eur && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Anual:</span>
                          <span className="font-semibold text-primary">
                            {competitor.financials.revenue_2026.annual_min_eur?.toLocaleString()}-{competitor.financials.revenue_2026.annual_max_eur?.toLocaleString()}€
                          </span>
                        </div>
                      )}
                    </div>
                    {competitor.financials.revenue_2026.note && (
                      <p className="mt-2 text-xs text-muted-foreground">{competitor.financials.revenue_2026.note}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Net Income Estimates */}
              {(competitor.financials.net_income_2025 || competitor.financials.net_income_2026) && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" /> Venit Net Estimat
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {competitor.financials.net_income_2025 && (
                      <div className="border rounded-lg p-4 bg-green-50/50">
                        <h5 className="font-medium mb-2">2025</h5>
                        <div className="space-y-1 text-sm">
                          {competitor.financials.net_income_2025.min_eur !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net:</span>
                              <span className={`font-semibold ${competitor.financials.net_income_2025.min_eur < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {competitor.financials.net_income_2025.min_eur?.toLocaleString()}-{competitor.financials.net_income_2025.max_eur?.toLocaleString()}€
                              </span>
                            </div>
                          )}
                          {competitor.financials.net_income_2025.min_usd !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net:</span>
                              <span className="font-semibold text-green-600">
                                ${competitor.financials.net_income_2025.min_usd?.toLocaleString()}-{competitor.financials.net_income_2025.max_usd?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {competitor.financials.net_income_2025.margin_percent_max !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Marjă:</span>
                              <span className="font-medium">
                                {competitor.financials.net_income_2025.margin_percent_min}-{competitor.financials.net_income_2025.margin_percent_max}%
                              </span>
                            </div>
                          )}
                        </div>
                        {competitor.financials.net_income_2025.note && (
                          <p className="mt-2 text-xs text-muted-foreground">{competitor.financials.net_income_2025.note}</p>
                        )}
                      </div>
                    )}
                    {competitor.financials.net_income_2026 && (
                      <div className="border rounded-lg p-4 bg-green-100/50 border-green-300">
                        <h5 className="font-medium mb-2">2026</h5>
                        <div className="space-y-1 text-sm">
                          {competitor.financials.net_income_2026.min_eur !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net:</span>
                              <span className={`font-semibold ${competitor.financials.net_income_2026.min_eur < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {competitor.financials.net_income_2026.min_eur?.toLocaleString()}-{competitor.financials.net_income_2026.max_eur?.toLocaleString()}€
                              </span>
                            </div>
                          )}
                          {competitor.financials.net_income_2026.min_usd !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net:</span>
                              <span className="font-semibold text-green-600">
                                ${competitor.financials.net_income_2026.min_usd?.toLocaleString()}-{competitor.financials.net_income_2026.max_usd?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {competitor.financials.net_income_2026.margin_percent_max !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Marjă:</span>
                              <span className="font-medium">
                                {competitor.financials.net_income_2026.margin_percent_min}-{competitor.financials.net_income_2026.margin_percent_max}%
                              </span>
                            </div>
                          )}
                        </div>
                        {competitor.financials.net_income_2026.note && (
                          <p className="mt-2 text-xs text-muted-foreground">{competitor.financials.net_income_2026.note}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Revenue & Sponsors */}
              <div className="grid gap-4 sm:grid-cols-2">
                {competitor.financials.additional_revenue && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Surse adiționale</h4>
                    <ul className="text-sm space-y-1">
                      {competitor.financials.additional_revenue.map((r, i) => (
                        <li key={i} className="text-muted-foreground">• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {competitor.financials.sponsors && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Sponsori</h4>
                    <div className="flex flex-wrap gap-1">
                      {competitor.financials.sponsors.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function CompetitorsPage() {
  const [activeTab, setActiveTab] = useState(competitors[0].id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Competitor Analysis</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Detailed analysis of chess school competitors in București (2012-2026)
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Competitors Analyzed</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitors.length}</div>
            <p className="text-xs text-muted-foreground">chess schools in București</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitors.reduce((sum, c) => sum + c.locations.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">across all sectors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Combined Social Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                competitors.reduce((sum, c) => {
                  const fb = c.socialMedia.facebook?.followers || c.socialMedia.facebook?.likes || 0;
                  const ig = c.socialMedia.instagram?.followers || 0;
                  return sum + fb + ig;
                }, 0) / 1000
              ).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground">Facebook + Instagram followers</p>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          {competitors.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="text-xs sm:text-sm">
              {c.name.split(' (')[0]}
            </TabsTrigger>
          ))}
        </TabsList>
        {competitors.map((c) => (
          <TabsContent key={c.id} value={c.id} className="mt-6">
            <CompetitorCard competitor={c} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
