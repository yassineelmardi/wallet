import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const SummaryCard = ({ label, amount, color, currency }) => (
  <View style={[styles.summaryCard, { borderLeftColor: color }]}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryAmount, { color }]}>
      {amount.toFixed(2)} {currency}
    </Text>
  </View>
);

const DashboardScreen = () => {
  const { t } = useTranslation();
  const {
    totalIncome,
    totalFixed,
    totalVariable,
    balance,
    budgetUsedPercent,
    settings,
  } = useApp();

  const C = Colors;
  const cur = settings.currency || '€';
  const balanceColor = balance >= 0 ? C.success : C.error;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header gradient */}
        <LinearGradient colors={C.gradientPrimary} style={styles.header}>
          <Text style={styles.headerGreeting}>{t('dashboard.greeting')} 👋</Text>
          <Text style={styles.headerLabel}>{t('dashboard.totalBalance')}</Text>
          <Text style={[styles.headerBalance, { color: balanceColor === C.success ? '#00FFB3' : '#FF8080' }]}>
            {balance.toFixed(2)} {cur}
          </Text>
          <Text style={styles.headerSub}>{t('dashboard.thisMonth')}</Text>
        </LinearGradient>

        {/* Progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t('dashboard.budgetUsed')}</Text>
            <Text style={[styles.progressPct, { color: budgetUsedPercent > 80 ? C.error : C.accent }]}>
              {budgetUsedPercent}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${budgetUsedPercent}%`,
                  backgroundColor: budgetUsedPercent > 80 ? C.error : C.accent,
                },
              ]}
            />
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.cards}>
          <SummaryCard
            label={t('dashboard.totalIncome')}
            amount={totalIncome}
            color={C.success}
            currency={cur}
          />
          <SummaryCard
            label={t('dashboard.fixedExpenses')}
            amount={totalFixed}
            color={C.accentYellow}
            currency={cur}
          />
          <SummaryCard
            label={t('dashboard.variableExpenses')}
            amount={totalVariable}
            color={C.accentWarn}
            currency={cur}
          />
        </View>

        {/* Balance finale */}
        <LinearGradient
          colors={balance >= 0 ? C.gradientSuccess : C.gradientWarn}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceCardLabel}>{t('dashboard.totalBalance')}</Text>
          <Text style={styles.balanceCardAmount}>
            {balance.toFixed(2)} {cur}
          </Text>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xxl },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerGreeting: { color: '#ffffffaa', fontSize: FontSize.md, marginBottom: Spacing.sm },
  headerLabel: { color: '#ffffffcc', fontSize: FontSize.sm, marginBottom: Spacing.xs },
  headerBalance: { fontSize: FontSize.xxxl, fontWeight: '800', marginBottom: Spacing.xs },
  headerSub: { color: '#ffffff88', fontSize: FontSize.xs },
  progressCard: {
    margin: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  progressLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  progressPct: { fontSize: FontSize.sm, fontWeight: '700' },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: BorderRadius.full },
  cards: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    ...Shadow.sm,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.xs },
  summaryAmount: { fontSize: FontSize.xl, fontWeight: '700' },
  balanceCard: {
    margin: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.lg,
  },
  balanceCardLabel: { color: '#ffffffcc', fontSize: FontSize.sm, marginBottom: Spacing.xs },
  balanceCardAmount: { color: '#fff', fontSize: FontSize.xxl, fontWeight: '800' },
});

export default DashboardScreen;
