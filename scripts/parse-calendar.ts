/**
 * Script pentru a parsa calendarul ICS si a extrage elevii cu prezentele lor
 */

import * as fs from 'fs';
import * as path from 'path';

interface CalendarEvent {
  date: string;
  name: string;
  attended: boolean | null;
  rawSummary: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
}

type MemberType = 'child' | 'adult';

interface StudentData {
  name: string;
  firstName: string;
  lastName: string;
  memberType: MemberType;
  totalSessions: number;
  present: number;
  absent: number;
  dayDistribution: Record<number, number>; // dayOfWeek -> count
}

function parseICSDate(dateStr: string): { formatted: string; dayOfWeek: number } {
  const match = dateStr.match(/(\d{4})(\d{2})(\d{2})/);
  if (match) {
    const formatted = `${match[1]}-${match[2]}-${match[3]}`;
    const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    return { formatted, dayOfWeek: date.getDay() };
  }
  return { formatted: dateStr, dayOfWeek: -1 };
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  // Handle special cases
  const specialCases: Record<string, { firstName: string; lastName: string }> = {
    'Dl Mugurel Marin': { firstName: 'Mugurel', lastName: 'Marin' },
    'Ileanaes': { firstName: 'Ileana', lastName: '' }, // Fix parsing error
    'Bogdan T.': { firstName: 'Bogdan', lastName: 'T.' },
  };

  if (specialCases[fullName]) {
    return specialCases[fullName];
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function determineMemberType(dayDistribution: Record<number, number>, _name: string): MemberType {
  // Special case: "Andrei" without last name appears both on Friday (child) and Thursday (adult)
  // Based on the plan, we need to handle this - the "Andrei" on Friday is a child
  // The "Andrei" on Thursday is a different person (adult) - but they're merged in calendar
  // For now, check predominant day

  // Friday = 5 (copii/children)
  // Thursday = 4 (adulți/adults)
  // Other days (individual lessons) = adults

  const fridayCount = dayDistribution[5] || 0;
  const thursdayCount = dayDistribution[4] || 0;
  const otherDaysCount = Object.entries(dayDistribution)
    .filter(([day]) => day !== '4' && day !== '5')
    .reduce((sum, [, count]) => sum + count, 0);

  // If majority of sessions are on Friday, it's a child
  // Children classes are on Friday
  if (fridayCount > thursdayCount + otherDaysCount) {
    return 'child';
  }

  // Adults have sessions on Thursday or individual lessons on other days
  return 'adult';
}

function extractStudentInfo(summary: string): { name: string; attended: boolean | null } | null {
  const excludePatterns = [
    /social chess/i,
    /event /i,
    /concurs/i,
    /@the square/i,
  ];
  
  for (const pattern of excludePatterns) {
    if (pattern.test(summary)) {
      return null;
    }
  }

  let attended: boolean | null = null;
  let name = summary;

  if (/^prezent\s*-\s*/i.test(summary)) {
    attended = true;
    name = summary.replace(/^prezent\s*-\s*/i, '');
  } else if (/^absent\s*-\s*/i.test(summary)) {
    attended = false;
    name = summary.replace(/^absent\s*-\s*/i, '');
  }

  if (/,\s*prezent$/i.test(name)) {
    attended = true;
    name = name.replace(/,\s*prezent$/i, '');
  } else if (/,\s*absent$/i.test(name)) {
    attended = false;
    name = name.replace(/,\s*absent$/i, '');
  }

  // Unescape ICS characters first
  name = name.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').replace(/\\$/g, '');

  // Remove lesson type suffixes
  name = name
    .replace(/\s*-\s*lectie de sah/gi, '')
    .replace(/\s*-\s*chess class/gi, '')
    .replace(/\s*-\s*chess time/gi, '')
    .replace(/\s*-\s*chess classes/gi, '')
    .trim();

  if (!name || name.length < 2) {
    return null;
  }

  return { name, attended };
}

function parseICS(content: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = content.split(/\r?\n/);
  
  let currentEvent: Partial<CalendarEvent> = {};
  let inEvent = false;
  let currentKey = '';
  let currentValue = '';

  for (const line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      currentValue += line.substring(1);
      continue;
    }

    if (currentKey && inEvent) {
      if (currentKey === 'DTSTART') {
        const dateMatch = currentValue.match(/(\d{8})/);
        if (dateMatch) {
          const { formatted, dayOfWeek } = parseICSDate(dateMatch[1]);
          currentEvent.date = formatted;
          currentEvent.dayOfWeek = dayOfWeek;
        }
      } else if (currentKey === 'SUMMARY') {
        currentEvent.rawSummary = currentValue;
        const info = extractStudentInfo(currentValue);
        if (info) {
          currentEvent.name = info.name;
          currentEvent.attended = info.attended;
        }
      }
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      currentKey = line.substring(0, colonIndex).split(';')[0];
      currentValue = line.substring(colonIndex + 1);
    }

    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT') {
      if (currentKey === 'SUMMARY' && currentValue) {
        currentEvent.rawSummary = currentValue;
        const info = extractStudentInfo(currentValue);
        if (info) {
          currentEvent.name = info.name;
          currentEvent.attended = info.attended;
        }
      }

      if (currentEvent.date && currentEvent.name) {
        events.push(currentEvent as CalendarEvent);
      }
      inEvent = false;
      currentEvent = {};
      currentKey = '';
      currentValue = '';
    }
  }

  return events;
}

