export enum ErrorMessage {
  SPACE_NOT_FOUND = 'Could not find space with provided ID',
  CATEGORY_NOT_FOUND = 'Could not find category with provided ID',
  ITEM_NOT_FOUND = 'Could not find item with provided ID',
  LIST_NOT_FOUND = 'Could not find list with provided ID',

  ACCESS_DENIED_ADMIN = 'You have no adminstrative access to this resource',
  DATABASE_ERROR = 'Failed to execute operation in database',
  INVALID_INVITATION = 'Invalid invitation token',
  ALREADY_A_MEMBER = 'You are already a member of this space',
  SELF_KICKOUT = "You can't kick out yourself"
}
