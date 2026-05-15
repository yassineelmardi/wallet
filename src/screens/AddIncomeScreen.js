import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const CATEGORIES = [
  { key: 'salary', icon: '💼' },
  { key: 'bonus', icon: '🎁' },
  { key: 'freelance', icon: '💻' },
  { key: 'other', icon: '💰' },
];

const today = () => new Date().toISOString().split('T')[0];

const AddIncomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { addIncome } = useApp();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('salary');
  const [date, setDate] = useState(today());

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('', t('common.invalidAmount'));
      return;
    }
    await addIncome({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancel}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t('income.addIncome')}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveBtn}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>

          {/* Montant */}
          <View style={styles.amountCard}>
            <Text style={styles.amountCur}>€</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>

          {/* Catégorie */}
          <Text style={styles.label}>{t('income.category')}</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[styles.catBtn, category === c.key && styles.catBtnActive]}
                onPress={() => setCategory(c.key)}
              >
                <Text style={styles.catIcon}>{c.icon}</Text>
                <Text style={[styles.catLabel, category === c.key && { color: Colors.primary }]}>
                  {t(`income.${c.key}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.label}>{t('income.description')} ({t('common.optional')})</Text>
          <TextInput
            style={styles.input}
            placeholder={t('income.description')}
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />

          {/* Date */}
          <Text style={styles.label}>{t('income.date')}</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textMuted}
            value={date}
            onChangeText={setDate}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl, paddingTop: Spacing.sm },
  cancel: { color: Colors.textSecondary, fontSize: FontSize.md },
  title: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '700' },
  saveBtn: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
  amountCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.md,
  },
  amountCur: { color: Colors.success, fontSize: FontSize.xxxl, fontWeight: '300', marginRight: Spacing.sm },
  amountInput: { color: Colors.success, fontSize: FontSize.xxxl, fontWeight: '800', minWidth: 120 },
  label: { color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.sm, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  catBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  catBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.cardAlt },
  catIcon: { fontSize: 28, marginBottom: Spacing.xs },
  catLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default AddIncomeScreen;
