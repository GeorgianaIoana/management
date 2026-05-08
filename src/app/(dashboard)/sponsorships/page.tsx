'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Handshake, Crown, Star, Award, Mail, ExternalLink } from 'lucide-react';

const sponsors = [
  {
    name: 'Sponsor Principal',
    tier: 'gold',
    logo: null,
    website: 'https://example.com',
    description: 'Partener principal al clubului din 2022',
  },
  {
    name: 'Sponsor Argint',
    tier: 'silver',
    logo: null,
    website: 'https://example.com',
    description: 'Susține programul de juniori',
  },
  {
    name: 'Sponsor Bronze',
    tier: 'bronze',
    logo: null,
    website: 'https://example.com',
    description: 'Partener pentru echipamente',
  },
];

const sponsorshipTiers = [
  {
    name: 'Gold',
    icon: Crown,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    price: '5.000+ RON/an',
    benefits: [
      'Logo pe toate materialele promoționale',
      'Banner permanent în sălile de concurs',
      'Menționare la toate evenimentele',
      'Invitații VIP la turnee',
      '10 locuri gratuite la cursuri',
    ],
  },
  {
    name: 'Silver',
    icon: Star,
    color: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
    price: '2.500+ RON/an',
    benefits: [
      'Logo pe website și social media',
      'Banner la evenimentele majore',
      'Menționare la turnee principale',
      '5 locuri gratuite la cursuri',
    ],
  },
  {
    name: 'Bronze',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-600/10',
    price: '1.000+ RON/an',
    benefits: [
      'Logo pe website',
      'Menționare pe social media',
      '2 locuri gratuite la cursuri',
    ],
  },
];

const tierColors: Record<string, string> = {
  gold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  silver: 'bg-slate-400/10 text-slate-500 border-slate-400/20',
  bronze: 'bg-orange-600/10 text-orange-600 border-orange-600/20',
};

export default function SponsorshipsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sponsorizări</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Partenerii și susținătorii clubului The Square
        </p>
      </div>

      {/* Current Sponsors */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Handshake className="h-5 w-5 text-primary" />
          Sponsorii noștri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.name}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Logo Placeholder */}
                  <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold">{sponsor.name}</h3>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${tierColors[sponsor.tier]}`}
                  >
                    {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3">
                    {sponsor.description}
                  </p>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Vizitează site-ul
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sponsorship Tiers */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pachete de sponsorizare</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {sponsorshipTiers.map((tier) => (
            <Card key={tier.name} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${tier.bgColor.replace('/10', '')}`} />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.bgColor}`}>
                    <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>{tier.price}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${tier.bgColor.replace('/10', '')} shrink-0`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-5 w-5 text-primary" />
            Devino sponsor
          </CardTitle>
          <CardDescription>
            Susține dezvoltarea șahului și câștigă vizibilitate pentru brandul tău
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clubul The Square promovează șahul în rândul copiilor și adulților din
            Dragașani și împrejurimi. Prin sponsorizare, contribui la educația și
            dezvoltarea tinerelor talente, beneficiind totodată de expunere în
            comunitatea locală.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <a href="mailto:sponsorizari@thesquare.ro">
                <Mail className="mr-2 h-4 w-4" />
                Contactează-ne
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+40750123456">
                Sună-ne: +40 750 123 456
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
