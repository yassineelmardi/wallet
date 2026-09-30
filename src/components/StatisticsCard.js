import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Shadow, Spacing } from '../theme/colors';

const StatisticsCard = ({ label, value, hint, accent }) => {
  const { colors: C } = useTheme();
  const tone = accent || C.primary;
  return (
    <View
      style={[styles.card, { backgroundColor: C.card, borderTopColor: tone }]}
      accessibilityRole="summary"
      accessibilityLabel={`${label} : ${value}`}
    >
      <Text style={[styles.label, { color: C.textSecondary }]} numberOfLines={1}>{label}</Text>
      <Text style={[styles.value, { color: tone }]} numberOfLines={1}>{value}</Text>
      {hint ? (
        <Text style={[styles.hint, { color: C.textMuted }]} numberOfLines={1}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.lg,
    borderTopWidth: 3,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  label: { fontSize: FontSize.xs, marginBottom: Spacing.xs },
  value: { fontSize: FontSize.lg, fontWeight: '800' },
  hint: { fontSize: FontSize.xs, marginTop: 2 },
});

export default StatisticsCard;
