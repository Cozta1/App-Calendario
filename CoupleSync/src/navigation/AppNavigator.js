import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones prontos do Expo

// Importando as telas
import HomeScreen from '../screens/Home';
import CalendarScreen from '../screens/Calendar';
import ChatScreen from '../screens/Chat';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Esconde o cabeçalho padrão feio
          tabBarActiveTintColor: '#e91e63', // Cor quando ativo (Rosa escuro)
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Chat AI') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Ciclo' }} />
        <Tab.Screen name="Chat AI" component={ChatScreen} options={{ title: 'Assistente' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}