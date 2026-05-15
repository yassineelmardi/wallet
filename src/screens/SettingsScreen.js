import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const CURRENCIES = ['€', '$', '£', 'MAD', 'DZD', 'TND'];

const SettingsRow = ({ label, children }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {children}
  </View>
);

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, resetData } = useApp();

  const handleReset = () => {
    Alert.alert(t('common.confirm'), t('settings.resetConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirm'), style: 'destructive', onPress: resetData },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Langue */}
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langRow, settings.language === lang.code && styles.langRowActive]}
              onPress={() => updateSettings({ language: lang.code })}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, settings.language === lang.code && { color: Colors.primary }]}>
                {lang.label}
              </Text>
              {settings.language === lang.code && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Thème */}
        <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
        <View style={styles.card}>
          <SettingsRow label={t('settings.darkMode')}>
            <Switch
              value={settings.darkMode !== false}
              onValueChange={(val) => updateSettings({ darkMode: val })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#fff"
            />
          </SettingsRow>
        </View>

        {/* Devise */}
        <Text style={styles.sectionTitle}>{t('settings.currency')}</Text>
        <View style={styles.card}>
          <View style={styles.currencyGrid}>
            {CURRENCIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.currencyBtn, settings.currency === c && styles.currencyBtnActive]}
                onPress={() => updateSettings({ currency: c })}
              >
                <Text style={[styles.currencyTxt, settings.currency === c && { color: '#fff' }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reset */}
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('settings.version')}</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetTxt}>🗑  {t('settings.resetData')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.lg, marginTop: Spacing.md },
  sectionTitle: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: Spacing.xs, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  rowLabel: { color: Colors.textPrimary, fontSize: FontSize.md },
  rowValue: { color: Colors.textSecondary, fontSize: FontSize.md },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.sm,
  },
  langRowActive: { backgroundColor: Colors.cardAlt },
  langFlag: { fontSize: 22 },
  langLabel: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  checkmark: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  currencyBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencyBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  currencyTxt: { color: Colors.textSecondary, fontWeight: '600' },
  resetBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  resetTxt: { color: Colors.error, fontSize: FontSize.md, fontWeight: '600' },
});

export default SettingsScreen;
