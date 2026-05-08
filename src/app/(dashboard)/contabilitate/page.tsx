'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function ContabilitatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contabilitate Asociație</h1>
        <p className="text-muted-foreground">
          Gestionează finanțele și urmărește veniturile și cheltuielile
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Venituri lunare</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0 RON</div>
            <p className="text-xs text-muted-foreground">
              luna curentă
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cheltuieli lunare</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0 RON</div>
            <p className="text-xs text-muted-foreground">
              luna curentă
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit net</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 RON</div>
            <p className="text-xs text-muted-foreground">
              luna curentă
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sold curent</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 RON</div>
            <p className="text-xs text-muted-foreground">
              disponibil
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Tranzacții recente</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nu există tranzacții înregistrate.
        </CardContent>
      </Card>
    </div>
  );
}
