import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormat } from '../hooks/useFormat';
import { useTheme } from '../theme/ThemeContext';
import { todayISO } from '../utils/format';
import { BorderRadius, FontSize, Spacing } from '../theme/colors';

const parseISO = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const DateField = ({ value, onChange, accessibilityLabel }) => {
  const { colors: C } = useTheme();
  const { date: formatDay } = useFormat();
  const [visible, setVisible] = useState(false);

  // Le web n'a pas de selecteur natif : l'input date HTML est plus fiable.
  if (Platform.OS === 'web') {
    return (
      <TextInput
        style={[styles.input, { backgroundColor: C.card, color: C.textPrimary, borderColor: C.border }]}
        value={value}
        onChangeText={onChange}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={C.textMuted}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.input, { backgroundColor: C.card, borderColor: C.border }]}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={{ color: C.textPrimary, fontSize: FontSize.md }}>{formatDay(value)}</Text>
      </TouchableOpacity>

      {visible ? (
        <DateTimePicker
          value={parseISO(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selected) => {
            setVisible(Platform.OS === 'ios');
            if (event.type !== 'dismissed' && selected) onChange(todayISO(selected));
          }}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
});

export default DateField;
