import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ─── Modal salaire global ────────────────────────────────────────────────────

const GlobalSalaryModal = ({ visible, onClose, onSave, initial, C, styles }) => {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  // Sync state each time modal opens
  useEffect(() => {
    if (visible) {
      setAmount(initial ? String(initial.amount) : '');
      setLabel(initial ? initial.label || '' : '');
    }
  }, [visible]);

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }
    onSave({ id: 'global', amount: String(val), label: label.trim() });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>
            {initial ? 'Modifier le salaire global' : 'Définir un salaire global'}
          </Text>

          <Text style={styles.inputLabel}>Montant mensuel</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="ex: 3000"
            placeholderTextColor={C.textMuted}
            keyboardType="numeric"
            autoFocus
          />

          <Text style={styles.inputLabel}>Note (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="ex: Salaire CDI"
            placeholderTextColor={C.textMuted}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnSaveText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Écran principal ─────────────────────────────────────────────────────────

const SalaryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    globalSalary,
    monthlySalaries,
    currentMonthSalary,
    income,
    settings,
    updateGlobalSalary,
    removeGlobalSalary,
    removeMonthlySalary,
    removeIncome,
  } = useApp();

  const [activeTab, setActiveTab] = useState('salary');
  const [globalModalVisible, setGlobalModalVisible] = useState(false);
  const { colors: C } = useTheme();
  const styles = makeStyles(C);
  const cur = settings.currency || '€';

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveGlobal = (salary) => {
    updateGlobalSalary(salary);
  };

  const handleDeleteGlobal = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Supprimer le salaire global ?')) removeGlobalSalary();
    } else {
      Alert.alert('Supprimer', 'Confirmer ?', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: removeGlobalSalary },
      ]);
    }
  };

  const handleDeleteMonthly = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Supprimer ce salaire mensuel ?')) removeMonthlySalary(id);
    } else {
      Alert.alert('Supprimer', 'Confirmer ?', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeMonthlySalary(id) },
      ]);
    }
  };

  const handleDeleteIncome = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Supprimer ce revenu ?')) removeIncome(id);
    } else {
      Alert.alert('Supprimer', 'Confirmer ?', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeIncome(id) },
      ]);
    }
  };

  // ─── Sorted monthly salaries (newest first) ─────────────────────────────────

  const sortedMonthly = [...monthlySalaries].sort(
    (a, b) => b.year - a.year || b.month - a.month
  );

  // ─── Badge du type de salaire ───────────────────────────────────────────────

  const typeBadgeColor =
    currentMonthSalary.type === 'monthly'
      ? C.accentYellow
      : currentMonthSalary.type === 'global'
      ? C.primary
      : C.textMuted;

  const typeBadgeLabel =
    currentMonthSalary.type === 'monthly'
      ? 'MENSUEL'
      : currentMonthSalary.type === 'global'
      ? 'GLOBAL'
      : 'NON DÉFINI';

  // ─── Section salaire global ──────────────────────────────────────────────────

  const renderGlobalSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Salaire global</Text>
      {globalSalary ? (
        <View style={styles.globalCard}>
          <View style={styles.globalLeft}>
            <Text style={styles.globalAmount}>
              {parseFloat(globalSalary.amount).toFixed(2)} {cur}
            </Text>
            {globalSalary.label ? (
              <Text style={styles.globalLabel}>{globalSalary.label}</Text>
            ) : null}
          </View>
          <View style={styles.globalActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setGlobalModalVisible(true)}
            >
              <Text style={styles.actionEdit}>✏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDeleteGlobal}>
              <Text style={styles.actionDelete}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addGlobalBtn}
          onPress={() => setGlobalModalVisible(true)}
        >
          <Text style={styles.addGlobalBtnText}>+ Définir un salaire global</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ─── Rendu item mensuel ──────────────────────────────────────────────────────

  const renderMonthlyItem = ({ item }) => {
    const isCurrentMonth =
      item.month === new Date().getMonth() && item.year === new Date().getFullYear();
    return (
      <View style={[styles.monthlyCard, isCurrentMonth && styles.monthlyCardActive]}>
        <View style={styles.monthlyLeft}>
          <Text style={styles.monthlyPeriod}>
            {MONTHS[item.month]} {item.year}
            {isCurrentMonth && (
              <Text style={styles.currentTag}> · ce mois</Text>
            )}
          </Text>
          {item.label ? (
            <Text style={styles.monthlyNote}>{item.label}</Text>
          ) : null}
        </View>
        <Text style={[styles.monthlyAmount, { color: C.success }]}>
          {parseFloat(item.amount).toFixed(2)} {cur}
        </Text>
        <View style={styles.monthlyActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddMonthlySalary', { editItem: item })}
            style={styles.actionBtn}
          >
            <Text style={styles.actionEdit}>✏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteMonthly(item.id)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionDelete}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── Rendu item revenu supplémentaire ────────────────────────────────────────

  const CATEGORY_ICONS = {
    salary: '💰',
    bonus: '🎁',
    freelance: '💻',
    other: '📌',
  };

  const renderIncomeItem = ({ item }) => (
    <View style={styles.incomeCard}>
      <View style={styles.incomeIconWrap}>
        <Text style={styles.incomeIcon}>{CATEGORY_ICONS[item.category] || '💰'}</Text>
      </View>
      <View style={styles.incomeLeft}>
        <Text style={styles.incomeCategory}>{item.category}</Text>
        {item.description ? (
          <Text style={styles.incomeDesc}>{item.description}</Text>
        ) : null}
      </View>
      <View style={styles.incomeRight}>
        <Text style={[styles.incomeAmount, { color: C.success }]}>
          +{parseFloat(item.amount).toFixed(2)} {cur}
        </Text>
        {item.date ? (
          <Text style={styles.incomeDate}>{item.date}</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => handleDeleteIncome(item.id)} style={styles.actionBtn}>
        <Text style={styles.actionDelete}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Salary tab ──────────────────────────────────────────────────────────────

  const renderSalaryListHeader = () => (
    <>
      {/* Active salary summary */}
      <LinearGradient colors={C.gradientPrimary} style={styles.header}>
        <Text style={styles.headerLabel}>Salaire actif ce mois-ci</Text>
        <Text style={styles.headerAmount}>
          {currentMonthSalary.amount.toFixed(2)} {cur}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: typeBadgeColor + '33' }]}>
          <Text style={[styles.typeBadgeText, { color: typeBadgeColor }]}>
            {typeBadgeLabel}
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'salary' && styles.tabActive]}
          onPress={() => setActiveTab('salary')}
        >
          <Text style={[styles.tabText, activeTab === 'salary' && styles.tabTextActive]}>
            Salaires
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'income' && styles.tabActive]}
          onPress={() => setActiveTab('income')}
        >
          <Text style={[styles.tabText, activeTab === 'income' && styles.tabTextActive]}>
            Revenus suppl.
          </Text>
        </TouchableOpacity>
      </View>

      {renderGlobalSection()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salaires mensuels</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {activeTab === 'salary' ? (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {renderSalaryListHeader()}
          {sortedMonthly.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>Aucun salaire mensuel défini</Text>
              <Text style={styles.emptyHint}>
                Utilisez le bouton + pour ajouter un salaire spécifique à un mois.
              </Text>
            </View>
          ) : (
            sortedMonthly.map((item) => (
              <React.Fragment key={item.id}>{renderMonthlyItem({ item })}</React.Fragment>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={income}
          ListHeaderComponent={
            <>
              <LinearGradient colors={C.gradientPrimary} style={styles.header}>
                <Text style={styles.headerLabel}>Salaire actif ce mois-ci</Text>
                <Text style={styles.headerAmount}>
                  {currentMonthSalary.amount.toFixed(2)} {cur}
                </Text>
                <View style={[styles.typeBadge, { backgroundColor: typeBadgeColor + '33' }]}>
                  <Text style={[styles.typeBadgeText, { color: typeBadgeColor }]}>
                    {typeBadgeLabel}
                  </Text>
                </View>
              </LinearGradient>

              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'salary' && styles.tabActive]}
                  onPress={() => setActiveTab('salary')}
                >
                  <Text style={[styles.tabText, activeTab === 'salary' && styles.tabTextActive]}>
                    Salaires
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'income' && styles.tabActive]}
                  onPress={() => setActiveTab('income')}
                >
                  <Text style={[styles.tabText, activeTab === 'income' && styles.tabTextActive]}>
                    Revenus suppl.
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Bonus, freelance &amp; autres revenus
                </Text>
                {income.length > 0 && (
                  <View style={styles.totalBadge}>
                    <Text style={styles.totalBadgeText}>
                      Total :{' '}
                      {income
                        .reduce((s, i) => s + parseFloat(i.amount || 0), 0)
                        .toFixed(2)}{' '}
                      {cur}
                    </Text>
                  </View>
                )}
              </View>
            </>
          }
          renderItem={renderIncomeItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>💼</Text>
              <Text style={styles.emptyText}>Aucun revenu supplémentaire</Text>
              <Text style={styles.emptyHint}>
                Ajoutez bonus, freelance ou autres revenus via le bouton +.
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB contextuel */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (activeTab === 'salary') {
            navigation.navigate('AddMonthlySalary', {});
          } else {
            navigation.navigate('AddIncome');
          }
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal salaire global */}
      <GlobalSalaryModal
        visible={globalModalVisible}
        onClose={() => setGlobalModalVisible(false)}
        onSave={handleSaveGlobal}
        initial={globalSalary}
        C={C}
        styles={styles}
      />
    </SafeAreaView>
  );
};

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  listContent: { flexGrow: 1 },

  // Header gradient
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  headerLabel: { color: '#ffffffcc', fontSize: FontSize.sm, marginBottom: Spacing.xs },
  headerAmount: { color: '#fff', fontSize: FontSize.xxxl, fontWeight: '800', marginBottom: Spacing.sm },
  typeBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1 },

  // Tabs
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: C.surface,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  // Section
  section: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { color: C.textSecondary, fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  totalBadge: {
    backgroundColor: C.success + '22',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  totalBadgeText: { color: C.success, fontSize: FontSize.xs, fontWeight: '700' },

  // Global salary card
  globalCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: C.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    ...Shadow.sm,
  },
  globalLeft: { flex: 1 },
  globalAmount: { color: C.textPrimary, fontSize: FontSize.xl, fontWeight: '800' },
  globalLabel: { color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  globalActions: { flexDirection: 'row', gap: Spacing.xs },

  // Add global button
  addGlobalBtn: {
    marginHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderRadius: BorderRadius.lg,
    borderStyle: 'dashed',
    padding: Spacing.md,
    alignItems: 'center',
  },
  addGlobalBtnText: { color: C.primary, fontSize: FontSize.sm, fontWeight: '600' },

  // Monthly card
  monthlyCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: C.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  monthlyCardActive: { borderWidth: 1, borderColor: C.accentYellow + '66' },
  monthlyLeft: { flex: 1 },
  monthlyPeriod: { color: C.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  currentTag: { color: C.accentYellow, fontSize: FontSize.xs },
  monthlyNote: { color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  monthlyAmount: { fontSize: FontSize.md, fontWeight: '700', marginRight: Spacing.sm },
  monthlyActions: { flexDirection: 'row', gap: 4 },

  // Income card
  incomeCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: C.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  incomeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  incomeIcon: { fontSize: 18 },
  incomeLeft: { flex: 1 },
  incomeCategory: { color: C.textPrimary, fontSize: FontSize.sm, fontWeight: '600', textTransform: 'capitalize' },
  incomeDesc: { color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  incomeRight: { alignItems: 'flex-end', marginRight: Spacing.sm },
  incomeAmount: { fontSize: FontSize.sm, fontWeight: '700' },
  incomeDate: { color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 },

  // Action buttons
  actionBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEdit: { fontSize: 14, color: C.primary },
  actionDelete: { fontSize: 14, color: C.error },

  // Empty states
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyText: { color: C.textSecondary, fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.xs },
  emptyHint: { color: C.textMuted, fontSize: FontSize.xs, textAlign: 'center' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    color: C.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputLabel: {
    color: C.textSecondary,
    fontSize: FontSize.xs,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: C.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: C.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  btnCancel: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  btnCancelText: { color: C.textSecondary, fontWeight: '600' },
  btnSave: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: C.primary,
    alignItems: 'center',
  },
  btnSaveText: { color: '#fff', fontWeight: '700' },
});

export default SalaryScreen;
