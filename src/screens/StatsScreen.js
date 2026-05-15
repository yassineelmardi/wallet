import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const CAT_COLORS = {
  food:'#FF6B6B', shopping:'#4F7EFF', transport:'#FFB740', leisure:'#A78BFA',
  health:'#00C896', rent:'#F97316', internet:'#06B6D4', insurance:'#84CC16',
  credit:'#EC4899', other:'#8A9BB8',
};

const StatsScreen = () => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const { variableExpenses, fixedExpenses, totalIncome, totalFixed, totalVariable, settings } = useApp();
  const cur = settings.currency || '\u20ac';

  const allExpenses = [...fixedExpenses, ...variableExpenses];
  const byCategory = allExpenses.reduce((acc, item) => {
    const cat = item.category || 'other';
    acc[cat] = (acc[cat] || 0) + parseFloat(item.amount || 0);
    return acc;
  }, {});

  const totalExpenses = totalFixed + totalVariable;
  const maxCatAmount = Math.max(...Object.values(byCategory), 1);
  const expensePct = totalIncome > 0 ? Math.min(100, (totalExpenses / totalIncome) * 100) : 0;

  const overviewData = [
    { label: t('dashboard.totalIncome'),      amount: totalIncome,              color: C.success      },
    { label: t('dashboard.fixedExpenses'),    amount: totalFixed,               color: C.accentYellow },
    { label: t('dashboard.variableExpenses'), amount: totalVariable,            color: C.accentWarn   },
    { label: t('dashboard.totalBalance'),     amount: totalIncome - totalExpenses, color: C.primary   },
  ];

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl }} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={{ color: C.textPrimary, fontSize: FontSize.xxl, fontWeight:'800', marginBottom: Spacing.lg, marginTop: Spacing.md }}>
          {t('stats.title')}
        </Text>

        {/* Overview grid */}
        <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, marginBottom: Spacing.sm }}>
          {t('stats.overview')}
        </Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap: Spacing.sm, marginBottom: Spacing.sm }}>
          {overviewData.map((item) => (
            <View key={item.label} style={{ flex:1, minWidth:'45%', backgroundColor: C.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderTopWidth:3, borderTopColor: item.color, ...Shadow.sm }}>
              <Text style={{ color: C.textSecondary, fontSize: FontSize.xs, marginBottom: Spacing.xs }}>{item.label}</Text>
              <Text style={{ color: item.color, fontSize: FontSize.lg, fontWeight:'700' }}>{item.amount.toFixed(2)} {cur}</Text>
            </View>
          ))}
        </View>

        {/* Income vs Expenses */}
        <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, marginBottom: Spacing.sm, marginTop: Spacing.md }}>
          {t('stats.incomeVsExpenses')}
        </Text>
        <View style={{ backgroundColor: C.card, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm, marginBottom: Spacing.sm }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: Spacing.sm }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap: Spacing.xs }}>
              <View style={{ width:10, height:10, borderRadius:5, backgroundColor: C.success }} />
              <Text style={{ color: C.textSecondary, fontSize: FontSize.sm }}>{t('nav.income')}</Text>
            </View>
            <Text style={{ color: C.success, fontSize: FontSize.md, fontWeight:'700' }}>{totalIncome.toFixed(2)} {cur}</Text>
          </View>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: Spacing.md }}>
            <View style={{ flexDirection:'row', alignItems:'center', gap: Spacing.xs }}>
              <View style={{ width:10, height:10, borderRadius:5, backgroundColor: C.accentWarn }} />
              <Text style={{ color: C.textSecondary, fontSize: FontSize.sm }}>{t('nav.expenses')}</Text>
            </View>
            <Text style={{ color: C.accentWarn, fontSize: FontSize.md, fontWeight:'700' }}>{totalExpenses.toFixed(2)} {cur}</Text>
          </View>
          <View style={{ height:8, backgroundColor: C.success, borderRadius: BorderRadius.full, overflow:'hidden' }}>
            <View style={{ width: expensePct + '%', height:'100%', backgroundColor: C.accentWarn, borderRadius: BorderRadius.full }} />
          </View>
          <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xs, textAlign:'right' }}>{expensePct.toFixed(0)}% du budget utilisé</Text>
        </View>

        {/* By category */}
        {Object.keys(byCategory).length > 0 && (
          <>
            <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, marginBottom: Spacing.sm, marginTop: Spacing.md }}>
              {t('stats.byCategory')}
            </Text>
            <View style={{ backgroundColor: C.card, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm, marginBottom: Spacing.sm }}>
              {Object.entries(byCategory)
                .sort(([,a],[,b]) => b - a)
                .map(([cat, amount]) => {
                  const col = CAT_COLORS[cat] || C.primary;
                  const pct = (amount / maxCatAmount) * 100;
                  return (
                    <View key={cat} style={{ flexDirection:'row', alignItems:'center', marginBottom: Spacing.sm, gap: Spacing.sm }}>
                      <Text style={{ color: C.textSecondary, fontSize: FontSize.xs, width:80 }}>{t('expenses.categories.' + cat)}</Text>
                      <View style={{ flex:1, height:8, backgroundColor: C.border, borderRadius: BorderRadius.full, overflow:'hidden' }}>
                        <View style={{ width: pct + '%', height:'100%', backgroundColor: col, borderRadius: BorderRadius.full }} />
                      </View>
                      <Text style={{ color: col, fontSize: FontSize.xs, fontWeight:'700', width:55, textAlign:'right' }}>{amount.toFixed(0)} {cur}</Text>
                    </View>
                  );
                })}
            </View>
          </>
        )}

        {totalIncome === 0 && totalExpenses === 0 && (
          <View style={{ alignItems:'center', marginTop:80 }}>
            <Text style={{ fontSize:48, marginBottom: Spacing.md }}>\ud83d\udcca</Text>
            <Text style={{ color: C.textMuted, fontSize: FontSize.md }}>{t('dashboard.noData')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;
