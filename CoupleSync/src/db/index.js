import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './schema'
import User from './model/User'
import Cycle from './model/Cycle'
import DailyLog from './model/DailyLog'

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: false, // <--- MUDANÇA AQUI: Desativamos o JSI para rodar no Expo Go
  onSetUpError: error => {
    console.error("Erro ao carregar banco de dados:", error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Cycle,
    DailyLog,
  ],
})