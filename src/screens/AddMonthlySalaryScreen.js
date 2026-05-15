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
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const generateId = () => `month-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

const AddMonthlySalaryScreen = ({ navigation, route }) => {
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
  const cur = settings.currency || '€';
  const C = Colors;

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
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
        'Mois déjà défini',
        `Un salaire existe déjà pour ${MONTHS[selectedMonth]} ${year}. Voulez-vous le remplacer ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Remplacer',
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
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editItem ? 'Modifier le salaire' : 'Salaire mensuel'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Montant */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Montant du salaire</Text>
            <View style={styles.amountRow}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                autoFocus={!editItem}
              />
              <Text style={styles.amountCurrency}>{cur}</Text>
            </View>
          </View>

          {/* Sélection du mois */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Mois</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, idx) => (
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
            <Text style={styles.cardLabel}>Année</Text>
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
            <Text style={styles.previewLabel}>Période sélectionnée</Text>
            <Text style={styles.previewValue}>
              {MONTHS[selectedMonth]} {year}
            </Text>
            {amount && !isNaN(parseFloat(amount)) ? (
              <Text style={styles.previewAmount}>
                {parseFloat(amount).toFixed(2)} {cur}
              </Text>
            ) : null}
          </View>

          {/* Note optionnelle */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Note (optionnel)</Text>
            <TextInput
              style={styles.noteInput}
              value={label}
              onChangeText={setLabel}
              placeholder="ex: Prime incluse, congé sans solde…"
              placeholderTextColor={Colors.textMuted}
              multiline
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: { minWidth: 70 },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '700' },
  cancelText: { color: Colors.textMuted, fontSize: FontSize.sm },
  saveText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right' },

  // Amount section
  amountSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  amountLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.md },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  amountInput: {
    color: Colors.textPrimary,
    fontSize: 42,
    fontWeight: '800',
    minWidth: 150,
    textAlign: 'center',
  },
  amountCurrency: { color: Colors.textMuted, fontSize: FontSize.xl, fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardLabel: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monthBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  monthBtnText: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '600' },
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
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  yearBtnText: { color: Colors.primary, fontSize: FontSize.xl, fontWeight: '700' },
  yearValue: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800', minWidth: 80, textAlign: 'center' },

  // Preview
  previewCard: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  previewLabel: { color: Colors.textMuted, fontSize: FontSize.xs, marginBottom: 4 },
  previewValue: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '700' },
  previewAmount: { color: Colors.success, fontSize: FontSize.md, fontWeight: '700', marginTop: 4 },

  // Note input
  noteInput: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default AddMonthlySalaryScreen;
