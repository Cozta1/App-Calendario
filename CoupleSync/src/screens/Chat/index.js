import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../db';

// --- CONFIGURAÇÃO DA IA ---
// 🔴 IMPORTANTE: Coloque sua chave aqui para testar
const API_KEY = "AIzaSyBn888iCvgFzCrpx_5Q4rp5JFkmrdzB4XY"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatScreen = ({ cycles, logs, user }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Mensagem de boas-vindas inicial
    setMessages([
      {
        _id: 1,
        text: 'Olá! Sou sua assistente. Como você e seu parceiro estão se sentindo hoje?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'CoupleAI',
          avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png', // Ícone fofo de robô/coração
        },
      },
    ]);
  }, []);

  // Função que gera o "Contexto" para a IA
  const getContextPrompt = () => {
    // Pegar o último ciclo
    const currentCycle = cycles.length > 0 ? cycles[cycles.length - 1] : null;
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    
    // Calcular dia do ciclo
    let cycleDayInfo = "Não há ciclo registrado.";
    if (currentCycle) {
        const start = new Date(currentCycle.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        cycleDayInfo = `A usuária está no dia ${diffDays} do ciclo.`;
    }

    let symptomsInfo = "Nenhum sintoma recente.";
    if (lastLog) {
        // Verifica se o log é de hoje ou recente
        symptomsInfo = `Último registro (${new Date(lastLog.date).toLocaleDateString()}): Humor nível ${lastLog.moodLevel}/5. Sintomas: ${JSON.stringify(lastLog.symptoms)}.`;
    }

    // O Prompt do Sistema (A "Personalidade")
    return `
      CONTEXTO ATUAL DO CASAL:
      - ${cycleDayInfo}
      - ${symptomsInfo}

      SUA PERSONA:
      Você é uma assistente especializada em relacionamentos e saúde da mulher. 
      Seu tom é acolhedor, empático e levemente informal (como uma amiga sábia).
      
      OBJETIVO:
      Responda à pergunta do usuário considerando o contexto acima.
      Se ela estiver com cólica ou TPM, seja extremamente carinhosa e sugira conforto.
      Se for o parceiro perguntando, dê dicas práticas de como ajudar.
      Seja breve (máximo 3 frases).
    `;
  };

  const onSend = useCallback(async (newMessages = []) => {
    // 1. Atualiza a UI com a mensagem do usuário
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const userMessage = newMessages[0].text;

    setIsTyping(true);

    try {
      // 2. Prepara o Prompt com Contexto + Pergunta
      const systemInstruction = getContextPrompt();
      const prompt = `${systemInstruction}\n\nUsuário diz: "${userMessage}"`;

      // 3. Chama o Gemini
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 4. Adiciona a resposta da IA na UI
      const aiMessage = {
        _id: Math.random().toString(),
        text: responseText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'CoupleAI',
          avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
    } catch (error) {
      console.error(error);
      Alert.alert("Erro na IA", "Verifique sua API Key ou conexão.");
    } finally {
      setIsTyping(false);
    }
  }, [cycles, logs]);

  // --- Customização Visual do Chat ---
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#FF6B6B' }, // Cor da mensagem do usuário
          left: { backgroundColor: '#f0f0f0' },   // Cor da mensagem da IA
        }}
        textStyle={{
          right: { color: '#fff' },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Cabeçalho Simples */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Assistente do Amor 🤖</Text>
            {isTyping && <Text style={styles.typing}>Digitando...</Text>}
        </View>

        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{ _id: 1 }} // ID 1 sou eu (usuário)
            renderBubble={renderBubble}
            placeholder="Pergunte algo..."
            alwaysShowSend
            scrollToBottom
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center', backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    typing: { fontSize: 12, color: '#FF6B6B', marginTop: 5 }
});

// Conecta ao banco para ler o contexto em tempo real
const enhance = withObservables([], () => ({
  cycles: database.get('cycles').query(),
  logs: database.get('daily_logs').query(),
}));

export default enhance(ChatScreen);