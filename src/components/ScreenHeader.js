import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme/colors';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const ScreenHeader = ({ title, onBack }) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.back, { backgroundColor: C.primarySurface }]}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        hitSlop={HIT_SLOP}
      >
        <Text style={[styles.arrow, { color: C.primary }]}>‹</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: C.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontSize: 26, fontWeight: '700', lineHeight: 30 },
  title: { flex: 1, fontSize: FontSize.xl, fontWeight: '800', marginLeft: Spacing.sm },
  spacer: { width: 40 },
});

export default ScreenHeader;
