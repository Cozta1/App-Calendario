import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { database } from '../db';
import { Q } from '@nozbe/watermelondb';

export default function SymptomModal({ visible, date, onClose, onSave }) {
  const [mood, setMood] = useState(3); // 1 a 5
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [cravings, setCravings] = useState('');
  const [existingLog, setExistingLog] = useState(null);

  // Lista de sintomas possíveis
  const SYMPTOMS_LIST = ['Cólica Leve', 'Cólica Forte', 'Dor de Cabeça', 'Espinhas', 'Inchaço', 'Cansaço'];

  // Carregar dados se já existirem para esse dia
  useEffect(() => {
    if (visible && date) {
      loadLogForDate();
    }
  }, [visible, date]);

  const loadLogForDate = async () => {
    // Busca no banco se já tem log para essa data exata
    const logs = await database.get('daily_logs').query(
      Q.where('date', new Date(date).getTime()) // WatermelonDB busca por timestamp exato ou range
      // Nota: Para simplificar, estamos assumindo que 'date' vem como string YYYY-MM-DD
      // Na prática real, precisaríamos filtrar pelo range do dia (00:00 até 23:59), mas faremos simplificado agora.
    ).fetch();

    // Como o timestamp exato é difícil de bater, vamos usar uma lógica de busca mais robusta na V2.
    // Por enquanto, resetamos o form.
    setExistingLog(null);
    setMood(3);
    setSelectedSymptoms([]);
    setCravings('');
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSave = async () => {
    try {
      await database.write(async () => {
        // Criar novo log
        await database.get('daily_logs').create(log => {
          log.date = new Date(date); // Salva a data selecionada
          log.moodLevel = mood;
          log.symptoms = selectedSymptoms; // O Decorator @json vai cuidar de virar string
          log.cravings = cravings;
          log.userId = 'user_local';
        });
      });
      Alert.alert("Registrado", "Sintomas salvos com sucesso!");
      onSave(); // Avisa o pai para atualizar
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>📅 {date}</Text>
          
          <ScrollView>
            {/* Seção Humor */}
            <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
            <View style={styles.moodContainer}>
              {[1, 2, 3, 4, 5].map(level => (
                <TouchableOpacity 
                  key={level} 
                  style={[styles.moodButton, mood === level && styles.moodSelected]}
                  onPress={() => setMood(level)}
                >
                  <Text style={styles.emoji}>{['😭', '😢', '😐', '🙂', '😁'][level-1]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Seção Sintomas */}
            <Text style={styles.sectionTitle}>Sintomas Físicos</Text>
            <View style={styles.tagsContainer}>
              {SYMPTOMS_LIST.map(sym => (
                <TouchableOpacity
                  key={sym}
                  style={[styles.tag, selectedSymptoms.includes(sym) && styles.tagSelected]}
                  onPress={() => toggleSymptom(sym)}
                >
                  <Text style={[styles.tagText, selectedSymptoms.includes(sym) && styles.tagTextSelected]}>
                    {sym}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Seção Desejos */}
            <Text style={styles.sectionTitle}>Desejos ou Necessidades</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Chocolate, Abraço, Remédio..."
              value={cravings}
              onChangeText={setCravings}
            />
          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnTextSave}>Salvar Registro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 10, color: '#666' },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  moodButton: { padding: 10, borderRadius: 30, backgroundColor: '#f0f0f0' },
  moodSelected: { backgroundColor: '#b3e5fc', borderWidth: 2, borderColor: '#039be5' },
  emoji: { fontSize: 24 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8 },
  tagSelected: { backgroundColor: '#ffccbc' },
  tagText: { color: '#333' },
  tagTextSelected: { color: '#bf360c', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, height: 50, marginBottom: 20 },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnCancel: { padding: 15 },
  btnSave: { backgroundColor: '#4ECDC4', padding: 15, borderRadius: 10, flex: 1, alignItems: 'center', marginLeft: 10 },
  btnTextCancel: { color: 'red' },
  btnTextSave: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});