const DAY_NAMES = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata'];

function main() {
  const icsPath = process.argv[2] || path.join(process.cwd(), 'data', 'calendar-backup.ics');

  if (!fs.existsSync(icsPath)) {
    console.error('File not found:', icsPath);
    process.exit(1);
  }

  const content = fs.readFileSync(icsPath, 'utf-8');
  const events = parseICS(content);

  const students = new Map<string, StudentData>();

  for (const event of events) {
    const current = students.get(event.name) || {
      name: event.name,
      firstName: '',
      lastName: '',
      memberType: 'adult' as MemberType,
      totalSessions: 0,
      present: 0,
      absent: 0,
      dayDistribution: {},
    };

    current.totalSessions++;
    if (event.attended === true) current.present++;
    if (event.attended === false) current.absent++;

    // Track day distribution
    if (event.dayOfWeek >= 0) {
      current.dayDistribution[event.dayOfWeek] = (current.dayDistribution[event.dayOfWeek] || 0) + 1;
    }

    students.set(event.name, current);
  }

  // Now determine member type and parse names
  for (const [name, data] of students) {
    const { firstName, lastName } = parseName(name);
    data.firstName = firstName;
    data.lastName = lastName;
    data.memberType = determineMemberType(data.dayDistribution, name);
  }

  console.log('\n=== ELEVI EXTRASI DIN CALENDAR ===\n');

  const sortedStudents = Array.from(students.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Separate by type
  const children = sortedStudents.filter(s => s.memberType === 'child');
  const adults = sortedStudents.filter(s => s.memberType === 'adult');

  console.log('--- COPII (Vineri) ---');
  for (const student of children) {
    const days = Object.entries(student.dayDistribution)
      .map(([day, count]) => `${DAY_NAMES[parseInt(day)]}:${count}`)
      .join(', ');
    console.log(`  ${student.firstName} ${student.lastName || '-'}: ${student.totalSessions} sesiuni (${days})`);
  }

  console.log('\n--- ADULTI (Joi + Individual) ---');
  for (const student of adults) {
    const days = Object.entries(student.dayDistribution)
      .map(([day, count]) => `${DAY_NAMES[parseInt(day)]}:${count}`)
      .join(', ');
    console.log(`  ${student.firstName} ${student.lastName || '-'}: ${student.totalSessions} sesiuni (${days})`);
  }

  console.log('\n=== TOTAL: ' + students.size + ' elevi unici (' + children.length + ' copii, ' + adults.length + ' adulti) ===\n');

  const output = {
    students: sortedStudents.map((student) => ({
      name: student.name,
      firstName: student.firstName,
      lastName: student.lastName,
      memberType: student.memberType,
      totalSessions: student.totalSessions,
      present: student.present,
      absent: student.absent,
      dayDistribution: student.dayDistribution,
    })),
    events: events.sort((a, b) => b.date.localeCompare(a.date)),
  };

  const outputPath = path.join(process.cwd(), 'data', 'calendar-import.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log('Date exportate in: ' + outputPath);
}

main();
