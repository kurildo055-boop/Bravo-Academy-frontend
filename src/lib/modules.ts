/**
 * Bravo Academy - Core Defense Training Modules (Options 3 to 11)
 * Standardized across Admin Course Builder and Candidate Dashboard
 */

export interface DefenseModule {
  id: string;
  num: number;
  title: string;
  label: string;
  shortName: string;
  sidebarLabel: string;
  href: string;
  description: string;
  targetTest: string;
}

export const DEFENSE_MODULES: DefenseModule[] = [
  {
    id: 'iq_practice',
    num: 3,
    title: 'IQ Practice (1000+ Q)',
    label: '3. IQ Practice (1000+ Q)',
    shortName: 'IQ Practice',
    sidebarLabel: '3. IQ Practice (1000+ Q)',
    href: '/exam/iq',
    description: '1000+ Verbal, Non-Verbal, Mathematical & Spatial IQ testing engine with timed countdown.',
    targetTest: 'Screening Day 1 IQ Test'
  },
  {
    id: 'ppdt_practice',
    num: 4,
    title: 'PPDT Practice',
    label: '4. PPDT Practice',
    shortName: 'PPDT Practice',
    sidebarLabel: '4. PPDT Practice',
    href: '/practice/ppdt',
    description: 'Picture Perception & Discussion Test drills with 30s hazy image flash & 4min story timer.',
    targetTest: 'Screening Day 1 PPDT'
  },
  {
    id: 'psychology_battery',
    num: 5,
    title: 'Psychology Battery',
    label: '5. Psychology Battery',
    shortName: 'Psychology Battery',
    sidebarLabel: '5. Psychology Battery',
    href: '/practice/psychology',
    description: 'TAT, WAT (15-sec words), SCT (sentence completion), SRT and Self-Description test battery.',
    targetTest: 'ISSB Day 2 Psychology'
  },
  {
    id: 'gto_preparation',
    num: 6,
    title: 'GTO Preparation',
    label: '6. GTO Preparation',
    shortName: 'GTO Preparation',
    sidebarLabel: '6. GTO Preparation',
    href: '/practice/gto',
    description: 'Progressive Group Task (PGT), Half Group Task (HGT), and Command Task strategy blueprints.',
    targetTest: 'ISSB Day 3 GTO Tasks'
  },
  {
    id: 'planning_mpe',
    num: 7,
    title: 'Planning Exercise (MPE)',
    label: '7. Planning Exercise (MPE)',
    shortName: 'Military Planning (MPE)',
    sidebarLabel: '7. Planning Exercise (MPE)',
    href: '/practice/mpe',
    description: 'Military Planning Exercise tactics, resource allocation, and map scenario briefs.',
    targetTest: 'ISSB Day 3 Planning'
  },
  {
    id: 'interview_practice',
    num: 8,
    title: 'Interview Practice',
    label: '8. Interview Practice',
    shortName: 'Interview Practice',
    sidebarLabel: '8. Interview Practice',
    href: '/practice/interview',
    description: 'Deputy President & President personal interview drills, current affairs & tactical questions.',
    targetTest: 'ISSB Day 3/4 Board Interview'
  },
  {
    id: 'physical_prep',
    num: 9,
    title: 'Physical Preparation',
    label: '9. Physical Preparation',
    shortName: 'Physical Preparation',
    sidebarLabel: '9. Physical Preparation',
    href: '/practice/physical',
    description: 'Obstacle run tactical guides, stamina drills, pull-ups, push-ups and rope climbing regimens.',
    targetTest: 'ISSB Physical Obstacle Course'
  },
  {
    id: 'mock_exam',
    num: 10,
    title: 'Mock Examination',
    label: '10. Mock Examination',
    shortName: 'Mock Examination',
    sidebarLabel: '10. Mock Examination',
    href: '/exam/mock',
    description: 'Strict 100-mark timed military aptitude examination simulating real selection board pressure.',
    targetTest: 'Full ISSB Screening Simulation'
  },
  {
    id: 'full_simulation',
    num: 11,
    title: 'Full 4-Day Simulation',
    label: '11. Full 4-Day Simulation',
    shortName: 'Full 4-Day Simulation',
    sidebarLabel: '11. Full 4-Day Simulation',
    href: '/simulation',
    description: 'Complete end-to-end 4-Day ISSB portal: Screening, Psychology, GTO ground tasks & Board conference.',
    targetTest: 'Complete 4-Day ISSB Sequence'
  }
];

/**
 * Checks if a specific module ID is unlocked based on candidate's active enrollments
 */
export function checkModuleAccess(moduleId: string, enrollments: any[] = []): boolean {
  if (!Array.isArray(enrollments) || enrollments.length === 0) return false;

  for (const en of enrollments) {
    if (en.status !== 'ACTIVE') continue;
    if (en.expiresAt && new Date(en.expiresAt) < new Date()) continue;

    const course = en.course;
    if (!course) continue;

    try {
      const features: string[] = typeof course.includedFeatures === 'string'
        ? JSON.parse(course.includedFeatures)
        : (course.includedFeatures || []);

      if (features.includes(moduleId) || features.includes('ALL') || features.includes('all')) {
        return true;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  return false;
}

/**
 * Returns all unlocked module IDs for candidate
 */
export function getUnlockedModuleIds(enrollments: any[] = []): Set<string> {
  const set = new Set<string>();
  if (!Array.isArray(enrollments)) return set;

  for (const en of enrollments) {
    if (en.status !== 'ACTIVE') continue;
    if (en.expiresAt && new Date(en.expiresAt) < new Date()) continue;

    const course = en.course;
    if (!course) continue;

    try {
      const features: string[] = typeof course.includedFeatures === 'string'
        ? JSON.parse(course.includedFeatures)
        : (course.includedFeatures || []);

      if (features.includes('ALL') || features.includes('all')) {
        DEFENSE_MODULES.forEach(m => set.add(m.id));
      } else {
        features.forEach(f => set.add(f));
      }
    } catch (e) {
      // Ignore
    }
  }

  return set;
}
