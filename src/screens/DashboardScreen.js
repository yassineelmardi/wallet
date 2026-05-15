import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const StatCard = ({ label, amount, currency, accent, C }) => (
  <View style={[statCardStyle(C), { borderLeftColor: accent }]}>
    <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</Text>
    <Text style={{ color: accent, fontSize: FontSize.xl, fontWeight: '800' }}>{amount.toFixed(2)} {currency}</Text>
  </View>
);

const statCardStyle = (C) => ({
  backgroundColor: C.card,
  borderRadius: BorderRadius.lg,
  padding: Spacing.md,
  borderLeftWidth: 3,
  marginBottom: Spacing.sm,
  ...Shadow.sm,
});

const DashboardScreen = () => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const {
    totalIncome, totalAdditionalIncome, totalFixed,
    totalVariable, balance, budgetUsedPercent,
    settings, currentMonthSalary,
  } = useApp();
  const cur = settings.currency || '\u20ac';

  const balancePositive = balance >= 0;
  const pct = Math.min(budgetUsedPercent, 100);
  const barColor = pct > 80 ? C.error : pct > 60 ? C.warning : C.success;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }} showsVerticalScrollIndicator={false}>

        {/* ── Hero card ── */}
        <LinearGradient colors={C.gradientPrimary} style={styles.hero}>
          <Text style={styles.greeting}>{t('dashboard.greeting')} 👋</Text>
          <Text style={styles.heroLabel}>{t('dashboard.totalBalance')}</Text>
          <Text style={[styles.heroBalance, { color: balancePositive ? '#7FFFDA' : '#FF9999' }]}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)} {cur}
          </Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Revenus</Text>
              <Text style={styles.heroStatVal}>{totalIncome.toFixed(0)} {cur}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Dépenses</Text>
              <Text style={styles.heroStatVal}>{(totalFixed + totalVariable).toFixed(0)} {cur}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Salary chip ── */}
        <View style={[styles.salaryChip, { backgroundColor: C.card, borderColor: C.border }]}>
          <View>
            <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight: '600' }}>Salaire actif</Text>
            <Text style={{ color: C.textPrimary, fontSize: FontSize.lg, fontWeight: '800', marginTop: 2 }}>
              {currentMonthSalary.amount.toFixed(2)} {cur}
            </Text>
          </View>
          <View style={[styles.badge, {
            backgroundColor: currentMonthSalary.type === 'monthly' ? C.accentYellowSurface : C.primarySurface,
          }]}>
            <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: currentMonthSalary.type === 'monthly' ? C.accentYellow : C.primary }}>
              {currentMonthSalary.type === 'monthly' ? 'MENSUEL' : currentMonthSalary.type === 'global' ? 'GLOBAL' : 'NON DÉFINI'}
            </Text>
          </View>
        </View>

        {/* ── Budget bar ── */}
        <View style={[styles.budgetCard, { backgroundColor: C.card }]}>
          <View style={styles.budgetRow}>
            <Text style={{ color: C.textSecondary, fontSize: FontSize.sm, fontWeight: '600' }}>{t('dashboard.budgetUsed')}</Text>
            <Text style={{ color: barColor, fontSize: FontSize.sm, fontWeight: '800' }}>{pct}%</Text>
          </View>
          <View style={[styles.barBg, { backgroundColor: C.border }]}>
            <View style={[styles.barFill, { width: pct + '%', backgroundColor: barColor }]} />
          </View>
          <View style={styles.budgetRow}>
            <Text style={{ color: C.textMuted, fontSize: FontSize.xs }}>Dépensé: {(totalFixed + totalVariable).toFixed(2)} {cur}</Text>
            <Text style={{ color: C.textMuted, fontSize: FontSize.xs }}>Budget: {totalIncome.toFixed(2)} {cur}</Text>
          </View>
        </View>

        {/* ── Stat cards ── */}
        <View style={{ paddingHorizontal: Spacing.md }}>
          <StatCard label={t('dashboard.totalIncome')} amount={totalIncome} currency={cur} accent={C.success} C={C} />
          {totalAdditionalIncome > 0 && (
            <StatCard label="Revenus supplémentaires" amount={totalAdditionalIncome} currency={cur} accent={C.primaryLight} C={C} />
          )}
          <StatCard label={t('dashboard.fixedExpenses')} amount={totalFixed} currency={cur} accent={C.accentYellow} C={C} />
          <StatCard label={t('dashboard.variableExpenses')} amount={totalVariable} currency={cur} accent={C.accentWarn} C={C} />
        </View>

        {/* ── Balance finale ── */}
        <LinearGradient
          colors={balancePositive ? C.gradientSuccess : C.gradientWarn}
          style={styles.balanceFinal}
        >
          <Text style={{ color: '#ffffffcc', fontSize: FontSize.sm, marginBottom: 6 }}>{t('dashboard.totalBalance')}</Text>
          <Text style={{ color: '#fff', fontSize: FontSize.xxl, fontWeight: '800' }}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)} {cur}
          </Text>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hero: { padding: Spacing.xl, paddingTop: Spacing.xxl, borderBottomLeftRadius: BorderRadius.xxl, borderBottomRightRadius: BorderRadius.xxl },
  greeting: { color: '#ffffffaa', fontSize: FontSize.md, marginBottom: Spacing.sm },
  heroLabel: { color: '#ffffffcc', fontSize: FontSize.sm, marginBottom: Spacing.xs },
  heroBalance: { fontSize: FontSize.xxxl, fontWeight: '800', marginBottom: Spacing.lg },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: { color: '#ffffff88', fontSize: FontSize.xs },
  heroStatVal: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', marginTop: 2 },
  heroDivider: { width: 1, height: 32, backgroundColor: '#ffffff33' },
  salaryChip: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginHorizontal: Spacing.md, marginTop: Spacing.md, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, ...Shadow.sm },
  badge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  budgetCard: { marginHorizontal: Spacing.md, marginTop: Spacing.sm, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  barBg: { height: 8, borderRadius: BorderRadius.full, overflow: 'hidden', marginVertical: Spacing.xs },
  barFill: { height: '100%', borderRadius: BorderRadius.full },
  balanceFinal: { marginHorizontal: Spacing.md, marginTop: Spacing.sm, borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', ...Shadow.lg },
});

export default DashboardScreen;
