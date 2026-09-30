import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Shadow, Spacing } from '../theme/colors';

const formatDelta = (delta) => `${delta > 0 ? '+' : ''}${delta.toFixed(1)} %`;

const ComparisonCard = ({ label, currentLabel, previousLabel, current, previous, delta, currency, lowerIsBetter }) => {
  const { colors: C } = useTheme();
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta);
  const improving = hasDelta && (lowerIsBetter ? delta < 0 : delta > 0);
  const tone = !hasDelta || delta === 0 ? C.textMuted : improving ? C.success : C.error;

  return (
    <View style={[styles.card, { backgroundColor: C.card }]}>
      <Text style={[styles.title, { color: C.textSecondary }]}>{label}</Text>

      <View style={styles.row}>
        <View style={styles.side}>
          <Text style={[styles.period, { color: C.textMuted }]} numberOfLines={1}>{currentLabel}</Text>
          <Text style={[styles.amount, { color: C.textPrimary }]} numberOfLines={1}>
            {current.toFixed(2)} {currency}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: tone + '22' }]}>
          <Text style={[styles.badgeText, { color: tone }]}>
            {hasDelta ? formatDelta(delta) : '—'}
          </Text>
        </View>

        <View style={[styles.side, styles.sideRight]}>
          <Text style={[styles.period, { color: C.textMuted }]} numberOfLines={1}>{previousLabel}</Text>
          <Text style={[styles.amount, { color: C.textSecondary }]} numberOfLines={1}>
            {previous.toFixed(2)} {currency}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  side: { flex: 1 },
  sideRight: { alignItems: 'flex-end' },
  period: { fontSize: FontSize.xs, marginBottom: 2 },
  amount: { fontSize: FontSize.md, fontWeight: '700' },
  badge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginHorizontal: Spacing.sm,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: '800' },
});

export default ComparisonCard;
