import { Model } from '@nozbe/watermelondb'
import { field, date, json, readonly } from '@nozbe/watermelondb/decorators'

// Função sanitizadora para o campo JSON (evita erros de parsing)
const sanitizeSymptoms = (raw) => {
  return Array.isArray(raw) ? raw : []
}

export default class DailyLog extends Model {
  static table = 'daily_logs'

  @field('user_id') userId
  @date('date') date
  @field('mood_level') moodLevel
  
  // O decorador @json faz o parse/stringify automático
  @json('symptoms_json', sanitizeSymptoms) symptoms
  
  @field('cravings') cravings
  @field('partner_notes') partnerNotes

  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}