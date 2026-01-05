import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../db'; // Importando nosso banco

// --- Configuração de Idioma (PT-BR) ---
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

// --- Componente Visual ---
// Recebe 'cycles' e 'logs' automaticamente do banco de dados via withObservables
const CalendarScreen = ({ cycles, logs }) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Lógica para transformar os dados do Banco no formato que o Calendário entende
  // O useMemo evita recálculos desnecessários deixando o app rápido
  const markedDates = useMemo(() => {
    const marks = {};

    // 1. Pintar os Ciclos (Menstruação)
    cycles.forEach(cycle => {
      const start = new Date(cycle.startDate);
      // Simulação: Vamos supor 5 dias de fluxo para visualização (no futuro será dinâmico)
      for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateString = d.toISOString().split('T')[0];
        
        marks[dateString] = { 
          color: '#FF6B6B', 
          textColor: 'white',
          startingDay: i === 0,
          endingDay: i === 4
        };
      }
    });

    // 2. Pintar a data selecionada pelo usuário
    if (selectedDate) {
      marks[selectedDate] = { 
        ...marks[selectedDate], // Mantém a cor de fundo se já tiver
        selected: true, 
        selectedColor: '#4ECDC4' 
      };
    }

    return marks;
  }, [cycles, selectedDate]);

  // Função para testar a gravação no banco
  const handleStartCycleToday = async () => {
    try {
      await database.write(async () => {
        await database.get('cycles').create(cycle => {
          cycle.startDate = new Date(); // Hoje
          cycle.status = 'current';
          cycle.userId = 'user_local'; // Placeholder
          cycle.endDatePredicted = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // +28 dias
        });
      });
      Alert.alert("Sucesso", "Ciclo iniciado hoje! O calendário deve atualizar sozinho.");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    Alert.alert("Data", `Selecionado: ${day.dateString}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Meu Ciclo</Text>
      
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          theme={{
            todayTextColor: '#00adf5',
            arrowColor: 'orange',
            monthTextColor: '#333',
            textMonthFontWeight: 'bold',
          }}
          onDayPress={onDayPress}
          markingType={'period'}
          markedDates={markedDates}
        />
      </View>

      {/* Botão de Teste para criar dados */}
      <TouchableOpacity style={styles.button} onPress={handleStartCycleToday}>
        <Text style={styles.buttonText}>🩸 Menstruei Hoje (Teste DB)</Text>
      </TouchableOpacity>

      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>🔴 Menstruação (Dados Reais do DB)</Text>
        <Text style={styles.legendText}>🔵 Selecionado</Text>
        <Text style={styles.debugText}>Registros no Banco: {cycles.length}</Text>
      </View>
    </SafeAreaView>
  );
};

// --- Estilização ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  calendarContainer: { borderRadius: 10, elevation: 4, backgroundColor: 'white', overflow: 'hidden' },
  legendContainer: { marginTop: 20, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  legendText: { fontSize: 14, marginBottom: 5, color: '#555' },
  debugText: { fontSize: 12, marginTop: 10, color: '#999', fontStyle: 'italic' },
  button: {
    backgroundColor: '#FF6B6B', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

// --- Conexão com o Banco de Dados (A Mágica) ---
// O withObservables conecta as tabelas às props do componente
const enhance = withObservables([], () => ({
  cycles: database.get('cycles').query(), // Observa TUDO da tabela cycles
  logs: database.get('daily_logs').query(), // Observa TUDO da tabela daily_logs
}));

export default enhance(CalendarScreen);