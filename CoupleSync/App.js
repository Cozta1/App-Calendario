import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { database } from './src/db'; // Importando nosso banco

export default function App() {
  const [dbStatus, setDbStatus] = useState('Iniciando...');

  useEffect(() => {
    async function checkDb() {
      try {
        // Tente acessar uma coleção para ver se o banco montou
        const usersCount = await database.get('users').query().fetchCount();
        setDbStatus(`Banco Online! Usuários encontrados: ${usersCount}`);
      } catch (error) {
        setDbStatus(`Erro no Banco: ${error.message}`);
        console.error(error);
      }
    }

    checkDb();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoupleSync Debug</Text>
      <Text style={styles.status}>{dbStatus}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: 'blue',
  }
});