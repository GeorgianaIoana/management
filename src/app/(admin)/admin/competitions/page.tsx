import { CompetitionsTable, CompetitionStats } from '@/components/competitions';

export const metadata = {
  title: 'Competiții - Admin',
};

export default function AdminCompetitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Competiții</h1>
        <p className="text-zinc-400">
          Gestionează competițiile și participanții
        </p>
      </div>
      <CompetitionStats />
      <CompetitionsTable basePath="/admin/competitions" />
    </div>
  );
}
