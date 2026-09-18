import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { BookOpen, RefreshCw, LayoutDashboard, UserCircle, Settings } from 'lucide-react';
import { Role } from '@/lib/types';

export function Shell({ children }: { children: React.ReactNode }) {
  const { activeRole, setActiveRole, resetData } = useStore();

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="bg-primary text-primary-foreground shadow-md relative z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground shadow-sm">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-wide hidden sm:block">
              أهل القرآن
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-primary-foreground/10 rounded-lg p-1">
              <button 
                onClick={() => handleRoleChange('manager')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeRole === 'manager' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                المدير
              </button>
              <button 
                onClick={() => handleRoleChange('supervisor')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeRole === 'supervisor' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                المشرف
              </button>
              <button 
                onClick={() => handleRoleChange('student')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeRole === 'student' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-primary-foreground/80 hover:text-white'}`}
              >
                الطالب
              </button>
            </div>
            
            <div className="w-px h-6 bg-primary-foreground/20 hidden sm:block"></div>
            
            <Button variant="ghost" size="sm" onClick={resetData} className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex" title="إعادة تعيين البيانات التجريبية">
              <RefreshCw size={16} className="ml-2" />
              تحديث البيانات
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-primary/5 rounded-b-[3rem] -z-10"></div>
        {children}
      </main>
    </div>
  );
}