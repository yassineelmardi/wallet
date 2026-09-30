jest.mock('@react-native-async-storage/async-storage', () =>
  require('./src/testSupport/asyncStorageMock')
);

// Rendering React Native screens stays slow on the first test of each suite,
// especially when Jest runs with coverage instrumentation enabled.
jest.setTimeout(30000);