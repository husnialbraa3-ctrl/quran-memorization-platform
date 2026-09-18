import { useStore } from '../lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Book, Award, Clock, CalendarDays, TrendingUp, ChevronLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from 'react-day-picker';

export default function StudentDashboard() {
  const { currentUser, plans } = useStore();
  const myPlans = plans.filter(p => p.studentId === currentUser?.id);
  
  const completedPlans = myPlans.filter(p => p.status === 'completed');
  const todayPlan = myPlans.find(p => p.date === new Date().toISOString().split('T')[0]);

  // General evaluation calculation for the student
  // 35% Mem, 25% Rev, 15% Fluency, 10% Correction, 15% Commitment
  // Mocking average scores from completed plans
  const totalCompleted = completedPlans.length;
  let avgMem = 0, avgFluency = 0, avgCorrection = 0;
  
  if (totalCompleted > 0) {
    avgMem = completedPlans.reduce((acc, p) => acc + (p.evaluation?.memorizationScore || 0), 0) / totalCompleted;
    // Normalize fluency from max 25 to 100 for display, etc. Let's keep raw maxes.
    // Mem max 60, Fluency max 25, Corr max 15.
    avgFluency = completedPlans.reduce((acc, p) => acc + (p.evaluation?.fluencyScore || 0), 0) / totalCompleted;
    avgCorrection = completedPlans.reduce((acc, p) => acc + (p.evaluation?.correctionScore || 0), 0) / totalCompleted;
  } else {
    avgMem = 55; avgFluency = 20; avgCorrection = 12; // Fallback mock
  }

  // Calculate out of 100 percentages for Donut
  const donutData = [
    { name: 'إتقان الحفظ', value: (avgMem/60)*35, color: 'hsl(var(--chart-1))' },
    { name: 'قوة المراجعة', value: 20, color: 'hsl(var(--chart-2))' }, // Mock 20/25
    { name: 'الاسترسال', value: (avgFluency/25)*15, color: 'hsl(var(--chart-3))' },
    { name: 'الاستدراك', value: (avgCorrection/15)*10, color: 'hsl(var(--chart-4))' },
    { name: 'الالتزام', value: 13, color: 'hsl(var(--chart-5))' }, // Mock 13/15
  ];

  // Timeline mock data
  const timelineData = [
    { name: 'السبت', حفظ: 95, مراجعة: 85 },
    { name: 'الأحد', حفظ: 88, مراجعة: 90 },
    { name: 'الإثنين', حفظ: 92, مراجعة: 88 },
    { name: 'الثلاثاء', حفظ: 100, مراجعة: 95 },
    { name: 'الأربعاء', حفظ: 85, مراجعة: 80 },
    { name: 'الخميس', حفظ: 90, مراجعة: 85 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-primary/10 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        
        <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center text-primary relative z-10">
          <Book size={40} />
        </div>
        <div className="flex-1 text-center md:text-right relative z-10">
          <h2 className="text-3xl font-serif font-bold text-primary">{currentUser?.name}</h2>
          <p className="text-muted-foreground mt-1 text-lg">{(currentUser as any)?.level || 'مرحلة متقدمة'}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <Badge variant="outline" className="bg-white/50 py-1.5 px-3">
              <CalendarDays className="ml-2 w-4 h-4 text-primary" />
              الخطة: 5 أيام أسبوعياً
            </Badge>
            <Badge variant="outline" className="bg-white/50 py-1.5 px-3">
              <Award className="ml-2 w-4 h-4 text-secondary" />
              التقييم العام: ممتاز
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Plan */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                ورد اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayPlan ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">سورة {todayPlan.surah}</span>
                      <Badge variant={todayPlan.type === 'memorization' ? 'default' : 'secondary'}>
                        {todayPlan.type === 'memorization' ? 'حفظ' : 'مراجعة'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      من آية {todayPlan.ayahFrom} إلى {todayPlan.ayahTo} <br/>
                      الصحفات: {todayPlan.pageFrom} - {todayPlan.pageTo}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>حالة الورد</span>
                        <span className="font-bold">{todayPlan.status === 'completed' ? 'تم التسميع' : 'في الانتظار'}</span>
                      </div>
                      <Progress value={todayPlan.status === 'completed' ? 100 : 0} className="h-2" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  لا يوجد ورد مسند لهذا اليوم.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التقدم التراكمي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>الأجزاء المنجزة</span>
                  <span>4 / 30</span>
                </div>
                <Progress value={13} className="h-2.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>سورة البقرة</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2.5 bg-secondary/20" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>صفحات المراجعة (هذا الشهر)</span>
                  <span>45 / 60</span>
                </div>
                <Progress value={75} className="h-2.5 bg-green-100 dark:bg-green-900/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">مكونات التقييم العام</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold block leading-none">93%</span>
                    <span className="text-xs text-muted-foreground">الإجمالي</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تطور العلامات (هذا الأسبوع)</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="حفظ" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="مراجعة" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>سجل الإنجاز الأخير</span>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  عرض الكل <ChevronLeft size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedPlans.slice(-3).reverse().map(plan => (
                  <div key={plan.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plan.type === 'memorization' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-foreground'}`}>
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">سورة {plan.surah}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge variant="outline" className="bg-background border-primary/20 text-primary font-bold">
                        {plan.evaluation?.totalScore} %
                      </Badge>
                    </div>
                  </div>
                ))}
                {completedPlans.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">لم يتم تسجيل أي إنجاز بعد.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}