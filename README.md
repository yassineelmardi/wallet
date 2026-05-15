# HelloWorldApp — React Native + Expo

Application mobile minimaliste compatible **Android** et **iOS**.

---

## Structure du projet

```
mobile-app/
├── App.js                  # Point d'entrée
├── app.json                # Configuration Expo
├── package.json            # Dépendances
├── babel.config.js         # Config Babel
├── components/
│   └── HelloScreen.js      # Écran principal
└── assets/                 # Icônes et splash screen
```

---

## Prérequis

### 1. Installer Node.js
Télécharger depuis https://nodejs.org (version LTS recommandée).

### 2. Installer Expo CLI
```bash
npm install -g expo-cli
```

---

## Installation du projet

```bash
# Cloner ou copier le dossier, puis :
cd mobile-app
npm install
```

---

## Lancer l'application

### Démarrer le serveur Expo
```bash
npm start
# ou
npx expo start
```

Un QR code s'affiche dans le terminal.

---

## Tester sur Android

### Option A — Émulateur Android (Android Studio)
1. Installer [Android Studio](https://developer.android.com/studio)
2. Créer un AVD (Android Virtual Device) via AVD Manager
3. Lancer l'émulateur
4. Exécuter :
```bash
npm run android
# ou
npx expo start --android
```

### Option B — Vrai téléphone Android
1. Installer **Expo Go** sur le téléphone :  
   https://play.google.com/store/apps/details?id=host.exp.exponent
2. Scanner le QR code affiché dans le terminal avec Expo Go

---

## Tester sur iPhone / iOS

### Option A — Simulateur iOS (macOS uniquement)
> Nécessite un Mac avec Xcode installé.
```bash
npm run ios
# ou
npx expo start --ios
```

### Option B — Vrai iPhone
1. Installer **Expo Go** sur l'iPhone :  
   https://apps.apple.com/app/expo-go/id982107779
2. Scanner le QR code affiché dans le terminal avec l'app Appareil photo ou Expo Go

---

## Fonctionnalités

| Élément | Description |
|---|---|
| Texte centré | "Hello World" affiché en grand au centre |
| Bouton "Tester" | Bouton bleu moderne |
| Alerte au clic | Affiche "Application fonctionne" |

---

## Bonnes pratiques appliquées

- Composants séparés dans `components/`
- `StyleSheet.create()` pour des styles optimisés
- `SafeAreaView` pour respecter les encoches iPhone/Android
- `TouchableOpacity` avec retour visuel au toucher
- Aucune dépendance inutile
