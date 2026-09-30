import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useFormat } from '../hooks/useFormat';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { parsePositiveAmount } from '../utils/money';
import { getMonths } from '../utils/period';

const generateId = () => `month-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

const AddMonthlySalaryScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const editItem = route.params?.editItem || null;
  const now = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    editItem ? editItem.month : now.getMonth()
  );
  const [year, setYear] = useState(
    editItem ? editItem.year : now.getFullYear()
  );
  const [amount, setAmount] = useState(editItem ? String(editItem.amount) : '');
  const [label, setLabel] = useState(editItem ? editItem.label || '' : '');

  const { setSalaryForMonth, monthlySalaries, settings } = useApp();
  const { colors: C } = useTheme();
  const { money } = useFormat();
  const styles = makeStyles(C);
  const cur = settings.currency || '€';
  const months = getMonths();
  const previewAmount = parsePositiveAmount(amount);

  const handleSave = () => {
    const val = parsePositiveAmount(amount);
    if (val === null) {
      Alert.alert(t('salary.invalidAmountTitle'), t('salary.invalidAmountMessage'));
      return;
    }

    // Check for duplicate (different id but same month+year)
    const duplicate = monthlySalaries.find(
      (s) =>
        s.month === selectedMonth &&
        s.year === year &&
        (!editItem || s.id !== editItem.id)
    );
    if (duplicate) {
      Alert.alert(
        t('salary.duplicateTitle'),
        t('salary.duplicateMessage', { period: `${months[selectedMonth]} ${year}` }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('salary.replace'),
            onPress: () => {
              setSalaryForMonth({
                id: duplicate.id,
                month: selectedMonth,
                year,
                amount: String(val),
                label: label.trim(),
              });
              navigation.goBack();
            },
          },
        ]
      );
      return;
    }

    setSalaryForMonth({
      id: editItem ? editItem.id : generateId(),
      month: selectedMonth,
      year,
      amount: String(val),
      label: label.trim(),
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={styles.cancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editItem ? t('salary.editTitle') : t('salary.newTitle')}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Montant */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>{t('salary.amountLabel')}</Text>
            <View style={styles.amountRow}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={C.textMuted}
                keyboardType="numeric"
                autoFocus={!editItem}
              />
              <Text style={styles.amountCurrency}>{cur}</Text>
            </View>
          </View>

          {/* Sélection du mois */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('salary.month')}</Text>
            <View style={styles.monthGrid}>
              {months.map((m, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.monthBtn,
                    selectedMonth === idx && styles.monthBtnActive,
                  ]}
                  onPress={() => setSelectedMonth(idx)}
                >
                  <Text
                    style={[
                      styles.monthBtnText,
                      selectedMonth === idx && styles.monthBtnTextActive,
                    ]}
                  >
                    {m.substr(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sélection de l'année */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('salary.year')}</Text>
            <View style={styles.yearRow}>
              <TouchableOpacity
                style={styles.yearBtn}
                onPress={() => setYear((y) => y - 1)}
              >
                <Text style={styles.yearBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.yearValue}>{year}</Text>
              <TouchableOpacity
                style={styles.yearBtn}
                onPress={() => setYear((y) => y + 1)}
              >
                <Text style={styles.yearBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Aperçu de la période sélectionnée */}
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>{t('salary.selectedPeriod')}</Text>
            <Text style={styles.previewValue}>
              {months[selectedMonth]} {year}
            </Text>
            {previewAmount !== null ? (
              <Text style={styles.previewAmount}>{money(previewAmount)}</Text>
            ) : null}
          </View>

          {/* Note optionnelle */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('salary.note')}</Text>
            <TextInput
              style={styles.noteInput}
              value={label}
              onChangeText={setLabel}
              placeholder={t('salary.monthNotePlaceholder')}
              placeholderTextColor={C.textMuted}
              multiline
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerBtn: { minWidth: 70 },
  headerTitle: { color: C.textPrimary, fontSize: FontSize.md, fontWeight: '700' },
  cancelText: { color: C.textMuted, fontSize: FontSize.sm },
  saveText: { color: C.primary, fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right' },

  // Amount section
  amountSection: {
    backgroundColor: C.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  amountLabel: { color: C.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.md },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  amountInput: {
    color: C.textPrimary,
    fontSize: 42,
    fontWeight: '800',
    minWidth: 150,
    textAlign: 'center',
  },
  amountCurrency: { color: C.textMuted, fontSize: FontSize.xl, fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: C.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardLabel: {
    color: C.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },

  // Month grid
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  monthBtn: {
    width: '22%',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: C.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  monthBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  monthBtnText: { color: C.textMuted, fontSize: FontSize.xs, fontWeight: '600' },
  monthBtnTextActive: { color: '#fff' },

  // Year row
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  yearBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  yearBtnText: { color: C.primary, fontSize: FontSize.xl, fontWeight: '700' },
  yearValue: { color: C.textPrimary, fontSize: FontSize.xxl, fontWeight: '800', minWidth: 80, textAlign: 'center' },

  // Preview
  previewCard: {
    backgroundColor: C.primary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: C.primary + '44',
  },
  previewLabel: { color: C.textMuted, fontSize: FontSize.xs, marginBottom: 4 },
  previewValue: { color: C.primary, fontSize: FontSize.lg, fontWeight: '700' },
  previewAmount: { color: C.success, fontSize: FontSize.md, fontWeight: '700', marginTop: 4 },

  // Note input
  noteInput: {
    color: C.textPrimary,
    fontSize: FontSize.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default AddMonthlySalaryScreen;
