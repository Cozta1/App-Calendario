import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configuração para Português (Brasil)
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');

  // Simulação de dados do banco (Futuramente virá do WatermelonDB)
  const markedDates = {
    '2025-01-10': { startingDay: true, color: '#FF6B6B', textColor: 'white' },
    '2025-01-11': { color: '#FF6B6B', textColor: 'white' },
    '2025-01-12': { color: '#FF6B6B', textColor: 'white' },
    '2025-01-13': { endingDay: true, color: '#FF6B6B', textColor: 'white' },
    '2025-01-24': { marked: true, dotColor: 'purple', activeOpacity: 0 }, // Exemplo de TPM
    [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#4ECDC4' }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    // Aqui abriremos o modal de sintomas no futuro
    Alert.alert("Data Selecionada", `Você tocou no dia: ${day.day}/${day.month}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Meu Ciclo</Text>
      
      <View style={styles.calendarContainer}>
        <Calendar
          // Estilo básico
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            monthTextColor: 'blue',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
          // Funcionalidades
          onDayPress={onDayPress}
          markingType={'period'} // Permite faixas coloridas (início ao fim)
          markedDates={markedDates}
          enableSwipeMonths={true}
        />
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>🔴 Menstruação</Text>
        <Text style={styles.legendText}>🟣 Previsão TPM</Text>
        <Text style={styles.legendText}>🔵 Selecionado</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
    textAlign: 'center'
  },
  calendarContainer: {
    borderRadius: 10,
    elevation: 4, // Sombra no Android
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  calendar: {
    marginBottom: 10,
  },
  legendContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  legendText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555'
  }
});