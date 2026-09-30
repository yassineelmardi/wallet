import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormat } from '../hooks/useFormat';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Shadow, Spacing } from '../theme/colors';

const CATEGORY_COLORS = {
  food: '#FF6B6B', shopping: '#4F7EFF', transport: '#FFB740', leisure: '#A78BFA',
  health: '#00C896', rent: '#F97316', internet: '#06B6D4', insurance: '#84CC16',
  credit: '#EC4899', salary: '#22C55E', bonus: '#F59E0B', freelance: '#8B5CF6',
  other: '#8A9BB8',
};

const ExpenseCategoryChart = ({ data, emptyLabel }) => {
  const { t } = useTranslation();
  const { colors: C } = useTheme();
  const { money, percent } = useFormat();

  if (data.length === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: C.card }]}>
        <Text style={{ color: C.textMuted, fontSize: FontSize.sm }}>{emptyLabel}</Text>
      </View>
    );
  }

  const maxTotal = data[0].total;

  return (
    <View style={[styles.card, { backgroundColor: C.card }]}>
      {data.map((entry) => {
        const tone = CATEGORY_COLORS[entry.category] || C.primary;
        const width = maxTotal > 0 ? Math.round((entry.total / maxTotal) * 100) : 0;
        const label = t(`expenses.categories.${entry.category}`, entry.category);
        return (
          <View
            key={entry.category}
            style={styles.row}
            accessibilityRole="text"
            accessibilityLabel={`${label} : ${money(entry.total)}, ${percent(entry.share * 100)}`}
          >
            <Text style={[styles.name, { color: C.textSecondary }]} numberOfLines={1}>{label}</Text>
            <View style={[styles.track, { backgroundColor: C.border }]}>
              <View style={[styles.fill, { width: `${width}%`, backgroundColor: tone }]} />
            </View>
            <Text style={[styles.amount, { color: tone }]} numberOfLines={1}>
              {money(entry.total, { compact: true })}
            </Text>
            <Text style={[styles.share, { color: C.textMuted }]}>
              {percent(entry.share * 100)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  empty: { alignItems: 'center', justifyContent: 'center', minHeight: 100 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.xs },
  name: { fontSize: FontSize.xs, width: 74 },
  track: { flex: 1, height: 8, borderRadius: BorderRadius.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: BorderRadius.full },
  amount: { fontSize: FontSize.xs, fontWeight: '700', width: 56, textAlign: 'right' },
  share: { fontSize: FontSize.xs, width: 38, textAlign: 'right' },
});

export default ExpenseCategoryChart;
