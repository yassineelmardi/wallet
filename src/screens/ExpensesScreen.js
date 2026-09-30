import React, { useState } from 'react';
import { Alert, FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useFormat } from '../hooks/useFormat';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const CAT_ICONS = {
  food:'\ud83c\udf54', shopping:'\ud83d\uded2', transport:'\ud83d\ude97', leisure:'\ud83c\udfae',
  health:'\ud83d\udc8a', rent:'\ud83c\udfe0', internet:'\ud83d\udcf6', insurance:'\ud83d\udee1',
  credit:'\ud83d\udcb3', other:'\ud83d\udce6',
};

// Ajoute la marge tactile manquante pour atteindre les 44px recommandés.
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

const ExpensesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors: C } = useTheme();
  const { fixedExpenses, variableExpenses, removeFixed, removeVariable, totalFixed, totalVariable, settings } = useApp();
  const { money } = useFormat();
  const [tab, setTab] = useState('variable');

  const isFixed = tab === 'fixed';
  const data = isFixed ? fixedExpenses : variableExpenses;
  const total = isFixed ? totalFixed : totalVariable;
  const accent = isFixed ? C.accentYellow : C.accentWarn;
  const accentSurface = isFixed ? C.accentYellowSurface : C.accentWarnSurface;

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('expenses.deleteConfirm'))) {
        isFixed ? removeFixed(id) : removeVariable(id);
      }
    } else {
      Alert.alert(t('common.confirm'), t('expenses.deleteConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => isFixed ? removeFixed(id) : removeVariable(id) },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: C.card, borderLeftColor: accent }]}>
      <View style={[styles.iconWrap, { backgroundColor: accentSurface }]}>
        <Text style={{ fontSize: 20 }}>{CAT_ICONS[item.category] || '\ud83d\udce6'}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
        <Text style={{ color: C.textPrimary, fontWeight: '600', fontSize: FontSize.md }}>
          {item.description || t('expenses.categories.' + item.category)}
        </Text>
        <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 1 }}>
          {t('expenses.categories.' + item.category)}{item.date ? ' \u00b7 ' + item.date : ''}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: accent, fontWeight: '700', fontSize: FontSize.md }}>
          {money(-parseFloat(item.amount || 0))}
        </Text>
        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddExpense', { type: tab, editItem: item })}
            style={[styles.actionBtn, { backgroundColor: C.primarySurface }]}
            accessibilityRole="button"
            accessibilityLabel={`${t('common.edit')} ${item.description || t('expenses.categories.' + item.category)}`}
            hitSlop={HIT_SLOP}
          >
            <Text style={styles.actionEdit}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.actionBtn, { backgroundColor: C.accentWarnSurface }]}
            accessibilityRole="button"
            accessibilityLabel={`${t('common.delete')} ${item.description || t('expenses.categories.' + item.category)}`}
            hitSlop={HIT_SLOP}
          >
            <Text style={[styles.actionDelete, { color: C.error }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border, backgroundColor: C.surface }]}>
        <View>
          <Text style={{ color: C.textPrimary, fontSize: FontSize.xl, fontWeight: '800' }}>{t('expenses.title')}</Text>
          <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>
            {t('dashboard.thisMonth')}
          </Text>
        </View>
        <View style={[styles.totalChip, { backgroundColor: accentSurface }]}>
          <Text style={{ color: accent, fontWeight: '800', fontSize: FontSize.md }}>
            {money(-total)}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        {[{key:'variable', label: t('expenses.variable')}, {key:'fixed', label: t('expenses.fixed')}].map(({key, label}) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && { borderBottomWidth: 2, borderBottomColor: tab === key && key === 'fixed' ? C.accentYellow : C.accentWarn }]}
            onPress={() => setTab(key)}
            activeOpacity={0.7}
          >
            <Text style={{ color: tab === key ? (key === 'fixed' ? C.accentYellow : C.accentWarn) : C.textMuted, fontWeight: '700', fontSize: FontSize.sm }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>💭</Text>
            <Text style={{ color: C.textSecondary, fontSize: FontSize.md, fontWeight: '600' }}>{t('expenses.noExpenses')}</Text>
          </View>
        }
        renderItem={renderItem}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accent, ...Shadow.lg }]}
        onPress={() => navigation.navigate('AddExpense', { type: tab })}
        activeOpacity={0.85}
      >
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, paddingTop: Spacing.xl, borderBottomWidth: 1 },
  totalChip: { borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  item: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3, ...Shadow.sm },
  iconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  itemActions: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  actionBtn: { width: 36, height: 36, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  actionEdit: { fontSize: 15 },
  actionDelete: { fontSize: 14, fontWeight: '700' },
  fab: { position:'absolute', bottom:24, right:24, width:56, height:56, borderRadius:28, alignItems:'center', justifyContent:'center' },
});

export default ExpensesScreen;
