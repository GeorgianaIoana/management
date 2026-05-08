import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Gestionează competițiile și setările avansate
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/competitions">
          <Card className="border-zinc-800 bg-zinc-900 transition-colors hover:border-amber-500/50 hover:bg-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Competiții
              </CardTitle>
              <Trophy className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">Gestionează</p>
              <p className="mt-1 text-xs text-zinc-500">
                Adaugă și editează competiții
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Participanți
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">În curând</p>
            <p className="mt-1 text-xs text-zinc-500">
              Statistici participanți
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Calendar
            </CardTitle>
            <Calendar className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">În curând</p>
            <p className="mt-1 text-xs text-zinc-500">
              Calendar competiții
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
