import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Cycle extends Model {
  static table = 'cycles'

  @field('user_id') userId
  @date('start_date') startDate
  @date('end_date_actual') endDateActual
  @date('end_date_predicted') endDatePredicted
  @field('status') status
  
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}