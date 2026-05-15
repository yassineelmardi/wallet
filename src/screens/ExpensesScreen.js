import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const CAT_ICONS = {
  food: '🍔', shopping: '🛍', transport: '🚗', leisure: '🎮',
  health: '💊', rent: '🏠', internet: '📶', insurance: '🛡',
  credit: '💳', other: '📦',
};

const ExpenseItem = ({ item, currency, onDelete, t, isFixed }) => (
  <View style={[styles.item, isFixed && styles.itemFixed]}>
    <View style={styles.itemLeft}>
      <Text style={styles.itemIcon}>{CAT_ICONS[item.category] || '📦'}</Text>
      <View>
        <Text style={styles.itemTitle}>{item.description || t(`expenses.categories.${item.category}`)}</Text>
        <Text style={styles.itemCat}>{t(`expenses.categories.${item.category}`)}</Text>
        {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
      </View>
    </View>
    <View style={styles.itemRight}>
      <Text style={[styles.itemAmount, { color: isFixed ? Colors.accentYellow : Colors.accentWarn }]}>
        -{parseFloat(item.amount).toFixed(2)} {currency}
      </Text>
      <TouchableOpacity onPress={() => onDelete(item.id, isFixed)} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ExpensesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { fixedExpenses, variableExpenses, removeFixed, removeVariable, totalFixed, totalVariable, settings } = useApp();
  const [tab, setTab] = useState('variable');
  const cur = settings.currency || '€';

  const handleDelete = (id, isFixed) => {
    Alert.alert(t('common.confirm'), t('expenses.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => isFixed ? removeFixed(id) : removeVariable(id),
      },
    ]);
  };

  const data = tab === 'fixed' ? fixedExpenses : variableExpenses;
  const total = tab === 'fixed' ? totalFixed : totalVariable;
  const totalLabel = tab === 'fixed' ? t('expenses.totalFixed') : t('expenses.totalVariable');
  const totalColor = tab === 'fixed' ? Colors.accentYellow : Colors.accentWarn;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('expenses.title')}</Text>
        <View style={[styles.totalBadge, { borderColor: totalColor }]}>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
          <Text style={[styles.totalAmount, { color: totalColor }]}>
            -{total.toFixed(2)} {cur}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'variable' && styles.tabActive]}
          onPress={() => setTab('variable')}
        >
          <Text style={[styles.tabTxt, tab === 'variable' && styles.tabTxtActive]}>
            {t('expenses.variable')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'fixed' && styles.tabActive]}
          onPress={() => setTab('fixed')}
        >
          <Text style={[styles.tabTxt, tab === 'fixed' && styles.tabTxtActive]}>
            {t('expenses.fixed')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>{t('expenses.noExpenses')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ExpenseItem
            item={item}
            currency={cur}
            onDelete={handleDelete}
            t={t}
            isFixed={tab === 'fixed'}
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tab === 'fixed' ? Colors.accentYellow : Colors.accentWarn }]}
        onPress={() => navigation.navigate('AddExpense', { type: tab })}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800' },
  totalBadge: {
    backgroundColor: Colors.card,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'flex-end',
    borderWidth: 1,
    ...Shadow.sm,
  },
  totalLabel: { color: Colors.textSecondary, fontSize: FontSize.xs },
  totalAmount: { fontSize: FontSize.lg, fontWeight: '700' },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.sm,
  },
  tab: { flex: 1, padding: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabTxt: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  tabTxtActive: { color: '#fff' },
  list: { padding: Spacing.md, paddingBottom: 100 },
  item: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.sm,
  },
  itemFixed: { borderLeftWidth: 3, borderLeftColor: Colors.accentYellow },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  itemIcon: { fontSize: 26 },
  itemTitle: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600' },
  itemCat: { color: Colors.textMuted, fontSize: FontSize.xs },
  itemDate: { color: Colors.textMuted, fontSize: FontSize.xs },
  itemRight: { alignItems: 'flex-end', gap: Spacing.xs },
  itemAmount: { fontSize: FontSize.md, fontWeight: '700' },
  deleteBtn: { padding: 4 },
  deleteTxt: { color: Colors.error, fontSize: FontSize.sm },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.md },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 28 },
});

export default ExpensesScreen;
