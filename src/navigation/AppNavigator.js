import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, BorderRadius, FontSize } from '../theme/colors';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddIncomeScreen from '../screens/AddIncomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddMonthlySalaryScreen from '../screens/AddMonthlySalaryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  dashboard: { active: '⬡', inactive: '⬡' },
  salary:    { active: '↑', inactive: '↑' },
  expenses:  { active: '↓', inactive: '↓' },
  stats:     { active: '◈', inactive: '◇' },
  settings:  { active: '⚙', inactive: '⚙' },
};

const TabIcon = ({ name, focused, color }) => (
  <Text style={{ fontSize: 18, color }}>{focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive}</Text>
);

const MainTabs = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.3 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: t('nav.dashboard'),
          tabBarIcon: ({ focused, color }) => <TabIcon name="dashboard" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Salary"
        component={SalaryScreen}
        options={{
          tabBarLabel: 'Revenus',
          tabBarIcon: ({ focused, color }) => <TabIcon name="salary" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarLabel: t('nav.expenses'),
          tabBarIcon: ({ focused, color }) => <TabIcon name="expenses" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: t('nav.stats'),
          tabBarIcon: ({ focused, color }) => <TabIcon name="stats" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('nav.settings'),
          tabBarIcon: ({ focused, color }) => <TabIcon name="settings" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="AddIncome"
          component={AddIncomeScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="AddMonthlySalary"
          component={AddMonthlySalaryScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
