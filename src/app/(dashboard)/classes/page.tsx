import { ClassesTable, WeeklyCalendar } from '@/components/classes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Classes - THE SQUARE',
};

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Classes</h1>
        <p className="text-muted-foreground">
          Manage class schedules and enrollments
        </p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <ClassesTable />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <WeeklyCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
