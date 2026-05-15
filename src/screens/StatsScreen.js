import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const CAT_COLORS = {
  food: '#FF6B6B',
  shopping: '#4F7EFF',
  transport: '#FFB740',
  leisure: '#A78BFA',
  health: '#00C896',
  rent: '#F97316',
  internet: '#06B6D4',
  insurance: '#84CC16',
  credit: '#EC4899',
  other: '#8A9BB8',
};

const BAR_MAX_WIDTH = 200;

const StatsScreen = () => {
  const { t } = useTranslation();
  const { income, variableExpenses, fixedExpenses, totalIncome, totalFixed, totalVariable, settings } = useApp();
  const cur = settings.currency || '€';

  // Regrouper par catégorie
  const allExpenses = [...fixedExpenses, ...variableExpenses];
  const byCategory = allExpenses.reduce((acc, item) => {
    const cat = item.category || 'other';
    acc[cat] = (acc[cat] || 0) + parseFloat(item.amount || 0);
    return acc;
  }, {});

  const totalExpenses = totalFixed + totalVariable;
  const maxCatAmount = Math.max(...Object.values(byCategory), 1);

  const overviewData = [
    { label: t('dashboard.totalIncome'), amount: totalIncome, color: Colors.success },
    { label: t('dashboard.fixedExpenses'), amount: totalFixed, color: Colors.accentYellow },
    { label: t('dashboard.variableExpenses'), amount: totalVariable, color: Colors.accentWarn },
    { label: t('dashboard.totalBalance'), amount: totalIncome - totalExpenses, color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('stats.title')}</Text>

        {/* Overview */}
        <Text style={styles.sectionTitle}>{t('stats.overview')}</Text>
        <View style={styles.overviewGrid}>
          {overviewData.map((item) => (
            <View key={item.label} style={[styles.overviewCard, { borderTopColor: item.color }]}>
              <Text style={styles.overviewLabel}>{item.label}</Text>
              <Text style={[styles.overviewAmount, { color: item.color }]}>
                {item.amount.toFixed(2)} {cur}
              </Text>
            </View>
          ))}
        </View>

        {/* Revenus vs Dépenses */}
        <Text style={styles.sectionTitle}>{t('stats.incomeVsExpenses')}</Text>
        <View style={styles.card}>
          <View style={styles.vsRow}>
            <View style={styles.vsItem}>
              <View style={[styles.vsDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.vsLabel}>{t('nav.income')}</Text>
            </View>
            <Text style={[styles.vsAmount, { color: Colors.success }]}>
              {totalIncome.toFixed(2)} {cur}
            </Text>
          </View>
          <View style={styles.vsRow}>
            <View style={styles.vsItem}>
              <View style={[styles.vsDot, { backgroundColor: Colors.accentWarn }]} />
              <Text style={styles.vsLabel}>{t('nav.expenses')}</Text>
            </View>
            <Text style={[styles.vsAmount, { color: Colors.accentWarn }]}>
              {totalExpenses.toFixed(2)} {cur}
            </Text>
          </View>
          {/* Barre comparative */}
          <View style={styles.compareBarWrapper}>
            {totalIncome > 0 && (
              <View style={[styles.compareBar, { width: `${Math.min(100, (totalExpenses / totalIncome) * 100)}%`, backgroundColor: Colors.accentWarn }]} />
            )}
          </View>
        </View>

        {/* Par catégorie */}
        {Object.keys(byCategory).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('stats.byCategory')}</Text>
            <View style={styles.card}>
              {Object.entries(byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, amount]) => (
                  <View key={cat} style={styles.catRow}>
                    <Text style={styles.catLabel}>
                      {t(`expenses.categories.${cat}`)}
                    </Text>
                    <View style={styles.catBarWrap}>
                      <View
                        style={[
                          styles.catBar,
                          {
                            width: (amount / maxCatAmount) * BAR_MAX_WIDTH,
                            backgroundColor: CAT_COLORS[cat] || Colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.catAmount, { color: CAT_COLORS[cat] || Colors.primary }]}>
                      {amount.toFixed(0)} {cur}
                    </Text>
                  </View>
                ))}
            </View>
          </>
        )}

        {totalIncome === 0 && totalExpenses === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>{t('dashboard.noData')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.lg, marginTop: Spacing.md },
  sectionTitle: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '700', marginBottom: Spacing.sm, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  overviewLabel: { color: Colors.textSecondary, fontSize: FontSize.xs, marginBottom: Spacing.xs },
  overviewAmount: { fontSize: FontSize.lg, fontWeight: '700' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.sm,
  },
  vsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  vsItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  vsDot: { width: 10, height: 10, borderRadius: 5 },
  vsLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  vsAmount: { fontSize: FontSize.md, fontWeight: '700' },
  compareBarWrapper: { height: 8, backgroundColor: Colors.success, borderRadius: BorderRadius.full, overflow: 'hidden', marginTop: Spacing.sm },
  compareBar: { height: '100%', borderRadius: BorderRadius.full },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  catLabel: { color: Colors.textSecondary, fontSize: FontSize.xs, width: 80 },
  catBarWrap: { flex: 1 },
  catBar: { height: 8, borderRadius: BorderRadius.full },
  catAmount: { fontSize: FontSize.xs, fontWeight: '700', width: 60, textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.md },
});

export default StatsScreen;
