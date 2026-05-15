import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Composant principal de l'écran d'accueil
export default function HelloScreen() {

  // Affiche une alerte quand le bouton est pressé
  const handlePress = () => {
    Alert.alert(
      'Statut',
      'Application fonctionne',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Titre principal */}
        <Text style={styles.title}>Hello World</Text>

        {/* Bouton interactif */}
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Tester</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 48,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 12,
    shadowColor: '#4f6ef7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
