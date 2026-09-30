import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme/colors';
import ComparisonCard from '../components/ComparisonCard';
import ExpenseCategoryChart from '../components/ExpenseCategoryChart';
import ExpenseTrendChart from '../components/ExpenseTrendChart';
import MonthSelector from '../components/MonthSelector';
import ScreenHeader from '../components/ScreenHeader';
import StatisticsCard from '../components/StatisticsCard';
import YearSelector from '../components/YearSelector';
import {
  buildTransactions,
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getMonthlyComparison,
  getMonthlySeries,
  getYearlyAnalytics,
  getYearlyComparison,
} from '../services/analytics';
import { currentPeriod, formatPeriod, shiftMonth } from '../utils/period';

const AnalyticsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors: C } = useTheme();
  const { income, variableExpenses, monthlySalaries, fixedExpenses, settings } = useApp();
  const cur = settings.currency || '€';

  const today = currentPeriod();
  const [mode, setMode] = useState('month');
  const [period, setPeriod] = useState(today);
  const isMonthly = mode === 'month';

  const transactions = useMemo(
    () => buildTransactions({ income, variableExpenses, monthlySalaries }),
    [income, variableExpenses, monthlySalaries]
  );

  const analytics = useMemo(
    () =>
      isMonthly
        ? getMonthlyAnalytics(transactions, period)
        : getYearlyAnalytics(transactions, { year: period.year }),
    [transactions, period, isMonthly]
  );

  const comparison = useMemo(
    () =>
      isMonthly
        ? getMonthlyComparison(transactions, period)
        : getYearlyComparison(transactions, { year: period.year }),
    [transactions, period, isMonthly]
  );

  const series = useMemo(
    () => getMonthlySeries(transactions, { year: period.year }),
    [transactions, period.year]
  );

  const breakdown = useMemo(
    () =>
      getCategoryBreakdown(
        transactions,
        isMonthly ? period : { year: period.year }
      ),
    [transactions, period, isMonthly]
  );

  const previousLabel = isMonthly
    ? formatPeriod(shiftMonth(period, -1))
    : String(period.year - 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScreenHeader title={t('analytics.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.tabs, { backgroundColor: C.surface }]}>
          {[
            { key: 'month', label: t('analytics.byMonth') },
            { key: 'year', label: t('analytics.byYear') },
          ].map((tab) => {
            const active = mode === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && { backgroundColor: C.primary }]}
                onPress={() => setMode(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
              >
                <Text style={{ color: active ? '#fff' : C.textMuted, fontWeight: '700', fontSize: FontSize.sm }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.selector}>
          {isMonthly ? (
            <MonthSelector
              year={period.year}
              month={period.month}
              onChange={setPeriod}
              maxPeriod={today}
            />
          ) : (
            <YearSelector
              year={period.year}
              onChange={(year) => setPeriod({ ...period, year })}
              maxYear={today.year}
            />
          )}
        </View>

        <View style={styles.grid}>
          <StatisticsCard
            label={t('analytics.totalExpenses')}
            value={`${analytics.totalExpenses.toFixed(2)} ${cur}`}
            accent={C.accentWarn}
          />
          <StatisticsCard
            label={t('analytics.transactionCount')}
            value={String(analytics.transactionCount)}
            accent={C.primary}
          />
          <StatisticsCard
            label={t('analytics.largestExpense')}
            value={
              analytics.largestExpense
                ? `${analytics.largestExpense.amount.toFixed(2)} ${cur}`
                : '—'
            }
            hint={
              analytics.largestExpense
                ? t(`expenses.categories.${analytics.largestExpense.category}`, analytics.largestExpense.category)
                : undefined
            }
            accent={C.accentYellow}
          />
          <StatisticsCard
            label={isMonthly ? t('analytics.totalIncome') : t('analytics.monthlyAverage')}
            value={
              isMonthly
                ? `${analytics.totalIncome.toFixed(2)} ${cur}`
                : `${analytics.monthlyAverage.toFixed(2)} ${cur}`
            }
            accent={C.success}
          />
        </View>

        <Text style={[styles.section, { color: C.textMuted }]}>{t('analytics.comparison')}</Text>
        <ComparisonCard
          label={t('analytics.totalExpenses')}
          currentLabel={isMonthly ? formatPeriod(period) : String(period.year)}
          previousLabel={previousLabel}
          current={comparison.current.totalExpenses}
          previous={comparison.previous.totalExpenses}
          delta={comparison.expensesDelta}
          currency={cur}
          lowerIsBetter
        />

        <Text style={[styles.section, { color: C.textMuted }]}>
          {t('analytics.trend', { year: period.year })}
        </Text>
        <ExpenseTrendChart
          data={series}
          currency={cur}
          selectedMonth={isMonthly ? period.month : null}
          onSelectMonth={(month) => {
            setMode('month');
            setPeriod({ year: period.year, month });
          }}
          emptyLabel={t('analytics.noData')}
        />

        <Text style={[styles.section, { color: C.textMuted }]}>{t('analytics.byCategory')}</Text>
        <ExpenseCategoryChart
          data={breakdown}
          currency={cur}
          emptyLabel={t('analytics.noData')}
        />

        {fixedExpenses.length > 0 ? (
          <Text style={[styles.notice, { color: C.textMuted, borderColor: C.border }]}>
            {t('analytics.fixedNotice')}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.link, { borderColor: C.primary }]}
          onPress={() => navigation.navigate('History')}
          accessibilityRole="button"
          accessibilityLabel={t('history.title')}
        >
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: FontSize.sm }}>
            {t('history.title')} ›
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  tabs: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  selector: { marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  section: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  notice: {
    fontSize: FontSize.xs,
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
  },
  link: {
    marginTop: Spacing.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
});

export default AnalyticsScreen;
