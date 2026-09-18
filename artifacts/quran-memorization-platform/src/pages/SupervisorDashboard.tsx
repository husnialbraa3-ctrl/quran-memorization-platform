import { useState } from 'react';
import { useStore } from '../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { CheckCircle2, Clock, AlertCircle, FileText, ChevronDown, Check } from 'lucide-react';
import { PlanRecord } from '../lib/types';

export default function SupervisorDashboard() {
  const { currentUser, users, plans, updatePlan } = useStore();
  const myStudents = users.filter(u => u.role === 'student' && (u as any).supervisorId === currentUser?.id);
  const myPlans = plans.filter(p => myStudents.some(s => s.id === p.studentId));
  
  const pendingPlans = myPlans.filter(p => p.status !== 'completed');
  const delayedCount = myPlans.filter(p => p.status === 'delayed').length;

  const [selectedPlan, setSelectedPlan] = useState<PlanRecord | null>(null);
  const [evalForm, setEvalForm] = useState({
    memMistakes: 0,
    fluency: 25,
    correction: 15,
    notes: ''
  });

  const handleEvaluate = () => {
    if (!selectedPlan) return;
    
    // إتقان الحفظ من 60 مع خصم 17 لكل لحن جلي لم يصحح
    const memScore = Math.max(0, 60 - (evalForm.memMistakes * 17));
    const totalScore = memScore + Number(evalForm.fluency) + Number(evalForm.correction);
    const passed = totalScore >= 51;

    updatePlan(selectedPlan.id, {
      status: 'completed',
      evaluation: {
        memorizationScore: memScore,
        fluencyScore: Number(evalForm.fluency),
        correctionScore: Number(evalForm.correction),
        totalScore,
        passed,
        notes: evalForm.notes,
        attempts: (selectedPlan.evaluation?.attempts || 0) + 1,
        date: new Date().toISOString().split('T')[0]
      }
    });

    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">مرحباً، {currentUser?.name}</h2>
          <p className="text-muted-foreground mt-1">سجل التسميع والمتابعة اليومية</p>
        </div>
        <div className="text-left bg-white p-3 rounded-lg border shadow-sm flex items-center gap-3">
           <div className="flex flex-col items-center px-3 border-l">
             <span className="text-xs text-muted-foreground">الطلاب</span>
             <span className="font-bold">{myStudents.length}</span>
           </div>
           <div className="flex flex-col items-center px-3 border-l">
             <span className="text-xs text-muted-foreground">للتسميع</span>
             <span className="font-bold">{pendingPlans.length}</span>
           </div>
           <div className="flex flex-col items-center px-3">
             <span className="text-xs text-destructive">متأخرين</span>
             <span className="font-bold text-destructive">{delayedCount}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">الطلاب والأوراد اليومية</h3>
          
          {pendingPlans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p>لا توجد أوراد معلقة اليوم. أحسنت!</p>
              </CardContent>
            </Card>
          ) : (
            pendingPlans.map(plan => {
              const student = myStudents.find(s => s.id === plan.studentId);
              return (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedPlan?.id === plan.id ? 'ring-2 ring-primary border-primary' : ''} ${plan.status === 'delayed' ? 'border-destructive/30 bg-destructive/5' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{student?.name}</h4>
                          {plan.status === 'delayed' && <Badge variant="destructive" className="px-1 text-[10px]">متأخر</Badge>}
                        </div>
                        <p className="text-sm mt-1">سورة {plan.surah}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          الآيات: {plan.ayahFrom} - {plan.ayahTo} | الصفحات: {plan.pageFrom} - {plan.pageTo}
                        </p>
                      </div>
                      <Badge variant={plan.type === 'memorization' ? 'default' : 'secondary'} className="text-xs">
                        {plan.type === 'memorization' ? 'حفظ' : 'مراجعة'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedPlan ? (
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 border-b pb-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl mb-1">تقييم التسميع</CardTitle>
                    <CardDescription>
                      {myStudents.find(s => s.id === selectedPlan.studentId)?.name} • سورة {selectedPlan.surah} • {selectedPlan.type === 'memorization' ? 'حفظ' : 'مراجعة'}
                    </CardDescription>
                  </div>
                  <div className="text-left bg-white p-2 rounded-lg border text-sm">
                    المحاولة: <span className="font-bold">{(selectedPlan.evaluation?.attempts || 0) + 1}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-muted">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold text-primary">إتقان الحفظ (60 درجة)</Label>
                    <div className="text-xl font-bold font-serif">{Math.max(0, 60 - (evalForm.memMistakes * 17))} <span className="text-sm text-muted-foreground">/ 60</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground">يخصم 17 درجة لكل لحن جلي لم يصححه الطالب بعد التنبيه. لا يخصم إذا استدرك وصحح بنفسه.</p>
                  
                  <div className="flex items-center gap-4">
                    <Label>عدد الأخطاء الجلية غير المصححة:</Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => setEvalForm({...evalForm, memMistakes: Math.max(0, evalForm.memMistakes - 1)})}>-</Button>
                      <div className="w-12 text-center font-bold text-lg">{evalForm.memMistakes}</div>
                      <Button type="button" variant="outline" size="icon" onClick={() => setEvalForm({...evalForm, memMistakes: evalForm.memMistakes + 1})}>+</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-primary flex justify-between">
                      <span>الاسترسال</span>
                      <span>{evalForm.fluency} <span className="text-xs font-normal text-muted-foreground">/ 25</span></span>
                    </Label>
                    <Select value={evalForm.fluency.toString()} onChange={e => setEvalForm({...evalForm, fluency: Number(e.target.value)})}>
                      <option value="25">ممتاز - انسيابية تامة (25)</option>
                      <option value="20">جيد جداً - توقف يسير (20)</option>
                      <option value="15">جيد - تردد ملحوظ (15)</option>
                      <option value="10">مقبول - بطء مستمر (10)</option>
                      <option value="5">ضعيف - تعثر متكرر (5)</option>
                      <option value="-5">رسوب - توقف تام (-5)</option>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-primary flex justify-between">
                      <span>الاستدراك والتصحيح</span>
                      <span>{evalForm.correction} <span className="text-xs font-normal text-muted-foreground">/ 15</span></span>
                    </Label>
                    <Select value={evalForm.correction.toString()} onChange={e => setEvalForm({...evalForm, correction: Number(e.target.value)})}>
                      <option value="15">ممتاز - يصحح فوراً (15)</option>
                      <option value="10">جيد جداً - يصحح بالتلميح (10)</option>
                      <option value="5">مقبول - يحتاج للفتح عليه (5)</option>
                      <option value="-5">ضعيف - لا يتجاوب مع الفتح (-5)</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">ملاحظات للمراجعة القادمة</Label>
                  <Input 
                    placeholder="مثال: التركيز على المتشابهات في الربع الأخير..." 
                    value={evalForm.notes}
                    onChange={e => setEvalForm({...evalForm, notes: e.target.value})}
                  />
                </div>
                
                {/* Result Preview */}
                {(() => {
                  const score = Math.max(0, 60 - (evalForm.memMistakes * 17)) + Number(evalForm.fluency) + Number(evalForm.correction);
                  const isPass = score >= 51;
                  return (
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isPass ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                      <div>
                        <p className="font-bold text-lg">النتيجة النهائية: {score} %</p>
                        <p className="text-sm mt-1">القرار: {isPass ? 'ناجح - اجتياز الورد' : 'راسب - يطالب بإعادة الورد'}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${isPass ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isPass ? <Check size={24} /> : <AlertCircle size={24} />}
                      </div>
                    </div>
                  );
                })()}

              </CardContent>
              <CardFooter className="bg-muted/10 border-t pt-6 gap-3">
                <Button onClick={handleEvaluate} className="w-full text-lg h-12">
                  اعتماد التقييم
                </Button>
                <Button variant="outline" onClick={() => setSelectedPlan(null)} className="h-12 px-6">
                  إلغاء
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card/50">
              <FileText size={48} className="mb-4 opacity-20" />
              <h3 className="font-bold text-xl mb-2">مساحة التقييم</h3>
              <p>اختر طالباً من القائمة الجانبية للبدء في جلسة التسميع وإدخال التقييم المباشر.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}