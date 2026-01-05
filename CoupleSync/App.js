import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// Import do Banco de Dados (Para garantir que ele inicie junto com o App)
import { database } from './src/db'; 
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function initDb() {
      try {
        // Um teste rápido para ver se o banco responde antes de abrir as telas
        await database.get('users').query().fetchCount();
        setIsDbReady(true);
      } catch (e) {
        console.error("Falha crítica no DB:", e);
      }
    }
    initDb();
  }, []);

  if (!isDbReady) {
    // Splash screen manual enquanto carrega o banco
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Carregando Dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}