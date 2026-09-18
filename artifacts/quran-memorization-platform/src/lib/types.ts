export type Role = 'manager' | 'supervisor' | 'student';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Student extends User {
  role: 'student';
  supervisorId: string;
  level: string;
  enrollmentDate: string;
}

export interface Supervisor extends User {
  role: 'supervisor';
  studentsCount: number;
}

export interface PlanRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'memorization' | 'revision';
  surah: string;
  ayahFrom: number;
  ayahTo: number;
  pageFrom: number;
  pageTo: number;
  status: 'pending' | 'completed' | 'delayed';
  evaluation?: Evaluation;
}

export interface Evaluation {
  memorizationScore: number;
  fluencyScore: number;
  correctionScore: number;
  totalScore: number;
  passed: boolean;
  notes?: string;
  attempts: number;
  date: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  plans: PlanRecord[];
  activeRole: Role;
}
