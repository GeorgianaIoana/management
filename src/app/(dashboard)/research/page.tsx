'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FlaskConical,
  Brain,
  BookOpen,
  GraduationCap,
  LineChart,
  Users,
  FileText,
  ExternalLink,
} from 'lucide-react';

const researchAreas = [
  {
    title: 'Dezvoltare cognitivă',
    icon: Brain,
    description: 'Studiul impactului șahului asupra dezvoltării cognitive la copii',
    status: 'active',
  },
  {
    title: 'Metodologii de predare',
    icon: GraduationCap,
    description: 'Optimizarea metodelor de învățare pentru diferite grupe de vârstă',
    status: 'active',
  },
  {
    title: 'Analiză performanță',
    icon: LineChart,
    description: 'Tracking-ul progresului și identificarea pattern-urilor de învățare',
    status: 'active',
  },
  {
    title: 'Integrare școlară',
    icon: BookOpen,
    description: 'Implementarea șahului în curricula școlară',
    status: 'planned',
  },
];

const publications = [
  {
    title: 'Impactul șahului asupra performanței școlare',
    type: 'Studiu',
    year: '2024',
    authors: 'Echipa The Square',
  },
  {
    title: 'Ghid metodologic pentru antrenori începători',
    type: 'Ghid',
    year: '2023',
    authors: 'Echipa The Square',
  },
  {
    title: 'Șahul în educație - experiența din Dragașani',
    type: 'Articol',
    year: '2023',
    authors: 'Echipa The Square',
  },
];

const partners = [
  { name: 'Universitatea din Craiova', type: 'Universitate' },
  { name: 'Inspectoratul Școlar Vâlcea', type: 'Instituție' },
  { name: 'Federația Română de Șah', type: 'Federație' },
];

export default function ResearchPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Research</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Cercetare și dezvoltare în domeniul educației prin șah
        </p>
      </div>

      {/* Research Areas */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Arii de cercetare
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {researchAreas.map((area) => (
            <Card key={area.title}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <area.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{area.title}</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      area.status === 'active'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }
                  >
                    {area.status === 'active' ? 'Activ' : 'Planificat'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Publicații și resurse
          </CardTitle>
          <CardDescription>
            Materiale dezvoltate de echipa noastră
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{pub.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pub.authors} • {pub.year}
                  </p>
                </div>
                <Badge variant="secondary">{pub.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Parteneri de cercetare
          </CardTitle>
          <CardDescription>
            Colaborări academice și instituționale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center rounded-xl border p-4 text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm">{partner.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{partner.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colaborează cu noi</CardTitle>
          <CardDescription>
            Ești interesat de cercetarea în domeniul educației prin șah?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Suntem deschiși colaborărilor cu universități, școli și alte organizații
            interesate de impactul șahului în educație. Contactează-ne pentru a
            discuta posibile parteneriate sau proiecte comune.
          </p>
          <Button asChild>
            <a href="mailto:research@thesquare.ro">
              Contactează echipa de cercetare
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
