import { User, Student, Supervisor, PlanRecord, AppState } from './types';

export const mockUsers: User[] = [
  { id: 'm1', name: 'أحمد الإداري', role: 'manager' },
  { id: 's1', name: 'الشيخ محمد', role: 'supervisor', studentsCount: 5 } as Supervisor,
  { id: 's2', name: 'الشيخ عبدالله', role: 'supervisor', studentsCount: 3 } as Supervisor,
  { id: 'st1', name: 'عمر الطالب', role: 'student', supervisorId: 's1', level: 'الجزء 30', enrollmentDate: '2023-01-15' } as Student,
  { id: 'st2', name: 'علي حسن', role: 'student', supervisorId: 's1', level: 'الجزء 29', enrollmentDate: '2023-03-10' } as Student,
  { id: 'st3', name: 'يوسف جمال', role: 'student', supervisorId: 's2', level: 'الجزء 1', enrollmentDate: '2023-05-22' } as Student,
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockPlans: PlanRecord[] = [
  {
    id: 'p1',
    studentId: 'st1',
    date: today,
    type: 'memorization',
    surah: 'النبأ',
    ayahFrom: 1,
    ayahTo: 20,
    pageFrom: 582,
    pageTo: 582,
    status: 'pending'
  },
  {
    id: 'p2',
    studentId: 'st1',
    date: yesterday,
    type: 'revision',
    surah: 'المرسلات',
    ayahFrom: 1,
    ayahTo: 50,
    pageFrom: 580,
    pageTo: 581,
    status: 'completed',
    evaluation: {
      memorizationScore: 55,
      fluencyScore: 20,
      correctionScore: 10,
      totalScore: 85,
      passed: true,
      attempts: 1,
      date: yesterday
    }
  },
  {
    id: 'p3',
    studentId: 'st2',
    date: today,
    type: 'memorization',
    surah: 'الملك',
    ayahFrom: 1,
    ayahTo: 12,
    pageFrom: 562,
    pageTo: 562,
    status: 'delayed'
  }
];

export const initialData: AppState = {
  currentUser: mockUsers[0],
  users: mockUsers,
  plans: mockPlans,
  activeRole: 'manager'
};