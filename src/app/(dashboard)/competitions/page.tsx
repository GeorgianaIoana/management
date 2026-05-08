import { CompetitionsTable, CompetitionStats } from '@/components/competitions';

export const metadata = {
  title: 'Competiții - THE SQUARE',
};

export default function CompetitionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competiții</h1>
        <p className="text-muted-foreground">
          Gestionează competițiile și participanții
        </p>
      </div>
      <CompetitionStats />
      <CompetitionsTable />
    </div>
  );
}
