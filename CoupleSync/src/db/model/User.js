import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  @field('name') name
  @field('role') role
  @field('relationship_id') relationshipId
  @field('cycle_length_average') cycleLengthAverage
  
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}