import { useState } from 'react';
import { useStore } from '../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Users, UserCheck, AlertTriangle, Target, CalendarPlus, Copy, TrendingUp, Settings } from 'lucide-react';

export default function ManagerDashboard() {
  const { users, plans, addPlan } = useStore();
  const students = users.filter(u => u.role === 'student');
  const supervisors = users.filter(u => u.role === 'supervisor');
  const delayedPlans = plans.filter(p => p.status === 'delayed');
  const completedPlans = plans.filter(p => p.status === 'completed');

  const [newPlan, setNewPlan] = useState({
    studentId: students[0]?.id || '',
    type: 'memorization',
    surah: 'البقرة',
    ayahFrom: 1,
    ayahTo: 10,
    pageFrom: 1,
    pageTo: 2
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    addPlan({
      studentId: newPlan.studentId,
      date: new Date().toISOString().split('T')[0],
      type: newPlan.type as 'memorization' | 'revision',
      surah: newPlan.surah,
      ayahFrom: Number(newPlan.ayahFrom),
      ayahTo: Number(newPlan.ayahTo),
      pageFrom: Number(newPlan.pageFrom),
      pageTo: Number(newPlan.pageTo),
      status: 'pending'
    });
    alert('تم إضافة الخطة بنجاح');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">لوحة الإدارة</h2>
          <p className="text-muted-foreground mt-1">نظرة عامة على سير حلقات التحفيظ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings size={16} />
            إعدادات التقييم
          </Button>
          <Button className="gap-2">
            <TrendingUp size={16} />
            التقارير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">الطلاب</p>
              <h3 className="text-2xl font-bold">{students.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg text-secondary-foreground">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">المشرفين</p>
              <h3 className="text-2xl font-bold">{supervisors.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/50 rounded-lg">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">الخطط المنجزة</p>
              <h3 className="text-2xl font-bold">{completedPlans.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">الخطط المتأخرة</p>
              <h3 className="text-2xl font-bold text-destructive">{delayedPlans.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="planning">إعداد الخطط</TabsTrigger>
          <TabsTrigger value="students">إدارة الطلاب والمشرفين</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planning" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarPlus className="text-primary" size={20} />
                  <CardTitle>بناء خطة يومية</CardTitle>
                </div>
                <CardDescription>إسناد ورد حفظ أو مراجعة لطالب</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>الطالب</Label>
                      <Select 
                        value={newPlan.studentId} 
                        onChange={(e) => setNewPlan({...newPlan, studentId: e.target.value})}
                      >
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>نوع الورد</Label>
                      <Select 
                        value={newPlan.type} 
                        onChange={(e) => setNewPlan({...newPlan, type: e.target.value})}
                      >
                        <option value="memorization">حفظ جديد</option>
                        <option value="revision">مراجعة</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>السورة</Label>
                    <Input 
                      value={newPlan.surah} 
                      onChange={(e) => setNewPlan({...newPlan, surah: e.target.value})} 
                      placeholder="مثال: البقرة" 
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>من آية</Label>
                      <Input type="number" min="1" value={newPlan.ayahFrom} onChange={(e) => setNewPlan({...newPlan, ayahFrom: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>إلى آية</Label>
                      <Input type="number" min="1" value={newPlan.ayahTo} onChange={(e) => setNewPlan({...newPlan, ayahTo: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>من صفحة</Label>
                      <Input type="number" min="1" value={newPlan.pageFrom} onChange={(e) => setNewPlan({...newPlan, pageFrom: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>إلى صفحة</Label>
                      <Input type="number" min="1" value={newPlan.pageTo} onChange={(e) => setNewPlan({...newPlan, pageTo: e.target.value})} />
                    </div>
                  </div>

                  {newPlan.type === 'revision' && (
                    <div className="bg-accent/30 p-4 rounded-lg border border-accent">
                      <p className="text-sm font-medium mb-2">معيار مساحة التقييم</p>
                      <p className="text-xs text-muted-foreground">يجب فصل مقدار المراجعة المطلوب عن عدد الصفحات التي سيتم تقييمها فعلياً لتخفيف الضغط على المشرف.</p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>مقدار المراجعة الإجمالي (صفحات)</Label>
                          <Input type="number" defaultValue="10" />
                        </div>
                        <div className="space-y-2">
                          <Label>مساحة التقييم (صفحات للمراجعة بالمجلس)</Label>
                          <Input type="number" defaultValue="2" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <Button type="submit">إسناد الخطة</Button>
                    <Button type="button" variant="outline" className="gap-2">
                      <Copy size={16} />
                      نسخ الخطة لأسبوع
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الخطط الحديثة</CardTitle>
                <CardDescription>آخر الأوراد المسندة للطلاب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plans.slice(-4).reverse().map(plan => {
                  const student = students.find(s => s.id === plan.studentId);
                  return (
                    <div key={plan.id} className="flex justify-between items-center p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{student?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">سورة {plan.surah} • {plan.type === 'memorization' ? 'حفظ' : 'مراجعة'}</p>
                      </div>
                      <Badge variant={plan.status === 'completed' ? 'default' : plan.status === 'delayed' ? 'destructive' : 'secondary'}>
                        {plan.status === 'completed' ? 'منجز' : plan.status === 'delayed' ? 'متأخر' : 'قيد الانتظار'}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل الطلاب والمشرفين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-20 mb-3" />
                <p>مساحة لإدارة المشرفين والطلاب وإسناد الحلقات.</p>
                <Button className="mt-4" variant="outline">إضافة طالب جديد</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}