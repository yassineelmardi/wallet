import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { DarkTheme } from '../theme/colors';

const LoadingScreen = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      <ActivityIndicator size="large" color={DarkTheme.primary} />
      <Text style={styles.text}>Wallet</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DarkTheme.background, alignItems: 'center', justifyContent: 'center' },
  card: { alignItems: 'center', gap: 16 },
  text: { color: DarkTheme.textMuted, fontSize: 13, letterSpacing: 2, fontWeight: '600', textTransform: 'uppercase' },
});

export default LoadingScreen;
