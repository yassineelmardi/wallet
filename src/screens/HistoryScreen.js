import React, { useMemo, useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useFormat } from '../hooks/useFormat';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Shadow, Spacing } from '../theme/colors';
import MonthSelector from '../components/MonthSelector';
import ScreenHeader from '../components/ScreenHeader';
import YearSelector from '../components/YearSelector';
import { buildTransactions, filterByMonth, filterByYear } from '../services/analytics';
import { currentPeriod, formatPeriod, monthLabel } from '../utils/period';

const HistoryScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors: C } = useTheme();
  const { income, variableExpenses, monthlySalaries, settings } = useApp();
  const { money, date: formatDay } = useFormat();

  const today = currentPeriod();
  const [mode, setMode] = useState('month');
  const [period, setPeriod] = useState(today);
  const isMonthly = mode === 'month';

  const transactions = useMemo(
    () => buildTransactions({ income, variableExpenses, monthlySalaries }),
    [income, variableExpenses, monthlySalaries]
  );

  const scoped = useMemo(
    () =>
      isMonthly
        ? filterByMonth(transactions, period.year, period.month)
        : filterByYear(transactions, period.year),
    [transactions, period, isMonthly]
  );

  const sections = useMemo(() => {
    const groups = new Map();
    scoped.forEach((item) => {
      const key = isMonthly ? item.date : monthLabel(item.month);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return [...groups.entries()].map(([title, data]) => ({
      title,
      data,
      total: data.reduce(
        (sum, item) => sum + (item.type === 'expense' ? -item.amount : item.amount),
        0
      ),
    }));
  }, [scoped, isMonthly]);

  const totals = useMemo(
    () =>
      scoped.reduce(
        (acc, item) => {
          if (item.type === 'expense') acc.expenses += item.amount;
          else acc.income += item.amount;
          return acc;
        },
        { expenses: 0, income: 0 }
      ),
    [scoped]
  );

  const renderItem = ({ item }) => {
    const isExpense = item.type === 'expense';
    const tone = isExpense ? C.accentWarn : C.success;
    const categoryLabel = isExpense
      ? t(`expenses.categories.${item.category}`, item.category)
      : t(`income.${item.category}`, item.category);
    const label = item.description || categoryLabel;
    return (
      <View style={[styles.row, { backgroundColor: C.card }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.textPrimary, fontSize: FontSize.md, fontWeight: '600' }} numberOfLines={1}>
            {label}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>
            {categoryLabel} · {formatDay(item.date)}
          </Text>
        </View>
        <Text style={{ color: tone, fontWeight: '700', fontSize: FontSize.md }}>
          {money(isExpense ? -item.amount : item.amount, { signDisplay: 'always' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScreenHeader title={t('history.title')} onBack={() => navigation.goBack()} />
      <View style={styles.header}>
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

        {isMonthly ? (
          <MonthSelector year={period.year} month={period.month} onChange={setPeriod} maxPeriod={today} />
        ) : (
          <YearSelector year={period.year} onChange={(year) => setPeriod({ ...period, year })} maxYear={today.year} />
        )}

        <View style={styles.totals}>
          <Text style={{ color: C.success, fontWeight: '700', fontSize: FontSize.sm }}>
            {money(totals.income, { signDisplay: 'always' })}
          </Text>
          <Text style={{ color: C.accentWarn, fontWeight: '700', fontSize: FontSize.sm }}>
            {money(-totals.expenses, { signDisplay: 'always' })}
          </Text>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: C.textSecondary, backgroundColor: C.background }]}>
            {section.title}
          </Text>
        )}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: C.textSecondary, fontSize: FontSize.md, fontWeight: '600' }}>
              {t('history.empty', { period: isMonthly ? formatPeriod(period) : String(period.year) })}
            </Text>
          </View>
        }
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.md },
  tabs: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  totals: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  list: { padding: Spacing.md, paddingBottom: 100 },
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  empty: { alignItems: 'center', marginTop: 60 },
});

export default HistoryScreen;
