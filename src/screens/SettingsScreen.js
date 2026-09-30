import React from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, BorderRadius, FontSize, Shadow } from '../theme/colors';

const LANGUAGES = [
  { code: 'fr', label: 'Fran\u00e7ais', flag: '\ud83c\uddeb\ud83c\uddf7' },
  { code: 'en', label: 'English',   flag: '\ud83c\uddec\ud83c\udde7' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',   flag: '\ud83c\uddf8\ud83c\udde6' },
];

const CURRENCIES = ['\u20ac', '$', '\u00a3', 'MAD', 'DZD', 'TND'];

const THEMES = [
  { key: 'dark',  label: 'Sombre',    icon: '\ud83c\udf11', desc: 'Interface fond\u00e9e sur le noir' },
  { key: 'light', label: 'Clair',     icon: '\u2600\ufe0f',  desc: 'Interface fond\u00e9e sur le blanc' },
  { key: 'auto',  label: 'Automatique', icon: '\ud83d\udcf1', desc: 'Suit le th\u00e8me syst\u00e8me' },
];

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { settings, updateSettings, resetData, loadDemoData } = useApp();
  const { colors: C, themeMode, setTheme, isDark, paletteId, setPalette, palettes } = useTheme();

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('settings.resetConfirm'))) resetData();
    } else {
      Alert.alert(t('common.confirm'), t('settings.resetConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), style: 'destructive', onPress: resetData },
      ]);
    }
  };

  const handleLoadDemo = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('settings.demoConfirm'))) loadDemoData();
    } else {
      Alert.alert(t('common.confirm'), t('settings.demoConfirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => loadDemoData() },
      ]);
    }
  };

  const SectionTitle = ({ text }) => (
    <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: Spacing.md }}>
      {text}
    </Text>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
          <Text style={{ color: C.textPrimary, fontSize: FontSize.xl, fontWeight: '800' }}>{t('settings.title')}</Text>
          <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>Personnalisez votre app</Text>
        </View>

        {/* Theme picker */}
        <SectionTitle text="Thème" />
        <View style={[styles.card, { backgroundColor: C.card }]}>
          {THEMES.map((th, i) => {
            const active = themeMode === th.key;
            return (
              <TouchableOpacity
                key={th.key}
                onPress={() => setTheme(th.key)}
                style={[
                  styles.themeRow,
                  active && { backgroundColor: C.primarySurface },
                  i < THEMES.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.borderLight },
                ]}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 22, marginRight: Spacing.sm }}>{th.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: active ? C.primary : C.textPrimary, fontWeight: '700', fontSize: FontSize.md }}>{th.label}</Text>
                  <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 1 }}>{th.desc}</Text>
                </View>
                {active && (
                  <View style={[styles.activeDot, { backgroundColor: C.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Palette picker */}
        <SectionTitle text="Palette" />
        <View style={[styles.card, { backgroundColor: C.card }]}>
          {Object.values(palettes).map((palette, i) => {
            const active = paletteId === palette.id;
            const swatch = palette[isDark ? 'dark' : 'light'];
            return (
              <TouchableOpacity
                key={palette.id}
                onPress={() => setPalette(palette.id)}
                style={[
                  styles.themeRow,
                  active && { backgroundColor: C.primarySurface },
                  i < Object.keys(palettes).length - 1 && { borderBottomWidth: 1, borderBottomColor: C.borderLight },
                ]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Palette ${palette.label}`}
              >
                <Text style={{ fontSize: 22, marginRight: Spacing.sm }}>{palette.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: active ? C.primary : C.textPrimary, fontWeight: '700', fontSize: FontSize.md }}>{palette.label}</Text>
                  <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 1 }}>{palette.desc}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4, marginRight: Spacing.sm }}>
                  {[swatch.primary, swatch.success, swatch.accentWarn].map((col, index) => (
                    <View key={`${palette.id}-${index}`} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: col }} />
                  ))}
                </View>
                {active && (
                  <View style={[styles.activeDot, { backgroundColor: C.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preview */}
        <View style={[styles.previewCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <Text style={{ color: C.textMuted, fontSize: FontSize.xs, fontWeight: '600', marginBottom: Spacing.sm }}>APERÇU DU THÈME ACTIF</Text>
          <View style={[styles.previewInner, { backgroundColor: C.background }]}>
            <View style={[styles.previewHero, { backgroundColor: C.primary }]}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: FontSize.sm }}>Solde du mois</Text>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: FontSize.xl }}>+2 500 {settings.currency || '\u20ac'}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: Spacing.sm, gap: Spacing.xs }}>
              {[C.success, C.accentYellow, C.accentWarn].map((col, i) => (
                <View key={i} style={{ flex: 1, height: 28, borderRadius: BorderRadius.sm, backgroundColor: col + '33', borderLeftWidth: 3, borderLeftColor: col }} />
              ))}
            </View>
          </View>
        </View>

        {/* Language */}
        <SectionTitle text={t('settings.language')} />
        <View style={[styles.card, { backgroundColor: C.card }]}>
          {LANGUAGES.map((lang, i) => {
            const active = settings.language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.row,
                  active && { backgroundColor: C.primarySurface },
                  i < LANGUAGES.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.borderLight },
                ]}
                onPress={() => updateSettings({ language: lang.code })}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 22, marginRight: Spacing.sm }}>{lang.flag}</Text>
                <Text style={[styles.rowText, { color: active ? C.primary : C.textPrimary, flex: 1 }]}>{lang.label}</Text>
                {active && <Text style={{ color: C.primary, fontWeight: '800' }}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Currency */}
        <SectionTitle text={t('settings.currency')} />
        <View style={[styles.card, { backgroundColor: C.card }]}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
            {CURRENCIES.map((curr) => {
              const active = settings.currency === curr;
              return (
                <TouchableOpacity
                  key={curr}
                  style={{ paddingVertical: 8, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.full, backgroundColor: active ? C.primary : C.cardAlt, borderWidth: 1, borderColor: active ? C.primary : C.border }}
                  onPress={() => updateSettings({ currency: curr })}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: active ? '#fff' : C.textSecondary, fontWeight: '700', fontSize: FontSize.sm }}>{curr}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* About */}
        <SectionTitle text={t('settings.about')} />
        <View style={[styles.card, { backgroundColor: C.card }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: C.borderLight }]}>
            <Text style={[styles.rowText, { color: C.textPrimary, flex: 1 }]}>{t('settings.version')}</Text>
            <Text style={{ color: C.textMuted }}>1.0.0</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: C.textPrimary, flex: 1 }]}>Thème</Text>
            <Text style={{ color: C.textMuted }}>{isDark ? 'Sombre' : 'Clair'}</Text>
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={[styles.resetBtn, { backgroundColor: C.card, borderColor: C.error }]}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <Text style={{ color: C.error, fontSize: FontSize.md, fontWeight: '700' }}>🗑  {t('settings.resetData')}</Text>
        </TouchableOpacity>

        {__DEV__ ? (
          <>
            <SectionTitle text={t('settings.testMode')} />
            <View style={[styles.card, { backgroundColor: C.card }]}>
              <TouchableOpacity
                style={styles.row}
                onPress={handleLoadDemo}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t('settings.loadDemoData')}
              >
                <Text style={{ fontSize: 22, marginRight: Spacing.sm }}>🧪</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.textPrimary, fontWeight: '700', fontSize: FontSize.md }}>
                    {t('settings.loadDemoData')}
                  </Text>
                  <Text style={{ color: C.textMuted, fontSize: FontSize.xs, marginTop: 1 }}>
                    {t('settings.loadDemoHint')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { padding: Spacing.xl, paddingTop: Spacing.xl, borderBottomWidth: 1 },
  card: { marginHorizontal: Spacing.md, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  rowText: { fontSize: FontSize.md, fontWeight: '600' },
  themeRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  activeDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  previewCard: { marginHorizontal: Spacing.md, marginTop: Spacing.md, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, ...Shadow.sm },
  previewInner: { borderRadius: BorderRadius.md, overflow: 'hidden' },
  previewHero: { padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: 4 },
  resetBtn: { marginHorizontal: Spacing.md, marginTop: Spacing.xl, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
});

export default SettingsScreen;
