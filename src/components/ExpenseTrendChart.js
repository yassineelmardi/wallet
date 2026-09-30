import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFormat } from '../hooks/useFormat';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Shadow, Spacing } from '../theme/colors';

const CHART_HEIGHT = 120;

const ExpenseTrendChart = ({ data, selectedMonth, onSelectMonth, emptyLabel }) => {
  const { colors: C } = useTheme();
  const { money } = useFormat();
  const maxValue = data.reduce((max, entry) => Math.max(max, entry.total), 0);

  if (maxValue === 0) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: C.card }]}>
        <Text style={{ color: C.textMuted, fontSize: FontSize.sm }}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: C.card }]}>
      <View style={styles.plot}>
        {data.map((entry) => {
          const active = entry.month === selectedMonth;
          const height = Math.max(2, Math.round((entry.total / maxValue) * CHART_HEIGHT));
          return (
            <TouchableOpacity
              key={entry.label + entry.month}
              style={styles.column}
              onPress={() => onSelectMonth && onSelectMonth(entry.month)}
              disabled={!onSelectMonth}
              accessibilityRole="button"
              accessibilityLabel={`${entry.label} : ${money(entry.total)}`}
            >
              <View style={styles.barZone}>
                <View
                  style={[
                    styles.bar,
                    { height, backgroundColor: active ? C.primary : C.primaryLight },
                  ]}
                />
              </View>
              <Text
                style={[styles.tick, { color: active ? C.primary : C.textMuted }]}
                numberOfLines={1}
              >
                {entry.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.scale, { color: C.textMuted }]}>
        max {money(maxValue, { compact: true })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm },
  empty: { alignItems: 'center', justifyContent: 'center', minHeight: 100 },
  plot: { flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT + 24 },
  column: { flex: 1, alignItems: 'center' },
  barZone: { height: CHART_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: '70%', borderRadius: BorderRadius.sm, minWidth: 6 },
  tick: { fontSize: 9, marginTop: 4 },
  scale: { fontSize: FontSize.xs, textAlign: 'right', marginTop: Spacing.xs },
});

export default ExpenseTrendChart;
