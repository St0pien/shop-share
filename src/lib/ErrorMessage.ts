export enum ErrorMessage {
  SPACE_NOT_FOUND = 'Could not find space with provided ID',
  CATEGORY_NOT_FOUND = 'Could not find category with provided ID',

  ACCESS_DENIED_MEMBER = 'You have no access to this resource',
  ACCESS_DENIED_ADMIN = 'You have no adminstrative access to this resource',
  DATABASE_ERROR = 'Failed to execute operation in database',
  INVALID_INVITATION = 'Invalid invitation token',
  ALREADY_A_MEMBER = 'You are already a member of this space'
}
