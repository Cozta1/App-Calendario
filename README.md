[DOCUMENTO DE PROJETO_ APP DE SINCRONIA DE CASAIS & SAÚDE FEMININA.pdf](https://github.com/user-attachments/files/24436150/DOCUMENTO.DE.PROJETO_.APP.DE.SINCRONIA.DE.CASAIS.SAUDE.FEMININA.pdf)
DOCUMENTO DE PROJETO: APP DE SINCRONIA DE CASAIS & SAÚDE FEMININA
Versão: 1.0 (Draft Inicial) Stack: React Native (Expo) | Offline-First (WatermelonDB) | AI Integration

1. Visão Geral do Produto
O aplicativo é uma solução móvel cross-platform (iOS/Android) focada em monitoramento de ciclo menstrual compartilhado e inteligência emocional para casais. O sistema opera sob uma arquitetura Offline-First, garantindo funcionalidade total sem internet e sincronização automática quando a conexão é restabelecida.
1.1. Objetivos Principais
Monitoramento: Rastrear o ciclo menstrual, sintomas e humor da parceira.
Conexão: Notificar o parceiro sobre necessidades emocionais e físicas em tempo real.
Assistência: Prover suporte via IA humanizada para ambos os usuários.

2. Arquitetura Técnica
2.1. Frontend (Mobile)
Framework: React Native com Expo (Managed Workflow).
Justificativa: Permite desenvolvimento e build para iOS utilizando ambiente Windows/Linux (via EAS Build).
Linguagem: TypeScript (Recomendado para tipagem forte dos dados de saúde).
Banco de Dados Local: WatermelonDB.
Justificativa: Alta performance, suporte nativo a sincronização JSON, baseado em SQLite.
Gerenciamento de Estado: Context API ou Zustand (integrado aos Observables do WatermelonDB).
2.2. Backend (API & Cloud)
Servidor: Spring Boot 3 (Java) ou Django (Python) - Escolha baseada na sua preferência.
Banco de Dados Remoto: PostgreSQL.
Autenticação: JWT (JSON Web Tokens) com Refresh Tokens.
AI Engine: Integração via API REST com Google Gemini ou OpenAI (GPT-4o-mini).
2.3. Estratégia Offline-First (Protocolo de Sync)
O app não consome a API diretamente para ler dados. Ele lê do WatermelonDB.
Escrita: O usuário salva um dado -> Grava no WatermelonDB (status: created) -> Tenta enviar para API em background.
Leitura: O app verifica conectividade -> Se Online, pede "Deltas" (mudanças desde o último sync) -> Atualiza local -> Exibe na tela.

3. Especificações Funcionais (Requisitos)
MÓDULO 1: Gestão de Identidade e Vínculo
RF001 - Cadastro de Usuário: Login social (Google/Apple) ou Email/Senha.
RF002 - Definição de Papel: Usuário deve selecionar se é "Acompanhante do Ciclo" (Ela) ou "Parceiro de Apoio" (Ele).
RF003 - Vínculo de Casal (Pairing):
Usuária gera um token alfanumérico (ex: LUV-2025).
Parceiro insere o token.
O sistema cria uma relationship_id que une os dois UUIDs.
MÓDULO 2: O Ciclo (Para Ela)
RF004 - Calendário Interativo: Visualização mensal com marcações coloridas para: Menstruação (Vermelho), Fértil/Ovulação (Verde), TPM (Roxo).
RF005 - Registro de Sintomas (Daily Log):
Seleção múltipla: Cólica (Leve/Média/Intensa), Dor de Cabeça, Acne, Inchaço.
Seleção de Humor: Feliz, Triste, Irritada, Ansiosa, Sensível.
RF006 - Botão de Necessidade (SOS):
Ao marcar "Cólica" ou "Tristeza", o app pergunta: "O que ajudaria agora?"
Opções: Comida (Doce/Salgado), Atenção (Abraço/Ouvir), Espaço (Sozinha), Medicamento.
Ação: Dispara notificação Push imediata para o parceiro.
RF007 - Algoritmo de Previsão:
Entrada: Data de início, Duração do fluxo.
Lógica: Recalcular a previsão dos próximos 3 meses baseando-se na média histórica dos últimos 6 ciclos.
MÓDULO 3: O Painel do Parceiro (Para Ele)
RF008 - Dashboard de "Clima Emocional":
Widget mostrando a fase atual e uma "Previsão do Tempo" metafórica (ex: "Nublado com chance de lágrimas" ou "Ensolarado").
RF009 - Calendário Sombra: Visualização do calendário dela, mas com focos em "Datas de Cuidado" e "Melhores Datas para Dates".
RF010 - Notificações Inteligentes:
Alerta Prévio: "A TPM deve começar em 2 dias. Que tal ser extra paciente?"
Alerta de Ação: "Ela solicitou 'Chocolate'. Status: Urgente."
MÓDULO 4: IA Assistente (Híbrida)
RF011 - Chat Contextual: Interface de chat estilo WhatsApp.
RF012 - Injeção de Contexto (RAG):
Toda mensagem enviada para a IA deve conter um cabeçalho oculto (System Prompt) com: Dia do Ciclo atual, Sintomas de hoje e Humor atual.
RF013 - Modo Offline (Cache de Dicas):
O sistema deve baixar diariamente um pacote de texto JSON contendo "Dica do dia" gerada pela IA, para ser exibida caso o usuário esteja sem internet.
RF014 - Privacidade da IA: Opção nas configurações para desativar a IA completamente ou ocultar o botão de chat.

4. Modelagem de Dados (Schema Local & Remoto)
Para o WatermelonDB e Backend, estas são as tabelas essenciais.
Tabela: Users
JSON
{
  "id": "uuid",
  "name": "string",
  "role": "enum(partner_a, partner_b)",
  "relationship_id": "uuid (fk)",
  "cycle_length_average": "integer (default 28)"
}

Tabela: Cycles (Registra os períodos históricos e previstos)
JSON
{
  "id": "uuid",
  "user_id": "uuid",
  "start_date": "timestamp",
  "end_date_actual": "timestamp (nullable)",
  "end_date_predicted": "timestamp",
  "status": "enum(current, past, predicted)"
}

Tabela: Daily_Logs (O coração do app)
JSON
{
  "id": "uuid",
  "user_id": "uuid",
  "date": "timestamp (index)",
  "mood_level": "integer (1-5)",
  "symptoms": "string (JSON array: ['colic', 'headache'])",
  "cravings": "string (text)",
  "partner_notes": "string (anotações dele sobre o dia dela)",
  "_status": "string (synced, created, updated)" // Controle do WatermelonDB
}


5. Protocolo de API & Sincronização
Endpoint: /api/v1/sync
Este é o endpoint único para garantir o funcionamento Offline-First.
Request (POST): Enviado pelo App quando recupera internet.
JSON
{
  "last_pulled_at": 1736005000, // Timestamp da última sync
  "changes": {
    "daily_logs": {
      "created": [{...}, {...}], // Novos logs feitos offline
      "updated": [{...}],        // Edições
      "deleted": ["uuid-123"]
    }
  }
}

Response: O que o servidor devolve.
JSON
{
  "timestamp": 1736090000, // Novo carimbo de tempo
  "changes": {
    "daily_logs": {
      "created": [{...}], // Logs que o parceiro criou enquanto você estava offline
      "updated": []
    }
  }
}


6. Requisitos Não-Funcionais (Qualidade)
Segurança: Dados sensíveis de saúde não devem trafegar em texto plano. Uso obrigatório de HTTPS.
Performance: O app deve abrir e carregar a tela inicial em menos de 1.5s (lendo do banco local).
Resiliência: Se a sincronização falhar (internet cair no meio), o app não pode travar. Deve tentar novamente em 5 minutos (backoff exponencial).
Armazenamento: O banco de dados local não deve exceder 50MB após 1 ano de uso (limpeza automática de logs antigos se necessário, mantendo apenas metadados de ciclo).

7. Próximos Passos (Roteiro de Desenvolvimento)
Fase 1 (Setup): npx create-expo-app, configuração do WatermelonDB e Schemas.
Fase 2 (Core Local): Implementar o Calendário e a lógica de criação de Logs (DailyLogs) funcionando apenas localmente.
Fase 3 (Backend & Sync): Criar a API (Spring/Django) e conectar o mecanismo de sincronização.
Fase 4 (Lógica de Ciclo): Implementar o algoritmo que recalcula as datas futuras.
Fase 5 (IA & Polimento): Integração com Gemini API e design final da interface.

