import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme/colors';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const StepperSelector = ({ label, onPrevious, onNext, previousLabel, nextLabel, disabledNext }) => {
  const { colors: C } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: C.card, borderColor: C.border }]}>
      <TouchableOpacity
        onPress={onPrevious}
        style={[styles.button, { backgroundColor: C.primarySurface }]}
        accessibilityRole="button"
        accessibilityLabel={previousLabel}
        hitSlop={HIT_SLOP}
      >
        <Text style={[styles.arrow, { color: C.primary }]}>‹</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: C.textPrimary }]}>{label}</Text>

      <TouchableOpacity
        onPress={onNext}
        disabled={disabledNext}
        style={[
          styles.button,
          { backgroundColor: disabledNext ? C.cardAlt : C.primarySurface },
        ]}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        accessibilityState={{ disabled: Boolean(disabledNext) }}
        hitSlop={HIT_SLOP}
      >
        <Text style={[styles.arrow, { color: disabledNext ? C.textMuted : C.primary }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  label: { fontSize: FontSize.md, fontWeight: '700' },
});

export default StepperSelector;
