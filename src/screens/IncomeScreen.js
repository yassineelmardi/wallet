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

const CATEGORY_ICONS = {
  salary: '💼',
  bonus: '🎁',
  freelance: '💻',
  other: '💰',
};

const IncomeItem = ({ item, currency, onDelete, t }) => (
  <View style={styles.item}>
    <View style={styles.itemLeft}>
      <Text style={styles.itemIcon}>{CATEGORY_ICONS[item.category] || '💰'}</Text>
      <View>
        <Text style={styles.itemTitle}>{item.description || t(`income.${item.category}`)}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </View>
    <View style={styles.itemRight}>
      <Text style={styles.itemAmount}>+{parseFloat(item.amount).toFixed(2)} {currency}</Text>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const IncomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { income, removeIncome, totalIncome, settings } = useApp();
  const cur = settings.currency || '€';

  const handleDelete = (id) => {
    Alert.alert(t('common.confirm'), t('income.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => removeIncome(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('income.title')}</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>{t('income.total')}</Text>
          <Text style={styles.totalAmount}>{totalIncome.toFixed(2)} {cur}</Text>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={income}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💰</Text>
            <Text style={styles.emptyText}>{t('income.noIncome')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <IncomeItem item={item} currency={cur} onDelete={handleDelete} t={t} />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddIncome')}
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
    ...Shadow.sm,
  },
  totalLabel: { color: Colors.textSecondary, fontSize: FontSize.xs },
  totalAmount: { color: Colors.success, fontSize: FontSize.lg, fontWeight: '700' },
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
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  itemIcon: { fontSize: 28 },
  itemTitle: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600' },
  itemDate: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  itemRight: { alignItems: 'flex-end', gap: Spacing.xs },
  itemAmount: { color: Colors.success, fontSize: FontSize.md, fontWeight: '700' },
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 28 },
});

export default IncomeScreen;
