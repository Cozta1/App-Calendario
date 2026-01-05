import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1, // Se alterar o schema no futuro, incremente este número
  tables: [
    // Tabela de Usuários (Você e Ela)
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'role', type: 'string' }, // 'partner_a' (ela) ou 'partner_b' (ele)
        { name: 'relationship_id', type: 'string', isOptional: true },
        { name: 'cycle_length_average', type: 'number' }, // Média do ciclo (ex: 28)
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    // Tabela de Ciclos (Histórico e Previsão)
    tableSchema({
      name: 'cycles',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'start_date', type: 'number' }, // Datas sempre em Timestamp
        { name: 'end_date_actual', type: 'number', isOptional: true },
        { name: 'end_date_predicted', type: 'number' },
        { name: 'status', type: 'string' }, // 'current', 'past', 'predicted'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    // Tabela de Logs Diários (Sintomas, Humor, Notas)
    tableSchema({
      name: 'daily_logs',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'mood_level', type: 'number' }, // 1 a 5
        { name: 'symptoms_json', type: 'string' }, // Vamos salvar o array como JSON string
        { name: 'cravings', type: 'string', isOptional: true },
        { name: 'partner_notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})