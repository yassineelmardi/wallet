import { useApp } from '../context/AppContext';

/**
 * Hook utilitaire pour la logique métier des salaires.
 * getCurrentMonthSalary() : retourne le salaire mensuel si défini,
 * sinon le salaire global, sinon { amount: 0, type: 'none' }.
 */
const useSalary = () => {
  const { globalSalary, monthlySalaries } = useApp();

  const getCurrentMonthSalary = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthly = monthlySalaries.find(
      (s) => s.month === month && s.year === year
    );
    if (monthly) {
      return { amount: parseFloat(monthly.amount || 0), type: 'monthly', data: monthly };
    }
    if (globalSalary) {
      return { amount: parseFloat(globalSalary.amount || 0), type: 'global', data: globalSalary };
    }
    return { amount: 0, type: 'none', data: null };
  };

  const getSalaryForMonth = (month, year) => {
    const monthly = monthlySalaries.find((s) => s.month === month && s.year === year);
    if (monthly) return { amount: parseFloat(monthly.amount || 0), type: 'monthly', data: monthly };
    if (globalSalary) return { amount: parseFloat(globalSalary.amount || 0), type: 'global', data: globalSalary };
    return { amount: 0, type: 'none', data: null };
  };

  return { getCurrentMonthSalary, getSalaryForMonth };
};

export default useSalary;
