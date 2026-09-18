import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, PlanRecord, User, Role } from './types';
import { initialData } from './mock-data';

interface StoreContextType extends AppState {
  setActiveRole: (role: Role) => void;
  updatePlan: (id: string, updates: Partial<PlanRecord>) => void;
  addPlan: (plan: Omit<PlanRecord, 'id'>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('quran-platform-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('quran-platform-data', JSON.stringify(state));
  }, [state]);

  const setActiveRole = (role: Role) => {
    setState(prev => ({
      ...prev,
      activeRole: role,
      currentUser: prev.users.find(u => u.role === role) || prev.currentUser
    }));
  };

  const updatePlan = (id: string, updates: Partial<PlanRecord>) => {
    setState(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const addPlan = (plan: Omit<PlanRecord, 'id'>) => {
    const newPlan = { ...plan, id: `p_${Date.now()}` } as PlanRecord;
    setState(prev => ({
      ...prev,
      plans: [...prev.plans, newPlan]
    }));
  };

  const resetData = () => {
    setState(initialData);
  };

  return (
    <StoreContext.Provider value={{ ...state, setActiveRole, updatePlan, addPlan, resetData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
