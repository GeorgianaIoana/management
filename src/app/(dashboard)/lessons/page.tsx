import { LessonsGrid } from '@/components/lessons';

export const metadata = {
  title: 'Lessons - THE SQUARE',
};

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lesson Library</h1>
        <p className="text-muted-foreground">
          Manage training materials and resources
        </p>
      </div>
      <LessonsGrid />
    </div>
  );
}
